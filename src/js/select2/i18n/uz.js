define(function () {
    // English
    return {
      errorLoading: function () {
        return 'Ma\'lumotlarni yuklab bo\'lmadi.';
      },
      inputTooLong: function (args) {
        var overChars = args.input.length - args.maximum;
  
        var message = 'Iltimos, ortiqcha ' + overChars + ' ta belgini o\'chiring.';
  
        return message;
      },
      inputTooShort: function (args) {
        var remainingChars = args.minimum - args.input.length;
  
        var message = 'Iltimos, ' + remainingChars + ' ta yoki ko\'proq belgi kiriting.';
  
        return message;
      },
      loadingMore: function () {
        return 'Ko\'proq ma\'lumotlar yuklanmoqda';
      },
      maximumSelected: function (args) {
        var message = 'Siz faqat ' + args.maximum + ' ta elementni tanlashingiz mumkin.';
  
        return message;
      },
      noResults: function () {
        return 'Ma\'lumot topilmadi.';
      },
      searching: function () {
        return 'Qidirmoqda...';
      },
      removeAllItems: function () {
        return 'Barchasini olib tashlash';
      },
      removeItem: function () {
        return 'Olib tashlash';
      },
      search: function() {
        return 'Qidirish';
      }
    };
  });
  