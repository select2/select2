define([
  'jquery'
], function ($) {
  function EventRelay () { }

  EventRelay.prototype.bind = function (decorated, container, $container) {
    var self = this;
    var relayEvents = [
      'open', 'opening',
      'close', 'closing',
      'select', 'selecting',
      'unselect', 'unselecting',
      'clear', 'clearing'
    ];

    var preventableEvents = [
      'opening', 'closing', 'selecting', 'unselecting', 'clearing'
    ];

    decorated.call(this, container, $container);

    container.on('*', function (name, params) {
      // Ignore events that should not be relayed
      if ($.inArray(name, relayEvents) === -1) {
        return;
      }

      // The parameters should always be an object
      params = params || {};

      // Generate the jQuery event for the Select2 event
      var evt = $.Event('select2:' + name, {
        params: params
      });

      self.$element.trigger(evt);

      // Only handle preventable events if it was one
      if ($.inArray(name, preventableEvents) === -1) {
        return;
      }

      params.prevented = evt.isDefaultPrevented();

      /*
       * Display the corresponding message when maximumSelectionLength is
       * reached. This will prevent the user from adding too many items by
       * holding the ctrl key or when closeOnSelect is false.
       * This fixes #3514 and #3860.
       */
      var maximumSelectionLength = self.options.get('maximumSelectionLength');
      var values = self.$element.val() || [];
  
      if (!params.prevented && name === 'selecting' &&
        maximumSelectionLength > 0 &&
        values.length+1 >= maximumSelectionLength) {
          self.trigger('results:message', {
            message: 'maximumSelected',
            args: {
              maximum: maximumSelectionLength
            }
        });
      }
    });
  };

  return EventRelay;
});
