define([
  "../utils"
], function (Utils) {
  function SelectAdapter (element, options) {
    this.element = element;
  }

  Utils.Extend(SelectAdapter, Utils.Observable);

  return SelectAdapter;
});
