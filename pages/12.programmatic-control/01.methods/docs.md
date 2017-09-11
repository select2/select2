---
title: Methods
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

Select2 supports methods that allow programmatic control of the component.  

## Programmatically adding options

New options can be added to a Select2 control programmatically by creating a new [Javascript `Option` object](https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement/Option) and appending it to the control:

```
var data = {
    id: 1,
    text: 'Barn owl'
};

var newOption = new Option(data.name, data.id, false, false);
$('#mySelect2').append(newOption).trigger('change');
```

The third parameter of `new Option(...)` determines whether the item is "default selected"; i.e. it sets the `selected` attribute for the new option.  The fourth parameter sets the options actual selected state - if set to `true`, the new option will be selected by default.

### Create if not exists

You can use `.find` to select the option if it already exists, and create it otherwise:

```
// Set the value, creating a new option if necessary
if ($('#mySelect2').find("option[value='" + data.id + "']").length) {
    $('#mySelect2').val(data.id).trigger('change');
} else { 
    // Create a DOM Option and pre-select by default
    var newOption = new Option(data.name, data.id, true, true);
    // Append it to the select
    $('#mySelect2').append(newOption).trigger('change');
} 
```

## Selecting an option

To programmatically select an option/value for a Select2 control, use the jQuery `.val()` method:

```
$('#mySelect2').val('US'); // Select the option with a value of 'US'
$('#mySelect2').trigger('change'); // Notify any JS components that the value changed
```

Select2 will listen for the `change` event on the `<select>` element that it is attached to. When you make any external changes that need to be reflected in Select2 (such as changing the value), you should trigger this event.

### Preselecting options in an remotely-sourced (AJAX) Select2 

For Select2 controls that receive their data from an [AJAX source](/data-sources/ajax), using `.val()` will not work.  The options won't exist yet, because the AJAX request is not fired until the control is opened and/or the user begins searching.  This is further complicated by server-side filtering and pagination - there is no guarantee when a particular item will actually be loaded into the Select2 control!

The best way to deal with this, therefore, is to simply add the preselected item as a new option.  For remotely sourced data, this will probably involve creating a new API endpoint in your server-side application that can retrieve individual items:

```
// Set up the Select2 control
$('#mySelect2').select2({
    ajax: {
        url: '/api/students'
    }
});

// Fetch the preselected item, and add to the control
var studentSelect = $('#mySelect2');
$.ajax({
    type: 'GET',
    url: '/api/students/s/' + studentId
}).then(function (data) {
    // create the option and append to Select2
    var option = new Option(data.full_name, data.id, true, true);
    studentSelect.append(option).trigger('change');

    // manually trigger the `select2:select` event
    studentSelect.trigger({
        type: 'select2:select',
        params: {
            data: data
        }
    });
});
```

Notice that we manually trigger the `select2:select` event and pass along the entire `data` object.  This allows other handlers to [access additional properties of the selected item](/programmatic-control/events#triggering-events).

### Limiting the scope of the `change` event

It's common for other components to be listening to the `change` event, or for custom event handlers to be attached that may have side effects.  To limit the scope to **only** notify Select2 of the change, use the `.select2` event namespace:

```
$('#mySelect2').val('US'); // Change the value or make some change to the internal state
$('#mySelect2').trigger('change.select2'); // Notify only Select2 of changes
```

## Retrieving the selected values

There are two ways to programmatically access the selection data: using `.select2('data')`, or by using a jQuery selector.

### Using the `data` method

Calling `select2('data')` will return a JavaScript array of objects representing the current selection. Each object will contain all of the properties/values that were in the source data objects passed through `processResults` and `templateResult` callbacks (as in <a href="#data">Loading data from an array</a> and <a href="#ajax">Connecting to a remote data source</a>).

```
$('#mySelect2').select2('data');
```

### Using a jQuery selector

Selected items can also be accessed via the `:selected` jQuery selector:

```
$('#mySelect2').find(':selected');
```

It is possible to extend the `<option>` elements representing selection with the HTML data-* attributes containing arbitrary data from the source data objects:

```
$('#mySelect2').select2({
  // ...
  templateSelection: function (data, container) {
    $(data.element).attr('data-custom-attribute', data.customValue);
    return data.text;
  }
});

// Retrieve custom attribute value of the first selected element
$('#mySelect2').find(':selected').attr('data-custom-attribute')
```

## Opening the dropdown

Methods handled directly by Select2 can be invoked by passing the name of the method to `.select2(...)`.

The `open` method will cause the dropdown menu to open, displaying the selectable options:

```
$('#mySelect2').select2('open');
```

## Closing the dropdown

The `close` method will cause the dropdown menu to close, hiding the selectable options:

```
$('#mySelect2').select2('close');
```

## Checking if the plugin is initialized

To test whether Select2 has been initialized on a particular DOM element, you can check for the `select2-hidden-accessible` class:

```
if ($('#mySelect2').hasClass("select2-hidden-accessible")) {
    // Select2 has been initialized
}
```

See [this Stack Overflow answer](https://stackoverflow.com/a/29854133/2970321)).

## Destroying the Select2 control

The `destroy` method will remove the Select2 widget from the target element.  It will revert back to a standard `select` control:
  
```
$('#mySelect2').select2('destroy');
```

## Clearing selections

You may clear all current selections in a Select2 control by setting the value of the control to `null`:

```
$('#mySelect2').val(null).trigger('change');
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

$(".js-programmatic-set-val").on("click", function () {
    $example.val("CA").trigger("change");
});

$(".js-programmatic-open").on("click", function () {
    $example.select2("open");
});

$(".js-programmatic-close").on("click", function () {
    $example.select2("close");
});

$(".js-programmatic-init").on("click", function () {
    $example.select2();
});

$(".js-programmatic-destroy").on("click", function () {
    $example.select2("destroy");
});

$(".js-programmatic-multi-set-val").on("click", function () {
    $exampleMulti.val(["CA", "AL"]).trigger("change");
});

$(".js-programmatic-multi-clear").on("click", function () {
    $exampleMulti.val(null).trigger("change");
});

</script>
