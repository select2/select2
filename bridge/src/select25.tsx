/** jsx:pragma h */
import { Component, h, render } from 'preact';
import { DataItem, DataItemRenderer, QueryFunction } from '../../control/src/abstract-select';
import { Dictionary } from '../../control/src/dictionary';
import { MultiSelect } from '../../control/src/multi-select';
import '../../control/src/select25.scss';
import { SingleSelect } from '../../control/src/single-select';
import { extend } from '../../control/src/util';
import { Ajax, createQueryFromAjax } from './ajax';
import { createQueryFromData, DataFunction } from './data';
import { Store } from './store';

const forceImportOfH = h;

enum StoreKeys {
    targetElement = 'te'
}

interface BaseSelectOptions {
    containerStyle?: string;
    containerClass?: string;
    tabIndex?: number;
    valueContent?: DataItemRenderer;
    resultContent?: DataItemRenderer;
    query?: QueryFunction;
    data?: DataFunction;
    ajax?: Ajax;
    quiet?: number;
    minimumCharacters?: number;
    openOnFocus?: boolean;
    dictionary?: string | Dictionary;
}

interface MultiSelectOptions extends BaseSelectOptions {
    hiddenValue?: (values: DataItem[], options: MultiSelectOptions) => string;
    valuesLabel?: string;
    comboboxLabel?: string;
    allowDuplicates: boolean;
    values: DataItem[];
}

interface SingleSelectOptions extends BaseSelectOptions {
    hiddenValue?: (value: DataItem, options: SingleSelectOptions) => string;
    label?: string;
    value: DataItem;
    allowClear?: boolean;
    placeholder?: string;
}

const BASE_DEFAULT_OPTIONS = {
    dictionary: 'en_us',
    minimumCharacters: 0,
    openOnFocus: false
};

const DEFAULT_MULTI_SELECT_OPTIONS = extend({}, BASE_DEFAULT_OPTIONS, {
    hiddenValue: (values: DataItem[], options: MultiSelectOptions) => {
        if (values && values.length > 0) {
            return values.map(item => item.id).join(',');
        } else {
            return '';
        }
    }
});

const DEFAULT_SINGLE_SELECT_OPTIONS = extend({}, BASE_DEFAULT_OPTIONS, {
    allowClear: false,
    hiddenValue: (value: DataItem, options: SingleSelectOptions) => {
        if (value) {
            return value.id;
        } else {
            return '';
        }
    }
});

function triggerOnChange(element: HTMLElement, data: any) {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('change', false, true);
    event[data] = data;
    element.dispatchEvent(event);
}

class MultiSelectWrapper extends Component<
    {
        element: HTMLInputElement;
        options: MultiSelectOptions;
    },
    { values?: DataItem[] }
> {
    constructor(props) {
        super(props);
        this.state = { values: props.options.values || [] };
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
        options: SingleSelectOptions;
        element: HTMLInputElement;
    },
    { value?: DataItem }
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
                containerClass={opts.containerClass}
                containerStyle={opts.containerStyle}
                allowClear={opts.allowClear}
                placeholder={opts.placeholder}
                valueContent={opts.valueContent}
                resultContent={opts.resultContent}
                query={opts.query}
                quiet={opts.quiet}
                minimumCharacters={opts.minimumCharacters}
                openOnFocus={opts.openOnFocus} // TODO
                dictionary={opts.dictionary}
                tabIndex={opts.tabIndex}
                value={this.state.value}
                onChange={this.onChange}
            />
        );
    }

    public onChange = (value: DataItem) => {
        this.setState({ value });
        this.setHiddenValue(value);
        triggerOnChange(this.props.element, value);
    };

    private setHiddenValue(value: DataItem) {
        const { element, options } = this.props;
        element.value = options.hiddenValue(value, options);
    }
}

function createSingleSelect(element: HTMLInputElement, options: SingleSelectOptions) {
    options = extend({}, DEFAULT_SINGLE_SELECT_OPTIONS, options);
    fillBaseOptions(element, options);

    const store = Store.getStore(element);

    // create placeholder element into which the control will be rendered
    const parentElement = element.parentElement;
    const targetElement = document.createElement('div');
    parentElement.insertBefore(targetElement, element);
    store.set(StoreKeys.targetElement, targetElement);

    render(<SingleSelectWrapper element={element} options={options} />, parentElement, targetElement);
}

function createMultiSelect(element: HTMLInputElement, options: SingleSelectOptions) {
    options = extend({}, DEFAULT_MULTI_SELECT_OPTIONS, options);
    fillBaseOptions(element, options);

    const store = Store.getStore(element);

    // create placeholder element into which the control will be rendered
    const parentElement = element.parentElement;
    const targetElement = document.createElement('div');
    parentElement.insertBefore(targetElement, element);
    store.set(StoreKeys.targetElement, targetElement);

    render(<MultiSelectWrapper element={element} options={options} />, parentElement, targetElement);
}

function fillBaseOptions(element: HTMLInputElement, options: BaseSelectOptions) {
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

    if (element.getAttribute('data-s25-container-style')) {
        let style = options.containerStyle || '';
        if (style.length > 0) {
            style += ';';
        }
        style += element.getAttribute('data-s25-container-style');
        options.containerStyle = style;
    }

    if (element.getAttribute('data-s25-container-class')) {
        let clazz = options.containerClass || '';
        if (clazz.length > 0) {
            clazz += ' ';
        }
        clazz += element.getAttribute('data-s25-container-class');
        options.containerClass = clazz;
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
    createMultiSelect,
    createSingleSelect,
    destroy
};

export { select25 };

declare global {
    interface Window {
        select25: typeof select25;
    }
}

window.select25 = select25;
