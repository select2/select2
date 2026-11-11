define(function () {
  // Norwegian (Nynorsk)
  return {
    errorLoading: function () {
      return 'Kunne ikkje hente resultat.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      return 'Fjern ' + overChars + ' teikn';
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      return 'Skriv inn ' + remainingChars + ' teikn til';
    },
    loadingMore: function () {
      return 'Lastar fleire resultat …';
    },
    maximumSelected: function (args) {
      return 'Du kan velje maks ' + args.maximum + ' element';
    },
    noResults: function () {
      return 'Ingen treff';
    },
    searching: function () {
      return 'Søkjer …';
    },
    removeAllItems: function () {
      return 'Fjern alle element';
    }
  };
});
