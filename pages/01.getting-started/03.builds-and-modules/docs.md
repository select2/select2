---
title: Builds and modules
taxonomy:
    category: docs
process:
    twig: true
---

## The different Select2 builds

Select2 provides multiple builds that are tailored to different
environments where it is going to be used. If you think you need to use
Select2 in a nonstandard environment, like when you are using AMD, you
should read over the list below.

<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th>Build name</th>
      <th>When you should use it</th>
    </tr>
  </thead>
  <tbody>
    <tr id="builds-standard">
      <td>
        Standard (<code>select2.js</code> / <code>select2.min.js</code>)
      </td>
      <td>
        This is the build that most people should be using for Select2. It
        includes the most commonly used features.
      </td>
    </tr>
    <tr id="builds-full">
      <td>
        Full (<code>select2.full.js</code> / <code>select2.full.min.js</code>)
      </td>
      <td>
        You should only use this build if you need the additional features from Select2, like the <a href="{{base_url_absolute}}/upgrading/migrating-from-35">compatibility modules</a> or recommended includes like <a href="https://github.com/jquery/jquery-mousewheel">jquery.mousewheel</a>
      </td>
    </tr>
  </tbody>
</table>

## Using Select2 with AMD or CommonJS loaders

Select2 should work with most AMD- or CommonJS-compliant module loaders, including [RequireJS](http://requirejs.org/) and [almond](https://github.com/jrburke/almond). Select2 ships with a modified version of the [UMD jQuery template](https://github.com/umdjs/umd/blob/f208d385768ed30cd0025d5415997075345cd1c0/templates/jqueryPlugin.js) that supports both CommonJS and AMD environments.

### Configuration

For most AMD and CommonJS setups, the location of the data files used by Select2 will be automatically determined and handled without you needing to do anything.

Select2 internally uses AMD and the r.js build tool to build the files located in the `dist` folder. These are built using the files in the `src` folder, so _you can_ just point your modules to the Select2 source and load in `jquery.select2` or `select2/core` when you want to use Select2. The files located in the `dist` folder are also AMD-compatible, so you can point to that file if you want to load in all of the default Select2 modules.

If you are using Select2 in a build environment where preexisting module names are changed during a build step, Select2 may not be able to find optional dependencies or language files. You can manually set the prefixes to use for these files using the `amdBase` and `amdLanguageBase` options.

```
$.fn.select2.defaults.set('amdBase', 'select2/');
$.fn.select2.defaults.set('amdLanguageBase', 'select2/i18n/');
```

#### `amdBase`

Specifies the base AMD loader path to be used for select2 dependency resolution. This option typically doesn't need to be changed, but is available for situations where module names may change as a result of certain build environments.

#### `amdLanguageBase` 

Specifies the base AMD loader language path to be used for select2 language file resolution. This option typically doesn't need to be changed, but is available for situations where module names may change as a result of certain build environments.

>>> Due to [a bug in older versions](https://github.com/jrburke/requirejs/issues/1342) of the r.js build tool, Select2 was sometimes placed before jQuery in then compiled build file. Because of this, Select2 will trigger an error because it won't be able to find or load jQuery.  By upgrading to version 2.1.18 or higher of the r.js build tool, you will be able to fix the issue.
