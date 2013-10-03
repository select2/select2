/**
 * Select2 <Language> translation.
 * 
 * Author: Your Name <your@email>
 */
(function ($) {
    "use strict";

    $.extend($.fn.select2.defaults, {
        formatNoMatches: function () { return "Δεν βρέθηκαν αποτελέσματα"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Παρακαλούμε εισάγετε " + n + " περισσότερο" + (n == 1 ? "" : "υς") + " χαρακτήρ" + (n == 1 ? "α" : "ες"); },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "Παρακαλούμε διαγράψτε " + n + " χαρακτήρ" + (n == 1 ? "α" : "ες"); },
        formatSelectionTooBig: function (limit) { return "Μπορείτε να επιλέξετε μόνο " + limit + " αντικείμεν" + (limit == 1 ? "ο" : "α"); },
        formatLoadMore: function (pageNumber) { return "Φόρτωση περισσότερων..."; },
        formatSearching: function () { return "Αναζήτηση..."; }
    });
})(jQuery);