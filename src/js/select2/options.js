define([
  './defaults'
], function (Defaults) {
  function Options (options) {
    this.options = Defaults.apply(options);
  }

  Options.prototype.fromElement = function ($e) {
    return this;
  };

  Options.prototype.get = function (key) {
    return this.options[key];
  };

  Options.prototype.set = function (key, val) {
    this.options[key] = val;
  };

  return Options;
});
