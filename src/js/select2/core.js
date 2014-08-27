define([
  'jquery',
  './options',
  './utils'
], function ($, Options, Utils) {
  var Select2 = function ($element, options) {
    this.$element = $element;
    this.options = new Options(options);

    // Set up containers and adapters

    this.data = new this.options.dataAdapter($element, options);

    var $container = this.render();

    $container.insertAfter(this.$element);

    this.selection = new this.options.selectionAdapter($element, options);

    var $selectionContainer = $container.find(".selection");
    var $selection = this.selection.render();

    $selectionContainer.append($selection);

    this.dropdown = new this.options.dropdownAdapter($element, options);

    var $dropdown = this.dropdown.render();

    $dropdown.insertAfter($container);

    this.results = new this.options.resultsAdapter($element, options);

    var $resultsContainer = $dropdown.find(".results");
    var $results = this.results.render();

    $resultsContainer.append($results);

    // Set the initial state

    var initialData = this.data.current();

    this.selection.update(initialData);

    var self = this;

    this.$element.on("change", function () {
      self.selection.update(self.data.current());
    })
  };

  Utils.Extend(Select2, Utils.Observable);

  Select2.prototype.render = function () {
    var $container = $(
      '<div class="select2 select2-container">' +
        '<div class="selection"></div>' +
      '</div>'
    );

    return $container;
  };

  return Select2;
});
