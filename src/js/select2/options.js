define([
  "./adapters/select"
], function (SelectAdapter) {
  function Options (options) {
    this.options = options;

    this.DataAdapter = SelectAdapter;
  }

  return Options;
})
