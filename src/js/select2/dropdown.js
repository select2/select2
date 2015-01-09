define([
  './utils'
], function (Utils) {
  function Dropdown ($element, options) {
    this.$element = $element;
    this.options = options;

    Dropdown.__super__.constructor.call(this);
  }

  Utils.Extend(Dropdown, Utils.Observable);

  Dropdown.prototype.render = function () {
    var $dropdown = $(
      '<span class="select2-dropdown">' +
        '<span class="select2-results"></span>' +
      '</span>'
    );

    $dropdown.attr('dir', this.options.get('dir'));

    this.$dropdown = $dropdown;

    return $dropdown;
  };

  Dropdown.prototype.position = function ($dropdown, $container) {
    // Should be implmented in subclasses
  };

  Dropdown.prototype.destroy = function () {
    // Remove the dropdown from the DOM
    this.$dropdown.remove();
  };

  Dropdown.prototype.bind = function (container, $container) {
    var self = this;

    container.on('select', function (params) {
      self._onSelect(params);
    });

    container.on('unselect', function (params) {
      self._onUnSelect(params);
    });
  };

  Dropdown.prototype._onSelect = function () {
    this.trigger('close');
  };

  Dropdown.prototype._onUnSelect = function () {
    this.trigger('close');
  };

  return Dropdown;
});
