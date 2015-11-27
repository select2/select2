define([

], function () {
  function SelectOnClose () { }

  SelectOnClose.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('close', function () {
      self._handleSelectOnClose();
    });
  };

  SelectOnClose.prototype._handleSelectOnClose = function () {
    var $highlightedResults = this.getHighlightedResults();

    if ($highlightedResults.length < 1) {
      return;
    }

    this.trigger('select', {
      data: $highlightedResults.data('data'),
      // Don't want CloseOnSelect to fire if we're already closing
      // because it causes an infinte loop.
      suppressCloseOnSelect: true
    });
  };

  return SelectOnClose;
});
