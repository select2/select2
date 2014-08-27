define([
  './utils'
], function (Utils) {
  function Dropdown ($element, options) {
    this.$element = $element;
  }

  Utils.Extend(Dropdown, Utils.Observable);

  Dropdown.prototype.render = function () {
    var $dropdown = $(
      '<div class="select2 select2-dropdown">' +
        '<div class="results"></div>' +
      '</div>'
    );

    return $dropdown;
  }

  return Dropdown;
})
