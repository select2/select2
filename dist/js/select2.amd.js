define('select2/utils',[], function () {
  var Utils = {};

  Utils.Extend = function (ChildClass, SuperClass) {
    var __hasProp = {}.hasOwnProperty;

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

  function getMethods (theClass) {
    var proto = theClass.prototype;

    var methods = [];

    for (var methodName in proto) {
      var m = proto[methodName];

      if (typeof m !== 'function') {
        continue;
      }

      methods.push(methodName);
    }

    return methods;
  }

  Utils.Decorate = function (SuperClass, DecoratorClass) {
    var decoratedMethods = getMethods(DecoratorClass);
    var superMethods = getMethods(SuperClass);

    function DecoratedClass () {
      var unshift = Array.prototype.unshift;

      var argCount = DecoratorClass.prototype.constructor.length;

      var calledConstructor = SuperClass.prototype.constructor;

      if (argCount > 0) {
        unshift.call(arguments, SuperClass.prototype.constructor);

        calledConstructor = DecoratorClass.prototype.constructor;
      }

      calledConstructor.apply(this, arguments);
    }

    DecoratorClass.displayName = SuperClass.displayName;

    function ctr () {
      this.constructor = DecoratedClass;
    }

    DecoratedClass.prototype = new ctr();

    for (var m = 0; m < superMethods.length; m++) {
        var superMethod = superMethods[m];

        DecoratedClass.prototype[superMethod] =
          SuperClass.prototype[superMethod];
    }

    var calledMethod = function (methodName) {
      // Stub out the original method if it's not decorating an actual method
      var originalMethod = function () {};

      if (methodName in DecoratedClass.prototype) {
        originalMethod = DecoratedClass.prototype[methodName];
      }

      var decoratedMethod = DecoratorClass.prototype[methodName];

      return function () {
        var unshift = Array.prototype.unshift;

        unshift.call(arguments, originalMethod);

        return decoratedMethod.apply(this, arguments);
      };
    };

    for (var d = 0; d < decoratedMethods.length; d++) {
      var decoratedMethod = decoratedMethods[d];

      DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
    }

    return DecoratedClass;
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

    if ('*' in this.listeners) {
      this.invoke(this.listeners['*'], arguments);
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

define('select2/results',[
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

    data = this.sort(data);

    for (var d = 0; d < data.length; d++) {
      var item = data[d];

      var $option = this.option(item);

      $options.push($option);
    }

    this.$results.append($options);
  };

  Results.prototype.sort = function (data) {
    return data;
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

    container.on('results:all', function (params) {
      self.clear();
      self.append(params.data);

      self.setClasses();
    });

    container.on('results:append', function (params) {
      self.append(params.data);

      self.setClasses();
    });

    container.on('select', function () {
      self.setClasses();
    });

    container.on('unselect', function () {
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

        return;
      }

      self.trigger('selected', {
        originalEvent: evt,
        data: data
      });
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

define('select2/selection/base',[
  '../utils'
], function (Utils) {
  function BaseSelection ($element, options) {
    this.$element = $element;
    this.options = options;

    BaseSelection.__super__.constructor.call(this);
  }

  Utils.Extend(BaseSelection, Utils.Observable);

  BaseSelection.prototype.render = function () {
    throw new Error('The `render` method must be defined in child classes.');
  };

  BaseSelection.prototype.bind = function (container, $container) {
    var self = this;

    container.on('selection:update', function (params) {
      self.update(params.data);
    });
  };

  BaseSelection.prototype.update = function (data) {
    throw new Error('The `update` method must be defined in child classes.');
  };

  return BaseSelection;
});

define('select2/selection/single',[
  './base',
  '../utils'
], function (BaseSelection, Utils) {
  function SingleSelection () {
    SingleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(SingleSelection, BaseSelection);

  SingleSelection.prototype.render = function () {
    var $selection = $(
      '<span class="single-select">' +
        '<span class="rendered-selection"></span>' +
      '</span>'
    );

    this.$selection = $selection;

    return $selection;
  };

  SingleSelection.prototype.bind = function (container, $container) {
    var self = this;

    SingleSelection.__super__.bind.apply(this, arguments);

    this.$selection.on('mousedown', function (evt) {
      // Only respond to left clicks
      if (evt.which !== 1) {
        return;
      }

      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });
  };

  SingleSelection.prototype.clear = function () {
    this.$selection.find('.rendered-selection').empty();
  };

  SingleSelection.prototype.display = function (data) {
    return data.text;
  };

  SingleSelection.prototype.selectionContainer = function () {
    return $('<span></span>');
  };

  SingleSelection.prototype.update = function (data) {
    if (data.length === 0) {
      this.clear();
      return;
    }

    var selection = data[0];

    var formatted = this.display(selection);

    this.$selection.find('.rendered-selection').html(formatted);
  };

  return SingleSelection;
});

define('select2/selection/multiple',[
  './base',
  '../utils'
], function (BaseSelection, Utils) {
  function MultipleSelection ($element, options) {
    this.$element = $element;
    this.options = options;

    MultipleSelection.__super__.constructor.call(this);
  }

  Utils.Extend(MultipleSelection, BaseSelection);

  MultipleSelection.prototype.render = function () {
    var $selection = $(
      '<span class="multiple-select">' +
        '<ul class="rendered-selection"></ul>' +
      '</span>'
    );

    this.$selection = $selection;

    return $selection;
  };

  MultipleSelection.prototype.bind = function (container, $container) {
    var self = this;

    MultipleSelection.__super__.bind.apply(this, arguments);

    this.$selection.on('click', function (evt) {
      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on('click', '.remove', function (evt) {
      var $remove = $(this);
      var $selection = $remove.parent();

      var data = $selection.data('data');

      self.trigger('unselected', {
        originalEvent: evt,
        data: data
      });
    });
  };

  MultipleSelection.prototype.clear = function () {
    this.$selection.find('.rendered-selection').empty();
  };

  MultipleSelection.prototype.display = function (data) {
    return data.text;
  };

  MultipleSelection.prototype.selectionContainer = function () {
    var $container = $(
      '<li class="choice">' +
        '<span class="remove">&times;</span>' +
      '</li>'
    );

    return $container;
  };

  MultipleSelection.prototype.update = function (data) {
    this.clear();

    if (data.length === 0) {
      return;
    }

    var $selections = [];

    for (var d = 0; d < data.length; d++) {
      var selection = data[d];

      var formatted = this.display(selection);
      var $selection = this.selectionContainer();

      $selection.append(formatted);
      $selection.data('data', selection);

      $selections.push($selection);
    }

    this.$selection.find('.rendered-selection').append($selections);
  };

  return MultipleSelection;
});

define('select2/selection/placeholder',[
  '../utils'
], function (Utils) {
  function Placeholder (decorated, $element, options) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options);
  }

  Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
      placeholder = {
        id: '',
        text: placeholder
      };
    }

    return placeholder;
  };

  Placeholder.prototype.update = function (decorated, data) {
    var singlePlaceholder = (
      data.length == 1 && data[0].id != this.placeholder.id
    );
    var multipleSelections = data.length > 1;

    if (multipleSelections || singlePlaceholder) {
      return decorated.call(this, data);
    }

    this.clear();

    var $placeholder = this.selectionContainer();

    $placeholder.html(this.display(this.placeholder));
    $placeholder.addClass('placeholder').removeClass('choice');

    this.$selection.find('.rendered-selection').append($placeholder);
  };

  return Placeholder;
});

define('select2/data/base',[
  '../utils'
], function (Utils) {
  function BaseAdapter ($element, options) {
    BaseAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(BaseAdapter, Utils.Observable);

  BaseAdapter.prototype.current = function (callback) {
    throw new Error('The `current` method must be defined in child classes.');
  };

  BaseAdapter.prototype.query = function (params, callback) {
    throw new Error('The `query` method must be defined in child classes.');
  };

  BaseAdapter.prototype.bind = function (container, $container) {
    // Can be implemented in subclasses
  };

  return BaseAdapter;
});

define('select2/data/select',[
  './base',
  '../utils',
  'jquery'
], function (BaseAdapter, Utils, $) {
  function SelectAdapter ($element, options) {
    this.$element = $element;

    SelectAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(SelectAdapter, BaseAdapter);

  SelectAdapter.prototype.current = function (callback) {
    var data = [];
    var self = this;

    this.$element.find(':selected').each(function () {
      var $option = $(this);

      var option = self.item($option);

      data.push(option);
    });

    callback(data);
  };

  SelectAdapter.prototype.select = function (data) {
    var self = this;

    if (this.$element.prop('multiple')) {
      this.current(function (currentData) {
        var val = [];

        data = [data];
        data.push.apply(data, currentData);

        for (var d = 0; d < data.length; d++) {
          id = data[d].id;

          if (val.indexOf(id) === -1) {
            val.push(id);
          }
        }

        self.$element.val(val);
        self.$element.trigger('change');
      });
    } else {
      var val = data.id;

      this.$element.val(val);
      this.$element.trigger('change');
    }
  };

  SelectAdapter.prototype.unselect = function (data) {
    var self = this;

    if (!this.$element.prop('multiple')) {
      return;
    }

    this.current(function (currentData) {
      var val = [];

      for (var d = 0; d < currentData.length; d++) {
        id = currentData[d].id;

        if (id !== data.id && val.indexOf(id) === -1) {
          val.push(id);
        }
      }

      self.$element.val(val);
      self.$element.trigger('change');
    });
  };

  SelectAdapter.prototype.bind = function (container, $container) {
    var self = this;

    container.on('select', function (params) {
      self.select(params.data);
    });

    container.on('unselect', function (params) {
      self.unselect(params.data);
    });
  };

  SelectAdapter.prototype.query = function (params, callback) {
    var data = [];
    var self = this;

    var $options = this.$element.children();

    $options.each(function () {
      var $option = $(this);

      if (!$option.is('option') && !$option.is('optgroup')) {
        return;
      }

      var option = self.item($option);

      var matches = self.matches(params, option);

      if (matches !== null) {
        data.push(matches);
      }
    });

    callback(data);
  };

  SelectAdapter.prototype.item = function ($option) {
    var data = $option.data('data');

    // If the data has already be generated, use it
    if (data == null) {
      if ($option.is('option')) {
        data = {
          id: $option.val(),
          text: $option.html(),
          disabled: $option.prop('disabled')
        };
      } else if ($option.is('optgroup')) {
        data = {
          text: $option.attr('label'),
          children: []
        };

        var $children = $option.children('option');
        var children = [];

        for (var c = 0; c < $children.length; c++) {
          var $child = $($children[c]);

          var child = this.item($child);

          children.push(child);
        }

        data.children = children;
      }

      $option.data('data', data);
    }

    return data;
  };

  SelectAdapter.prototype.matches = function (params, data) {
    var match = $.extend(true, {}, data);

    if (data.children) {
      for (var c = data.children.length - 1; c >= 0; c--) {
        var child = data.children[c];

        var matches = this.matches(params, child);

        // If there wasn't a match, remove the object in the array
        if (matches === null) {
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

    if (data.text.toUpperCase().indexOf(params.term.toUpperCase()) > -1) {
      return match;
    }

    return null;
  };

  return SelectAdapter;
});

define('select2/data/array',[
  './select',
  '../utils'
], function (SelectAdapter, Utils) {
  function ArrayAdapter ($element, options) {
    this.data = options.options.data;

    ArrayAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(ArrayAdapter, SelectAdapter);

  ArrayAdapter.prototype.select = function (data) {
    var self = this;

    this.$element.find('option').each(function () {
      var $option = $(this);
      var option = self.item($option);

      if (option.id == data.id.toString()) {
        $option.remove();
      }
    });

    var $option = this.option(data);

    this.$element.append($option);

    ArrayAdapter.__super__.select.call(this, data);
  };

  ArrayAdapter.prototype.option = function (data) {
    var $option = $('<option></option>');

    $option.text(data.text);
    $option.val(data.id);
    $option.data('data', data);

    return $option;
  };

  ArrayAdapter.prototype.query = function (params, callback) {
    var matches = [];
    var self = this;

    $.each(this.data, function () {
      var option = this;

      if (self.matches(params, option)) {
        matches.push(option);
      }
    });

    callback(matches);
  };

  return ArrayAdapter;
});

define('select2/data/ajax',[
  './array',
  '../utils',
  'jquery'
], function (ArrayAdapter, Utils, $) {
  function AjaxAdapter ($element, options) {
    this.ajaxOptions = options.get('ajax');

    this.processResults = this.ajaxOptions.processResults ||
      function (results) {
        return results;
      };

    ArrayAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(AjaxAdapter, ArrayAdapter);

  AjaxAdapter.prototype.query = function (params, callback) {
    var matches = [];
    var self = this;

    var options = $.extend({
      type: 'GET'
    }, this.ajaxOptions);

    if (typeof options.url === 'function') {
      options.url = options.url(params);
    }

    if (typeof options.data === 'function') {
      options.data = options.data(params);
    }

    var $request = $.ajax(options);

    $request.success(function (data) {
      var results = self.processResults(data);

      callback(results);
    });
  };

  return AjaxAdapter;
});

define('select2/dropdown',[
  './utils'
], function (Utils) {
  function Dropdown ($element, options) {
    this.$element = $element;
  }

  Utils.Extend(Dropdown, Utils.Observable);

  Dropdown.prototype.render = function () {
    var $dropdown = $(
      '<span class="dropdown">' +
        '<span class="results"></span>' +
      '</span>'
    );

    return $dropdown;
  };

  Dropdown.prototype.bind = function (container, $container) {
    // Can be implemented in subclasses
  };

  return Dropdown;
});

define('select2/dropdown/search',[

], function () {
  function Search () { }

  Search.prototype.render = function (decorated) {
    var $rendered = decorated.call(this);

    var $search = $(
      '<span class="search">' +
        '<input type="search" name="search" />' +
      '</span>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    $rendered.prepend($search);

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    this.$search.on('keyup', function () {
      container.trigger('query', {
        term: $(this).val()
      });
    });

    container.on('results:all', function (params) {
      if (params.query.term == null || params.query.term === '') {
        var showSearch = self.showSearch(params);

        if (showSearch) {
          self.$searchContainer.show();
        } else {
          self.$searchContainer.hide();
        }
      }
    });
  };

  Search.prototype.showSearch = function (params) {
    return true;
  };

  return Search;
});

define('select2/defaults',[
  './results',

  './selection/single',
  './selection/multiple',
  './selection/placeholder',

  './utils',

  './data/select',
  './data/array',
  './data/ajax',

  './dropdown',
  './dropdown/search'
], function (ResultsList,
             SingleSelection, MultipleSelection, Placeholder,
             Utils,
             SelectData, ArrayData, AjaxData,
             Dropdown, Search) {
  function Defaults () {
    this.reset();
  }

  Defaults.prototype.apply = function (options) {
    options = $.extend({}, options, this.defaults);

    if (options.dataAdapter == null) {
      if (options.ajax) {
        options.dataAdapter = AjaxData;
      } else if (options.data) {
        options.dataAdapter = ArrayData;
      } else {
        options.dataAdapter = SelectData;
      }
    }

    if (options.resultsAdapter == null) {
      options.resultsAdapter = ResultsList;
    }

    if (options.dropdownAdapter == null) {
      var SearchableDropdown = Utils.Decorate(Dropdown, Search);

      options.dropdownAdapter = SearchableDropdown;
    }

    if (options.selectionAdapter == null) {
      if (options.multiple) {
        options.selectionAdapter = MultipleSelection;
      } else {
        options.selectionAdapter = SingleSelection;
      }

      // Add the placeholder mixin if a placeholder was specified
      if (options.placeholder != null) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          Placeholder
        );
      }
    }

    return options;
  };

  Defaults.prototype.reset = function () {
    this.defaults = { };
  };

  var defaults = new Defaults();

  return defaults;
});

define('select2/options',[
  './defaults'
], function (Defaults) {
  function Options (options) {
    this.options = Defaults.apply(options);
  }

  Options.prototype.fromElement = function ($e) {
    return this;
  };

  Options.prototype.get = function (key) {
    return this.options[key];
  };

  Options.prototype.set = function (key, val) {
    this.options[key] = val;
  };

  return Options;
});

define('select2/core',[
  'jquery',
  './options',
  './utils'
], function ($, Options, Utils) {
  var Select2 = function ($element, options) {
    this.$element = $element;

    options = options || {};

    options.multiple = options.multiple || $element.prop('multiple');

    this.options = new Options(options);

    Select2.__super__.constructor.call(this);

    // Set up containers and adapters

    var DataAdapter = this.options.get('dataAdapter');
    this.data = new DataAdapter($element, this.options);

    var $container = this.render();
    this.$container = $container;

    $container.insertAfter(this.$element);

    $container.width($element.outerWidth(false));

    var SelectionAdapter = this.options.get('selectionAdapter');
    this.selection = new SelectionAdapter($element, this.options);

    var $selectionContainer = $container.find('.selection');
    var $selection = this.selection.render();

    $selectionContainer.append($selection);

    var DropdownAdapter = this.options.get('dropdownAdapter');
    this.dropdown = new DropdownAdapter($element, this.options);

    var $dropdownContainer = $container.find('.dropdown-wrapper');
    var $dropdown = this.dropdown.render();

    $dropdownContainer.append($dropdown);

    var ResultsAdapter = this.options.get('resultsAdapter');
    this.results = new ResultsAdapter($element, this.options, this.data);

    var $resultsContainer = $dropdown.find('.results');
    var $results = this.results.render();

    $resultsContainer.append($results);

    // Bind events

    var self = this;

    this.data.bind(this, $container);
    this.selection.bind(this, $container);

    this.dropdown.bind(this, $container);
    this.results.bind(this, $container);

    this.$element.on('change', function () {
      self.data.current(function (data) {
        self.trigger('selection:update', {
          data: data
        });
      });
    });

    this.selection.on('toggle', function () {
      self.toggleDropdown();
    });

    this.selection.on('unselected', function (params) {
      self.trigger('unselect', params);

      self.trigger('close');
    });

    this.results.on('selected', function (params) {
      self.trigger('select', params);

      self.trigger('close');
    });

    this.results.on('unselected', function (params) {
      self.trigger('unselect', params);

      self.trigger('close');
    });

    this.on('open', function () {
      $container.addClass('open');
    });

    this.on('close', function () {
      $container.removeClass('open');
    });

    // Set the initial state

    this.data.current(function (initialData) {
      self.trigger('selection:update', {
        data: initialData
      });
    });

    this.on('query', function (params) {
      this.data.query(params, function (data) {
        self.trigger('results:all', {
          data: data,
          query: params
        });
      });
    });

    this.trigger('query', {});

    // Hide the original select

    $element.hide();
  };

  Utils.Extend(Select2, Utils.Observable);

  Select2.prototype.toggleDropdown = function () {
    if (this.$container.hasClass('open')) {
      this.trigger('close');
    } else {
      this.trigger('open');
    }
  };

  Select2.prototype.render = function () {
    var $container = $(
      '<span class="select2 select2-container select2-theme-default">' +
        '<span class="selection"></span>' +
        '<span class="dropdown-wrapper"></span>' +
      '</span>'
    );

    return $container;
  };

  return Select2;
});

define('jquery.select2',[
  'jquery',
  'select2/core'
], function ($, Select2) {
  if ($.fn.select2 == null) {
    $.fn.select2 = function (options) {
      options = options || {};

      if (typeof options === 'object') {
        this.each(function () {
          var instance = new Select2($(this), options);
        });
      } else if (typeof options === 'string') {
        var instance = this.data('select2');

        instance[options](arguments.slice(1));
      } else {
        throw new Error('Invalid arguments for Select2: ' + options);
      }
    };
  }

  return Select2;
});

