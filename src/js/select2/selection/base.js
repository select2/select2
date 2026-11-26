define(['jquery', '../utils', '../keys'], function ($, Utils, KEYS) {
  function BaseSelection($element, options) {
    this.$element = $element;
    this.options = options;
    this._generatedLabelIds = [];

    BaseSelection.__super__.constructor.call(this);
  }

  Utils.Extend(BaseSelection, Utils.Observable);

  BaseSelection.prototype.render = function () {
    var $selection = $(
      '<span class="select2-selection" role="combobox" ' +
        ' aria-haspopup="true" aria-expanded="false">' +
        '</span>'
    );

    this._tabindex = 0;

    if (Utils.GetData(this.$element[0], 'old-tabindex') != null) {
      this._tabindex = Utils.GetData(this.$element[0], 'old-tabindex');
    } else if (this.$element[0].getAttribute('tabindex') != null) {
      this._tabindex = this.$element[0].getAttribute('tabindex');
    }

    var preserveAttrs = ['title', 'aria-label', 'aria-labelledby'];
    for (var i = 0; i < preserveAttrs.length; i++) {
      var attr = preserveAttrs[i];
      if (this.$element[0].getAttribute(attr)) {
        $selection[0].setAttribute(attr, this.$element[0].getAttribute(attr));
      }
    }
    $selection[0].setAttribute('tabindex', this._tabindex);
    $selection[0].setAttribute('aria-disabled', 'false');

    this.$selection = $selection;

    return $selection;
  };

  BaseSelection.prototype._getLabelId = function (label, labelPrefix) {
    if (label.id) {
      return label.id;
    }

    // Generate an id scoped to the select2 container id so it stays tied to
    // the owning instance; track it so it can be removed on destroy.
    var id = labelPrefix + '-label-' + Utils.generateChars(4);

    label.id = id;
    this._generatedLabelIds.push({ label: label, id: id });
    return id;
  };

  BaseSelection.prototype._resolveLabelledBy = function (id) {
    var selection = this.$selection[0];
    var element = this.$element[0];
    var ariaLabel = selection.getAttribute('aria-label') || '';
    var ariaLabelledBy = selection.getAttribute('aria-labelledby') || '';

    // Respect explicit ARIA attributes on the <select>. These are copied to
    // the selection container during render().
    if (ariaLabel.trim() || ariaLabelledBy.trim()) {
      return;
    }

    var labels = element.labels || [];
    var labelIds = [];

    for (var i = 0; i < labels.length; i++) {
      labelIds.push(this._getLabelId(labels[i], id));
    }

    // Fall back to the rendered container id when there are no labels.
    selection.setAttribute('aria-labelledby', labelIds.join(' ') || id);
  };

  BaseSelection.prototype._clearGeneratedLabelIds = function () {
    for (var i = 0; i < this._generatedLabelIds.length; i++) {
      var entry = this._generatedLabelIds[i];
      if (entry.label.id === entry.id) {
        entry.label.removeAttribute('id');
      }
    }
  };

  BaseSelection.prototype.bind = function (container, $container) {
    var self = this;

    var resultsId = container.id + '-results';

    this.container = container;

    this.$selection.on('focus', function (evt) {
      self.trigger('focus', evt);
    });

    this.$selection.on('blur', function (evt) {
      self._handleBlur(evt);
    });

    this.$selection.on('keydown', function (evt) {
      self.trigger('keypress', evt);

      if (evt.which === KEYS.SPACE) {
        evt.preventDefault();
      }
    });

    container.on('results:focus', function (params) {
      self.$selection[0].setAttribute(
        'aria-activedescendant',
        params.data._resultId
      );
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expanded="true"
      self.$selection[0].setAttribute('aria-expanded', 'true');
      self.$selection[0].setAttribute('aria-owns', resultsId);

      self._attachCloseHandler(container);
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expanded="false"
      self.$selection[0].setAttribute('aria-expanded', 'false');
      self.$selection[0].removeAttribute('aria-activedescendant');
      self.$selection[0].removeAttribute('aria-owns');

      // Don't scroll the page back to the selection
      self.$selection[0].focus({ preventScroll: true });

      // Restore focus state (container--focus class + focus event)
      // without scrolling
      self.trigger('focus', {});

      self._detachCloseHandler(container);
    });

    container.on('enable', function () {
      self.$selection[0].setAttribute('tabindex', self._tabindex);
      self.$selection[0].setAttribute('aria-disabled', 'false');
    });

    container.on('disable', function () {
      self.$selection[0].setAttribute('tabindex', '-1');
      self.$selection[0].setAttribute('aria-disabled', 'true');
    });
  };

  BaseSelection.prototype._handleBlur = function (evt) {
    var self = this;

    // This needs to be delayed as the active element is the body when the tab
    // key is pressed, possibly along with others.
    window.setTimeout(function () {
      // Don't trigger `blur` if the focus is still in the selection
      if (
        document.activeElement == self.$selection[0] ||
        self.$selection[0].contains(document.activeElement)
      ) {
        return;
      }

      self.trigger('blur', evt);
    }, 1);
  };

  BaseSelection.prototype._attachCloseHandler = function (container) {
    var self = this;
    var namespace = Utils.toEventNamespace(container.id);

    $(document.body).on('mousedown.select2.' + namespace, function (e) {
      var event = e.originalEvent || e;
      var path = event.composedPath ? event.composedPath() : null;
      var $container = self.$selection.closest('.select2');
      var containerElement = $container[0];
      var isInside = path
        ? path.indexOf(containerElement) > -1
        : $(e.target).closest('.select2')[0] == containerElement;

      if (!isInside) {
        self.trigger('close', {
          originalEvent: e
        });
      }
    });
  };

  BaseSelection.prototype._detachCloseHandler = function (container) {
    $(document.body).off(
      'mousedown.select2.' + Utils.toEventNamespace(container.id)
    );
  };

  BaseSelection.prototype.position = function ($selection, $container) {
    var $selectionContainer = $container.find('.selection');
    $selectionContainer.append($selection);
  };

  BaseSelection.prototype.destroy = function () {
    this._clearGeneratedLabelIds();
    this._detachCloseHandler(this.container);
  };

  BaseSelection.prototype.update = function (data) {
    throw new Error('The `update` method must be defined in child classes.');
  };

  /**
   * Helper method to abstract the "enabled" (not "disabled") state of this
   * object.
   *
   * @return {true} if the instance is not disabled.
   * @return {false} if the instance is disabled.
   */
  BaseSelection.prototype.isEnabled = function () {
    return !this.isDisabled();
  };

  /**
   * Helper method to abstract the "disabled" state of this object.
   *
   * @return {true} if the disabled option is true.
   * @return {false} if the disabled option is false.
   */
  BaseSelection.prototype.isDisabled = function () {
    return this.options.get('disabled');
  };

  return BaseSelection;
});
