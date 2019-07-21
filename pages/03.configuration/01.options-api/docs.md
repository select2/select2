---
title: Options
taxonomy:
    category: docs
---

This is a list of all the Select 2 configuration options.

| Option | Type | Default | Description | 
| ------ | ---- | ------- | ----------- |
| `adaptContainerCssClass` | | | |
| `adaptDropdownCssClass` | | | |
| `ajax` | object | `null` | Provides support for [ajax data sources](/data-sources/ajax). |
| `allowClear` | boolean | `false` | Provides support for [clearable selections](/selections#clearable-selections). |
| `amdBase` | string | `./` | See [Using Select2 with AMD or CommonJS loaders](/builds-and-modules#using-select2-with-amd-or-commonjs-loaders). |
| `amdLanguageBase` | string | `./i18n/` | See [Using Select2 with AMD or CommonJS loaders](/builds-and-modules#using-select2-with-amd-or-commonjs-loaders). |
| `closeOnSelect` | boolean | `true` | Controls whether the dropdown is [closed after a selection is made](/dropdown#forcing-the-dropdown-to-remain-open-after-selection). |
| `containerCss` | object | null | Adds custom CSS to the container. Expects key-value pairs: `{ 'css-property': 'value' }` |
| `containerCssClass` | string | `''` | |
| `data` | array of objects | `null` | Allows rendering dropdown options from an [array](/data-sources/arrays). |
| `dataAdapter` | | `SelectAdapter` | Used to override the built-in [DataAdapter](/advanced/default-adapters/data). |
| `debug` | boolean | `false` | Enable debugging messages in the browser console. |
| `dir` | | |
| `disabled` | boolean | `false` | When set to `true`, the select control will be disabled. |
| `dropdownAdapter` | | `DropdownAdapter` | Used to override the built-in [DropdownAdapter](/advanced/default-adapters/dropdown) |
| `dropdownAutoWidth` | boolean | `false` | |
| `dropdownCss` | object | null | Adds custom CSS to the dropdown. Expects key-value pairs: `{ 'css-property': 'value' }` |
| `dropdownCssClass` | string | `''` | |
| `dropdownParent` | jQuery selector or DOM node | `$(document.body)` | Allows you to [customize placement](/dropdown#dropdown-placement) of the dropdown. |
| `escapeMarkup` | callback | `Utils.escapeMarkup` | Handles [automatic escaping of content rendered by custom templates](/dropdown#built-in-escaping). |
| `initSelection` | callback | | See [`initSelection`](/upgrading/migrating-from-35#removed-the-requirement-of-initselection).  **This option was deprecated in Select2 v4.0, and will be removed in v4.1.** |
| `language` | string or object | `EnglishTranslation` | Specify the [language used for Select2 messages](/i18n#message-translations). |
| `matcher` | A callback taking search `params` and the `data` object. | | Handles custom [search matching](/searching#customizing-how-results-are-matched). |
| `maximumInputLength` | integer | `0` | [Maximum number of characters](/searching#maximum-search-term-length) that may be provided for a search term. |
| `maximumSelectionLength` | integer | `0` | The maximum number of items that may be selected in a multi-select control. If the value of this option is less than 1, the number of selected items will not be limited.
| `minimumInputLength` | integer | `0` | [Minimum number of characters required to start a search.](/searching#minimum-search-term-length) |
| `minimumResultsForSearch` | integer | `0` | The minimum number of results required to [display the search box](/searching#limiting-display-of-the-search-box-to-large-result-sets). |
| `multiple` | boolean | `false` | This option enables multi-select (pillbox) mode. Select2 will automatically map the value of the `multiple` HTML attribute to this option during initialization. |
| `placeholder` | string or object | `null` | Specifies the [placeholder](/placeholders) for the control. |
| `query` | A function taking `params` (including a `callback`) | `Query` | **This option was deprecated in Select2 v4.0, and will be removed in v4.1.** |
| `resultsAdapter` | | `ResultsAdapter` | Used to override the built-in [ResultsAdapter](/advanced/default-adapters/results). |
| `selectionAdapter` | | `SingleSelection` or `MultipleSelection`, depending on the value of `multiple`. | Used to override the built-in [SelectionAdapter](/advanced/default-adapters/selection). |
| `selectOnClose` | boolean | `false` | Implements [automatic selection](/dropdown#automatic-selection) when the dropdown is closed. |
| `sorter` | callback | | |
| `tags` | boolean / array of objects | `false` | Used to enable [free text responses](/tagging). |
| `templateResult` | callback | | Customizes the way that [search results are rendered](/dropdown#templating). |
| `templateSelection` | callback | | Customizes the way that [selections are rendered](/selections#templating). |
| `theme` | string | `default` | Allows you to set the [theme](/appearance#themes). |
| `tokenizer` | callback | | A callback that handles [automatic tokenization of free-text entry](/tagging#automatic-tokenization-into-tags). |
| `tokenSeparators` | array | `[]` | The list of characters that should be used as token separators. |
| `width` | string | `resolve` | Supports [customization of the container width](/appearance#container-width). |
| `scrollAfterSelect` | boolean | `false` | If `true`, resolves issue for multiselects using `closeOnSelect: false` that caused the list of results to scroll to the first selection after each select/unselect (see https://github.com/select2/select2/pull/5150). This behaviour was intentional to deal with infinite scroll UI issues (if you need this behavior, set `false`) but it created an issue with multiselect dropdown boxes of fixed length. This pull request adds a configurable option to toggle between these two desirable behaviours. |
