/** jsx:pragma h */
import { Component, h, render } from 'preact';
import { ItemRenderer, QueryFunction } from '../../control/src/abstract-select';
import { Dictionary } from '../../control/src/dictionary';
import { MultiSelect } from '../../control/src/multi-select';
import '../../control/src/select25.scss';
import { SingleSelect } from '../../control/src/single-select';
import { extend } from '../../control/src/util';
import { Ajax, createQueryFromAjax } from './ajax';
import { DataFunction, createQueryFromData } from './data';
import { Store } from './store';

const forceImportOfH = h;

enum StoreKeys {
    targetElement = 'te'
}

export interface Options {
    multiple: boolean;
    containerStyle?: string;
    containerClass?: string;
    hiddenValue?: (values: any, options: Options) => string;
    tabIndex?: number;
    itemId: ((item: any) => string) | string;
    itemLabel: ((item: any) => string) | string;
    valueContent?: ItemRenderer;
    resultContent?: ItemRenderer;
    query?: QueryFunction;
    data?: DataFunction;
    ajax?: Ajax;
    quiet?: number;
    minimumCharacters?: number;
    openOnFocus?: boolean;
    dictionary?: string | Dictionary;

    value: any;
    values: any[];
    allowClear?: boolean;
    placeholder?: string;

    /** Single Select Label */
    label?: string;

    /** Multi Select Selected Values Listbox Label */
    valuesLabel?: string;
    /** Multi Select Add Value Combobox Label */
    comboboxLabel?: string;

    allowDuplicates: boolean;
}

const DEFAULT_OPTIONS = {
    allowClear: false,
    dictionary: 'en_us',
    hiddenValue: (values: any, options: Options) => {
        const id = (item: any) => {
            if (typeof options.itemId === 'function') {
                return options.itemId(item);
            } else {
                return '' + item[options.itemId];
            }
        };

        if (values) {
            if (Array.isArray(values)) {
                if (values.length > 0) {
                    return values.map(id).join(',');
                } else {
                    return '';
                }
            } else {
                return id(values);
            }
        } else {
            return '';
        }
    },
    itemId: 'id',
    itemLabel: 'text',
    minimumCharacters: 0,
    multiple: false,
    openOnFocus: false
};

function triggerOnChange(element: HTMLElement, data: any) {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('change', false, true);
    event[data] = data;
    element.dispatchEvent(event);
}

class MultiSelectWrapper extends Component<
    {
        element: HTMLInputElement;
        options: Options;
    },
    { values: any }
> {
    constructor(props) {
        super(props);
        this.state = { values: props.options.values };
    }

    public componentDidUpdate() {
        this.setHiddenValue(this.state.values);
    }

    public componentDidMount() {
        this.setHiddenValue(this.state.values);
    }

    public render(props, state, context) {
        const opts = this.props.options;
        return (
            <MultiSelect
                containerClass={opts.containerClass}
                containerStyle={opts.containerStyle}
                valuesLabel={opts.valuesLabel}
                comboboxLabel={opts.comboboxLabel}
                itemId={opts.itemId}
                itemLabel={opts.itemLabel}
                valueContent={opts.valueContent}
                resultContent={opts.resultContent}
                query={opts.query}
                quiet={opts.quiet}
                minimumCharacters={opts.minimumCharacters}
                openOnFocus={opts.openOnFocus}
                dictionary={opts.dictionary}
                tabIndex={opts.tabIndex}
                allowDuplicates={opts.allowDuplicates}
                values={this.state.values}
                onChange={this.onChange}
            />
        );
    }

    public onChange = (values: any[]) => {
        this.setState({ values });
        this.setHiddenValue(values);
        triggerOnChange(this.props.element, values);
    };

    private setHiddenValue(values: any) {
        const { element, options } = this.props;
        element.value = options.hiddenValue(values, options);
    }
}

class SingleSelectWrapper extends Component<
    {
        options: Options;
        element: HTMLInputElement;
    },
    { value: any }
> {
    constructor(props) {
        super(props);
        this.state = { value: props.options.value };
    }

    public componentDidMount() {
        this.setHiddenValue(this.state.value);
    }

    public componentDidUpdate() {
        this.setHiddenValue(this.state.value);
    }

    public render(props, state, context) {
        const opts = this.props.options;
        return (
            <SingleSelect
                label={opts.label}
                comboboxLabel={opts.comboboxLabel}
                containerClass={opts.containerClass}
                containerStyle={opts.containerStyle}
                allowClear={opts.allowClear}
                placeholder={opts.placeholder}
                itemId={opts.itemId}
                itemLabel={opts.itemLabel}
                valueContent={opts.valueContent}
                resultContent={opts.resultContent}
                query={opts.query}
                quiet={opts.quiet}
                minimumCharacters={opts.minimumCharacters}
                openOnFocus={opts.openOnFocus} // TODO
                dictionary={opts.dictionary}
                tabIndex={opts.tabIndex}
                allowDuplicates={opts.allowDuplicates}
                value={this.state.value}
                onChange={this.onChange}
            />
        );
    }

    public onChange = (value: any) => {
        this.setState({ value });
        this.setHiddenValue(value);
        triggerOnChange(this.props.element, value);
    };

    private setHiddenValue(value: any) {
        const { element, options } = this.props;
        element.value = options.hiddenValue(value, options);
    }
}

function create<T>(element: HTMLInputElement, options: Options) {
    // TODO make sure we are attached to hidden input

    const store = Store.getStore(element);

    options = extend({}, DEFAULT_OPTIONS, options);
    if (!options.query) {
        if (options.ajax) {
            options.query = createQueryFromAjax(options.ajax);
        } else if (options.data) {
            options.query = createQueryFromData(options.data);
        }
    }

    if (!options.tabIndex && element.tabIndex) {
        options.tabIndex = element.tabIndex;
    }

    if (element.getAttribute('s25-style')) {
        let style = options.containerStyle || '';
        if (style.length > 0) {
            style += ';';
        }
        style += element.getAttribute('s25-style');
        options.containerStyle = style;
    }

    if (element.getAttribute('s25-class')) {
        let clazz = options.containerClass || '';
        if (clazz.length > 0) {
            clazz += ' ';
        }
        clazz += element.getAttribute('s25-class');
        options.containerClass = clazz;
    }

    // create placeholder element into which the control will be rendered
    const parentElement = element.parentElement;
    const targetElement = document.createElement('div');
    parentElement.insertBefore(targetElement, element);

    store.set(StoreKeys.targetElement, targetElement);

    // render the replacement
    if (options.multiple) {
        render(<MultiSelectWrapper element={element} options={options} />, parentElement, targetElement);
    } else {
        render(<SingleSelectWrapper element={element} options={options} />, parentElement, targetElement);
    }
}

function destroy(element: HTMLElement) {
    if (!Store.hasStore(element)) {
        return;
    }
    const store = Store.getStore(element);
    const targetElement = store.get(StoreKeys.targetElement);
    const parentElement = element.parentElement;
    render(null, parentElement, targetElement);
    parentElement.removeChild(targetElement);
    Store.removeStore(element);
}

const select25 = {
    create,
    destroy
};

export { select25 };

declare global {
    interface Window {
        select25: typeof select25;
    }
}

window.select25 = select25;
