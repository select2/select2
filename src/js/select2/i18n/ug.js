define(function () {
    // Uyghur (Uighur)
    return {
      errorLoading: function () {
        return 'نەتىجىنى يۈكلىيەلمىدى.';
      },
      inputTooLong: function (args) {
        var overChars = args.input.length - args.maximum;
  
        var message = overChars + ' ھەرپ-بەلگىنى ئۆچۈرۈۋېتىڭ.';
  
        return message;
      },
      inputTooShort: function (args) {
        var remainingChars = args.minimum - args.input.length;
  
        var message = 'كەم دېگەندە ' + remainingChars + ' ھەرپ-بەلگە كىرگۈزۈڭ.';
  
        return message;
      },
      loadingMore: function () {
        return 'تېخىمۇ كۆپ نەتىجىلەرنى يۈكلەۋاتىدۇ...';
      },
      maximumSelected: function (args) {
        var message = 'پەقەت ' + args.maximum + ' ئەزانى تاللىيالايسىز';

        return message;
      },
      noResults: function () {
        return 'ھېچقانداق نەتىجە تېپىلمىدى';
      },
      searching: function () {
        return 'ئىزدەۋاتىدۇ...';
      },
      removeAllItems: function () {
        return 'ھەممە ئەزانى ئۆچۈرۈش';
      },
      removeItem: function () {
        return 'ئەزا ئۆچۈرۈش';
      },
      search: function() {
        return 'ئىزدەش';
      }
    };
  });
