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
    var self = this;

    if (this.$element.prop("multiple")) {
      this.current(function (currentData) {
        var val = [];

        data = [data];
        data.push.apply(data, currentData);

        for (var d = 0; d < data.length; d++) {
          id = data[d].id;

          if (val.indexOf(id) === -1) {
            val.push(id);
          }
        }

        self.$element.val(val);
        self.$element.trigger("change");
      });
    } else {
      var val = data.id;

      this.$element.val(val);
      this.$element.trigger("change");
    }
  }

  SelectAdapter.prototype.bind = function (container, $container) {
    var self = this;

    container.on("select", function (params) {
      var current = self.current(function (data) {
        //
      });

      self.select(params.data);
    });
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
