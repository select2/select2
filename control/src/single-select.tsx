import { createRef, Fragment, h, RefObject } from 'preact';
import {
    AbstractSelect,
    DEFAULT_PROPS as ABSTRACT_DEFAULT_PROPS,
    Props as AbstractSelectProps,
    State as AbstractSelectState
} from './abstract-select';
import * as announce from './announce';
import { Dropdown } from './dropdown';
import { Remove, Toggle } from './icons';
import { ResultList } from './result-list';
import { style } from './style';
import { cn, DeepPartial, extend, Key, scope } from './util';

const forceImportOfH = h;

export interface Props extends AbstractSelectProps {
    value: any;
    label: string;
    comboboxLabel: string;
    onChange: (value: any) => void;
    allowClear?: boolean;
    placeholder?: string;
}

interface State extends AbstractSelectState {
    value: any;
}

const DEFAULT_PROPS = extend({}, ABSTRACT_DEFAULT_PROPS, { allowClear: false });

export class SingleSelect extends AbstractSelect<Props, State> {
    private containerRef: RefObject<HTMLElement>;
    private dropdownRef: RefObject<HTMLElement>;
    private bodyRef: RefObject<HTMLElement>;
    private searchRef: RefObject<HTMLInputElement>;
    private valueRef: RefObject<HTMLElement>;

    public static defaultProps = DEFAULT_PROPS;

    constructor(props) {
        super(props);

        this.searchRef = createRef();
        this.bodyRef = createRef();
        this.containerRef = createRef();
        this.dropdownRef = createRef();
        this.valueRef = createRef();

        this.state = extend(this.state, { value: this.props.value });
    }

    public componentWillMount() {
        announce.initialize();
    }

    public render(props, state) {
        const { minimumCharacters, tabIndex, label, allowClear, placeholder } = props;
        const { value, open, loading, focused, search, results } = state;

        const classes = cn(
            this.props.cssClass,
            style.control,
            style.single,
            { [style.open]: open },
            { [style.focused]: focused }
        );
        const resultsDomId = this.namespace + '-results';
        const optionDomId = this.namespace + '-val';
        const resultsNamespace = this.namespace + '-res-';
        const dictionary = this.dictionary;
        const showPlaceholder = !value && placeholder && placeholder.length > 0;
        const placeholderDomId = this.namespace + '-placeholder';
        return (
            <Fragment>
                <div
                    class={classes}
                    ref={this.containerRef}
                    onFocusCapture={this.onFocusIn}
                    onBlurCapture={this.onFocusOut}
                    tabIndex={-1}
                    onMouseDown={this.onContainerMouseDown}
                >
                    <div class={cn(style.body)} ref={this.bodyRef}>
                        <div
                            aria-label={label}
                            role='listbox'
                            aria-activedescendant={optionDomId}
                            aria-expanded='false'
                            class={cn(style.value)}
                            tabIndex={tabIndex}
                            ref={this.valueRef}
                            onKeyDown={this.onValueKeyDown}
                            aria-describedby={showPlaceholder ? placeholderDomId : undefined}
                        >
                            {value && (
                                <div
                                    class={style.item}
                                    role='option'
                                    aria-selected='true'
                                    aria-label={this.getItemLabel(value)}
                                    aria-setsize={-1}
                                    aria-posinset={-1}
                                    id={optionDomId}
                                >
                                    <div class={style.content}>{this.renderValue(value)}</div>
                                </div>
                            )}
                            {showPlaceholder && (
                                <div class={cn(style.placeholder)} id={placeholderDomId}>
                                    {placeholder}
                                </div>
                            )}
                        </div>
                        {scope(() => {
                            const disabled = !value;
                            const clazz = cn(style.remove, { [style.offscreen]: !allowClear });
                            return (
                                <button
                                    class={clazz}
                                    onClick={this.onClearClick}
                                    onFocus={this.onClearFocus}
                                    onMouseDown={this.onClearMouseDown}
                                    disabled={disabled}
                                    aria-disabled={disabled}
                                    title={dictionary.clearButtonTitle()}
                                    aria-label={dictionary.clearButtonTitle()}
                                    type='button'
                                >
                                    <span>
                                        <Remove width={20} height={20} />
                                    </span>
                                </button>
                            );
                        })}
                        <div className={style.toggle} aria-hidden={true} title={dictionary.expandButtonTitle()}>
                            <Toggle height={20} width={20} />
                        </div>
                    </div>
                </div>
                {open && (
                    <Dropdown
                        class={cn(style.dropdown, style.single, this.props.cssClass)}
                        onMouseDown={this.onDropdownMouseDown}
                        controlRef={this.containerRef}
                        dropdownRef={this.dropdownRef}
                        onFocusOut={this.onFocusOut}
                        onComponentDidMount={this.focusOnSearch}
                    >
                        <div>
                            <input
                                type='text'
                                ref={this.searchRef}
                                value={search}
                                class={cn(style.search)}
                                role='combobox'
                                aria-autocomplete='list'
                                aria-haspopup='true'
                                aria-owns={resultsDomId}
                                aria-controls={resultsDomId}
                                aria-expanded={open ? 'true' : 'false'}
                                aria-activedescendant={
                                    results.active >= 0 ? resultsNamespace + results.active : undefined
                                }
                                aria-busy={loading}
                                onInput={this.onSearchInput}
                                onKeyDown={this.onSearchKeyDown}
                                onFocus={this.onSearchFocus}
                            />
                            <ResultList
                                namespace={resultsNamespace}
                                minimumCharacters={minimumCharacters}
                                dictionary={this.dictionary}
                                itemLabel={this.getItemLabel}
                                renderItem={this.renderResult}
                                listboxDomId={resultsDomId}
                                search={search}
                                {...this.state.results}
                                loading={loading}
                                onResultClicked={this.onResultClicked}
                                onMouseMove={this.onResultMouseMove}
                                onLoadMore={this.onLoadMoreResults}
                            />
                        </div>
                    </Dropdown>
                )}
            </Fragment>
        );
    }

    public componentDidMount() {
        const css = this.props.containerStyle;
        if (css && css.length > 0) {
            this.containerRef.current!.setAttribute('style', css);
        }
    }

    private onLoadMoreResults = () => {
        this.loadMore();
    };

    public onFocusIn = (event: FocusEvent) => {
        this.updateState({ focused: true });

        const { openOnFocus } = this.props;
        const { open } = this.state;
        if (!open && openOnFocus && this.searchRef.current !== document.activeElement) {
            this.open();
        }
    };

    public onFocusOut = (event: FocusEvent) => {
        const receiver = event.relatedTarget as Node;
        const container = this.containerRef.current;
        const dropdown = this.dropdownRef.current;
        const search = this.searchRef.current;

        const focused =
            container.contains(receiver) ||
            (dropdown && (dropdown === receiver || dropdown.contains(receiver))) ||
            receiver === search;

        if (this.state.focused !== focused) {
            this.updateState({
                focused
            });
        }
        if (!focused) {
            this.closeIfOpen();
        }
    };

    public closeIfOpen() {
        if (this.state.open) {
            this.close();
        }
    }

    public close = (state?: DeepPartial<State>) => {
        const control = this;
        control.valueRef.current!.focus();
        this.updateState([
            state,
            {
                open: false,
                results: { results: null },
                search: ''
            }
        ]);
    };

    private getValueAsArray() {
        return this.state.value ? [this.state.value] : [];
    }

    private onContainerMouseDown = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        if (this.state.open) {
            this.close();
        } else {
            this.open();
        }
    };

    private open(query: string = '') {
        this.search(query, this.getValueAsArray(), { open: true });
    }

    private focusOnSearch = () => {
        this.searchRef.current.focus();
    };

    private onSearchFocus = (event: FocusEvent) => {
        this.updateState({ focused: true });
    };

    private onSearchInput = (event: Event) => {
        const value = (event.target as HTMLInputElement).value;
        this.search(value, this.getValueAsArray());
    };

    private onClearFocus = (event: FocusEvent) => {
        this.closeIfOpen();
    };

    private onClearClick = (event: Event) => {
        this.selectResult(undefined);
        event.preventDefault();
        event.stopPropagation();
    };

    private onClearMouseDown = (event: Event) => {
        event.stopPropagation();
        event.preventDefault();
    };

    public onSearchKeyDown = (event: KeyboardEvent) => {
        if (this.handleResultNavigationKeyDown(event)) {
            return;
        }

        const { open } = this.state;

        if (open && this.hasSearchResults) {
            switch (event.key) {
                case Key.Enter:
                    this.selectActiveResult();
                    event.preventDefault();
                    event.stopPropagation();
                    break;
                case Key.Escape:
                    this.close();
                    event.preventDefault();
                    event.stopPropagation();
                    break;
                case Key.Tab:
                    // TODO select on tab?
                    this.close();
                    event.preventDefault();
                    event.stopPropagation();
            }
        }
    };

    public selectActiveResult = () => {
        const { active } = this.state.results;
        if (active >= 0) {
            this.selectResult(this.getSelectedSearchResult());
        }
    };

    public selectResult = (result: any) => {
        const { onChange } = this.props;

        this.close({ value: result });

        // TODO announce?
        // const label = this.getItemLabel(result);

        onChange(result);
    };

    private onValueKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case Key.Space:
            case Key.ArrowDown:
            case Key.Down:
                this.open();
                event.preventDefault();
                event.stopPropagation();
                return;
        }

        if (event.key.length === 1) {
            // focus on search which will put the printable character into the field
            this.open();
        }
    };

    private onDropdownMouseDown = (event: MouseEvent) => {
        this.searchRef.current.focus();
        event.preventDefault();
        event.stopPropagation();
    };

    public onResultMouseMove = (index: number, event: MouseEvent) => {
        this.selectSearchResult(index);
    };

    public onResultClicked = (result: any, event: MouseEvent) => {
        this.selectResult(result);
        event.preventDefault();
        event.stopPropagation();
    };
}
