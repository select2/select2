---
title: Ajax (remote data)
metadata:
    description: Select2 provides extensive support for populating dropdown items from a remote data source.
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

Select2 comes with AJAX support built in, using jQuery's AJAX methods. In this example, we can search for repositories using GitHub's API:

<select class="js-example-data-ajax form-control"></select>

**In your HTML:**

```
<select class="js-data-example-ajax"></select>
```

**In your Javascript:**

```
$('.js-data-example-ajax').select2({
  ajax: {
    url: 'https://api.github.com/search/repositories',
    dataType: 'json'
    // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
  }
});
```

You can configure how Select2 searches for remote data using the `ajax` option.  Select2 will pass any options in the `ajax` object to jQuery's `$.ajax` function, or the `transport` function you specify.

>>> For **remote data sources only**, Select2 does not create a new `<option>` element until the item has been selected for the first time.  This is done for performance reasons.  Once an `<option>` has been created, it will remain in the DOM even if the selection is later changed.

## Request parameters

Select2 will issue a request to the specified URL when the user opens the control (unless there is a `minimumInputLength` set as a Select2 option), and again every time the user types in the search box.  By default, it will send the following as query string parameters:

- `term` : The current search term in the search box.
- `q`    : Contains the same contents as `term`.
- `_type`: A "request type".  Will usually be `query`, but changes to `query_append` for paginated requests.
- `page` : The current page number to request.  Only sent for paginated (infinite scrolling) searches.

For example, Select2 might issue a request that looks like: `https://api.github.com/search/repositories?term=sel&_type=query&q=sel`.

Sometimes, you may need to add additional query parameters to the request.  You can modify the parameters that are sent with the request by overriding the `ajax.data` option:

```
$('#mySelect2').select2({
  ajax: {
    url: 'https://api.github.com/orgs/select2/repos',
    data: function (params) {
      var query = {
        search: params.term,
        type: 'public'
      }

      // Query parameters will be ?search=[term]&type=public
      return query;
    }
  }
});
```

## Transforming response data

You can use the `ajax.processResults` option to transform the data returned by your API into the format expected by Select2:

```
$('#mySelect2').select2({
  ajax: {
    url: '/example/api',
    processResults: function (data) {
      // Transforms the top-level key of the response object from 'items' to 'results'
      return {
        results: data.items
      };
    }
  }
});
```

>>> Select2 expects results from the remote endpoint to be filtered on the **server side**. See [this comment](https://github.com/select2/select2/issues/2321#issuecomment-42749687) for an explanation of why this implementation choice was made. If server-side filtering is not possible, you may be interested in using Select2's [support for data arrays](/data-sources/arrays) instead.

## Default (pre-selected) values

You may wish to set a pre-selected default value for a Select2 control that receives its data from an AJAX request.

To provide default selections, you may include an `<option>` for each selection that contains the value and text that should be displayed:

```
<select class="js-example-data-ajax form-control">
  <option value="3620194" selected="selected">select2/select2</option>
</select>
```

To achieve this programmatically, you will need to [create and append a new `Option`](/programmatic-control/add-select-clear-items).

## Pagination

Select2 supports pagination ("infinite scrolling") for remote data sources out of the box.  To use this feature, your remote data source must be able to respond to paginated requests (server-side frameworks like [Laravel](https://laravel.com/docs/5.5/pagination) and [UserFrosting](https://learn.userfrosting.com/database/data-sprunjing) have this built-in).

To use pagination, you must tell Select2 to add any necessary pagination parameters to the request by overriding the `ajax.data` setting.  The current page to be retrieved is stored in the `params.page` property.

```
$('#mySelect2').select2({
  ajax: {
    url: 'https://api.github.com/search/repositories',
    data: function (params) {
      var query = {
        search: params.term,
        page: params.page || 1
      }

      // Query parameters will be ?search=[term]&page=[page]
      return query;
    }
  }
});
```

Select2 will expect a `pagination.more` value in the response.  The value of `more` should be `true` or `false`, which tells Select2 whether or not there are more pages of results available for retrieval:

```
{
  "results": [
    {
      "id": 1,
      "text": "Option 1"
    },
    {
      "id": 2,
      "text": "Option 2"
    }
  ],
  "pagination": {
    "more": true
  }
}
```

If your server-side code does not generate the `pagination.more` property in the response, you can use `processResults` to generate this value from other information that is available.  For example, suppose your API returns a `count_filtered` value that tells you how many total (unpaginated) results are available in the data set.  If you know that your paginated API returns 10 results at a time, you can use this along with the value of `count_filtered` to compute the value of `pagination.more`:

```
processResults: function (data, params) {
    params.page = params.page || 1;

    return {
        results: data.results,
        pagination: {
            more: (params.page * 10) < data.count_filtered
        }
    };
}
```

## Rate-limiting requests

You can tell Select2 to wait until the user has finished typing their search term before triggering the AJAX request.  Simply use the `ajax.delay` configuration option to tell Select2 how long to wait after a user has stopped typing before sending the request:

```
$('#mySelect2').select2({
  ajax: {
    delay: 250 // wait 250 milliseconds before triggering the request
  }
});
```

## Dynamic URLs

If there isn't a single url for your search results, or you need to call a function to determine the url to use, you can specify a callback for the `ajax.url` option to generate the url. The current search query will be passed in through the `params` option:

```
$('#mySelect2').select2({
  ajax: {
    url: function (params) {
      return '/some/url/' + params.term;
    }
  }
});
```

## Alternative transport methods

Select2 uses the transport method defined in `ajax.transport` to send requests to your API. By default this transport method is `jQuery.ajax`, but it can be easily overridden:

```
$('#mySelect2').select2({
  ajax: {
    transport: function (params, success, failure) {
      var request = new AjaxRequest(params.url, params);
      request.on('success', success);
      request.on('failure', failure);
    }
  }
});
```

## jQuery `$.ajax` options

All options passed to `ajax` will be directly passed to the `$.ajax` function that executes AJAX requests.

There are a few custom options that Select2 will intercept, allowing you to customize the request as it is being made:

```
ajax: {
  // The number of milliseconds to wait for the user to stop typing before
  // issuing the ajax request.
  delay: 250,
  // You can craft a custom url based on the parameters that are passed into the
  // request. This is useful if you are using a framework which has
  // JavaScript-based functions for generating the urls to make requests to.
  //
  // @param params The object containing the parameters used to generate the
  //   request.
  // @returns The url that the request should be made to.
  url: function (params) {
    return UrlGenerator.Random();
  },
  // You can pass custom data into the request based on the parameters used to
  // make the request. For `GET` requests, the default method, these are the
  // query parameters that are appended to the url. For `POST` requests, this
  // is the form data that will be passed into the request. For other requests,
  // the data returned from here should be customized based on what jQuery and
  // your server are expecting.
  //
  // @param params The object containing the parameters used to generate the
  //   request.
  // @returns Data to be directly passed into the request.
  data: function (params) {
    var queryParameters = {
      q: params.term
    }

    return queryParameters;
  },
  // You can modify the results that are returned from the server, allowing you
  // to make last-minute changes to the data, or find the correct part of the
  // response to pass to Select2. Keep in mind that results should be passed as
  // an array of objects.
  //
  // @param data The data as it is returned directly by jQuery.
  // @returns An object containing the results data as well as any required
  //   metadata that is used by plugins. The object should contain an array of
  //   data objects as the `results` key.
  processResults: function (data) {
    return {
      results: data
    };
  },
  // You can use a custom AJAX transport function if you do not want to use the
  // default one provided by jQuery.
  //
  // @param params The object containing the parameters used to generate the
  //   request.
  // @param success A callback function that takes `data`, the results from the
  //   request.
  // @param failure A callback function that indicates that the request could
  //   not be completed.
  // @returns An object that has an `abort` function that can be called to abort
  //   the request if needed.
  transport: function (params, success, failure) {
    var $request = $.ajax(params);

    $request.then(success);
    $request.fail(failure);

    return $request;
  }
}
```

## Additional examples

This code powers the Github example presented at the beginning of this chapter:

<pre data-fill-from=".js-code-placeholder"></pre>

<script type="text/javascript" class="js-code-placeholder">

$(".js-example-data-ajax").select2({
  ajax: {
    url: "https://api.github.com/search/repositories",
    dataType: 'json',
    delay: 250,
    data: function (params) {
      return {
        q: params.term, // search term
        page: params.page
      };
    },
    processResults: function (data, params) {
      // parse the results into the format expected by Select2
      // since we are using custom formatting functions we do not need to
      // alter the remote JSON data, except to indicate that infinite
      // scrolling can be used
      params.page = params.page || 1;

      return {
        results: data.items,
        pagination: {
          more: (params.page * 30) < data.total_count
        }
      };
    },
    cache: true
  },
  placeholder: 'Search for a repository',
  minimumInputLength: 1,
  templateResult: formatRepo,
  templateSelection: formatRepoSelection
});

function formatRepo (repo) {
  if (repo.loading) {
    return repo.text;
  }

  var $container = $(
    "<div class='select2-result-repository clearfix'>" +
      "<div class='select2-result-repository__avatar'><img src='" + repo.owner.avatar_url + "' /></div>" +
      "<div class='select2-result-repository__meta'>" +
        "<div class='select2-result-repository__title'></div>" +
        "<div class='select2-result-repository__description'></div>" +
        "<div class='select2-result-repository__statistics'>" +
          "<div class='select2-result-repository__forks'><i class='fa fa-flash'></i> </div>" +
          "<div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> </div>" +
          "<div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> </div>" +
        "</div>" +
      "</div>" +
    "</div>"
  );

  $container.find(".select2-result-repository__title").text(repo.full_name);
  $container.find(".select2-result-repository__description").text(repo.description);
  $container.find(".select2-result-repository__forks").append(repo.forks_count + " Forks");
  $container.find(".select2-result-repository__stargazers").append(repo.stargazers_count + " Stars");
  $container.find(".select2-result-repository__watchers").append(repo.watchers_count + " Watchers");

  return $container;
}

function formatRepoSelection (repo) {
  return repo.full_name || repo.text;
}
</script>
