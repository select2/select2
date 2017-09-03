---
title: Ajax
taxonomy:
    category: docs
---


  <h3 id="ajax">
    AJAX
  </h3>

  <p>
    Select2 allows searching for results from remote data sources using AJAX
    requests.
  </p>

  <div class="row">
    <div class="col-sm-6">
      <dl class="dl-horizontal">
        <dt>Key</dt>
        <dd><code>ajax</code></dd>

        <dt>Value</dt>
        <dd>object</dd>
      </dl>
    </div>

    <div class="col-sm-6">
      <dl class="dl-horizontal">
        <dt>Adapter</dt>
        <dd>
          <code title="select2/data/ajax">AjaxAdapter</code>
        </dd>
      </dl>
    </div>
  </div>

  <p>
    All options passed to this option will be directly passed to the
    <code>$.ajax</code> function that executes AJAX requests. There are a few
    custom options that Select2 will intercept, allowing you to customize the
    request as it is being made.

<pre class="prettyprint linenums">
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
</pre>
  </p>
  
  
Select2 provides the `SingleSelection` and `MultipleSelection` adapters as default implementations of the `SelectionAdapter` for single- and multi-select controls, respectively.  Both `SingleSelection` and `MultipleSelection` extend the base `BaseSelection` adapter.

The selection adapter can be overridden by assigning a custom adapter to the `selectionAdapter` configuration option.
 
## Decorators