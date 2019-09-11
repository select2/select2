---
title: Selection
taxonomy:
    category: docs
---

Select2 provides the `SingleSelection` and `MultipleSelection` adapters as default implementations of the `SelectionAdapter` for single- and multi-select controls, respectively.  Both `SingleSelection` and `MultipleSelection` extend the base `BaseSelection` adapter.

The selection adapter can be overridden by assigning a custom adapter to the `selectionAdapter` configuration option.

`select2/selection`

## Decorators

### `Placeholder` and `HidePlaceholder`

**AMD Modules:**

`select2/selection/placeholder`
`select2/dropdown/hidePlaceholder`

These decorators implement Select2's [placeholder](/placeholders) features.


### `AllowClear`

**AMD Modules:**

`select2/selection/allowClear`

This decorator implements [clearable selections](/selections#clearable-selections) as exposed through the `allowClear` option.

### `EventRelay`

**AMD Modules:**

`select2/selection/eventRelay`

Select2 has an internal event system that is used to notify parts of the component that state has changed, as well as an adapter that allows some of these events to be relayed to the outside word.
