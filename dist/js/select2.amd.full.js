define('select2/utils',[], function () {
  var Utils = {};

  Utils.Extend = function (ChildClass, SuperClass) {
    var __hasProp = {}.hasOwnProperty

    function BaseConstructor () {
      this.constructor = ChildClass;
    }

    for (var key in SuperClass) {
      if (__hasProp.call(SuperClass, key)) {
        ChildClass[key] = SuperClass[key];
      }
    }

    BaseConstructor.prototype = SuperClass.prototype;
    ChildClass.prototype = new BaseConstructor();
    ChildClass.__super__ = SuperClass.prototype;

    return ChildClass;
  };

  var Observable = function () {
    this.listeners = {};
  };

  Observable.prototype.on = function (event, callback) {
    if (event in this.listeners) {
      this.listeners[event].push(callback);
    } else {
      this.listeners[event] = [callback];
    }
  };

  Observable.prototype.trigger = function (event) {
    if (event in this.listeners) {
      this.invoke(this.listeners[event], util.shift(arguments));
    }

    if ("*" in this.listeners) {
      this.invoke(this.listeners["*"], arguments);
    }
  };

  Observable.prototype.invoke = function (listeners, params) {
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i].apply(this, params);
    }
  };

  Utils.Observable = Observable;

  return Utils;
});

define('select2/data/select',[
  '../utils'
], function (Utils) {
  function SelectAdapter ($element, options) {
    this.$element = $element;
  }

  Utils.Extend(SelectAdapter, Utils.Observable);

  SelectAdapter.prototype.current = function () {
    var data = [];
    var self = this;

    this.$element.find(":selected").each(function () {
      var $option = $(this);

      var option = self.item($option);

      data.push(option);
    });

    return data;
  };

  SelectAdapter.prototype.item = function ($option) {
    var data = {
      id: $option.val(),
      text: $option.html()
    };

    return data;
  };

  return SelectAdapter;
});

define('select2/results',[
  './utils'
], function (Utils) {
  function Results ($element, dataAdapter) {
    this.$element = $element;
    this.dataAdapter = dataAdapter;
  }

  Utils.Extend(Results, Utils.Observable);

  Results.prototype.render = function () {
    var $results = $(
      '<ul class="options"></ul>'
    );

    return $results;
  }

  return Results;
})
;
define('select2/dropdown',[
  './utils'
], function (Utils) {
  function Dropdown ($element, options) {
    this.$element = $element;
  }

  Utils.Extend(Dropdown, Utils.Observable);

  Dropdown.prototype.render = function () {
    var $dropdown = $(
      '<div class="select2 select2-dropdown">' +
        '<div class="results"></div>' +
      '</div>'
    );

    return $dropdown;
  }

  return Dropdown;
})
;
define('select2/selection',[
  './utils'
], function (Utils) {
  function Selection ($element, options) {
    this.$element = $element;
    this.options = options;
  }

  Utils.Extend(Selection, Utils.Observable);

  Selection.prototype.render = function () {
    var $selection = $(
      '<div class="single-select">' +
        '<div class="rendered-selection"></div>' +
      '</div>'
    );

    this.$selection = $selection;

    return $selection;
  }

  Selection.prototype.bind = function ($container) {
    var self = this;

    $container.on('click', function (evt) {
      self.trigger("toggle", {
        originalEvent: evt
      });
    });
  }

  Selection.prototype.clear = function () {
    this.$selection.find(".rendered-selection").text("");
  }

  Selection.prototype.display = function (data) {
    return data.text;
  }

  Selection.prototype.update = function (data) {
    if (data.length == 0) {
      this.clear();
      return;
    }

    var selection = data[0];

    var formatted = this.display(selection);

    this.$selection.find(".rendered-selection").html(formatted);
  }

  return Selection;
});

define('select2/options',[
  './data/select',
  './results',
  './dropdown',
  './selection'
], function (SelectData, ResultsList, Dropdown, Selection) {
  function Options (options) {
    this.options = options;

    this.dataAdapter = SelectData;
    this.resultsAdapter = ResultsList;
    this.dropdownAdapter = Dropdown;
    this.selectionAdapter = Selection;
  }

  return Options;
})
;
define('select2/core',[
  'jquery',
  './options',
  './utils'
], function ($, Options, Utils) {
  var Select2 = function ($element, options) {
    this.$element = $element;
    this.options = new Options(options);

    // Set up containers and adapters

    this.data = new this.options.dataAdapter($element, options);

    var $container = this.render();

    $container.insertAfter(this.$element);

    this.selection = new this.options.selectionAdapter($element, options);

    var $selectionContainer = $container.find(".selection");
    var $selection = this.selection.render();

    $selectionContainer.append($selection);

    this.dropdown = new this.options.dropdownAdapter($element, options);

    var $dropdown = this.dropdown.render();

    $dropdown.insertAfter($container);

    this.results = new this.options.resultsAdapter($element, options);

    var $resultsContainer = $dropdown.find(".results");
    var $results = this.results.render();

    $resultsContainer.append($results);

    // Set the initial state

    var initialData = this.data.current();

    this.selection.update(initialData);

    var self = this;

    this.$element.on("change", function () {
      self.selection.update(self.data.current());
    })
  };

  Utils.Extend(Select2, Utils.Observable);

  Select2.prototype.render = function () {
    var $container = $(
      '<div class="select2 select2-container">' +
        '<div class="selection"></div>' +
      '</div>'
    );

    return $container;
  };

  return Select2;
});

