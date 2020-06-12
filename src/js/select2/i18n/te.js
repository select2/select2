define(function() {
    // Telugu
    return {
        errorLoading: function() {
            return 'ఫలితాలు చూపించలేకపోతున్నాము';
        },
        inputTooLong: function(args) {
            var overChars = args.input.length - args.maximum;
            var message = overChars;

            if (overChars != 1) {
                message = message + ' అక్షరాలు తొలిగించండి';
            } else {
                message = message + ' అక్షరం తొలిగించండి';
            }

            return message;
        },
        inputTooShort: function(args) {
            var remainingChars = args.minimum - args.input.length;

            var message = remainingChars + ' లేక మరిన్ని అక్షరాలను జోడించండి';

            return message;
        },
        loadingMore: function() {
            return 'మరిన్ని ఫలితాలు…';
        },
        maximumSelected: function(args) {
            var message = 'మీరు ' + args.maximum;

            if (args.maximum != 1) {
                message += ' అంశాల్ని మాత్రమే ఎంచుకోగలరు';
            } else {
                message += ' అంశాన్ని మాత్రమే ఎంచుకోగలరు';
            }

            return message;
        },
        noResults: function() {
            return 'ఫలితాలు లేవు';
        },
        searching: function() {
            return 'శోధిస్తున్నాము…';
        },
        removeAllItems: function() {
            return 'అన్ని అంశాల్ని తొలిగించండి';
        },
        removeItem: function() {
            return 'తొలిగించు';
        }
    };
});
