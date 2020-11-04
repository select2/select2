import { Component, ComponentChild, createRef, h, RefObject } from 'preact';
import { Dictionary } from './dictionary';
import { style } from './style';
import { calculateVerticalVisibility, cn } from './util';

const forceImportOfH = h;

// TODO if upon render loading is visible signal loadmore

interface Props {
    // TODO consistenly call search a query
    namespace: string;
    search: string;
    listboxDomId?: string;
    results: any[];
    token: string;
    active: number;
    page: number;
    loading: boolean;

    itemLabel: (item: any) => string;
    renderItem: (item: any) => ComponentChild;

    dictionary: Dictionary;
    minimumCharacters: number;

    showMinimumCharactersError: boolean;
    showNoSearchResultsFound: boolean;
    showLoadMoreResults: boolean;

    showMaximumValuesSelectedError: boolean;
    maximumValues: number;

    onResultClicked: (result: any, event: MouseEvent) => void;
    onMouseMove: (index: any, event: MouseEvent) => void;
    onLoadMore: () => void;
}

export class ResultList extends Component<Props> {
    private container: RefObject<HTMLDivElement>;
    private lastMouseClientX?: number;
    private lastMouseClientY?: number;
    private loadMore: RefObject<HTMLDivElement>;
    constructor(props) {
        super(props);
        this.container = createRef();
        this.loadMore = createRef();
    }

    private getResultDomId(index: number) {
        return this.props.namespace + index;
    }

    public render(props, state, context) {
        const { dictionary, minimumCharacters, showLoadMoreResults, results } = props;
        const query = this.props.search;

        const overrideError = props.showMaximumValuesSelectedError;

        return (
            <div class={style.body}>
                <div
                    ref={this.container}
                    onScroll={this.onScroll}
                    class={style.searchResults}
                    aria-busy={props.loading}
                >
                    {!overrideError && props.loading && (
                        <div class={cn(style.searchResultsLoading, style.searchResultsMessage)}>
                            {dictionary.searchResultsLoading()}
                        </div>
                    )}
                    {!overrideError && props.showNoSearchResultsFound && (
                        <div class={cn(style.noSearchResults, style.searchResultsMessage)}>
                            {dictionary.noSearchResults()}
                        </div>
                    )}
                    {!overrideError && props.showMinimumCharactersError && (
                        <div class={cn(style.searchResultsMinimumError, style.searchResultsMessage)}>
                            {dictionary.minimumCharactersMessage(query.length, minimumCharacters)}
                        </div>
                    )}
                    {props.showMaximumValuesSelectedError && (
                        <div class={cn(style.searchResultsMaximumSelectedError, style.searchResultsMessage)}>
                            {dictionary.maximumValuesSelectedMessage(props.maximumValues)}
                        </div>
                    )}
                    {!overrideError && results && results.length > 0 && (
                        <div
                            class={style.options}
                            role='listbox'
                            id={props.listboxDomId}
                            aria-activedescendant={props.active >= 0 ? this.getResultDomId(props.active) : undefined}
                        >
                            {results.map((result, index) => {
                                const label = props.itemLabel(result);
                                const render = props.renderItem(result);
                                const active = props.active === index;
                                const css = cn(style.item, {
                                    [style.active]: active
                                });
                                const id = this.getResultDomId(index);
                                return (
                                    <div
                                        id={id}
                                        class={css}
                                        role='option'
                                        onClick={this.onResultClicked(result)}
                                        onMouseMove={this.onMouseMove(index)}
                                        aria-posinset={index + 1}
                                        aria-setsize={showLoadMoreResults ? results.length + 1 : results.length}
                                        aria-selected={active}
                                        aria-label={label}
                                    >
                                        <div class={style.content}>{render}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {props.showLoadMoreResults && (
                        <div
                            ref={this.loadMore}
                            class={cn(style.searchResultsMinimumError, style.searchResultsMessage)}
                        >
                            {dictionary.searchResultsLoading()}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    private onResultClicked = (result: any) => (event: MouseEvent) => {
        this.props.onResultClicked(result, event);
    };

    private onMouseMove = (index: number) => (event: MouseEvent) => {
        if (this.lastMouseClientX === event.clientX && this.lastMouseClientY === event.clientY) {
            // the mouse did not move, the dropdown was scrolled instead, we do not change selected element because
            // it will be scrolled into view and mess with the scrolling of the results in the dropdown
            return;
        }
        this.lastMouseClientX = event.clientX;
        this.lastMouseClientY = event.clientY;

        this.props.onMouseMove(index, event);
    };

    private onScroll = (event: Event) => {
        if (!this.props.showLoadMoreResults) {
            return;
        }
        const more = this.loadMore.current!;
        const drop = this.container.current!;

        const visibility = calculateVerticalVisibility(drop, more);
        if (visibility !== 'hidden') {
            this.props.onLoadMore();
        }
    };

    public componentDidUpdate(prevProps: Props, prevState: Props) {
        const { active, results, showLoadMoreResults } = this.props;
        const { active: prevActive } = prevProps;

        if (active !== prevActive) {
            if (active >= 0 && results && results.length > 0 && active === results.length - 1 && showLoadMoreResults) {
                // last result is selected and load more is shown, make sure it is scrolled into view

                const drop = this.container.current!;
                const el = this.loadMore.current!;

                drop.scrollTop = el.offsetTop + el.offsetHeight - drop.clientHeight;

                // console.log("scrolling to see load more");//, setting scrolltop", drop, el, el.offsetTop - drop.clientHeight);
            } else if (active >= 0) {
                // make sure it is scrolled into view
                const id = this.getResultDomId(active);
                const el = document.getElementById(id);
                if (el != null) {
                    const drop = this.container!.current!;
                    const c = drop.getBoundingClientRect();
                    const e = el.getBoundingClientRect();

                    if (e.top < c.top && e.bottom <= c.bottom) {
                        const delta = c.top - e.top;
                        drop.scrollTop = drop.scrollTop - delta;
                    }

                    if (e.top >= c.top && e.bottom > c.bottom) {
                        const delta = e.bottom - c.bottom;
                        drop.scrollTop = drop.scrollTop + delta;
                    }
                }
            }
        }
    }
}
