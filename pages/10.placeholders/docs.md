---
title: Placeholders
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

Select2 supports displaying a placeholder value using the `placeholder` configuration option. The placeholder value will be displayed until a selection is made.

## Text placeholders

The most common situation is to use a string of text as your placeholder value.

### Single select placeholders

<div class="s2-example">
  <p>
    <select class="js-example-placeholder-single js-states form-control">
      <option></option>
    </select>
  </p>
</div>

```html
<select class="js-example-placeholder-single js-states form-control">
  <option></option>
</select>
```

<pre data-fill-from="#example-placeholder-single-select"></pre>

<script type="text/javascript" id="example-placeholder-single-select" class="js-code-placeholder">
$(".js-example-placeholder-single").select2({
    placeholder: "Select a state",
    allowClear: true
});
</script>

>>> **For single selects only**, in order for the placeholder value to appear, you must have a blank `<option>` as the first option in your `<select>` control.  This is because the browser tries to select the first option by default. If your first option were non-empty, the browser would display this instead of the placeholder.

### Multi-select placeholders

For multi-selects, you must **not** have an empty `<option>` element:

<select class="js-example-placeholder-multiple js-states form-control" multiple="multiple"></select>

```html
<select class="js-example-placeholder-multiple js-states form-control" multiple="multiple"></select>
```

<pre data-fill-from="#example-placeholder-multi-select"></pre>

<script type="text/javascript" id="example-placeholder-multi-select" class="js-code-placeholder">
$(".js-example-placeholder-multiple").select2({
    placeholder: "Select a state"
});
</script>

>>> Select2 uses the `placeholder` attribute on multiple select boxes, which requires IE 10+. You can support it in older versions with [the Placeholders.js polyfill](https://github.com/jamesallardice/Placeholders.js).

## Default selection placeholders

Alternatively, the value of the `placeholder` option can be a data object representing a default selection (`<option>`). In this case the `id` of the data object should match the `value` of the corresponding default selection.

```
$('select').select2({
  placeholder: {
    id: '-1', // the value of the option
    text: 'Select an option'
  }
});
```

This is useful, for example, when you are using a framework that creates its own placeholder option.

## Using placeholders with AJAX

Select2 supports placeholders for all configurations, including AJAX. You will still need to add in the empty `<option>` if you are using a single select.

## Customizing placeholder appearance

When using Select2 **in single-selection mode**, the placeholder option will be passed through the `templateSelection` callback if specified. You can use some additional logic in this callback to check the `id` property and apply an alternative transformation to your placeholder option:

```
$('select').select2({
  templateSelection: function (data) {
    if (data.id === '') { // adjust for custom placeholder values
      return 'Custom styled placeholder text';
    }

    return data.text;
  }
});
```

>>>>> **When multiple selections are allowed**, the placeholder will be displayed using the `placeholder` attribute on the search box. You can customize the display of this placeholder using CSS, as explained in the following Stack Overflow answer: [Change an input's HTML5 placeholder color with CSS](http://stackoverflow.com/q/2610497/359284).

## Placeholders in legacy Internet Explorer versions

Select2 uses the native `placeholder` attribute on input boxes for the multiple select, and that attribute is not supported in older versions of Internet Explorer. You need to include [Placeholders.js](https://github.com/jamesallardice/Placeholders.js) on your page, or use the full build, in order to add `placeholder` attribute support to input boxes.
