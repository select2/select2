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
  function Options (options) {
    this.options = options;

    if (options.ajax) {
      this.dataAdapter = this.dataAdapter || AjaxData;
    } else if (options.data) {
      this.dataAdapter = this.dataAdapter || ArrayData;
    } else {
      this.dataAdapter = this.dataAdapter || SelectData;
    }

    var SearchableDropdown = Utils.Decorate(Dropdown, Search);

    this.resultsAdapter = ResultsList;
    this.dropdownAdapter = options.dropdownAdapter || SearchableDropdown;
    this.selectionAdapter = options.selectionAdapter;

    if (this.selectionAdapter == null) {
      if (this.options.multiple) {
        this.selectionAdapter = MultipleSelection;
      } else {
        this.selectionAdapter = SingleSelection;
      }
    }
  }

  return Options;
});
