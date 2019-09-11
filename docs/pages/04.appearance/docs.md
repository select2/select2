---
title: Appearance
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

The appearance of your Select2 controls can be customized via the standard HTML attributes for `<select>` elements, as well as various [configuration options](/configuration).

## Disabling a Select2 control

Select2 will respond to the <code>disabled</code> attribute on `<select>` elements. You can also initialize Select2 with `disabled: true` to get the same effect.

<div class="s2-example">
  <p>
    <select class="js-example-disabled js-states form-control" disabled="disabled"></select>
  </p>

  <p>
    <select class="js-example-disabled-multi js-states form-control" multiple="multiple" disabled="disabled"></select>
  </p>
  <div class="btn-group btn-group-sm" role="group" aria-label="Programmatic enabling and disabling">
    <button type="button" class="js-programmatic-enable btn btn-default">
      Enable
    </button>
    <button type="button" class="js-programmatic-disable btn btn-default">
      Disable
    </button>
  </div>
</div>

<pre data-fill-from=".js-code-disabled"></pre>

<script type="text/javascript" class="js-code-disabled">

$(".js-example-disabled").select2();
$(".js-example-disabled-multi").select2();
  
$(".js-programmatic-enable").on("click", function () {
  $(".js-example-disabled").prop("disabled", false);
  $(".js-example-disabled-multi").prop("disabled", false);
});

$(".js-programmatic-disable").on("click", function () {
  $(".js-example-disabled").prop("disabled", true);
  $(".js-example-disabled-multi").prop("disabled", true);
});

</script>

## Labels

You can, and should, use a `<label>` with Select2, just like any other `<select>` element.

<div class="s2-example">
  <p>
    <label for="id_label_single">
      Click this to focus the single select element
      <select class="js-example-basic-single js-states form-control" id="id_label_single"></select>
    </label>
  </p>
  <p>
    <label for="id_label_multiple">
      Click this to focus the multiple select element
      <select class="js-example-basic-multiple js-states form-control" id="id_label_multiple" multiple="multiple"></select>
    </label>
  </p>
</div>

```
<label for="id_label_single">
  Click this to highlight the single select element

  <select class="js-example-basic-single js-states form-control" id="id_label_single"></select>
</label>

<label for="id_label_multiple">
  Click this to highlight the multiple select element

  <select class="js-example-basic-multiple js-states form-control" id="id_label_multiple" multiple="multiple"></select>
</label>
```

<script type="text/javascript">
  $.fn.select2.amd.require([
    "select2/core",
    "select2/utils"
  ], function (Select2, Utils, oldMatcher) {
    var $basicSingle = $(".js-example-basic-single");
    var $basicMultiple = $(".js-example-basic-multiple");

    $.fn.select2.defaults.set("width", "100%");

    $basicSingle.select2();
    $basicMultiple.select2();

    function formatState (state) {
      if (!state.id) {
        return state.text;
      }
      var $state = $(
        '<span>' +
          '<img src="vendor/images/flags/' +
            state.element.value.toLowerCase() +
          '.png" class="img-flag" /> ' +
          state.text +
        '</span>'
      );
      return $state;
    };
  });

</script>

## Container width

Select2 will try to match the width of the original element as closely as possible. Sometimes this isn't perfect, in which case you may manually set the `width` [configuration option](/configuration):

<table class="table table-striped table-bordered">
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>'element'</code></td>
      <td>
        Uses the computed element width from any applicable CSS rules.
      </td>
    </tr>
    <tr>
      <td><code>'style'</code></td>
      <td>
        Width is determined from the <code>select</code> element's <code>style</code> attribute. If no <code>style</code> attribute is found, null is returned as the width.
      </td>
    </tr>
    <tr>
      <td><code>'resolve'</code></td>
      <td>
        Uses the <code>style</code> attribute value if available, falling back to the computed element width as necessary.
      </td>
    </tr>
    <tr>
      <td><code>'&lt;value&gt;'</code></td>
      <td>
        Valid CSS values can be passed as a string (e.g. <code>width: '80%'</code>).
      </td>
    </tr>
  </tbody>
</table>

### Example

The two Select2 boxes below are styled to `50%` and `75%` width respectively to support responsive design:

<div class="s2-example">
  <p>
    <select class="js-example-responsive js-states" style="width: 50%"></select>
  </p>
  <p>
    <select class="js-example-responsive js-states" multiple="multiple" style="width: 75%"></select>
  </p>
</div>

```
<select class="js-example-responsive" style="width: 50%"></select>
<select class="js-example-responsive" multiple="multiple" style="width: 75%"></select>
```

<pre data-fill-from=".js-code-example-responsive"></pre>

<script type="text/javascript" class="js-code-example-responsive">

$(".js-example-responsive").select2({
    width: 'resolve' // need to override the changed default
});

</script>

>>>> Select2 will do its best to resolve the percent width specified via a CSS class, but it is not always possible. The best way to ensure that Select2 is using a percent based width is to inline the `style` declaration into the tag.

## Themes

Select2 supports custom themes using the `theme` option so you can style Select2 to match the rest of your application.

These examples use the `classic` theme, which matches the old look of Select2.

<div class="s2-example">
  <p>
    <select class="js-example-theme-single js-states form-control">
    </select>
  </p>
  <p>
    <select class="js-example-theme-multiple js-states form-control" multiple="multiple"></select>
  </p>
</div>

<pre data-fill-from=".js-code-example-theme"></pre>

<script type="text/javascript" class="js-code-example-theme">

$(".js-example-theme-single").select2({
  theme: "classic"
});

$(".js-example-theme-multiple").select2({
  theme: "classic"
});

</script>

Various display options of the Select2 component can be changed.  You can access the `<option>` element (or `<optgroup>`) and any attributes on those elements using `.element`.
