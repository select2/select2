---
title: Dropdown
taxonomy:
    category: docs
---

The dropdown adapter defines the main container that the dropdown should be held in.  Select2 allows you to change the way that the dropdown works, allowing you to do anything from attach it to a different location in the document or add a search box.

It is common for decorators to attach to the `render` and `position` methods to alter how the dropdown is altered and positioned.

This adapter can be overridden by assigning a custom adapter to the `dropdownAdapter` configuration option.

`select2/dropdown`

## Decorators

### `AttachBody`

By default, Select2 will attach the dropdown to the end of the body and will absolutely position it to appear below the selection container.

`select2/dropdown/attachBody`

  <h2 id="dropdownParent">
    Attached to body
  </h2>


    <div class="col-sm-6">
      <div class="alert alert-warning">
        <strong>Heads up!</strong>
        This will cause DOM events to be raised outside of the standard
        Select2 DOM container. This can cause issues with
        third-party components such as modals.
      </div>
    </div>
  </div>

  <p>
    When the dropdown is attached to the body, you are not limited to just
    displaying the dropdown below the container. Select2 will display above
    the container if there is not enough space below the container, but there
    is enough space above it. You are also not limited to displaying the
    dropdown within the parent container, which means Select2 will render
    correctly inside of modals and other small containers.
  </p>

### `AttachContainer`

`select2/dropdown/attachContainer`

  <h2 id="dropdown-attachContainer">
    Attached below the container
  </h2>

  <p>
    Select2 can place the dropdown directly after the selection container, so
    it will appear in the same location within the DOM as the rest of Select2.
  </p>

  <div class="row">

    <div class="col-sm-6">
      <div class="alert alert-warning">
        <strong>Check your build.</strong> This module is only included in the
        <a href="index.html#builds-full" class="alert-link">full builds</a> of
        Select2.
      </div>
    </div>
  </div>

  <div class="alert alert-info">
    <strong>
      <a href="https://harvesthq.github.io/chosen/">Harvest Chosen</a>
      migrators!
    </strong>
    If you are migrating to Select2 from Chosen, this option will cause
    Select2 to position the dropdown in a similar way.
  </div>

### `DropdownSearch`

`select2/dropdown/search`
      
  <p>
    Users can filter down the results by typing a search term into a box that
    is displayed at the top of the dropdown.
  </p>

  <p>
    A search box is added to the top of the dropdown automatically for select
    boxes where only a single option can be selected.
  </p>

### `MinimumResultsForSearch`

`select2/dropdown/minimumResultsForSearch`

  <h3 id="dropdown-maximumInputLength">
    Minimum results to display the search box
  </h3>

  <p>
    When working with smaller data sets, the search box can take up more space
    that is necessary, as there are not enough results for filtering to be
    effective. Select2 allows you to only display the search box when the
    number of search results reaches a certain threshold.
  </p>

  <div class="row">
    <div class="col-sm-6">
      <dl class="dl-horizontal">
        <dt>Key</dt>
        <dd><code>minimumResultsForSearch</code></dd>

        <dt>Value</dt>
        <dd>integer</dd>
      </dl>
    </div>

  </div>

### `CloseOnSelect`

`select2/dropdown/closeOnSelect`

  <h2 id="closeOnSelect">
    Close the dropdown when a result is selected
  </h2>

  <p>
    Select2 will automatically close the dropdown when an element is selected,
    similar to what is done with a normal select box.  This behavior can be
    changed though to keep the dropdown open when results are selected,
    allowing for multiple options to be selected quickly.
  </p>

  <div class="row">
    <div class="col-sm-6">
      <dl class="dl-horizontal">
        <dt>Key</dt>
        <dd><code>closeOnSelect</code></dd>

        <dt>Default</dt>
        <dd><code>true</code></dd>
      </dl>
    </div>


  </div>

  <p>
    If this decorator is not used (or <code>closeOnSelect</code> is set to
    <code>false</code>), the dropdown will not automatically close when a
    result is selected.  The dropdown will also never close if the
    <kbd>ctrl</kbd> key is held down when the result is selected.
  </p>

