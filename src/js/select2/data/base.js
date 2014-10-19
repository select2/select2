define([
  '../utils'
], function (Utils) {
  function BaseAdapter ($element, options) {
    BaseAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(BaseAdapter, Utils.Observable);

  BaseAdapter.prototype.current = function (callback) {
    throw new Error('The `current` method must be defined in child classes.');
  };

  BaseAdapter.prototype.query = function (params, callback) {
    throw new Error('The `query` method must be defined in child classes.');
  };

  BaseAdapter.prototype.bind = function (container, $container) {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.generateResultId = function (data) {
    var id = '';

    for (var i = 0; i < 4; i++) {
      var r = Math.floor(Math.random() * 16);
      id += r.toString(16);
    }

    if (data.id != null) {
      id += '-' + data.id.toString();
    } else {
      for (var s = 0; s < 4; s++) {
        var idChar = Math.floor(Math.random() * 16);
        id += idChar.toString(16);
      }
    }
    return id;
  };

  return BaseAdapter;
});
