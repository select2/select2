define(['jquery', '../utils'], function ($, Utils) {
  function AttachBody(decorated, $element, options) {
    this.$element = $element;

    var configuredParent = options.get('dropdownParent');

    if (configuredParent) {
      this.$dropdownParent = $(configuredParent);
    } else {
      var $autoModalParent = $element.closest(
        'dialog, .modal, [role="dialog"], .ui-dialog'
      );

      this.$dropdownParent =
        $autoModalParent.length > 0
          ? $autoModalParent.first()
          : $(document.body);
    }

    decorated.call(this, $element, options);
  }

  AttachBody.prototype.bind = function (decorated, container, $container) {
    var self = this;

    this.container = container;

    decorated.call(this, container, $container);

    container.on('open', function () {
      self._showDropdown();
      self._attachPositioningHandler(container);

      // Must bind after the results handlers to ensure correct sizing
      self._bindContainerResultHandlers(container);
    });

    container.on('close', function () {
      self._hideDropdown();
      self._detachPositioningHandler(container);
    });

    this.$dropdownContainer.on('mousedown touchstart focusin', function (evt) {
      evt.stopPropagation();
    });

    var $modalAncestors = this.$element.closest(
      'dialog, .modal, [role="dialog"], .ui-dialog'
    );

    if ($modalAncestors.length > 0) {
      var modalCloseEvent =
        'hide.bs.modal.select2.' +
        container.id +
        ' ' +
        'hidden.bs.modal.select2.' +
        container.id +
        ' ' +
        'dialogclose.select2.' +
        container.id +
        ' ' +
        'close.select2.' +
        container.id;

      $modalAncestors.on(modalCloseEvent, function () {
        if (container.isOpen()) {
          container.close();
        }
      });

      this._$modalAncestors = $modalAncestors;
      this._modalCloseEvent = modalCloseEvent;
    }
  };

  AttachBody.prototype.destroy = function (decorated) {
    decorated.call(this);

    if (this._detachPositioningHandler && this.container) {
      this._detachPositioningHandler(this.container);
    }

    if (this._$modalAncestors && this._modalCloseEvent) {
      this._$modalAncestors.off(this._modalCloseEvent);
      this._$modalAncestors = null;
    }

    this.$dropdownContainer.remove();
  };

  AttachBody.prototype.position = function (decorated, $dropdown, $container) {
    // Clone all of the container classes
    $dropdown[0].setAttribute('class', $container[0].getAttribute('class'));

    $dropdown[0].classList.remove('select2');
    $dropdown[0].classList.add('select2-container--open');

    var highestZIndex = 1060;
    var $parents = $container.parents();

    for (var i = 0; i < $parents.length; i++) {
      var z = parseInt(window.getComputedStyle($parents[i]).zIndex, 10);
      if (!isNaN(z) && z >= highestZIndex) {
        highestZIndex = z + 1;
      }
    }

    $dropdown.css({
      position: 'absolute',
      top: -999999,
      zIndex: highestZIndex
    });

    this.$container = $container;
  };

  AttachBody.prototype.render = function (decorated) {
    var $container = $('<span></span>');

    var $dropdown = decorated.call(this);
    $container.append($dropdown);

    this.$dropdownContainer = $container;

    return $container;
  };

  AttachBody.prototype._hideDropdown = function (decorated) {
    this.$dropdownContainer.detach();
  };

  AttachBody.prototype._bindContainerResultHandlers = function (
    decorated,
    container
  ) {
    // These should only be bound once
    if (this._containerResultsHandlersBound) {
      return;
    }

    var self = this;

    container.on('results:all', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on('results:append', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on('results:message', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on('select', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on('unselect', function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    this._containerResultsHandlersBound = true;
  };

  AttachBody.prototype._attachPositioningHandler = function (
    decorated,
    container
  ) {
    var self = this;

    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    this._$scrollWatchers = this.$container.parents().filter(Utils.hasScroll);

    this._$scrollWatchers.on(scrollEvent, function () {
      if (container.isOpen()) {
        self._positionDropdown();
        self._resizeDropdown();
      }
    });

    $(window).on(
      scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent,
      function (e) {
        if (container.isOpen()) {
          self._positionDropdown();
          self._resizeDropdown();
        }
      }
    );
  };

  AttachBody.prototype._detachPositioningHandler = function (
    decorated,
    container
  ) {
    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    if (this._$scrollWatchers) {
      this._$scrollWatchers.off(scrollEvent);
      this._$scrollWatchers = null;
    }

    this.$container.parents().off(scrollEvent);

    $(window).off(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent);
  };

  AttachBody.prototype._getOffsetParent = function () {
    var $candidate = this.$dropdownParent;

    if ($candidate.css('position') === 'static') {
      while ($candidate.length && !$candidate.is('body, html')) {
        var el = $candidate[0];
        if (el.nodeType !== 1) {
          break;
        }

        var style = window.getComputedStyle
          ? window.getComputedStyle(el)
          : null;
        if (style) {
          var isPositioned = style.position !== 'static';
          var isTransformed =
            (style.transform && style.transform !== 'none') ||
            (style.perspective && style.perspective !== 'none') ||
            (style.filter && style.filter !== 'none') ||
            (style.willChange &&
              style.willChange.indexOf('transform') !== -1) ||
            (style.contain &&
              (style.contain.indexOf('paint') !== -1 ||
                style.contain.indexOf('layout') !== -1));

          if (isPositioned || isTransformed) {
            return $candidate;
          }
        }

        $candidate = $candidate.parent();
      }

      return $(document.body);
    }

    return $candidate;
  };

  AttachBody.prototype._positionDropdown = function () {
    var $window = $(window);

    var isCurrentlyAbove = this.$dropdown[0].classList.contains(
      'select2-dropdown--above'
    );
    var isCurrentlyBelow = this.$dropdown[0].classList.contains(
      'select2-dropdown--below'
    );

    var newDirection = null;

    var offset = this.$container.offset();

    offset.bottom = offset.top + this.$container.outerHeight(false);

    var container = {
      height: this.$container.outerHeight(false)
    };

    container.top = offset.top;
    container.bottom = offset.top + container.height;

    var dropdown = {
      height: this.$dropdown.outerHeight(false)
    };

    var viewport = {
      top: $window.scrollTop(),
      bottom: $window.scrollTop() + $window.height()
    };

    var enoughRoomAbove = viewport.top < offset.top - dropdown.height;
    var enoughRoomBelow = viewport.bottom > offset.bottom + dropdown.height;

    var css = {
      left: offset.left,
      top: container.bottom
    };

    var $offsetParent = this._getOffsetParent();

    var parentOffset = {
      top: 0,
      left: 0
    };

    if (
      $.contains(document.body, $offsetParent[0]) ||
      $offsetParent[0].isConnected
    ) {
      parentOffset = $offsetParent.offset();
    }

    css.top -= parentOffset.top;
    css.left -= parentOffset.left;

    if (!$offsetParent.is('body, html')) {
      css.top += $offsetParent.scrollTop();
      css.left += $offsetParent.scrollLeft();

      if ($offsetParent[0].clientTop) {
        css.top -= $offsetParent[0].clientTop;
      }
      if ($offsetParent[0].clientLeft) {
        css.left -= $offsetParent[0].clientLeft;
      }
    }

    if (!isCurrentlyAbove && !isCurrentlyBelow) {
      newDirection = 'below';
    }

    if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
      newDirection = 'above';
    } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
      newDirection = 'below';
    }

    if (
      newDirection == 'above' ||
      (isCurrentlyAbove && newDirection !== 'below')
    ) {
      css.top = container.top - parentOffset.top - dropdown.height;

      if (!$offsetParent.is('body, html')) {
        css.top += $offsetParent.scrollTop();

        if ($offsetParent[0].clientTop) {
          css.top -= $offsetParent[0].clientTop;
        }
      }
    }

    if (newDirection != null) {
      this.$dropdown[0].classList.remove('select2-dropdown--below');
      this.$dropdown[0].classList.remove('select2-dropdown--above');
      this.$dropdown[0].classList.add('select2-dropdown--' + newDirection);

      this.$container[0].classList.remove('select2-container--below');
      this.$container[0].classList.remove('select2-container--above');
      this.$container[0].classList.add('select2-container--' + newDirection);
    }

    this.$dropdownContainer.css(css);
  };

  AttachBody.prototype._resizeDropdown = function () {
    var width = this.$container.outerWidth(false);

    if (width <= 0) {
      width = this.$container.parent().width();
    }

    var css = {
      width: width + 'px'
    };

    if (this.options.get('dropdownAutoWidth')) {
      css.minWidth = css.width;
      css.position = 'relative';
      css.width = 'auto';
    }

    this.$dropdown.css(css);
  };

  AttachBody.prototype._showDropdown = function (decorated) {
    this.$dropdownContainer.appendTo(this.$dropdownParent);

    this._positionDropdown();
    this._resizeDropdown();
  };

  return AttachBody;
});
