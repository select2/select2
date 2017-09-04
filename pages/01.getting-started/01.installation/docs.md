---
title: Installation
taxonomy:
    category: docs
---

In order to use Select2, you must include the JavaScript and CSS file on
your website. You can get these files built for you from many different
locations.

## Using Select2 from a CDN

Select2 is hosted on both the
<a href="https://cdnjs.com/libraries/select2">cdnjs</a> and
<a href="https://www.jsdelivr.com/#!select2">jsDelivr</a> CDNs, allowing
you to quickly include Select2 on your website.

### Include the assets

Include the following lines of code in the `<head>` section of your HTML.

```
<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>
```

>>> <i class="fa fa-info-circle"></i> Immediately following a new release, it takes some time for CDNs to
  catch up and get the new versions live on the CDN.

### Initialize Select2

Initialize Select2 on the `<select>` element that you want to make awesome.

```
<script type="text/javascript">
    $('select').select2();
</script>
```

## Downloading the code locally

In some situations, you can't use Select2 from a CDN and you must include the files through your own static file servers.

### Download the code

<a href="https://github.com/select2/select2/tags">
  Download the code
</a>
from GitHub and copy the `dist` directory to your project.

### Include the assets

Include the following lines of code in the `<head>` section of your HTML.

```
<link href="path/to/select2.min.css" rel="stylesheet" />
<script src="path/to/select2.min.js"></script>
```
