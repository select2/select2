## Single select boxes

Select2 was designed to be a replacement for the standard `<select>` box that is displayed by the browser. By default it supports all options and operations that are available in a standard select box, but with added flexibility.

Select2 can take a regular select box like this...

<select class="js-states"></select>

and turn it into this...

<select class="js-example-basic-single js-states"></select>

```html
<select class="js-example-basic-single" name="state">
  <option value="AL">
    Alabama
  </option>
  ...
  <option value="WY">
    Wyoming
  </option>
</select>
```

<script type="text/javascript" class="js-code-example-basic-single">
$(document).ready(function() {
  $('.js-example-basic-single').select2();
});
</script>

Select2 will register itself as a jQuery function if you use any of the distribution builds, so you can call `.select2()` on any jQuery selector where you would like to initialize Select2.

```javascript
// In your Javascript (external .js resource or <script> tag)
$(document).ready(function() {
  $('.js-example-basic-single').select2();
});
```

> [!TIP]
> The DOM cannot be safely manipulated until it is "ready". To make sure that your DOM is ready before the browser initializes the Select2 control, wrap your code in a [`$(document).ready()`](https://learn.jquery.com/using-jquery-core/document-ready/) block. Only one `$(document).ready()` block is needed per page.

## Multi-select boxes (pillbox)

Select2 also supports multi-value select boxes. The select below is declared with the `multiple` attribute.

<select class="js-example-basic-multiple js-states" multiple="multiple"></select>

**In your HTML:**

```html
<select class="js-example-basic-multiple" multiple="multiple" name="states[]">
  <option value="AL">
    Alabama
  </option>
  ...
  <option value="WY">
    Wyoming
  </option>
</select>
```

**In your Javascript (external `.js` resource or `<script>` tag):**

```javascript
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
