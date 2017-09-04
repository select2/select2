---
title: data-* attributes
taxonomy:
    category: docs
---

It is recommended that you declare your configuration options by [passing in an object](/configuration) when initializing Select2.  However, you may also define your configuration options by using the HTML5 `data-*` attributes, which will override any options set when initializing Select2 and any [defaults](/configuration/defaults).

```
<select data-placeholder="Select a state">
  <option value="AL">Alabama</option>
    ...
  <option value="WY">Wyoming</option>
</select>
```

## Nested (subkey) options

Sometimes, you have options that are nested under a top-level option.  For example, the options under the `ajax` option:

```
$(".js-example-data-ajax").select2({
  ajax: {
    url: "http://example.org/api/test",
    cache: false
  }
});
```

To write these options as `data-*` attributes, each level of nesting should be separated by two dashes (`--`):

```
<select data-ajax--url="http://example.org/api/test" data-ajax--cache="true">
    ...
</select>
```

The value of the option is subject to jQuery's <a href="https://api.jquery.com/data/#data-html5">parsing rules</a> for HTML5 data attributes.

>>> Due to <a href="https://github.com/jquery/jquery/issues/2070">a jQuery bug</a>, nested options using <code>data-*</code> attributes <a href="https://github.com/select2/select2/issues/2969">do not work in jQuery 1.x</a>.

## `camelCase` options

HTML data attributes are case-insensitive, so any options which contain capital letters will be parsed as if they were all lowercase. Because Select2 has many options which are camelCase, where words are separated by uppercase letters, you must write these options out with dashes instead. So an option that would normally be called <code>allowClear</code> should instead be defined as `allow-clear`.

This means that if you declare your <code>&lt;select&gt;</code> tag as...
```
<select data-tags="true" data-placeholder="Select an option" data-allow-clear="true">
    ...
</select>
```

Will be interpreted the same as initializing Select2 as...

```
$("select").select2({
  tags: "true",
  placeholder: "Select an option",
  allowClear: true
});
```
