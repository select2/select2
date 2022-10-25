define(function () {
    // Luxembourgish
    return {
      errorLoading: function () {
        return 'D\'Resultater konnten net geluede ginn.';
      },
      inputTooLong: function (args) {
        var overChars = args.input.length - args.maximum;
  
        return 'Läscht ' + overChars + ' Schrëftzeechen';
      },
      inputTooShort: function (args) {
        var remainingChars = args.minimum - args.input.length;
  
        return 'Tippt mindestens ' + remainingChars + ' Schrëftzeechen an';
      },
      loadingMore: function () {
        return 'Méi Resultater lueden…';
      },
      maximumSelected: function (args) {
        return 'Dir kennt nëmmen ' + args.maximum + ' Element' +
          ((args.maximum > 1) ? 'er' : '') + ' auswielen';
      },
      noResults: function () {
        return 'Keng Resultater fonnt';
      },
      searching: function () {
        return 'Sichen…';
      },
      removeAllItems: function () {
        return 'All Elementer läschen';
      },
      removeItem: function () {
        return 'Element läschen';
      },
      search: function() {
        return 'Sichen';
      }
    };
  });
  