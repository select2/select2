define([
  './utils'
], function (Utils) {
  function Dropdown ($element, options) {
    this.$element = $element;
  }

  Utils.Extend(Dropdown, Utils.Observable);

  Dropdown.prototype.render = function () {
    var $dropdown = $(
      '<span class="">' +
        '<span class="results"></span>' +
      '</span>'
    );

    return $dropdown;
  };

  return Dropdown;
});
