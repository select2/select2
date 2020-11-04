import { Component, ComponentChild, h, h as createElement } from 'preact';
import * as announce from './announce';
import { Dictionary, getDictionary } from './dictionary';
import { DeepPartial, Key, merge, uuid } from './util';
const forceImportOfH = h;

type ToString = (item: any) => string;

export type DataItemRenderer = string | ((item: any, h: typeof createElement) => ComponentChild);

export type QueryFunction = (search: string, page: number, token: string) => Promise<QueryResult>;

export interface DataItem {
    id: any;
    text: string;
}

export interface QueryResult {
    values: DataItem[];
    more: boolean;
    token: string;
}

export interface ResultListState {
    results: any[];
    token: string;
    active: number;
    page: number;

    showMinimumCharactersError: boolean;
    showMaximumValuesSelectedError: boolean;
    showNoSearchResultsFound: boolean;
    showLoadMoreResults: boolean;
}
export interface State {
    search: string;
    results: ResultListState;
    loading: boolean;
    open: boolean;
    focused: boolean;
}

export interface Props {
    containerStyle?: string;
    cssClass?: string;
    tabIndex?: number;
    valueContent?: DataItemRenderer;
    resultContent?: DataItemRenderer;

    query: QueryFunction;
    quiet?: number;
    allowDuplicates?: boolean;
    minimumCharacters?: number;
    openOnFocus?: boolean;
    dictionary?: string | Dictionary;
}

function MarkupRenderer({ markup }) {
    return <div dangerouslySetInnerHTML={{ __html: markup }}> </div>;
}

export const DEFAULT_PROPS: Partial<Props> = {
    allowDuplicates: false,
    minimumCharacters: 0,
    quiet: 50,
    tabIndex: 0
};

export abstract class AbstractSelect<P extends Props, S extends State> extends Component<P, S> {
    private searchTimeout: number | undefined;
    protected namespace: string;

    constructor(props: P) {
        super(props);
        this.searchTimeout = undefined;
        this.namespace = uuid();
        // @ts-ignore
        this.state = {
            focused: false,
            loading: false,
            open: false,
            results: {
                active: -1,
                page: 0,
                results: undefined, // TODO rename to values
                token: null,

                showLoadMoreResults: false,
                showMaximumValuesSelectedError: false,
                showMinimumCharactersError: false,
                showNoSearchResultsFound: false
            },
            search: ''
        };
    }

    public getItemId = (item: DataItem): string => {
        return item.id;
    };

    public getItemLabel = (item: DataItem): string => {
        const label = item.text;
        return item.text;
    };

    public renderValue = (item: DataItem): ComponentChild => {
        return this.renderItem(item, 'valueContent');
    };

    public renderResult = (item: DataItem): ComponentChild => {
        return this.renderItem(item, 'resultContent');
    };

    private renderItem = (item: DataItem, rendererName: keyof Props & DataItemRenderer): ComponentChild => {
        const renderer = this.props[rendererName] as DataItemRenderer;
        if (renderer) {
            if (typeof renderer === 'function') {
                const render = renderer(item, createElement);
                if (typeof render === 'string') {
                    return <MarkupRenderer markup={render} />;
                } else {
                    return render;
                }
            } else {
                return <MarkupRenderer markup={item[renderer]} />;
            }
        } else {
            return <MarkupRenderer markup={this.getItemLabel(item)} />;
        }
    };

    get dictionary(): Dictionary {
        const dict = this.props.dictionary;
        if (dict) {
            if (typeof dict === 'string') {
                return getDictionary(dict);
            } else {
                return dict as Dictionary;
            }
        } else {
            return getDictionary();
        }
    }

    protected updateState(update: DeepPartial<S> | Array<DeepPartial<S>>, callback?: () => void) {
        const state = merge(this.state, Array.isArray(update) ? update : [update]);
        this.setState(state, callback);
    }

    public search = (query, selectedValues, start?: DeepPartial<S>, callback?: () => void) => {
        const dictionary = this.dictionary;
        const { minimumCharacters, allowDuplicates, quiet, query: queryFunc } = this.props;

        const current = this.state.results;

        const minimumCharactersReached = query.length >= (minimumCharacters || 0);
        const maximumValuesSelected = this.isMaximumNumberOfValuesSelected();
        const error = !minimumCharactersReached || maximumValuesSelected;

        const token = !error ? uuid() : undefined;
        const control = this;

        this.updateState(
            // @ts-ignore
            [
                start,
                {
                    loading: !error,
                    results: {
                        active: -1,
                        page: 0,
                        results: undefined,
                        showLoadMoreResults: false,
                        showMaximumValuesSelectedError: maximumValuesSelected,
                        showMinimumCharactersError: !minimumCharactersReached && !maximumValuesSelected,
                        showNoSearchResultsFound: false,
                        token
                    },
                    search: query
                }
            ],
            () => {
                if (callback) {
                    callback();
                }

                if (!minimumCharactersReached) {
                    // todo - throttle this announcement?
                    announce.politely(dictionary.minimumCharactersMessage(query.length, minimumCharacters!));
                    return;
                }

                if (maximumValuesSelected) {
                    announce.politely(dictionary.maximumValuesSelectedMessage());
                    return;
                }

                // todo - throttle this announcement?
                // announce.politely(dictionary.searchResultsLoading());

                const execute = async () => {
                    try {
                        const result = await queryFunc(query, 0, token!);
                        if (result.token !== control.state.results.token) {
                            // this is a stale result, ignore
                            return;
                        }

                        let values = result.values || [];
                        if (!allowDuplicates && values.length > 0 && selectedValues.length > 0) {
                            const ids = new Set<string>();
                            selectedValues.forEach(v => ids.add(control.getItemId(v)));
                            values = values.filter(v => !ids.has(control.getItemId(v)));
                        }

                        if (values.length < 1) {
                            announce.politely(dictionary.noSearchResults());
                        }

                        // @ts-ignore
                        control.updateState({
                            loading: false,
                            results: {
                                active: values.length > 0 ? 0 : -1,
                                page: 0,
                                results: values,
                                showLoadMoreResults: result.more,
                                showNoSearchResultsFound: values.length < 1
                            }
                        });
                    } catch (e) {
                        // @ts-ignore
                        control.updateState({ loading: false });
                    }
                };

                if (quiet && quiet > 0) {
                    if (control.searchTimeout) {
                        window.clearTimeout(control.searchTimeout);
                    }
                    control.searchTimeout = window.setTimeout(execute, quiet);
                } else {
                    execute();
                }
            }
        );
    };

    public loadMore() {
        const {
            loading,
            search: query,
            results: { page }
        } = this.state;
        const dict = this.dictionary;
        const { query: queryFunc } = this.props;
        const control = this;

        if (loading) {
            return;
        }

        const token = uuid();
        const nextPage = page + 1;

        this.updateState(
            // @ts-ignore
            {
                loading: true,
                results: {
                    token
                }
            },
            async () => {
                // TODO throttle?
                // announce.politely(dict.searchResultsLoading());

                try {
                    const result = await queryFunc(query, nextPage, token);

                    const current = control.state.results;

                    if (result.token !== current.token) {
                        // this is a stale result, ignore
                        return;
                    }

                    if (result.values && result.values.length > 0) {
                        // @ts-ignore
                        control.updateState({
                            loading: false,
                            results: {
                                page: nextPage,
                                results: current.results.concat(result.values),
                                showLoadMoreResults: result.more
                            }
                        });
                    } else {
                        announce.politely(dict.noSearchResults());
                        // @ts-ignore
                        control.updateState({
                            loading: false,
                            results: {
                                showLoadMoreResults: false
                            }
                        });
                    }
                } catch (e) {
                    // @ts-ignore
                    control.updateState({ loading: false });
                }
            }
        );
    }

    protected handleResultNavigationKeyDown(event: KeyboardEvent): boolean {
        switch (event.key) {
            case Key.ArrowUp:
            case Key.Up:
                this.selectPreviousSearchResult();
                event.preventDefault();
                return true;
            case Key.ArrowDown:
            case Key.Down:
                this.selectNextSearchResult();
                event.preventDefault();
                return true;
        }
        return false;
    }

    protected selectNextSearchResult() {
        const { active, results } = this.state.results;
        if (results && active < results.length - 1) {
            // @ts-ignore
            this.updateState({ results: { active: active + 1 } });
        }
    }

    protected selectPreviousSearchResult() {
        const { active } = this.state.results;
        if (active > 0) {
            // @ts-ignore
            this.updateState({ results: { active: active - 1 } });
        }
    }

    protected getSelectedSearchResult() {
        const { results, active } = this.state.results;
        return results[active];
    }

    protected selectSearchResult(index: number) {
        const { active } = this.state.results;
        if (active !== index) {
            // @ts-ignore
            this.updateState({ results: { active: index } });
        }
    }

    protected hasSearchResults() {
        const results = this.state.results.results;
        return results && results.length > 0;
    }

    protected isMaximumNumberOfValuesSelected() {
        return false;
    }
}
