---
title: Selections
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

When a selection is made by the user, Select2 will convert the selected `<option>` element into a JSON object based on the following rules:

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

By default, Select2 will then display the `text` property of the selected result.

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
    '<span><img src="' + baseUrl + '/' + state.element.value.toLowerCase() + '.png" class="img-flag" /> ' + state.text + '</span>'
  );
  return $state;
};

$(".js-example-templating").select2({
  templateSelection: formatState
});

</script>

If your selection template contains HTML, you must wrap your rendered result in a jQuery object. Otherwise, Select2 will assume that your template only returns text and will escape it.  You may find it helpful to use a client-side templating engine like [Handlebars](http://handlebarsjs.com/) to define your templates.

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

You can allow users to clear their current selections with the `allowClear` option when initializing Select2. Setting this option to `true` will enable an "x" icon that will reset the selection to the placeholder.

```
$('select').select2({
  placeholder: 'This is my placeholder',
  allowClear: true
});
```
