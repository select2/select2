/**
 * Select2 Arabic translation.
 * 
 * Author: Adel KEDJOUR <adel@kedjour.com>
 */
(function ($) {
    "use strict";

    $.extend($.fn.select2.defaults, {
        formatNoMatches: function () { return "لم يتم العثور على مطابقات"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; if (n == 1){ return "الرجاء إدخال حرف واحد على الأكثر"; }; if (n == 2 ? return "الرجاء إدخال حرفين على الأكثر" : return "الجاء إدخال " + n + " على الأكثر";); },
        formatInputTooLong: function (input, max) { var n = input.length - max; if (n == 1){ return "الرجاء إدخال حرف واحد على الأقل"; }; if (n == 2 ? return "الرجاء إدخال حرفين على الأقل" : return "الجاء إدخال " + n + " على الأقل ";); },
        formatSelectionTooBig: function (limit) { if (n == 1){ return "يمكنك أن تختار إختيار واحد فقط"; }; if (n == 2 ? return "يمكنك أن تختار إختيارين فقط" : return "يمكنك أن تختار " + n + " إختيارات فقط";); },
        formatLoadMore: function (pageNumber) { return "تحميل المزيد من النتائج..."; },
        formatSearching: function () { return "البحث..."; }    		
    });
})(jQuery);
