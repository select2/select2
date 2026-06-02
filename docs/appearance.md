The appearance of your Select2 controls can be customized via the standard HTML attributes for `<select>` elements, as well as various [configuration options](configuration/options-api.md).

## Disabling a Select2 control

Select2 will respond to the `disabled` attribute on `<select>` elements. You can also initialize Select2 with `disabled: true` to get the same effect.

<select class="js-example-disabled js-states" disabled="disabled"></select>

<select class="js-example-disabled-multi js-states" multiple="multiple" disabled="disabled"></select>

<div role="group" aria-label="Programmatic enabling and disabling">
  <button type="button" class="js-programmatic-enable md-button">
    Enable
  </button>
  <button type="button" class="js-programmatic-disable md-button">
    Disable
  </button>
</div>

```javascript
$(".js-example-disabled").select2();
$(".js-example-disabled-multi").select2();

$(".js-programmatic-enable").on("click", function() {
    $(".js-example-disabled").prop("disabled", false);
    $(".js-example-disabled-multi").prop("disabled", false);
});

$(".js-programmatic-disable").on("click", function() {
    $(".js-example-disabled").prop("disabled", true);
    $(".js-example-disabled-multi").prop("disabled", true);
});
```

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

<label for="id_label_single">
  Click this to focus the single select element
  <select class="js-example-basic-single js-states" id="id_label_single"></select>
</label>

<label for="id_label_multiple">
  Click this to focus the multiple select element
  <select class="js-example-basic-multiple js-states" id="id_label_multiple" multiple="multiple"></select>
</label>

```html
<label for="id_label_single">
 Click this to highlight the single select element
 <select class="js-example-basic-single js-states" id="id_label_single">
 </select>
</label>
<label for="id_label_multiple">
 Click this to highlight the multiple select element
 <select class="js-example-basic-multiple js-states" id="id_label_multiple" multiple="multiple">
 </select>
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

Select2 will try to match the width of the original element as closely as possible. Sometimes this isn't perfect, in which case you may manually set the `width` [configuration option](configuration/options-api.md):

| Value     | Description                                                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `element` | Uses the computed element width from any applicable CSS rules.                                                                      |
| `style`   | Width is determined from the `select` element's `style` attribute. If no `style` attribute is found, null is returned as the width. |
| `resolve` | Uses the `style` attribute value if available, falling back to the computed element width as necessary.                             |
| `<value>` | Valid CSS values can be passed as a string (e.g. `width: '80%'`                                                                     |

### Example

The two Select2 boxes below are styled to `50%` and `75%` width respectively to support responsive design:

<select class="js-example-responsive js-states" style="width: 50%"></select>

<select class="js-example-responsive js-states" multiple="multiple" style="width: 75%"></select>

```html
<select class="js-example-responsive" style="width: 50%">
</select>
<select class="js-example-responsive" multiple="multiple" style="width: 75%">
</select>
```

```javascript
$(".js-example-responsive").select2({
    width: 'resolve' // need to override the changed default
});
```

<script type="text/javascript" class="js-code-example-responsive">
$(".js-example-responsive").select2({
    width: 'resolve' // need to override the changed default
});
</script>

> [!WARNING]
> Select2 will do its best to resolve the percent width specified via a CSS class, but it is not always possible. The best way to ensure that Select2 is using a percent based width is to inline the `style` declaration into the tag.

## Themes

Select2 supports custom themes using the `theme` option so you can style Select2 to match the rest of your application.

These examples use the `classic` theme, which matches the old look of Select2.

<select class="js-example-theme-single js-states"></select>

<select class="js-example-theme-multiple js-states" multiple="multiple"></select>

```javascript
$(".js-example-theme-single").select2({
    theme: "classic"
});

$(".js-example-theme-multiple").select2({
    theme: "classic"
});
```

<script type="text/javascript" class="js-code-example-theme">
$(".js-example-theme-single").select2({
  theme: "classic"
});

$(".js-example-theme-multiple").select2({
  theme: "classic"
});
</script>

Various display options of the Select2 component can be changed. You can access the `<option>` element (or `<optgroup>`) and any attributes on those elements using `.element`.
