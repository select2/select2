(function ($, document, window, undefined) {

    var s2 = window.s2 = window.s2 || {};
    var util = s2.util = s2.util || {};

    util.methods = function (object) {
        var methods = {};
        var proto = object.__proto__;
        while (proto !== Object.prototype) {
            for (var methodName in proto) {
                if (!methods[methodName] && typeof(proto[methodName]) === "function") {
                    methods[methodName] = proto[methodName];
                }
            }
            proto = proto.__proto__;

        }
        return methods;
    };

    util.decorate = function (decorator) {
        var decoratorMethods = util.methods(decorator);
        for (var methodName in decoratorMethods) {
            var decoratorMethod = decoratorMethods[methodName];
            if (typeof(decoratorMethod) === "function" && !(methodName === "construct" || methodName.name === "onDelegateAttached" || methodName === "decorateWith")) {
                this[methodName] = (function (prototype, methodName, method, decorator) {
                    return function () {
                        var delegate = this;
                        try {
                            decorator.decorated = function () {
                                return prototype.apply(delegate, arguments);
                            }
                            return method.apply(decorator, arguments);
                        } finally {
                            delete decorator.decorated;
                        }
                    };
                })(this[methodName], methodName, decoratorMethod, decorator);
                this[methodName].displayName = methodName + "#decorator";
            }
        }

        if (decorator.onDelegateAttached) {
            decorator.onDelegateAttached(this);
        }

        decorator.delegate = this;

        return this;

    };

    util.uid = (function () {
        var id = 0;
        return function () {
            return id++;
        };
    }());

    util.tag = function () {
        return "s2-x-" + util.uid();
    }

    util.marker = {};

    util.clazz = function (SuperClass, methods) {

        var constructor = function () {
            if (arguments.length == 1 && arguments[0] == util.marker) {
                return;
            }
            if (this.construct) {
                this.construct.apply(this, arguments);
            }
        };

        constructor.prototype = SuperClass !== Object ? new SuperClass(util.marker) : new SuperClass;

        for (var methodName in methods) {

            constructor.prototype[methodName] = (function (prototype, methodName, method) {
                return function () {
                    var currentSuper = this.super;
                    try {
                        this.super = prototype;
                        return method.apply(this, arguments);
                    } finally {
                        this.super = currentSuper;
                    }
                };
            })(constructor.prototype[methodName], methodName, methods[methodName]);

            constructor.prototype[methodName].displayName = methodName;
        }

        if (!constructor.prototype.decorateWith) {
            constructor.prototype.decorateWith = util.decorate;
        }

        return constructor;

    };

    util.shift = (function () {
        var arrayShift = Array.prototype.shift;
        return function (array) {
            arrayShift.apply(array);
            return array;
        }
    }());

    util.Observable = util.clazz(Object, {
        construct: function () {
            this.listeners = {};
        },
        on: function (event, callback) {
            if (event in this.listeners) {
                this.listeners[event].push(callback);
            } else {
                this.listeners[event] = [callback];
            }
        },
        trigger: function (event) {
            if (event in this.listeners) {
                this.invoke(this.listeners[event], util.shift(arguments));
            }
            if ("*" in this.listeners) {
                this.invoke(this.listeners["*"], arguments);
            }
        },
        invoke: function (listeners, params) {
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].apply(this, params);
            }
        }
    });

    util.Markup = util.clazz(Object, {
        construct: function () {
            this.data = [];
            if (arguments.length > 0) this.append.apply(this, arguments);
        },
        append: function () {
            var parts = null;
            if (arguments.length === 1) {
                if ($.isArray(arguments[0])) {
                    parts = arguments[0];
                } else {
                    this.appendPart(arguments[0]);
                    return this;
                }
            } else {
                parts = arguments;
            }
            for (var i = 0, len = parts.length; i < len; i++) {
                this.appendPart(parts[i]);
            }
            return this;
        },
        appendPart: function (part) {
            if (typeof(part) === "string") {
                this.data.push(part);
            } else {
                this.data.push("" + part);
            }
        },
        replace: function (id, markup) {
            var key = "{{" + id + "}}";
            for (var i = 0, len = this.data.length; i < len; i++) {
                if (this.data[i].trim().indexOf(key) === 0) {
                    markup.data.unshift(1);
                    markup.data.unshift(i);
                    Array.prototype.splice.apply(this.data, markup.data);
                    //this.data.splice(i, 1, markup.data);
                    return this;
                }
            }
            return this;
        },
        toString: function () {
            return this.data.join("");
        }
    });


    var assert = util.assert = {
        error: function (value, error) {
            throw error + " (current value: " + value + ")";
        },
        isTrue: function (value, error) {
            if (value !== true) assert.error(value, error);
        },
        isNotNull: function (value, error) {
            assert.isTrue(value !== undefined && value !== null, error);
        },
        isInstanceOf: function (type, value, error) {
            assert.isNotNull(value, error);
            assert.isTrue(value instanceof type, error);
        },
        isObject: function (value, error) {
            return assert.isInstanceOf(Object, value, error);
        },
        isElement: function (value, error) {
            assert.isInstanceOf($, value, error);
            assert.isTrue(value.length > 0, error);
        },
        isEvent: function (value, error) {
            return assert.isInstanceOf($.Event, value, error);
        },
        isString: function (value, error) {
            return assert.isTrue(typeof(value) === "string" || typeof(value) === "String");
        },
        isFunction: function (value, error) {
            if (!$.isFunction(value)) throw error;
        }
    };

    util.key = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        HOME: 36,
        END: 35,
        BACKSPACE: 8,
        DELETE: 46
    };

})(jQuery, document, window);