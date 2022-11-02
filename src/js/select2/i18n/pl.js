define(function () {
  // Polish
  var charsWords = ['znak', 'znaki', 'znaków'];
  var itemsWords = ['element', 'elementy', 'elementów'];

  var pluralWord = function pluralWord(numberOfChars, words) {
    if (numberOfChars === 1) {
        return words[0];
    } else if (numberOfChars > 1 && numberOfChars <= 4) {
      return words[1];
    } else if (numberOfChars >= 5) {
      return words[2];
    }
  };
  
  return {
    errorLoading: function () {
      return 'Wystąpił błąd podczas ładowania wyników.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      return 'Usuń ' + overChars + ' ' + pluralWord(overChars, charsWords);
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;
      
      return 'Wpisz co najmniej ' + remainingChars + ' ' +
        pluralWord(remainingChars, charsWords);
    },
    loadingMore: function () {
      return 'Trwa ładowanie...';
    },
    maximumSelected: function (args) {
      return 'Możesz zaznaczyć maksymalnie ' + args.maximum + ' ' +
        pluralWord(args.maximum, itemsWords);
    },
    noResults: function () {
      return 'Brak wyników';
    },
    searching: function () {
      return 'Trwa wyszukiwanie...';
    },
    removeAllItems: function () {
      return 'Usuń wszystkie elementy';
    },
    removeItem: function () {
      return 'Usuń element';
    },
    search: function() {
      return 'Szukaj';
    }
  };
});
