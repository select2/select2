define([
  './data/select',
  './results',
  './dropdown',
  './selection'
], function (SelectData, ResultsList, Dropdown, Selection) {
  function Options (options) {
    this.options = options;

    this.dataAdapter = SelectData;
    this.resultsAdapter = ResultsList;
    this.dropdownAdapter = Dropdown;
    this.selectionAdapter = options.selectionAdapter || Selection;
  }

  return Options;
})
