define([
  'jquery',
  '../utils'
], function ($, Utils) {
  
  var DATA_SELECTION_ORDER_ATTRNAME = 'data-selection-order';
  var DATA_DISPLAY_ORDER_ATTRNAME = 'data-display-order';
  
  /**
   * Decorator for DataAdapters to maintain selection ordering and
   * return that order in the control value.
   *
   * This class has to keep both display and selection ordering for
   * all options in order to manage selection order, while maintaining
   * the default results/query ordering (when `sorter` is not used, etc).
   *
   * Options are also physically rearranged in the DOM in order to support
   * direct DOM `<select>` value retrieval or via `jQuery.val()`.
   *
   * Can pull initial display and selection ordering from 'data-display-order'
   * and 'data-selection-order' HTML attributes respectively. After reading
   * these attributes, they are synced into the option's item/data and removed.
   *
   * @param decorated
   * @param $element
   * @param options
   * @constructor
   */
  function SelectionOrder (decorated, $element, options) {

    this.keepSelectionOrder = options.get('keepSelectionOrder');

    // Should we try to track manual selection changes to preserve ordering as
    // best as possible. It is easy to track user selection order through the
    // control itself, but externally via DOM or jQuery has some challenges,
    // and has some performance overheads.
    this.trackManualSelectionOrder = options.get('trackManualSelectionOrder');
    if (this.trackManualSelectionOrder == null) {
      this.trackManualSelectionOrder = true;
    }

    decorated.call(this, $element, options);
  }


  SelectionOrder.prototype.bind = function (decorated, container, $container) {
    var self = this;
    decorated.call(this, container, $container);

    // Initialize initial set of DOM options
    if (this.keepSelectionOrder) {
      // Prepare initial DOM options with display/selection order attributes.
      self._handleChange();

      if (this.trackManualSelectionOrder) {
        self.$element.on('change', function() {
          self._handleChange();
        });
      }
    }
  };


  /**
   * Register change handler on container (select) to monitor for manual
   * changes made to selections or display order via DOM/jQuery.
   *
   * Any options selected before the change event may lose their relative
   * order unfortunately:
   * For example, `$select.val(['3','2','1']).trigger('change')` will
   * not be able to track the value order, but will fallback to DOM option
   * order essentially.  Any values previously selected will also keep
   * their previous selection order. A call to `val([]).trigger("change")`
   * first can help with that to clear all previous selection orders.
   *
   * Note: jQuery.valHooks could be used to "monitor" for individual changes,
   * however that approach is generally discouraged.
   * Note: MutationObservers would have been ideal, but they don't notify
   * on `option.selected` property changes either.
   *
   * @private
   */
  SelectionOrder.prototype._handleChange = function() {
    var self = this;
    var selectedOpts = [];
    var newOrder = (new Date()).getTime();

    self.$element.children('option').each(function (i) {
      var $this = $(this);
      var data = self.item($this);

      // Sync DOM into data, if needed
      var displayOrderAttr = $this.attr(DATA_DISPLAY_ORDER_ATTRNAME);
      if (displayOrderAttr != null) {
        data.displayOrder = displayOrderAttr;
        $this.attr(DATA_DISPLAY_ORDER_ATTRNAME, null);
      }
      else if (data.displayOrder == null) {
        data.displayOrder = i;
      }

      var selectionOrderAttr = $this.attr(DATA_SELECTION_ORDER_ATTRNAME);
      if (selectionOrderAttr != null) {
        data.selectionOrder = selectionOrderAttr;
        $this.attr(DATA_SELECTION_ORDER_ATTRNAME, null);
      }

      data.selected = this.selected;
      if (data.selected) {
        selectedOpts.push(data);

        // Ensure selection order is set (and unique between items)
        if (data.selectionOrder == null) {
          data.selectionOrder = newOrder + i;
        }
      }
      else {
        // Ensure unselected state synced
        if (data.selectionOrder != null) {
          delete data.selectionOrder;
        }
      }
    });


    // Sort selected options last (in order) in DOM
    if (selectedOpts.length) {
      var selectedOptsSorted = self.selectionSorter(selectedOpts.slice(0));

      var orderChanged = false;
      for (var i = 0; i < selectedOptsSorted.length; i++) {
        // Reset to simple ordering (not date-based)
        selectedOptsSorted[i].selectionOrder = i;

        if (selectedOpts[i].id !== selectedOptsSorted[i].id) {
          orderChanged = true;
        }
      }

      if (orderChanged) {
        $.each(selectedOptsSorted, function (i, data) {
          $(data.element).detach();
          self.$element.append(data.element);
        });
      }
    }
  };


  SelectionOrder.prototype.current = function (decorated, callback) {
    var self = this;

    function currentDataCallback(data) {
      if (self.keepSelectionOrder) {
        // Sort data based on selectionSorter before calling original callback
        data = self.selectionSorter(data);
      }

      callback(data);
    }

    decorated.call(this, currentDataCallback);
  };


  SelectionOrder.prototype.select = function (decorated, data) {
    if (this.keepSelectionOrder) {
      var newOrder = (new Date()).getTime();

      var $opt = this.getElementFromData(data);
      if ($opt && $opt.length) {
        // In order to support jquery `val` and preserve selection
        // order, we need to physically move selected option to the end
        $opt.detach();
        this.$element.append($opt);

        // Get full data from option
        data = this.item($opt);
      }

      // Use current time as ordering key
      data.selectionOrder = newOrder;
    }

    decorated.call(this, data);
  };


  SelectionOrder.prototype.unselect = function (decorated, data) {
    if (this.keepSelectionOrder) {
      var $opt = this.getElementFromData(data);
      if ($opt && $opt.length) {
        // Get full data from option
        data = this.item($opt);
      }

      if (data.selectionOrder !== undefined) {
        delete data.selectionOrder;
      }
    }

    decorated.call(this, data);
  };


  SelectionOrder.prototype.query = function (decorated, params, callback) {
    var self = this;

    function queryCallback(data) {
      if (self.keepSelectionOrder) {
        // Sort data based on display order, not adjusted order.
        // Results/sorter may sort results into more desired order later though.
        data.results = self.queryResultSorter(data.results);
      }

      callback(data);
    }

    decorated.call(this, params, queryCallback);
  };


  SelectionOrder.prototype.addOptions = function (decorated, $options) {
    var maxDisplayOrder = 0;
    if (this.keepSelectionOrder) {
      // Get max display order in collection
      this.$element.children('option').each(function() {
        var order = this.getAttribute(DATA_DISPLAY_ORDER_ATTRNAME);
        maxDisplayOrder = Math.max(
          maxDisplayOrder,
          (order ? parseInt(order, 10) : 0)
        );
      });
    }

    decorated.call(this, $options);

    if (this.keepSelectionOrder) {
      if (!Array.isArray($options)) {
        $options = [$options];
      }

      for (var i = 0; i < $options.length; i++) {
        var $opt = $options[i];
        var data = this.item($opt);

        if (data.displayOrder === undefined) {
          data.displayOrder = maxDisplayOrder + 1 + i;
        }

        if (data.selected && data.selectionOrder === undefined) {
          data.selectionOrder = (new Date()).getTime();
        }
      }
    }
  };


  /**
   * Get the DOM option given the option data
   * @param _
   * @param data Option's data object, which may be incomplete.
   * @returns {null|*}
   */
  SelectionOrder.prototype.getElementFromData = function(_, data) {
    if (data.element) {
      return data.element;
    }
    else if (data.id) {
      var idValue = data.id.toString();
      return this.$element.find('option').filter(function (i, elm) {
        return elm.value == idValue;
      });
    }
    return null;
  };


  var createPropSorter = function(propName) {
    /**
     * Sorter for objects by a given property name like 'selectionOrder'.
     * Sort ordered items first, then leave all others in same order as original
     */
    return function (a, b) {
      var aVal = a[propName],
          bVal = b[propName];

      if (aVal != null && bVal != null) {
        return aVal - bVal;
      } else if (aVal != null) {
        return -1;
      } else if (bVal != null) {
        return 1;
      }
      return 0;
    };
  };

  SelectionOrder.prototype.selectionSorter = function (_, data) {
    return data.sort(createPropSorter('selectionOrder'));
  };


  /**
   * Sort the query results based on original option display order
   * @param _
   * @param data
   * @returns {*}
   */
  SelectionOrder.prototype.queryResultSorter = function(_, data) {
    return data.sort(createPropSorter('displayOrder'));
  };

  return SelectionOrder;
});
