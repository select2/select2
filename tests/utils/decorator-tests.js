module("Decorators")

var Utils = require("select2/utils");

test("overridden - method", function (assert) {
  function BaseClass () {};

  BaseClass.prototype.hello = function () {
    return "A";
  }

  function DecoratorClass () {};

  DecoratorClass.prototype.hello = function () {
    return "B";
  }

  var DecoratedClass = Utils.Decorate(BaseClass, DecoratorClass);

  var inst = new DecoratedClass();

  assert.strictEqual(inst.hello(), "B");
});

test("overridden - constructor", function (assert) {
  function BaseClass () {
    this.inherited = true;
  };

  BaseClass.prototype.hello = function () {
    return "A";
  }

  function DecoratorClass (decorated) {
    this.called = true;
  };

  DecoratorClass.prototype.other = function () {
    return "B";
  }

  var DecoratedClass = Utils.Decorate(BaseClass, DecoratorClass);

  var inst = new DecoratedClass();

  assert.ok(inst.called);
  assert.ok(!inst.inherited);
});

test("not overridden - method", function (assert) {
  function BaseClass () {};

  BaseClass.prototype.hello = function () {
    return "A";
  }

  function DecoratorClass () {};

  DecoratorClass.prototype.other = function () {
    return "B";
  }

  var DecoratedClass = Utils.Decorate(BaseClass, DecoratorClass);

  var inst = new DecoratedClass();

  assert.strictEqual(inst.hello(), "A");
});

test("not overridden - constructor", function (assert) {
  function BaseClass () {
    this.called = true;
  };

  BaseClass.prototype.hello = function () {
    return "A";
  }

  function DecoratorClass () {};

  DecoratorClass.prototype.other = function () {
    return "B";
  }

  var DecoratedClass = Utils.Decorate(BaseClass, DecoratorClass);

  var inst = new DecoratedClass();

  assert.ok(inst.called);
});

test("inherited - method", function (assert) {
  function BaseClass () { };

  BaseClass.prototype.hello = function () {
    return "A";
  }

  function DecoratorClass (decorated) { };

  DecoratorClass.prototype.hello = function (decorated) {
    return "B" + decorated.call(this) + "C";
  }

  var DecoratedClass = Utils.Decorate(BaseClass, DecoratorClass);

  var inst = new DecoratedClass();

  assert.strictEqual(inst.hello(), "BAC");
});

test("inherited - constructor", function (assert) {
  function BaseClass () {
    this.inherited = true;
  };

  BaseClass.prototype.hello = function () {
    return "A";
  }

  function DecoratorClass (decorated) {
    this.called = true;

    decorated.call(this);
  };

  DecoratorClass.prototype.other = function () {
    return "B";
  }

  var DecoratedClass = Utils.Decorate(BaseClass, DecoratorClass);

  var inst = new DecoratedClass();

  assert.ok(inst.called);
  assert.ok(inst.inherited);
});
