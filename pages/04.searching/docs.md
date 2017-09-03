---
title: Search
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

The appearance and behavior of the search control can be easily customized with Select2.

## Customizing how results are matched

You may customize the way that Select2 matches search terms by passing a callback to the `matcher` option. This example matches results only if the term appears in the beginning of the string as opposed to anywhere:

<div class="s2-example">
    <select class="js-example-matcher-start js-states form-control"></select>
</div>

<pre data-fill-from=".js-code-example-matcher"></pre>

<script type="text/javascript" class="js-code-example-matcher">

function matchStart (term, text) {
  if (text.toUpperCase().indexOf(term.toUpperCase()) == 0) {
    return true;
  }

  return false;
}

$.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
  $(".js-example-matcher-start").select2({
    matcher: oldMatcher(matchStart)
  })
});

</script>

>>> This custom matcher uses a [compatibility module](/configuration/deprecated) that is only bundled in the [full version of Select2](/getting-started/builds). You also have the option of using a <a href="options.html#matcher">more complex matcher</a>.

## Limiting search term length

You may limit the maximum length of search terms by using the `maximumInputLength` option:

```
$('select').select2({
  maximumInputLength: 20 // only allow terms up to 20 characters long
});
```

## Limiting display of the search box to large result sets

The `minimumResultsForSearch` option determines the minimum number of results required in the initial population of the dropdown to display the search box.

This option is useful for cases where local data is used with a small result set, and the search box would simply be a waste of screen real estate. Set this value to -1 to permanently hide the search box.

```
$('select').select2({
  minimumResultsForSearch: 20 // at least 20 results must be displayed
});
```

## Hiding the search box

Select2 allows you to hide the search box depending on the number of options which are displayed. In this example, we use the value `Infinity` to tell Select2 to never display the search box.

<div class="s2-example">
    <select class="js-example-basic-hide-search js-states form-control"></select>
</div>

<pre data-fill-from=".js-code-example-basic-hide-search"></pre>

<script type="text/javascript" class="js-code-example-basic-hide-search">

$(".js-example-basic-hide-search").select2({
  minimumResultsForSearch: Infinity
});

</script>
