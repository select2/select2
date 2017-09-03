---
title: Internationalization
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

## Multiple languages (localization)

Select2 supports displaying the messages in different languages, as well
as providing your own
<a href="options.html#language">custom messages</a>
that can be displayed.

The language does not have to be defined when Select2 is being
initialized, but instead can be defined in the <code>[lang]</code>
attribute of any parent elements as <code>[lang="es"]</code>.

<div class="s2-example">
    <p>
      <select class="js-example-language js-states form-control">
      </select>
    </p>
</div>

```
$(".js-example-language").select2({
  language: "es"
});
```

## RTL support

Select2 will work on RTL websites if the <code>dir</code> attribute is
set on the <code>&lt;select&gt;</code> or any parents of it. You can also
initialize Select2 with <code>dir: "rtl"</code> set.

<div class="s2-example">
    <p>
      <select class="js-example-rtl js-states form-control" dir="rtl"></select>
    </p>
</div>

```
$(".js-example-rtl").select2({
  dir: "rtl"
});
```

## Transliteration support (diacritics)

Select2's default matcher will ignore diacritics, making it easier for
users to filter results in international selects. Type "aero" into the
select below.

<div class="s2-example">
  <p>
    <select class="js-example-diacritics form-control">
      <option>Aeróbics</option>
      <option>Aeróbics en Agua</option>
      <option>Aerografía</option>
      <option>Aeromodelaje</option>
      <option>Águilas</option>
      <option>Ajedrez</option>
      <option>Ala Delta</option>
      <option>Álbumes de Música</option>
      <option>Alusivos</option>
      <option>Análisis de Escritura a Mano</option>
    </select>
  </p>
</div>

```
$(".js-example-diacritics").select2();
```
