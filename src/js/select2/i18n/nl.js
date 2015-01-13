define(function () {
  // Dutch
  return {
    errorLoading: function () {
      return 'De resultaten konden niet geladen worden.';
    },

    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Verwijder alstublief ' + overChars + ' karakter';

      if (overChars != 1) {
        message += 's';
      }

      return message;
    },

    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Voer alstublief ' + remainingChars + ' of meer karakters in.';

      return message;
    },

    loadingMore: function () {
      return 'Loading more results…';
    },

    maximumSelected: function (args) {
      var items = ( args.maximum != 1 ) ? 'resultaat' : 'resultaten';

      var message = 'Je kunt maximaal ' + args.maximum + ' ' + items + ' selecteren.';

      return message;
    },

    noResults: function () {
      return 'Geen resultaten gevonden.';
    },

    searching: function () {
      return 'Zoeken...';
    }
  };
});
