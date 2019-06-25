// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function(modules, cache, entry, globalName) {
    // Save the require from previous bundle to this closure if any
    var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
    var nodeRequire = typeof require === 'function' && require;

    function newRequire(name, jumped) {
        if (!cache[name]) {
            if (!modules[name]) {
                // if we cannot find the module within our internal map or
                // cache jump to the current global require ie. the last bundle
                // that was added to the page.
                var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
                if (!jumped && currentRequire) {
                    return currentRequire(name, true);
                }

                // If there are other bundles on this page the require from the
                // previous one is saved to 'previousRequire'. Repeat this as
                // many times as there are bundles until the module is found or
                // we exhaust the require chain.
                if (previousRequire) {
                    return previousRequire(name, true);
                }

                // Try the node require function if it exists.
                if (nodeRequire && typeof name === 'string') {
                    return nodeRequire(name);
                }

                var err = new Error("Cannot find module '" + name + "'");
                err.code = 'MODULE_NOT_FOUND';
                throw err;
            }

            localRequire.resolve = resolve;
            localRequire.cache = {};

            var module = (cache[name] = new newRequire.Module(name));

            modules[name][0].call(module.exports, localRequire, module, module.exports, this);
        }

        return cache[name].exports;

        function localRequire(x) {
            return newRequire(localRequire.resolve(x));
        }

        function resolve(x) {
            return modules[name][1][x] || x;
        }
    }

    function Module(moduleName) {
        this.id = moduleName;
        this.bundle = newRequire;
        this.exports = {};
    }

    newRequire.isParcelRequire = true;
    newRequire.Module = Module;
    newRequire.modules = modules;
    newRequire.cache = cache;
    newRequire.parent = previousRequire;
    newRequire.register = function(id, exports) {
        modules[id] = [
            function(require, module) {
                module.exports = exports;
            },
            {}
        ];
    };

    var error;
    for (var i = 0; i < entry.length; i++) {
        try {
            newRequire(entry[i]);
        } catch (e) {
            // Save first error but execute all entries
            if (!error) {
                error = e;
            }
        }
    }

    if (entry.length) {
        // Expose entry point to Node, AMD or browser globals
        // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
        var mainExports = newRequire(entry[entry.length - 1]);

        // CommonJS
        if (typeof exports === 'object' && typeof module !== 'undefined') {
            module.exports = mainExports;

            // RequireJS
        } else if (typeof define === 'function' && define.amd) {
            define(function() {
                return mainExports;
            });

            // <script>
        } else if (globalName) {
            this[globalName] = mainExports;
        }
    }

    // Override the current require with this new one
    parcelRequire = newRequire;

    if (error) {
        // throw error from earlier, _after updating parcelRequire_
        throw error;
    }

    return newRequire;
})(
    {
        '../node_modules/preact/dist/preact.module.js': [
            function(require, module, exports) {
                'use strict';

                Object.defineProperty(exports, '__esModule', {
                    value: true
                });
                exports.render = D;
                exports.hydrate = H;
                exports.h = exports.createElement = a;
                exports.Fragment = p;
                exports.createRef = v;
                exports.Component = d;
                exports.cloneElement = I;
                exports.createContext = L;
                exports.toChildArray = _;
                exports._unmount = O;
                exports.options = void 0;
                var n,
                    l,
                    u,
                    t,
                    i,
                    r,
                    f = {},
                    e = [],
                    o = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;
                exports.options = n;

                function c(n, l) {
                    for (var u in l) n[u] = l[u];

                    return n;
                }

                function s(n) {
                    var l = n.parentNode;
                    l && l.removeChild(n);
                }

                function a(n, l, u) {
                    var t,
                        i,
                        r,
                        f,
                        e = arguments;
                    if (((l = c({}, l)), arguments.length > 3))
                        for (u = [u], t = 3; t < arguments.length; t++) u.push(e[t]);
                    if ((null != u && (l.children = u), null != n && null != n.defaultProps))
                        for (i in n.defaultProps) void 0 === l[i] && (l[i] = n.defaultProps[i]);
                    return (f = l.key), null != (r = l.ref) && delete l.ref, null != f && delete l.key, h(n, l, f, r);
                }

                function h(l, u, t, i) {
                    var r = {
                        type: l,
                        props: u,
                        key: t,
                        ref: i,
                        __k: null,
                        __p: null,
                        __b: 0,
                        __e: null,
                        l: null,
                        __c: null,
                        constructor: void 0
                    };
                    return n.vnode && n.vnode(r), r;
                }

                function v() {
                    return {};
                }

                function p(n) {
                    return n.children;
                }

                function y(n) {
                    if (null == n || 'boolean' == typeof n) return null;
                    if ('string' == typeof n || 'number' == typeof n) return h(null, n, null, null);

                    if (null != n.__e || null != n.__c) {
                        var l = h(n.type, n.props, n.key, null);
                        return (l.__e = n.__e), l;
                    }

                    return n;
                }

                function d(n, l) {
                    (this.props = n), (this.context = l);
                }

                function m(n, l) {
                    if (null == l) return n.__p ? m(n.__p, n.__p.__k.indexOf(n) + 1) : null;

                    for (var u; l < n.__k.length; l++)
                        if (null != (u = n.__k[l])) return 'function' != typeof u.type ? u.__e : m(u, 0);

                    return 'function' == typeof n.type ? m(n) : null;
                }

                function w(n) {
                    var l, u;

                    if (null != (n = n.__p) && null != n.__c) {
                        for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++)
                            if (null != (u = n.__k[l]) && null != u.__e) {
                                n.__e = n.__c.base = u.__e;
                                break;
                            }

                        return w(n);
                    }
                }

                function b(t) {
                    !t.__d && (t.__d = !0) && 1 === l.push(t) && (n.debounceRendering || u)(k);
                }

                function k() {
                    var n;

                    for (
                        l.sort(function(n, l) {
                            return l.__v.__b - n.__v.__b;
                        });
                        (n = l.pop());

                    )
                        n.__d && n.forceUpdate(!1);
                }

                function g(n, l, u, t, i, r, o, c) {
                    var a,
                        h,
                        v,
                        p,
                        d,
                        m,
                        w,
                        b,
                        k = l.__k || _(l.props.children, (l.__k = []), y, !0),
                        g = (u && u.__k) || e,
                        x = g.length;

                    if (c == f)
                        if (((c = null), null != r)) c = r[0];
                        else for (h = 0; !c && h < x; h++) c = g[h] && g[h].__e;

                    for (h = 0; h < k.length; h++)
                        if (null != (a = k[h] = y(k[h]))) {
                            if (
                                ((a.__p = l),
                                (a.__b = l.__b + 1),
                                null === (p = g[h]) || (p && a.key == p.key && a.type === p.type))
                            )
                                g[h] = void 0;
                            else
                                for (v = 0; v < x; v++) {
                                    if ((p = g[v]) && a.key == p.key && a.type === p.type) {
                                        g[v] = void 0;
                                        break;
                                    }

                                    p = null;
                                }

                            if (
                                ((d = N(n, a, (p = p || f), t, i, r, o, null, c)),
                                (v = a.ref) && p.ref != v && (b || (b = [])).push(v, a.__c || d),
                                null != d)
                            ) {
                                if ((null == w && (w = d), null != a.l)) (d = a.l), (a.l = null);
                                else if (r == p || d != c || null == d.parentNode)
                                    n: if (null == c || c.parentNode !== n) n.appendChild(d);
                                    else {
                                        for (m = c, v = 0; (m = m.nextSibling) && v < x; v += 2) if (m == d) break n;

                                        n.insertBefore(d, c);
                                    }
                                (c = d.nextSibling), 'function' == typeof l.type && (l.l = d);
                            }
                        }

                    if (((l.__e = w), null != r && 'function' != typeof l.type))
                        for (h = r.length; h--; ) null != r[h] && s(r[h]);

                    for (h = x; h--; ) null != g[h] && O(g[h], l);

                    if (b) for (h = 0; h < b.length; h++) A(b[h], b[++h], l);
                }

                function _(n, l, u, t) {
                    if ((null == l && (l = []), null == n || 'boolean' == typeof n)) t && l.push(null);
                    else if (Array.isArray(n)) for (var i = 0; i < n.length; i++) _(n[i], l, u, t);
                    else l.push(u ? u(n) : n);
                    return l;
                }

                function x(n, l, u, t) {
                    var i,
                        r,
                        f = Object.keys(l).sort();

                    for (i = 0; i < f.length; i++)
                        'children' === (r = f[i]) ||
                            'key' === r ||
                            (u && ('value' === r || 'checked' === r ? n : u)[r] === l[r]) ||
                            C(n, r, l[r], u[r], t);

                    for (i in u) 'children' === i || 'key' === i || i in l || C(n, i, null, u[i], t);
                }

                function C(n, l, u, r, e) {
                    var s, a, h, v;
                    if ('style' === (l = e ? ('className' === l ? 'class' : l) : 'class' === l ? 'className' : l))
                        for (a in (s = c(c({}, r), u)))
                            (u || f)[a] !== (r || f)[a] &&
                                n.style.setProperty(
                                    '-' === a[0] && '-' === a[1] ? a : a.replace(t, '-$&'),
                                    u && a in u
                                        ? 'number' == typeof s[a] && !1 === o.test(a)
                                            ? s[a] + 'px'
                                            : s[a]
                                        : ''
                                );
                    else if ('o' === l[0] && 'n' === l[1])
                        (h = l !== (l = l.replace(/Capture$/, ''))),
                            (v = l.toLowerCase()),
                            (l = (v in n ? v : l).slice(2)),
                            u
                                ? (r || n.addEventListener(l, P, h), ((n.u || (n.u = {}))[l] = u))
                                : n.removeEventListener(l, P, h);
                    else if ('list' !== l && 'tagName' !== l && !e && l in n) {
                        if (n.length && 'value' == l)
                            for (l = n.length; l--; ) n.options[l].selected = n.options[l].value == u;
                        else n[l] = null == u ? '' : u;
                    } else
                        'function' != typeof u &&
                            'dangerouslySetInnerHTML' !== l &&
                            (l !== (l = l.replace(/^xlink:?/, ''))
                                ? null == u || !1 === u
                                    ? n.removeAttributeNS(i, l.toLowerCase())
                                    : n.setAttributeNS(i, l.toLowerCase(), u)
                                : null == u || !1 === u
                                ? n.removeAttribute(l)
                                : n.setAttribute(l, u));
                }

                function P(l) {
                    return this.u[l.type](n.event ? n.event(l) : l);
                }

                function N(l, u, t, i, r, f, e, o, s) {
                    var a,
                        h,
                        v,
                        m,
                        w,
                        b,
                        k,
                        x,
                        C,
                        P,
                        N = u.type;
                    if (void 0 !== u.constructor) return null;
                    (a = n.__b) && a(u);

                    try {
                        n: if ('function' == typeof N) {
                            if (
                                ((x = u.props),
                                (C = (a = N.contextType) && i[a.__c]),
                                (P = a ? (C ? C.props.value : a.__p) : i),
                                t.__c
                                    ? (k = (h = u.__c = t.__c).__p = h.__E)
                                    : (N.prototype && N.prototype.render
                                          ? (u.__c = h = new N(x, P))
                                          : ((u.__c = h = new d(x, P)), (h.constructor = N), (h.render = T)),
                                      C && C.sub(h),
                                      (h.props = x),
                                      h.state || (h.state = {}),
                                      (h.context = P),
                                      (h.__n = i),
                                      (v = h.__d = !0),
                                      (h.__h = [])),
                                null == h.__s && (h.__s = h.state),
                                null != N.getDerivedStateFromProps &&
                                    c(
                                        h.__s == h.state ? (h.__s = c({}, h.__s)) : h.__s,
                                        N.getDerivedStateFromProps(x, h.__s)
                                    ),
                                v)
                            )
                                null == N.getDerivedStateFromProps &&
                                    null != h.componentWillMount &&
                                    h.componentWillMount(),
                                    null != h.componentDidMount && e.push(h);
                            else {
                                if (
                                    (null == N.getDerivedStateFromProps &&
                                        null == o &&
                                        null != h.componentWillReceiveProps &&
                                        h.componentWillReceiveProps(x, P),
                                    !o &&
                                        null != h.shouldComponentUpdate &&
                                        !1 === h.shouldComponentUpdate(x, h.__s, P))
                                ) {
                                    (h.props = x),
                                        (h.state = h.__s),
                                        (h.__d = !1),
                                        (h.__v = u),
                                        (u.__e = t.__e),
                                        (u.__k = t.__k);
                                    break n;
                                }

                                null != h.componentWillUpdate && h.componentWillUpdate(x, h.__s, P);
                            }
                            (m = h.props),
                                (w = h.state),
                                (h.context = P),
                                (h.props = x),
                                (h.state = h.__s),
                                (a = n.__r) && a(u),
                                (h.__d = !1),
                                (h.__v = u),
                                (h.__P = l);

                            try {
                                _(
                                    null != (a = h.render(h.props, h.state, h.context)) && a.type == p && null == a.key
                                        ? a.props.children
                                        : a,
                                    (u.__k = []),
                                    y,
                                    !0
                                );
                            } catch (l) {
                                if ((a = n.__E) && a(l, u, t)) break n;
                                throw l;
                            }

                            for (
                                null != h.getChildContext && (i = c(c({}, i), h.getChildContext())),
                                    v || null == h.getSnapshotBeforeUpdate || (b = h.getSnapshotBeforeUpdate(m, w)),
                                    g(l, u, t, i, r, f, e, s),
                                    h.base = u.__e;
                                (a = h.__h.pop());

                            )
                                a.call(h);

                            v || null == m || null == h.componentDidUpdate || h.componentDidUpdate(m, w, b),
                                k && (h.__E = h.__p = null);
                        } else u.__e = j(t.__e, u, t, i, r, f, e);

                        (a = n.diffed) && a(u);
                    } catch (n) {
                        z(n, u.__p);
                    }

                    return u.__e;
                }

                function $(l, u) {
                    for (var t; (t = l.pop()); )
                        try {
                            t.componentDidMount();
                        } catch (n) {
                            z(n, t.__v.__p);
                        }

                    n.__c && n.__c(u);
                }

                function j(n, l, u, t, i, r, o) {
                    var c,
                        s,
                        a,
                        h,
                        v = u.props,
                        p = l.props;
                    if (((i = 'svg' === l.type || i), null == n && null != r))
                        for (c = 0; c < r.length; c++)
                            if (null != (s = r[c]) && (null === l.type ? 3 === s.nodeType : s.localName === l.type)) {
                                (n = s), (r[c] = null);
                                break;
                            }

                    if (null == n) {
                        if (null === l.type) return document.createTextNode(p);
                        (n = i
                            ? document.createElementNS('http://www.w3.org/2000/svg', l.type)
                            : document.createElement(l.type)),
                            (r = null);
                    }

                    return (
                        null === l.type
                            ? v !== p && (n.data = p)
                            : l !== u &&
                              (null != r && (r = e.slice.call(n.childNodes)),
                              (a = (v = u.props || f).dangerouslySetInnerHTML),
                              ((h = p.dangerouslySetInnerHTML) || a) &&
                                  null == r &&
                                  ((h && a && h.__html == a.__html) || (n.innerHTML = (h && h.__html) || '')),
                              p.multiple && (n.multiple = p.multiple),
                              g(n, l, u, t, 'foreignObject' !== l.type && i, r, o, f),
                              x(n, p, v, i)),
                        n
                    );
                }

                function A(n, l, u) {
                    try {
                        'function' == typeof n ? n(l) : (n.current = l);
                    } catch (n) {
                        z(n, u);
                    }
                }

                function O(l, u, t) {
                    var i, r, f;

                    if (
                        (n.unmount && n.unmount(l),
                        (i = l.ref) && A(i, null, u),
                        t || 'function' == typeof l.type || (t = null != (r = l.__e)),
                        (l.__e = l.l = null),
                        null != (i = l.__c))
                    ) {
                        if (i.componentWillUnmount)
                            try {
                                i.componentWillUnmount();
                            } catch (n) {
                                z(n, u);
                            }
                        i.base = i.__P = null;
                    }

                    if ((i = l.__k)) for (f = 0; f < i.length; f++) i[f] && O(i[f], u, t);
                    null != r && s(r);
                }

                function T(n, l, u) {
                    return this.constructor(n, u);
                }

                function z(l, u) {
                    var t;

                    for (n.__e && n.__e(l, u); u; u = u.__p)
                        if ((t = u.__c) && !t.__p)
                            try {
                                if (t.constructor && null != t.constructor.getDerivedStateFromError)
                                    t.setState(t.constructor.getDerivedStateFromError(l));
                                else {
                                    if (null == t.componentDidCatch) continue;
                                    t.componentDidCatch(l);
                                }
                                return b((t.__E = t));
                            } catch (n) {
                                l = n;
                            }

                    throw l;
                }

                function D(l, u, t) {
                    var i, r;
                    n.__p && n.__p(l, u),
                        (i = u.__k),
                        (l = a(p, null, [l])),
                        (r = []),
                        N(
                            u,
                            t ? l : (u.__k = l),
                            i || f,
                            f,
                            void 0 !== u.ownerSVGElement,
                            t ? [t] : i ? null : e.slice.call(u.childNodes),
                            r,
                            !1,
                            t || f
                        ),
                        $(r, l);
                }

                function H(n, l) {
                    (l.__k = null), D(n, l);
                }

                function I(n, l) {
                    return (
                        (l = c(c({}, n.props), l)),
                        arguments.length > 2 && (l.children = e.slice.call(arguments, 2)),
                        h(n.type, l, l.key || n.key, l.ref || n.ref)
                    );
                }

                function L(n) {
                    var l = {},
                        u = {
                            __c: '__cC' + r++,
                            __p: n,
                            Consumer: function(n, l) {
                                return n.children(l);
                            },
                            Provider: function(n) {
                                var t,
                                    i = this;
                                return (
                                    this.getChildContext ||
                                        ((t = []),
                                        (this.getChildContext = function() {
                                            return (l[u.__c] = i), l;
                                        }),
                                        (this.shouldComponentUpdate = function(n) {
                                            t.some(function(l) {
                                                l.__P && ((l.context = n.value), b(l));
                                            });
                                        }),
                                        (this.sub = function(n) {
                                            t.push(n);
                                            var l = n.componentWillUnmount;

                                            n.componentWillUnmount = function() {
                                                t.splice(t.indexOf(n), 1), l && l.call(n);
                                            };
                                        })),
                                    n.children
                                );
                            }
                        };
                    return (u.Consumer.contextType = u), u;
                }

                (exports.options = n = {}),
                    (d.prototype.setState = function(n, l) {
                        var u = (this.__s !== this.state && this.__s) || (this.__s = c({}, this.state));
                        ('function' != typeof n || (n = n(u, this.props))) && c(u, n),
                            null != n && this.__v && (l && this.__h.push(l), b(this));
                    }),
                    (d.prototype.forceUpdate = function(n) {
                        var l,
                            u,
                            t,
                            i = this.__v,
                            r = this.__v.__e,
                            f = this.__P;
                        f &&
                            ((l = !1 !== n),
                            (u = []),
                            (t = N(
                                f,
                                i,
                                c({}, i),
                                this.__n,
                                void 0 !== f.ownerSVGElement,
                                null,
                                u,
                                l,
                                null == r ? m(i) : r
                            )),
                            $(u, i),
                            t != r && w(i)),
                            n && n();
                    }),
                    (d.prototype.render = p),
                    (l = []),
                    (u = 'function' == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout),
                    (t = /[A-Z]/g),
                    (i = 'http://www.w3.org/1999/xlink'),
                    (r = 0);
            },
            {}
        ],
        '../control/src/announce.ts': [
            function(require, module, exports) {
                'use strict';

                Object.defineProperty(exports, '__esModule', {
                    value: true
                });

                function initialize() {
                    if (document.getElementById('s25-live')) {
                        return;
                    }

                    var live = document.createElement('div');
                    live.setAttribute('id', 's25-live');
                    live.setAttribute('class', 's25-offscreen s25-live');
                    document.body.appendChild(live);
                    var assertive = document.createElement('div');
                    assertive.setAttribute('id', 's25-live-assertive');
                    assertive.setAttribute('role', 'log');
                    assertive.setAttribute('aria-live', 'assertive');
                    assertive.setAttribute('aria-relevant', 'additions');
                    live.appendChild(assertive);
                    var polite = document.createElement('div');
                    polite.setAttribute('id', 's25-live-polite');
                    polite.setAttribute('role', 'log');
                    polite.setAttribute('aria-live', 'polite');
                    polite.setAttribute('aria-relevant', 'additions');
                    live.appendChild(polite);
                }

                exports.initialize = initialize;

                function assertively(message) {
                    add(message, document.getElementById('s25-live-assertive'));
                }

                exports.assertively = assertively;

                function politely(message) {
                    add(message, document.getElementById('s25-live-polite'));
                }

                exports.politely = politely;

                function add(message, container) {
                    var node = document.createElement('div');
                    node.appendChild(document.createTextNode(message));
                    container.appendChild(node); // clean up old nodes

                    var collection = document.getElementById('s25-live-assertive');

                    while (collection.firstChild && collection.firstChild !== node) {
                        collection.removeChild(collection.firstChild);
                    }

                    collection = document.getElementById('s25-live-polite');

                    while (collection.firstChild && collection.firstChild !== node) {
                        collection.removeChild(collection.firstChild);
                    }
                }
            },
            {}
        ],
        '../control/src/dictionary.ts': [
            function(require, module, exports) {
                'use strict';

                Object.defineProperty(exports, '__esModule', {
                    value: true
                });
                var EN_US = {
                    noSearchResults: function noSearchResults() {
                        return 'No results available';
                    },
                    searchResultsLoading: function searchResultsLoading() {
                        return 'Loading...';
                    },
                    removeButtonTitle: function removeButtonTitle() {
                        return 'Remove selected values';
                    },
                    clearButtonTitle: function clearButtonTitle() {
                        return 'Clear selection';
                    },
                    valueAdded: function valueAdded(itemLabel) {
                        return itemLabel + ' added';
                    },
                    minimumCharactersMessage: function minimumCharactersMessage(len, min) {
                        var delta = min - len;
                        return 'Please enter ' + delta + ' more character' + (delta > 1 ? 's' : '');
                    },
                    multiSelectInstructions: function multiSelectInstructions() {
                        return "Items can be removed from this list box by selecting them and activating 'Remove selected values' button. Items can be added by selecting them in the adjacent combobox.";
                    }
                };
                var dictionaries = new Map();
                dictionaries.set('en_us', EN_US);

                function getDictionary(dict) {
                    var fallback = dictionaries.get('en_us');

                    if (!dict) {
                        return fallback;
                    }

                    if (typeof dict === 'string') {
                        var instance = dictionaries.get(dict);
                        return instance ? instance : fallback;
                    } else {
                        return dict;
                    }
                }

                exports.getDictionary = getDictionary;
            },
            {}
        ],
        '../control/src/util.ts': [
            function(require, module, exports) {
                'use strict';

                function _typeof(obj) {
                    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
                        _typeof = function _typeof(obj) {
                            return typeof obj;
                        };
                    } else {
                        _typeof = function _typeof(obj) {
                            return obj &&
                                typeof Symbol === 'function' &&
                                obj.constructor === Symbol &&
                                obj !== Symbol.prototype
                                ? 'symbol'
                                : typeof obj;
                        };
                    }
                    return _typeof(obj);
                }

                Object.defineProperty(exports, '__esModule', {
                    value: true
                });

                function extend() {
                    var params = [];

                    for (var _i = 0; _i < arguments.length; _i++) {
                        params[_i] = arguments[_i];
                    }

                    for (var i = 1; i < arguments.length; i++) {
                        for (var key in arguments[i]) {
                            if (arguments[i].hasOwnProperty(key)) {
                                if (
                                    _typeof(arguments[0][key]) === 'object' &&
                                    _typeof(arguments[i][key]) === 'object'
                                ) {
                                    extend(arguments[0][key], arguments[i][key]);
                                } else {
                                    arguments[0][key] = arguments[i][key];
                                }
                            }
                        }
                    }

                    return arguments[0];
                }

                exports.extend = extend;

                exports.merge = function(target, sources) {
                    if (!sources.length) {
                        return target;
                    }

                    var source = sources.shift();

                    if (source === undefined) {
                        return exports.merge(target, sources);
                    }

                    if (isMergebleObject(target) && isMergebleObject(source)) {
                        Object.keys(source).forEach(function(key) {
                            if (isMergebleObject(source[key])) {
                                if (!target[key]) {
                                    target[key] = {};
                                }

                                exports.merge(target[key], [source[key]]);
                            } else {
                                target[key] = source[key];
                            }
                        });
                    }

                    return exports.merge(target, sources);
                };

                var isObject = function isObject(item) {
                    return item !== null && _typeof(item) === 'object';
                };

                var isMergebleObject = function isMergebleObject(item) {
                    return isObject(item) && !Array.isArray(item);
                };

                function cn() {
                    var values = [];

                    for (var _i = 0; _i < arguments.length; _i++) {
                        values[_i] = arguments[_i];
                    }

                    var classes = [];
                    var hasOwnProperty = {}.hasOwnProperty;

                    for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
                        var value = values_1[_a];

                        if (typeof value === 'string') {
                            classes.push(value);
                        } else if (_typeof(value) === 'object') {
                            for (var key in value) {
                                if (hasOwnProperty.call(value, key) && value[key]) {
                                    classes.push(key);
                                }
                            }
                        }
                    }

                    return classes.join(' ');
                }

                exports.cn = cn;
                var Key;

                (function(Key) {
                    // https://www.w3.org/TR/uievents-key/#named-key-attribute-values
                    Key['ArrowDown'] = 'ArrowDown';
                    Key['ArrowUp'] = 'ArrowUp';
                    Key['ArrowLeft'] = 'ArrowLeft';
                    Key['ArrowRight'] = 'ArrowRight';
                    Key['Space'] = ' ';
                    Key['Enter'] = 'Enter';
                    Key['Tab'] = 'Tab';
                    Key['Home'] = 'Home';
                    Key['End'] = 'End';
                    Key['PageUp'] = 'PageUp';
                    Key['PageDown'] = 'PageDown';
                    Key['Backspace'] = 'Backspace';
                    Key['Delete'] = 'Delete';
                    Key['Clear'] = 'Clear';
                    Key['Escape'] = 'Escape'; // IE 11

                    Key['Down'] = 'Down';
                    Key['Up'] = 'Up';
                    Key['Spacebar'] = 'Spacebar';
                    Key['Left'] = 'Left';
                    Key['Right'] = 'Right';
                })((Key = exports.Key || (exports.Key = {})));

                exports.uuid = (function() {
                    var counter = 0;
                    return function() {
                        return 's25-' + counter++;
                    };
                })();

                function throttle(delay, callback) {
                    var timeout;
                    return function() {
                        if (timeout !== undefined) {
                            window.clearTimeout(timeout);
                            timeout = undefined;
                        } else {
                            timeout = window.setTimeout(function() {
                                callback();
                                timeout = undefined;
                            }, delay);
                        }
                    };
                }

                exports.throttle = throttle; // @ts-ignore

                function debounce(quiet, delegate, that) {
                    var args = Array.from(arguments);

                    if (quiet <= 0) {
                        return function() {
                            delegate.apply(that, args);
                        };
                    } else {
                        var timeout_1;
                        return function() {
                            if (timeout_1) {
                                window.clearTimeout(timeout_1);
                            }

                            timeout_1 = window.setTimeout(function() {
                                timeout_1 = undefined;
                                delegate.apply(that, args);
                            }, quiet);
                        };
                    }
                }

                exports.debounce = debounce;

                function getScrollParents(el) {
                    var style = window.getComputedStyle(el);
                    var elementPosition = style.position;

                    if (elementPosition === 'fixed') {
                        return [el];
                    }

                    var parents = [];
                    var parent = el.parentElement;

                    while (parent && parent.nodeType === 1) {
                        var css = window.getComputedStyle(parent);

                        if (/(overlay|scroll|auto)/.test(css.overflow + ' ' + css.overflowX + ' ' + css.overflowY)) {
                            if (
                                elementPosition !== 'absolute' ||
                                ['relative', 'fixed', 'absolute'].indexOf(css.position || '') >= 0
                            ) {
                                parents.push(parent);
                            }
                        }

                        parent = parent.parentElement;
                    }

                    if (el.ownerDocument) {
                        parents.push(el.ownerDocument.body);
                    } // iframe

                    if (el.ownerDocument !== document && el.ownerDocument && el.ownerDocument.defaultView) {
                        parents.push(el.ownerDocument.defaultView);
                    }

                    parents.push(window);
                    return parents;
                }

                exports.getScrollParents = getScrollParents;

                function calculateVerticalVisibility(container, element) {
                    var c = container.getBoundingClientRect();
                    var e = element.getBoundingClientRect();

                    if (e.bottom < c.top) {
                        // above the fold
                        return 'hidden';
                    }

                    if (e.top > c.bottom) {
                        // below the fold
                        return 'hidden';
                    }

                    if (e.top < c.top && e.bottom <= c.bottom) {
                        return 'partial-top';
                    }

                    if (e.top >= c.top && e.bottom > c.bottom) {
                        return 'partial-bottom';
                    }

                    return 'visible';
                }

                exports.calculateVerticalVisibility = calculateVerticalVisibility;
                /** helper that makes it easier to declare a scope inside a jsx block */

                function scope(delegate) {
                    return delegate();
                }

                exports.scope = scope;
            },
            {}
        ],
        '../control/src/abstract-select.tsx': [
            function(require, module, exports) {
                'use strict';

                var __extends =
                    (this && this.__extends) ||
                    (function() {
                        var _extendStatics = function extendStatics(d, b) {
                            _extendStatics =
                                Object.setPrototypeOf ||
                                ({
                                    __proto__: []
                                } instanceof Array &&
                                    function(d, b) {
                                        d.__proto__ = b;
                                    }) ||
                                function(d, b) {
                                    for (var p in b) {
                                        if (b.hasOwnProperty(p)) d[p] = b[p];
                                    }
                                };

                            return _extendStatics(d, b);
                        };

                        return function(d, b) {
                            _extendStatics(d, b);

                            function __() {
                                this.constructor = d;
                            }

                            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
                        };
                    })();

                var __awaiter =
                    (this && this.__awaiter) ||
                    function(thisArg, _arguments, P, generator) {
                        return new (P || (P = Promise))(function(resolve, reject) {
                            function fulfilled(value) {
                                try {
                                    step(generator.next(value));
                                } catch (e) {
                                    reject(e);
                                }
                            }

                            function rejected(value) {
                                try {
                                    step(generator['throw'](value));
                                } catch (e) {
                                    reject(e);
                                }
                            }

                            function step(result) {
                                result.done
                                    ? resolve(result.value)
                                    : new P(function(resolve) {
                                          resolve(result.value);
                                      }).then(fulfilled, rejected);
                            }

                            step((generator = generator.apply(thisArg, _arguments || [])).next());
                        });
                    };

                var __generator =
                    (this && this.__generator) ||
                    function(thisArg, body) {
                        var _ = {
                                label: 0,
                                sent: function sent() {
                                    if (t[0] & 1) throw t[1];
                                    return t[1];
                                },
                                trys: [],
                                ops: []
                            },
                            f,
                            y,
                            t,
                            g;
                        return (
                            (g = {
                                next: verb(0),
                                throw: verb(1),
                                return: verb(2)
                            }),
                            typeof Symbol === 'function' &&
                                (g[Symbol.iterator] = function() {
                                    return this;
                                }),
                            g
                        );

                        function verb(n) {
                            return function(v) {
                                return step([n, v]);
                            };
                        }

                        function step(op) {
                            if (f) throw new TypeError('Generator is already executing.');

                            while (_) {
                                try {
                                    if (
                                        ((f = 1),
                                        y &&
                                            (t =
                                                op[0] & 2
                                                    ? y['return']
                                                    : op[0]
                                                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                                                    : y.next) &&
                                            !(t = t.call(y, op[1])).done)
                                    )
                                        return t;
                                    if (((y = 0), t)) op = [op[0] & 2, t.value];

                                    switch (op[0]) {
                                        case 0:
                                        case 1:
                                            t = op;
                                            break;

                                        case 4:
                                            _.label++;
                                            return {
                                                value: op[1],
                                                done: false
                                            };

                                        case 5:
                                            _.label++;
                                            y = op[1];
                                            op = [0];
                                            continue;

                                        case 7:
                                            op = _.ops.pop();

                                            _.trys.pop();

                                            continue;

                                        default:
                                            if (
                                                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                                                (op[0] === 6 || op[0] === 2)
                                            ) {
                                                _ = 0;
                                                continue;
                                            }

                                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                                _.label = op[1];
                                                break;
                                            }

                                            if (op[0] === 6 && _.label < t[1]) {
                                                _.label = t[1];
                                                t = op;
                                                break;
                                            }

                                            if (t && _.label < t[2]) {
                                                _.label = t[2];

                                                _.ops.push(op);

                                                break;
                                            }

                                            if (t[2]) _.ops.pop();

                                            _.trys.pop();

                                            continue;
                                    }

                                    op = body.call(thisArg, _);
                                } catch (e) {
                                    op = [6, e];
                                    y = 0;
                                } finally {
                                    f = t = 0;
                                }
                            }

                            if (op[0] & 5) throw op[1];
                            return {
                                value: op[0] ? op[1] : void 0,
                                done: true
                            };
                        }
                    };

                var __importStar =
                    (this && this.__importStar) ||
                    function(mod) {
                        if (mod && mod.__esModule) return mod;
                        var result = {};
                        if (mod != null)
                            for (var k in mod) {
                                if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
                            }
                        result['default'] = mod;
                        return result;
                    };

                Object.defineProperty(exports, '__esModule', {
                    value: true
                });

                var preact_1 = require('preact');

                var announce = __importStar(require('./announce'));

                var dictionary_1 = require('./dictionary');

                var util_1 = require('./util');

                var forceImportOfH = preact_1.h;

                function MarkupRenderer(_a) {
                    var markup = _a.markup;
                    return preact_1.h(
                        'div',
                        {
                            dangerouslySetInnerHTML: {
                                __html: markup
                            }
                        },
                        ' '
                    );
                }

                exports.DEFAULT_PROPS = {
                    allowDuplicates: false,
                    minimumCharacters: 0,
                    quiet: 50,
                    tabIndex: 0
                };

                var AbstractSelect =
                    /** @class */
                    (function(_super) {
                        __extends(AbstractSelect, _super);

                        function AbstractSelect(props) {
                            var _this = _super.call(this, props) || this;

                            _this.getItemId = function(item) {
                                var id = _this.props.itemId;

                                if (typeof id === 'function') {
                                    return id(item);
                                } else {
                                    return '' + item[id];
                                }
                            };

                            _this.getItemLabel = function(item) {
                                var label = _this.props.itemLabel;

                                if (typeof label === 'function') {
                                    return label(item);
                                } else {
                                    return '' + item[label];
                                }
                            };

                            _this.renderValue = function(item) {
                                return _this.renderItem(item, 'valueContent');
                            };

                            _this.renderResult = function(item) {
                                return _this.renderItem(item, 'resultContent');
                            };

                            _this.renderItem = function(item, rendererName) {
                                var renderer = _this.props[rendererName];

                                if (renderer) {
                                    if (typeof renderer === 'function') {
                                        var render = renderer(item, preact_1.h);

                                        if (typeof render === 'string') {
                                            return preact_1.h(MarkupRenderer, {
                                                markup: render
                                            });
                                        } else {
                                            return render;
                                        }
                                    } else {
                                        return preact_1.h(MarkupRenderer, {
                                            markup: item[renderer]
                                        });
                                    }
                                } else {
                                    return preact_1.h(MarkupRenderer, {
                                        markup: _this.getItemLabel(item)
                                    });
                                }
                            };

                            _this.search = function(query, selectedValues, start, callback) {
                                var dictionary = _this.dictionary;
                                var _a = _this.props,
                                    minimumCharacters = _a.minimumCharacters,
                                    allowDuplicates = _a.allowDuplicates,
                                    quiet = _a.quiet,
                                    queryFunc = _a.query;
                                var current = _this.state.results;
                                var minimumCharactersReached = query.length >= minimumCharacters;
                                var token = minimumCharactersReached ? util_1.uuid() : undefined;
                                var control = _this;

                                _this.updateState(
                                    // @ts-ignore
                                    [
                                        start,
                                        {
                                            loading: minimumCharactersReached,
                                            results: {
                                                active: -1,
                                                page: 0,
                                                results: undefined,
                                                showLoadMoreResults: false,
                                                showMinimumCharactersError: !minimumCharactersReached,
                                                showNoSearchResultsFound: false,
                                                token: token
                                            },
                                            search: query
                                        }
                                    ],
                                    function() {
                                        if (callback) {
                                            callback();
                                        }

                                        if (!minimumCharactersReached) {
                                            // todo - throttle this announcement?
                                            announce.politely(
                                                dictionary.minimumCharactersMessage(query.length, minimumCharacters)
                                            );
                                            return;
                                        } // todo - throttle this announcement?
                                        // announce.politely(dictionary.searchResultsLoading());

                                        var execute = function execute() {
                                            return __awaiter(_this, void 0, void 0, function() {
                                                var result, values, ids_1, e_1;
                                                return __generator(this, function(_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            _a.trys.push([0, 2, , 3]);

                                                            return [
                                                                4,
                                                                /*yield*/
                                                                queryFunc(query, 0, token)
                                                            ];

                                                        case 1:
                                                            result = _a.sent();

                                                            if (result.token !== control.state.results.token) {
                                                                // this is a stale result, ignore
                                                                return [
                                                                    2
                                                                    /*return*/
                                                                ];
                                                            }

                                                            values = result.values || [];

                                                            if (
                                                                !allowDuplicates &&
                                                                values.length > 0 &&
                                                                selectedValues.length > 0
                                                            ) {
                                                                ids_1 = new Set();
                                                                selectedValues.forEach(function(v) {
                                                                    return ids_1.add(control.getItemId(v));
                                                                });
                                                                values = values.filter(function(v) {
                                                                    return !ids_1.has(control.getItemId(v));
                                                                });
                                                            }

                                                            if (values.length < 1) {
                                                                announce.politely(dictionary.noSearchResults());
                                                            } // @ts-ignore

                                                            control.updateState({
                                                                loading: false,
                                                                results: {
                                                                    active: values.length > 0 ? 0 : -1,
                                                                    page: 0,
                                                                    results: values,
                                                                    showLoadMoreResults: result.more,
                                                                    showNoSearchResultsFound: values.length < 1
                                                                }
                                                            });
                                                            return [
                                                                3,
                                                                /*break*/
                                                                3
                                                            ];

                                                        case 2:
                                                            e_1 = _a.sent(); // @ts-ignore

                                                            control.updateState({
                                                                loading: false
                                                            });
                                                            return [
                                                                3,
                                                                /*break*/
                                                                3
                                                            ];

                                                        case 3:
                                                            return [
                                                                2
                                                                /*return*/
                                                            ];
                                                    }
                                                });
                                            });
                                        };

                                        if (quiet && quiet > 0) {
                                            if (control.searchTimeout) {
                                                window.clearTimeout(control.searchTimeout);
                                            }

                                            control.searchTimeout = window.setTimeout(execute, quiet);
                                        } else {
                                            execute();
                                        }
                                    }
                                );
                            };

                            _this.searchTimeout = undefined;
                            _this.namespace = util_1.uuid(); // @ts-ignore

                            _this.state = {
                                focused: false,
                                loading: false,
                                open: false,
                                results: {
                                    active: -1,
                                    page: 0,
                                    results: undefined,
                                    token: null,
                                    showLoadMoreResults: false,
                                    showMinimumCharactersError: false,
                                    showNoSearchResultsFound: false
                                },
                                search: ''
                            };
                            return _this;
                        }

                        Object.defineProperty(AbstractSelect.prototype, 'dictionary', {
                            get: function get() {
                                var dict = this.props.dictionary;

                                if (dict) {
                                    if (typeof dict === 'string') {
                                        return dictionary_1.getDictionary(dict);
                                    } else {
                                        return dict;
                                    }
                                } else {
                                    return dictionary_1.getDictionary();
                                }
                            },
                            enumerable: true,
                            configurable: true
                        });

                        AbstractSelect.prototype.updateState = function(update, callback) {
                            var state = util_1.merge(this.state, Array.isArray(update) ? update : [update]);
                            this.setState(state, callback);
                        };

                        AbstractSelect.prototype.loadMore = function() {
                            var _this = this;

                            var _a = this.state,
                                loading = _a.loading,
                                query = _a.search,
                                page = _a.results.page;
                            var dict = this.dictionary;
                            var queryFunc = this.props.query;
                            var control = this;

                            if (loading) {
                                return;
                            }

                            var token = util_1.uuid();
                            var nextPage = page + 1;
                            this.updateState(
                                // @ts-ignore
                                {
                                    loading: true,
                                    results: {
                                        token: token
                                    }
                                },
                                function() {
                                    return __awaiter(_this, void 0, void 0, function() {
                                        var result, current, e_2;
                                        return __generator(this, function(_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 2, , 3]);

                                                    return [
                                                        4,
                                                        /*yield*/
                                                        queryFunc(query, nextPage, token)
                                                    ];

                                                case 1:
                                                    result = _a.sent();
                                                    current = control.state.results;

                                                    if (result.token !== current.token) {
                                                        // this is a stale result, ignore
                                                        return [
                                                            2
                                                            /*return*/
                                                        ];
                                                    }

                                                    if (result.values && result.values.length > 0) {
                                                        // @ts-ignore
                                                        control.updateState({
                                                            loading: false,
                                                            results: {
                                                                page: nextPage,
                                                                results: current.results.concat(result.values),
                                                                showLoadMoreResults: result.more
                                                            }
                                                        });
                                                    } else {
                                                        announce.politely(dict.noSearchResults()); // @ts-ignore

                                                        control.updateState({
                                                            loading: false,
                                                            results: {
                                                                showLoadMoreResults: false
                                                            }
                                                        });
                                                    }

                                                    return [
                                                        3,
                                                        /*break*/
                                                        3
                                                    ];

                                                case 2:
                                                    e_2 = _a.sent(); // @ts-ignore

                                                    control.updateState({
                                                        loading: false
                                                    });
                                                    return [
                                                        3,
                                                        /*break*/
                                                        3
                                                    ];

                                                case 3:
                                                    return [
                                                        2
                                                        /*return*/
                                                    ];
                                            }
                                        });
                                    });
                                }
                            );
                        };

                        AbstractSelect.prototype.handleResultNavigationKeyDown = function(event) {
                            switch (event.key) {
                                case util_1.Key.ArrowUp:
                                case util_1.Key.Up:
                                    this.selectPreviousSearchResult();
                                    event.preventDefault();
                                    return true;

                                case util_1.Key.ArrowDown:
                                case util_1.Key.Down:
                                    this.selectNextSearchResult();
                                    event.preventDefault();
                                    return true;
                            }

                            return false;
                        };

                        AbstractSelect.prototype.selectNextSearchResult = function() {
                            var _a = this.state.results,
                                active = _a.active,
                                results = _a.results;

                            if (results && active < results.length - 1) {
                                // @ts-ignore
                                this.updateState({
                                    results: {
                                        active: active + 1
                                    }
                                });
                            }
                        };

                        AbstractSelect.prototype.selectPreviousSearchResult = function() {
                            var active = this.state.results.active;

                            if (active > 0) {
                                // @ts-ignore
                                this.updateState({
                                    results: {
                                        active: active - 1
                                    }
                                });
                            }
                        };

                        AbstractSelect.prototype.getSelectedSearchResult = function() {
                            var _a = this.state.results,
                                results = _a.results,
                                active = _a.active;
                            return results[active];
                        };

                        AbstractSelect.prototype.selectSearchResult = function(index) {
                            var active = this.state.results.active;

                            if (active !== index) {
                                // @ts-ignore
                                this.updateState({
                                    results: {
                                        active: index
                                    }
                                });
                            }
                        };

                        AbstractSelect.prototype.hasSearchResults = function() {
                            var results = this.state.results.results;
                            return results && results.length > 0;
                        };

                        return AbstractSelect;
                    })(preact_1.Component);

                exports.AbstractSelect = AbstractSelect;
            },
            {
                preact: '../node_modules/preact/dist/preact.module.js',
                './announce': '../control/src/announce.ts',
                './dictionary': '../control/src/dictionary.ts',
                './util': '../control/src/util.ts'
            }
        ],
        '../control/src/dropdown.tsx': [
            function(require, module, exports) {
                'use strict';

                var __extends =
                    (this && this.__extends) ||
                    (function() {
                        var _extendStatics = function extendStatics(d, b) {
                            _extendStatics =
                                Object.setPrototypeOf ||
                                ({
                                    __proto__: []
                                } instanceof Array &&
                                    function(d, b) {
                                        d.__proto__ = b;
                                    }) ||
                                function(d, b) {
                                    for (var p in b) {
                                        if (b.hasOwnProperty(p)) d[p] = b[p];
                                    }
                                };

                            return _extendStatics(d, b);
                        };

                        return function(d, b) {
                            _extendStatics(d, b);

                            function __() {
                                this.constructor = d;
                            }

                            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
                        };
                    })();

                Object.defineProperty(exports, '__esModule', {
                    value: true
                });

                var preact_1 = require('preact');

                var util_1 = require('./util');

                var ContextProvider =
                    /** @class */
                    (function(_super) {
                        __extends(ContextProvider, _super);

                        function ContextProvider() {
                            return (_super !== null && _super.apply(this, arguments)) || this;
                        }

                        ContextProvider.prototype.getChildContext = function() {
                            return this.props.context;
                        };

                        ContextProvider.prototype.render = function() {
                            return this.props.children;
                        };

                        return ContextProvider;
                    })(preact_1.Component);

                function Portal(_a) {
                    var vnode = _a.vnode,
                        container = _a.container; // @ts-ignore

                    var wrap = preact_1.h(
                        ContextProvider,
                        {
                            context: this.context
                        },
                        vnode
                    );
                    preact_1.render(wrap, container);
                    return null;
                }

                function createPortal(vnode, container) {
                    return preact_1.h(Portal, {
                        vnode: vnode,
                        container: container
                    });
                }

                var Dropdown =
                    /** @class */
                    (function(_super) {
                        __extends(Dropdown, _super);

                        function Dropdown(props) {
                            var _this = _super.call(this, props) || this;

                            _this.throttledPosition = util_1.throttle(50, _this.position.bind(_this));
                            return _this;
                        }

                        Dropdown.prototype.componentWillMount = function() {
                            this.container = document.createElement('div');

                            if (this.props.class) {
                                this.container.className = this.props.class;
                            }
                            /*
    this container needs to be able to receive focus so we can tell
    it is not leaving the control - we consider dropdown part of the control
    */

                            this.container.tabIndex = -1;

                            if (this.props.onClick) {
                                this.container.addEventListener('click', this.props.onClick);
                            }

                            if (this.props.onMouseDown) {
                                this.container.addEventListener('mousedown', this.props.onMouseDown);
                            }

                            if (this.props.onFocusOut) {
                                this.container.addEventListener('focusout', this.props.onFocusOut);
                            }

                            document.body.appendChild(this.container);
                        };

                        Dropdown.prototype.componentDidMount = function() {
                            var _this = this;

                            this.props.dropdownRef.current = this.container;
                            this.scrollParents = util_1.getScrollParents(this.props.controlRef.current);
                            this.scrollParents.forEach(function(parent) {
                                ['resize', 'scroll', 'touchmove'].forEach(function(event) {
                                    parent.addEventListener(event, _this.throttledPosition);
                                });
                            });
                            this.position();
                        };

                        Dropdown.prototype.componentWillUnmount = function() {
                            var _this = this;

                            if (this.scrollParents) {
                                this.scrollParents.forEach(function(parent) {
                                    ['resize', 'scroll', 'touchmove'].forEach(function(event) {
                                        parent.removeEventListener(event, _this.throttledPosition);
                                    });
                                });
                                delete this.scrollParents;
                                this.scrollParents = undefined;
                            }

                            this.props.dropdownRef.current = undefined;
                            this.container.parentElement.removeChild(this.container);
                        };

                        Dropdown.prototype.componentDidUpdate = function() {
                            this.position();
                        };

                        Dropdown.prototype.render = function(props) {
                            return createPortal(
                                preact_1.h(preact_1.Fragment, null, this.props.children),
                                this.container
                            );
                        };

                        Dropdown.prototype.position = function() {
                            var control = this.props.controlRef.current;
                            var rect = control.getBoundingClientRect();
                            var style =
                                'top: ' +
                                (rect.top + rect.height + window.pageYOffset) +
                                'px;\n            left: ' +
                                (rect.left + window.pageXOffset) +
                                'px;\n            width: ' +
                                rect.width +
                                'px;';
                            this.container.setAttribute('style', style);
                        };

                        return Dropdown;
                    })(preact_1.Component);

                exports.Dropdown = Dropdown;
            },
            { preact: '../node_modules/preact/dist/preact.module.js', './util': '../control/src/util.ts' }
        ],
        '../control/src/icons.tsx': [
            function(require, module, exports) {
                'use strict';

                Object.defineProperty(exports, '__esModule', {
                    value: true
                });

                var preact_1 = require('preact');

                var forceImportOfH = preact_1.h;

                exports.Toggle = function(_a) {
                    var height = _a.height,
                        width = _a.width;
                    var viewBox = '0 0 ' + width + ' ' + height;
                    return preact_1.h(
                        'svg',
                        {
                            height: height,
                            width: width,
                            viewBox: viewBox,
                            tabIndex: -1,
                            focusable: 'false'
                        },
                        preact_1.h('path', {
                            d:
                                'M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z'
                        })
                    );
                };

                exports.Toggle.displayName = 'Toggle';

                exports.Remove = function(_a) {
                    var width = _a.width,
                        height = _a.height;
                    var viewBox = '0 0 ' + width + ' ' + height;
                    return preact_1.h(
                        'svg',
                        {
                            height: height,
                            width: width,
                            viewBox: viewBox,
                            tabIndex: -1,
                            focusable: 'false'
                        },
                        preact_1.h('path', {
                            d:
                                'M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z'
                        })
                    );
                };

                exports.Remove.displayName = 'Remove';
            },
            { preact: '../node_modules/preact/dist/preact.module.js' }
        ],
        '../control/src/style.ts': [
            function(require, module, exports) {
                'use strict';

                Object.defineProperty(exports, '__esModule', {
                    value: true
                });
                var style;

                (function(style) {
                    style['control'] = 's25-control';
                    style['content'] = 's25-content';
                    style['single'] = 's25-single';
                    style['multi'] = 's25-multi';
                    style['body'] = 's25-body';
                    style['focused'] = 's25-focused';
                    style['active'] = 's25-active';
                    style['live'] = 's25-live';
                    style['multiValues'] = 's25-multi-values';
                    style['value'] = 's25-value';
                    style['item'] = 's25-item';
                    style['selected'] = 's25-selected';
                    style['toggle'] = 's25-toggle';
                    style['remove'] = 's25-remove';
                    style['open'] = 's25-open';
                    style['label'] = 's25-label';
                    style['search'] = 's25-search';
                    style['offscreen'] = 's25-offscreen';
                    style['searchContainer'] = 's25-search-container';
                    style['dropdown'] = 's25-dropdown';
                    style['searchResults'] = 's25-search-results';
                    style['options'] = 's25-options';
                    style['noSearchResults'] = 's25-no-search-results';
                    style['searchResultsMessage'] = 's25-search-results-message';
                    style['searchResultsLoading'] = 's25-search-results-loading';
                    style['searchResultsMinimumError'] = 's25-search-results-minimum-error';
                    style['hiddenAccessible'] = 's25-hidden-accessible';
                    style['hidden'] = 's25-hidden';
                    style['placeholder'] = 's25-placeholder';
                })((style = exports.style || (exports.style = {})));
            },
            {}
        ],
        '../control/src/result-list.tsx': [
            function(require, module, exports) {
                'use strict';

                var __extends =
                    (this && this.__extends) ||
                    (function() {
                        var _extendStatics = function extendStatics(d, b) {
                            _extendStatics =
                                Object.setPrototypeOf ||
                                ({
                                    __proto__: []
                                } instanceof Array &&
                                    function(d, b) {
                                        d.__proto__ = b;
                                    }) ||
                                function(d, b) {
                                    for (var p in b) {
                                        if (b.hasOwnProperty(p)) d[p] = b[p];
                                    }
                                };

                            return _extendStatics(d, b);
                        };

                        return function(d, b) {
                            _extendStatics(d, b);

                            function __() {
                                this.constructor = d;
                            }

                            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
                        };
                    })();

                Object.defineProperty(exports, '__esModule', {
                    value: true
                });

                var preact_1 = require('preact');

                var style_1 = require('./style');

                var util_1 = require('./util');

                var forceImportOfH = preact_1.h;

                var ResultList =
                    /** @class */
                    (function(_super) {
                        __extends(ResultList, _super);

                        function ResultList(props) {
                            var _this = _super.call(this, props) || this;

                            _this.onResultClicked = function(result) {
                                return function(event) {
                                    _this.props.onResultClicked(result, event);
                                };
                            };

                            _this.onMouseMove = function(index) {
                                return function(event) {
                                    if (
                                        _this.lastMouseClientX === event.clientX &&
                                        _this.lastMouseClientY === event.clientY
                                    ) {
                                        // the mouse did not move, the dropdown was scrolled instead, we do not change selected element because
                                        // it will be scrolled into view and mess with the scrolling of the results in the dropdown
                                        return;
                                    }

                                    _this.lastMouseClientX = event.clientX;
                                    _this.lastMouseClientY = event.clientY;

                                    _this.props.onMouseMove(index, event);
                                };
                            };

                            _this.onScroll = function(event) {
                                if (!_this.props.showLoadMoreResults) {
                                    return;
                                }

                                var more = _this.loadMore.current;
                                var drop = _this.container.current;
                                var visibility = util_1.calculateVerticalVisibility(drop, more);

                                if (visibility !== 'hidden') {
                                    _this.props.onLoadMore();
                                }
                            };

                            _this.container = preact_1.createRef();
                            _this.loadMore = preact_1.createRef();
                            return _this;
                        }

                        ResultList.prototype.getResultDomId = function(index) {
                            return this.props.namespace + index;
                        };

                        ResultList.prototype.render = function(props, state, context) {
                            var _this = this;

                            var dictionary = props.dictionary,
                                minimumCharacters = props.minimumCharacters,
                                showLoadMoreResults = props.showLoadMoreResults,
                                results = props.results;
                            var query = this.props.search;
                            return preact_1.h(
                                'div',
                                {
                                    class: style_1.style.body
                                },
                                preact_1.h(
                                    'div',
                                    {
                                        ref: this.container,
                                        onScroll: this.onScroll,
                                        class: style_1.style.searchResults,
                                        'aria-busy': props.loading,
                                        style: {
                                            maxHeight: '175px'
                                        }
                                    },
                                    props.loading &&
                                        preact_1.h(
                                            'div',
                                            {
                                                class: util_1.cn(
                                                    style_1.style.searchResultsLoading,
                                                    style_1.style.searchResultsMessage
                                                )
                                            },
                                            dictionary.searchResultsLoading()
                                        ),
                                    props.showNoSearchResultsFound &&
                                        preact_1.h(
                                            'div',
                                            {
                                                class: util_1.cn(
                                                    style_1.style.noSearchResults,
                                                    style_1.style.searchResultsMessage
                                                )
                                            },
                                            dictionary.noSearchResults()
                                        ),
                                    props.showMinimumCharactersError &&
                                        preact_1.h(
                                            'div',
                                            {
                                                class: util_1.cn(
                                                    style_1.style.searchResultsMinimumError,
                                                    style_1.style.searchResultsMessage
                                                )
                                            },
                                            dictionary.minimumCharactersMessage(query.length, minimumCharacters)
                                        ),
                                    results &&
                                        results.length > 0 &&
                                        preact_1.h(
                                            'div',
                                            {
                                                class: style_1.style.options,
                                                role: 'listbox',
                                                id: props.listboxDomId,
                                                'aria-activedescendant':
                                                    props.active >= 0 ? this.getResultDomId(props.active) : undefined
                                            },
                                            results.map(function(result, index) {
                                                var _a;

                                                var label = props.itemLabel(result);
                                                var render = props.renderItem(result);
                                                var active = props.active === index;
                                                var css = util_1.cn(
                                                    style_1.style.item,
                                                    ((_a = {}), (_a[style_1.style.active] = active), _a)
                                                );

                                                var id = _this.getResultDomId(index);

                                                return preact_1.h(
                                                    'div',
                                                    {
                                                        id: id,
                                                        class: css,
                                                        role: 'option',
                                                        onClick: _this.onResultClicked(result),
                                                        onMouseMove: _this.onMouseMove(index),
                                                        'aria-posinset': index + 1,
                                                        'aria-setsize': showLoadMoreResults
                                                            ? results.length + 1
                                                            : results,
                                                        'aria-selected': active,
                                                        'aria-label': label
                                                    },
                                                    preact_1.h(
                                                        'div',
                                                        {
                                                            class: style_1.style.content
                                                        },
                                                        render
                                                    )
                                                );
                                            })
                                        ),
                                    props.showLoadMoreResults &&
                                        preact_1.h(
                                            'div',
                                            {
                                                ref: this.loadMore,
                                                class: util_1.cn(
                                                    style_1.style.searchResultsMinimumError,
                                                    style_1.style.searchResultsMessage
                                                )
                                            },
                                            dictionary.searchResultsLoading()
                                        )
                                )
                            );
                        };

                        ResultList.prototype.componentDidUpdate = function(prevProps, prevState) {
                            var _a = this.props,
                                active = _a.active,
                                results = _a.results,
                                showLoadMoreResults = _a.showLoadMoreResults;
                            var prevActive = prevProps.active;

                            if (active !== prevActive) {
                                if (
                                    active >= 0 &&
                                    results &&
                                    results.length > 0 &&
                                    active === results.length - 1 &&
                                    showLoadMoreResults
                                ) {
                                    // last result is selected and load more is shown, make sure it is scrolled into view
                                    var drop = this.container.current;
                                    var el = this.loadMore.current;
                                    drop.scrollTop = el.offsetTop + el.offsetHeight - drop.clientHeight; // console.log("scrolling to see load more");//, setting scrolltop", drop, el, el.offsetTop - drop.clientHeight);
                                } else if (active >= 0) {
                                    // make sure it is scrolled into view
                                    var id = this.getResultDomId(active);
                                    var el = document.getElementById(id);

                                    if (el != null) {
                                        var drop = this.container.current;
                                        var c = drop.getBoundingClientRect();
                                        var e = el.getBoundingClientRect();

                                        if (e.top < c.top && e.bottom <= c.bottom) {
                                            var delta = c.top - e.top;
                                            drop.scrollTop = drop.scrollTop - delta;
                                        }

                                        if (e.top >= c.top && e.bottom > c.bottom) {
                                            var delta = e.bottom - c.bottom;
                                            drop.scrollTop = drop.scrollTop + delta;
                                        }
                                    }
                                }
                            }
                        };

                        return ResultList;
                    })(preact_1.Component);

                exports.ResultList = ResultList;
            },
            {
                preact: '../node_modules/preact/dist/preact.module.js',
                './style': '../control/src/style.ts',
                './util': '../control/src/util.ts'
            }
        ],
        '../control/src/multi-select.tsx': [
            function(require, module, exports) {
                'use strict';

                var __extends =
                    (this && this.__extends) ||
                    (function() {
                        var _extendStatics = function extendStatics(d, b) {
                            _extendStatics =
                                Object.setPrototypeOf ||
                                ({
                                    __proto__: []
                                } instanceof Array &&
                                    function(d, b) {
                                        d.__proto__ = b;
                                    }) ||
                                function(d, b) {
                                    for (var p in b) {
                                        if (b.hasOwnProperty(p)) d[p] = b[p];
                                    }
                                };

                            return _extendStatics(d, b);
                        };

                        return function(d, b) {
                            _extendStatics(d, b);

                            function __() {
                                this.constructor = d;
                            }

                            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
                        };
                    })();

                var __assign =
                    (this && this.__assign) ||
                    function() {
                        __assign =
                            Object.assign ||
                            function(t) {
                                for (var s, i = 1, n = arguments.length; i < n; i++) {
                                    s = arguments[i];

                                    for (var p in s) {
                                        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                                    }
                                }

                                return t;
                            };

                        return __assign.apply(this, arguments);
                    };

                var __importStar =
                    (this && this.__importStar) ||
                    function(mod) {
                        if (mod && mod.__esModule) return mod;
                        var result = {};
                        if (mod != null)
                            for (var k in mod) {
                                if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
                            }
                        result['default'] = mod;
                        return result;
                    };

                Object.defineProperty(exports, '__esModule', {
                    value: true
                });

                var preact_1 = require('preact');

                var abstract_select_1 = require('./abstract-select');

                var announce = __importStar(require('./announce'));

                var dropdown_1 = require('./dropdown');

                var icons_1 = require('./icons');

                var result_list_1 = require('./result-list');

                var style_1 = require('./style');

                var util_1 = require('./util');

                var forceImportOfH = preact_1.h;
                var DEFAULT_PROPS = util_1.extend({}, abstract_select_1.DEFAULT_PROPS, {});

                var MultiSelect =
                    /** @class */
                    (function(_super) {
                        __extends(MultiSelect, _super);

                        function MultiSelect(props) {
                            var _this = _super.call(this, props) || this;

                            _this.onLoadMoreResults = function() {
                                _this.loadMore();
                            };

                            _this.focusSearchAndStopPropagation = function(event) {
                                _this.searchRef.current.focus();

                                event.preventDefault();
                                event.stopPropagation();
                            };

                            _this.onToggleClick = function(event) {
                                var open = _this.state.open;

                                if (open) {
                                    _this.close();

                                    _this.searchRef.current.focus();
                                } else {
                                    _this.search(_this.state.search, _this.props.values, {
                                        open: true
                                    });

                                    _this.searchRef.current.focus();
                                }

                                event.preventDefault();
                                event.stopPropagation();
                            };

                            _this.onBodyClick = function(event) {
                                if (event.target === _this.bodyRef.current) {
                                    // if the element itself was clicked, (white space inside the body)
                                    _this.searchRef.current.focus();
                                }
                            };

                            _this.onFocusIn = function(event) {
                                _this.updateState({
                                    focused: true
                                });
                            };

                            _this.onFocusOut = function(event) {
                                var receiver = event.relatedTarget;
                                var container = _this.containerRef.current;
                                var dropdown = _this.dropdownRef.current;
                                var focused =
                                    container.contains(receiver) ||
                                    (dropdown && (dropdown === receiver || dropdown.contains(receiver)));

                                _this.updateState({
                                    focused: focused
                                });

                                if (!focused) {
                                    // this.closeIfOpen();
                                }
                            };

                            _this.onSearchFocus = function(event) {
                                var openOnFocus = _this.props.openOnFocus;
                                var open = _this.state.open;

                                if (!open && openOnFocus) {
                                    _this.search(_this.searchRef.current.value, _this.props.values, {
                                        open: true
                                    });
                                }
                            };

                            _this.onResultMouseMove = function(index, event) {
                                _this.selectSearchResult(index);
                            };

                            _this.selectActiveResult = function() {
                                _this.selectResult(_this.getSelectedSearchResult());
                            };

                            _this.selectResult = function(result) {
                                var _a = _this.props,
                                    values = _a.values,
                                    onChange = _a.onChange;
                                var next = values.slice();
                                next.push(result);

                                _this.close();

                                var label = _this.getItemLabel(result);

                                announce.politely(_this.dictionary.valueAdded(label));
                                onChange(next);
                            };

                            _this.toggleValue = function(index) {
                                var selected = _this.state.values.selected;
                                var next = selected.slice();
                                next[index] = !next[index];

                                _this.updateState({
                                    values: {
                                        selected: next,
                                        active: index
                                    }
                                });
                            };

                            _this.onRemoveSelectedFocus = function(event) {
                                _this.closeIfOpen();
                            };

                            _this.onRemoveSelectedClick = function(event) {
                                var selected = _this.state.values.selected;
                                var _a = _this.props,
                                    values = _a.values,
                                    onChange = _a.onChange;
                                var next = values.slice().filter(function(value, index) {
                                    return !selected[index];
                                });

                                _this.updateState({
                                    values: {
                                        selected: next.map(function(v) {
                                            return false;
                                        })
                                    }
                                });

                                onChange(next);

                                _this.searchRef.current.focus();
                            };

                            _this.onSearchInput = function(event) {
                                var value = event.target.value;

                                _this.search(value, _this.props.values, {
                                    open: true
                                });
                            };

                            _this.onSearchKeyDown = function(event) {
                                if (_this.handleResultNavigationKeyDown(event)) {
                                    return;
                                }

                                var open = _this.state.open;

                                if (open && _this.hasSearchResults) {
                                    switch (event.key) {
                                        case util_1.Key.Enter:
                                            _this.selectActiveResult();

                                            event.preventDefault();
                                            break;

                                        case util_1.Key.Escape:
                                            if (open) {
                                                _this.close();
                                            }

                                            event.preventDefault();
                                            break;
                                    }
                                }
                            };

                            _this.onValueClick = function(index) {
                                return function(event) {
                                    _this.toggleValue(index);

                                    event.preventDefault();
                                    event.stopPropagation();
                                };
                            };

                            _this.onValuesFocus = function(event) {
                                var _a = _this.state.values,
                                    active = _a.active,
                                    selected = _a.selected;
                                var values = _this.props.values; // highlight the first selected value

                                if (active < 0 && values.length > 0) {
                                    var index = 0;

                                    for (var i = 0; i < selected.length; i++) {
                                        if (selected[i]) {
                                            index = i;
                                            break;
                                        }
                                    }

                                    _this.updateState({
                                        values: {
                                            active: index
                                        }
                                    });
                                }

                                _this.closeIfOpen();
                            };

                            _this.close = function() {
                                _this.updateState({
                                    open: false,
                                    results: {
                                        results: undefined
                                    },
                                    search: ''
                                });
                            };

                            _this.onValuesBlur = function(event) {
                                _this.updateState({
                                    values: {
                                        active: -1
                                    }
                                });
                            };

                            _this.onValuesKeyDown = function(event) {
                                var active = _this.state.values.active;
                                var values = _this.props.values;

                                switch (event.key) {
                                    case util_1.Key.ArrowLeft:
                                    case util_1.Key.ArrowUp:
                                    case util_1.Key.Up:
                                    case util_1.Key.Left: {
                                        if (active > 0) {
                                            _this.updateState({
                                                values: {
                                                    active: active - 1
                                                }
                                            });
                                        }

                                        event.preventDefault();
                                        break;
                                    }

                                    case util_1.Key.ArrowRight:
                                    case util_1.Key.Right:
                                    case util_1.Key.ArrowDown:
                                    case util_1.Key.Down: {
                                        if (active < values.length - 1) {
                                            _this.updateState({
                                                values: {
                                                    active: active + 1
                                                }
                                            });
                                        }

                                        event.preventDefault();
                                        break;
                                    }

                                    case util_1.Key.PageDown: {
                                        // TODO
                                        event.preventDefault();
                                        break;
                                    }

                                    case util_1.Key.PageUp: {
                                        // TODO
                                        event.preventDefault();
                                        break;
                                    }

                                    case util_1.Key.Home: {
                                        _this.updateState({
                                            values: {
                                                active: 0
                                            }
                                        });

                                        event.preventDefault();
                                        break;
                                    }

                                    case util_1.Key.End: {
                                        _this.updateState({
                                            values: {
                                                active: values.length - 1
                                            }
                                        });

                                        event.preventDefault();
                                        break;
                                    }

                                    case util_1.Key.Space:
                                    case util_1.Key.Spacebar: {
                                        _this.toggleValue(active);

                                        event.preventDefault();
                                        break;
                                    }
                                }
                            };

                            _this.onDropdownClick = function(event) {
                                // result clicks do not make it this far because they do not propagate
                                // so this click is on something other than result
                                event.preventDefault();
                                event.stopPropagation();

                                _this.searchRef.current.focus();
                            };

                            _this.onResultClicked = function(result, event) {
                                _this.selectResult(result);

                                _this.searchRef.current.focus();

                                event.preventDefault();
                                event.stopPropagation();
                            };

                            var values = props.values;
                            _this.valuesRef = preact_1.createRef();
                            _this.searchRef = preact_1.createRef();
                            _this.bodyRef = preact_1.createRef();
                            _this.containerRef = preact_1.createRef();
                            _this.dropdownRef = preact_1.createRef();
                            _this.state = util_1.extend(_this.state, {
                                values: {
                                    active: -1,
                                    selected: values.map(function(v) {
                                        return false;
                                    })
                                }
                            });
                            return _this;
                        }

                        MultiSelect.prototype.componentWillMount = function() {
                            announce.initialize();
                        };

                        MultiSelect.prototype.render = function(props, state) {
                            var _a, _b;

                            var _this = this;

                            var values = props.values,
                                tabIndex = props.tabIndex,
                                minimumCharacters = props.minimumCharacters,
                                valuesLabel = props.valuesLabel,
                                comboboxLabel = props.comboboxLabel;
                            var open = state.open,
                                loading = state.loading,
                                focused = state.focused,
                                search = state.search,
                                _c = state.values,
                                active = _c.active,
                                selected = _c.selected,
                                results = state.results;
                            var dictionary = this.dictionary;
                            var classes = util_1.cn(
                                style_1.style.control,
                                style_1.style.multi,
                                ((_a = {}), (_a[style_1.style.open] = open), _a),
                                ((_b = {}), (_b[style_1.style.focused] = focused), _b)
                            );

                            if (props.containerClass && props.containerClass.length > 0) {
                                classes += ' ' + props.containerClass;
                            }

                            var instructionsDomId = this.namespace + '-instructions';
                            var resultsDomId = this.namespace + '-results';
                            var resultsNamespace = this.namespace + '-res-';
                            return preact_1.h(
                                preact_1.Fragment,
                                null,
                                preact_1.h(
                                    'div',
                                    {
                                        class: classes,
                                        ref: this.containerRef,
                                        onFocusCapture: this.onFocusIn,
                                        onBlurCapture: this.onFocusOut,
                                        tabIndex: -1,
                                        onMouseDown: this.focusSearchAndStopPropagation
                                    },
                                    preact_1.h(
                                        'div',
                                        {
                                            class: util_1.cn(style_1.style.body),
                                            ref: this.bodyRef,
                                            onClick: this.onBodyClick
                                        },
                                        preact_1.h(
                                            'div',
                                            {
                                                id: instructionsDomId,
                                                class: util_1.cn(style_1.style.offscreen),
                                                style: {
                                                    display: 'none'
                                                }
                                            },
                                            dictionary.multiSelectInstructions()
                                        ),
                                        util_1.scope(function() {
                                            var activeDescendant =
                                                active >= 0 ? _this.namespace + '-vl-' + active : undefined;

                                            if (values && values.length > 0) {
                                                return preact_1.h(
                                                    'div',
                                                    {
                                                        ref: _this.valuesRef,
                                                        class: util_1.cn(style_1.style.multiValues),
                                                        tabIndex: tabIndex,
                                                        role: 'listbox',
                                                        'aria-orientation': 'vertical',
                                                        'aria-multiselectable': 'true',
                                                        'aria-activedescendant': activeDescendant,
                                                        'aria-label': valuesLabel,
                                                        'aria-describedby': instructionsDomId,
                                                        onFocus: _this.onValuesFocus,
                                                        onBlur: _this.onValuesBlur,
                                                        onKeyDown: _this.onValuesKeyDown
                                                    },
                                                    values.map(function(value, index) {
                                                        var _a;

                                                        var isSelected = selected[index];
                                                        var isActive = active === index;
                                                        var css = util_1.cn(
                                                            style_1.style.item,
                                                            ((_a = {}),
                                                            (_a[style_1.style.selected] = isSelected),
                                                            (_a[style_1.style.active] = isActive),
                                                            _a)
                                                        );
                                                        var id = _this.namespace + '-vl-' + index;

                                                        var label = _this.getItemLabel(value);

                                                        var render = _this.renderValue(value);

                                                        return preact_1.h(
                                                            'div',
                                                            {
                                                                id: id,
                                                                class: css,
                                                                role: 'option',
                                                                'aria-selected': isSelected,
                                                                'aria-label': label,
                                                                onMouseDown: function onMouseDown(e) {
                                                                    return e.stopPropagation();
                                                                },
                                                                onClick: _this.onValueClick(index)
                                                            },
                                                            preact_1.h(
                                                                'div',
                                                                {
                                                                    class: style_1.style.content
                                                                },
                                                                render
                                                            )
                                                        );
                                                    })
                                                );
                                            } else {
                                                return null;
                                            }
                                        }),
                                        util_1.scope(function() {
                                            var _a;

                                            var disabled = !selected.find(function(x) {
                                                return x === true;
                                            });
                                            var className = util_1.cn(
                                                style_1.style.remove,
                                                ((_a = {}), (_a[style_1.style.offscreen] = values.length < 1), _a)
                                            );
                                            return preact_1.h(
                                                'button',
                                                {
                                                    className: className,
                                                    onClick: _this.onRemoveSelectedClick,
                                                    onFocus: _this.onRemoveSelectedFocus,
                                                    disabled: disabled,
                                                    'aria-disabled': disabled,
                                                    title: dictionary.removeButtonTitle()
                                                },
                                                preact_1.h(
                                                    'span',
                                                    null,
                                                    preact_1.h(icons_1.Remove, {
                                                        width: 20,
                                                        height: 20
                                                    })
                                                )
                                            );
                                        }),
                                        preact_1.h(
                                            'label',
                                            {
                                                htmlFor: undefined,
                                                className: style_1.style.offscreen
                                            },
                                            props.comboboxLabel
                                        ),
                                        preact_1.h('input', {
                                            type: 'text',
                                            ref: this.searchRef,
                                            value: search,
                                            class: util_1.cn(style_1.style.search),
                                            role: 'combobox',
                                            'aria-label': props.comboboxLabel,
                                            'aria-autocomplete': 'list',
                                            'aria-haspopup': 'true',
                                            'aria-owns': resultsDomId,
                                            'aria-controls': resultsDomId,
                                            'aria-expanded': open ? 'true' : 'false',
                                            'aria-activedescendant':
                                                results.active >= 0 ? resultsNamespace + results.active : undefined,
                                            'aria-busy': loading,
                                            onInput: this.onSearchInput,
                                            onKeyDown: this.onSearchKeyDown,
                                            onFocus: this.onSearchFocus
                                        }),
                                        preact_1.h(
                                            'div',
                                            {
                                                className: util_1.cn(style_1.style.toggle),
                                                'aria-hidden': true,
                                                tabIndex: -1,
                                                onClick: this.onToggleClick
                                            },
                                            preact_1.h(icons_1.Toggle, {
                                                height: 20,
                                                width: 20
                                            })
                                        )
                                    )
                                ),
                                open &&
                                    preact_1.h(
                                        dropdown_1.Dropdown,
                                        {
                                            class: util_1.cn(style_1.style.dropdown, style_1.style.multi),
                                            onClick: this.onDropdownClick,
                                            controlRef: this.containerRef,
                                            dropdownRef: this.dropdownRef
                                        },
                                        preact_1.h(
                                            result_list_1.ResultList,
                                            __assign(
                                                {
                                                    namespace: resultsNamespace,
                                                    minimumCharacters: minimumCharacters,
                                                    dictionary: this.dictionary,
                                                    itemLabel: this.getItemLabel,
                                                    renderItem: this.renderResult,
                                                    listboxDomId: resultsDomId,
                                                    search: search
                                                },
                                                this.state.results,
                                                {
                                                    loading: loading,
                                                    onResultClicked: this.onResultClicked,
                                                    onMouseMove: this.onResultMouseMove,
                                                    onLoadMore: this.onLoadMoreResults
                                                }
                                            )
                                        )
                                    )
                            );
                        };

                        MultiSelect.prototype.componentDidMount = function() {
                            var css = this.props.containerStyle;

                            if (css && css.length > 0) {
                                this.containerRef.current.setAttribute('style', css);
                            }
                        };

                        MultiSelect.prototype.closeIfOpen = function() {
                            if (this.state.open) {
                                this.close();
                            }
                        };

                        MultiSelect.defaultProps = DEFAULT_PROPS;
                        return MultiSelect;
                    })(abstract_select_1.AbstractSelect);

                exports.MultiSelect = MultiSelect;
            },
            {
                preact: '../node_modules/preact/dist/preact.module.js',
                './abstract-select': '../control/src/abstract-select.tsx',
                './announce': '../control/src/announce.ts',
                './dropdown': '../control/src/dropdown.tsx',
                './icons': '../control/src/icons.tsx',
                './result-list': '../control/src/result-list.tsx',
                './style': '../control/src/style.ts',
                './util': '../control/src/util.ts'
            }
        ],
        '../node_modules/parcel-bundler/src/builtins/bundle-url.js': [
            function(require, module, exports) {
                var bundleURL = null;

                function getBundleURLCached() {
                    if (!bundleURL) {
                        bundleURL = getBundleURL();
                    }

                    return bundleURL;
                }

                function getBundleURL() {
                    // Attempt to find the URL of the current script and use that as the base URL
                    try {
                        throw new Error();
                    } catch (err) {
                        var matches = ('' + err.stack).match(
                            /(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g
                        );

                        if (matches) {
                            return getBaseURL(matches[0]);
                        }
                    }

                    return '/';
                }

                function getBaseURL(url) {
                    return (
                        ('' + url).replace(
                            /^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/,
                            '$1'
                        ) + '/'
                    );
                }

                exports.getBundleURL = getBundleURLCached;
                exports.getBaseURL = getBaseURL;
            },
            {}
        ],
        '../node_modules/parcel-bundler/src/builtins/css-loader.js': [
            function(require, module, exports) {
                var bundle = require('./bundle-url');

                function updateLink(link) {
                    var newLink = link.cloneNode();

                    newLink.onload = function() {
                        link.remove();
                    };

                    newLink.href = link.href.split('?')[0] + '?' + Date.now();
                    link.parentNode.insertBefore(newLink, link.nextSibling);
                }

                var cssTimeout = null;

                function reloadCSS() {
                    if (cssTimeout) {
                        return;
                    }

                    cssTimeout = setTimeout(function() {
                        var links = document.querySelectorAll('link[rel="stylesheet"]');

                        for (var i = 0; i < links.length; i++) {
                            if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
                                updateLink(links[i]);
                            }
                        }

                        cssTimeout = null;
                    }, 50);
                }

                module.exports = reloadCSS;
            },
            { './bundle-url': '../node_modules/parcel-bundler/src/builtins/bundle-url.js' }
        ],
        '../control/src/select25.scss': [
            function(require, module, exports) {
                var reloadCSS = require('_css_loader');

                module.hot.dispose(reloadCSS);
                module.hot.accept(reloadCSS);
            },
            { _css_loader: '../node_modules/parcel-bundler/src/builtins/css-loader.js' }
        ],
        '../control/src/single-select.tsx': [
            function(require, module, exports) {
                'use strict';

                var __extends =
                    (this && this.__extends) ||
                    (function() {
                        var _extendStatics = function extendStatics(d, b) {
                            _extendStatics =
                                Object.setPrototypeOf ||
                                ({
                                    __proto__: []
                                } instanceof Array &&
                                    function(d, b) {
                                        d.__proto__ = b;
                                    }) ||
                                function(d, b) {
                                    for (var p in b) {
                                        if (b.hasOwnProperty(p)) d[p] = b[p];
                                    }
                                };

                            return _extendStatics(d, b);
                        };

                        return function(d, b) {
                            _extendStatics(d, b);

                            function __() {
                                this.constructor = d;
                            }

                            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
                        };
                    })();

                var __assign =
                    (this && this.__assign) ||
                    function() {
                        __assign =
                            Object.assign ||
                            function(t) {
                                for (var s, i = 1, n = arguments.length; i < n; i++) {
                                    s = arguments[i];

                                    for (var p in s) {
                                        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                                    }
                                }

                                return t;
                            };

                        return __assign.apply(this, arguments);
                    };

                var __importStar =
                    (this && this.__importStar) ||
                    function(mod) {
                        if (mod && mod.__esModule) return mod;
                        var result = {};
                        if (mod != null)
                            for (var k in mod) {
                                if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
                            }
                        result['default'] = mod;
                        return result;
                    };

                Object.defineProperty(exports, '__esModule', {
                    value: true
                });

                var preact_1 = require('preact');

                var abstract_select_1 = require('./abstract-select');

                var announce = __importStar(require('./announce'));

                var dropdown_1 = require('./dropdown');

                var icons_1 = require('./icons');

                var result_list_1 = require('./result-list');

                var style_1 = require('./style');

                var util_1 = require('./util');

                var forceImportOfH = preact_1.h;
                var DEFAULT_PROPS = util_1.extend({}, abstract_select_1.DEFAULT_PROPS, {
                    allowClear: false
                });

                var SingleSelect =
                    /** @class */
                    (function(_super) {
                        __extends(SingleSelect, _super);

                        function SingleSelect(props) {
                            var _this = _super.call(this, props) || this;

                            _this.onLoadMoreResults = function() {
                                _this.loadMore();
                            };

                            _this.onFocusIn = function(event) {
                                _this.updateState({
                                    focused: true
                                });

                                var openOnFocus = _this.props.openOnFocus;
                                var open = _this.state.open;

                                if (!open && openOnFocus && _this.searchRef.current !== document.activeElement) {
                                    _this.open();
                                }
                            };

                            _this.onFocusOut = function(event) {
                                var receiver = event.relatedTarget;
                                var container = _this.containerRef.current;
                                var dropdown = _this.dropdownRef.current;
                                var search = _this.searchRef.current;
                                var focused =
                                    container.contains(receiver) ||
                                    (dropdown && (dropdown === receiver || dropdown.contains(receiver))) ||
                                    receiver === search;

                                if (_this.state.focused !== focused) {
                                    _this.updateState({
                                        focused: focused
                                    });
                                }

                                if (!focused) {
                                    _this.closeIfOpen();
                                }
                            };

                            _this.close = function(state) {
                                var control = _this;
                                control.valueRef.current.focus();

                                _this.updateState([
                                    state,
                                    {
                                        open: false,
                                        results: {
                                            results: null
                                        },
                                        search: ''
                                    }
                                ]);
                            };

                            _this.onContainerMouseDown = function(event) {
                                event.stopPropagation();
                                event.preventDefault();

                                if (_this.state.open) {
                                    _this.close();
                                } else {
                                    _this.open();
                                }
                            };

                            _this.onSearchFocus = function(event) {
                                _this.updateState({
                                    focused: true
                                });
                            };

                            _this.onSearchInput = function(event) {
                                var value = event.target.value;

                                _this.search(value, _this.getValueAsArray());
                            };

                            _this.onClearFocus = function(event) {
                                _this.closeIfOpen();
                            };

                            _this.onClearClick = function(event) {
                                _this.selectResult(undefined);

                                event.preventDefault();
                                event.stopPropagation();
                            };

                            _this.onClearMouseDown = function(event) {
                                event.stopPropagation();
                                event.preventDefault();
                            };

                            _this.onSearchKeyDown = function(event) {
                                if (_this.handleResultNavigationKeyDown(event)) {
                                    return;
                                }

                                var open = _this.state.open;

                                if (open && _this.hasSearchResults) {
                                    switch (event.key) {
                                        case util_1.Key.Enter:
                                            _this.selectActiveResult();

                                            event.preventDefault();
                                            event.stopPropagation();
                                            break;

                                        case util_1.Key.Escape:
                                            _this.close();

                                            event.preventDefault();
                                            event.stopPropagation();
                                            break;

                                        case util_1.Key.Tab:
                                            // TODO select on tab?
                                            _this.close();

                                            event.preventDefault();
                                            event.stopPropagation();
                                    }
                                }
                            };

                            _this.selectActiveResult = function() {
                                var active = _this.state.results.active;

                                if (active >= 0) {
                                    _this.selectResult(_this.getSelectedSearchResult());
                                }
                            };

                            _this.selectResult = function(result) {
                                var onChange = _this.props.onChange;

                                _this.close({
                                    value: result
                                }); // TODO announce?
                                // const label = this.getItemLabel(result);

                                onChange(result);
                            };

                            _this.onValueKeyDown = function(event) {
                                switch (event.key) {
                                    case util_1.Key.Space:
                                    case util_1.Key.ArrowDown:
                                    case util_1.Key.Down:
                                        _this.open();

                                        event.preventDefault();
                                        event.stopPropagation();
                                        return;
                                }

                                if (event.key.length === 1) {
                                    // focus on search which will put the printable character into the field
                                    _this.open();
                                }
                            };

                            _this.onDropdownMouseDown = function(event) {
                                _this.searchRef.current.focus();

                                event.preventDefault();
                                event.stopPropagation();
                            };

                            _this.onResultMouseMove = function(index, event) {
                                _this.selectSearchResult(index);
                            };

                            _this.onResultClicked = function(result, event) {
                                _this.selectResult(result);

                                event.preventDefault();
                                event.stopPropagation();
                            };

                            _this.searchRef = preact_1.createRef();
                            _this.bodyRef = preact_1.createRef();
                            _this.containerRef = preact_1.createRef();
                            _this.dropdownRef = preact_1.createRef();
                            _this.valueRef = preact_1.createRef();
                            _this.state = util_1.extend(_this.state, {
                                value: _this.props.value
                            });
                            return _this;
                        }

                        SingleSelect.prototype.componentWillMount = function() {
                            announce.initialize();
                        };

                        SingleSelect.prototype.render = function(props, state) {
                            var _a, _b;

                            var _this = this;

                            var minimumCharacters = props.minimumCharacters,
                                tabIndex = props.tabIndex,
                                label = props.label,
                                allowClear = props.allowClear,
                                placeholder = props.placeholder;
                            var value = state.value,
                                open = state.open,
                                loading = state.loading,
                                focused = state.focused,
                                search = state.search,
                                results = state.results;
                            var classes = util_1.cn(
                                style_1.style.control,
                                style_1.style.single,
                                ((_a = {}), (_a[style_1.style.open] = open), _a),
                                ((_b = {}), (_b[style_1.style.focused] = focused), _b)
                            );

                            if (props.containerClass && props.containerClass.length > 0) {
                                classes += ' ' + props.containerClass;
                            }

                            var resultsDomId = this.namespace + '-results';
                            var optionDomId = this.namespace + '-val';
                            var resultsNamespace = this.namespace + '-res-';
                            var dictionary = this.dictionary;
                            var showPlaceholder = !value && placeholder && placeholder.length > 0;
                            var placeholderDomId = this.namespace + '-placeholder';
                            return preact_1.h(
                                preact_1.Fragment,
                                null,
                                preact_1.h(
                                    'div',
                                    {
                                        class: classes,
                                        ref: this.containerRef,
                                        onFocusCapture: this.onFocusIn,
                                        onBlurCapture: this.onFocusOut,
                                        tabIndex: -1,
                                        onMouseDown: this.onContainerMouseDown
                                    },
                                    preact_1.h(
                                        'div',
                                        {
                                            class: util_1.cn(style_1.style.body),
                                            ref: this.bodyRef
                                        },
                                        preact_1.h(
                                            'div',
                                            {
                                                'aria-label': label,
                                                role: 'listbox',
                                                'aria-activedescendant': optionDomId,
                                                'aria-expanded': 'false',
                                                class: util_1.cn(style_1.style.value),
                                                tabIndex: tabIndex,
                                                ref: this.valueRef,
                                                onKeyDown: this.onValueKeyDown,
                                                'aria-describedby': showPlaceholder ? placeholderDomId : undefined
                                            },
                                            value &&
                                                preact_1.h(
                                                    'div',
                                                    {
                                                        class: style_1.style.item,
                                                        role: 'option',
                                                        'aria-selected': 'true',
                                                        'aria-label': this.getItemLabel(value),
                                                        'aria-setsize': -1,
                                                        'aria-posinset': -1,
                                                        id: optionDomId
                                                    },
                                                    preact_1.h(
                                                        'div',
                                                        {
                                                            class: style_1.style.content
                                                        },
                                                        this.renderValue(value)
                                                    )
                                                ),
                                            showPlaceholder &&
                                                preact_1.h(
                                                    'div',
                                                    {
                                                        class: util_1.cn(style_1.style.placeholder),
                                                        id: placeholderDomId
                                                    },
                                                    placeholder
                                                )
                                        ),
                                        util_1.scope(function() {
                                            var _a;

                                            var disabled = !value;
                                            var clazz = util_1.cn(
                                                style_1.style.remove,
                                                ((_a = {}), (_a[style_1.style.offscreen] = !allowClear), _a)
                                            );
                                            return preact_1.h(
                                                'button',
                                                {
                                                    class: clazz,
                                                    onClick: _this.onClearClick,
                                                    onFocus: _this.onClearFocus,
                                                    onMouseDown: _this.onClearMouseDown,
                                                    disabled: disabled,
                                                    'aria-disabled': disabled,
                                                    title: dictionary.clearButtonTitle()
                                                },
                                                preact_1.h(
                                                    'span',
                                                    null,
                                                    preact_1.h(icons_1.Remove, {
                                                        width: 20,
                                                        height: 20
                                                    })
                                                )
                                            );
                                        }),
                                        preact_1.h(
                                            'div',
                                            {
                                                className: style_1.style.toggle,
                                                'aria-hidden': true
                                            },
                                            preact_1.h(icons_1.Toggle, {
                                                height: 20,
                                                width: 20
                                            })
                                        )
                                    )
                                ),
                                open &&
                                    preact_1.h(
                                        dropdown_1.Dropdown,
                                        {
                                            class: util_1.cn(style_1.style.dropdown, style_1.style.single),
                                            onMouseDown: this.onDropdownMouseDown,
                                            controlRef: this.containerRef,
                                            dropdownRef: this.dropdownRef,
                                            onFocusOut: this.onFocusOut
                                        },
                                        preact_1.h(
                                            'div',
                                            null,
                                            preact_1.h('input', {
                                                type: 'text',
                                                ref: this.searchRef,
                                                value: search,
                                                class: util_1.cn(style_1.style.search),
                                                role: 'combobox',
                                                'aria-autocomplete': 'list',
                                                'aria-haspopup': 'true',
                                                'aria-owns': resultsDomId,
                                                'aria-controls': resultsDomId,
                                                'aria-expanded': open ? 'true' : 'false',
                                                'aria-activedescendant':
                                                    results.active >= 0 ? resultsNamespace + results.active : undefined,
                                                'aria-busy': loading,
                                                onInput: this.onSearchInput,
                                                onKeyDown: this.onSearchKeyDown,
                                                onFocus: this.onSearchFocus
                                            }),
                                            preact_1.h(
                                                result_list_1.ResultList,
                                                __assign(
                                                    {
                                                        namespace: resultsNamespace,
                                                        minimumCharacters: minimumCharacters,
                                                        dictionary: this.dictionary,
                                                        itemLabel: this.getItemLabel,
                                                        renderItem: this.renderResult,
                                                        listboxDomId: resultsDomId,
                                                        search: search
                                                    },
                                                    this.state.results,
                                                    {
                                                        loading: loading,
                                                        onResultClicked: this.onResultClicked,
                                                        onMouseMove: this.onResultMouseMove,
                                                        onLoadMore: this.onLoadMoreResults
                                                    }
                                                )
                                            )
                                        )
                                    )
                            );
                        };

                        SingleSelect.prototype.componentDidMount = function() {
                            var css = this.props.containerStyle;

                            if (css && css.length > 0) {
                                this.containerRef.current.setAttribute('style', css);
                            }
                        };

                        SingleSelect.prototype.closeIfOpen = function() {
                            if (this.state.open) {
                                this.close();
                            }
                        };

                        SingleSelect.prototype.getValueAsArray = function() {
                            return this.state.value ? [this.state.value] : [];
                        };

                        SingleSelect.prototype.open = function(query) {
                            var _this = this;

                            if (query === void 0) {
                                query = '';
                            }

                            this.search(
                                query,
                                this.getValueAsArray(),
                                {
                                    open: true
                                },
                                function() {
                                    _this.searchRef.current.focus();
                                }
                            );
                        };

                        SingleSelect.defaultProps = DEFAULT_PROPS;
                        return SingleSelect;
                    })(abstract_select_1.AbstractSelect);

                exports.SingleSelect = SingleSelect;
            },
            {
                preact: '../node_modules/preact/dist/preact.module.js',
                './abstract-select': '../control/src/abstract-select.tsx',
                './announce': '../control/src/announce.ts',
                './dropdown': '../control/src/dropdown.tsx',
                './icons': '../control/src/icons.tsx',
                './result-list': '../control/src/result-list.tsx',
                './style': '../control/src/style.ts',
                './util': '../control/src/util.ts'
            }
        ],
        '../bridge/src/ajax.ts': [
            function(require, module, exports) {
                'use strict';

                Object.defineProperty(exports, '__esModule', {
                    value: true
                });

                var util_1 = require('../../control/src/util');

                function createQueryFromAjax(ajax) {
                    ajax = util_1.extend({}, ajax, {
                        params: function params(term, page) {
                            return {
                                term: term,
                                page: page
                            };
                        },
                        process: function process(data) {
                            var json = JSON.parse(data);
                            return {
                                more: json.more,
                                values: json.values
                            };
                        }
                    });
                    return function(term, page, token) {
                        return new Promise(function(resolve, reject) {
                            var url = ajax.url;
                            var params = ajax.params(term, page);

                            if (params) {
                                var separator_1 = url.indexOf('?') >= 0 ? '&' : '?';
                                Object.entries(params).forEach(function(_a) {
                                    var key = _a[0],
                                        value = _a[1];
                                    url += separator_1;
                                    separator_1 = '&';
                                    url += encodeURIComponent(key) + '=' + encodeURIComponent(value);
                                });
                            }

                            var request = new XMLHttpRequest();
                            request.open('GET', url, true);

                            request.onload = function() {
                                if (request.status >= 200 && request.status < 400) {
                                    var data = ajax.process(request.responseText);
                                    resolve({
                                        values: data.values,
                                        more: data.more,
                                        token: token
                                    });
                                } else {
                                    reject();
                                }
                            };

                            request.onerror = reject;
                            request.send();
                        });
                    };
                }

                exports.createQueryFromAjax = createQueryFromAjax;
            },
            { '../../control/src/util': '../control/src/util.ts' }
        ],
        '../bridge/src/store.ts': [
            function(require, module, exports) {
                'use strict';

                Object.defineProperty(exports, '__esModule', {
                    value: true
                });

                var Store =
                    /** @class */
                    (function() {
                        function Store() {
                            this.store = new Map();
                        }

                        Store.prototype.get = function(key) {
                            return this.store.get(key);
                        };

                        Store.prototype.set = function(key, value) {
                            this.store.set(key, value);
                        };

                        Store.getStore = function(key) {
                            var store = Store.stores.get(key);

                            if (!store) {
                                store = new Store();
                                Store.stores.set(key, store);
                            }

                            return store;
                        };

                        Store.hasStore = function(key) {
                            return Store.stores.has(key);
                        };

                        Store.removeStore = function(key) {
                            Store.stores.delete(key);
                        };

                        Store.stores = new WeakMap();
                        return Store;
                    })();

                exports.Store = Store;
            },
            {}
        ],
        '../bridge/src/select25.tsx': [
            function(require, module, exports) {
                'use strict';

                var __extends =
                    (this && this.__extends) ||
                    (function() {
                        var _extendStatics = function extendStatics(d, b) {
                            _extendStatics =
                                Object.setPrototypeOf ||
                                ({
                                    __proto__: []
                                } instanceof Array &&
                                    function(d, b) {
                                        d.__proto__ = b;
                                    }) ||
                                function(d, b) {
                                    for (var p in b) {
                                        if (b.hasOwnProperty(p)) d[p] = b[p];
                                    }
                                };

                            return _extendStatics(d, b);
                        };

                        return function(d, b) {
                            _extendStatics(d, b);

                            function __() {
                                this.constructor = d;
                            }

                            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
                        };
                    })();

                Object.defineProperty(exports, '__esModule', {
                    value: true
                });
                /** jsx:pragma h */

                var preact_1 = require('preact');

                var multi_select_1 = require('../../control/src/multi-select');

                require('../../control/src/select25.scss');

                var single_select_1 = require('../../control/src/single-select');

                var util_1 = require('../../control/src/util');

                var ajax_1 = require('./ajax');

                var store_1 = require('./store');

                var forceImportOfH = preact_1.h;
                var StoreKeys;

                (function(StoreKeys) {
                    StoreKeys['targetElement'] = 'te';
                })(StoreKeys || (StoreKeys = {}));

                var DEFAULT_OPTIONS = {
                    allowClear: false,
                    dictionary: 'en_us',
                    hiddenValue: function hiddenValue(values, options) {
                        var id = function id(item) {
                            if (typeof options.itemId === 'function') {
                                return options.itemId(item);
                            } else {
                                return '' + item[options.itemId];
                            }
                        };

                        if (values) {
                            if (Array.isArray(values)) {
                                if (values.length > 0) {
                                    return values.map(id).join(',');
                                } else {
                                    return '';
                                }
                            } else {
                                return id(values);
                            }
                        } else {
                            return '';
                        }
                    },
                    minimumCharacters: 0,
                    multiple: false,
                    openOnFocus: false
                };

                function triggerOnChange(element, data) {
                    var event = document.createEvent('HTMLEvents');
                    event.initEvent('change', false, true);
                    event[data] = data;
                    element.dispatchEvent(event);
                }

                var MultiSelectWrapper =
                    /** @class */
                    (function(_super) {
                        __extends(MultiSelectWrapper, _super);

                        function MultiSelectWrapper(props) {
                            var _this = _super.call(this, props) || this;

                            _this.onChange = function(values) {
                                _this.setState({
                                    values: values
                                });

                                _this.setHiddenValue(values);

                                triggerOnChange(_this.props.element, values);
                            };

                            _this.state = {
                                values: props.options.values
                            };
                            return _this;
                        }

                        MultiSelectWrapper.prototype.componentDidUpdate = function() {
                            this.setHiddenValue(this.state.values);
                        };

                        MultiSelectWrapper.prototype.componentDidMount = function() {
                            this.setHiddenValue(this.state.values);
                        };

                        MultiSelectWrapper.prototype.render = function(props, state, context) {
                            var opts = this.props.options;
                            return preact_1.h(multi_select_1.MultiSelect, {
                                containerClass: opts.containerClass,
                                containerStyle: opts.containerStyle,
                                valuesLabel: opts.valuesLabel,
                                comboboxLabel: opts.comboboxLabel,
                                itemId: opts.itemId,
                                itemLabel: opts.itemLabel,
                                valueContent: opts.valueContent,
                                resultContent: opts.resultContent,
                                query: opts.query,
                                quiet: opts.quiet,
                                minimumCharacters: opts.minimumCharacters,
                                openOnFocus: opts.openOnFocus,
                                dictionary: opts.dictionary,
                                tabIndex: opts.tabIndex,
                                allowDuplicates: opts.allowDuplicates,
                                values: this.state.values,
                                onChange: this.onChange
                            });
                        };

                        MultiSelectWrapper.prototype.setHiddenValue = function(values) {
                            var _a = this.props,
                                element = _a.element,
                                options = _a.options;
                            element.value = options.hiddenValue(values, options);
                        };

                        return MultiSelectWrapper;
                    })(preact_1.Component);

                var SingleSelectWrapper =
                    /** @class */
                    (function(_super) {
                        __extends(SingleSelectWrapper, _super);

                        function SingleSelectWrapper(props) {
                            var _this = _super.call(this, props) || this;

                            _this.onChange = function(value) {
                                _this.setState({
                                    value: value
                                });

                                _this.setHiddenValue(value);

                                triggerOnChange(_this.props.element, value);
                            };

                            _this.state = {
                                value: props.options.value
                            };
                            return _this;
                        }

                        SingleSelectWrapper.prototype.componentDidMount = function() {
                            this.setHiddenValue(this.state.value);
                        };

                        SingleSelectWrapper.prototype.componentDidUpdate = function() {
                            this.setHiddenValue(this.state.value);
                        };

                        SingleSelectWrapper.prototype.render = function(props, state, context) {
                            var opts = this.props.options;
                            return preact_1.h(single_select_1.SingleSelect, {
                                label: opts.label,
                                comboboxLabel: opts.comboboxLabel,
                                containerClass: opts.containerClass,
                                containerStyle: opts.containerStyle,
                                allowClear: opts.allowClear,
                                placeholder: opts.placeholder,
                                itemId: opts.itemId,
                                itemLabel: opts.itemLabel,
                                valueContent: opts.valueContent,
                                resultContent: opts.resultContent,
                                query: opts.query,
                                quiet: opts.quiet,
                                minimumCharacters: opts.minimumCharacters,
                                openOnFocus: opts.openOnFocus,
                                dictionary: opts.dictionary,
                                tabIndex: opts.tabIndex,
                                allowDuplicates: opts.allowDuplicates,
                                value: this.state.value,
                                onChange: this.onChange
                            });
                        };

                        SingleSelectWrapper.prototype.setHiddenValue = function(value) {
                            var _a = this.props,
                                element = _a.element,
                                options = _a.options;
                            element.value = options.hiddenValue(value, options);
                        };

                        return SingleSelectWrapper;
                    })(preact_1.Component);

                function create(element, options) {
                    // TODO make sure we are attached to hidden input
                    var store = store_1.Store.getStore(element);
                    options = util_1.extend({}, DEFAULT_OPTIONS, options);

                    if (!options.query && options.ajax) {
                        options.query = ajax_1.createQueryFromAjax(options.ajax);
                    }

                    if (!options.tabIndex && element.tabIndex) {
                        options.tabIndex = element.tabIndex;
                    }

                    if (element.getAttribute('s25-style')) {
                        var style = options.containerStyle || '';

                        if (style.length > 0) {
                            style += ';';
                        }

                        style += element.getAttribute('s25-style');
                        options.containerStyle = style;
                    }

                    if (element.getAttribute('s25-class')) {
                        var clazz = options.containerClass || '';

                        if (clazz.length > 0) {
                            clazz += ' ';
                        }

                        clazz += element.getAttribute('s25-class');
                        options.containerClass = clazz;
                    } // create placeholder element into which the control will be rendered

                    var parentElement = element.parentElement;
                    var targetElement = document.createElement('div');
                    parentElement.insertBefore(targetElement, element);
                    store.set(StoreKeys.targetElement, targetElement); // render the replacement

                    if (options.multiple) {
                        preact_1.render(
                            preact_1.h(MultiSelectWrapper, {
                                element: element,
                                options: options
                            }),
                            parentElement,
                            targetElement
                        );
                    } else {
                        preact_1.render(
                            preact_1.h(SingleSelectWrapper, {
                                element: element,
                                options: options
                            }),
                            parentElement,
                            targetElement
                        );
                    }
                }

                function destroy(element) {
                    if (!store_1.Store.hasStore(element)) {
                        return;
                    }

                    var store = store_1.Store.getStore(element);
                    var targetElement = store.get(StoreKeys.targetElement);
                    var parentElement = element.parentElement;
                    preact_1.render(null, parentElement, targetElement);
                    parentElement.removeChild(targetElement);
                    store_1.Store.removeStore(element);
                }

                var select25 = {
                    create: create,
                    destroy: destroy
                };
                exports.select25 = select25;
                window.select25 = select25;
            },
            {
                preact: '../node_modules/preact/dist/preact.module.js',
                '../../control/src/multi-select': '../control/src/multi-select.tsx',
                '../../control/src/select25.scss': '../control/src/select25.scss',
                '../../control/src/single-select': '../control/src/single-select.tsx',
                '../../control/src/util': '../control/src/util.ts',
                './ajax': '../bridge/src/ajax.ts',
                './store': '../bridge/src/store.ts'
            }
        ],
        '../node_modules/parcel-bundler/src/builtins/hmr-runtime.js': [
            function(require, module, exports) {
                var global = arguments[3];
                var OVERLAY_ID = '__parcel__error__overlay__';
                var OldModule = module.bundle.Module;

                function Module(moduleName) {
                    OldModule.call(this, moduleName);
                    this.hot = {
                        data: module.bundle.hotData,
                        _acceptCallbacks: [],
                        _disposeCallbacks: [],
                        accept: function(fn) {
                            this._acceptCallbacks.push(fn || function() {});
                        },
                        dispose: function(fn) {
                            this._disposeCallbacks.push(fn);
                        }
                    };
                    module.bundle.hotData = null;
                }

                module.bundle.Module = Module;
                var checkedAssets, assetsToAccept;
                var parent = module.bundle.parent;

                if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
                    var hostname = '' || location.hostname;
                    var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
                    var ws = new WebSocket(protocol + '://' + hostname + ':' + '57136' + '/');

                    ws.onmessage = function(event) {
                        checkedAssets = {};
                        assetsToAccept = [];
                        var data = JSON.parse(event.data);

                        if (data.type === 'update') {
                            var handled = false;
                            data.assets.forEach(function(asset) {
                                if (!asset.isNew) {
                                    var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

                                    if (didAccept) {
                                        handled = true;
                                    }
                                }
                            }); // Enable HMR for CSS by default.

                            handled =
                                handled ||
                                data.assets.every(function(asset) {
                                    return asset.type === 'css' && asset.generated.js;
                                });

                            if (handled) {
                                console.clear();
                                data.assets.forEach(function(asset) {
                                    hmrApply(global.parcelRequire, asset);
                                });
                                assetsToAccept.forEach(function(v) {
                                    hmrAcceptRun(v[0], v[1]);
                                });
                            } else {
                                window.location.reload();
                            }
                        }

                        if (data.type === 'reload') {
                            ws.close();

                            ws.onclose = function() {
                                location.reload();
                            };
                        }

                        if (data.type === 'error-resolved') {
                            console.log('[parcel] ✨ Error resolved');
                            removeErrorOverlay();
                        }

                        if (data.type === 'error') {
                            console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
                            removeErrorOverlay();
                            var overlay = createErrorOverlay(data);
                            document.body.appendChild(overlay);
                        }
                    };
                }

                function removeErrorOverlay() {
                    var overlay = document.getElementById(OVERLAY_ID);

                    if (overlay) {
                        overlay.remove();
                    }
                }

                function createErrorOverlay(data) {
                    var overlay = document.createElement('div');
                    overlay.id = OVERLAY_ID; // html encode message and stack trace

                    var message = document.createElement('div');
                    var stackTrace = document.createElement('pre');
                    message.innerText = data.error.message;
                    stackTrace.innerText = data.error.stack;
                    overlay.innerHTML =
                        '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' +
                        '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' +
                        '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' +
                        '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' +
                        message.innerHTML +
                        '</div>' +
                        '<pre>' +
                        stackTrace.innerHTML +
                        '</pre>' +
                        '</div>';
                    return overlay;
                }

                function getParents(bundle, id) {
                    var modules = bundle.modules;

                    if (!modules) {
                        return [];
                    }

                    var parents = [];
                    var k, d, dep;

                    for (k in modules) {
                        for (d in modules[k][1]) {
                            dep = modules[k][1][d];

                            if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
                                parents.push(k);
                            }
                        }
                    }

                    if (bundle.parent) {
                        parents = parents.concat(getParents(bundle.parent, id));
                    }

                    return parents;
                }

                function hmrApply(bundle, asset) {
                    var modules = bundle.modules;

                    if (!modules) {
                        return;
                    }

                    if (modules[asset.id] || !bundle.parent) {
                        var fn = new Function('require', 'module', 'exports', asset.generated.js);
                        asset.isNew = !modules[asset.id];
                        modules[asset.id] = [fn, asset.deps];
                    } else if (bundle.parent) {
                        hmrApply(bundle.parent, asset);
                    }
                }

                function hmrAcceptCheck(bundle, id) {
                    var modules = bundle.modules;

                    if (!modules) {
                        return;
                    }

                    if (!modules[id] && bundle.parent) {
                        return hmrAcceptCheck(bundle.parent, id);
                    }

                    if (checkedAssets[id]) {
                        return;
                    }

                    checkedAssets[id] = true;
                    var cached = bundle.cache[id];
                    assetsToAccept.push([bundle, id]);

                    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
                        return true;
                    }

                    return getParents(global.parcelRequire, id).some(function(id) {
                        return hmrAcceptCheck(global.parcelRequire, id);
                    });
                }

                function hmrAcceptRun(bundle, id) {
                    var cached = bundle.cache[id];
                    bundle.hotData = {};

                    if (cached) {
                        cached.hot.data = bundle.hotData;
                    }

                    if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
                        cached.hot._disposeCallbacks.forEach(function(cb) {
                            cb(bundle.hotData);
                        });
                    }

                    delete bundle.cache[id];
                    bundle(id);
                    cached = bundle.cache[id];

                    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
                        cached.hot._acceptCallbacks.forEach(function(cb) {
                            cb();
                        });

                        return true;
                    }
                }
            },
            {}
        ]
    },
    {},
    ['../node_modules/parcel-bundler/src/builtins/hmr-runtime.js', '../bridge/src/select25.tsx'],
    null
);
//# sourceMappingURL=/select25.63904fcd.js.map
