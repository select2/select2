define(["./utils"], function (Utils) {
  function Results($element, options, dataAdapter) {
    this.element = $element;
    this.data = dataAdapter;
    this.options = options;

    Results.__super__.constructor.call(this);
  }

  Utils.Extend(Results, Utils.Observable);

  Results.prototype.render = function () {
    var $results = document.createElement("ul");
    $results.className = "select2-results__options";
    $results.setAttribute("role", "listbox");

    if (this.options.get("multiple")) {
      $results.setAttribute("aria-multiselectable", "true");
    }

    this.results = $results;

    return $results;
  };

  Results.prototype.clear = function () {
    this.results.innerHTML = "";
  };

  Results.prototype.displayMessage = function (params) {
    var escapeMarkup = this.options.get("escapeMarkup");

    this.clear();
    this.hideLoading();

    var $message = document.createElement("li");
    $message.setAttribute("role", "alert");
    $message.setAttribute("aria-live", "assertive");
    $message.className = "select2-results__option";

    var message = this.options.get("translations").get(params.message);

    $message.innerHTML = escapeMarkup(message(params.args));

    $message.className += " select2-results__message";

    this.results.appendChild($message);
  };

  Results.prototype.hideMessages = function () {
    var messages = this.results.querySelectorAll(
      ".select2-results__message"
    );
    messages.forEach(function (message) {
      message.remove();
    });
  };

  Results.prototype.append = function (data) {
    this.hideLoading();

    var $options = [];

    if (data.results == null || data.results.length === 0) {
      if (this.results.children.length === 0) {
        this.trigger("results:message", {
          message: "noResults",
        });
      }

      return;
    }

    data.results = this.sort(data.results);

    for (var d = 0; d < data.results.length; d++) {
      var item = data.results[d];

      var $option = this.option(item);

      $options.push($option);
    }

    $options.forEach(function ($option) {
      this.results.appendChild($option);
    }, this);
  };

  Results.prototype.position = function ($results, $dropdown) {
    var $resultsContainer = $dropdown.querySelector(".select2-results");
    $resultsContainer.appendChild($results);
  };

  Results.prototype.sort = function (data) {
    var sorter = this.options.get("sorter");

    return sorter(data);
  };

  Results.prototype.highlightFirstItem = function () {
    var options = this.results.querySelectorAll(
      ".select2-results__option--selectable"
    );
    var selected = Array.prototype.filter.call(
      options,
      function (option) {
        return option.classList.contains(
          "select2-results__option--selected"
        );
      }
    );
    if (selected.length > 0) {
      selected[0].dispatchEvent(new Event("mouseenter"));
    } else if (options.length > 0) {
      options[0].dispatchEvent(new Event("mouseenter"));
    }

    this.ensureHighlightVisible();
  };

  Results.prototype.setClasses = function () {
    var self = this;

    this.data.current(function (selected) {
      var selectedIds = selected.map(function (s) {
        return s.id.toString();
      });

      var $options = self.results.querySelectorAll(
        ".select2-results__option--selectable"
      );

      $options.forEach(function ($option) {
        var item = Utils.GetData($option, "data");

        var id = "" + item.id;

        if (
          (item.element != null && item.element.selected) ||
          (item.element == null && selectedIds.indexOf(id) > -1)
        ) {
          $option.classList.add("select2-results__option--selected");
          $option.setAttribute("aria-selected", "true");
        } else {
          $option.classList.remove("select2-results__option--selected");
          $option.setAttribute("aria-selected", "false");
        }
      });
    });
  };

  Results.prototype.showLoading = function (params) {
    this.hideLoading();

    var loadingMore = this.options.get("translations").get("searching");

    var loading = {
      disabled: true,
      loading: true,
      text: loadingMore(params),
    };
    var $loading = this.option(loading);
    $loading.className += " loading-results";

    this.results.insertBefore($loading, this.results.firstChild);
  };

  Results.prototype.hideLoading = function () {
    var loadingResults = this.results.querySelectorAll(".loading-results");
    loadingResults.forEach(function (loadingResult) {
      loadingResult.remove();
    });
  };

  Results.prototype.option = function (data) {
    var option = document.createElement("li");
    option.className =
      "select2-results__option select2-results__option--selectable";

    var attrs = {
      role: "option",
    };

    var matches =
      window.Element.prototype.matches ||
      window.Element.prototype.msMatchesSelector ||
      window.Element.prototype.webkitMatchesSelector;

    if (
      (data.element != null && matches.call(data.element, ":disabled")) ||
      (data.element == null && data.disabled)
    ) {
      attrs["aria-disabled"] = "true";

      option.classList.remove("select2-results__option--selectable");
      option.classList.add("select2-results__option--disabled");
    }

    if (data.id == null) {
      option.classList.remove("select2-results__option--selectable");
    }

    if (data._resultId != null) {
      option.id = data._resultId;
    }

    if (data.title) {
      option.title = data.title;
    }

    if (data.children) {
      attrs.role = "group";
      attrs["aria-label"] = data.text;

      option.classList.remove("select2-results__option--selectable");
      option.classList.add("select2-results__option--group");
    }

    for (var attr in attrs) {
      var val = attrs[attr];

      option.setAttribute(attr, val);
    }

    if (data.children) {
      var label = document.createElement("strong");
      label.className = "select2-results__group";

      this.template(data, label);

      var $children = [];

      for (var c = 0; c < data.children.length; c++) {
        var child = data.children[c];

        var $child = this.option(child);

        $children.push($child);
      }

      var $childrenContainer = document.createElement("ul");
      $childrenContainer.className =
        "select2-results__options select2-results__options--nested";
      $childrenContainer.setAttribute("role", "none");

      $children.forEach(function ($child) {
        $childrenContainer.appendChild($child);
      });

      option.appendChild(label);
      option.appendChild($childrenContainer);
    } else {
      this.template(data, option);
    }

    Utils.StoreData(option, "data", data);

    return option;
  };

  Results.prototype.bind = function (container, $container) {
    var self = this;

    var id = container.id + "-results";

    this.results.setAttribute("id", id);

    container.on("results:all", function (params) {
      self.clear();
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
        self.highlightFirstItem();
      }
    });

    container.on("results:append", function (params) {
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
      }
    });

    container.on("query", function (params) {
      self.hideMessages();
      self.showLoading(params);
    });

    container.on("select", function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();

      if (self.options.get("scrollAfterSelect")) {
        self.highlightFirstItem();
      }
    });

    container.on("unselect", function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();

      if (self.options.get("scrollAfterSelect")) {
        self.highlightFirstItem();
      }
    });

    container.on("open", function () {
      self.results.setAttribute("aria-expanded", "true");
      self.results.setAttribute("aria-hidden", "false");

      self.setClasses();
      self.ensureHighlightVisible();
    });

    container.on("close", function () {
      self.results.setAttribute("aria-expanded", "false");
      self.results.setAttribute("aria-hidden", "true");
      self.results.removeAttribute("aria-activedescendant");
    });

    container.on("results:toggle", function () {
      var $highlighted = self.getHighlightedResults();

      if ($highlighted.length === 0) {
        return;
      }

      $highlighted.dispatchEvent(new Event("mouseup"));
    });

    container.on("results:select", function () {
      var $highlighted = self.getHighlightedResults();
      if ($highlighted.length === 0) {
        return;
      }

      var data = Utils.GetData($highlighted, "data");

      if (
        ($highlighted && $highlighted.classList && $highlighted.classList.contains("select2-results__option--selected")) ||
        ($highlighted[0] && $highlighted[0].classList && $highlighted[0].classList.contains("select2-results__option--selected"))
      ) {
        self.trigger("close", {});
      } else {
        self.trigger("select", {
          data: data,
        });
      }
    });

    container.on("results:previous", function () {
      var $highlighted = self.getHighlightedResults();
      var element = $highlighted[0] ? $highlighted[0]: $highlighted;
      var $options = self.results.querySelectorAll(
        ".select2-results__option--selectable"
      );
      var currentIndex = Array.prototype.indexOf.call(
        $options,
        element
      );
      if (currentIndex <= 0) {
        return;
      }

      var nextIndex = currentIndex - 1;

      if ($highlighted.length === 0) {
        nextIndex = 0;
      }

      var $next = $options[nextIndex];

      $next.dispatchEvent(new Event("mouseenter"));

      var currentOffset = self.results.getBoundingClientRect().top;
      var nextTop = $next.getBoundingClientRect().top;
      var nextOffset = self.results.scrollTop + (nextTop - currentOffset);

      if (nextIndex === 0) {
        self.results.scrollTop = 0;
      } else if (nextTop - currentOffset < 0) {
        self.results.scrollTop = nextOffset;
      }
    });

    container.on("results:next", function () {
      var $highlighted = self.getHighlightedResults();
      var element = $highlighted[0] ? $highlighted[0]: $highlighted;
      var $options = self.results.querySelectorAll(
        ".select2-results__option--selectable"
      );

      var currentIndex = Array.prototype.indexOf.call(
        $options,
        element
      );

      var nextIndex = currentIndex + 1;

      if (nextIndex >= $options.length) {
        return;
      }

      var $next = $options[nextIndex];

      $next.dispatchEvent(new Event("mouseenter"));

      var currentOffset =
        self.results.getBoundingClientRect().top +
        self.results.offsetHeight;
      var nextBottom =
        $next.getBoundingClientRect().top + $next.offsetHeight;
      var nextOffset = self.results.scrollTop + nextBottom - currentOffset;

      if (nextIndex === 0) {
        self.results.scrollTop = 0;
      } else if (nextBottom > currentOffset) {
        self.results.scrollTop = nextOffset;
      }
    });

    container.on("results:focus", function (params) {
      params.element.classList.add("select2-results__option--highlighted");
      params.element.setAttribute("aria-selected", "true");
    });

    container.on("results:message", function (params) {
      self.displayMessage(params);
    });

    this.results.addEventListener("mouseup", function (evt) {
        var options = self.results.querySelectorAll(
          ".select2-results__option--selectable"
        );
    });

    this.results.addEventListener("mouseenter", function (evt) {
      var options = self.results.querySelectorAll(
        ".select2-results__option--selectable"
      );

      options.forEach(function (option) {
        option.addEventListener("mouseenter", function (evt) {
          var data = Utils.GetData(option, "data");
          self.getHighlightedResults().forEach(function (highlighted) {
            highlighted.classList.remove(
              "select2-results__option--highlighted"
            );
            highlighted.setAttribute("aria-selected", "false");
          });
          self.trigger("results:focus", {
            data: data,
            element: option,
          });
        });

        option.addEventListener("mousedown", function (evt) {
          var data = Utils.GetData(option, "data");
          if (this.classList.contains("select2-results__option--selected")) {
            if (self.options.get("multiple")) {
              self.trigger("unselect", {
                originalEvent: evt,
                data: data,
              });
            } else {
              self.trigger("close", {
                originalEvent: evt,
                data: data,
              });
            }
          }
          // return;

          self.trigger("select", {
            originalEvent: evt,
            data: data,
          });
        })
      });

    });
  };

  Results.prototype.getHighlightedResults = function () {
    var $highlighted = this.results.querySelectorAll(
      ".select2-results__option--highlighted"
    );

    return $highlighted;
  };

  Results.prototype.destroy = function () {
    this.results.remove();
  };

  Results.prototype.ensureHighlightVisible = function () {
    var $highlighted = this.getHighlightedResults();

    if ($highlighted.length === 0 || $highlighted === null) {
      return;
    }

    var $options = this.results.querySelectorAll(
      ".select2-results__option--selectable"
    );

    var currentIndex = Array.prototype.indexOf.call($options, $highlighted);

    var currentOffset = this.results.getBoundingClientRect().top;
    try {
      var nextTop = $highlighted.getBoundingClientRect().top;
    } catch (error) {
      var nextTop = 0;
    }
    var nextOffset = this.results.scrollTop + (nextTop - currentOffset);

    var offsetDelta = nextTop - currentOffset;
    nextOffset -= $highlighted.offsetHeight * 2;

    if (currentIndex <= 2) {
      this.results.scrollTop = 0;
    } else if (offsetDelta > this.results.offsetHeight || offsetDelta < 0) {
      this.results.scrollTop = nextOffset;
    }
  };

  Results.prototype.template = function (result, container) {
    var template = this.options.get("templateResult");
    var escapeMarkup = this.options.get("escapeMarkup");

    var content = template(result, container);

    if (content == null) {
      container.style.display = "none";
    } else if (typeof content === "string") {
      container.innerHTML = escapeMarkup(content);
    } else {
      container.appendChild(content);
    }
  };

  return Results;
});
