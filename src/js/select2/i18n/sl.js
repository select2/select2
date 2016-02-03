define(function () {
  // Slovenian
  return {
    errorLoading: function () {
      return 'Rezultatov ni bilo mogoče naložiti.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Število znakov, ki jih izbrišite: ' + overChars;

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Vnesite ' + remainingChars + ' ali več znakov';

      return message;
    },
    loadingMore: function () {
      return 'Nalaganje več rezultatov…';
    },
    maximumSelected: function (args) {
      var message = 'Izberete lahko največ toliko elementov: ' + args.maximum;

      return message;
    },
    noResults: function () {
      return 'Ni najdenih rezultatov';
    },
    searching: function () {
      return 'Iskanje…';
    }
  };
});
