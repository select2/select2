define([

], function () {
  function OldMatcher (decorated, $element, options) {
    decorated.call(this, $element, options);

    this.matcher = options.get('matcher');
  }

  OldMatcher.prototype.matches = function (decorated, params, data) {
    // If there is no custom matcher, call the original matcher function
    if (this.matcher == null) {
      return decorated.call(params, data);
    }

    var match = $.extend(true, {}, data);

    if (data.children) {
      for (var c = data.children.length - 1; c >= 0; c--) {
        var child = data.children[c];

        // Check if the child object matches
        // The old matcher returned a boolean true or false
        var doesMatch = this.matcher(params.term, child.text);

        // If the child didn't match, pop it off
        if (!doesMatch) {
          match.children.splice(c, 1);
        }
      }

      if (match.children.length > 0) {
        return match;
      }
    }

    if ($.trim(params.term) === '') {
      return match;
    }

    if (this.matcher(params.term, data.text)) {
      return match;
    }

    return null;
  };
});
