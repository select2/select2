---
title: Migrating from Select2 3.5
taxonomy:
    category: docs
---

Select2 offers limited backwards compatibility with the previous 3.5.x release line, allowing people to more efficiently transfer across releases and get the latest features. For many of the larger changes, such as the change in how custom data adapters work, compatibility modules were created that will be used to assist in the upgrade process. It is not recommended to rely on these compatibility modules as they will eventually be removed in future releases, but they make upgrading easier for major changes.

If you use the full build of Select2 (`select2.full.js`), you will be automatically notified of the major breaking changes, and [compatibility modules](/upgrading/backwards-compatibility) will be automatically applied to ensure that your code still behaves how you were expecting.

The compatibility modules are only included in the [full builds](/getting-started/builds-and-modules) of Select2. These files end in `.full.js`, and the compatibility modules are prefixed with `select2/compat`.

## No more hidden input tags

In past versions of Select2, an `<input type="hidden">` tag was recommended if you wanted to do anything advanced with Select2, such as work with remote data sources or allow users to add their own tags. This had the unfortunate side-effect of servers not receiving the data from Select2 as an array, like a standard `<select>` element does, but instead sending a string containing the comma-separated strings. The code base ended up being littered with special cases for the hidden input, and libraries using Select2 had to work around the differences it caused.

In Select2 4.0, the `<select>` element supports all core options, and support for the old `<input type="hidden">` has been deprecated. This means that if you previously declared an AJAX field with some pre-selected options that looked like:

```
<input type="hidden" name="select-boxes" value="1,2,4,6" />
```

It will need to be recreated as a `<select>` element with some `<option>` tags that have `value` attributes that match the old value:

```
<select name="select-boxes" multiple="multiple">
    <option value="1" selected="selected">Select2</option>
    <option value="2" selected="selected">Chosen</option>
    <option value="4" selected="selected">selectize.js</option>
    <option value="6" selected="selected">typeahead.js</option>
</select>
```

The options that you create should have `selected="selected"` set so Select2 and the browser knows that they should be selected. The `value` attribute of the option should also be set to the value that will be returned from the server for the result, so Select2 can highlight it as selected in the dropdown. The text within the option should also reflect the value that should be displayed by default for the option.

## Advanced matching of searches

In past versions of Select2 the `matcher` callback processed options at every level, which limited the control that you had when displaying results, especially in cases where there was nested data. The `matcher` function was only given the individual option, even if it was a nested options, without any context.

With the new [matcher function](/searching), only the root-level options are matched and matchers are expected to limit the results of any children options that they contain. This allows developers to customize how options within groups can be displayed, and modify how the results are returned.
 
### Wrapper for old-style `matcher` callbacks

For backwards compatibility, a wrapper function has been created that allows old-style matcher functions to be converted to the new style. 

This wrapper function is only bundled in the [full version of Select2](/getting-started/builds-and-modules).  You can retrieve the function from the `select2/compat/matcher` module, which should just wrap the old matcher function.

<div class="s2-example">
    <select class="js-example-matcher-compat js-states form-control"></select>
</div>

<pre data-fill-from=".js-code-example-matcher-compat"></pre>

<script type="text/javascript" class="js-code-example-matcher-compat">

function matchStart (term, text) {
  if (text.toUpperCase().indexOf(term.toUpperCase()) == 0) {
    return true;
  }

  return false;
}

$.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
  $(".js-example-matcher-compat").select2({
    matcher: oldMatcher(matchStart)
  })
});

</script>

>>>> This will work for any matchers that only took in the search term and the text of the option as parameters. If your matcher relied on the third parameter containing the jQuery element representing the original `<option>` tag, then you may need to slightly change your matcher to expect the full JavaScript data object being passed in instead. You can still retrieve the jQuery element from the data object using the `data.element` property.

## More flexible placeholders

In the most recent versions of Select2, placeholders could only be applied to the first (typically the default) option in a `<select>` if it was blank. The `placeholderOption` option was added to Select2 to allow users using the `select` tag to select a different option, typically an automatically generated option with a different value.

The [`placeholder` option](/placeholders) can now take an object as well as just a string. This replaces the need for the old `placeholderOption`, as now the `id` of the object can be set to the `value` attribute of the `<option>` tag.

For a select that looks like the following, where the first option (with a value of `-1`) is the placeholder option:

```
<select>
    <option value="-1" selected="selected">Select an option</option>
    <option value="1">Something else</option>
</select>
```

You would have previously had to get the placeholder option through the `placeholderOption`, but now you can do it through the `placeholder` option by setting an `id`.

```
$("select").select2({
    placeholder: {
        id: "-1",
        placeholder: "Select an option"
    }
});
```

And Select2 will automatically display the placeholder when the value of the select is `-1`, which it will be by default. This does not break the old functionality of Select2 where the placeholder option was blank by default.

## Display reflects the actual order of the values

In past versions of Select2, choices were displayed in the order that they were selected. In cases where Select2 was used on a `<select>` element, the order that the server received the selections did not always match the order that the choices were displayed, resulting in confusion in situations where the order is important.

Select2 will now order selected choices in the same order that will be sent to the server.

## Changed method and option names

When designing the future option set for Select2 4.0, special care was taken to ensure that the most commonly used options were brought over.  For the most part, the commonly used options of Select2 can still be referenced under their previous names, but there were some changes which have been noted.

### Removed the requirement of `initSelection`

>>>> **Deprecated in Select2 4.0.** This has been replaced by another option and is only available in the [full builds](/getting-started/builds-and-modules) of Select2.

In the past, whenever you wanted to use a custom data adapter, such as AJAX or tagging, you needed to help Select2 out in determining the initial
values that were selected. This was typically done through the `initSelection` option, which took the underlying data of the input and converted it into data objects that Select2 could use.

This is now handled by [the data adapter](/advanced/default-adapters/data) in the `current` method, which allows Select2 to convert the currently
selected values into data objects that can be displayed. The default implementation converts the text and value of `option` elements into data objects, and is probably suitable for most cases. An example of the old `initSelection` option is included below, which converts the value of the selected options into a data object with both the `id` and `text` matching the selected value.

```
{
    initSelection : function (element, callback) {
        var data = [];
        $(element.val()).each(function () {
            data.push({id: this, text: this});
        });
        callback(data);
    }
}
```

When using the new `current` method of the custom data adapter, **this method is called any time Select2 needs a list** of the currently selected options. This is different from the old `initSelection` in that it was only called once, so it could suffer from being relatively slow to process the data (such as from a remote data source).

```
$.fn.select2.amd.require([
    'select2/data/array',
    'select2/utils'
], function (ArrayData, Utils) {
    function CustomData ($element, options) {
        CustomData.__super__.constructor.call(this, $element, options);
    }

    Utils.Extend(CustomData, ArrayData);

    CustomData.prototype.current = function (callback) {
        var data = [];
        var currentVal = this.$element.val();

        if (!this.$element.prop('multiple')) {
            currentVal = [currentVal];
        }

        for (var v = 0; v < currentVal.length; v++) {
            data.push({
                id: currentVal[v],
                text: currentVal[v]
            });
        }

        callback(data);
    };

    $("#select").select2({
        dataAdapter: CustomData
    });
}
```

The new `current` method of the data adapter works in a similar way to the old `initSelection` method, with three notable differences. The first, and most important, is that **it is called whenever the current selections are needed** to ensure that Select2 is always displaying the most accurate and up to date data. No matter what type of element Select2 is attached to, whether it supports a single or multiple selections, the data passed to the callback **must be an array, even if it contains one selection**.

The last is that there is only one parameter, the callback to be executed with the latest data, and the current element that Select2 is attached to is available on the class itself as `this.$element`.

If you only need to load in the initial options once, and otherwise will be letting Select2 handle the state of the selections, you don't need to use a custom data adapter. You can just create the `<option>` tags on your own, and Select2 will pick up the changes.

```
var $element = $('select').select2(); // the select element you are working with

var $request = $.ajax({
    url: '/my/remote/source' // wherever your data is actually coming from
});

$request.then(function (data) {
    // This assumes that the data comes back as an array of data objects
    // The idea is that you are using the same callback as the old `initSelection`

    for (var d = 0; d < data.length; d++) {
        var item = data[d];

        // Create the DOM option that is pre-selected by default
        var option = new Option(item.text, item.id, true, true);

        // Append it to the select
        $element.append(option);
    }

    // Update the selected options that are displayed
    $element.trigger('change');
});
```

### Custom data adapters instead of `query`

>>>> **Deprecated in Select2 4.0.** This has been replaced by another option and is only available in the [full builds](/getting-started/builds-and-modules) of Select2.

[In the past](http://select2.github.io/select2/#data), any time you wanted to hook Select2 up to a different data source you would be required to implement custom `query` and `initSelection` methods. This allowed Select2 to determine the initial selection and the list of results to display, and it would handle everything else internally, which was fine more most people.

The custom `query` and `initSelection` methods have been replaced by [custom data adapters](/advanced/default-adapters/data) that handle how Select2 stores and retrieves the data that will be displayed to the user. An example of the old `query` option is provided below, which is
[the same as the old example](http://select2.github.io/select2/#data), and it generates results that contain the search term repeated a certain number of times.

```
{
    query: function (query) {
        var data = {results: []}, i, j, s;
        for (i = 1; i < 5; i++) {
            s = "";
            for (j = 0; j < i; j++) {
                s = s + query.term;
            }
            data.results.push({
                id: query.term + i,
                text: s
            });
        }
        query.callback(data);
    }
}
```
This has been replaced by custom data adapters which define a similarly named `query` method. The comparable data adapter is provided below as an example.

```
$.fn.select2.amd.require([
'select2/data/array',
'select2/utils'
], function (ArrayData, Utils) {
    function CustomData ($element, options) {
        CustomData.__super__.constructor.call(this, $element, options);
    }

    Utils.Extend(CustomData, ArrayData);

    CustomData.prototype.query = function (params, callback) {
        var data = {
            results: []
        };

        for (var i = 1; i < 5; i++) {
            var s = "";

            for (var j = 0; j < i; j++) {
                s = s + params.term;
            }

            data.results.push({
                id: params.term + i,
                text: s
            });
        }

        callback(data);
    };

    $("#select").select2({
        dataAdapter: CustomData
    });
}
```

The new `query` method of the data adapter is very similar to the old `query` option that was passed into Select2 when initializing it. The old `query` argument is mostly the same as the new `params` that are passed in to query on, and the callback that should be used to return the results is now passed in as the second parameter.

### Renamed templating options

Select2 previously provided multiple options for formatting the results list and selected options, commonly referred to as "formatters", using the `formatSelection` and `formatResult` options. As the "formatters" were also used for things such as localization, [which has also changed](#renamed-translation-options), they have been renamed to `templateSelection` and `templateResult` and their signatures have changed as well.

You should refer to the updated documentation on templates for [results](/dropdown) and [selections](/selections) when migrating from previous versions of Select2.

### Renamed `createSearchChoice`

This method has been renamed to `createTag`. You should refer to the documentation on [option creation](/tagging#tag-properties) when migrating from previous versions of Select2.

The `createSearchChoicePosition` option has been removed in favor of the `insertTag` function. New tags are added to the bottom of the list by default.
```
insertTag: function (data, tag) {
  // Insert the tag at the end of the results
  data.push(tag);
}
```

### Renamed `selectOnBlur`

This method has been renamed to `selectOnClose`.

### The `id` and `text` properties are strictly enforced

When working with array and AJAX data in the past, Select2 allowed a custom `id` function or attribute to be set in various places, ranging from the initialization of Select2 to when the remote data was being returned. This allowed Select2 to better integrate with existing data sources that did not necessarily use the `id` attribute to indicate the unique identifier for an object.

Select2 no longer supports a custom `id` or `text` to be used, but provides integration points for converting to the expected format:

#### When working with array data

Select2 previously supported defining array data as an object that matched the signature of an AJAX response. A `text` property could be specified that would map the given property to the `text` property on the individual objects. You can now do this when initializing Select2 by using the following jQuery code to map the old `text` and `id` properties to the new ones.

```
var data = $.map([
    {
        pk: 1,
        word: 'one'
    },
    {
        pk: 2,
        word: 'two'
    }
], function (obj) {
    obj.id = obj.id || obj.pk;
    obj.text = obj.text || obj.word;

    return obj;
});
```

This will result in an array of data objects that have the `id` properties that match the existing `pk` properties and `text` properties that match the existing `word` properties.

#### When working with remote data

The same code that was given above can be used in the `processResults` method of an AJAX call to map properties there as well.

### Renamed translation options

In previous versions of Select2, the default messages provided to users could be localized to fit the language of the website that it was being used on. Select2 only comes with the English language by default, but provides [community-contributed translations](/i18n) for many common languages. Many of the formatters have been moved to the `language` option and the signatures of the formatters have been changed to handle future additions.

### Declaring options using `data-*` attributes

In the past, Select2 has only supported declaring a subset of options using `data-*` attributes. Select2 now supports declaring all options using the attributes, using [the format specified in the documentation](/configuration/data-attributes).

You could previously declare the URL that was used for AJAX requests using the `data-ajax-url` attribute. While Select2 still allows for this, the new attribute that should be used is the `data-ajax--url` attribute. Support for the old attribute will be removed in Select2 4.1.

Although it was not documented, a list of possible tags could also be provided using the `data-select2-tags` attribute and passing in a JSON-formatted array of objects for tags. As the method for specifying tags has changed in 4.0, you should now provide the array of objects using the `data-data` attribute, which maps to [the array data](/data-sources/arrays) option. You should also enable tags by setting `data-tags="true"` on the object, to maintain the ability for users to create their own options as well.

If you previously declared the list of tags as:

```
<select data-select2-tags='[{"id": "1", "text": "One"}, {"id": "2", "text": "Two"}]'></select>
```

...then you should now declare it as...

```
<select data-data='[{"id": "1", "text": "One"}, {"id": "2", "text": "Two"}]' data-tags="true"></select>
```

## Deprecated and removed methods

As Select2 now uses a `<select>` element for all data sources, a few methods that were available by calling `.select2()` are no longer required.

### `.select2("val")`

The `"val"` method has been deprecated and will be removed in Select2 4.1. The deprecated method no longer includes the `triggerChange` parameter.

You should directly call `.val` on the underlying `<select>` element instead. If you needed the second parameter (`triggerChange`), you should also call `.trigger("change")` on the element.

```
$("select").val("1").trigger("change"); // instead of $("select").select2("val", "1");
```

### `.select2("enable")`

Select2 will respect the `disabled` property of the underlying select element. In order to enable or disable Select2, you should call `.prop('disabled', true/false)` on the `<select>` element. Support for the old methods will be completely removed in Select2 4.1.

```
$("select").prop("disabled", true); // instead of $("select").enable(false);
```
