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

    container.on('open', function () {
      $(document.body).on('mousedown.select2.' + container.id, function (e) {
        var $target = $(e.target);

        var $select = $target.closest('.select2');

        var $all = $('.select2.open');

        $all.each(function () {
          var $this = $(this);

          if (this == $select[0]) {
            return;
          }

          var $element = $this.data('element');

          $element.select2('close');
        });
      });

      container.on('close', function () {
        $(document.body).off('mousedown.select2.' + container.id);
      });
    });
  };

  BaseSelection.prototype.destroy = function () {
    // Unbind the dropdown click handler if it exists
    $(document.body).off('.select2.' + container.id);
  };

  BaseSelection.prototype.update = function (data) {
    throw new Error('The `update` method must be defined in child classes.');
  };

  return BaseSelection;
});
