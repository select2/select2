define(function () {
  // Romanian
  return {
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Vă rugăm să introduceți mai puțin de ' + overChars;
      message += ' caracter';

      if (message !== 1) {
        message += 'e';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Vă rugăm să introduceți incă ' + remainingChars;
      message += ' caracter';

      if (message !== 1) {
        message += 'e';
      }

      return message;
    },
    loadingMore: function () {
      return 'Se încarcă…';
    },
    maximumSelected: function (args) {
      var message = 'Aveți voie să selectați cel mult ' + args.maximum;
      message += ' element';

      if (message !== 1) {
        message += 'e';
      }

      return message;
    },
    noResults: function () {
      return 'Nu a fost găsit nimic';
    },
    searching: function () {
      return 'Căutare…';
    }
  };
});
