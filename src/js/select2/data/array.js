define([
  './select',
  '../utils',
  'jquery'
], function (SelectAdapter, Utils, $) {
  function ArrayAdapter ($element, options) {
    this.data = options.get('data');

    ArrayAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(ArrayAdapter, SelectAdapter);

  ArrayAdapter.prototype.select = function (data) {
    var self = this;

    this.$element.find('option').each(function () {
      var $option = $(this);
      var option = self.item($option);

      if (option.id == data.id.toString()) {
        $option.remove();
      }
    });

    var $option = this.option(data);

    this.$element.append($option);

    ArrayAdapter.__super__.select.call(this, data);
  };

  ArrayAdapter.prototype.option = function (data) {
    var $option = $('<option></option>');

    $option.text(data.text);
    $option.val(data.id);
    $option.prop('disabled', data.disabled || false);

    // Get any automatically generated data values
    var detectedData = this.item($option);

    // Merge it with the already present data
    var combinedData = $.extend({}, data, detectedData);

    // Override the option's data with the combined data
    $option.data('data', combinedData);

    return $option;
  };

  ArrayAdapter.prototype.query = function (params, callback) {
    var matches = [];
    var self = this;

    $.each(this.data, function () {
      var option = this;

      if (self.matches(params, option)) {
        matches.push(option);
      }
    });

    callback(matches);
  };

  return ArrayAdapter;
});
