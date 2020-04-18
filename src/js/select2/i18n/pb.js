define(function () {
  // Punjabi
  return {
    errorLoading: function () {
      return 'ਨਤੀਜੇ ਲੋਡ ਨਹੀਂ ਕੀਤੇ ਜਾ ਸਕਦੇ ।'
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var charCount = (overChars != 1) ? ' ਅੱਖਰਾਂ ਨੂੰ ' : ' ਅੱਖਰ ';

      var message = 'ਕ੍ਰਿਪਾ ਕਰਕੇ ' + overChars + charCount + 'ਮਿਟਾਓ ।';

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var charCount = (remainingChars > 1) ? ' ਅੱਖਰਾਂ ' : ' ਅੱਖਰ ';

      var message = 'ਕ੍ਰਿਪਾ ਕਰਕੇ ' + remainingChars + ' ਜਾਂ ' + remainingChars + ' ਤੋਂ ਵੱਧ' + charCount + 'ਦਾ ਇਸਤੇਮਾਲ ਕਰੋ ।'

      return message;
    },
    loadingMore: function () {
      return 'ਹੋਰ ਨਤੀਜੇ ਲੋਡ ਹੋ ਰਹੇ ਹਨ ...।'
    },
    maximumSelected: function (args) {
      var resultCount = (args.maximum != 1) ? ' ਨਤੀਜੇ ' : ' ਨਤੀਜਾ ';

      var message = 'ਤੁਸੀਂ ਸਿਰਫ਼ ' + args.maximum + resultCount + 'ਚੁਣ ਸਕਦੇ ਹੋ ।';

      return message;
    },
    noResults: function () {
      return 'ਨਤੀਜਾ ਨਹੀਂ ਮਿਲ ਰਿਹਾ ਹੈ ।'
    },
    searching: function () {
      return 'ਖ਼ੋਜ ਕਰ ਰਹੇਂ ਹਾਂ ...।'
    },
    removeAllItems: function () {
      return 'ਸਾਰੇ ਨਤੀਜੇ ਮਿਟਾਓ ।'
    }
  };
});
