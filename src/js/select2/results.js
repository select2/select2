define([
  './utils'
], function (Utils) {
  function Results ($element, dataAdapter) {
    this.$element = $element;
    this.data = dataAdapter;

    Results.__super__.constructor.call(this);
  }

  Utils.Extend(Results, Utils.Observable);

  Results.prototype.render = function () {
    var $results = $(
      '<ul class="options"></ul>'
    );

    this.$results = $results;

    return $results;
  };

  Results.prototype.clear = function () {
    this.$results.empty();
  };

  Results.prototype.append = function (data) {
    var $options = [];

    for (var d = 0; d < data.length; d++) {
      var item = data[d];

      var $option = this.option(item);

      $options.push($option);
    }

    this.$results.append($options);
  };

  Results.prototype.option = function (data) {
    var $option = $(
      '<li class="option"></li>'
    );

    $option.html(data.text);
    $option.data("data", data);

    return $option;
  }

  Results.prototype.bind = function ($container) {
    var self = this;

    this.on("results:all", function (data) {
      self.clear();
      self.append(data);
    });

    this.on("results:append", function (data) {
      self.append(data);
    })

    this.$results.on("click", ".option", function (evt) {
      var data = $(this).data("data");

      self.trigger("selected", {
        originalEvent: evt,
        data: data
      })
    });
  };

  return Results;
})
