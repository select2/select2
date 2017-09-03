---
title: Dropdown
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

This chapter covers the appearance and behavior of the dropdown menu.

## Templating

The appearance of search results in the dropdown can be customized by using the `templateResult` option:

<div class="s2-example">
    <select class="js-example-templating js-states form-control"></select>
</div>

<pre data-fill-from=".js-code-example-templating"></pre>

<script type="text/javascript" class="js-code-example-templating">

function formatState (state) {
  if (!state.id) {
    return state.text;
  }
  var baseUrl = "{{ url('images/flags/') }}";
  var $state = $(
    '<span><img src="' + baseUrl + state.element.value.toLowerCase() + '.png" class="img-flag" /> ' + state.text + '</span>'
  );
  return $state;
};

$(".js-example-templating").select2({
  templateResult: formatState
});

</script>

## Disabling options

Select2 will correctly handle disabled options, both with data coming from a standard select (when the `disabled` attribute is set) and from remote sources, where the object has <code>disabled: true</code> set.

<div class="s2-example">
    <select class="js-example-disabled-results form-control">
      <option value="one">First</option>
      <option value="two" disabled="disabled">Second (disabled)</option>
      <option value="three">Third</option>
    </select>
</div>

<pre data-fill-from=".js-code-disabled-option"></pre>

```
<select class="js-example-disabled-results">
  <option value="one">First</option>
  <option value="two" disabled="disabled">Second (disabled)</option>
  <option value="three">Third</option>
</select>
```

<script type="text/javascript" class="js-code-disabled-option">

var $disabledResults = $(".js-example-disabled-results");
$disabledResults.select2();

</script>

## Automatic selection

Select2 can be configured to automatically select the currently highlighted result when the dropdown is closed by using the `selectOnClose` option:

```
$('select').select2({
  selectOnClose: true
});
```

## Forcing the dropdown to remain open after selection

You may use the `closeOnSelect` option to prevent the dropdown from closing when a result is selected:

```
$('select').select2({
  closeOnSelect: false
});
```

## Dropdown placement

The `dropdownParent` option allows you to pick an element for the dropdown to be appended to:

```
$('select').select2({
  dropdownParent: $('#my_amazing_modal')
});
```

### Using a Select2 control inside a Bootstrap modal

If you're having trouble using the search box inside a Bootstrap modal, trying setting the `dropdownParent` option to the modal element.

## Dropdown option groups

In HTML, `<option>` elements can be grouped by wrapping them with in an `<optgroup>` element:

```
<select>
  <optgroup label="Group Name">
    <option>Nested option</option>
  </optgroup>
</select>
```

Select2 will automatically pick these up and render them appropriately in the dropdown.

### Hierarchical options

Only a single level of nesting is allowed per the HTML specification. If you nest an `<optgroup>` within another `<optgroup>`, Select2 will not be able to detect the extra level of nesting and errors may be triggered as a result.

Furthermore, `<optgroup>` elements **cannot** be made selectable.  This is a limitation of the HTML specification and is not a limitation that Select2 can overcome.

If you wish to create a true hierarchy of selectable options, use an `<option>` instead of an `<optgroup>` and <a href="http://stackoverflow.com/q/30820215/359284#30948247">change the style with CSS</a>.  Please note that this approach may be considered "less accessible" as it relies on CSS styling, rather than the semantic meaning of `<optgroup>`, to generate the effect.
