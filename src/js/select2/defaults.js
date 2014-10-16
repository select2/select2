define([
  './results',

  './selection/single',
  './selection/multiple',

  './utils',

  './data/select',
  './data/array',
  './data/ajax',

  './dropdown',
  './dropdown/search'
], function (ResultsList, SingleSelection, MultipleSelection, Utils,
             SelectData, ArrayData, AjaxData,
             Dropdown, Search) {
  function Defaults () {
    this.reset();
  }

  Defaults.prototype.apply = function (options) {
    options = $.extend({}, options, this.defaults);

    if (options.dataAdapter == null) {
      if (options.ajax) {
        options.dataAdapter = AjaxData;
      } else if (options.data) {
        options.dataAdapter = ArrayData;
      } else {
        options.dataAdapter = SelectData;
      }
    }

    if (options.resultsAdapter == null) {
      options.resultsAdapter = ResultsList;
    }

    if (options.dropdownAdapter == null) {
      var SearchableDropdown = Utils.Decorate(Dropdown, Search);

      options.dropdownAdapter = SearchableDropdown;
    }

    if (options.selectionAdapter == null) {
      if (options.multiple) {
        options.selectionAdapter = MultipleSelection;
      } else {
        options.selectionAdapter = SingleSelection;
      }
    }

    return options;
  };

  Defaults.prototype.reset = function () {
    this.defaults = { };
  };

  var defaults = new Defaults();

  return defaults;
});
