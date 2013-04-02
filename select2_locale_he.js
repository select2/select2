/**
 * Select2 Hebrew translation.
 *
 * Author: Yakir Sitbon <http://www.yakirs.net/>
 */
(function ($) {
    "use strict";

    $.extend($.fn.select2.defaults, {
        formatNoMatches: function () { return "לא נמצאו תוצאות"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "אנא הזן " + n + " תווים נוספים"; },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "אנא הזן " + n + " פחות תווים"; },
        formatSelectionTooBig: function (limit) { return "הנך יכול לבחור " + limit + " פרטים"; },
        formatLoadMore: function (pageNumber) { return "טוען תוצאות נוספות..."; },
        formatSearching: function () { return "מחפש..."; }
    });
})(jQuery);
