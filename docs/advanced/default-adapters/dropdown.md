The dropdown adapter defines the main container that the dropdown should be held in. Select2 allows you to change the way that the dropdown works, allowing you to do anything from attach it to a different location in the document or add a search box.

It is common for decorators to attach to the `render` and `position` methods to alter how the dropdown is altered and positioned.

This adapter can be overridden by assigning a custom adapter to the `dropdownAdapter` configuration option.

`select2/dropdown`

## Decorators

### `AttachBody`

This decorator implements the standard [`dropdownParent`](../../dropdown.md#dropdown-placement) method of attaching the dropdown.

**AMD Modules:**

`select2/dropdown/attachBody`

### `AttachContainer`

When this decorator is loaded, Select2 can place the dropdown directly after the selection container, so it will appear in the same location within the DOM as the rest of Select2.

**AMD Modules:**

`select2/dropdown/attachContainer`

> [!WARNING]
> **Check your build.** This module is only included in the [full builds](../../getting-started/builds-and-modules.md) of Select2.

### `DropdownSearch`

This decorator implements the [search box that is displayed at the top of the dropdown](../../searching.md).

**AMD Modules:**

`select2/dropdown/search`

### `MinimumResultsForSearch`

This decorator implements the [`minimumResultsForSearch` configuration option](../../searching.md#limiting-display-of-the-search-box-to-large-result-sets).

**AMD Modules:**

`select2/dropdown/minimumResultsForSearch`

### `CloseOnSelect`

This decorator implements the [`closeOnSelect` configuration option](../../dropdown.md#forcing-the-dropdown-to-remain-open-after-selection).

`select2/dropdown/closeOnSelect`
