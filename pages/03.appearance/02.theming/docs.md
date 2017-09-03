---
title: Theming
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

## Theme support

Select2 supports custom themes using the `theme` option so you can style Select2 to match the rest of your application.

These examples use the `classic` theme, which matches the old look of Select2.

<div class="s2-example">
  <p>
    <select class="js-example-theme-single js-states form-control">
    </select>
  </p>
  <p>
    <select class="js-example-theme-multiple js-states form-control" multiple="multiple"></select>
  </p>
</div>

<pre data-fill-from=".js-code-example-theme"></pre>

<script type="text/javascript" class="js-code-example-theme">

$(".js-example-theme-single").select2({
  theme: "classic"
});

$(".js-example-theme-multiple").select2({
  theme: "classic"
});

</script>

Various display options of the Select2 component can be changed.  You can access the `<option>` element (or `<optgroup>`) and any attributes on those elements using `.element`.

## Responsive design - Percent width

Select2's width can be set to a percentage of its parent to support
responsive design. The two Select2 boxes below are styled to 50% and 75%
width respectively.

<div class="s2-example">
  <p>
    <select class="js-example-responsive js-states" style="width: 50%"></select>
  </p>
  <p>
    <select class="js-example-responsive js-states" multiple="multiple" style="width: 75%"></select>
  </p>
</div>

```
<select class="js-example-responsive" style="width: 50%"></select>
<select class="js-example-responsive" multiple="multiple" style="width: 75%"></select>
```

<pre data-fill-from=".js-code-example-responsive"></pre>

<script type="text/javascript" class="js-code-example-responsive">

$(".js-example-responsive").select2({
    width: 'resolve' // need to override the changed default
});

</script>

>>>> Select2 will do its best to resolve the percent width specified via a CSS class, but it is not always possible. The best way to ensure that Select2 is using a percent based width is to inline the `style` declaration into the tag.
