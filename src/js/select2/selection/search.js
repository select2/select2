define(["../utils", "../keys"], function (Utils, KEYS) {
  function Search(decorated, element, options) {
    decorated.call(this, element, options);
  }

  // Render the search box
  Search.prototype.render = function (decorated) {
    const searchLabel = this.options.get("translations").get("search");

    const searchContainer = document.createElement("span");
    searchContainer.className = "select2-search select2-search--inline";

    const searchField = document.createElement("textarea");
    searchField.className = "select2-search__field";
    searchField.tabIndex = "-1";
    searchField.autocorrect = "off";
    searchField.autocapitalize = "none";
    searchField.spellcheck = "false";
    searchField.role = "searchbox";
    searchField.setAttribute("aria-autocomplete", "list");
    searchField.setAttribute("aria-label", searchLabel());
    searchField.setAttribute("autocomplete", this.options.get("autocomplete"));

    searchContainer.appendChild(searchField);

    this.searchContainer = searchContainer;
    this.search = searchField;

    const rendered = decorated.call(this);
    this._transferTabIndex();
    rendered.appendChild(this.searchContainer);

    return rendered;
  };

  // Bind events to the search box
  Search.prototype.bind = function (decorated, container, containerElement) {
    const self = this;

    decorated.call(this, container, containerElement);

    const resultsId = `${container.id}-results`;
    const selectionId = `${container.id}-container`;

    this.search.setAttribute("aria-describedby", selectionId);

    container.on("open", function () {
      self.search.setAttribute("aria-controls", resultsId);
      self.search.focus();
    });

    container.on("close", function () {
      self.search.value = "";
      self.resizeSearch();
      self.search.removeAttribute("aria-controls");
      self.search.removeAttribute("aria-activedescendant");
      self.search.blur();
    });

    container.on("enable", function () {
      self.search.disabled = false;
      self._transferTabIndex();
    });

    container.on("disable", function () {
      self.search.disabled = true;
    });

    container.on("focus", function () {
      self.search.focus();
    });

    container.on("results:focus", function (params) {
      if (params.data._resultId) {
        self.search.setAttribute("aria-activedescendant", params.data._resultId);
      } else {
        self.search.removeAttribute("aria-activedescendant");
      }
    });

    // Keydown event for navigation and backspace handling
    this.selection.addEventListener("keydown", function (evt) {
      if (evt.target === self.search) {
        evt.stopPropagation();

        self.trigger("keypress", evt);
        self._keyUpPrevented = evt.defaultPrevented;

        if (evt.key === "Backspace" && self.search.value === "") {
          const previousChoices = Array.from(
            self.selection.querySelectorAll(".select2-selection__choice")
          );
          const previousChoice = previousChoices[previousChoices.length - 1];

          if (previousChoice) {
            const item = Utils.GetData(previousChoice, "data");
            self.searchRemoveChoice(item);
            evt.preventDefault();
          }
        }
      }
    });

    // Input event for dynamic searching
    this.search.addEventListener("input", function () {
      self.handleSearch();
    });

    // Resize search box dynamically
    this.search.addEventListener("keyup", function () {
      self.resizeSearch();
    });
  };

  // Transfer tabindex from selection to the search box
  Search.prototype._transferTabIndex = function () {
    const tabIndex = this.selection.getAttribute("tabindex") || "0";
    this.search.setAttribute("tabindex", tabIndex);
    this.selection.setAttribute("tabindex", "-1");
  };

  // Handle placeholder creation
  Search.prototype.createPlaceholder = function (decorated, placeholder) {
    this.search.setAttribute("placeholder", placeholder.text);
  };

  // Update the search box when the selection is updated
  Search.prototype.update = function (decorated, data) {
    const hadFocus = document.activeElement === this.search;

    this.search.setAttribute("placeholder", "");
    decorated.call(this, data);

    this.resizeSearch();
    if (hadFocus) {
      this.search.focus();
    }
  };

  // Handle the search logic
  Search.prototype.handleSearch = function () {
    this.resizeSearch();

    if (!this._keyUpPrevented) {
      const input = this.search.value;

      this.trigger("query", { term: input });
    }

    this._keyUpPrevented = false;
  };

  // Remove a choice from the selection
  Search.prototype.searchRemoveChoice = function (decorated, item) {
    this.trigger("unselect", { data: item });
    this.search.value = item.text;
    this.handleSearch();
  };

  // Dynamically resize the search box based on input
  Search.prototype.resizeSearch = function () {
    this.search.style.width = "25px"; // Minimum width

    let width = "100%";
    if (this.search.getAttribute("placeholder") === "") {
      const minimumWidth = this.search.value.length + 1;
      width = `${minimumWidth * 0.75}em`;
    }

    this.search.style.width = width;
  };

  return Search;
});
