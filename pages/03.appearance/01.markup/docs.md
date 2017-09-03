---
title: Basic markup
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

A standard `<select>` box contains any number of `<option>` elements.  Each of these is rendered as an option in the dropdown menu.  Select2 preserves this behavior when initialized on a `<select>` element that contains `<option>` elements.

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
