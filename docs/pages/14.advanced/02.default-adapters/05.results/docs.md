---
title: Results
taxonomy:
    category: docs
---

The `ResultsAdapter` controls the list of results that the user can select from.

The results adapter can be overridden by assigning a custom adapter to the `resultsAdapter` configuration option.  While the results adapter does not define any additional methods that must be implemented, it makes extensive use of the Select2 event system for controlling the display of results and messages.
 
**AMD Modules:**

`select2/results`

## Decorators

### `SelectOnClose`

This decorator implements [automatic selection](/dropdown#automatic-selection) of the highlighted option when the dropdown is closed.

**AMD Modules:**

`select2/dropdown/selectOnClose`
