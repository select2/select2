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
    const defaults = {
      data: function (params) {
        const mergedParams = {};
        for (const key in params) {
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            mergedParams[key] = params[key];
          }
        }
        mergedParams.q = params.term;
        return mergedParams;
      },
      transport: function (params, success, failure) {
        const request = new XMLHttpRequest();

        if (params.type === "GET" && params.data) {
          const queryString = new URLSearchParams(params.data).toString();
          params.url += (params.url.indexOf("?") > -1 ? "&" : "?") + queryString;
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
            failure(new Error(`HTTP error ${request.status}`));
          }
        };

        request.onerror = function () {
          failure(new Error("Network error occurred"));
        };

        if (params.type !== "GET") {
          request.send(JSON.stringify(params.data));
        } else {
          request.send(null);
        }

        return request;
      },
    };

    // Merge `defaults` and `options` manually
    const mergedOptions = {};
    for (const key in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, key)) {
        mergedOptions[key] = defaults[key];
      }
    }
    for (const key in options) {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        mergedOptions[key] = options[key];
      }
    }

    return mergedOptions;
  };

  AjaxAdapter.prototype.processResults = function (results) {
    return results;
  };

  AjaxAdapter.prototype.query = function (params, callback) {
    var matches = [];
    var self = this;

    if (this._request != null) {
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
              self._normalizeItem.bind(self) // Ensure the correct context is passed
            );
          } else {
            if (
              self.options.get("debug") &&
              window.console &&
              console.error
            ) {
              console.error(
                "Select2: The AJAX results did not return an array in the `results` key of the response."
              );
            }
          }

          callback(results);
        },
        function () {
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
