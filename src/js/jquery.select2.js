define([
  'jquery',
  'select2/core'
], function ($, Select2) {
  if ($.fn.select2 == null) {
    $.fn.select2 = function (options) {
      options = options || {};

      if (typeof options === 'object') {
        this.each(function () {
          var instance = new Select2($(this), options);
        });
      } else if (typeof options === 'string') {
        var instance = this.data('select2');
        var args = Array.prototype.slice.call(arguments, 1);

        instance[options](args);
      } else {
        throw new Error('Invalid arguments for Select2: ' + options);
      }
    };
  }

  return Select2;
});
