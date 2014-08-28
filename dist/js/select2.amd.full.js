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
    var slice = Array.prototype.slice;

    if (event in this.listeners) {
      this.invoke(this.listeners[event], slice.call(arguments, 1));
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
  '../utils',
  'jquery'
], function (Utils, $) {
  function SelectAdapter ($element, options) {
    this.$element = $element;

    SelectAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(SelectAdapter, Utils.Observable);

  SelectAdapter.prototype.current = function (callback) {
    var data = [];
    var self = this;

    this.$element.find(":selected").each(function () {
      var $option = $(this);

      var option = self.item($option);

      data.push(option);
    });

    callback(data);
  };

  SelectAdapter.prototype.select = function (data) {
    var val;

    if (this.$element.prop("multiple")) {
      var currentData = this.current();

      data = [data];
      data.push(currentData);

      val = [];

      for (var d = 0; d < data.length; d++) {
        id = data[d].id;

        if (ids.indexOf(id) === -1) {
          val.push(id);
        }
      }
    } else {
      val = data.id;
    }

    this.$element.val(val);
    this.$element.trigger("change");
  }

  SelectAdapter.prototype.query = function (params, callback) {
    var data = [];
    var self = this;

    this.$element.find("option").each(function () {
      var $option = $(this);

      var option = self.item($option);

      if (self.matches(params, option)) {
        data.push(option);
      }
    });

    callback(data);
  };

  SelectAdapter.prototype.item = function ($option) {
    var data = {
      id: $option.val(),
      text: $option.html()
    };

    return data;
  };

  SelectAdapter.prototype.matches = function (params, data) {
    if ($.trim(params.term) == "") {
      return true;
    }

    if (data.text.indexOf(params.term) > -1) {
      return true;
    }

    return false;
  }

  return SelectAdapter;
});

define('select2/results',[
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
      '<span class="">' +
        '<span class="results"></span>' +
      '</span>'
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

    Selection.__super__.constructor.call(this);
  }

  Utils.Extend(Selection, Utils.Observable);

  Selection.prototype.render = function () {
    var $selection = $(
      '<span class="single-select">' +
        '<span class="rendered-selection"></span>' +
      '</span>'
    );

    this.$selection = $selection;

    return $selection;
  }

  Selection.prototype.bind = function ($container) {
    var self = this;

    this.$selection.on('click', function (evt) {
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

    Select2.__super__.constructor.call(this);

    // Set up containers and adapters

    this.data = new this.options.dataAdapter($element, options);

    var $container = this.render();

    $container.insertAfter(this.$element);

    $container.width($element.width());

    this.selection = new this.options.selectionAdapter($element, options);

    var $selectionContainer = $container.find(".selection");
    var $selection = this.selection.render();

    $selectionContainer.append($selection);

    this.dropdown = new this.options.dropdownAdapter($element, options);

    var $dropdownContainer = $container.find(".dropdown");
    var $dropdown = this.dropdown.render();

    $dropdownContainer.append($dropdown);

    this.results = new this.options.resultsAdapter($element, options);

    var $resultsContainer = $dropdown.find(".results");
    var $results = this.results.render();

    $resultsContainer.append($results);

    // Bind events

    var self = this;

    this.selection.bind($container);
    this.results.bind($container);

    this.$element.on("change", function () {
      self.data.current(function (data) {
        self.selection.update(data);
      });
    });

    this.selection.on("toggle", function () {
      $container.toggleClass("open");
    });

    this.results.on("selected", function (params) {
      self.data.select(params.data);
      $container.removeClass("open");
    });

    // Set the initial state

    this.data.current(function (initialData) {
      self.selection.update(initialData);
    });

    this.data.query({}, function (data) {
      self.results.trigger("results:all", data);
    });
  };

  Utils.Extend(Select2, Utils.Observable);

  Select2.prototype.render = function () {
    var $container = $(
      '<span class="select2 select2-container">' +
        '<span class="selection"></span>' +
        '<span class="dropdown"></span>' +
      '</span>'
    );

    return $container;
  };

  return Select2;
});

