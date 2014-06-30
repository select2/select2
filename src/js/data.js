(function ($, document, window, undefined) {

    var s2 = window.s2 = window.s2 || {};
    var data = s2.data = s2.data || {};
    var util=s2.util;

    data.local = util.clazz(Object, {
        construct: function (select) {
            this.select = select;
        },
        lookup: function () {
            var data = [], self = this;
            this.select.find(":selected").each(function () {
                data.push(self.item($(this)));
            });
            return data;
        },
        query: function (params) {
            var data = [], self = this;
            self.select.find("option").each(function () {
                var option = $(this);
                if (self.matches(params, option)) {
                    data.push(self.item($(this)));
                }
            });
            return data;
        },
        matches: function (params, option) {
            if (params && params.term) {
                var text = option.text().toUpperCase();
                if (text.indexOf(params.term.toUpperCase()) >= 0) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        },

        item: function (option) {
            return {value: option.attr("value"), text: option.text(), element: option.get(0)};
        }
    });

})(jQuery, document, window);