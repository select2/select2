define(function () {
  function ending (count, one, couple, more) {
    if (n % 10 < 5 && n % 10 > 0 && n % 100 < 5 || n % 100 > 20) {
      if (n % 10 > 1) {
        return couple;
      }
    } else {
      return more;
    }

    return one;
  }

  return {
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Пожалуйста, введите еще хотя бы ' + overChars + ' символ';

      message += ending(overChars, '', 'a', 'ов');

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Пожалуйста, введите на ' + remainingChars + ' символ';

      message += ending(overChars, '', 'a', 'ов');

      return message;
    },
    loadingMore: function () {
      return 'Загрузка данных…';
    },
    maximumSelected: function (args) {
      var message = 'Вы можете выбрать не более ' + args.maximum + ' элемент';

      message += ending(overChars, '', 'a', 'ов');

      return message;
    },
    noResults: function () {
      return 'Совпадений не найдено';
    },
    searching: function () {
      return 'SПоиск…';
    }
  };
});
