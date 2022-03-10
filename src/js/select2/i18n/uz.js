define(function () {
    // Uzbek
    return {
        errorLoading: function () {
            return "Natijalarni yuklab bo'lmadi.";
        },
        inputTooLong: function (args) {
            var overChars = args.input.length - args.maximum;

            var message = overChars + ' belgi kamroq kiriting';

            if (overChars != 1) {
                message += 's';
            }

            return message;
        },
        inputTooShort: function (args) {
            var remainingChars = args.minimum - args.input.length;

            var message = remainingChars + " belgi ko'proq kiriting";

            return message;
        },
        loadingMore: function () {
            return 'Natijalar yuklanmoqda…';
        },
        maximumSelected: function (args) {
            var message = 'Siz faqat ' + args.maximum + ' ta element tanlay olasiz';

            return message;
        },
        noResults: function () {
            return 'Hech qanday natija topilmadi';
        },
        searching: function () {
            return 'Qidirilmoqda…';
        },
        removeAllItems: function () {
            return 'Barcha elementlarni olib tashlang';
        },
        removeItem: function () {
            return 'Elementni olib tashlash';
        },
        search: function () {
            return 'Qidirmoq';
        }
    };
});
