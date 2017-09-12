---
title: Arrays
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

## Loading array data

You may use the `data` configuration option to load dropdown options from a local array.

You can provide initial selections with array data by providing the option tag for the selected values, similar to how it would be done for a standard select.

<div class="s2-example">
  <p>
    <select class="js-example-data-array form-control"></select>
  </p>
  <p>
    <select class="js-example-data-array-selected form-control">
      <option value="2" selected="selected">duplicate</option>
    </select>
  </p>
</div>

<pre data-fill-from=".js-code-placeholder"></pre>

<script type="text/javascript" class="js-code-placeholder">

var data = [
    {
        id: 0,
        text: 'enhancement'
    },
    {
        id: 1,
        text: 'bug'
    },
    {
        id: 2,
        text: 'duplicate'
    },
    {
        id: 3,
        text: 'invalid'
    },
    {
        id: 4,
        text: 'wontfix'
    }
];

$(".js-example-data-array").select2({
  data: data
})

$(".js-example-data-array-selected").select2({
  data: data
})
</script>

Unlike the case of items supplied by [AJAX data sources](/data-sources/ajax), items supplied as an array will be immediately rendered as `<option>` elements in the target `<select>` control.

## Backwards compatibility with the `tags` option

In Select2 v3.5, this option was called `tags`.  However in version 4.0, `tags` now handles the [tagging feature](/tagging).

For backwards compatibility the `tags` option can still accept an array of objects, in which case they will be handled in the same manner as the `data` option.
  