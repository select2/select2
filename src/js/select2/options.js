define([
  './data/select',
  './results',
  './dropdown',
  './selection/single',
  './selection/multiple'
], function (SelectData, ResultsList, Dropdown, SingleSelection,
             MultipleSelection) {
  function Options (options) {
    this.options = options;

    this.dataAdapter = SelectData;
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
})
