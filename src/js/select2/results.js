define([
  './utils'
], function (Utils) {
  function Results ($element, dataAdapter) {
    this.$element = $element;
    this.dataAdapter = dataAdapter;
  }

  Utils.Extend(Results, Utils.Observable);

  Results.prototype.render = function () {
    var $results = $(
      '<ul class="options"></ul>'
    );

    return $results;
  }

  return Results;
})
