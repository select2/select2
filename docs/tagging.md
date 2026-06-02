In addition to a prepopulated menu of options, Select2 can dynamically create new options from text input by the user in the search box. This feature is called "tagging". To enable tagging, set the `tags` option to `true`:

<select class="js-example-tags">
  <option selected="selected">orange</option>
  <option>white</option>
  <option>purple</option>
</select>

```html
<select>
  <option selected="selected">
    orange
  </option>
  <option>
    white
  </option>
  <option>
    purple
  </option>
</select>
```

```javascript
$(".js-example-tags").select2({
  tags: true
});
```

Note that when tagging is enabled the user can select from the pre-existing options or create a new option by picking the first choice, which is what the user has typed into the search box so far.

## Tagging with multi-value select boxes

Tagging can also be used in multi-value select boxes. In the example below, we set the `multiple="multiple"` attribute on a Select2 control that also has `tags: true` enabled:

<select class="js-example-tags" multiple="multiple">
  <option selected="selected">orange</option>
  <option>white</option>
  <option selected="selected">purple</option>
</select>

```html
<select multiple="multiple">
  <option selected="selected">
    orange
  </option>
  <option>
    white
  </option>
  <option selected="selected">
    purple
  </option>
</select>
```

<script type="text/javascript">
$(".js-example-tags").select2({
  tags: true
});
</script>

Try entering a value that isn't listed in the dropdown - you'll be able to add it as a new option!

## Automatic tokenization into tags

Select2 supports ability to add choices automatically as the user is typing into the search field. Try typing in the search field below and entering a space or a comma.

The separators that should be used when tokenizing can be specified using the `tokenSeparators` options.

<select class="js-example-tokenizer" multiple="multiple">
  <option>red</option>
  <option>blue</option>
  <option>green</option>
</select>

```javascript
$(".js-example-tokenizer").select2({
  tags: true,
  tokenSeparators: [',', ' ']
})

```

<script type="text/javascript" class="js-code-example-tokenizer">
$(".js-example-tokenizer").select2({
  tags: true,
  tokenSeparators: [',', ' ']
})
</script>

## Customizing tag creation

### Tag properties

You may add extra properties to newly created tags by defining a `createTag` callback:

```javascript
$('select').select2({
  createTag: function(params) {
    var term = $.trim(params.term);

    if (term === '') {
      return null;
    }

    return {
      id: term,
      text: term,
      newTag: true // add additional parameters
    }
  }
});
```

### Constraining tag creation

You may control when Select2 will allow the user to create a new tag, by adding some logic to `createTag` to return `null` if an invalid value is entered:

```javascript
$('select').select2({
  createTag: function(params) {
    // Don't offer to create a tag if there is no @ symbol
    if (params.term.indexOf('@') === -1) {
      // Return null to disable tag creation
      return null;
    }

    return {
      id: params.term,
      text: params.term
    }
  }
});
```

## Customizing tag placement in the dropdown

You may control the placement of the newly created option by defining a `insertTag` callback:

```javascript
$('select').select2({
  insertTag: function(data, tag) {
    // Insert the tag at the end of the results
    data.push(tag);
  }
});
```
