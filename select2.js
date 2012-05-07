/*
 Copyright 2012 Igor Vaynberg

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in
 compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is
 distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.
 */
(function ($, undefined) {
    "use strict";
    /*global document, window, jQuery, console */

    if (window.Select2 !== undefined) {
        return;
    }

    var KEY, AbstractSelect2, SingleSelect2, MultiSelect2;

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
        DELETE: 46,
        isArrow: function (k) {
            k = k.which ? k.which : k;
            switch (k) {
            case KEY.LEFT:
            case KEY.RIGHT:
            case KEY.UP:
            case KEY.DOWN:
                return true;
            }
            return false;
        },
        isControl: function (k) {
            k = k.which ? k.which : k;
            switch (k) {
            case KEY.SHIFT:
            case KEY.CTRL:
            case KEY.ALT:
                return true;
            }
            return false;
        },
        isFunctionKey: function (k) {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
        }
    };

    function indexOf(value, array) {
        var i = 0, l = array.length, v;

        if (value.constructor === String) {
            for (; i < l; i = i + 1) if (value.localeCompare(array[i]) === 0) return i;
        } else {
            for (; i < l; i = i + 1) {
                v = array[i];
                if (v.constructor === String) {
                    if (v.localeCompare(value) === 0) return i;
                } else {
                    if (v === value) return i;
                }
            }
        }
        return -1;
    }

    /**
     * Compares equality of a and b taking into account that a and b may be strings, in which case localCompare is used
     * @param a
     * @param b
     */
    function equal(a, b) {
        if (a === b) return true;
        if (a === undefined || b === undefined) return false;
        if (a === null || b === null) return false;
        if (a.constructor === String) return a.localeCompare(b) === 0;
        if (b.constructor === String) return b.localeCompare(a) === 0;
        return false;
    }

    /**
     * Splits the string into an array of values, trimming each value. An empty array is returned for nulls or empty
     * strings
     * @param string
     * @param separator
     */
    function splitVal(string, separator) {
        var val, i, l;
        if (string === null || string.length < 1) return [];
        val = string.split(separator);
        for (i = 0, l = val.length; i < l; i = i + 1) val[i] = $.trim(val[i]);
        return val;
    }

    function getSideBorderPadding(element) {
        return element.outerWidth() - element.width();
    }

    function installKeyUpChangeEvent(element) {
        element.bind("keydown", function () {
            element.data("keyup-change-value", element.val());
        });
        element.bind("keyup", function () {
            if (element.val() !== element.data("keyup-change-value")) {
                element.trigger("keyup-change");
            }
        });
    }

    /**
     * filters mouse events so an event is fired only if the mouse moved.
     *
     * filters out mouse events that occur when mouse is stationary but
     * the elements under the pointer are scrolled.
     */
    $(document).delegate("*", "mousemove", function (e) {
        $(document).data("select2-lastpos", {x: e.pageX, y: e.pageY});
    });
    function installFilteredMouseMove(element) {
        element.bind("mousemove", function (e) {
            var lastpos = $(document).data("select2-lastpos");
            if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                $(e.target).trigger("mousemove-filtered", e);
            }
        });
    }

    /**
     * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
     * within the last quietMillis milliseconds.
     *
     * @param quietMillis number of milliseconds to wait before invoking fn
     * @param fn function to be debounced
     * @return debounced version of fn
     */
    function debounce(quietMillis, fn) {
        var timeout;
        return function () {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(fn, quietMillis);
        };
    }

    function installDebouncedScroll(threshold, element) {
        var notify = debounce(threshold, function (e) { element.trigger("scroll-debounced", e);});
        element.bind("scroll", function (e) {
            if (indexOf(e.target, element.get()) >= 0) notify(e);
        });
    }

    function killEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    function measureTextWidth(e) {
        var sizer, width;
        sizer = $("<div></div>").css({
            position: "absolute",
            left: "-1000px",
            top: "-1000px",
            display: "none",
            fontSize: e.css("fontSize"),
            fontFamily: e.css("fontFamily"),
            fontStyle: e.css("fontStyle"),
            fontWeight: e.css("fontWeight"),
            letterSpacing: e.css("letterSpacing"),
            textTransform: e.css("textTransform"),
            whiteSpace: "nowrap"
        });
        sizer.text(e.val());
        $("body").append(sizer);
        width = sizer.width();
        sizer.remove();
        return width;
    }

    /**
     * Produces an ajax-based query function
     *
     * @param options object containing configuration paramters
     * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
     * @param options.url url for the data
     * @param options.data a function(searchTerm, pageNumber) that should return an object containing query string parameters for the above url.
     * @param options.dataType request data type: ajax, jsonp, other datatatypes supported by jQuery's $.ajax function or the transport function if specified
     * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
     * @param options.results a function(remoteData, pageNumber) that converts data returned form the remote request to the format expected by Select2.
     *      The expected format is an object containing the following keys:
     *      results array of objects that will be used as choices
     *      more (optional) boolean indicating whether there are more results available
     *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}
     */
    function ajax(options) {
        var timeout, // current scheduled but not yet executed request
            requestSequence = 0, // sequence used to drop out-of-order responses
            handler = null,
            quietMillis = options.quietMillis || 100;

        return function (query) {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                requestSequence += 1; // increment the sequence
                var requestNumber = requestSequence, // this request's sequence number
                    data = options.data, // ajax data function
                    transport = options.transport || $.ajax;

                data = data.call(this, query.term, query.page);

                if( null !== handler){
                    handler.abort();
                }
                handler = transport.call(null, {
                    url: options.url,
                    dataType: options.dataType,
                    data: data,
                    success: function (data) {
                        if (requestNumber < requestSequence) {
                            return;
                        }
                        // TODO 3.0 - replace query.page with query so users have access to term, page, etc.
                        query.callback(options.results(data, query.page));
                    }
                });
            }, quietMillis);
        };
    }

    /**
     * Produces a query function that works with a local array
     *
     * @param options object containing configuration parameters. The options parameter can either be an array or an
     * object.
     *
     * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.
     *
     * If the object form is used ti is assumed that it contains 'data' and 'text' keys. The 'data' key should contain
     * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'
     * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
     * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
     * the text.
     */
    function local(options) {
        var data = options, // data elements
            text = function (item) { return item.text; }; // function used to retrieve the text portion of a data item that is matched against the search

        if (!$.isArray(data)) {
            text = data.text;
            // if text is not a function we assume it to be a key name
            if (!$.isFunction(text)) text = function (item) { return item[data.text]; };
            data = data.results;
        }

        return function (query) {
            var t = query.term.toUpperCase(), filtered = {};
            if (t === "") {
                query.callback({results: data});
                return;
            }
            filtered.results = $(data)
                .filter(function () {return text(this).toUpperCase().indexOf(t) >= 0;})
                .get();
            query.callback(filtered);
        };
    }

    // TODO javadoc
    function tags(data) {
        // TODO even for a function we should probably return a wrapper that does the same object/string check as
        // the function for arrays. otherwise only functions that return objects are supported.
        if ($.isFunction(data)) {
            return data;
        }

        // if not a function we assume it to be an array

        return function (query) {
            var t = query.term.toUpperCase(), filtered = {results: []};
            $(data).each(function () {
                var isObject = this.text !== undefined,
                    text = isObject ? this.text : this;
                if (t === "" || text.toUpperCase().indexOf(t) >= 0) {
                    filtered.results.push(isObject ? this : {id: this, text: this});
                }
            });
            query.callback(filtered);
        };
    }

    /**
     * blurs any Select2 container that has focus when an element outside them was clicked or received focus
     */
    $(document).ready(function () {
        $(document).delegate("*", "mousedown focusin", function (e) {
            var target = $(e.target).closest("div.select2-container").get(0);
            $(document).find("div.select2-container-active").each(function () {
                if (this !== target) $(this).data("select2").blur();
            });
        });
    });

    /**
     * Creates a new class
     *
     * @param superClass
     * @param methods
     */
    function clazz(SuperClass, methods) {
        var constructor = function () {};
        constructor.prototype = new SuperClass;
        constructor.prototype.constructor = constructor;
        constructor.prototype.parent = SuperClass.prototype;
        constructor.prototype = $.extend(constructor.prototype, methods);
        return constructor;
    }

    AbstractSelect2 = clazz(Object, {

        bind: function (func) {
            var self = this;
            return function () {
                func.apply(self, arguments);
            };
        },

        init: function (opts) {
            var results, search, resultsSelector = ".select2-results";

            // prepare options
            this.opts = opts = this.prepareOpts(opts);

            this.id=opts.id;

            // destroy if called on an existing component
            if (opts.element.data("select2") !== undefined) {
                this.destroy();
            }

            this.container = this.createContainer();

            if (opts.element.attr("class") !== undefined) {
                this.container.addClass(opts.element.attr("class"));
            }

            // swap container for the element
            this.opts.element
                .data("select2", this)
                .hide()
                .after(this.container);
            this.container.data("select2", this);

            this.dropdown = this.container.find(".select2-drop");
            this.results = results = this.container.find(resultsSelector);
            this.search = search = this.container.find("input[type=text]");

            this.resultsPage = 0;

            // initialize the container
            this.initContainer();

            installFilteredMouseMove(this.results);
            this.container.delegate(resultsSelector, "mousemove-filtered", this.bind(this.highlightUnderEvent));

            installDebouncedScroll(80, this.results);
            this.container.delegate(resultsSelector, "scroll-debounced", this.bind(this.loadMoreIfNeeded));

            // if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
            if ($.fn.mousewheel) {
                results.mousewheel(function (e, delta, deltaX, deltaY) {
                    var top = results.scrollTop(), height;
                    if (deltaY > 0 && top - deltaY <= 0) {
                        results.scrollTop(0);
                        killEvent(e);
                    } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                        results.scrollTop(results.get(0).scrollHeight - results.height());
                        killEvent(e);
                    }
                });
            }

            installKeyUpChangeEvent(search);
            search.bind("keyup-change", this.bind(this.updateResults));
            search.bind("focus", function () { search.addClass("select2-focused");});
            search.bind("blur", function () { search.removeClass("select2-focused");});

            this.container.delegate(resultsSelector, "click", this.bind(function (e) {
                if ($(e.target).closest(".select2-result:not(.select2-disabled)").length > 0) {
                    this.highlightUnderEvent(e);
                    this.selectHighlighted(e);
                } else {
                    killEvent(e);
                    this.focusSearch();
                }
            }));

            if ($.isFunction(this.opts.initSelection)) {
                // initialize selection based on the current value of the source element
                this.initSelection();

                // if the user has provided a function that can set selection based on the value of the source element
                // we monitor the change event on the element and trigger it, allowing for two way synchronization
                this.monitorSource();
            }
        },

        destroy: function () {
            var select2 = this.opts.element.data("select2");
            if (select2 !== undefined) {
                select2.container.remove();
                select2.opts.element
                    .removeData("select2")
                    .unbind(".select2")
                    .show();
            }
        },

        prepareOpts: function (opts) {
            var element, select, idKey;

            element = opts.element;

            if (element.get(0).tagName.toLowerCase() === "select") {
                this.select = select = opts.element;
            }

            if (select) {
                // these options are not allowed when attached to a select because they are picked up off the element itself
                $.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () {
                    if (this in opts) {
                        throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                    }
                });
            }

            opts = $.extend({}, {
                formatResult: function (data) { return data.text; },
                formatSelection: function (data) { return data.text; },
                formatNoMatches: function () { return "No matches found"; },
                formatInputTooShort: function (input, min) { return "Please enter " + (min - input.length) + " more characters"; },
                minimumResultsForSearch: 0,
                minimumInputLength: 0,
                id: function (e) { return e.id; }
            }, opts);

            if (typeof(opts.id) !== "function") {
                idKey = opts.id;
                opts.id = function (e) { return e[idKey]; };
            }

            if (select) {
                opts.query = this.bind(function (query) {
                    var data = {results: [], more: false},
                        term = query.term.toUpperCase(),
                        placeholder = this.getPlaceholder();
                    element.find("option").each(function (i) {
                        var e = $(this),
                            text = e.text();

                        if (i === 0 && placeholder !== undefined && text === "") return true;

                        if (text.toUpperCase().indexOf(term) >= 0) {
                            data.results.push({id: e.attr("value"), text: text});
                        }
                    });
                    query.callback(data);
                });
                // this is needed because inside val() we construct choices from options and there id is hardcoded
                opts.id=function(e) { return e.id; };
            } else {
                if (!("query" in opts)) {
                    if ("ajax" in opts) {
                        opts.query = ajax(opts.ajax);
                    } else if ("data" in opts) {
                        opts.query = local(opts.data);
                    } else if ("tags" in opts) {
                        opts.query = tags(opts.tags);
                        opts.createSearchChoice = function (term) { return {id: term, text: term}; };
                        opts.initSelection = function (element) {
                            var data = [];
                            $(splitVal(element.val(), ",")).each(function () {
                                data.push({id: this, text: this});
                            });
                            return data;
                        };
                    }
                }
            }
            if (typeof(opts.query) !== "function") {
                throw "query function not defined for Select2 " + opts.element.attr("id");
            }

            return opts;
        },

        /**
         * Monitor the original element for changes and update select2 accordingly
         */
        monitorSource: function () {
            this.opts.element.bind("change.select2", this.bind(function (e) {
                if (this.opts.element.data("select2-change-triggered") !== true) {
                    this.initSelection();
                }
            }));
        },

        /**
         * Triggers the change event on the source element
         */
        triggerChange: function () {
            // Prevents recursive triggering
            this.opts.element.data("select2-change-triggered", true);
            this.opts.element.trigger("change");
            this.opts.element.data("select2-change-triggered", false);
        },

        opened: function () {
            return this.container.hasClass("select2-dropdown-open");
        },

        open: function () {
            if (this.opened()) return;

            this.container.addClass("select2-dropdown-open").addClass("select2-container-active");

            this.updateResults(true);
            this.dropdown.show();
            this.focusSearch();
        },

        close: function () {
            if (!this.opened()) return;

            this.dropdown.hide();
            this.container.removeClass("select2-dropdown-open");
            this.results.empty();
            this.clearSearch();
        },

        clearSearch: function () {

        },

        ensureHighlightVisible: function () {
            var results = this.results, children, index, child, hb, rb, y, more;

            children = results.children(".select2-result");
            index = this.highlight();

            if (index < 0) return;

            child = $(children[index]);

            hb = child.offset().top + child.outerHeight();

            // if this is the last child lets also make sure select2-more-results is visible
            if (index === children.length - 1) {
                more = results.find("li.select2-more-results");
                if (more.length > 0) {
                    hb = more.offset().top + more.outerHeight();
                }
            }

            rb = results.offset().top + results.outerHeight();
            if (hb > rb) {
                results.scrollTop(results.scrollTop() + (hb - rb));
            }
            y = child.offset().top - results.offset().top;

            // make sure the top of the element is visible
            if (y < 0) {
                results.scrollTop(results.scrollTop() + y); // y is negative
            }
        },

        moveHighlight: function (delta) {
            var choices = this.results.children(".select2-result"),
                index = this.highlight();

            while (index > -1 && index < choices.length) {
                index += delta;
                if (!$(choices[index]).hasClass("select2-disabled")) {
                    this.highlight(index);
                    break;
                }
            }
        },

        highlight: function (index) {
            var choices = this.results.children(".select2-result");

            if (arguments.length === 0) {
                return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
            }

            choices.removeClass("select2-highlighted");

            if (index >= choices.length) index = choices.length - 1;
            if (index < 0) index = 0;

            $(choices[index]).addClass("select2-highlighted");
            this.ensureHighlightVisible();

            if (this.opened()) this.focusSearch();
        },

        highlightUnderEvent: function (event) {
            var el = $(event.target).closest(".select2-result");
            if (el.length > 0) {
                this.highlight(el.index());
            }
        },

        loadMoreIfNeeded: function () {
            var results = this.results,
                more = results.find("li.select2-more-results"),
                below, // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                offset = -1, // index of first element without data
                page = this.resultsPage + 1;

            if (more.length === 0) return;

            below = more.offset().top - results.offset().top - results.height();

            if (below <= 0) {
                more.addClass("select2-active");
                this.opts.query({term: this.search.val(), page: page, callback: this.bind(function (data) {
                    var parts = [], self = this;
                    $(data.results).each(function () {
                        parts.push("<li class='select2-result'>");
                        parts.push(self.opts.formatResult(this));
                        parts.push("</li>");
                    });
                    more.before(parts.join(""));
                    results.find(".select2-result").each(function (i) {
                        var e = $(this);
                        if (e.data("select2-data") !== undefined) {
                            offset = i;
                        } else {
                            e.data("select2-data", data.results[i - offset - 1]);
                        }
                    });
                    if (data.more) {
                        more.removeClass("select2-active");
                    } else {
                        more.remove();
                    }
                    this.resultsPage = page;
                })});
            }
        },

        /**
         * @param initial whether or not this is the call to this method right after the dropdown has been opened
         */
        updateResults: function (initial) {
            var search = this.search, results = this.results, opts = this.opts, self=this;

            search.addClass("select2-active");

            function render(html) {
                results.html(html);
                results.scrollTop(0);
                search.removeClass("select2-active");
            }

            if (search.val().length < opts.minimumInputLength) {
                render("<li class='select2-no-results'>" + opts.formatInputTooShort(search.val(), opts.minimumInputLength) + "</li>");
                return;
            }

            this.resultsPage = 1;
            opts.query({term: search.val(), page: this.resultsPage, callback: this.bind(function (data) {
                var parts = [], // html parts
                    def; // default choice

                // create a default choice and prepend it to the list
                if (this.opts.createSearchChoice && search.val() !== "") {
                    def = this.opts.createSearchChoice.call(null, search.val(), data.results);
                    if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {
                        if ($(data.results).filter(
                            function () {
                                return equal(self.id(this), self.id(def));
                            }).length === 0) {
                            data.results.unshift(def);
                        }
                    }
                }

                if (data.results.length === 0) {
                    render("<li class='select2-no-results'>" + opts.formatNoMatches(search.val()) + "</li>");
                    return;
                }

                $(data.results).each(function () {
                    parts.push("<li class='select2-result'>");
                    parts.push(opts.formatResult(this));
                    parts.push("</li>");
                });

                if (data.more === true) {
                    parts.push("<li class='select2-more-results'>Loading more results...</li>");
                }

                render(parts.join(""));
                results.children(".select2-result").each(function (i) {
                    var d = data.results[i];
                    $(this).data("select2-data", d);
                });
                this.postprocessResults(data, initial);
            })});
        },

        cancel: function () {
            this.close();
        },

        blur: function () {
            /* we do this in a timeout so that current event processing can complete before this code is executed.
             this allows tab index to be preserved even if this code blurs the textfield */
            window.setTimeout(this.bind(function () {
                this.close();
                this.container.removeClass("select2-container-active");
                this.clearSearch();
                this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                this.search.blur();
            }), 10);
        },

        focusSearch: function () {
            /* we do this in a timeout so that current event processing can complete before this code is executed.
             this makes sure the search field is focussed even if the current event would blur it */
            window.setTimeout(this.bind(function () {
                this.search.focus();
            }), 10);
        },

        selectHighlighted: function () {
            var data = this.results.find(".select2-highlighted:not(.select2-disabled)").data("select2-data");
            if (data) {
                this.onSelect(data);
            }
        },

        getPlaceholder: function () {
            return this.opts.element.attr("placeholder") || this.opts.element.data("placeholder") || this.opts.placeholder;
        },

        /**
         * Get the desired width for the container element.  This is
         * derived first from option `width` passed to select2, then
         * the inline 'style' on the original element, and finally
         * falls back to the jQuery calculated element width.
         *
         * @returns The width string (with units) for the container.
         */
        getContainerWidth: function () {
            var style, attrs, matches, i, l;
            if (this.opts.width !== undefined)
                return this.opts.width;

            style = this.opts.element.attr('style');
            if (style !== undefined) {
                attrs = style.split(';');
                for (i = 0, l = attrs.length; i < l; i = i + 1) {
                    matches = attrs[i].replace(/\s/g, '')
                        .match(/width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/);
                    if (matches !== null && matches.length >= 1)
                        return matches[1];
                }
            }
            return this.opts.element.width() + 'px';
        }
    });

    SingleSelect2 = clazz(AbstractSelect2, {

        createContainer: function () {
            return $("<div></div>", {
                "class": "select2-container",
                "style": "width: " + this.getContainerWidth()
            }).html([
                "    <a href='javascript:void(0)' class='select2-choice'>",
                "   <span></span><abbr class='select2-search-choice-close' style='display:none;'></abbr>",
                "   <div><b></b></div>" ,
                "</a>",
                "    <div class='select2-drop' style='display:none;'>" ,
                "   <div class='select2-search'>" ,
                "       <input type='text' autocomplete='off'/>" ,
                "   </div>" ,
                "   <ul class='select2-results'>" ,
                "   </ul>" ,
                "</div>"].join(""));
        },

        open: function () {

            if (this.opened()) return;

            this.parent.open.apply(this, arguments);

        },

        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
        },

        focus: function () {
            this.close();
            this.selection.focus();
        },

        isFocused: function () {
            return this.selection.is(":focus");
        },

        cancel: function () {
            this.parent.cancel.apply(this, arguments);
            this.selection.focus();
        },

        initContainer: function () {

            var selection, container = this.container, clickingInside = false,
                selector = ".select2-choice";

            this.selection = selection = container.find(selector);

            this.search.bind("keydown", this.bind(function (e) {
                switch (e.which) {
                case KEY.UP:
                case KEY.DOWN:
                    this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                    killEvent(e);
                    return;
                case KEY.TAB:
                case KEY.ENTER:
                    this.selectHighlighted();
                    killEvent(e);
                    return;
                case KEY.ESC:
                    this.cancel(e);
                    e.preventDefault();
                    return;
                }
            }));

            container.delegate(selector, "click", this.bind(function (e) {
                clickingInside = true;

                if (this.opened()) {
                    this.close();
                    selection.focus();
                } else {
                    this.open();
                }
                e.preventDefault();

                clickingInside = false;
            }));
            container.delegate(selector, "keydown", this.bind(function (e) {
                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                    return;
                }
                this.open();
                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN || e.which === KEY.SPACE) {
                    // prevent the page from scrolling
                    killEvent(e);
                }
                if (e.which === KEY.ENTER) {
                    // do not propagate the event otherwise we open, and propagate enter which closes
                    killEvent(e);
                }
            }));
            container.delegate(selector, "focus", function () { container.addClass("select2-container-active"); });
            container.delegate(selector, "blur", this.bind(function () {
                if (clickingInside) return;
                if (!this.opened()) this.blur();
            }));

            selection.delegate("abbr", "click", this.bind(function (e) {
                this.val("");
                killEvent(e);
                this.close();
                this.triggerChange();
            }));

            this.setPlaceholder();
        },

        /**
         * Sets selection based on source element's value
         */
        initSelection: function () {
            var selected;
            if (this.opts.element.val() === "") {
                this.updateSelection({id: "", text: ""});
            } else {
                selected = this.opts.initSelection.call(null, this.opts.element);
                if (selected !== undefined && selected !== null) {
                    this.updateSelection(selected);
                }
            }

            this.close();
            this.setPlaceholder();
        },

        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments);

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install sthe selection initializer
                opts.initSelection = function (element) {
                    var selected = element.find(":selected");
                    // a single select box always has a value, no need to null check 'selected'
                    return {id: selected.attr("value"), text: selected.text()};
                };
            }

            return opts;
        },

        setPlaceholder: function () {
            var placeholder = this.getPlaceholder();

            if (this.opts.element.val() === "" && placeholder !== undefined) {

                // check for a first blank option if attached to a select
                if (this.select && this.select.find("option:first").text() !== "") return;

                if (typeof(placeholder) === "object") {
                    this.updateSelection(placeholder);
                } else {
                    this.selection.find("span").html(placeholder);
                }
                this.selection.addClass("select2-default");

                this.selection.find("abbr").hide();
            }
        },

        postprocessResults: function (data, initial) {
            var selected = 0, self = this, showSearchInput = true;

            // find the selected element in the result list

            this.results.find(".select2-result").each(function (i) {
                if (equal(self.id($(this).data("select2-data")), self.opts.element.val())) {
                    selected = i;
                    return false;
                }
            });

            // and highlight it

            this.highlight(selected);

            // hide the search box if this is the first we got the results and there are a few of them

            if (initial === true) {
                showSearchInput = data.results.length >= this.opts.minimumResultsForSearch;
                this.search.parent().toggle(showSearchInput);

                //add "select2-with-searchbox" to the container if search box is shown
                this.container[showSearchInput ? "addClass" : "removeClass"]("select2-with-searchbox");
            }

        },

        onSelect: function (data) {
            var old = this.opts.element.val();

            this.opts.element.val(this.id(data));
            this.updateSelection(data);
            this.close();
            this.selection.focus();

            if (!equal(old, this.id(data))) { this.triggerChange(); }
        },

        updateSelection: function (data) {
            this.selection
                .find("span")
                .html(this.opts.formatSelection(data));

            this.selection.removeClass("select2-default");

            if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
                this.selection.find("abbr").show();
            }
        },

        val: function () {
            var val, data = null;

            if (arguments.length === 0) {
                return this.opts.element.val();
            }

            val = arguments[0];

            if (this.select) {
                // val is an id
                this.select
                    .val(val)
                    .find(":selected").each(function () {
                        data = {id: $(this).attr("value"), text: $(this).text()};
                        return false;
                    });
                this.updateSelection(data);
            } else {
                // val is an object. !val is true for [undefined,null,'']
                this.opts.element.val(!val ? "" : this.id(val));
                this.updateSelection(val);
            }
            this.setPlaceholder();

        },

        clearSearch: function () {
            this.search.val("");
        }
    });

    MultiSelect2 = clazz(AbstractSelect2, {

        createContainer: function () {
            return $("<div></div>", {
                "class": "select2-container select2-container-multi",
                "style": "width: " + this.getContainerWidth()
            }).html([
                "    <ul class='select2-choices'>",
                //"<li class='select2-search-choice'><span>California</span><a href="javascript:void(0)" class="select2-search-choice-close"></a></li>" ,
                "  <li class='select2-search-field'>" ,
                "    <input type='text' autocomplete='off' style='width: 25px;'>" ,
                "  </li>" ,
                "</ul>" ,
                "<div class='select2-drop' style='display:none;'>" ,
                "   <ul class='select2-results'>" ,
                "   </ul>" ,
                "</div>"].join(""));
        },

        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments);

            opts = $.extend({}, {
                closeOnSelect: true
            }, opts);

            // TODO validate placeholder is a string if specified

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install sthe selection initializer
                opts.initSelection = function (element) {
                    var data = [];
                    element.find(":selected").each(function () {
                        data.push({id: $(this).attr("value"), text: $(this).text()});
                    });
                    return data;
                };
            }

            return opts;
        },

        initContainer: function () {

            var selector = ".select2-choices", selection;

            this.searchContainer = this.container.find(".select2-search-field");
            this.selection = selection = this.container.find(selector);

            this.search.bind("keydown", this.bind(function (e) {
                if (e.which === KEY.BACKSPACE && this.search.val() === "") {
                    this.close();

                    var choices,
                        selected = selection.find(".select2-search-choice-focus");
                    if (selected.length > 0) {
                        this.unselect(selected.first());
                        this.search.width(10);
                        killEvent(e);
                        return;
                    }

                    choices = selection.find(".select2-search-choice");
                    if (choices.length > 0) {
                        choices.last().addClass("select2-search-choice-focus");
                    }
                } else {
                    selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                }

                if (this.opened()) {
                    switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        e.preventDefault();
                        return;
                    }
                }

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {
                    return;
                }

                this.open();

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                }
            }));

            this.search.bind("keyup", this.bind(this.resizeSearch));

            this.container.delegate(selector, "click", this.bind(function (e) {
                this.open();
                this.focusSearch();
                e.preventDefault();
            }));

            this.container.delegate(selector, "focus", this.bind(function () {
                this.container.addClass("select2-container-active");
                this.clearPlaceholder();
            }));

            // set the placeholder if necessary
            this.clearSearch();
        },

        initSelection: function () {
            var data;
            if (this.opts.element.val() === "") {
                this.updateSelection([]);
            }
            if (this.select || this.opts.element.val() !== "") {
                data = this.opts.initSelection.call(null, this.opts.element);
                if (data !== undefined && data !== null) {
                    this.updateSelection(data);
                }
            }

            this.close();

            // set the placeholder if necessary
            this.clearSearch();
        },

        clearSearch: function () {
            var placeholder = this.getPlaceholder();

            if (placeholder !== undefined
                && this.getVal().length === 0
                && this.search.hasClass("select2-focused") === false) {

                this.search.val(placeholder).addClass("select2-default");
                // stretch the search box to full width of the container so as much of the placeholder is visible as possible
                this.search.width(this.getContainerWidth());
            } else {
                this.search.val("").width(10);
            }
        },

        clearPlaceholder: function () {
            if (this.search.hasClass("select2-default")) {
                this.search.val("").removeClass("select2-default");
            }
        },

        open: function () {
            if (this.opened()) return;
            this.parent.open.apply(this, arguments);
            this.resizeSearch();
            this.focusSearch();
        },

        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
        },

        focus: function () {
            this.close();
            this.search.focus();
        },

        isFocused: function () {
            return this.search.hasClass("select2-focused");
        },

        updateSelection: function (data) {
            var ids = [], filtered = [], self = this;

            // filter out duplicates
            $(data).each(function () {
                if (indexOf(self.id(this), ids) < 0) {
                    ids.push(self.id(this));
                    filtered.push(this);
                }
            });
            data = filtered;

            this.selection.find(".select2-search-choice").remove();
            $(data).each(function () {
                self.addSelectedChoice(this);
            });
            self.postprocessResults();
        },

        onSelect: function (data) {
            this.addSelectedChoice(data);
            if (this.select) { this.postprocessResults(); }

            if (this.opts.closeOnSelect) {
                this.close();
                this.search.width(10);
            } else {
                this.search.width(10);
                this.resizeSearch();
            }

            // since its not possible to select an element that has already been
            // added we do not need to check if this is a new element before firing change
            this.triggerChange();

            this.focusSearch();
        },

        cancel: function () {
            this.close();
            this.focusSearch();
        },

        addSelectedChoice: function (data) {
            var choice,
                id = this.id(data),
                parts,
                val = this.getVal();

            parts = ["<li class='select2-search-choice'>",
                this.opts.formatSelection(data),
                "<a href='javascript:void(0)' class='select2-search-choice-close' tabindex='-1'></a>",
                "</li>"
            ];

            choice = $(parts.join(""));
            choice.find("a")
                .bind("click dblclick", this.bind(function (e) {
                this.unselect($(e.target));
                this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                killEvent(e);
                this.close();
                this.focusSearch();
            })).bind("focus", this.bind(function () {
                this.container.addClass("select2-container-active");
            }));

            choice.data("select2-data", data);
            choice.insertBefore(this.searchContainer);

            val.push(id);
            this.setVal(val);
        },

        unselect: function (selected) {
            var val = this.getVal(),
                index;

            selected = selected.closest(".select2-search-choice");

            if (selected.length === 0) {
                throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
            }

            index = indexOf(this.id(selected.data("select2-data")), val);

            if (index >= 0) {
                val.splice(index, 1);
                this.setVal(val);
                if (this.select) this.postprocessResults();
            }
            selected.remove();
            this.triggerChange();
        },

        postprocessResults: function () {
            var val = this.getVal(),
                choices = this.results.find(".select2-result"),
                self = this;

            choices.each(function () {
                var choice = $(this), id = self.id(choice.data("select2-data"));
                if (indexOf(id, val) >= 0) {
                    choice.addClass("select2-disabled");
                } else {
                    choice.removeClass("select2-disabled");
                }
            });

            choices.each(function (i) {
                if (!$(this).hasClass("select2-disabled")) {
                    self.highlight(i);
                    return false;
                }
            });

        },

        resizeSearch: function () {

            var minimumWidth, left, maxWidth, containerLeft, searchWidth;

            minimumWidth = measureTextWidth(this.search) + 10;

            left = this.search.offset().left;

            maxWidth = this.selection.width();
            containerLeft = this.selection.offset().left;

            searchWidth = maxWidth - (left - containerLeft) - getSideBorderPadding(this.search);

            if (searchWidth < minimumWidth) {
                searchWidth = maxWidth - getSideBorderPadding(this.search);
            }

            if (searchWidth < 40) {
                searchWidth = maxWidth - getSideBorderPadding(this.search);
            }
            this.search.width(searchWidth);
        },

        getVal: function () {
            var val;
            if (this.select) {
                val = this.select.val();
                return val === null ? [] : val;
            } else {
                val = this.opts.element.val();
                return splitVal(val, ",");
            }
        },

        setVal: function (val) {
            var unique = [];
            if (this.select) {
                this.select.val(val);
            } else {
                // filter out duplicates
                $(val).each(function () {
                    if (indexOf(this, unique) < 0) unique.push(this);
                });

                this.opts.element.val(unique.length === 0 ? "" : unique.join(","));
            }
        },

        val: function () {
            var val, data = [], self=this;

            if (arguments.length === 0) {
                return this.getVal();
            }

            val = arguments[0];

            if (this.select) {
                // val is a list of ids
                this.setVal(val);
                this.select.find(":selected").each(function () {
                    data.push({id: $(this).attr("value"), text: $(this).text()});
                });
                this.updateSelection(data);
            } else {
                val = (val === null) ? [] : val;
                this.setVal(val);
                // val is a list of objects

                $(val).each(function () { data.push(self.id(this)); });
                this.setVal(data);
                this.updateSelection(val);
            }

            this.clearSearch();
        }
    });

    $.fn.select2 = function () {

        var args = Array.prototype.slice.call(arguments, 0),
            opts,
            select2,
            value, multiple, allowedMethods = ["val", "destroy", "open", "close", "focus", "isFocused"];

        this.each(function () {
            if (args.length === 0 || typeof(args[0]) === "object") {
                opts = args.length === 0 ? {} : $.extend({}, args[0]);
                opts.element = $(this);

                if (opts.element.get(0).tagName.toLowerCase() === "select") {
                    multiple = opts.element.attr("multiple");
                } else {
                    multiple = opts.multiple || false;
                    if ("tags" in opts) {opts.multiple = multiple = true;}
                }

                select2 = multiple ? new MultiSelect2() : new SingleSelect2();
                select2.init(opts);
            } else if (typeof(args[0]) === "string") {

                if (indexOf(args[0], allowedMethods) < 0) {
                    throw "Unknown method: " + args[0];
                }

                value = undefined;
                select2 = $(this).data("select2");
                if (select2 === undefined) return;
                value = select2[args[0]].apply(select2, args.slice(1));
                if (value !== undefined) {return false;}
            } else {
                throw "Invalid arguments to select2 plugin: " + args;
            }
        });
        return (value === undefined) ? this : value;
    };

    // exports
    window.Select2 = {
        query: {
            ajax: ajax,
            local: local,
            tags: tags
        }, util: {
            debounce: debounce
        }, "class": {
            "abstract": AbstractSelect2,
            "single": SingleSelect2,
            "multi": MultiSelect2
        }
    };

}(jQuery));
