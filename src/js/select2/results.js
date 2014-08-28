define([
  './utils'
], function (Utils) {
  function Results ($element, options, dataAdapter) {
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

  Results.prototype.setClasses = function () {
    var self = this;

    this.data.current(function (selected) {
      selected = $.map(selected, function (s) { return s.id; });

      self.$results.find(".option.selected").removeClass("selected");

      var $options = self.$results.find(".option");

      console.log($options);

      $options.each(function () {
        var $option = $(this);
        var item = $option.data("data");

        if (selected.indexOf(item.id) > -1) {
          $option.addClass("selected");
        }
      });
    });
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
      self.setClasses();
    });

    this.on("results:append", function (data) {
      self.append(data);

      self.setClasses();
    })

    this.$results.on("click", ".option", function (evt) {
      var data = $(this).data("data");

      self.trigger("selected", {
        originalEvent: evt,
        data: data
      });

      self.setClasses();
    });

    this.$results.on("mouseenter", ".option", function (evt) {
      self.$results.find(".option.hovered").removeClass("hovered");
      $(this).addClass("hovered");
    });

    this.$results.on("mouseleave", ".option", function (evt) {
      $(this).removeClass("hovered");
    });
  };

  return Results;
})
