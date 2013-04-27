/**
 * Select2 French translation
 */
(function ($) {
    "use strict";

    $.extend($.fn.select2.defaults, {
        formatNoMatches: function () { return "Aucun r&eacute;sultat trouv&eacute;"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Merci de saisir " + n + " caract&egrave;re" + (n == 1? "" : "s") + " de plus"; },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "Merci de saisir " + n + " caract&egrave;re" + (n == 1? "" : "s") + " de moins"; },
        formatSelectionTooBig: function (limit) { return "Vous pouvez seulement s&eacute;lectionner " + limit + " &eacute;l&eacute;ment" + (limit == 1 ? "" : "s"); },
        formatLoadMore: function (pageNumber) { return "Chargement de r&eacute;sultats suppl&eacute;mentaires..."; },
        formatSearching: function () { return "Recherche en cours..."; }
    });
})(jQuery);
