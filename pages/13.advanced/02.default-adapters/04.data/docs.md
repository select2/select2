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

  <p>
    <strong>For backwards compatibility</strong>, if an array of objects is
    passed in with the <code>tags</code> option, the options will be
    automatically created and the user will be able to select from them.
    This is the <strong>same as how <a href="#data">array data</a>
    works</strong>, and has similar limitations.
  </p>
  
### `MinimumInputLength`

This decorator implements the [minimum search term length](/searching#minimum-search-term-length) feature as exposed through the `minimumInputLength` configuration option.

**AMD Modules:**

`select2/data/minimumInputLength`

### `MaximumInputLength`

This decorator implements the [maximum search term length](/searching#maximum-search-term-length) feature as exposed through the `maximumInputLength` configuration option.

**AMD Modules:**

`select2/data/maximumInputLength`
