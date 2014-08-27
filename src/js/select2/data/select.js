define([
  '../utils'
], function (Utils) {
  function SelectAdapter ($element, options) {
    this.$element = $element;
  }

  Utils.Extend(SelectAdapter, Utils.Observable);

  SelectAdapter.prototype.current = function () {
    var data = [];
    var self = this;

    this.$element.find(":selected").each(function () {
      var $option = $(this);

      var option = self.item($option);

      data.push(option);
    });

    return data;
  };

  SelectAdapter.prototype.item = function ($option) {
    var data = {
      id: $option.val(),
      text: $option.html()
    };

    return data;
  };

  return SelectAdapter;
});
