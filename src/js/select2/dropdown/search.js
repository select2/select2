define([
  '../utils'
], function (Utils) {
  function Search (decorated, args) {
    decorated.call(this, args);
  }

  Utils.Extend(Search, Utils.Observable);

  Search.prototype.bind = function (decorated, args) {
    this.$container = $container;
  };

  return Search;
});
