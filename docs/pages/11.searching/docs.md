---
title: Search
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

A search box is added to the top of the dropdown automatically for select boxes where only a single option can be selected. The behavior and appearance of the search box can be easily customized with Select2.

## Customizing how results are matched

When users filter down the results by entering search terms into the search box, Select2 uses an internal "matcher" to match search terms to results. You may customize the way that Select2 matches search terms by specifying a callback for the `matcher` configuration option.

Select2 will pass each option as represented by its [internal representation](/options) into this callback to determine if it should be displayed:

```
function matchCustom(params, data) {
    // If there are no search terms, return all of the data
    if ($.trim(params.term) === '') {
      return data;
    }

    // Do not display the item if there is no 'text' property
    if (typeof data.text === 'undefined') {
      return null;
    }

    // `params.term` should be the term that is used for searching
    // `data.text` is the text that is displayed for the data object
    if (data.text.indexOf(params.term) > -1) {
      var modifiedData = $.extend({}, data, true);
      modifiedData.text += ' (matched)';
   
      // You can return modified objects from here
      // This includes matching the `children` how you want in nested data sets
      return modifiedData;
    }
   
    // Return `null` if the term should not be displayed
    return null;
}
    
$(".js-example-matcher").select2({
  matcher: matchCustom
});
```

>>>> `matcher` only works with **locally supplied data** (e.g., via an [array](/data-sources/arrays)!  When a remote data set is used, Select2 expects that the returned results have already been filtered on the server side.

### Matching grouped options

Only first-level objects will be passed in to the `matcher` callback.  If you are working with nested data, you must iterate through the `children` array and match them individually.  This allows for more advanced matching when working with nested objects, allowing you to handle them however you want.

This example matches results only if the term appears in the beginning of the string:

<div class="s2-example">
    <select class="js-example-matcher-start js-states form-control"></select>
</div>

<pre data-fill-from=".js-code-example-matcher"></pre>

<script type="text/javascript" class="js-code-example-matcher">

function matchStart(params, data) {
  // If there are no search terms, return all of the data
  if ($.trim(params.term) === '') {
    return data;
  }

  // Skip if there is no 'children' property
  if (typeof data.children === 'undefined') {
    return null;
  }

  // `data.children` contains the actual options that we are matching against
  var filteredChildren = [];
  $.each(data.children, function (idx, child) {
    if (child.text.toUpperCase().indexOf(params.term.toUpperCase()) == 0) {
      filteredChildren.push(child);
    }
  });

  // If we matched any of the timezone group's children, then set the matched children on the group
  // and return the group object
  if (filteredChildren.length) {
    var modifiedData = $.extend({}, data, true);
    modifiedData.children = filteredChildren;

    // You can return modified objects from here
    // This includes matching the `children` how you want in nested data sets
    return modifiedData;
  }

  // Return `null` if the term should not be displayed
  return null;
}

$(".js-example-matcher-start").select2({
  matcher: matchStart
});

</script>

>>> A [compatibility module](/upgrading/migrating-from-35#wrapper-for-old-style-matcher-callbacks) exists for using v3-style matcher callbacks.

## Minimum search term length

Sometimes when working with large data sets, it is more efficient to start filtering the results only when the search term is a certain length. This is very common when working with remote data sets, as it allows for only significant search terms to be used.

You may set a minimum search term length  by using the `minimumInputLength` option:

```
$('select').select2({
  minimumInputLength: 3 // only start searching when the user has input 3 or more characters
});
```

## Maximum search term length

In some cases, search terms need to be limited to a certain range. Select2 allows you to limit the length of the search term such that it does not exceed a certain length.

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

### Single select

For single selects, Select2 allows you to hide the search box using the `minimumResultsForSearch` configuration option. In this example, we use the value `Infinity` to tell Select2 to never display the search box.

<div class="s2-example">
    <select id="js-example-basic-hide-search" class="js-states form-control"></select>
</div>

<pre data-fill-from="#js-code-example-basic-hide-search"></pre>

<script type="text/javascript" id="js-code-example-basic-hide-search">

$("#js-example-basic-hide-search").select2({
    minimumResultsForSearch: Infinity
});

</script>

### Multi-select

For multi-select boxes, there is no distinct search control. So, to disable search for multi-select boxes, you will need to set the `disabled` property to true whenever the dropdown is opened or closed:

<div class="s2-example">
    <select id="js-example-basic-hide-search-multi" class="js-states form-control" multiple="multiple"></select>
</div>

<pre data-fill-from="#js-code-example-basic-hide-search-multi"></pre>

<script type="text/javascript" id="js-code-example-basic-hide-search-multi">

$('#js-example-basic-hide-search-multi').select2();

$('#js-example-basic-hide-search-multi').on('select2:opening select2:closing', function( event ) {
    var $searchfield = $(this).parent().find('.select2-search__field');
    $searchfield.prop('disabled', true);
});
</script>

See [this issue](https://github.com/select2/select2/issues/4797) for the source of this solution.
