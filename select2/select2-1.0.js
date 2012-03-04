/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */
(function ($) {
    "use strict";
    /*global document, window, jQuery, console */

    var KEY, Util, DropDown, ResultList, Selection, Select2, Queries;

    function createClass(def) {
        var type = function (attrs) {
            var self = this;
            if (def.attrs !== undefined) {
                $.each(def.attrs, function (name, body) {
                    if (attrs[name] !== undefined) {
                        self[name] = attrs[name];
                    } else {
                        if (body.required === true) {
                            throw "Value for required attribute: " + name + " not defined";
                        }
                        if (body.init !== undefined) {
                            self[name] = typeof (body.init) === "function" ? body.init.apply(self) : body.init;
                        }
                    }
                });
            }

            if (def.methods !== undefined && def.methods.init !== undefined) {
                self.init(attrs);
            }
        };

        if (def.methods !== undefined) {
            if (def.methods.bind !== undefined) {
                throw "Class cannot declare a method called 'bind'";
            }

            $.each(def.methods, function (name, body) {
                type.prototype[name] = body;
            });

            type.prototype.bind = function (func) {
                var self = this;
                return function () {
                    func.apply(self, arguments);
                };
            };
        }

        return type;
    }

    KEY = {
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

    Util = {};

    Util.debounce = function (threshold, fn) {
        var timeout;
        return function () {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(fn, threshold);
        };
    };

    Util.debounceEvent = function (element, threshold, event, debouncedEvent, direct) {
        debouncedEvent = debouncedEvent || event + "-debounced";
        direct = direct || true;

        var notify = Util.debounce(threshold, function (e) {
            element.trigger(debouncedEvent, e);
        });

        element.on(event, function (e) {
            if (direct && element.get().indexOf(e.target) < 0) {
                return;
            }
            notify(e);
        });
    };

    (function () {

        var lastpos;

        /**
         * Filters mouse events so an event is fired only if the mouse moved.
         * Filters out mouse events that occur when mouse is stationary but
         * the elements under the pointer are scrolled
         */
        Util.filterMouseEvent = function (element, event, filteredEvent, direct) {
            filteredEvent = filteredEvent || event + "-filtered";
            direct = direct || false;

            element.on(event, "*", function (e) {
                if (direct && element.get().indexOf(e.target) < 0) {
                    return;
                }
                if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                    $(e.target).trigger(filteredEvent, e);
                    lastpos = {x: e.pageX, y: e.pageY};
                }
            });
        };
    }());

    DropDown = createClass({
        attrs: {
            container: {required: true},
            element: {required: true},
            bus: {required: true}
        },
        methods: {
            open: function () {
                if (this.isOpen()) {
                    return;
                }

                this.container.addClass("select2-dropdown-open");

                // register click-outside-closes-dropdown listener
                $(document).on("mousedown.dropdown", this.bind(function (e) {
                    var inside = false,
                        container = this.container.get(0);
                    $(e.target).parents().each(function () {
                        return !(inside = (this === container));
                    });
                    if (!inside) {
                        this.close();
                    }
                }));

                this.element.show();
                this.bus.trigger("opened");
            },

            close: function () {
                if (!this.isOpen()) {
                    return;
                }

                this.container.removeClass("select2-dropdown-open");

                $(document).off("mousedown.dropdown");
                this.element.hide();
                this.bus.trigger("closed");
            },

            isOpen: function () {
                return this.container.hasClass("select2-dropdown-open");
            },

            toggle: function () {
                if (this.isOpen()) {
                    this.close();
                } else {
                    this.open();
                }
            }
        }

    });

    ResultList = createClass({
        attrs: {
            element: {required: true},
            bus: {required: true},
            formatInputTooShort: {required: true},
            formatNoMatches: {required: true},
            formatResult: {required: true},
            minimumInputLength: {required: true},
            query: {required: true},
            selection: {required: true}
        },
        methods: {
            init: function () {
                var self = this;

                this.search = this.element.find("input");
                this.results = this.element.find("ul");
                this.scrollPosition = 0;
                this.vars = {};

                this.search.on("keyup", function (e) {
                    if (e.which >= 48 || e.which === KEY.SPACE || e.which === KEY.BACKSPACE || e.which === KEY.DELETE) {
                        self.update();
                    }
                });

                this.search.on("keydown", function (e) {
                    switch (e.which) {
                    case KEY.TAB:
                        e.preventDefault();
                        self.select();
                        return;
                    case KEY.ENTER:
                        e.preventDefault();
                        e.stopPropagation();
                        self.select();
                        return;
                    case KEY.UP:
                        self.moveSelection(-1);
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    case KEY.DOWN:
                        self.moveSelection(1);
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    case KEY.ESC:
                        e.preventDefault();
                        e.stopPropagation();
                        self.cancel();
                        return;
                    }
                });

//                this.results.on("mouseleave", "li.select2-result", this.bind(this.unhighlight));
                Util.filterMouseEvent(this.results, "mousemove");
                this.results.on("mousemove-filtered", this.bind(function (e) {
                    var el = $(e.target).closest("li.select2-result");
                    if (el.length < 1) {
                        return;
                    }
                    this.setSelection(el.index());
                }));
                this.results.on("click", this.bind(function (e) {
                    var el = $(e.target).closest("li.select2-result");
                    if (el.length < 1) {
                        return;
                    }
                    this.bus.trigger("selected", [el.data("select2-result")]);
                }));

                Util.debounceEvent(this.results, 100, "scroll");

                this.results.on("scroll-debounced", this.bind(function (e) {
                    this.scrollPosition = this.results.scrollTop();

                    var more = this.results.find("li.select2-more-results"), below;

                    if (more.length === 0) {
                        return;
                    }

                    // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                    below = more.offset().top - this.results.offset().top - this.results.height();

                    if (below <= 0) {
                        more.addClass("select2-active");
                        this.query({term: this.search.val(), vars: this.vars, callback: this.bind(this.append)});
                    }

                }));
            },
            open: function (e) {
                this.search.focus();
                this.results.scrollTop(this.scrollPosition);
                if (this.results.children().length === 0) {
                    // first time the dropdown is opened, update the results
                    this.update();
                }
            },
            close: function () {
                //this.search.val("");
                //this.clear();
            },
            clear: function () {
                this.results.empty();
            },
            showInputTooShort: function () {
                this.show("<li class='select2-no-results'>" + this.formatInputTooShort(this.search.val(), this.minimumInputLength) + "</li>");
            },
            showNoMatches: function () {
                this.show("<li class='select2-no-results'>" + this.formatNoMatches(this.search.val()) + "</li>");
            },
            show: function (html) {
                this.results.html(html);
                this.results.scrollTop(0);
                this.search.removeClass("select2-active");
            },
            update: function () {
                var html = "";

                if (this.search.val().length < this.minimumInputLength) {
                    this.showInputTooShort();
                    return;
                }

                this.search.addClass("select2-active");
                this.vars = {};
                this.query({term: this.search.val(), vars: this.vars, callback: this.bind(this.process)});
            },
            process: function (data) {
                if (data.results.length === 0) {
                    this.showNoMatches();
                    return;
                }

                var html = this.stringizeResults(data.results), selectedId = this.selection.val(), selectedIndex = 0;

                if (data.more === true) {
                    html += "<li class='select2-more-results'>Loading more results...</li>";
                }
                this.vars = data.vars || {};

                this.show(html);

                this.findChoices().each(function (i) {
                    if (selectedId === data.results[i].id) {
                        selectedIndex = i;
                    }
                    $(this).data("select2-result", data.results[i]);
                });

                this.setSelection(selectedIndex);

            },
            append: function (data) {

                var more = this.results.find("li.select2-more-results"), html, offset;

                this.vars = data.vars || {};

                if (data.results.length === 0) {
                    more.remove();
                    return;
                }

                html = this.stringizeResults(data.results);

                offset = this.results.find("li.select2-result").length;

                more.before(html);

                this.results.find("li.select2-result").each(function (i) {
                    if (i >= offset) {
                        $(this).data("select2-result", data.results[i - offset]);
                    }
                });

                if (data.more !== true) {
                    more.remove();
                } else {
                    more.removeClass("select2-active");
                }

            },
            stringizeResults: function (results, html) {
                var i, l, classes;
                html = html || "";
                for (i = 0, l = results.length; i < l; i += 1) {
                    html += "<li class='select2-result'>";
                    html += this.formatResult(results[i]);
                    html += "</li>";
                }
                return html;
            },

            findChoices: function () {
                return this.results.children("li.select2-result");
            },

            removeSelection: function () {
                this.findChoices().each(function () {
                    $(this).removeClass("select2-highlighted");
                });
            },

            setSelection: function (index) {
                this.removeSelection();

                var children = this.findChoices(),
                    child = $(children[index]),
                    hb,
                    rb,
                    y,
                    more;

                child.addClass("select2-highlighted");

                this.search.focus();

                hb = child.offset().top + child.outerHeight();

                // if this is the last child lets also make sure select2-more-results is visible
                if (index === children.length - 1) {
                    more = this.results.find("li.select2-more-results");
                    if (more.length > 0) {
                        hb = more.offset().top + more.outerHeight();
                    }
                }

                rb = this.results.offset().top + this.results.outerHeight();
                if (hb > rb) {
                    this.results.scrollTop(this.results.scrollTop() + (hb - rb));
                }
                y = child.offset().top - this.results.offset().top;

                // make sure the top of the element is visible
                if (y < 0) {
                    this.results.scrollTop(this.results.scrollTop() + y); // y is negative
                }

            },

            getSelectionIndex: function () {
                var children = this.findChoices(), i = 0, l = children.length;
                for (; i < l; i += 1) {
                    if ($(children[i]).hasClass("select2-highlighted")) {
                        return i;
                    }
                }
                return -1;
            },

            moveSelection: function (delta) {
                var current = this.getSelectionIndex(),
                    children = this.findChoices(),
                    next = current + delta;

                if (current >= 0 && next >= 0 && next < children.length) {
                    this.setSelection(next);
                }
            },

            select: function () {
                var selected = this.results.find("li.select2-highlighted");
                if (selected.length > 0) {
                    this.bus.trigger("selected", [selected.data("select2-result")]);
                }
            },

            cancel: function () {
                this.bus.trigger("cancelled");
            },

            val: function (data) {
                var choices = this.findChoices(), index;

                choices.each(function (i) {
                    if ($(this).data("select2-result").id === data) {
                        index = i;
                        return false;
                    }
                });

                if (index === undefined && data.id !== undefined) {
                    choices.each(function (i) {
                        if ($(this).data("select2-result").id === data.id) {
                            index = i;
                            return false;
                        }
                    });
                }

                if (index !== undefined) {
                    this.setSelection(index);
                    this.select();
                    return;
                }

                this.bus.trigger("selected", data);
            }

        }
    });

    Selection = createClass({
        attrs: {
            bus: {required: true},
            element: {required: true},
            display: {init: function () {
                return this.element.find("span");
            }},
            hidden: {required: true},
            formatSelection: {required: true},
            placeholder: {},
            dropdown: {required: true}
        },
        methods: {
            init: function () {
                if (this.placeholder) {
                    this.select(this.placeholder);
                }
                this.element.click(this.dropdown.bind(this.dropdown.toggle));

                var self = this;
                this.element.on("keydown", function (e) {
                    switch (e.which) {
                    case KEY.TAB:
                    case KEY.SHIFT:
                    case KEY.CTRL:
                    case KEY.ALT:
                    case KEY.LEFT:
                    case KEY.RIGHT:
                        return;
                    }
                    self.dropdown.open();
                });
            },
            select: function (data) {
                this.display.html(this.formatSelection(data));
                this.hidden.val(data.id);
            },
            focus: function () {
                this.element.focus();
            },
            val: function () {
                return this.hidden.val();
            }
        }

    });

    Queries = {};
    Queries.select = function (select2, element) {
        var options = [];
        element.find("option").each(function () {
            var e = $(this);
            options.push({id: e.attr("value"), text: e.text()});
        });
        return function (query) {
            var data = {results: [], more: false},
                text = query.term.toUpperCase();
            $.each(options, function (i) {
                if (this.text.toUpperCase().indexOf(text) >= 0) {
                    data.results.push(this);
                }
            });
            query.callback(data);
        };
    };
    Queries.ajax = function (select2, el) {
        var timeout, // current scheduled but not yet executed request
            requestSequence = 0, // sequence used to drop out-of-order responses
            quietMillis = select2.ajax.quietMillis || 100;

        return function (query) {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                requestSequence += 1; // increment the sequence
                var requestNumber = requestSequence, // this request's sequence number
                    options = select2.ajax, // ajax parameters
                    data = options.data; // ajax data function

                data = data.call(this, query.term, query.vars);

                $.ajax({
                    url: options.url,
                    dataType: options.dataType,
                    data: data
                }).success(
                    function (data) {
                        if (requestNumber < requestSequence) {
                            return;
                        }
                        query.callback(options.results(data, query.vars));
                    }
                );
            }, quietMillis);
        };
    };

    Select2 = createClass({
        attrs: {
            el: {required: true},
            formatResult: {init: function () {
                return function (data) {
                    return data.text;
                };
            }},
            formatSelection: {init: function () {
                return function (data) {
                    return data.text;
                };
            }},
            formatNoMatches: {init: function () {
                return function () {
                    return "No matches found";
                };
            }},
            formatInputTooShort: {init: function () {
                return function (input, min) {
                    return "Please enter " + (min - input.length) + " more characters to start search";
                };
            }},
            minimumInputLength: {init: 0},
            placeholder: {init: undefined},
            ajax: {init: undefined},
            query: {init: undefined}
        },
        methods: {
            init: function () {
                var self = this, width, dropdown, results, selected, select;

                this.el = $(this.el);

                width = this.el.outerWidth();

                this.container = $("<div></div>", {
                    "class": "select2-container",
                    style: "width: " + width + "px"
                });
                this.container.html(
                    "   <a href='javascript:void(0)' class='select2-choice'>" +
                        "   <span></span>" +
                        "   <div><b></b></div>" +
                        "</a>" +
                        "<div class='select2-drop' style='display:none;'>" +
                        "   <div class='select2-search'>" +
                        "       <input type='text' autocomplete='off'/>" +
                        "   </div>" +
                        "   <ul class='select2-results'>" +
                        "   </ul>" +
                        "</div>" +
                        "<input type='hidden'/>"
                );

                this.el.data("select2", this);
                this.el.hide();
                this.el.after(self.container);
                if (this.el.attr("class") !== undefined) {
                    this.container.addClass(this.el.attr("class"));
                }
                this.container.data("select2", this);
                this.container.find("input[type=hidden]").attr("name", this.el.attr("name"));

                if (this.query === undefined && this.el.get(0).tagName.toUpperCase() === "SELECT") {
                    this.query = "select";
                    select = true;
                }
                if (Queries[this.query] !== undefined) {
                    this.query = Queries[this.query](this, this.el);
                }

                (function () {

                    var dropdown, searchContainer, search, width;

                    function getSideBorderPadding(e) {
                        return e.outerWidth() - e.width();
                    }

                    // position and size dropdown
                    dropdown = self.container.find("div.select2-drop");
                    width = self.container.outerWidth() - getSideBorderPadding(dropdown);
                    dropdown.css({top: self.container.height(), width: width});

                    // size search field
                    searchContainer = self.container.find(".select2-search");
                    search = searchContainer.find("input");
                    width = dropdown.width();
                    width -= getSideBorderPadding(searchContainer);
                    width -= getSideBorderPadding(search);
                    search.css({width: width});
                }());

                dropdown = new DropDown({
                    element: this.container.find("div.select2-drop"),
                    container: this.container,
                    bus: this.el
                });

                this.selection = new Selection({
                    bus: this.el,
                    element: this.container.find(".select2-choice"),
                    hidden: this.container.find("input[type=hidden]"),
                    formatSelection: this.formatSelection,
                    placeholder: this.placeholder,
                    dropdown: dropdown
                });

                this.results = new ResultList({
                    element: this.container.find("div.select2-drop"),
                    bus: this.el,
                    formatInputTooShort: this.formatInputTooShort,
                    formatNoMatches: this.formatNoMatches,
                    formatResult: this.formatResult,
                    minimumInputLength: this.minimumInputLength,
                    query: this.query,
                    selection: this.selection
                });

                this.el.on("selected", function (e, result) {
                    dropdown.close();
                    self.selection.select(result);
                });

                this.el.on("cancelled", function () {
                    dropdown.close();
                });

                this.el.on("opened", this.bind(function () {
                    this.results.open();
                }));

                this.el.on("closed", this.bind(function () {
                    this.container.removeClass("select2-dropdown-open");
                    this.results.close();
                    this.selection.focus();
                }));

                // if attached to a select do some default initialization
                if (select) {
                    this.results.update(); // build the results
                    selected = this.el.find("option[selected]");
                    if (selected.length < 1 && this.placeholder === undefined) {
                        selected = $(this.el.find("option")[0]);
                    }
                    if (selected.length > 0) {
                        this.val({id: selected.attr("value"), text: selected.text()});
                    }
                }

            },
            val: function () {
                var data;
                if (arguments.length === 0) {
                    return this.selection.val();
                } else {
                    data = arguments[0];
                    this.results.val(data);
                }
            }
        }
    });

    $.fn.select2 = function () {
        var args = Array.prototype.slice.call(arguments, 0), value, tmp;
        this.each(function () {
            if (args.length === 0) {
                tmp = new Select2({el: this});
            } else if (typeof (args[0]) === "object") {
                args[0].el = this;
                tmp = new Select2(args[0]);
            } else if (typeof (args[0]) === "string") {
                var select2 = $(this).data("select2");
                value = select2[args[0]].apply(select2, args.slice(1));
                return false;
            } else {
                throw "Invalid arguments to select2 plugin: " + args;
            }
        });
        return (value === undefined) ? this : value;
    };

}(jQuery));