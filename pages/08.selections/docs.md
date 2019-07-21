---
title: Selections
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

When an option is selected from the dropdown menu, Select2 will display the selected value in the container box.  By default, it will display the `text` property of Select2's [internal representation of the selected option](/options).

## Templating

The appearance of selected results can be customized by using the `templateSelection` configuration option.  This takes a callback that transforms the selection data object into a string representation or jQuery object:

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
    '<span><img class="img-flag" /> <span></span></span>'
  );

  // Use .text() instead of HTML string concatenation to avoid script injection issues
  $state.find("span").text(state.text);
  $state.find("img").attr("src", baseUrl + "/" + state.element.value.toLowerCase() + ".png");

  return $state;
};

$(".js-example-templating").select2({
  templateSelection: formatState
});

</script>

>>> You may find it helpful to use a client-side templating engine like [Handlebars](http://handlebarsjs.com/) to define your templates.

### Built-in escaping

By default, strings returned by `templateSelection` are assumed to **contain only text** and will be passed through the `escapeMarkup` function, which strips any HTML markup.

If you need to render HTML with your selection template, you must wrap your rendered selection in a jQuery object. In this case, the selection will be passed [directly to `jQuery.fn.append`](https://api.jquery.com/append/) and will be handled directly by jQuery.  Any markup, such as HTML, will not be escaped and it is up to you to escape any malicious input provided by users.

>>>> Anything rendered as a selection is templated.  This includes placeholders and pre-existing selections that are displayed, so you must ensure that your templating functions can support them.

## Limiting the number of selections

Select2 multi-value select boxes can set restrictions regarding the maximum number of options that can be selected. The select below is declared with the `multiple` attribute with `maximumSelectionLength` in the select2 options.

<div class="s2-example">
    <p>
      <select class="js-example-basic-multiple-limit js-states form-control" multiple="multiple"></select>
    </p>
</div>

<pre data-fill-from=".js-code-placeholder"></pre>

<script type="text/javascript" class="js-code-placeholder">

$(".js-example-basic-multiple-limit").select2({
  maximumSelectionLength: 2
});

</script>

## Clearable selections

When set to `true`, causes a clear button ("x" icon) to appear on the select box when a value is selected. Clicking the clear button will clear the selected value, effectively resetting the select box back to its placeholder value.

```
$('select').select2({
  placeholder: 'This is my placeholder',
  allowClear: true
});
```
