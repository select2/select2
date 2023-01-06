define(function () {
  // Norwegian
  return {
    errorLoading: function () {
      return 'Resultatene kunne ikke lastes.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Vennligst slett ' + overChars + ' tegn';

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Vennligst skriv inn ' + remainingChars + ' eller flere tegn';

      return message;
    },
    loadingMore: function () {
      return 'Laster flere resultater...';
    },
    maximumSelected: function (args) {
      var message = 'Du kan bare velge ' + args.maximum + ' element';

      if (args.maximum != 1) {
        message += 'er';
      }

      return message;
    },
    noResults: function () {
      return 'Ingen resultater funnet';
    },
    searching: function () {
      return 'Søker...';
    },
    removeAllItems: function () {
      return 'Fjern alle elementer';
    },
    removeItem: function () {
      return 'Fjerne element';
    },
    search: function() {
      return 'Søk';
    }
  };
});
