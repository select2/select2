define(["./array", "../utils"], function (ArrayAdapter, Utils) {
  function AjaxAdapter($element, options) {
    this.ajaxOptions = this._applyDefaults(options.get("ajax"));

    if (this.ajaxOptions.processResults != null) {
      this.processResults = this.ajaxOptions.processResults;
    }

    AjaxAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(AjaxAdapter, ArrayAdapter);

  AjaxAdapter.prototype._applyDefaults = function (options) {
    var defaults = {
      data: function (params) {
        return Object.assign({}, params, {
          q: params.term,
        });
      },
      transport: function (params, success, failure) {
        var request = new XMLHttpRequest();
          // For GET requests, append data to URL as query params
        if (params.type === 'GET' && params.data) {
          var queryString = Object.keys(params.data)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params.data[key]))
            .join('&');
          params.url = params.url + (params.url.indexOf('?') > -1 ? '&' : '?') + queryString;
        }

        request.open(params.type, params.url, true);

        if (params.dataType === "json") {
          request.setRequestHeader("Content-Type", "application/json");
          request.setRequestHeader("Accept", "application/json");
        }

        request.onload = function () {
          if (request.status >= 200 && request.status < 400) {
            success(JSON.parse(request.responseText));
          } else {
            failure();
          }
        };

        request.onerror = function () {
          failure();
        };

        request.send(params.type !== 'GET' ? params.data : null);
        // request.send(params.data);

        return request;
      },
    };

    return Object.assign({}, defaults, options, true);
  };

  AjaxAdapter.prototype.processResults = function (results) {
    return results;
  };

  AjaxAdapter.prototype.query = function (params, callback) {
    var matches = [];
    var self = this;

    if (this._request != null) {
      // JSONP requests cannot always be aborted
      if (typeof this._request.abort === "function") {
        this._request.abort();
      }

      this._request = null;
    }

    var options = Object.assign(
      {
        type: "GET",
      },
      this.ajaxOptions
    );

    if (typeof options.url === "function") {
      options.url = options.url.call(this.element, params);
    }

    if (typeof options.data === "function") {
      options.data = options.data.call(this.element, params);
    }

    function request() {
      var request = options.transport(
        options,
        function (data) {
          var results = self.processResults(data, params);

          if (
            results &&
            results.results &&
            Array.isArray(results.results)
          ) {
            results.results = results.results.map(
              AjaxAdapter.prototype._normalizeItem
            );
          } else {
            if (
              self.options.get("debug") &&
              window.console &&
              console.error
            ) {
              // Check to make sure that the response included a `results` key.
              console.error(
                "Select2: The AJAX results did not return an array in the " +
                  "`results` key of the response."
              );
            }
          }

          callback(results);
        },
        function () {
          // Attempt to detect if a request was aborted
          // Only works if the transport exposes a status property
          if (
            request &&
            "status" in request &&
            (request.status === 0 || request.status === "0")
          ) {
            return;
          }

          self.trigger("results:message", {
            message: "errorLoading",
          });
        }
      );

      self._request = request;
    }

    if (this.ajaxOptions.delay && params.term != null) {
      if (this._queryTimeout) {
        window.clearTimeout(this._queryTimeout);
      }

      this._queryTimeout = window.setTimeout(
        request,
        this.ajaxOptions.delay
      );
    } else {
      request();
    }
  };

  return AjaxAdapter;
});
