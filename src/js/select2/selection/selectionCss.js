define([
  '../utils'
], function (Utils) {
  function SelectionCSS () { }

  SelectionCSS.prototype.render = function (decorated) {
    var $selection = decorated.call(this);

    var selectionCssClass = this.options.get('selectionCssClass') || '';

    if (selectionCssClass.indexOf(':all:') !== -1) {
      selectionCssClass = selectionCssClass.replace(':all:', '');

      Utils.copyNonInternalCssClasses($selection[0], this.$element[0]);
    }

    selectionCssClass.trim().split(' ').forEach(function(cssClass) {
      if(cssClass.length > 0) {
        $selection[0].classList.add(cssClass);
      }
    });

    return $selection;
  };

  return SelectionCSS;
});
