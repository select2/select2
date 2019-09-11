---
title: Basic usage
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

## Single select boxes

Select2 was designed to be a replacement for the standard `<select>` box that is displayed by the browser.  By default it supports all options and operations that are available in a standard select box, but with added flexibility.

Select2 can take a regular select box like this...

<select class="js-states form-control"></select>

and turn it into this...

<div class="s2-example">
    <select class="js-example-basic-single js-states form-control"></select>
</div>

```
<select class="js-example-basic-single" name="state">
  <option value="AL">Alabama</option>
    ...
  <option value="WY">Wyoming</option>
</select>
```

<script type="text/javascript" class="js-code-example-basic-single">
$(document).ready(function() {
    $('.js-example-basic-single').select2();
});
</script>

Select2 will register itself as a jQuery function if you use any of the distribution builds, so you can call `.select2()` on any jQuery selector where you would like to initialize Select2.

```
// In your Javascript (external .js resource or <script> tag)
$(document).ready(function() {
    $('.js-example-basic-single').select2();
});
```

>>>>>> The DOM cannot be safely manipulated until it is "ready".  To make sure that your DOM is ready before the browser initializes the Select2 control, wrap your code in a [`$(document).ready()`](https://learn.jquery.com/using-jquery-core/document-ready/) block.  Only one `$(document).ready()` block is needed per page.

## Multi-select boxes (pillbox)

Select2 also supports multi-value select boxes. The select below is declared with the `multiple` attribute.

<div class="s2-example">
  <p>
    <select class="js-example-basic-multiple js-states form-control" multiple="multiple"></select>
  </p>
</div>

**In your HTML:**

```
<select class="js-example-basic-multiple" name="states[]" multiple="multiple">
  <option value="AL">Alabama</option>
    ...
  <option value="WY">Wyoming</option>
</select>
```

**In your Javascript (external `.js` resource or `<script>` tag):**

```
$(document).ready(function() {
    $('.js-example-basic-multiple').select2();
});
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
