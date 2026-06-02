It is recommended that you declare your configuration options by [passing in an object](options-api.md) when initializing Select2. However, you may also define your configuration options by using the HTML5 `data-*` attributes, which will override any options set when initializing Select2 and any [defaults](defaults.md).

```html
<select data-placeholder="Select a state">
 <option value="AL">
  Alabama
 </option>
 ...
 <option value="WY">
  Wyoming
 </option>
</select>
```

> [!NOTE]
> Some options are not supported as `data-*`, for example `disabled` as it's not a Javascript option, but it's an HTML [attribute](options-api.md).

## Nested (subkey) options

Sometimes, you have options that are nested under a top-level option. For example, the options under the `ajax` option:

```javascript
$(".js-example-data-ajax").select2({
    ajax: {
        url: "http://example.org/api/test",
        cache: false
    }
});
```

To write these options as `data-*` attributes, each level of nesting should be separated by two dashes (`--`):

```html
<select data-ajax--cache="true" data-ajax--url="http://example.org/api/test">
 ...
</select>
```

The value of the option is subject to jQuery's [parsing rules](https://api.jquery.com/data/#data-html5) for HTML5 data attributes.

> [!NOTE]
> Due to [a jQuery bug](https://github.com/jquery/jquery/issues/2070), nested options using `data-*` attributes [do not work in jQuery 1.x](https://github.com/select2/select2/issues/2969).

## `camelCase` options

HTML data attributes are case-insensitive, so any options which contain capital letters will be parsed as if they were all lowercase. Because Select2 has many options which are camelCase, where words are separated by uppercase letters, you must write these options out with dashes instead. So an option that would normally be called `allowClear` should instead be defined as `allow-clear`.

This means that declaring your `<select>` tag as...

```html
<select data-allow-clear="true" data-placeholder="Select an option" data-tags="true">
 ...
</select>
```

Will be interpreted the same as initializing Select2 as...

```javascript
$("select").select2({
    tags: "true",
    placeholder: "Select an option",
    allowClear: true
});
```
