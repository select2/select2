define([
  '../utils'
], function (Utils) {
  function BaseSelection ($element, options) {
    this.$element = $element;
    this.options = options;

    BaseSelection.__super__.constructor.call(this);
  }

  Utils.Extend(BaseSelection, Utils.Observable);

  BaseSelection.prototype.render = function () {
    throw new Error('The `render` method must be defined in child classes.');
  };

  BaseSelection.prototype.bind = function (container, $container) {
    var self = this;

    container.on('selection:update', function (params) {
      self.update(params.data);
    });
  };

  BaseSelection.prototype.update = function (data) {
    throw new Error('The `update` method must be defined in child classes.');
  };

  return BaseSelection;
});
