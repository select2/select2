/*! Select2 4.0.3 | https://github.com/select2/select2/blob/master/LICENSE.md */
(function() {
    if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) var e = jQuery.fn.select2.amd;
    return e.define("select2/i18n/ka", [], function() {
        return {
            errorLoading: function() {
                return "სია ცარიელია"
            },
            inputTooLong: function(e) {
                var t = e.input.length - e.maximum,
                    n = "გთხოვთ წაშალოთ " + t + " სიმბოლო";
                return t != 1 && (n += "s"), n
            },
            inputTooShort: function(e) {
                var t = e.minimum - e.input.length,
                    n = "ჷთხოვთ აკრიფოთ " + t + " ან მეტი სიმბოლო";
                return n
            },
            loadingMore: function() {
                return "შედეგები იტვირთება…"
            },
            maximumSelected: function(e) {
                var t = "თქვენ შეგიძლიათ მხოლოდ " + e.maximum + " ელემენტის არჩევა";
                return e.maximum != 1 && (t += "s"), t
            },
            noResults: function() {
                return "ვერაფერი მოიძებნა"
            },
            searching: function() {
                return "ძიება..."
            }
        }
    }), {
        define: e.define,
        require: e.require
    }
})();
