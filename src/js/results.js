(function ($, document, window, undefined) {

    var s2 = window.s2 = window.s2 || {};

    var util = s2.util;
    var assert = util.assert;


    s2.Dropdown = util.clazz(util.Observable, {

        construct: function (opts) {
            assert.isNotNull(opts, "opts parameter must be set");
            assert.isElement(opts.select, "opts.select must point to the select element");

            this.super();

            this.opts = opts;
        },

        bind: function (container, tag) {
            assert.isElement(container, "container parameter must be set");
            assert.isElement(tag, "tag parameter must be set");


            this.container = container;
            this.element = tag;
            this.element.addClass("s2-dropdown");
            this.element.detach();
            this.element.removeClass("s2-hidden");

            //util.detectPlatform(this.element);
        },

        show: function () {
            var self = this;
            self.opts.select.parent("body").append(this.element);
            self.position();
            self.container.addClass("s2-active");
        },

        hide: function () {
            var self = this;
            self.element.detach();
            self.container.removeClass("s2-active");

        },
        position: function () {
            var self = this,
                container = self.container;

            var
                offset = container.offset(),
                height = container.outerHeight(false),
                width = container.outerWidth(false),
                dropTop = offset.top + height,
                dropLeft = offset.left;

            self.element.css({ top: dropTop, left: dropLeft, width: width });

        }
    });

    s2.SearchField = util.clazz(util.Observable, {

        construct: function (element) {
            this.super();
            var self = this;
            this.value = element.val();
            this.element = element;
            this.element.on("keyup.s2", function () {
                self.onKeyUp.apply(self, arguments)
            });
        },
        onKeyUp: function (e) {
            var self = this;
            if (self.value !== self.element.val()) {
                self.trigger("valueChanged", { oldValue: self.value, value: self.element.val(), event: e});
                self.value = self.element.val();
            }
        },
        focus: function () {
            this.element.focus();
        },
        val: function () {
            return this.element.val();
        }

    });

    s2.ResultList = util.clazz(util.Observable, {
        construct: function (opts) {
            assert.isNotNull(opts, "opts argument must be set");
            assert.isElement(opts.select, "opts.select must point to the select element");

            this.super();

            this.opts = opts;
            this.tag = util.tag();
            this.queryParams = {};
        },
        render: function () {
            return new util.Markup("<div class='s2-results' id='", this.tag, "'></div>");
        },
        bind: function (container) {
            var self = this;
            this.container = container;

            this.element = container.find("#" + this.tag);
            assert.isElement(this.element, "Could not find result list element");

            this.container.attr("tabindex", "0");
            this.container.on("keydown", function (e) {
                self.onKeyDown(e);
            });

            this.container.on("focusout", function (e) {
                self.onBlur(e);
            });

            this.element.on("click", function () {
                self.onClick.apply(self, arguments);
            });

            //util.detectPlatform(this.element);
        },
        show: function () {
            var self = this;
            self.update();
        },
        update: function () {
            var self = this;

            var index = 0;
            self.data = [];

            self.element.find(".s2-options").remove();
            var options = $("<ul class='s2-options'></ul>");
            self.element.append(options);

            $.each(self.query(), function () {
                var option = $(["<li class='s2-option' data-s2-index='" + index, "'>", this.text, "</li>"].join(""));
                options.append(option);
                self.data.push(this);
                index++;
            });

            options.find("li").first().addClass("s2-highlighted");
        },
        query: function () {
            return this.opts.data.query(this.queryParams);
        },
        onClick: function (event) {
            var target = $(event.target);
            var option = target.is(".s2-option") ? target : target.parents(".s2-option").first();
            if (option.length > 0) {
                // option clicked
                this.trigger("select", { event: event, element: option, data: this.data[option.data("s2-index")] });
            }

        },
        focus: function () {
            var self = this;
            this.container.focus();
        },
        onBlur: function (event) {
            var self = this;
            window.setTimeout(function () {
                // done in a time out because we want the current focusout event processed so that
                // document.activeElement points to element that received the new focus
                //console.log("blur event", event);
                //console.log("blur container", self.container.get(0));
                //console.log("blur active", document.activeElement);
                //console.log("blur contains", $.contains(self.container.get(0), document.activeElement));
                if (!$.contains(self.container.get(0), document.activeElement) && self.container.get(0) !== document.activeElement) {
                    self.trigger("close", {event: event});
                }
            }, 0);
        },
        onKeyDown: function (event) {
            if (event.which == util.key.DOWN) {
                this.moveHighlight({delta: 1, event: event});
                event.preventDefault();

            } else if (event.which === util.key.UP) {
                this.moveHighlight({delta: -1, event: event});
                event.preventDefault();
            } else if (event.which === util.key.ENTER) {
                this.selectHighlighted({event: event});
                event.preventDefault();
            }
        },
        selectHighlighted: function (param) {
            var option = this.element.find(".s2-highlighted").first();
            this.trigger("select", { event: param.event, element: option, data: this.data[option.data("s2-index")] });
        },
        moveHighlight: function (param) {
            var delta = param.delta;
            var current = this.element.find(".s2-highlighted");
            var next = null;
            if (delta === 1) {
                next = current.next();
            } else {
                next = current.prev();
            }

            current.removeClass("s2-highlighted");
            next.addClass("s2-highlighted");
        }
    });

    s2.ResultListWithSearch = util.clazz(Object, {
        render: function () {
            this.searchTag = util.tag();
            var markup = new util.Markup(
                "<div class='s2-search'>", //
                "   <input type='text' id='", this.searchTag, "'/>", //
                " <a href='#' class='s2-test'>click me</a>", //
                "   {{original}}", //
                "</div>");

            markup.replace("original", this.decorated());
            return markup;
        },
        bind: function (container) {
            this.decorated(container);
            var self = this;
            this.searchField = new s2.SearchField(container.find("#" + this.searchTag));
            this.searchField.on("valueChanged", function (params) {
                self.onSearch.apply(self, arguments);
            });
        },
        focus: function () {
            this.searchField.focus();
        },
        onSearch: function (params) {
            this.delegate.queryParams.term = this.searchField.val();
            this.delegate.update();
        }
    });

})(jQuery, document, window);