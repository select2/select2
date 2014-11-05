define(function () {
  return {
    inputTooShort: function (args) {
      var message = 'Por favor, introduzca ' + remainingChars + ' car';

      if (remainingChars == 1) {
        message += 'ácter';
      } else {
        message += 'acteres';
      }

      return message;
    },
    loadingMore: function () {
      return 'Cargando más resultados…';
    },
    noResults: function () {
      return 'No se encontraron resultados';
    }
  };
});
