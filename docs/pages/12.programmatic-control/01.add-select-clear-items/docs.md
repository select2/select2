---
title: Add, select, or clear items
metadata:
    description: Programmatically adding, selecting, and clearing options in a Select2 control.
taxonomy:
    category: docs
---

## Creating new options in the dropdown

New options can be added to a Select2 control programmatically by creating a new [Javascript `Option` object](https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement/Option) and appending it to the control:

```
var data = {
    id: 1,
    text: 'Barn owl'
};

var newOption = new Option(data.text, data.id, false, false);
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
    var newOption = new Option(data.text, data.id, true, true);
    // Append it to the select
    $('#mySelect2').append(newOption).trigger('change');
} 
```

## Selecting options

To programmatically select an option/item for a Select2 control, use the jQuery `.val()` method:

```
$('#mySelect2').val('1'); // Select the option with a value of '1'
$('#mySelect2').trigger('change'); // Notify any JS components that the value changed
```

You can also pass an array to `val` make multiple selections:

```
$('#mySelect2').val(['1', '2']);
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

## Clearing selections

You may clear all current selections in a Select2 control by setting the value of the control to `null`:

```
$('#mySelect2').val(null).trigger('change');
```
