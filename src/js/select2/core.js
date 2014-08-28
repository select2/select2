define([
  'jquery',
  './options',
  './utils'
], function ($, Options, Utils) {
  var Select2 = function ($element, options) {
    this.$element = $element;
    this.options = new Options(options);

    Select2.__super__.constructor.call(this);

    // Set up containers and adapters

    this.data = new this.options.dataAdapter($element, this.options);

    var $container = this.render();

    $container.insertAfter(this.$element);

    $container.width($element.width());

    this.selection = new this.options.selectionAdapter($element, this.options);

    var $selectionContainer = $container.find(".selection");
    var $selection = this.selection.render();

    $selectionContainer.append($selection);

    this.dropdown = new this.options.dropdownAdapter($element, this.options);

    var $dropdownContainer = $container.find(".dropdown");
    var $dropdown = this.dropdown.render();

    $dropdownContainer.append($dropdown);

    this.results = new this.options.resultsAdapter($element, this.options, this.data);

    var $resultsContainer = $dropdown.find(".results");
    var $results = this.results.render();

    $resultsContainer.append($results);

    // Bind events

    var self = this;

    this.selection.bind($container);
    this.results.bind($container);

    this.$element.on("change", function () {
      self.data.current(function (data) {
        self.selection.update(data);
      });
    });

    this.selection.on("toggle", function () {
      $container.toggleClass("open");
    });

    this.results.on("selected", function (params) {
      self.data.select(params.data);
      $container.removeClass("open");
    });

    // Set the initial state

    this.data.current(function (initialData) {
      self.selection.update(initialData);
    });

    this.data.query({}, function (data) {
      self.results.trigger("results:all", data);
    });
  };

  Utils.Extend(Select2, Utils.Observable);

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
