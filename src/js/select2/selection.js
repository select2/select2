define([
  './utils'
], function (Utils) {
  function Selection ($element, options) {
    this.$element = $element;
    this.options = options;
  }

  Utils.Extend(Selection, Utils.Observable);

  Selection.prototype.render = function () {
    var $selection = $(
      '<div class="single-select">' +
        '<div class="rendered-selection"></div>' +
      '</div>'
    );

    this.$selection = $selection;

    return $selection;
  }

  Selection.prototype.bind = function ($container) {
    var self = this;

    $container.on('click', function (evt) {
      self.trigger("toggle", {
        originalEvent: evt
      });
    });
  }

  Selection.prototype.clear = function () {
    this.$selection.find(".rendered-selection").text("");
  }

  Selection.prototype.display = function (data) {
    return data.text;
  }

  Selection.prototype.update = function (data) {
    if (data.length == 0) {
      this.clear();
      return;
    }

    var selection = data[0];

    var formatted = this.display(selection);

    this.$selection.find(".rendered-selection").html(formatted);
  }

  return Selection;
});
