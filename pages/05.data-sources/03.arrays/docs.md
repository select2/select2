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
