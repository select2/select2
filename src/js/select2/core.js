define([
  'jquery',
  './options',
  './utils'
], function ($, Options, Utils) {
  var Select2 = function ($element, options) {
    this.$element = $element;

    this.id = this._generateId($element);

    options = options || {};

    this.options = new Options(options, $element);

    Select2.__super__.constructor.call(this);

    // Set up containers and adapters

    var DataAdapter = this.options.get('dataAdapter');
    this.data = new DataAdapter($element, this.options);

    var $container = this.render();

    this._placeContainer($container);

    var SelectionAdapter = this.options.get('selectionAdapter');
    this.selection = new SelectionAdapter($element, this.options);

    var $selection = this.selection.render();

    this._placeSelection($selection);

    var DropdownAdapter = this.options.get('dropdownAdapter');
    this.dropdown = new DropdownAdapter($element, this.options);

    var $dropdown = this.dropdown.render();

    this._placeDropdown($dropdown);

    var ResultsAdapter = this.options.get('resultsAdapter');
    this.results = new ResultsAdapter($element, this.options, this.data);

    var $results = this.results.render();

    this._placeResults($results);

    // Bind events

    var self = this;

    // Bind the container to all of the adapters
    this._bindAdapters();

    // Register any DOM event handlers
    this._registerDomEvents();

    // Register any internal event handlers
    this._registerSelectionEvents();
    this._registerResultsEvents();
    this._registerEvents();

    // Set the initial state

    this.data.current(function (initialData) {
      self.trigger('selection:update', {
        data: initialData
      });
    });

    this.trigger('query', {});

    // Hide the original select

    $element.hide();
    $element.attr('tabindex', '-1');

    $element.data('select2', this);
  };

  Utils.Extend(Select2, Utils.Observable);

  Select2.prototype._generateId = function ($element) {
    var id = '';

    if ($element.attr('id') != null) {
      id = $element.attr('id');
    } else if ($element.attr('name') != null) {
      id = $element.attr('name') + '-' + Utils.generateChars(2);
    } else {
      id = Utils.generateChars(4);
    }

    id = 'select2-' + id;

    return id;
  };

  Select2.prototype._placeContainer = function ($container) {
    $container.insertAfter(this.$element);
    $container.width(this.$element.outerWidth(false));
  };

  Select2.prototype._placeSelection = function ($selection) {
    var $selectionContainer = this.$container.find('.selection');
    $selectionContainer.append($selection);
  };

  Select2.prototype._placeDropdown = function ($dropdown) {
    this.$dropdown = $dropdown;

    var $dropdownContainer = this.$container.find('.dropdown-wrapper');
    $dropdownContainer.append($dropdown);
  };

  Select2.prototype._placeResults = function ($results) {
    var $resultsContainer = this.$dropdown.find('.results');
    $resultsContainer.append($results);
  };

  Select2.prototype._bindAdapters = function () {
    this.data.bind(this, this.$container);
    this.selection.bind(this, this.$container);

    this.dropdown.bind(this, this.$container);
    this.results.bind(this, this.$container);
  };

  Select2.prototype._registerDomEvents = function () {
    var self = this;

    this.$element.on('change', function () {
      self.data.current(function (data) {
        self.trigger('selection:update', {
          data: data
        });
      });
    });
  };

  Select2.prototype._registerSelectionEvents = function () {
    var self = this;

    this.selection.on('open', function () {
      self.open();
    });
    this.selection.on('close', function () {
      self.close();
    });
    this.selection.on('toggle', function () {
      self.toggleDropdown();
    });

    this.selection.on('results:select', function () {
      self.trigger('results:select');
    });
    this.selection.on('results:previous', function () {
      self.trigger('results:previous');
    });
    this.selection.on('results:next', function () {
      self.trigger('results:next');
    });

    this.selection.on('unselected', function (params) {
      self.trigger('unselect', params);

      self.close();
    });
  };

  Select2.prototype._registerResultsEvents = function () {
    var self = this;

    this.results.on('selected', function (params) {
      self.trigger('select', params);

      self.close();
    });

    this.results.on('unselected', function (params) {
      self.trigger('unselect', params);

      self.close();
    });

    this.results.on('results:focus', function (params) {
      self.trigger('results:focus', params);
    });
  };

  Select2.prototype._registerEvents = function () {
    var self = this;

    this.on('open', function () {
      self.$container.addClass('open');
    });

    this.on('close', function () {
      self.$container.removeClass('open');
    });

    this.on('query', function (params) {
      this.data.query(params, function (data) {
        self.trigger('results:all', {
          data: data,
          query: params
        });
      });
    });
  };

  Select2.prototype.toggleDropdown = function () {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  };

  Select2.prototype.open = function () {
    if (this.isOpen()) {
      return;
    }

    this.trigger('open');
  };

  Select2.prototype.close = function () {
    if (!this.isOpen()) {
      return;
    }

    this.trigger('close');
  };

  Select2.prototype.isOpen = function () {
    return this.$container.hasClass('open');
  };

  Select2.prototype.render = function () {
    var $container = $(
      '<span class="select2 select2-container select2-theme-default">' +
        '<span class="selection"></span>' +
        '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
      '</span>'
    );

    this.$container = $container;

    return $container;
  };

  return Select2;
});
