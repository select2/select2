define([

], function () {
  function SelectOnClose () { }

  SelectOnClose.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('close', function (evt) {
      self._handleSelectOnClose(evt);
    });
  };

  SelectOnClose.prototype._handleSelectOnClose = function (evt) {
    var self = this;

    var $highlightedResults = this.getHighlightedResults();

    if ($highlightedResults.length < 1) {
      return;
    }

    self.trigger('select', {
        originalEvent: evt,
        data: $highlightedResults.data('data')
    });
  };

  return SelectOnClose;
});
