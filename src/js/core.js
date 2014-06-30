(function ($, document, window, undefined) {

    var s2 = window.s2 = window.s2 || {};
    var util = s2.util;
    var data = s2.data;
    var assert = util.assert;

    s2.Select = util.clazz(util.Observable, {

        construct: function (element, options) {
            this.super();


            this.isOpen = false;
            this.element = element;
            this.options = options;

            var self = this;

            this.data = new data.local(element);

            var markup = self.render();

            this.container = $(markup.toString());
            this.element.after(this.container);

            var selectionContainer = this.container.find(".s2-selection-container");
            this.selection = new s2.SingleSelection();
            selectionContainer.html(this.selection.render().toString());
            this.selection.bind(this.container);
            this.selection.on("toggle", function () {
                self.toggle.apply(self, arguments)
            });

            var resultsContainer = this.container.find(".s2-results-container");
            this.dropdown = new s2.Dropdown({select: element});
            this.dropdown.bind(this.container, resultsContainer);
            this.results = new s2.ResultList({data: this.data, select: element});
            this.results.decorateWith(new s2.ResultListWithSearch());
            resultsContainer.html(this.results.render().toString());
            this.results.bind(resultsContainer);
            this.results.on("select", function (params) {
                self.onOptionSelected.apply(self, arguments);
                self.close();
            });

            this.results.on("close", function (params) {
                self.close(params);
            });

            this.dropdown.hide();

            this.value = this.data.lookup();

            this.selection.update(this.value);


            this.container.width(this.element.width());
            this.element.hide();

            //          util.detectPlatform(this.container);
        },

        render: function () {
            return new util.Markup(
                "<div class='s2-container'>", //
                "  <div class='s2-selection-container'></div>", //
                "  <div class='s2-results-container s2-hidden'></div>", //
                "</div>");

        },

        bind: function () {
            this.selection.bind(this.container);
            this.dropdown.bind(this.container);
            this.results.bind(this.container);
        },

        onOptionSelected: function (params) {
            assert.isObject(params, "params argument must be set");
            assert.isObject(params.data, "params.data must point to the option's data object");
            assert.isEvent(params.event, "params.event must point to the event that triggered the selection");
            assert.isElement(params.element, "opts.element must point to the option element");

            if (this.element.prop("multiple")) {

            } else {
                if (this.value.length) {
                    $(this.value[0].element).removeProp("selected");
                }
                this.value = [params.data];
                $(this.value[0].element).prop("selected", true);

            }

            this.selection.update(this.value);


        },

        toggle: function (event) {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        },

        open: function (param) {
            if (this.isOpen) return;
            var self = this;
            this.dropdown.show();
            this.results.show();
            this.results.focus();
            this.isOpen = true;
        },

        close: function (params) {
            if (!this.isOpen) return;
            var self = this;

//            this.results.hide();
            this.dropdown.hide();
            this.isOpen = false;
        }


    });

})(jQuery, document, window);