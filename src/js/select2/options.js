define([
  './data/select',
  './results',
  './dropdown',
  './selection/single',
  './selection/multiple',

  './data/array',
  './data/ajax'
], function (SelectData, ResultsList, Dropdown, SingleSelection,
             MultipleSelection) {
  function Options (options) {
    this.options = options;

    this.dataAdapter = options.dataAdapter || SelectData;
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
