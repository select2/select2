S2.define('select2/data/array',["./select", "../utils"], function (SelectAdapter, Utils) {
  function ArrayAdapter($element, options) {
    this._dataToConvert = options.get("data") || [];

    ArrayAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(ArrayAdapter, SelectAdapter);

  ArrayAdapter.prototype.bind = function (container, $container) {
    ArrayAdapter.__super__.bind.call(this, container, $container);

    this.addOptions(this.convertToOptions(this._dataToConvert));
  };

  ArrayAdapter.prototype.select = function (data) {
    // Ensure `option` is correctly filtered
    let options = Array.from(this.element.querySelectorAll("option"));

    let option = options.find((option) => option.value === data.id.toString());

    if (!option) {
      // Create a new `option` if not found
      option = this.option(data);
      this.element.appendChild(option);
    }

    option.selected = true;

    // Dispatch `input` and `change` events
    this.element.dispatchEvent(new Event("input"));
    this.element.dispatchEvent(new Event("change"));
  };

  ArrayAdapter.prototype.convertToOptions = function (data) {
    const existingOptions = Array.from(this.element.querySelectorAll("option"));
    const existingIds = new Set(existingOptions.map((option) => option.value));

    const newOptions = [];

    data.forEach((item) => {
      const normalizedItem = this._normalizeItem(item);

      if (!existingIds.has(normalizedItem.id)) {
        const option = this.option(normalizedItem);

        if (normalizedItem.children) {
          const childOptions = this.convertToOptions(normalizedItem.children);
          childOptions.forEach((child) => option.appendChild(child));
        }

        newOptions.push(option);
      }
    });

    return newOptions;
  };

  return ArrayAdapter;
});
