define(function () {
  // Basque
  return {
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Idatzi ';

      if (overChars == 1) {
        message += 'karaktere bat';
      } else {
        message += overChars + ' karaktere';
      }

      message += ' gutxiago';

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Idatzi ';

      if (overChars == 1) {
        message += 'karaktere bat';
      } else {
        message += overChars + ' karaktere';
      }

      message += ' gehiago';

      return message;
    },
    loadingMore: function () {
      return 'Emaitza gehiago kargatzen…';
    },
    maximumSelection: function (args) {
      if (args.maximum === 1) {
        return 'Elementu bakarra hauta dezakezu';
      } else {
        return args.maximum + ' elementu hauta ditzakezu soilik';
      }
    },
    noResults: function () {
      return 'Ez da bat datorrenik aurkitu';
    },
    searching: function () {
      return 'Bilatzen…';
    }
  };
});
