$.extend($.fn.select2.defaults, {
    formatNoMatches: function () { return "Keine Übereinstimmungen gefunden"; },
    formatInputTooShort: function (input, min) { return "Bitte geben Sie " + (min - input.length) + " weitere Zeichen ein"; },
    formatSelectionTooBig: function (limit) { return "Sie können nur " + limit + " Element" + (limit == 1 ? "" : "e") + " auswählen"; },
    formatLoadMore: function (pageNumber) { return "Lade weitere Ergebnisse..."; },
    formatSearching: function () { return "Suche..."; }
});
