/**
 * Select2 <fa> translation.
 * 
 * Author: Ali Choopan <choopan@arsh.co>
 */
(function ($) {
    "use strict";

    $.extend($.fn.select2.defaults, {
        formatNoMatches: function () { return "نتیجه‌ای یافت نشد."; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return " لطفا بیش از"+n+"کاراکتر وارد نمایید "; },
        formatInputTooLong: function (input, max) { var n = input.length - max; return " لطفا" + n + " کاراکتر را حذف کنید."; },
        formatSelectionTooBig: function (limit) { return "شما فقط می‌توانید " + limit + " مورد را انتخاب کنید"; },
        formatLoadMore: function (pageNumber) { return "در حال بارگذاری موارد بیشتر ..."; },
        formatSearching: function () { return "در حال جستجو"; }
    });
})(jQuery);
