
QUnit.test("decorator", function (assert) {

    var A = clazz(Object, {
        hello: function () {
            return "A";
        }
    });

    var Decorator = clazz(Object, {
        hello: function () {
            return "B" + this.decorated() + "B";
        }
    });

    var a = new A();
    assert.strictEqual(a.hello(), "A");


    a.decorateWith(new Decorator());
    var value = a.hello();
    assert.strictEqual(value, "BAB");

});

QUnit.test("super", function (assert) {

    var A = clazz(Object, {
        hello: function () {
            return "A";
        }
    });

    var B = clazz(A, {
        hello: function () {
            return "B" + this.super() + "B";
        }
    });

    var C = clazz(B, {
        hello: function () {
            return "C" + this.super() + "C";
        }
    });

    var D = clazz(B, {
        hello: function () {
            return "D";
        }
    });

    assert.strictEqual(new C().hello(), "CBABC");
    assert.strictEqual(new D().hello(), "D");

});

QUnit.test("super - constructors", function (assert) {

    var A = clazz(Object, {
        construct: function () {
            this.message = "A";
        }
    });

    var B = clazz(A, {
        construct: function () {
            this.super();
            this.message = "B" + this.message + "B";
        }
    });

    var C = clazz(B, {
        construct: function () {
            this.super();
            this.message = "C" + this.message + "C";
        }
    });

    var D = clazz(B, {
        construct: function () {
            this.message = "D";
        }
    });

    assert.strictEqual(new C().message, "CBABC");
    assert.strictEqual(new D().message, "D");

});


QUnit.test("inheritance", function (assert) {

    var counter = 0;

    var A = clazz(Object, {
        hello: function () {
            return "A";
        }
    });

    var B = clazz(A, {

    });

    var a = new A(), b = new B();
    assert.ok(a.hello() === "A", "instance of A has hello()");
    assert.ok(b.hello() === "A", "instance of B has hello()");
    assert.ok(b instanceof B, "b is instance of B");
    assert.ok(b instanceof Object, "b is instance of Object");
    assert.ok(b instanceof A, "b is instance of A");
});


QUnit.test("initialization", function (assert) {

    var counter = 0;

    var A = clazz(Object, {
        construct: function () {
            counter++;
        }
    });

    var B = clazz(A, {

    });

    assert.strictEqual(counter, 0);

    var a = new A();

    assert.strictEqual(counter, 1);

    var b = new B();

    assert.strictEqual(counter, 2);

});