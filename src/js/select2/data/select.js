define([
  './base',
  '../utils'
], function (BaseAdapter, Utils) {
  function SelectAdapter(element, options) {
    this.element = element;
    this.options = options;

    SelectAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(SelectAdapter, BaseAdapter);

  SelectAdapter.prototype.current = function (callback) {
    var self = this;

    var data = Array.prototype.map.call(
      this.element.querySelectorAll(":checked"),
      function (selectedElement) {
        return self.item(selectedElement);
      }
    );

    callback(data);
  };

  SelectAdapter.prototype.select = function (data) {
    var self = this;

    data.selected = true;

    // If data.element is a DOM node, use it instead
    if (
      data.element != null &&
      data.element.tagName.toLowerCase() === "option"
    ) {
      data.element.selected = true;

      this.element.dispatchEvent(new Event("input"));
      this.element.dispatchEvent(new Event("change"));

      return;
    }

    if (this.element.multiple) {
      this.current(function (currentData) {
        var val = [];

        data = [data];
        data.push.apply(data, currentData);

        for (var d = 0; d < data.length; d++) {
          var id = data[d].id;

          if (val.indexOf(id) === -1) {
            val.push(id);
          }

          // Find the corresponding <option> element and mark it as selected
          var option = Array.from(self.element.options).find(option => option.value === id);
          if (option) {
            option.selected = true;
          }
        }

        // Dispatch events to notify the change
        self.element.dispatchEvent(new Event("input"));
        self.element.dispatchEvent(new Event("change"));
      });
    } else {
      var val = data.id;

      // Find the corresponding <option> element and mark it as selected
      var option = Array.from(this.element.options).find(option => option.value === val);
      if (option) {
        option.selected = true;
      }

      this.element.dispatchEvent(new Event("input"));
      this.element.dispatchEvent(new Event("change"));
    }
  };

  SelectAdapter.prototype.unselect = function (data) {
    var self = this;

    if (!this.element.multiple) {
      return;
    }

    data.selected = false;

    if (
      data.element != null &&
      data.element.tagName.toLowerCase() === "option"
    ) {
      data.element.selected = false;

      this.element.dispatchEvent(new Event("input"));
      this.element.dispatchEvent(new Event("change"));

      return;
    }

    this.current(function (currentData) {
      var val = [];

      for (var d = 0; d < currentData.length; d++) {
        var id = currentData[d].id;

        if (id !== data.id && val.indexOf(id) === -1) {
          val.push(id);
        }
      }

      self.element.value = val;

      self.element.dispatchEvent(new Event("input"));
      self.element.dispatchEvent(new Event("change"));
    });
  };

  SelectAdapter.prototype.bind = function (container) {
    var self = this;

    this.container = container;

    container.on("select", function (params) {
      self.select(params.data);
    });

    container.on("unselect", function (params) {
      self.unselect(params.data);
    });
  };

  SelectAdapter.prototype.destroy = function () {
    // Remove anything added to child elements
    var elements = this.element.querySelectorAll("*");
    elements.forEach(function (el) {
      // Remove any custom data set by Select2
      Utils.RemoveData(el);
    });
  };

  SelectAdapter.prototype.query = function (params, callback) {
    var data = [];
    var self = this;

    var options = this.element.children;

    Array.prototype.forEach.call(options, function (option) {
      if (
        option.tagName.toLowerCase() !== "option" &&
        option.tagName.toLowerCase() !== "optgroup"
      ) {
        return;
      }

      var item = self.item(option);

      var matches = self.matches(params, item);

      if (matches !== null) {
        data.push(matches);
      }
    });

    callback({
      results: data,
    });
  };

  SelectAdapter.prototype.addOptions = function (options) {
    var self = this;
    options.forEach(function (option) {
      self.element.appendChild(option);
    });
  };

  SelectAdapter.prototype.option = function (data) {
    var option;

    if (data.children) {
      option = document.createElement("optgroup");
      option.label = data.text;
    } else {
      option = document.createElement("option");

      if (option.textContent !== undefined) {
        option.textContent = data.text;
      } else {
        option.innerText = data.text;
      }
    }

    if (data.id !== undefined) {
      option.value = data.id;
    }

    if (data.disabled) {
      option.disabled = true;
    }

    if (data.selected) {
      option.selected = true;
    }

    if (data.title) {
      option.title = data.title;
    }

    var normalizedData = this._normalizeItem(data);
    normalizedData.element = option;

    // Override the option's data with the combined data
    Utils.StoreData(option, "data", normalizedData);

    return option;
  };

  SelectAdapter.prototype.item = function (option) {
    var data = {};

    data = Utils.GetData(option, "data");

    if (data != null) {
      return data;
    }

    if (option.tagName.toLowerCase() === "option") {
      data = {
        id: option.value,
        text: option.textContent,
        disabled: option.disabled,
        selected: option.selected,
        title: option.title,
      };
    } else if (option.tagName.toLowerCase() === "optgroup") {
      data = {
        text: option.label,
        children: [],
        title: option.title,
      };

      var children = option.querySelectorAll("option");
      var childrenData = [];

      Array.prototype.forEach.call(
        children,
        function (child) {
          var childData = this.item(child);
          childrenData.push(childData);
        },
        this
      );

      data.children = childrenData;
    }

    data = this._normalizeItem(data);
    data.element = option;

    Utils.StoreData(option, "data", data);

    return data;
  };

  SelectAdapter.prototype._normalizeItem = function (item) {
    if (item !== Object(item)) {
      item = {
        id: item,
        text: item,
      };
    }

    item = Object.assign(
      {},
      {
        text: "",
      },
      item
    );

    var defaults = {
      selected: false,
      disabled: false,
    };

    if (item.id != null) {
      item.id = item.id.toString();
    }

    if (item.text != null) {
      item.text = item.text.toString();
    }
    if (item._resultId == null && item.id && this.container != null) {
      item._resultId = this.generateResultId(this.container, item);
    }

    if (item.children) {
      item.children = item.children.map(
        SelectAdapter.prototype._normalizeItem
      );
    }

    return Object.assign({}, defaults, item);
  };

  SelectAdapter.prototype.matches = function (params, data) {
    var matcher = this.options.get("matcher");

    return matcher(params, data);
  };

  return SelectAdapter;
});
