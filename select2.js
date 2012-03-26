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

    function getSideBorderPadding(element) {
        return element.outerWidth() - element.width();
    }

    function installKeyUpChangeEvent(element) {
        element.on("keydown", function () {
            element.data("keyup-change-value", element.val());
        });
        element.on("keyup", function () {
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
    $(document).on("mousemove", function (e) {
        $(this).data("select2-lastpos", {x: e.pageX, y: e.pageY});
    });
    function installFilteredMouseMove(element) {
        var doc = $(document);
        element.on("mousemove", function (e) {
            var lastpos = doc.data("select2-lastpos");

            if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                $(e.target).trigger("mousemove-filtered", e);
            }
        });
    }

    function debounce(threshold, fn) {
        var timeout;
        return function () {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(fn, threshold);
        };
    }

    function installDebouncedScroll(threshold, element) {
        var notify = debounce(threshold, function (e) { element.trigger("scroll-debounced", e);});
        element.on("scroll", function (e) {
            if (element.get().indexOf(e.target) >= 0) notify(e);
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
     * blurs any Select2 container that has focus when an element outside them was clicked or received focus
     */
    $(document).ready(function () {
        $(document).on("mousedown focusin", function (e) {
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
        var results, search;

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
        this.results = results = this.container.find(".select2-results");
        this.search = search = this.container.find("input[type=text]");
        // initialize the container

        this.resultsPage = 0;

        this.initContainer();

        installFilteredMouseMove(this.results);
        results.on("mousemove-filtered", this.bind(this.highlightUnderEvent));

        installDebouncedScroll(80, this.results);
        results.on("scroll-debounced", this.bind(this.loadMoreIfNeeded));

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
        search.on("keyup-change", this.bind(this.updateResults));

        results.on("click", this.bind(function (e) {
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
            formatInputTooShort: function (input, min) { return "Please enter " + (min - input.length) + " more characters"; }
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
            if (!("query" in opts) && opts.ajax) {
                opts.query = (function () {
                    var timeout, // current scheduled but not yet executed request
                        requestSequence = 0, // sequence used to drop out-of-order responses
                        quietMillis = opts.ajax.quietMillis || 100;

                    return function (query) {
                        window.clearTimeout(timeout);
                        timeout = window.setTimeout(function () {
                            requestSequence += 1; // increment the sequence
                            var requestNumber = requestSequence, // this request's sequence number
                                options = opts.ajax, // ajax parameters
                                data = options.data; // ajax data function

                            data = data.call(this, query.term, query.page);

                            $.ajax({
                                url: options.url,
                                dataType: options.dataType,
                                data: data
                            }).success(
                                function (data) {
                                    if (requestNumber < requestSequence) {
                                        return;
                                    }
                                    query.callback(options.results(data, query.page));
                                }
                            );
                        }, quietMillis);
                    };
                }());
            }
        }
        if (typeof(opts.query) !== "function") {
            throw "query function not defined for Select2 " + opts.element.attr("id");
        }

        return opts;
    };

    AbstractSelect2.prototype.opened = function () {
        return this.container.hasClass("select2-dropdown-open");
    };

    AbstractSelect2.prototype.alignDropdown = function () {
        this.dropdown.css({
            top: this.container.height(),
            width: this.container.outerWidth() - getSideBorderPadding(this.dropdown)
        });
    };

    AbstractSelect2.prototype.open = function () {
        var width;

        if (this.opened()) return;

        this.container.addClass("select2-dropdown-open").addClass("select2-container-active");

        this.alignDropdown();
        this.dropdown.show();
    };

    AbstractSelect2.prototype.close = function () {
        if (!this.opened()) return;

        this.dropdown.hide();
        this.container.removeClass("select2-dropdown-open");

        if (this.select) {
            // TODO see if we can always clear here and reset on open
            this.search.val(""); // not using clearSearch() because it may set a placeholder
            this.updateResults(); // needed since we just set the search text to ""
        } else {
            this.results.empty();
        }

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
            return choices.get().indexOf(choices.filter(".select2-highlighted")[0]);
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

    AbstractSelect2.prototype.updateResults = function () {
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
            var parts = []; // html parts

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
            this.postprocessResults();
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

    function SingleSelect2() {
    }

    SingleSelect2.prototype = new AbstractSelect2();
    SingleSelect2.prototype.constructor = SingleSelect2;
    SingleSelect2.prototype.parent = AbstractSelect2.prototype;

    SingleSelect2.prototype.createContainer = function () {
        return $("<div></div>", {
            "class": "select2-container",
            "style": "width: " + this.opts.element.outerWidth() + "px"
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

        var width;

        if (this.opened()) return;

        this.parent.open.apply(this, arguments);

        // size the search field

        width = this.dropdown.width();
        width -= getSideBorderPadding(this.container.find(".select2-search"));
        width -= getSideBorderPadding(this.search);
        this.search.css({width: width});

        if (!this.select) this.updateResults();

        this.ensureHighlightVisible();

        this.focusSearch();
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
            selected;

        this.selection = selection = container.find(".select2-choice");

        this.search.on("keydown", this.bind(function (e) {
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

        selection.on("click", this.bind(function (e) {
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
        selection.on("keydown", this.bind(function (e) {
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
        selection.on("focus", function () { container.addClass("select2-container-active"); });
        selection.on("blur", this.bind(function () {
            if (clickingInside) return;
            if (!this.opened()) this.blur();
        }));

        selection.find("abbr")
            .on("click", this.bind(function (e) {
                this.val("");
                killEvent(e);
                this.close();
            }
        ));

        if (this.select) {
            selected = this.select.find(":selected");
            this.updateSelection({id: selected.attr("value"), text: selected.text()});

            // preload all results
            this.updateResults();
        }

        this.setPlaceholder();
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

    SingleSelect2.prototype.postprocessResults = function () {
        var selected = 0, self = this;
        this.results.find(".select2-result").each(function (i) {
            if ($(this).data("select2-data").id === self.opts.element.val()) {
                selected = i;
                return false;
            }
        });
        this.highlight(selected);
    };

    SingleSelect2.prototype.onSelect = function (data) {
        this.opts.element.val(data.id);
        this.updateSelection(data);
        this.close();
        this.selection.focus();
    };

    SingleSelect2.prototype.updateSelection = function (data) {
        this.selection.find("span").html(this.opts.formatSelection(data));
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
            this.select.val(val);
            this.select.find(":selected").each(function () {
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
            "style": "width: " + this.opts.element.outerWidth() + "px"
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

    MultiSelect2.prototype.initContainer = function () {

        var selection, data;

        this.searchContainer = this.container.find(".select2-search-field");
        this.selection = selection = this.container.find(".select2-choices");

        this.search.on("keydown", this.bind(function (e) {
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

        this.search.on("keyup", this.bind(this.resizeSearch));

        this.selection.on("click", this.bind(function (e) {
            if (this.select) {
                this.open();
            }
            this.focusSearch();
            e.preventDefault();
        }));

        this.search.on("focus", this.bind(function () {
            this.container.addClass("select2-container-active");
            this.clearPlaceholder();
        }));

        if (this.select) {
            data = [];
            this.select.find(":selected").each(function () {
                data.push({id: $(this).attr("value"), text: $(this).text()});
            });

            this.updateSelection(data);
            // preload all results
            this.updateResults();
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
        this.ensureHighlightVisible();
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
            .on("click dblclick", this.bind(function (e) {
            this.unselect($(e.target));
            this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
            killEvent(e);
            this.close();
            this.focusSearch();
        })).on("focus", this.bind(function () {
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

        index = val.indexOf(selected.data("select2-data").id);

        if (index >= 0) {
            val.splice(index, 1);
            this.setVal(val);
            if (this.select) this.postprocessResults();
        }
        selected.remove();
        window.setTimeout(this.bind(this.alignDropdown), 20);
    };

    MultiSelect2.prototype.postprocessResults = function () {
        var val = this.getVal(),
            choices = this.results.find(".select2-result"),
            self = this;

        choices.each(function () {
            var choice = $(this), id = choice.data("select2-data").id;
            if (val.indexOf(id) >= 0) {
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
                    multiple = opts.element.prop("multiple");
                } else {
                    multiple = opts.multiple || false;
                }

                select2 = multiple ? new MultiSelect2() : new SingleSelect2();
                select2.init(opts);
            } else if (typeof(args[0]) === "string") {

                if (allowedMethods.indexOf(args[0]) < 0) {
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

}(jQuery));
