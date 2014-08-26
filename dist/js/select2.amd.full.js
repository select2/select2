define('select2/utils',[], function () {
  var Utils = {};

  Utils.Extend = function (ChildClass, SuperClass) {
    var __hasProp = {}.hasOwnProperty

    function BaseConstructor () {
      this.constructor = ChildClass;
    }

    for (var key in SuperClass) {
      if (__hasProp.call(SuperClass, key)) {
        ChildClass[key] = SuperClass[key];
      }
    }

    BaseConstructor.prototype = SuperClass.prototype;
    ChildClass.prototype = new BaseConstructor();
    ChildClass.__super__ = SuperClass.prototype;

    return ChildClass;
  };

  var Observable = function () {
    this.listeners = {};
  };

  Observable.prototype.on = function (event, callback) {
    if (event in this.listeners) {
      this.listeners[event].push(callback);
    } else {
      this.listeners[event] = [callback];
    }
  };

  Observable.prototype.trigger = function (event) {
    if (event in this.listeners) {
      this.invoke(this.listeners[event], util.shift(arguments));
    }

    if ("*" in this.listeners) {
      this.invoke(this.listeners["*"], arguments);
    }
  };

  Observable.prototype.invoke = function (listeners, params) {
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i].apply(this, params);
    }
  };

  Utils.Observable = Observable;

  return Utils;
});

define('select2/adapters/select',[
  "../utils"
], function (Utils) {
  function SelectAdapter (element, options) {
    this.element = element;
  }

  Utils.Extend(SelectAdapter, Utils.Observable);

  return SelectAdapter;
});

define('select2/options',[
  "./adapters/select"
], function (SelectAdapter) {
  function Options (options) {
    this.options = options;

    this.DataAdapter = SelectAdapter;
  }

  return Options;
})
;
define('select2/core',[
    "jquery",
    "./options",
    "./utils"
], function ($, Options, Utils) {
  var Select2 = function (element, options) {
    this.element = element;
    this.options = new Options(options);

    this.adapter = new this.options.DataAdapter(element, options);
  };

  Utils.Extend(Select2, Utils.Observable);

  return Select2;
});

