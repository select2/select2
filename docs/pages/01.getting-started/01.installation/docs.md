---
title: Installation
taxonomy:
    category: docs
---

In order to use Select2, you must include the compiled JavaScript and CSS files on your website. There are multiple options for including these pre-compiled files, also known as a **distribution**, in your website or application.

## Using Select2 from a CDN

A CDN (content delivery network) is the fastest way to get up and running with Select2!

Select2 is hosted on both the [jsDelivr](https://www.jsdelivr.com/package/npm/select2) and [cdnjs](https://cdnjs.com/libraries/select2) CDNs. Simply include the following lines of code in the `<head>` section of your page:

```
<link href="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js"></script>
```

>>> <i class="fa fa-info-circle"></i> Immediately following a new release, it takes some time for CDNs to catch up and get the new versions live on the CDN.

## Installing with Bower

Select2 is available on Bower.  Add the following to your `bower.json` file and then run `bower install`:

```
"dependencies": {
    "select2": "~4.0"
}
```

Or, run `bower install select2` from your project directory.

The precompiled distribution files will be available in `vendor/select2/dist/css/` and `vendor/select2/dist/js/`, relative to your project directory. Include them in your page:

```
<link href="vendor/select2/dist/css/select2.min.css" rel="stylesheet" />
<script src="vendor/select2/dist/js/select2.min.js"></script>
```

## Manual installation

We strongly recommend that you use either a CDN or a package manager like Bower or npm. This will make it easier for you to deploy your project in different environments, and easily update Select2 when new versions are released. Nonetheless if you prefer to integrate Select2 into your project manually, you can [download the release of your choice](https://github.com/select2/select2/tags) from GitHub and copy the files from the `dist` directory into your project.

Include the compiled files in your page:

```
<link href="path/to/select2.min.css" rel="stylesheet" />
<script src="path/to/select2.min.js"></script>
```
