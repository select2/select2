define([
  'jquery',
  '../utils'
], function ($, Utils) {
  function DropdownCSS () { }

  DropdownCSS.prototype.render = function (decorated) {
    var $dropdown = decorated.call(this);

    var dropdownCssClass = this.options.get('dropdownCssClass') || '';

    if (dropdownCssClass.indexOf(':all:') !== -1) {
      dropdownCssClass = dropdownCssClass.replace(':all:', '');

      dropdownCssAdapter = function (clazz) {
        return clazz;
      };
    }

    Utils.copyNonInternalCssClasses($dropdown, this.$element);

    $dropdown.addClass(dropdownCssClass);

    return $dropdown;
  };

  return DropdownCSS;
});
