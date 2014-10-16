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
      var selectedIds = $.map(selected, function (s) {
        return s.id.toString();
      });

      self.$results.find('.option.selected').removeClass('selected');

      var $options = self.$results.find('.option');

      $options.each(function () {
        var $option = $(this);
        var item = $option.data('data');

        if (item.id != null && selectedIds.indexOf(item.id.toString()) > -1) {
          $option.addClass('selected');
        }
      });
    });
  };

  Results.prototype.option = function (data) {
    var $option = $(
      '<li class="option highlightable selectable"></li>'
    );

    if (data.children) {
      $option.addClass('group').removeClass('highlightable selectable');

      var $label = $('<strong class="group-label"></strong>');
      $label.html(data.text);

      var $children = [];

      for (var c = 0; c < data.children.length; c++) {
        var child = data.children[c];

        var $child = this.option(child);

        $children.push($child);
      }

      var $childrenContainer = $('<ul class="options nested-options"></ul>');

      $childrenContainer.append($children);

      $option.append($label);
      $option.append($childrenContainer);
    } else {
      $option.html(data.text);
    }

    if (data.disabled) {
      $option.removeClass('selectable highlightable').addClass('disabled');
    }

    if (data.id == null) {
      $option.removeClass('selectable highlightable');
    }

    $option.data('data', data);

    return $option;
  };

  Results.prototype.bind = function (container, $container) {
    var self = this;

    this.on('results:all', function (data) {
      self.clear();
      self.append(data);

      self.setClasses();
    });

    this.on('results:append', function (data) {
      self.append(data);

      self.setClasses();
    });

    this.$results.on('mouseup', '.option.selectable', function (evt) {
      var $this = $(this);

      var data = $this.data('data');
      if ($this.hasClass('selected')) {
        self.trigger('unselected', {
          originalEvent: evt,
          data: data
        });

        self.setClasses();

        return;
      }

      self.trigger('selected', {
        originalEvent: evt,
        data: data
      });

      self.setClasses();
    });

    this.$results.on('mouseenter', '.option.highlightable', function (evt) {
      self.$results.find('.option.highlighted').removeClass('highlighted');
      $(this).addClass('highlighted');
    });

    this.$results.on('mouseleave', '.option', function (evt) {
      $(this).removeClass('highlighted');
    });
  };

  return Results;
});
