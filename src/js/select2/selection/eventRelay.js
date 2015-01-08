define([
  'jquery'
], function ($) {
  function EventRelay () { }

  EventRelay.prototype.bind = function (decorated, container, $container) {
    var self = this;
    var relayEvents = ['open', 'close'];

    decorated.call(this, container, $container);

    container.on('*', function (name, params) {
      if (relayEvents.indexOf(name) === -1) {
        return;
      }

      var evt = $.Event('select2:' + name, params);

      self.$element.trigger(evt);
    });
  };

  return EventRelay;
});
