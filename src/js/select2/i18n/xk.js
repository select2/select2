define(function () {
    // Kosovo
    return {
        errorLoading: function () {
            return 'Rezultatet nuk mund tГ« ngarkohen.';
        },
        inputTooLong: function (args) {
            var overChars = args.input.length - args.maximum;

            var message = 'Ju lutemi fshini karakterin ' + overChars + ' karaktere';

            if (overChars != 1) {
                message += 't';
            }

            return message;
        },
        inputTooShort: function (args) {
            var remainingChars = args.minimum - args.input.length;

            var message = 'Ju lutemi, shkruani ' + remainingChars + ' ose mГ« shumГ« karaktere';

            return message;
        },
        loadingMore: function () {
            return 'Duke ngarkuar më shumë rezultate…';
        },
        maximumSelected: function (args) {
            var message = 'Mund tГ« zgjidhni vetГ«m artikullin ' + args.maksimum;

            if (args.maximum != 1) {
                message += ' artikuj';
            } else {
                message += ' artikull';
            }

            return message;
        },
        noResults: function () {
            return 'Nuk u gjet asnjГ« rezultat';
        },
        searching: function () {
            return 'Duke kërkuar';
        },
        removeAllItems: function () {
            return 'Hiq tГ« gjithГ« artikujt';
        }
    };
});
