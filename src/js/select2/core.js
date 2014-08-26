define([
    "jquery",
    "./options",
    "./utils"
], function ($, Options, Utils) {
  var Select2 = function (element, options) {
    this.element = element;
    this.options = new Options(options);

    this.adapter = new this.options.DataAdapter(element, options);
  };

  Utils.Extend(Select2, Utils.Observable);

  return Select2;
});
