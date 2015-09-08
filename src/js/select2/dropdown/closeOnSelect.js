define([

], function () {
  function CloseOnSelect () { }

  CloseOnSelect.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('select', function (evt) {
      self._selectTriggered(evt);
    });

    container.on('unselect', function (evt) {
      self._selectTriggered(evt);
    });
  };

  CloseOnSelect.prototype._selectTriggered = function (_, evt) {
    var originalEvent = evt.originalEvent;

    // Don't close if the control key is being held
    if (originalEvent && originalEvent.ctrlKey) {
      return;
    }

    // Trigger a close *unless* we've been asked to suppress. This is sent by
    // SelectOnClose to prevent an infinite loop between triggers.
    if (! evt.suppressCloseOnSelect) {
      this.trigger('close', {});
    }
  };

  return CloseOnSelect;
});
