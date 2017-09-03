---
title: Dropdown
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

This chapter covers the appearance and behavior of the list of results in the dropdown menu.

## Templating

By default, Select2 will display the `text` property of each data object within the list of results.  The appearance of search results in the dropdown can be customized by using the `templateResult` option:

<div class="s2-example">
    <select class="js-example-templating js-states form-control"></select>
</div>

<pre data-fill-from=".js-code-example-templating"></pre>

<script type="text/javascript" class="js-code-example-templating">

function formatState (state) {
  if (!state.id) {
    return state.text;
  }
  var baseUrl = "{{ url('user://pages/images/flags') }}";
  var $state = $(
    '<span><img src="' + baseUrl + '/' + state.element.value.toLowerCase() + '.png" class="img-flag" /> ' + state.text + '</span>'
  );
  return $state;
};

$(".js-example-templating").select2({
  templateResult: formatState
});

</script>

The `templateResult` function should return a string containing the text to be displayed, or an object (such as a jQuery object) that contains the data that should be displayed.  It can also return `null`, which will prevent the option from being displayed in the results list.

>>> You may find it helpful to use a client-side templating engine like [Handlebars](http://handlebarsjs.com/) to define your templates.

### Built-in escaping

By default, strings returned by `templateResult` are assumed to **contain only text** and will be passed through the `escapeMarkup` function, which strips any HTML markup.

If you need to render HTML with your result template, you must wrap your rendered result in a jQuery object. In this case, the result will be passed [directly to `jQuery.fn.append`](https://api.jquery.com/append/) and will be handled directly by jQuery.  Any markup, such as HTML, will not be escaped and it is up to you to escape any malicious input provided by users.

>>> **Anything rendered in the results is templated.** This includes results such as the "Searching..." and "Loading more..." text which will periodically be displayed, which allows you to add more advanced formatting to these automatically generated options.  You must ensure that your templating functions can support them.

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
