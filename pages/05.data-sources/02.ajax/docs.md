---
title: Ajax (remote data)
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

Select2 comes with AJAX support built in, using jQuery's AJAX methods. In this example, we can search for repositories using GitHub's API.

<select class="js-example-data-ajax form-control">
  <option value="3620194" selected="selected">select2/select2</option>
</select>

When using Select2 with remote data, the HTML required for the `select` is the same as any other Select2. If you need to provide default selections, you just need to include an `option` for each selection that contains the value and text that should be displayed.

```
<select class="js-data-example-ajax">
  <option value="3620194" selected="selected">select2/select2</option>
</select>
```

You can configure how Select2 searches for remote data using the `ajax` option. More information on the individual options that Select2 handles can be found in the [options documentation for `ajax`](/configuration).

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
  escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
  minimumInputLength: 1,
  templateResult: formatRepo,
  templateSelection: formatRepoSelection
});

function formatRepo (repo) {
  if (repo.loading) return repo.text;

  var markup = "<div class='select2-result-repository clearfix'>" +
    "<div class='select2-result-repository__avatar'><img src='" + repo.owner.avatar_url + "' /></div>" +
    "<div class='select2-result-repository__meta'>" +
      "<div class='select2-result-repository__title'>" + repo.full_name + "</div>";

  if (repo.description) {
    markup += "<div class='select2-result-repository__description'>" + repo.description + "</div>";
  }

  markup += "<div class='select2-result-repository__statistics'>" +
    "<div class='select2-result-repository__forks'><i class='fa fa-flash'></i> " + repo.forks_count + " Forks</div>" +
    "<div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> " + repo.stargazers_count + " Stars</div>" +
    "<div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> " + repo.watchers_count + " Watchers</div>" +
  "</div>" +
  "</div></div>";

  return markup;
}

function formatRepoSelection (repo) {
  return repo.full_name || repo.text;
}
</script>

Select2 will pass any options in the `ajax` object to jQuery's `$.ajax` function, or the `transport` function you specify.

>>> Select2 expects results from the remote endpoint to be filtered on the **server side**. If server-side filtering is not possible, you may be interested in using Select2's <a href="examples.html#data-array">support for data arrays</a> instead.

## Rate-limiting requests

You can tell Select2 to wait until the user has finished typing their search term before triggering the AJAX request.  Simply use the `ajax.delay` configuration option to tell Select2 how long to wait after a user has stopped typing before sending the request:

```
$('select').select2({
  ajax: {
    delay: 250 // wait 250 milliseconds before triggering the request
  }
});
```

## Transforming response data

You can use the <code>ajax.processResults</code> option to transform the data returned by your API into the format expected by Select2:

```
$('select').select2({
  ajax: {
    url: '/example/api',
    processResults: function (data) {
      return {
        results: data.items
      };
    }
  }
});
```

## Default values

You may wish to set a pre-selected default value for a Select2 control that receives its data from an AJAX request.

To do this, please refer to the following Stack Overflow answer: [Select2 4.0.0 initial value with AJAX](http://stackoverflow.com/q/30316586/359284#30328989).

## Additional request parameters

By default, Select2 will send the search query term as well as the pagination data as query parameters in requests.

Sometimes, you may need to add additional query parameters to the request.  You can modify the parameters that are sent with the request by overriding the `ajax.data` option:

```
$('select').select2({
  ajax: {
    data: function (params) {
      var query = {
        search: params.term,
        page: params.page
      }

      // Query parameters will be ?search=[term]&page=[page]
      return query;
    }
  }
});
```

## Dynamic URLs

If there isn't a single url for your search results, or you need to call a function to determine the url to use, you can specify a callback for the `ajax.url` option to generate the url. The current search query will be passed in through the `params` option:

```
$('select').select2({
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
$('select').select2({
  ajax: {
    transport: function (params, success, failure) {
      var request = new AjaxRequest(params.url, params);
      request.on('success', success);
      request.on('failure', failure);
    }
  }
});
```
