define([
  './results',

  './dropdown',

  './selection/single',
  './selection/multiple',

  './data/select',
  './data/array',
  './data/ajax'
], function (ResultsList, Dropdown, SingleSelection, MultipleSelection,
             SelectData, ArrayData, AjaxData) {
  function Options (options) {
    this.options = options;

    if (options.ajax) {
      this.dataAdapter = this.dataAdapter || AjaxData;
    } else if (options.data) {
      this.dataAdapter = this.dataAdapter || ArrayData;
    } else {
      this.dataAdapter = this.dataAdapter || SelectData;
    }

    this.resultsAdapter = ResultsList;
    this.dropdownAdapter = options.dropdownAdapter || Dropdown;
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
