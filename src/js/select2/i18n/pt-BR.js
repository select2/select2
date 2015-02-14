define(function () {
  // Brazilian Portuguese
  return {
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Apague ' + overChars + ' caracter';

      if (overChars != 1) {
        message += 'es';
      }

      return message;
    },
    maximumSelected: function (args) {
      var message = 'Você só pode selecionar ' + args.maximum + ' ite';
      message += (args.maximum == 1) ? 'm' : 'ns';

      return message;
    }
  };
});
