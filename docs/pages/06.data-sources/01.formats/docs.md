---
title: The Select2 data format
taxonomy:
    category: docs
---

Select2 can render programmatically supplied data from an array or remote data source (AJAX) as dropdown options.  In order to accomplish this, Select2 expects a very specific data format.  This format consists of a JSON object containing an array of objects keyed by the `results` key.

```
{
  "results": [
    {
      "id": 1,
      "text": "Option 1"
    },
    {
      "id": 2,
      "text": "Option 2"
    }
  ],
  "pagination": {
    "more": true
  }
}
```

Select2 requires that each object contain an `id` and a `text` property.  Additional parameters passed in with data objects will be included on the data objects that Select2 exposes.

The response object may also contain pagination data, if you would like to use the "infinite scroll" feature.  This should be specified under the `pagination` key.

## Selected and disabled options

You can also supply the `selected` and `disabled` properties for the options in this data structure.  For example:

```
{
  "results": [
    {
      "id": 1,
      "text": "Option 1"
    },
    {
      "id": 2,
      "text": "Option 2",
      "selected": true
    },
    {
      "id": 3,
      "text": "Option 3",
      "disabled": true
    }
  ]
}
```

In this case, Option 2 will be pre-selected, and Option 3 will be [disabled](/options#disabling-options).

## Transforming data into the required format

### Generating `id` properties

Select2 requires that the `id` property is used to uniquely identify the options that are displayed in the results list. If you use a property other than `id` (like `pk`) to uniquely identify an option, you need to map your old property to `id` before passing it to Select2.

If you cannot do this on your server or you are in a situation where the API cannot be changed, you can do this in JavaScript before passing it to Select2:

```
var data = $.map(yourArrayData, function (obj) {
  obj.id = obj.id || obj.pk; // replace pk with your identifier

  return obj;
});
```

### Generating `text` properties

Just like with the `id` property, Select2 requires that the text that should be displayed for an option is stored in the `text` property. You can map this property from any existing property using the following JavaScript:

```
var data = $.map(yourArrayData, function (obj) {
  obj.text = obj.text || obj.name; // replace name with the property used for the text

  return obj;
});
```

## Automatic string casting

Because the `value` attribute on a `<select>` tag must be a string, and Select2 generates the `value` attribute from the `id` property of the data objects, the `id` property on each data object must also be a string.

Select2 will attempt to convert anything that is not a string to a string, which will work for most situations, but it is recommended to explicitly convert your `id`s to strings ahead of time.

Blank `id`s or an `id` with a value of `0` are not permitted.

## Grouped data

When options are to be generated in `<optgroup>` sections, options should be nested under the `children` key of each group object.  The label for the group should be specified as the `text` property on the group's corresponding data object.

```
{
  "results": [
    { 
      "text": "Group 1", 
      "children" : [
        {
            "id": 1,
            "text": "Option 1.1"
        },
        {
            "id": 2,
            "text": "Option 1.2"
        }
      ]
    },
    { 
      "text": "Group 2", 
      "children" : [
        {
            "id": 3,
            "text": "Option 2.1"
        },
        {
            "id": 4,
            "text": "Option 2.2"
        }
      ]
    }
  ],
  "pagination": {
    "more": true
  }
}
```

>>>> Because Select2 generates an `<optgroup>` when creating nested options, only [a single level of nesting is supported](/options#dropdown-option-groups). Any additional levels of nesting is not guaranteed to be displayed properly across all browsers and devices.
