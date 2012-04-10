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

    if (window.Select2 !== undefined) {
        return;
    }

    var KEY = {
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
            for (; i < l; i++) if (value.localeCompare(array[i]) === 0) return i;
        } else {
            for (; i < l; i++) {
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
        $(this).data("select2-lastpos", {x: e.pageX, y: e.pageY});
    });
    function installFilteredMouseMove(element) {
        var doc = $(document);
        element.bind("mousemove", function (e) {
            var lastpos = doc.data("select2-lastpos");

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
     * @param options.ajax url for the data
     * @param options.data a function(searchTerm, pageNumber) that should return an object containing query string parameters for the above url.
     * @param options.dataType request data type: ajax, jsonp, other datatatypes supported by jQuery's $.ajax function
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
            quietMillis = options.quietMillis || 100;

        return function (query) {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                requestSequence += 1; // increment the sequence
                var requestNumber = requestSequence, // this request's sequence number
                    data = options.data; // ajax data function

                data = data.call(this, query.term, query.page);

                $.ajax({
                    url: options.url,
                    dataType: options.dataType,
                    data: data,
                    success: function (data) {
                        if (requestNumber < requestSequence) {
                            return;
                        }
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
        if ($.isFunction(data)) {
            return data;
        }

        // if not a function we assume it to be an array

        return function (query) {
            var t = query.term.toUpperCase(), filtered = {results: []};
            $(data).each(function () {
                if (t === "" || this.toUpperCase().indexOf(t) >= 0) { filtered.results.push({id: this, text: this}); }
            });
            query.callback(filtered);
        }
    }

    // exports
    window.Select2 = {query: {}, util: {}};
    window.Select2.util.debounce = debounce;
    window.Select2.query.ajax = ajax;
    window.Select2.query.local = local;
    window.Select2.query.tags = tags;

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
     *
     * @param opts
     */
    function AbstractSelect2() {
    }

    AbstractSelect2.prototype.bind = function (func) {
        var self = this;
        return function () {
            func.apply(self, arguments);
        };
    };

    AbstractSelect2.prototype.init = function (opts) {
        var results, search, resultsSelector = ".select2-results";

        // prepare options
        this.opts = this.prepareOpts(opts);

        this.container = this.createContainer();

        if (opts.element.attr("class") !== undefined) {
            this.container.addClass(opts.element.attr("class"));
        }

        // swap container for the element
        this.opts.element.data("select2", this)
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

        this.container.delegate(resultsSelector, "click", this.bind(function (e) {
            if ($(e.target).closest(".select2-result:not(.select2-disabled)").length > 0) {
                this.highlightUnderEvent(e);
                this.selectHighlighted(e);
            } else {
                killEvent(e);
                this.focusSearch();
            }
        }));
    };

    AbstractSelect2.prototype.prepareOpts = function (opts) {
        var element, select;

        opts = $.extend({}, {
            formatResult: function (data) { return data.text; },
            formatSelection: function (data) { return data.text; },
            formatNoMatches: function () { return "No matches found"; },
            formatInputTooShort: function (input, min) { return "Please enter " + (min - input.length) + " more characters"; },
            minimumResultsForSearch: 0
        }, opts);

        element = opts.element;

        if (element.get(0).tagName.toLowerCase() === "select") {
            this.select = select = opts.element;
        }

        // TODO add missing validation logic
        if (select) {
            /*$.each(["multiple", "ajax", "query", "minimumInputLength"], function () {
             if (this in opts) {
             throw "Option '" + this + "' is not allowed for Select2 when attached to a select element";
             }
             });*/
            this.opts = opts = $.extend({}, {
                miniumInputLength: 0
            }, opts);
        } else {
            this.opts = opts = $.extend({}, {
                miniumInputLength: 0
            }, opts);
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
        } else {
            if (!("query" in opts)) {
                if ("ajax" in opts) {
                    opts.query = ajax(opts.ajax);
                } else if ("data" in opts) {
                    opts.query = local(opts.data);
                } else if ("tags" in opts) {
                    opts.query = tags(opts.tags);
                    opts.createSearchChoice = function (term) { return {id: term, text: term};}
                    opts.initSelection = function (element) {
                        var data = [];
                        $(element.val().split(",")).each(function () {
                            data.push({id: this, text: this});
                        });
                        return data;
                    }

                }
            }
        }
        if (typeof(opts.query) !== "function") {
            throw "query function not defined for Select2 " + opts.element.attr("id");
        }

        return opts;
    };

    /**
     * Triggers the change event on the source element
     */
    AbstractSelect2.prototype.triggerChange = function () {
        this.opts.element.trigger("change");
    };

    AbstractSelect2.prototype.opened = function () {
        return this.container.hasClass("select2-dropdown-open");
    };

    AbstractSelect2.prototype.alignDropdown = function () {
        this.dropdown.css({
            top: this.container.height()
        });
    };

    AbstractSelect2.prototype.open = function () {
        if (this.opened()) return;

        this.container.addClass("select2-dropdown-open").addClass("select2-container-active");

        this.updateResults(true);
        this.alignDropdown();
        this.dropdown.show();
        this.focusSearch();
    };

    AbstractSelect2.prototype.close = function () {
        if (!this.opened()) return;

        this.dropdown.hide();
        this.container.removeClass("select2-dropdown-open");
        this.results.empty();
        this.clearSearch();
    };

    AbstractSelect2.prototype.clearSearch = function () {

    };

    AbstractSelect2.prototype.ensureHighlightVisible = function () {
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
    };

    AbstractSelect2.prototype.moveHighlight = function (delta) {
        var choices = this.results.children(".select2-result"),
            index = this.highlight();

        while (index > -1 && index < choices.length) {
            index += delta;
            if (!$(choices[index]).hasClass("select2-disabled")) {
                this.highlight(index);
                break;
            }
        }
    };

    AbstractSelect2.prototype.highlight = function (index) {
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
    };

    AbstractSelect2.prototype.highlightUnderEvent = function (event) {
        var el = $(event.target).closest(".select2-result");
        if (el.length > 0) {
            this.highlight(el.index());
        }
    };

    AbstractSelect2.prototype.loadMoreIfNeeded = function () {
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
    };

    /**
     * @param initial whether or not this is the call to this method right after the dropdown has been opened
     */
    AbstractSelect2.prototype.updateResults = function (initial) {
        var search = this.search, results = this.results, opts = this.opts;

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
                if (def !== undefined && def !== null && def.id !== undefined && def.id != null) {
                    if ($(data.results).filter(
                        function () {
                            return equal(this.id, def.id);
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
    };

    AbstractSelect2.prototype.cancel = function () {
        this.close();
    };

    AbstractSelect2.prototype.blur = function () {
        /* we do this in a timeout so that current event processing can complete before this code is executed.
         this allows tab index to be preserved even if this code blurs the textfield */
        window.setTimeout(this.bind(function () {
            this.close();
            this.container.removeClass("select2-container-active");
            this.clearSearch();
            this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
            this.search.blur();
        }), 10);
    };

    AbstractSelect2.prototype.focusSearch = function () {
        /* we do this in a timeout so that current event processing can complete before this code is executed.
         this makes sure the search field is focussed even if the current event would blur it */
        window.setTimeout(this.bind(function () {
            this.search.focus();
        }), 10);
    };

    AbstractSelect2.prototype.selectHighlighted = function () {
        var data = this.results.find(".select2-highlighted:not(.select2-disabled)").data("select2-data");
        if (data) {
            this.onSelect(data);
        }
    };

    AbstractSelect2.prototype.getPlaceholder = function () {
        var placeholder = this.opts.element.data("placeholder");
        if (placeholder !== undefined) return placeholder;
        return this.opts.placeholder;
    };

    /**
     * Get the desired width for the container element.  This is
     * derived first from option `width` passed to select2, then
     * the inline 'style' on the original element, and finally
     * falls back to the jQuery calculated element width.
     *
     * @returns The width string (with units) for the container.
     */
    AbstractSelect2.prototype.getContainerWidth = function () {
        if (this.opts.width !== undefined)
            return this.opts.width;

        var style = this.opts.element.attr('style');
        if (style !== undefined) {
            var attrs = style.split(';');
            for (var i = 0; i < attrs.length; i++) {
                var matches = attrs[i].replace(/\s/g, '')
                    .match(/width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/);
                if (matches != null && matches.length >= 1)
                    return matches[1];
            }
        }
        return this.opts.element.width() + 'px';
    };

    function SingleSelect2() {
    }

    SingleSelect2.prototype = new AbstractSelect2();
    SingleSelect2.prototype.constructor = SingleSelect2;
    SingleSelect2.prototype.parent = AbstractSelect2.prototype;

    SingleSelect2.prototype.createContainer = function () {
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
    };

    SingleSelect2.prototype.open = function () {

        if (this.opened()) return;

        this.parent.open.apply(this, arguments);

    };

    SingleSelect2.prototype.close = function () {
        if (!this.opened()) return;
        this.parent.close.apply(this, arguments);
    };

    SingleSelect2.prototype.cancel = function () {
        this.parent.cancel.apply(this, arguments);
        this.selection.focus();
    };

    SingleSelect2.prototype.initContainer = function () {

        var selection, container = this.container, clickingInside = false,
            selector = ".select2-choice", selected;

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

        if ($.isFunction(this.opts.initSelection)) {
            selected = this.opts.initSelection.call(null, this.opts.element);
            if (selected !== undefined && selected != null) {
                this.updateSelection(selected);
            }
        }

        this.setPlaceholder();
    };

    SingleSelect2.prototype.prepareOpts = function () {
        var opts = this.parent.prepareOpts.apply(this, arguments);

        if (opts.element.get(0).tagName.toLowerCase() === "select") {
            // install sthe selection initializer
            this.opts.initSelection = function (element) {
                var selected = element.find(":selected");
                // a single select box always has a value, no need to null check 'selected'
                return {id: selected.attr("value"), text: selected.text()};
            };
        }

        return opts;
    };


    SingleSelect2.prototype.setPlaceholder = function () {
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
    };

    SingleSelect2.prototype.postprocessResults = function (data, initial) {
        var selected = 0, self = this;

        // find the selected element in the result list

        this.results.find(".select2-result").each(function (i) {
            if (equal($(this).data("select2-data").id, self.opts.element.val())) {
                selected = i;
                return false;
            }
        });

        // and highlight it

        this.highlight(selected);

        // hide the search box if this is the first we got the results and there are a few of them

        if (initial === true) {
            this.search.parent().toggle(data.results.length >= this.opts.minimumResultsForSearch);
        }

    };

    SingleSelect2.prototype.onSelect = function (data) {
        var old = this.opts.element.val();

        this.opts.element.val(data.id);
        this.updateSelection(data);
        this.close();
        this.selection.focus();

        if (!equal(old, data.id)) { this.triggerChange(); }
    };

    SingleSelect2.prototype.updateSelection = function (data) {
        this.selection
            .find("span")
            .html(this.opts.formatSelection(data));

        this.selection.removeClass("select2-default");

        if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
            this.selection.find("abbr").show();
        }
    };

    SingleSelect2.prototype.val = function () {
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
            // val is an object
            this.opts.element.val((val === null) ? "" : val.id);
            this.updateSelection(val);
        }
        this.setPlaceholder();

    };

    SingleSelect2.prototype.clearSearch = function () {
        this.search.val("");
    };

    function MultiSelect2(opts) {

    }

    MultiSelect2.prototype = new AbstractSelect2();
    MultiSelect2.prototype.constructor = AbstractSelect2;
    MultiSelect2.prototype.parent = AbstractSelect2.prototype;

    MultiSelect2.prototype.createContainer = function () {
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
    };

    MultiSelect2.prototype.prepareOpts = function () {
        var opts = this.parent.prepareOpts.apply(this, arguments);

        if (opts.element.get(0).tagName.toLowerCase() === "select") {
            // install sthe selection initializer
            this.opts.initSelection = function (element) {
                var data = [];
                element.find(":selected").each(function () {
                    data.push({id: $(this).attr("value"), text: $(this).text()});
                });
                return data;
            };
        }

        return opts;
    };

    MultiSelect2.prototype.initContainer = function () {

        var selector = ".select2-choices", selection, data;

        this.searchContainer = this.container.find(".select2-search-field");
        this.selection = selection = this.container.find(selector);

        this.search.bind("keydown", this.bind(function (e) {
            if (e.which === KEY.BACKSPACE && this.search.val() === "") {
                this.close();

                var choices,
                    selected = this.selection.find(".select2-search-choice-focus");
                if (selected.length > 0) {
                    this.unselect(selected.first());
                    this.search.width(10);
                    killEvent(e);
                    return;
                }

                choices = this.selection.find(".select2-search-choice");
                if (choices.length > 0) {
                    choices.last().addClass("select2-search-choice-focus");
                }
            } else {
                this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
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

        if ($.isFunction(this.opts.initSelection)) {
            data = this.opts.initSelection.call(null, this.opts.element);
            if (data !== undefined && data != null) {
                this.updateSelection(data);
            }
        }

        // set the placeholder if necessary
        this.clearSearch();
    };

    MultiSelect2.prototype.clearSearch = function () {
        var placeholder = this.getPlaceholder();

        this.search.val("").width(10);

        if (placeholder !== undefined && this.getVal().length === 0) {
            this.search.val(placeholder).addClass("select2-default");
            this.resizeSearch();
        }
    };

    MultiSelect2.prototype.clearPlaceholder = function () {
        if (this.search.hasClass("select2-default")) {
            this.search.val("").removeClass("select2-default");
        }
    };

    MultiSelect2.prototype.open = function () {
        if (this.opened()) return;
        this.parent.open.apply(this, arguments);
        this.resizeSearch();
        this.focusSearch();
    };

    MultiSelect2.prototype.close = function () {
        if (!this.opened()) return;
        this.parent.close.apply(this, arguments);
    };

    MultiSelect2.prototype.updateSelection = function (data) {
        var self = this;
        this.selection.find(".select2-search-choice").remove();
        $(data).each(function () {
            self.addSelectedChoice(this);
        });
        self.postprocessResults();
        this.alignDropdown();
    };

    MultiSelect2.prototype.onSelect = function (data) {
        this.addSelectedChoice(data);
        if (this.select) { this.postprocessResults(); }
        this.close();
        this.search.width(10);

        // since its not possible to select an element that has already been
        // added we do not need to check if this is a new element before firing change
        this.triggerChange();

        this.focusSearch();
    };

    MultiSelect2.prototype.cancel = function () {
        this.close();
        this.focusSearch();
    };

    MultiSelect2.prototype.addSelectedChoice = function (data) {
        var choice,
            id = data.id,
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
    };

    MultiSelect2.prototype.unselect = function (selected) {
        var val = this.getVal(),
            index;

        selected = selected.closest(".select2-search-choice");

        if (selected.length === 0) {
            throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
        }

        index = indexOf(selected.data("select2-data").id, val);

        if (index >= 0) {
            val.splice(index, 1);
            this.setVal(val);
            if (this.select) this.postprocessResults();
        }
        selected.remove();
        this.triggerChange();
        window.setTimeout(this.bind(this.alignDropdown), 20);
    };

    MultiSelect2.prototype.postprocessResults = function () {
        var val = this.getVal(),
            choices = this.results.find(".select2-result"),
            self = this;

        choices.each(function () {
            var choice = $(this), id = choice.data("select2-data").id;
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

    };

    MultiSelect2.prototype.resizeSearch = function () {

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
    };

    MultiSelect2.prototype.getVal = function () {
        var val;
        if (this.select) {
            val = this.select.val();
            return val === null ? [] : val;
        } else {
            val = this.opts.element.val();
            return (val === null || val === "") ? [] : val.split(",");
        }
    };

    MultiSelect2.prototype.setVal = function (val) {
        if (this.select) {
            this.select.val(val);
        } else {
            this.opts.element.val(val.length === 0 ? "" : val.join(","));
        }
    };

    MultiSelect2.prototype.val = function () {
        var val, data = [];

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

            $(val).each(function () { data.push(this.id); });
            this.setVal(data);
            this.updateSelection(val);
        }
    };

    $.fn.select2 = function () {

        var args = Array.prototype.slice.call(arguments, 0),
            opts,
            select2,
            value, multiple, allowedMethods = ["val"];

        this.each(function () {
            if (args.length === 0 || typeof(args[0]) === "object") {
                opts = args.length === 0 ? {} : args[0];
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
            local: local
        }, util: {
            debounce: debounce
        }, "class": {
            abstract: AbstractSelect2,
            single: SingleSelect2,
            multi: MultiSelect2
        }
    };

}(jQuery));
