define([
  './base',
  '../utils'
], function (BaseSelection, Utils) {
  function MultipleSelection ($element, options) {
    MultipleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(MultipleSelection, BaseSelection);

  MultipleSelection.prototype.render = function () {
    var $selection = $(
      '<span class="multiple-select">' +
        '<ul class="rendered-selection"></ul>' +
      '</span>'
    );

    this.$selection = $selection;

    return $selection;
  };

  MultipleSelection.prototype.bind = function (container, $container) {
    var self = this;

    MultipleSelection.__super__.bind.apply(this, arguments);

    this.$selection.on('click', function (evt) {
      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on('click', '.remove', function (evt) {
      var $remove = $(this);
      var $selection = $remove.parent();

      var data = $selection.data('data');

      self.trigger('unselected', {
        originalEvent: evt,
        data: data
      });
    });
  };

  MultipleSelection.prototype.clear = function () {
    this.$selection.find('.rendered-selection').empty();
  };

  MultipleSelection.prototype.display = function (data) {
    var template = this.options.get('templateSelection');

    return template(data);
  };

  MultipleSelection.prototype.selectionContainer = function () {
    var $container = $(
      '<li class="choice">' +
        '<span class="remove" role="presentation">&times;</span>' +
      '</li>'
    );

    return $container;
  };

  MultipleSelection.prototype.update = function (data) {
    this.clear();

    if (data.length === 0) {
      return;
    }

    var $selections = [];

    for (var d = 0; d < data.length; d++) {
      var selection = data[d];

      var formatted = this.display(selection);
      var $selection = this.selectionContainer();

      $selection.append(formatted);
      $selection.data('data', selection);

      $selections.push($selection);
    }

    this.$selection.find('.rendered-selection').append($selections);
  };

  return MultipleSelection;
});
