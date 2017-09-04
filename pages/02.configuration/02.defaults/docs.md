---
title: Global defaults
taxonomy:
    category: docs
---

In some cases, you need to set the default options for all instances of Select2 in your web application. This is especially useful when you are migrating from past versions of Select2, or you are using non-standard options like [custom AMD builds](/getting-started/builds-and-modules#using-select2-with-amd-or-commonjs-loaders). Select2 exposes the default options through `$.fn.select2.defaults`, which allows you to set them globally.

When setting options globally, any past defaults that have been set will be overridden. Default options are only used when an option is requested that has not been set during initialization.

You can set default options by calling `$.fn.select2.defaults.set("key", "value")`.  For example:

```
$.fn.select2.defaults.set("theme", "classic");
```

## Nested options

To set a default values for cache, use the same notation used for [HTML `data-*` attributes](/configuration/data-attributes).  Two dashes (`--`) will be replaced by a level of nesting, and a single dash (`-`) will convert the key to a camelCase string:

```
$.fn.select2.defaults.set("ajax--cache", false);
```

## Resetting default options

You can reset the default options to their initial values by calling

```
$.fn.select2.defaults.reset();
```
