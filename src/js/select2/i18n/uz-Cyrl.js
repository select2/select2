define(function () {
    // English
    return {
      errorLoading: function () {
        return 'Маълумотларни юклаб бўлмади.';
      },
      inputTooLong: function (args) {
        var overChars = args.input.length - args.maximum;
  
        return 'Илтимос, ортиқча ' + overChars + ' та белгини ўчиринг.';
      },
      inputTooShort: function (args) {
        var remainingChars = args.minimum - args.input.length;
  
        return 'Илтимос, ' + remainingChars + ' та ёки ко\ъпроқ белги киритинг.';
      },
      loadingMore: function () {
        return 'Кўпроқ маълумотлар юкланмоқда';
      },
      maximumSelected: function (args) {
        var message = 'Сиз фақат ' + args.maximum + ' та элементни танлашингиз мумкин.';

        return message;
      },
      noResults: function () {
        return 'Маълумот топилмади.';
      },
      searching: function () {
        return 'Қидирмоқда...';
      },
      removeAllItems: function () {
        return 'Барчасини олиб ташлаш';
      },
      removeItem: function () {
        return 'Олиб ташлаш';
      },
      search: function() {
        return 'Қидириш';
      }
    };
  });
  