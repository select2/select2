---
title: Methods
metadata:
    description: Select2 has several built-in methods that allow programmatic control of the component. 
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

Select2 has several built-in methods that allow programmatic control of the component.  

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

### Event unbinding

When you destroy a Select2 control, Select2 will only unbind the events that were automatically bound by the plugin.  Any events that you bind in your own code, **including any [Select2 events](/programmatic-control/events) that you explicitly bind,** will need to be unbound manually using the `.off` jQuery method:

```
// Set up a Select2 control
$('#example').select2();

// Bind an event
$('#example').on('select2:select', function (e) { 
    console.log('select event');
});

// Destroy Select2
$('#example').select2('destroy');

// Unbind the event
$('#example').off('select2:select');
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
