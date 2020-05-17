define(function () {
    // Telugu
    return {
        errorLoading: function () {
            return 'ఫలితాలు చూపించలేకపోతున్నాము';
        },
        inputTooLong: function (args) {
            var overChars = args.input.length - args.maximum;

            if (overChars != 1) {
                var message = overChars + ' అక్షరాలు తొలిగించండి';
            } else {
                var message = overChars + ' అక్షరం తొలిగించండి';
            }

            return message;
        },
        inputTooShort: function (args) {
            var remainingChars = args.minimum - args.input.length;

            var message = remainingChars + ' లేక మరిన్ని అక్షరాలను జోడించండి';

            return message;
        },
        loadingMore: function () {
            return 'మరిన్ని ఫలితాలు…';
        },
        maximumSelected: function (args) {

            if (args.maximum != 1) {
                var message = 'మీరు ' + args.maximum + ' అంశాల్ని మాత్రమే ఎంచుకోగలరు';
            } else {
                var message = 'మీరు ' + args.maximum + ' అంశాన్ని మాత్రమే ఎంచుకోగలరు';
            }

            return message;
        },
        noResults: function () {
            return 'ఫలితాలు లేవు';
        },
        searching: function () {
            return 'శోధిస్తున్నాము…';
        },
        removeAllItems: function () {
            return 'అన్ని అంశాల్ని తొలిగించండి';
        },
        removeItem: function () {
            return 'తొలిగించు';
        }
    };
});
