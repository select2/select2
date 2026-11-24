define(['jquery', './base', '../utils', '../keys'], function (
  $,
  BaseSelection,
  Utils,
  KEYS
) {
  var nextLabelId = 0;

  function hasLabelReference(element, labelledBy) {
    var ids = (labelledBy || '').match(/\S+/g);
    if (!ids) {
      return false;
    }

    var root = element.ownerDocument;
    if (element.getRootNode) {
      root = element.getRootNode();
    }
    // A detached subtree can acquire its referenced label when inserted.
    return (
      !root.getElementById ||
      ids.some(function (id) {
        return root.getElementById(id) != null;
      })
    );
  }

  function SingleSelection() {
    SingleSelection.__super__.constructor.apply(this, arguments);
    this._generatedLabelIds = [];
  }

  Utils.Extend(SingleSelection, BaseSelection);

  SingleSelection.prototype.render = function () {
    var $selection = SingleSelection.__super__.render.call(this);

    $selection[0].classList.add('select2-selection--single');

    $selection.html(
      '<span class="select2-selection__rendered"></span>' +
        '<span class="select2-selection__arrow" role="presentation">' +
        '<b role="presentation"></b>' +
        '</span>'
    );

    return $selection;
  };

  SingleSelection.prototype.bind = function (container, $container) {
    var self = this;

    SingleSelection.__super__.bind.apply(this, arguments);

    var id = container.id + '-container';

    var rendered = this.$selection.find('.select2-selection__rendered')[0];
    if (rendered != null) {
      rendered.setAttribute('id', id);
      rendered.setAttribute('role', 'textbox');
      rendered.setAttribute('aria-readonly', 'true');
    }
    var selection = this.$selection[0];
    var element = this.$element[0];
    var ariaLabel = selection.getAttribute('aria-label') || '';
    if (
      !ariaLabel.trim() &&
      !hasLabelReference(element, selection.getAttribute('aria-labelledby'))
    ) {
      var labels = element.labels || [];
      var ids = [];

      for (var i = 0; i < labels.length; i++) {
        ids.push(this._getLabelId(labels[i]));
      }

      selection.setAttribute('aria-labelledby', ids.join(' ') || id);
    }
    selection.setAttribute('aria-controls', id);

    this.$selection.on('mousedown', function (evt) {
      // Only respond to left clicks
      if (evt.which !== 1) {
        return;
      }

      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on('focus', function (evt) {
      // User focuses on the container
    });

    this.$selection.on('blur', function (evt) {
      // User exits the container
    });

    container.on('focus', function (evt) {
      if (!container.isOpen()) {
        self.$selection.trigger('focus');
      }
    });
  };

  SingleSelection.prototype._getLabelId = function (label) {
    if (label.id) {
      return label.id;
    }

    var root = label.getRootNode ? label.getRootNode() : label.ownerDocument;
    var id;
    do {
      nextLabelId++;
      id = 'select2-label-' + nextLabelId;
    } while (root.querySelector('#' + id));

    label.id = id;
    this._generatedLabelIds.push({ label: label, id: id });
    return id;
  };

  SingleSelection.prototype.destroy = function () {
    for (var i = 0; i < this._generatedLabelIds.length; i++) {
      var entry = this._generatedLabelIds[i];
      if (entry.label.id === entry.id) {
        entry.label.removeAttribute('id');
      }
    }
    SingleSelection.__super__.destroy.call(this);
  };

  SingleSelection.prototype.clear = function () {
    var $rendered = this.$selection.find('.select2-selection__rendered');
    $rendered.empty();
    $rendered[0].removeAttribute('title'); // clear tooltip on empty
  };

  SingleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');

    return template(data, container);
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

    var $rendered = this.$selection.find('.select2-selection__rendered');
    var formatted = this.display(selection, $rendered);

    $rendered.empty();
    Utils.appendContent(
      $rendered[0],
      formatted,
      this.options.get('escapeMarkup')
    );

    var title = selection.title || selection.text;

    if (title) {
      $rendered[0].setAttribute('title', title);
    } else {
      $rendered[0].removeAttribute('title');
    }
  };

  return SingleSelection;
});
