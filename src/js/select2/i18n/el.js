define(function () {
  // Greek
  return {
    errorLoading: function () {
      return 'Δεν ήταν δυνατή η φόρτωση των αποτελεσμάτων.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Διαγράψτε ' + overChars + ' χαρακτήρα(-ες)';

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Εισαγάγετε ' + remainingChars + ' ή περισσότερους χαρακτήρες';

      return message;
    },
    loadingMore: function () {
      return 'Φόρτωση περισσότερων αποτελεσμάτων…';
    },
    maximumSelected: function (args) {
      return 'Μπορείτε να επιλέξετε μόνο ' + args.maximum + ' στοιχείο(-α)';
    },
    noResults: function () {
      return 'Δεν βρέθηκαν αποτελέσματα';
    },
    searching: function () {
      return 'Γίνεται αναζήτηση…';
    }
  };
});
