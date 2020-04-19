define([
  'jquery',
  '../utils'
], function ($, Utils) {
  function SelectionCSS () { }

  SelectionCSS.prototype.render = function (decorated) {
    var $selection = decorated.call(this);

    var selectionCssClass = this.options.get('selectionCssClass') || '';

    if (selectionCssClass.indexOf(':all:') !== -1) {
      selectionCssClass = selectionCssClass.replace(':all:', '');

      selectionCssAdapter = function (clazz) {
        return clazz;
      };
    }

    Utils.syncCssClasses($selection, this.$element, selectionCssAdapter);

    $selection.addClass(selectionCssClass);

    return $selection;
  };

  return SelectionCSS;
});
