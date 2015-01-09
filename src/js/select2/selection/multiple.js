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
      '<span class="select2-selection select2-selection--multiple"' +
        ' tabindex="0" role="combobox" aria-autocomplete="list"' +
        ' aria-haspopup="true" aria-expanded="false">' +
        '<ul class="select2-selection__rendered"></ul>' +
      '</span>'
    );

    $selection.attr('title', this.$element.attr('title'));

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

    this.$selection.on('click', '.select2-selection__choice__remove',
      function (evt) {
      var $remove = $(this);
      var $selection = $remove.parent();

      var data = $selection.data('data');

      self.trigger('unselect', {
        originalEvent: evt,
        data: data
      });
    });

    container.on('enable', function () {
      self.$selection.attr('tabindex', '0');
    });

    container.on('disable', function () {
      self.$selection.attr('tabindex', '-1');
    });
  };

  MultipleSelection.prototype.clear = function () {
    this.$selection.find('.select2-selection__rendered').empty();
  };

  MultipleSelection.prototype.display = function (data) {
    var template = this.options.get('templateSelection');

    return template(data);
  };

  MultipleSelection.prototype.selectionContainer = function () {
    var $container = $(
      '<li class="select2-selection__choice">' +
        '<span class="select2-selection__choice__remove" role="presentation">' +
          '&times;' +
        '</span>' +
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

    this.$selection.find('.select2-selection__rendered').append($selections);
  };

  return MultipleSelection;
});
