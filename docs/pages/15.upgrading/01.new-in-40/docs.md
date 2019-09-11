---
title: What's new in 4.0
taxonomy:
    category: docs
---

The 4.0 release of Select2 is the result of three years of working on the code base and watching where it needs to go. At the core, it is a full rewrite that addresses many of the extensibility and usability problems that could not be addressed in previous versions.

This release contains many breaking changes, but easy-upgrade paths have been created as well as helper modules that will allow for backwards compatibility to be maintained with past versions of Select2. Upgrading **will** require you to read the release notes carefully, but the migration path should be relatively straightforward. You can view a list of the most common changes that you will need to make [in the release notes](https://github.com/select2/select2/releases).

The notable features of this new release include:

- A more flexible plugin framework that allows you to override Select2 to behave exactly how you want it to.
- Consistency with standard `<select>` elements for all data adapters, removing the need for hidden `<input>` elements.
- A new build system that uses AMD to keep everything organized.
- Less specific selectors allowing for Select2 to be styled to fit the rest of your application.

## Plugin system

Select2 now provides interfaces that allow for it to be easily extended, allowing for anyone to create a plugin that changes the way Select2 works.  This is the result of Select2 being broken into four distinct sections, each of which can be extended and used together to create your unique Select2.

The adapters implement a consistent interface that is documented in the [advanced chapter](/advanced/adapters-and-decorators), allowing you to customize Select2 to do exactly what you are looking for. Select2 is designed such that you can mix and match plugins, with most of the core options being built as decorators that wrap the standard adapters.

## AMD-based build system

Select2 now uses an [AMD-based build system](https://en.wikipedia.org/wiki/Asynchronous_module_definition), allowing for builds that only require the parts of Select2 that you need.  While a custom build system has not yet been created, Select2 is open source and will gladly accept a pull request for one.

Select2 includes the minimal [almond](https://github.com/jrburke/almond) AMD loader, but a custom `select2.amd.js` build is available if you already use an AMD loader. The code base (available in the `src` directory) also uses AMD, allowing you to include Select2 in your own build system and generate your own builds alongside your existing infrastructure.

The AMD methods used by Select2 are available as `jQuery.fn.select2.amd.define()/require()`, allowing you to use the included almond loader. These methods are primarily used by the translations, but they are the recommended way to access custom modules that Select2 provides.
