define([
  '../utils',
  'jquery'
], function (Utils, $) {
  function SelectAdapter ($element, options) {
    this.$element = $element;

    SelectAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(SelectAdapter, Utils.Observable);

  SelectAdapter.prototype.current = function (callback) {
    var data = [];
    var self = this;

    this.$element.find(":selected").each(function () {
      var $option = $(this);

      var option = self.item($option);

      data.push(option);
    });

    callback(data);
  };

  SelectAdapter.prototype.select = function (data) {
    var val;

    if (this.$element.prop("multiple")) {
      var currentData = this.current();

      data = [data];
      data.push(currentData);

      val = [];

      for (var d = 0; d < data.length; d++) {
        id = data[d].id;

        if (ids.indexOf(id) === -1) {
          val.push(id);
        }
      }
    } else {
      val = data.id;
    }

    this.$element.val(val);
    this.$element.trigger("change");
  }

  SelectAdapter.prototype.query = function (params, callback) {
    var data = [];
    var self = this;

    this.$element.find("option").each(function () {
      var $option = $(this);

      var option = self.item($option);

      if (self.matches(params, option)) {
        data.push(option);
      }
    });

    callback(data);
  };

  SelectAdapter.prototype.item = function ($option) {
    var data = {
      id: $option.val(),
      text: $option.html()
    };

    return data;
  };

  SelectAdapter.prototype.matches = function (params, data) {
    if ($.trim(params.term) == "") {
      return true;
    }

    if (data.text.indexOf(params.term) > -1) {
      return true;
    }

    return false;
  }

  return SelectAdapter;
});
