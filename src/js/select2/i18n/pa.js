define(function () {
  // Punjabi
  return {
    errorLoading: function () {
      return 'ਨਤੀਜੇ ਲੋਡ ਨਹੀਂ ਕੀਤੇ ਜਾ ਸਕਦੇ ।';
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

      /**
      * @param {string} messageX [X:A-Z]
      * @description: Sentence splitted into sub-parts
      */
      var subPartA = 'ਕ੍ਰਿਪਾ ਕਰਕੇ ';
      var subPartB = remainingChars + ' ਜਾਂ ' + remainingChars;
      var subPartC = ' ਤੋਂ ਵੱਧ' + charCount +'ਦੀ ਵਰਤੋਂ ਕਰੋ ।';

      var message = subPartA + subPartB + subPartC;

      return message;
    },
    loadingMore: function () {
      return 'ਹੋਰ ਨਤੀਜੇ ਲੋਡ ਹੋ ਰਹੇ ਹਨ ...।';
    },
    maximumSelected: function (args) {
      var message = 'ਤੁਸੀਂ ਸਿਰਫ਼ ' + args.maximum + ' ਨਤੀਜਾ ਚੁਣ ਸਕਦੇ ਹੋ ।';

      if(args.maximum != 1) {
        message = 'ਤੁਸੀਂ ਸਿਰਫ਼ ' + args.maximum + ' ਨਤੀਜੇ ਚੁਣ ਸਕਦੇ ਹੋ ।';
      }

      return message;
    },
    noResults: function () {
      return 'ਨਤੀਜਾ ਨਹੀਂ ਮਿਲ ਰਿਹਾ ਹੈ ।';
    },
    searching: function () {
      return 'ਖ਼ੋਜ ਕਰ ਰਹੇਂ ਹਾਂ ...।';
    },
    removeAllItems: function () {
      return 'ਸਾਰੇ ਨਤੀਜੇ ਮਿਟਾਓ ।';
    }
  };
});
