/**
 * Select2 Urdu translation.
 * 
 * Author: Muhammad Amjad <me@perochak.com>
 */
(function ($) {
    "use strict";

    $.extend($.fn.select2.defaults, {
        formatNoMatches: function () { return "کوئی نتیجہ نہیں ہے"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "داخل کریں " + n + " زیادہ حروف"; },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "حذف کریں" + n + " حروف"; },
        formatSelectionTooBig: function (limit) { return "آپ صرف" + limit + " منتخب کر سکتے ہیں"; },
        formatLoadMore: function (pageNumber) { return "مزید نتائج لوڈ کر رہا ہے.."; },
        formatSearching: function () { return "تلاش کر رہے ہیں..."; }
    });
})(jQuery);
