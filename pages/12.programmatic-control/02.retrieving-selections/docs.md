---
title: Retrieving selections
metadata:
    description: There are two ways to programmatically access the current selection data: using `.select2('data')`, or by using a jQuery selector.
taxonomy:
    category: docs
---

There are two ways to programmatically access the current selection data: using `.select2('data')`, or by using a jQuery selector.

## Using the `data` method

Calling `select2('data')` will return a JavaScript array of objects representing the current selection. Each object will contain all of the properties/values that were in the source data objects passed through `processResults` and `templateResult` callbacks (as in <a href="#data">Loading data from an array</a> and <a href="#ajax">Connecting to a remote data source</a>).

```
$('#mySelect2').select2('data');
```

## Using a jQuery selector

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
