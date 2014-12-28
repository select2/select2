define([
  'jquery',
  './defaults'
], function ($, Defaults) {
  function Options (options, $element) {
    this.options = options;

    if ($element != null) {
      this.fromElement($element);
    }

    this.options = Defaults.apply(this.options);
  }

  Options.prototype.fromElement = function ($e) {
    var excludedData = ['select2'];

    if (this.options.multiple == null) {
      this.options.multiple = $e.prop('multiple');
    }

    if (this.options.disabled == null) {
      this.options.disabled = $e.prop('disabled');
    }

    if (this.options.language == null) {
      if ($e.prop('lang')) {
        this.options.language = $e.prop('lang').toLowerCase();
      } else if ($e.closest('[lang]').prop('lang')) {
        this.options.language = $e.closest('[lang]').prop('lang');
      }
    }

    if (this.options.dir == null) {
      if ($e.prop('dir')) {
        this.options.dir = $e.prop('dir');
      } else if ($e.closest('[dir]').prop('dir')) {
        this.options.dir = $e.closest('[dir]').prop('dir');
      } else {
        this.options.dir = 'ltr';
      }
    }

    $e.prop('disabled', this.options.disabled);
    $e.prop('multiple', this.options.multiple);

    if ($e.data('select2-tags')) {
      if (console && console.warn) {
        console.warn(
          'Select2: The `data-select2-tags` attribute has been changed to ' +
          'use the `data-data` and `data-tags="true"` attributes and will be ' +
          'removed in future versions of Select2.'
        );
      }

      $e.data('data', $e.data('select2-tags'));
      $e.data('tags', true);
    }

    if ($e.data('ajax-url')) {
      if (console && console.warn) {
        console.warn(
          'Select2: The `data-ajax-attribute` has been changed to ' +
          '`data-ajax--url` and support for the old attribute will be removed' +
          ' in future versions of Select2.'
        );
      }

      $e.data('ajax--url', $e.data('ajax-url'));
    }

    var data = $e.data();

    function convertData (data) {
      for (var originalKey in data) {
        var keys = originalKey.split('-');

        var dataLevel = data;

        if (keys.length === 1) {
          continue;
        }

        for (var k = 0; k < keys.length; k++) {
          var key = keys[k];

          // Lowercase the first letter
          // By default, dash-separated becomes camelCase
          key = key.substring(0, 1).toLowerCase() + key.substring(1);

          if (!(key in dataLevel)) {
            dataLevel[key] = {};
          }

          if (k == keys.length - 1) {
            dataLevel[key] = data[originalKey];
          }

          dataLevel = dataLevel[key];
        }

        delete data[originalKey];
      }

      return data;
    }

    data = convertData(data);

    for (var key in data) {
      if (excludedData.indexOf(key) > -1) {
        continue;
      }

      if ($.isPlainObject(this.options[key])) {
        $.extend(this.options[key], data[key]);
      } else {
        this.options[key] = data[key];
      }
    }

    return this;
  };

  Options.prototype.get = function (key) {
    return this.options[key];
  };

  Options.prototype.set = function (key, val) {
    this.options[key] = val;
  };

  return Options;
});
