/**
 * Select2 Turkish translation.
 * 
 * Author  : Yahya A. ERTURAN root@yahyaerturan.com
 * Version : 0.1
 */
(function ($) {
    "use strict";

    $.extend($.fn.select2.defaults, {
        formatNoMatches: function () { return "Eşleşme bulunamadı"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Lütfen " + n + " karakter daha girin" + (n == 1 ? "" : ""); },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "Lütfen " + n + " karakter daha az giriş yapın" + (n == 1? "" : ""); },
        formatSelectionTooBig: function (limit) { return "En fazla " + limit + " tane seçim yapabilirsiniz" + (limit == 1 ? "" : ""); },
        formatLoadMore: function (pageNumber) { return "Daha fazla sonuç yükleniyor..."; },
        formatSearching: function () { return "Sorgulanıyor..."; }
    });
})(jQuery);
