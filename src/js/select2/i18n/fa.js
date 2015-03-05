/* jshint -W100 */
/*jslint maxlen: 130 */
define(function () {
  // Farsi (Persian)
  return {
    errorLoading: function () {
      return 'امکان بارگذاری نتایج وجود ندارد.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'لطفاً ' + overChars + ' کاراکتر را حذف نمایید';

      if (overChars != 1) {
        message += 's';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'لطفاً تعداد ' + remainingChars + ' کاراکتر یا بیشتر وارد نمایید';

      return message;
    },
    loadingMore: function () {
      return 'در حال بارگذاری نتایج بیشتر...';
    },
    maximumSelected: function (args) {
      var message = 'شما تنها می‌توانید ' + args.maximum + ' آیتم را انتخاب نمایید';

      if (args.maximum != 1) {
        message += 's';
      }

      return message;
    },
    noResults: function () {
      return 'هیچ نتیجه‌ای یافت نشد';
    },
    searching: function () {
      return 'در حال جستجو...';
    }
  };
});
