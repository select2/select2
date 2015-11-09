define(function () {
  // Hebrew
  return {
    errorLoading: function () {
      return 'שגיאה בטעינת התוצאות';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;
      
      var message = 'נא למחוק ';
      
      if (overChars != 1) {
        message += overChars + ' תווים';
      } 
      else {
        message += 'תו אחד';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;
      
      var message = 'נא להכניס ';
      
      if (remainingChars != 1) {
        message += remainingChars + ' תווים';
      } 
      else {
        message += 'תו אחד';
      }

      message += ' או יותר';

      return message;
    },
    loadingMore: function () {
      return 'טוען תוצאות נוספות…';
    },
    maximumSelected: function (args) {
      var message = 'באפשרותך לבחור עד ';

      if (args.maximum != 1) {
        message += args.maximum + ' פריטים';
      } 
      else {
        message += 'פריט אחד';
      }

      return message;
    },
    noResults: function () {
      return 'לא נמצאו תוצאות';
    },
    searching: function () {
      return 'מחפש…';
    }
  };
});
