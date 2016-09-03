define(function () {
  // Georgian
  return {
    errorLoading: function () {
      return 'სია ცარიელია.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'გთხოვთ წაშალოთ ' + overChars + ' სიმბოლო';

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'ჷთხოვთ აკრიფოთ ' + remainingChars + ' ან მეტი სიმბოლო';

      return message;
    },
    loadingMore: function () {
      return 'შედეგები იტვირთება…';
    },
    maximumSelected: function (args) {
      var message = 'თქვენ შეგიძლიათ მხოლოდ ' + args.maximum + '  ელემენტის არჩევა';

      return message;
    },
    noResults: function () {
      return 'ვერაფერი მოიძებნა';
    },
    searching: function () {
      return 'ძიება...';
    }
  };
});
