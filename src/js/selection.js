(function ($, document, window, undefined) {

    var s2 = window.s2 = window.s2 || {};
    var util = s2.util;

    s2.SingleSelection = util.clazz(util.Observable, {
        init: function () {
            util.Observable.prototype.init.apply(this);
            this.tag = util.tag();
        },

        render: function () {
            return new util.Markup("<div class='s2-single-select' id='", this.tag, "'><div class='s2-selection'></div></div>");
        },

        bind: function (container) {
            this.element = container.find("#" + this.tag);

            var self = this;
            this.element.on("click", function () {
                self.onClick.apply(self, arguments);
            });
        },

        update: function (data) {
            var text = "";
            if (data.length == 0) {
                // clear
            } else {
                text = data[0].text;
            }
            this.element.find(".s2-selection").html(text);
        },

        onClick: function (event) {
            this.trigger("toggle", {event: event});
        }
    });

})(jQuery, document, window);