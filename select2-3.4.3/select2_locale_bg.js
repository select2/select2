/**
 * Select2 <Language> translation.
 * 
 * Author: Lubomir Vikev <lubomirvikev@gmail.com>
 */
(function ($) {
    "use strict";

    $.extend($.fn.select2.defaults, {
        formatNoMatches: function () { return "Няма намерени съвпадения"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Моля въведете още " + n + " символ" + (n == 1 ? "" : "а"); },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "Моля въведете с " + n + " по-малко символ" + (n == 1? "" : "а"); },
        formatSelectionTooBig: function (limit) { return "Можете да направите до " + limit + (limit == 1 ? " избор" : " избора"); },
        formatLoadMore: function (pageNumber) { return "Зареждат се още..."; },
        formatSearching: function () { return "Търсене..."; }
    });
})(jQuery);
