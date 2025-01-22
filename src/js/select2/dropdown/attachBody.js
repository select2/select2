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
    const viewport = {
      top: window.scrollY,
      bottom: window.scrollY + window.innerHeight,
    };

    const offset = this.container.getBoundingClientRect();
    const dropdownHeight = this.dropdown.offsetHeight;

    const enoughRoomAbove = viewport.top < offset.top - dropdownHeight;
    const enoughRoomBelow = viewport.bottom > offset.bottom + dropdownHeight;

    const parentOffset = this._getParentOffset(this.dropdownParent);

    const newDirection = !enoughRoomBelow && enoughRoomAbove
      ? "above"
      : "below";

    const css = {
      left: offset.left + window.scrollX - parentOffset.left + "px",
      top:
        newDirection === "above"
          ? offset.top + window.scrollY - dropdownHeight - parentOffset.top + "px"
          : offset.bottom + window.scrollY - parentOffset.top + "px",
    };

    this.dropdown.classList.remove("select2-dropdown--below", "select2-dropdown--above");
    this.dropdown.classList.add(`select2-dropdown--${newDirection}`);

    this.container.classList.remove("select2-container--below", "select2-container--above");
    this.container.classList.add(`select2-container--${newDirection}`);

    Object.assign(this.dropdownContainer.style, css);
  };

  AttachBody.prototype._getParentOffset = function (parent) {
    if (!(parent instanceof Element)) {
      // Fallback to `document.body` if `parent` is not an element
      parent = document.body;
    }

    const style = window.getComputedStyle(parent);

    if (style.position === "static") {
      parent = parent.offsetParent || document.body;
    }

    if (parent) {
      const parentOffset = parent.getBoundingClientRect();
      return {
        top: parentOffset.top + window.scrollY,
        left: parentOffset.left + window.scrollX,
      };
    }

    return { top: 0, left: 0 };
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
