---
title: Retrieving selections
metadata:
    description: There are two ways to programmatically access the current selection data: using `.select2('data')`, or by using a jQuery selector.
taxonomy:
    category: docs
---

There are two ways to programmatically access the current selection data: using `.select2('data')`, or by using a jQuery selector.

## Using the `data` method

Calling `select2('data')` will return a JavaScript array of objects representing the current selection. Each object will contain all of the properties/values that were in the source data objects passed through `processResults` and `templateResult` callbacks.

```
$('#mySelect2').select2('data');
```

## Using a jQuery selector

Selected items can also be accessed via the `:selected` jQuery selector:

```
$('#mySelect2').find(':selected');
```

It is possible to extend the `<option>` elements representing the current selection(s) with HTML `data-*` attributes to contain arbitrary data from the source data objects:

```
$('#mySelect2').select2({
  // ...
  templateSelection: function (data, container) {
    // Add custom attributes to the <option> tag for the selected option
    $(data.element).attr('data-custom-attribute', data.customValue);
    return data.text;
  }
});

// Retrieve custom attribute value of the first selected element
$('#mySelect2').find(':selected').data('custom-attribute');
```

>>>> Do not rely on the `selected` attribute of `<option>` elements to determine the currently selected item(s).  Select2 does not add the `selected` attribute when an element is created from a remotely-sourced option.  See [this issue](https://github.com/select2/select2/issues/3366#issuecomment-102566500) for more information.
