define([
  'jquery',
  './base',
  '../utils'
], function ($, BaseSelection, Utils) {
  function MultipleSelection ($element, options) {
    MultipleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(MultipleSelection, BaseSelection);

  MultipleSelection.prototype.render = function () {
    var $selection = MultipleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--multiple');

    $selection.html(
      '<ul class="select2-selection__rendered"></ul>'
    );

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

    this.$selection.on(
      'click',
      '.select2-selection__choice__remove',
      function (evt) {
        // Ignore the event if it is disabled
        if (self.options.get('disabled')) {
          return;
        }

        var $remove = $(this);
        var $selection = $remove.parent();

        var data = Utils.GetData($selection[0], 'data');

        self.trigger('unselect', {
          originalEvent: evt,
          data: data
        });
      }
    );
  };

  MultipleSelection.prototype.clear = function () {
    var $rendered = this.$selection.find('.select2-selection__rendered');
    $rendered.empty();
    $rendered.removeAttr('title');
  };

  MultipleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  MultipleSelection.prototype.selectionContainer = function () {
    var container =
      '<li class="select2-selection__choice ' +
       'select2-selection__choice__classlist ' +
       'select2-selection__choice__remove__align">' +
        '<span class="select2-selection__choice__remove ' +
        'select2-selection__choice__remove__classlist" role="presentation">' +
          'select2-selection__choice__remove__label' +
        '</span>' +
      '</li>';
      // Default values
      var opts = {
        'select2-selection__choice__classlist': '',
        'select2-selection__choice__remove__classlist': '',
        'select2-selection__choice__remove__label': '&times;',
        'select2-selection__choice__remove__align': 'left'
      };

    // Retrieve the user function (if any)
    var templateContainerFn = this.options.get('templateContainer');
    // Execute it and overwrite defaults with user-supplied values
    if (typeof templateContainerFn === 'function'){
      opts = $.extend(true, opts, templateContainerFn.call(this));
    }
    $.each(opts, function(k, v){
      /* jshint laxbreak: true */
      container = container.replace(new RegExp(k, 'i'),
                                  v.constructor === Array
                                    ? v.join(' ')
                                    : v.toString());
    });
    return $(container);
  };

  MultipleSelection.prototype.update = function (data) {
    this.clear();

    if (data.length === 0) {
      return;
    }

    var $selections = [];

    for (var d = 0; d < data.length; d++) {
      var selection = data[d];

      var $selection = this.selectionContainer();
      var formatted = this.display(selection, $selection);

      /* Checks whether right/left class is present so that
         labeling position can properly be configured.*/
      /* jshint laxbreak: true */
      var res = $selection.hasClass('right')
        ? $selection.removeClass('right').prepend(formatted)
        : $selection.removeClass('left').append(formatted);
      $selection.attr('title', selection.title || selection.text);

      Utils.StoreData($selection[0], 'data', selection);

      $selections.push($selection);

      res = null;
    }

    var $rendered = this.$selection.find('.select2-selection__rendered');

    Utils.appendMany($rendered, $selections);
  };

  return MultipleSelection;
});
