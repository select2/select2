---
title: Internationalization
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

{% do assets.addJs('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.10/js/i18n/es.js', 90) %}

## Message translations

When necessary, Select2 displays certain messages to the user.  For example, a message will appear when no search results were found or more characters need to be entered in order for a search to be made. These messages have been translated into many languages by contributors to Select2, but you can also provide your own translations.

### Language files

Select2 can load message translations for different languages from language files.  When using translations provided by Select2, you must make sure to include the translation file in your page after Select2.

When a string is passed in as the language, Select2 will try to resolve it into a language file. This allows you to specify your own language files, which must be defined as an AMD module. If the language file cannot be found, Select2 will assume it is is one of Select2's built-in languages, and it will try to load the translations for that language instead.

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

The language does not have to be defined when Select2 is being initialized, but instead can be defined in the `[lang]` attribute of any parent elements as `[lang="es"]`.

### Translation objects

You may alternatively provide your own custom messages to be displayed by providing an object similar to the one below:

```
language: {
  // You can find all of the options in the language files provided in the
  // build. They all must be functions that return the string that should be
  // displayed.
  inputTooShort: function () {
    return "You must enter more characters...";
  }
}
```

>>> Translations are handled by the `select2/translation` module.

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
