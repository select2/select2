define(["../utils"], function (Utils) {
  function AttachBody(decorated, $element, options) {
    this.dropdownParent = options.get("dropdownParent") || document.body;

    decorated.call(this, $element, options);
  }

  AttachBody.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on("open", function () {
      self._showDropdown();
      self._attachPositioningHandler(container);

      // Must bind after the results handlers to ensure correct sizing
      self._bindContainerResultHandlers(container);
    });

    container.on("close", function () {
      self._hideDropdown();
      self._detachPositioningHandler(container);
    });

    container.on("mousedown", function (evt) {
      evt.stopPropagation();
    });
  };

  AttachBody.prototype.destroy = function (decorated) {
    decorated.call(this);

    this.dropdownContainer.remove();
  };

  AttachBody.prototype.position = function (decorated, $dropdown, $container) {
    // Clone all of the container classes
    $dropdown.className = $container.className;

    $dropdown.classList.remove("select2");
    $dropdown.classList.add("select2-container--open");

    $dropdown.style.position = "absolute";
    $dropdown.style.top = "-999999px";

    this.container = $container;
  };

  AttachBody.prototype.render = function (decorated) {
    var $container = document.createElement("span");

    var $dropdown = decorated.call(this);
    $container.appendChild($dropdown);

    this.dropdownContainer = $container;

    return $container;
  };

  AttachBody.prototype._hideDropdown = function (decorated) {
    this.dropdownContainer.remove();
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

    container.on("results:all", function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on("results:append", function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on("results:message", function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on("select", function () {
      self._positionDropdown();
      self._resizeDropdown();
    });

    container.on("unselect", function () {
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

    var scrollEvent = "scroll.select2." + container.id;
    var resizeEvent = "resize.select2." + container.id;
    var orientationEvent = "orientationchange.select2." + container.id;

    var $watchers = Array.prototype.filter.call(
      this.container.parentNode.children,
      Utils.hasScroll
    );
    $watchers.forEach(function (watcher) {
      Utils.StoreData(watcher, "select2-scroll-position", {
        x: watcher.scrollLeft,
        y: watcher.scrollTop,
      });
    });

    $watchers.forEach(function (watcher) {
      watcher.addEventListener("scroll", function (ev) {
        var position = Utils.GetData(watcher, "select2-scroll-position");
        watcher.scrollTop = position.y;
      });
    });

    window.addEventListener("scroll", function (e) {
      self._positionDropdown();
      self._resizeDropdown();
    });

    window.addEventListener("resize", function (e) {
      self._positionDropdown();
      self._resizeDropdown();
    });

    window.addEventListener("orientationchange", function (e) {
      self._positionDropdown();
      self._resizeDropdown();
    });
  };

  AttachBody.prototype._detachPositioningHandler = function (
    decorated,
    container
  ) {
    var scrollEvent = "scroll.select2." + container.id;
    var resizeEvent = "resize.select2." + container.id;
    var orientationEvent = "orientationchange.select2." + container.id;

    var $watchers = Array.prototype.filter.call(
      this.container.parentNode.children,
      Utils.hasScroll
    );
    $watchers.forEach(function (watcher) {
      watcher.removeEventListener("scroll", function (ev) {
        var position = Utils.GetData(watcher, "select2-scroll-position");
        watcher.scrollTop = position.y;
      });
    });

    window.removeEventListener("scroll", function (e) {
      self._positionDropdown();
      self._resizeDropdown();
    });

    window.removeEventListener("resize", function (e) {
      self._positionDropdown();
      self._resizeDropdown();
    });

    window.removeEventListener("orientationchange", function (e) {
      self._positionDropdown();
      self._resizeDropdown();
    });
  };

  AttachBody.prototype._positionDropdown = function () {
    var $window = window;

    var isCurrentlyAbove = this.dropdown.classList.contains(
      "select2-dropdown--above"
    );
    var isCurrentlyBelow = this.dropdown.classList.contains(
      "select2-dropdown--below"
    );

    var newDirection = null;

    var offset = this.container.getBoundingClientRect();

    offset = Object.assign({}, offset, {
      left: offset.left + $window.scrollX,
      top: offset.top + this.container.offsetHeight + $window.scrollY,
      bottom: offset.top - this.container.offsetHeight,
      right: offset.left + this.container.offsetWidth,
    });

    var container = {
      height: this.container.offsetHeight,
    };

    container.top = offset.top;
    container.bottom = offset.top - container.height;

    var dropdown = {
      height: this.dropdown.offsetHeight,
    };

    var viewport = {
      top: $window.scrollY,
      bottom: $window.scrollY + $window.innerHeight,
    };

    var enoughRoomAbove = viewport.top < offset.top - dropdown.height;
    var enoughRoomBelow = viewport.bottom > offset.bottom + dropdown.height;

    var css = {
      left: offset.left + "px",
      top: container.bottom + "px",
    };

    // Determine what the parent element is to use for calculating the offset
    var $offsetParent = this.dropdownParent;

    // For statically positioned elements, we need to get the element
    // that is determining the offset
    if (window.getComputedStyle($offsetParent).position === "static") {
      $offsetParent = $offsetParent.offsetParent;
    }

    var parentOffset = {
      top: 0,
      left: 0,
    };

    if (
      $offsetParent &&
      (document.body.contains($offsetParent) || $offsetParent.isConnected)
    ) {
      parentOffset = $offsetParent.getBoundingClientRect();
    }

    css.top = parseFloat(css.top) - parentOffset.top + "px";
    css.left = parseFloat(css.left) - parentOffset.left + "px";

    if (!isCurrentlyAbove && !isCurrentlyBelow) {
      newDirection = "below";
    }

    if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
      newDirection = "above";
    } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
      newDirection = "below";
    }

    if (
      newDirection == "above" ||
      (isCurrentlyAbove && newDirection !== "below")
    ) {
      css.top = container.top - parentOffset.top - dropdown.height + "px";
    }

    if (newDirection != null) {
      this.dropdown.classList.remove("select2-dropdown--below");
      this.dropdown.classList.remove("select2-dropdown--above");
      this.dropdown.classList.add("select2-dropdown--" + newDirection);

      this.container.classList.remove("select2-container--below");
      this.container.classList.remove("select2-container--above");
      this.container.classList.add("select2-container--" + newDirection);
    }

    Object.assign(this.dropdownContainer.style, css);
  };

  AttachBody.prototype._resizeDropdown = function () {
    var css = {
      width: this.container.offsetWidth + "px",
    };

    if (this.options.get("dropdownAutoWidth")) {
      css.minWidth = css.width;
      css.position = "relative";
      css.width = "auto";
    }

    Object.assign(this.dropdown.style, css);
  };

  AttachBody.prototype._showDropdown = function (decorated) {
    this.dropdownParent.appendChild(this.dropdownContainer);

    this._positionDropdown();
    this._resizeDropdown();
  };

  return AttachBody;
});
