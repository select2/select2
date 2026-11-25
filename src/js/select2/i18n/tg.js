define(function () {
  // Tajik
  return {
    errorLoading: function () {
      return 'Натиҷаҳо бор карда нашуданд.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      return 'Лутфан ' + overChars + ' аломатро нест кунед';
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      return 'Лутфан боз на кам аз ' + remainingChars + ' аломат ворид кунед';
    },
    loadingMore: function () {
      return 'Натиҷаҳои бештар бор шуда истодаанд…';
    },
    maximumSelected: function (args) {
      return 'Шумо метавонед танҳо ' + args.maximum + ' унсур интихоб кунед';
    },
    noResults: function () {
      return 'Маълумоти мувофиқ ёфт нашуд';
    },
    searching: function () {
      return 'Ҷустуҷӯ шуда истодааст…';
    },
    removeAllItems: function () {
      return 'Хориҷ кардани ҳамаи унсурҳо';
    },
    removeItem: function () {
      return 'Хориҷ кардани унсур';
    },
    search: function () {
      return 'Ҷустуҷӯ';
    }
  };
});
