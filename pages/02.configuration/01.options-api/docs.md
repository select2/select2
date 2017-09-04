---
title: Configuration API
taxonomy:
    category: docs
---

The following is an attempt to provide a comprehensive list of all configuration options available in Select2.

| Option | Type | Default | Description | 
| ------ | ---- | ------- | ----------- |
| `adaptContainerCssClass` | | | |
| `adaptDropdownCssClass` | | | |
| `ajax` | object | `null` | Provides support for [ajax data sources](/data-sources/ajax). |
| `allowClear` | boolean | `false` | Provides support for [clearable selections](/selections#clearable-selections). |
| `amdBase` | string | `select2/` | The base AMD loader path to be used for select2 dependency resolution. This option typically doesn't need to be changed, but is available for situations where module names may change as a result of certain build environments. |
| `amdLanguageBase` | string | `select2/i18n/` | The base AMD loader language path to be used for select2 language file resolution. This option typically doesn't need to be changed, but is available for situations where module names may change as a result of certain build environments. |
| `closeOnSelect` | boolean | `true` | Controls whether the dropdown is [closed after a selection is made](/dropdown#forcing-the-dropdown-to-remain-open-after-selection). |
| `containerCss` | | | |
| `containerCssClass` | | | |
| `data` | array of objects | `null` | |
| `dataAdapter` | | `SelectAdapter` | Used to override the built-in [DataAdapter](/advanced/default-adapters/data). |
| `debug` | boolean | | |
| `dir` | | |
| `disabled` | boolean | `false` | When set to `true`, the select control will be disabled. |
| `dropdownAdapter` | | `DropdownAdapter` | Used to override the built-in [DropdownAdapter](/advanced/default-adapters/dropdown) |
| `dropdownAutoWidth` | boolean | | |
| `dropdownCss` | string | | |
| `dropdownCssClass` | string | | |
| `dropdownParent` | jQuery selector or DOM node | | Allows you to [customize placement](/dropdown#dropdown-placement) of the dropdown. |
| `escapeMarkup` | | |
| `initSelection` | callback | | See [`initSelection`](/upgrading/migrating-from-35#removed-the-requirement-of-initselection).  **This option was deprecated in Select2 v4.0, and will be removed in v4.1.** |
| `language` | string or object | | |
| `matcher` | A callback taking search `params` and the `data` object. | | |
| `maximumInputLength` | integer | `0` | [Maximum number of characters](/searching#maximum-search-term-length) that may be provided for a search term. |
| `maximumSelectionLength` | integer | `0` | The maximum number of items that may be selected in a multi-select control. If the value of this option is less than 1, the number of selected items will not be limited.
| `minimumInputLength` | integer | `0` | [Minimum number of characters required to start a search.](/searching#minimum-search-term-length) |
| `minimumResultsForSearch` | integer | `0` | The minimum number of results required to [display the search box](/searching#limiting-display-of-the-search-box-to-large-result-sets). |
| `multiple` | boolean | `false` | This option enables multi-select (pillbox) mode. Select2 will automatically map the value of the `multiple` HTML attribute to this option during initialization. |
| `placeholder` | string or object | | |
| `query` | A function taking `params` (including a `callback`) | | **This option was deprecated in Select2 v4.0, and will be removed in v4.1.** |
| `resultsAdapter` | | `ResultsAdapter` | Used to override the built-in [ResultsAdapter](/advanced/default-adapters/results). |
| `selectionAdapter` | | `SingleSelection` or `MultipleSelection`, depending on the value of `multiple`. | Used to override the built-in [SelectionAdapter](/advanced/default-adapters/selection). |
| `selectOnClose` | boolean | `false` | Implements [automatic selection](/dropdown#automatic-selection) when the dropdown is closed. |
| `sorter` | function | | |
| `tags` | boolean / array of objects | `false` | Used to enable [free text responses](/tagging). |
| `templateResult` | callback | | |
| `templateSelection` | callback | | |
| `theme` | string | `default` | Allows you to set the [theme](/appearance#themes). |
| `tokenizer` | | |
| `tokenSeparators` | | | |
| `width` | string | `resolve` | Supports [customization of the container width](/appearance#container-width). |
