define([

], function () {
  function Tags (decorated, $element, options) {
    var tags = options.get('tags');

    decorated.call(this, $element, options);
  }

  Tags.prototype.query = function (decorated, params, callback) {
    var self = this;

    if (params.term == null || params.term === '' || params.page != null) {
      decorated.call(this, params, callback);
      return;
    }

    function wrapper (data, child) {
      for (var i = 0; i < data.length; i++) {
        var option = data[i];

        var checkChildren = (
          option.children != null && !wrapper(option.children, true)
        );

        var checkText = option.text === params.term;

        if (checkText || checkChildren) {
          if (child) {
            return false;
          }

          callback(data);

          return;
        }
      }

      if (child) {
        return true;
      }

      var tag = self.createTag(params);
      tag._tag = true;

      data.unshift(tag);

      callback(data);
    }

    decorated.call(this, params, wrapper);
  };

  Tags.prototype.createTag = function (decorated, params) {
    return {
      id: params.term,
      text: params.term
    };
  };

  return Tags;
});
