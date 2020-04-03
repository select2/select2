define(function () {
  // Esperanto
  return {
    errorLoading: function () {
      return 'La rezultoj ne povas esti ŝargitaj.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Bonvolu forigi ' + overChars + ' signo';

      if (overChars == 1) {
        message += 'n';
      } else {
        message += 'jn';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Bv. enigi ' + remainingChars + ' aŭ pli multajn signojn';

      return message;
    },
    loadingMore: function () {
      return 'Ŝargado de pliaj rezultoj…';
    },
    maximumSelected: function (args) {
      var message = 'Vi povas elekti nur ' + args.maximum + ' ero';

      if (args.maximum == 1) {
        message += 'n';
      } else {
        message += 'jn';
      }

      return message;
    },
    noResults: function () {
      return 'Neniuj rezultoj trovitaj';
    },
    searching: function () {
      return 'Serĉado…';
    },
    removeAllItems: function () {
      return 'Forigi ĉiujn erojn';
    }
  };
});
