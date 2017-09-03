---
title: Methods
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

Select2 supports methods that allow programmatic control of the component.  

## Selecting a value

To programmatically select a value for a Select2 control, use the jQuery `.val()` method:

```
$('select').val('US'); // Select the option with a value of 'US'
$('select').trigger('change'); // Notify any JS components that the value changed
```

Select2 will listen for the `change` event on the `<select>` element that it is attached to. When you make any external changes that need to be reflected in Select2 (such as changing the value), you should trigger this event.

### Limiting the scope of the `change` event

It's common for other components to be listening to the `change` event, or for custom event handlers to be attached that may have side effects.  To limit the scope to **only** notify Select2 of the change, use the `.select2` event namespace:

```
$('select').val('US'); // Change the value or make some change to the internal state
$('select').trigger('change.select2'); // Notify only Select2 of changes
```

## Retrieving the selected values

There are two ways to programmatically access the selection data: using `.select2('data')`, or by using a jQuery selector.

### Using the `data` method

Calling `select2('data')` will return a JavaScript array of objects representing the current selection. Each object will contain all of the properties/values that were in the source data objects passed through `processResults` and `templateResult` callbacks (as in <a href="#data">Loading data from an array</a> and <a href="#ajax">Connecting to a remote data source</a>).

```
$('select').select2('data');
```

### Using a jQuery selector

Selected items can also be accessed via the `:selected` jQuery selector:

```
$('select').find(':selected');
```

It is possible to extend the `<option>` elements representing selection with the HTML data-* attributes containing arbitrary data from the source data objects:

```
$('select').select2({
  // ...
  templateSelection: function (data, container) {
    $(data.element).attr('data-custom-attribute', data.customValue);
    return data.text;
  }
});

// Retrieve custom attribute value of the first selected element
$('select').find(':selected').attr('data-custom-attribute')
```

## Opening the dropdown

Methods handled directly by Select2 can be invoked by passing the name of the method to `.select2(...)`.

The `open` method will cause the dropdown menu to open, displaying the selectable options:

```
$('select').select2('open');
```

## Closing the dropdown

The `close` method will cause the dropdown menu to close, hiding the selectable options:

```
$('select').select2('close');
```

## Destroying the Select2 control

The `destroy` method will remove the Select2 widget from the target element.  It will revert back to a standard `select` control:
  
```
$('select').select2('destroy');
```

## Clearing selections

You may clear all current selections in a Select2 control by setting the value of the control to `null`:

```
$('select').val(null).trigger('change');
```

## Examples

<div class="s2-example">

    <label for="select2-single">Single select</label>
    
    <button class="js-programmatic-set-val button" aria-label="Set Select2 option">
      Set "California"
    </button>
    
    <button class="js-programmatic-open button">
      Open
    </button>
    
    <button class="js-programmatic-close button">
      Close
    </button>
    
    <button class="js-programmatic-destroy button">
      Destroy
    </button>
    
    <button class="js-programmatic-init button">
      Re-initialize
    </button>
    <p>
      <select id="select2-single" class="js-example-programmatic js-states form-control"></select>
    </p>
    
    <label for="select2-multi">Multiple select</label>

    <button type="button" class="js-programmatic-multi-set-val button" aria-label="Programmatically set Select2 options">
      Set to California and Alabama
    </button>
    
    <button type="button" class="js-programmatic-multi-clear button" aria-label="Programmatically clear Select2 options">
      Clear
    </button>

    <p>
      <select id="select2-multi" class="js-example-programmatic-multi js-states form-control" multiple="multiple"></select>
    </p>

</div>

<pre data-fill-from=".js-code-programmatic"></pre>

<script type="text/javascript" class="js-code-programmatic">

var $example = $(".js-example-programmatic").select2();
var $exampleMulti = $(".js-example-programmatic-multi").select2();

$(".js-programmatic-set-val").on("click", function () { $example.val("CA").trigger("change"); });

$(".js-programmatic-open").on("click", function () { $example.select2("open"); });
$(".js-programmatic-close").on("click", function () { $example.select2("close"); });

$(".js-programmatic-init").on("click", function () { $example.select2(); });
$(".js-programmatic-destroy").on("click", function () { $example.select2("destroy"); });

$(".js-programmatic-multi-set-val").on("click", function () { $exampleMulti.val(["CA", "AL"]).trigger("change"); });
$(".js-programmatic-multi-clear").on("click", function () { $exampleMulti.val(null).trigger("change"); });

</script>
