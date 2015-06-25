define(function () {
    // Japanese
    return {
        errorLoading: function () {
            return '結果は読み込めませんでした';
        },
        inputTooLong: function (args) {
            var overChars = args.input.length - args.maximum;

            var message = overChars + '文字を削除してください。';

            if (overChars != 1) {
                message += 's';
            }

            return message;
        },
        inputTooShort: function (args) {
            var remainingChars = args.minimum - args.input.length;

            var message = remainingChars + '文字以上を入力してください。';

            return message;
        },
        loadingMore: function () {
            return 'より多くの結果を読み込んでいます...';
        },
        maximumSelected: function (args) {
            var message = args.maximum + '個しか選択できません';

            return message;
        },
        noResults: function () {
            return '結果が見つかりませんでした';
        },
        searching: function () {
            return '検索中…';
        }
    };
});