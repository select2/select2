/**
 * Select2 Traditional Chinese translation
 */
(function ($) {
    "use strict";
    $.extend($.fn.select2.defaults, {
        formatNoMatches: function () { return "沒有找到匹配項"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "請再輸入" + n + "個字符";},
        formatInputTooLong: function (input, max) { var n = input.length - max; return "請刪掉" + n + "個字符";},
        formatSelectionTooBig: function (limit) { return "你只能選擇最多" + limit + "項"; },
        formatLoadMore: function (pageNumber) { return "加載結果中..."; },
        formatSearching: function () { return "搜尋中..."; }
    });
})(jQuery);
