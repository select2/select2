---
title: Dynamic option creation
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

In addition to a prepopulated menu of options, Select2 can dynamically create new options from text input by the user in the search box.  This feature is called "tagging".  To enable tagging, set the `tags` option to `true`:

<div class="s2-example">
  <p>
    <select class="js-example-tags form-control">
      <option selected="selected">orange</option>
      <option>white</option>
      <option>purple</option>
    </select>
  </p>
</div>

```
<select class="form-control">
  <option selected="selected">orange</option>
  <option>white</option>
  <option>purple</option>
</select>

$(".js-example-tags").select2({
  tags: true
});
```

Note that when tagging is enabled the user can select from the pre-existing options or create a new option by picking the first choice, which is what the user has typed into the search box so far.

## Tagging with multi-value select boxes

Tagging can also be used in multi-value select boxes. In the example below, we set the `multiple="multiple"` attribute on a Select2 control that also has `tags: true` enabled:
  
<div class="s2-example">
  <p>
    <select class="js-example-tags form-control" multiple="multiple">
      <option selected="selected">orange</option>
      <option>white</option>
      <option selected="selected">purple</option>
    </select>
  </p>
</div>

```
<select class="form-control" multiple="multiple">
  <option selected="selected">orange</option>
  <option>white</option>
  <option selected="selected">purple</option>
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

<div class="s2-example">
<p>
  <select class="js-example-tokenizer form-control" multiple="multiple">
    <option>red</option>
    <option>blue</option>
    <option>green</option>
  </select>
</p>
</div>

<pre data-fill-from=".js-code-example-tokenizer"></pre>

<script type="text/javascript" class="js-code-example-tokenizer">

$(".js-example-tokenizer").select2({
    tags: true,
    tokenSeparators: [',', ' ']
})

</script>

## Customizing tag creation

### Tag properties

You may add extra properties to newly created tags by defining a `createTag` callback:

```
$('select').select2({
  createTag: function (params) {
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

```
$('select').select2({
  createTag: function (params) {
    // Don't offset to create a tag if there is no @ symbol
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

```
$('select').select2({
  insertTag: function (data, tag) {
    // Insert the tag at the end of the results
    data.push(tag);
  }
});
```
