define(function () {
  // Hebrew
  return {
    errorLoading: function () {
      return 'התוצאות לא נטענו בהלכה';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'נא למחוק ' + overChars + ' תווים';

      if (overChars != 1) {
        message += 's';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'נא להכניס ' + remainingChars + ' תווים או יותר';

      return message;
    },
    loadingMore: function () {
      return 'טען תוצאות נוספות…';
    },
    maximumSelected: function (args) {
      var message = 'באפשרותך לבחור רק ' + args.maximum + ' פריטים';

      if (args.maximum != 1) {
        message += 's';
      }

      return message;
    },
    noResults: function () {
      return 'לא נמצאו תוצאות';
    },
    searching: function () {
      return 'מחפש…';
    }
  };
});
