---
title: Internationalization
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

{% do assets.addJs('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/i18n/es.js', 90) %}

## Multiple languages (localization)

Select2 can load message translations for different languages from language files.

The language does not have to be defined when Select2 is being initialized, but instead can be defined in the `[lang]` attribute of any parent elements as `[lang="es"]`.

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

<script type="text/javascript">
    $(".js-example-language").select2({
      language: "es"
    });
</script>

You may alternatively provide your own custom messages to be displayed.


## RTL support

Select2 will work on RTL websites if the `dir` attribute is set on the `<select>` or any parents of it. You can also initialize Select2 with the `dir: "rtl"` configuration option.

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

<script type="text/javascript">
    $(".js-example-rtl").select2({
      dir: "rtl"
    });
</script>

## Transliteration support (diacritics)

Select2's default matcher will transliterate diacritic-modified letters into their ASCII counterparts, making it easier for users to filter results in international selects. Type "aero" into the select below.

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

<script type="text/javascript">
    $(".js-example-diacritics").select2();
</script>
