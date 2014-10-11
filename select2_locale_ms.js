/**
 * Select2 Malay translation.
 * 
 * Author: Kepoweran <kepoweran@gmail.com>
 * Author: Salahuddin Hairai <mr.od3n@gmail.com>
 */
(function ($) {
    "use strict";

    $.fn.select2.locales['ms'] = {
        formatMatches: function (matches) { if (matches === 1) { return "Satu keputusan ditemui, tekan enter untuk memilih."; } return matches + " keputusan ditemui, gunakan kekunci anak panah ke atas dan ke bawah untuk menavigasi."; },
        formatNoMatches: function () { return "Tiada padanan yang ditemui"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Sila masukkan " + n + " aksara lagi"; },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "Sila hapuskan " + n + " aksara"; },
        formatSelectionTooBig: function (limit) { return "Anda hanya boleh memilih " + limit + " pilihan"; },
        formatLoadMore: function (pageNumber) { return "Sedang memuatkan keputusan…"; },
        formatSearching: function () { return "Mencari…"; }
    };

    $.extend($.fn.select2.defaults, $.fn.select2.locales['ms']);
})(jQuery);
