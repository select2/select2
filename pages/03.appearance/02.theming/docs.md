---
title: Theming
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

## Theme support

  <p>
    Select2 supports custom themes using the
    <a href="options.html#theme">theme option</a>
    so you can style Select2 to match the rest of your application.
  </p>

  <p>
    These are using the <code>classic</code> theme, which matches the old
    look of Select2.
  </p>

  <div class="s2-example">
    <p>
      <select class="js-example-theme-single js-states form-control">
      </select>
    </p>
    <p>
      <select class="js-example-theme-multiple js-states form-control" multiple="multiple"></select>
    </p>
  </div>

```
$(".js-example-theme-single").select2({
  theme: "classic"
});

$(".js-example-theme-multiple").select2({
  theme: "classic"
});
```

Various display options of the Select2 component can be changed:
You can access the <code>&lt;option&gt;</code> element
(or <code>&lt;optgroup&gt;</code>) and any attributes on those elements
using <code>.element</code>.

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

>>>> Select2 will do its best to resolve the percent width specified via a CSS class, but it is not always possible. The best way to ensure that Select2 is using a percent based width is to inline the `style` declaration into the tag.
