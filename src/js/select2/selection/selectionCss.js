define([
  'jquery',
  '../utils'
], function ($, Utils) {
  // No-op CSS adapter that discards all classes by default
  function _selectionAdapter (clazz) {
    return null;
  }

  function SelectionCSS () { }

  SelectionCSS.prototype.render = function (decorated) {
    var $container = decorated.call(this);

    var selectionCssClass = this.options.get('selectionCssClass') || '';

    var selectionCssAdapter = _selectionAdapter;

    if (selectionCssClass.indexOf(':all:') !== -1) {
      selectionCssClass = selectionCssClass.replace(':all:', '');

      var _cssAdapter = selectionCssAdapter;

      selectionCssAdapter = function (clazz) {
        var adapted = _cssAdapter(clazz);

        if (adapted != null) {
          // Append the old one along with the adapted one
          return adapted + ' ' + clazz;
        }

        return clazz;
      };
    }

    Utils.syncCssClasses($container, this.$element, selectionCssAdapter);

    $container.addClass(selectionCssClass);

    return $container;
  };

  return SelectionCSS;
});
