---
title: SelectAdapter
taxonomy:
    category: docs
---

Select2 provides the `SelectAdapter` as a default implementation of the `DataAdapter` adapter.  It extends `BaseAdapter`.

This adapter can be overridden by assigning a custom adapter to the `dataAdapter` configuration option.
 
**AMD Modules:**

- `select2/data/base`
- `select2/data/select`

## Decorators

### `Tags`

This decorator implements the [tagging](/tagging) feature.

**AMD Modules:**

`select2/data/tags`
  
### `MinimumInputLength`

This decorator implements the [minimum search term length](/searching#minimum-search-term-length) feature as exposed through the `minimumInputLength` configuration option.

**AMD Modules:**

`select2/data/minimumInputLength`

### `MaximumInputLength`

This decorator implements the [maximum search term length](/searching#maximum-search-term-length) feature as exposed through the `maximumInputLength` configuration option.

**AMD Modules:**

`select2/data/maximumInputLength`

### `InitSelection`

This decorator provides backwards compatibility for the `initSelection` callback in version 3.5.

In the past, Select2 required an option called `initSelection` that was defined whenever a custom data source was being used, allowing for the initial selection for the component to be determined. This has been replaced by the `current` method on the data adapter.

**AMD Modules:**

`select2/compat/initSelection"`

### `Query`

This decorator provides backwards compatibility for the `query` callback in version 3.5.

**AMD Modules:**

`select2/compat/query`

### `InputData`

This decorator implements backwards compatibility with version 3.5's `<input type="hidden" >` elements.

In past versions of Select2, a `<select>` element could only be used with a limited subset of options. An `<input type="hidden" >` tag was required instead, which did not allow for a graceful fallback for users who did not have JavaScript enabled. Select2 now supports the `<select>` element for all options, so it is no longer required to use `<input />` elements with Select2.

**AMD Modules:**

`select2/compat/inputData`
