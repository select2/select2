define([
  "../utils"
], function (Utils) {
  function Search (decorated, arguments) {
    decorated.call(this, arguments);
  }

  Utils.Extend(Search, Utils.Observable);

  Search.prototype.bind = function (decorated, arguments) {
    this.$container = $container;
  }

  return Search;
});
