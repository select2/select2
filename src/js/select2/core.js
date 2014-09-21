define([
  'jquery',
  './options',
  './utils'
], function ($, Options, Utils) {
  var Select2 = function ($element, options) {
    this.$element = $element;

    options = options || {};

    options.multiple = options.multiple || $element.prop('multiple');

    this.options = new Options(options);

    Select2.__super__.constructor.call(this);

    // Set up containers and adapters

    this.data = new this.options.dataAdapter($element, this.options);

    var $container = this.render();
    this.$container = $container;

    $container.insertAfter(this.$element);

    $container.width($element.width());

    this.selection = new this.options.selectionAdapter($element, this.options);

    var $selectionContainer = $container.find('.selection');
    var $selection = this.selection.render();

    $selectionContainer.append($selection);

    this.dropdown = new this.options.dropdownAdapter($element, this.options);

    var $dropdownContainer = $container.find('.dropdown');
    var $dropdown = this.dropdown.render();

    $dropdownContainer.append($dropdown);

    this.results = new this.options.resultsAdapter(
      $element, this.options, this.data);

    var $resultsContainer = $dropdown.find('.results');
    var $results = this.results.render();

    $resultsContainer.append($results);

    // Bind events

    var self = this;

    this.data.bind(this, $container);
    this.selection.bind(this, $container);
    this.results.bind(this, $container);

    this.$element.on('change', function () {
      self.data.current(function (data) {
        self.trigger('selection:update', {
          data: data
        });
      });
    });

    this.selection.on('toggle', function () {
      self.toggleDropdown();
    });

    this.results.on('selected', function (params) {
      self.trigger('select', params);

      self.trigger('close');
    });

    this.results.on('unselected', function (params) {
      self.trigger('unselect', params);

      self.trigger('close');
    });

    this.on('open', function () {
      $container.addClass('open');
    });

    this.on('close', function () {
      $container.removeClass('open');
    });

    // Set the initial state

    this.data.current(function (initialData) {
      self.trigger('selection:update', {
        data: initialData
      });
    });

    this.data.query({}, function (data) {
      self.results.trigger('results:all', data);
    });

    // Hide the original select

    $element.hide();
  };

  Utils.Extend(Select2, Utils.Observable);

  Select2.prototype.toggleDropdown = function () {
    if (this.$container.hasClass('open')) {
      this.trigger('close');
    } else {
      this.trigger('open');
    }
  };

  Select2.prototype.render = function () {
    var $container = $(
      '<span class="select2 select2-container select2-theme-default">' +
        '<span class="selection"></span>' +
        '<span class="dropdown"></span>' +
      '</span>'
    );

    return $container;
  };

  return Select2;
});
