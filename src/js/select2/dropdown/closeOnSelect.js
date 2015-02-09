define([

], function () {
  function CloseOnSelect () { }

  CloseOnSelect.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('select', function (evt) {
      var originalEvent = evt.originalEvent;

      // Don't close if the control key is being held
      if (originalEvent && originalEvent.ctrlKey) {
        return;
      }

      self.trigger('close');
    });
  };

  return CloseOnSelect;
});
