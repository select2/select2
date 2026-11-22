define(['./array', '../utils', 'jquery'], function (ArrayAdapter, Utils, $) {
  function AjaxAdapter($element, options) {
    this.ajaxOptions = this._applyDefaults(options.get('ajax'));

    if (this.ajaxOptions.processResults != null) {
      this.processResults = this.ajaxOptions.processResults;
    }

    AjaxAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(AjaxAdapter, ArrayAdapter);

  AjaxAdapter.prototype._applyDefaults = function (options) {
    var defaults = {
      data: function (params) {
        return $.extend({}, params, {
          q: params.term
        });
      },
      transport: function (params, success, failure) {
        var $request = $.ajax(params);

        $request.then(success);
        $request.fail(function (jqXHR, textStatus) {
          // Normalize jQuery's failure arguments so `failure` is always
          // called with just the text status string. Per jQuery, the only
          // accepted values for `status` are: 'error', 'abort', 'timeout',
          // 'parseerror'. This keeps the contract independent of jqXHR
          // internals so it survives the eventual removal of jQuery.
          failure(textStatus);
        });

        return $request;
      }
    };

    return $.extend({}, defaults, options, true);
  };

  AjaxAdapter.prototype.processResults = function (results) {
    return results;
  };

  AjaxAdapter.prototype._requestStatusToTextStatus = function ($request) {
    // Map jqXHR status to the equivalent textStatus string for backwards
    // compatibility with older transports that don't report a reason string.
    // Old behaviour treated any status-0 request as a silent abort.
    if (
      $request &&
      'status' in $request &&
      ($request.status === 0 || $request.status === '0')
    ) {
      return 'abort';
    }

    return null;
  };

  AjaxAdapter.prototype.query = function (params, callback) {
    var matches = [];
    var self = this;

    if (this._request != null) {
      // JSONP requests cannot always be aborted
      if (typeof this._request.abort === 'function') {
        this._request.abort();
      }

      this._request = null;
    }

    var options = $.extend(
      {
        type: 'GET'
      },
      this.ajaxOptions
    );

    if (typeof options.url === 'function') {
      options.url = options.url.call(this.$element, params);
    }

    if (typeof options.data === 'function') {
      options.data = options.data.call(this.$element, params);
    }

    function request() {
      var $request = options.transport(
        options,
        function (data) {
          var results = self.processResults(data, params);

          if (results && results.results && Array.isArray(results.results)) {
            results.results = results.results.map(
              AjaxAdapter.prototype._normalizeItem.bind(self)
            );
          } else {
            if (self.options.get('debug') && window.console && console.error) {
              // Check to make sure that the response included a `results` key.
              console.error(
                'Select2: The AJAX results did not return an array in the ' +
                  '`results` key of the response.'
              );
            }
          }

          callback(results);
        },
        function (textStatus) {
          // The transport reports the failure reason as `textStatus`. Per
          // jQuery, the only accepted values for `status` are: 'error',
          // 'abort', 'timeout', 'parseerror'. Checking the type keeps the
          // core logic independent of jqXHR internals so it survives the
          // eventual removal of jQuery.
          if (typeof textStatus !== 'string') {
            textStatus = self._requestStatusToTextStatus($request);
          }

          // Only an aborted request stays silent; every other failure
          // (including timeouts) should show the error message.
          if (textStatus === 'abort') {
            return;
          }

          self.trigger('results:message', {
            message: 'errorLoading'
          });
        }
      );

      self._request = $request;
    }

    if (this.ajaxOptions.delay && params.term != null) {
      if (this._queryTimeout) {
        window.clearTimeout(this._queryTimeout);
      }

      this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
    } else {
      request();
    }
  };

  return AjaxAdapter;
});
