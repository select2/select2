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
$('#mySelect2').select2({
  selectOnClose: true
});
```

## Forcing the dropdown to remain open after selection

Select2 will automatically close the dropdown when an element is selected, similar to what is done with a normal select box.  You may use the `closeOnSelect` option to prevent the dropdown from closing when a result is selected:

```
$('#mySelect2').select2({
  closeOnSelect: false
});
```

Note that this option is only applicable to multi-select controls.

>>> If the [`CloseOnSelect` decorator](/advanced/default-adapters/dropdown#closeonselect) is not used (or `closeOnSelect` is set to <code>false</code>), the dropdown will not automatically close when a result is selected.  The dropdown will also never close if the <kbd>ctrl</kbd> key is held down when the result is selected.

## Dropdown placement

>>>>> Attention [Harvest Chosen](https://harvesthq.github.io/chosen/) migrators!  If you are migrating to Select2 from Chosen, this option will cause Select2 to position the dropdown in a similar way.

By default, Select2 will attach the dropdown to the end of the body and will absolutely position it to appear above or below the selection container.

Select2 will display the dropdown above the container if there is not enough space below the container, but there is enough space above it.

The `dropdownParent` option allows you to pick an alternative element for the dropdown to be appended to:

```
$('#mySelect2').select2({
  dropdownParent: $('#myModal')
});
```

This is useful when attempting to render Select2 correctly inside of modals and other small containers.  If you're having trouble using the search box inside a Bootstrap modal, for example, trying setting the `dropdownParent` option to the modal element.

If you are rendering a Select2 inside of a modal (Bootstrap 3.x) that has not yet been rendered or opened, you may need to bind to the `shown.bs.modal` event:

```
$('body').on('shown.bs.modal', '.modal', function() {
  $(this).find('select').each(function() {
    var dropdownParent = $(document.body);
    if ($(this).parents('.modal.in:first').length !== 0)
      dropdownParent = $(this).parents('.modal.in:first');
    $(this).select2({
      dropdownParent: dropdownParent
      // ...
    });
  });
});
```

If you run into positioning issues while using the default `body` attachment, you may find it helpful to use your browser console to inspect the values of:

- `document.body.style.position`
- `$(document.body).offset()`

See [this issue](https://github.com/select2/select2/issues/3970#issuecomment-160496724).

>>>> `dropdownParent` will cause DOM events to be raised outside of the standard Select2 DOM container. This can cause issues with third-party components such as modals.
