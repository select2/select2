var clazz = (function () {

    var creatingPrototype = {};

    var methods = function (object) {
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
    }

    var decorateWith = function (decorator) {
        var decoratorMethods = methods(decorator);
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

    return function (SuperClass, methods) {

        var constructor = function (arg) {
            if (arg === creatingPrototype) {
                return;
            }
            if (this.construct) {
                this.construct.apply(this, arguments);
            }
        };

        constructor.prototype = SuperClass !== Object ? new SuperClass(creatingPrototype) : new SuperClass;

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
            constructor.prototype.decorateWith = decorateWith;
        }


        return constructor;

    }
})();


