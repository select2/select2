---
title: Options
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

A traditional `<select>` box contains any number of `<option>` elements.  Each of these is rendered as an option in the dropdown menu.  Select2 preserves this behavior when initialized on a `<select>` element that contains `<option>` elements, converting them into its internal JSON representation:

```
{
  "id": "value attribute" || "option text",
  "text": "label attribute" || "option text",
  "element": HTMLOptionElement
}
```

`<optgroup>` elements will be converted into data objects using the following rules:

```
{
  "text": "label attribute",
  "children": [ option data object, ... ],
  "element": HTMLOptGroupElement
}
```

>>> Options sourced from [other data sources](/data-sources) must conform to this this same internal representation.  See ["The Select2 data format"](/data-sources/formats) for details.

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

If you wish to create a true hierarchy of selectable options, use an `<option>` instead of an `<optgroup>` and [change the style with CSS](http://stackoverflow.com/q/30820215/359284#30948247).  Please note that this approach may be considered "less accessible" as it relies on CSS styling, rather than the semantic meaning of `<optgroup>`, to generate the effect.

## Disabling options

Select2 will correctly handle disabled options, both with data coming from a standard select (when the `disabled` attribute is set) and from remote sources, where the object has `disabled: true` set.

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
