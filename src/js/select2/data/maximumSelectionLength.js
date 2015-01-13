define([

], function (){
  function MaximumSelectionLength (decorated, $e, options) {
    this.maximumSelectionLength = options.get('maximumSelectionLength');

    decorated.call(this, $e, options);
  }

  MaximumSelectionLength.prototype.query =
    function (decorated, params, callback) {

    var count = this.current() != null ? this.current().length : 0;
    if (count >= this.maximumSelectionLength) {
      this.trigger('results:message', {
        message: 'maximumSelected',
        args: {
          maximum: this.maximumSelectionLength
        }
      });

      return;
    }

    decorated.call(this, params, callback);
  };

  return MaximumSelectionLength;
});
