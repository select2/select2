define([
  './base',
  '../utils',
  '../keys'
], function (BaseSelection, Utils, KEYS) {
  function SingleSelection () {
    SingleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(SingleSelection, BaseSelection);

  SingleSelection.prototype.render = function () {
    var $selection = $(
      '<span class="single-select" tabindex="0" role="combobox" ' +
        'aria-autocomplete="list" aria-haspopup="true" aria-expanded="false">' +
        '<span class="rendered-selection"></span>' +
      '</span>'
    );

    $selection.attr('title', this.$element.attr('title'));

    var id = 'select2-container-';

    for (var i = 0; i < 4; i++) {
      var r = Math.floor(Math.random() * 16);
      id += r.toString(16);
    }

    $selection.find('.rendered-selection').attr('id', id);
    $selection.attr('aria-labelledby', id);

    this.$selection = $selection;

    return $selection;
  };

  SingleSelection.prototype.bind = function (container, $container) {
    var self = this;

    SingleSelection.__super__.bind.apply(this, arguments);

    this.$selection.on('mousedown', function (evt) {
      // Only respond to left clicks
      if (evt.which !== 1) {
        return;
      }

      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expended="true"
      self.$selection.attr('aria-expanded', 'true');
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expended="false"
      self.$selection.attr('aria-expanded', 'false');
    });

    this.$selection.on('focus', function (evt) {
      // User focuses on the container
    });

    this.$selection.on('blur', function (evt) {
      // User exits the container
    });

    this.$selection.on('keyup', function (evt) {
      var key = evt.which;

      if (container.isOpen()) {
        if (key == KEYS.ENTER) {
          self.trigger('results:select');
        } else if (key == KEYS.UP) {
          self.trigger('results:previous');
        } else if (key == KEYS.DOWN) {
          self.trigger('results:next');
        }
      } else {
        if (key == KEYS.ENTER || key == KEYS.SPACE) {
          self.trigger('open');
        }
      }
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });
  };

  SingleSelection.prototype.clear = function () {
    this.$selection.find('.rendered-selection').empty();
  };

  SingleSelection.prototype.display = function (data) {
    return data.text;
  };

  SingleSelection.prototype.selectionContainer = function () {
    return $('<span></span>');
  };

  SingleSelection.prototype.update = function (data) {
    if (data.length === 0) {
      this.clear();
      return;
    }

    var selection = data[0];

    var formatted = this.display(selection);

    this.$selection.find('.rendered-selection').html(formatted);

    if (data[0]._resultId != null) {
      this.$selection.attr('aria-activedescendent', data[0]._resultId);
    }
  };

  return SingleSelection;
});
