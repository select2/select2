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
    decorated.call(this, container, $container);

    // Initialize initial set of DOM options
    if (this.keepSelectionOrder) {
      this._prepareInitialOptions();
      if (this.trackManualSelectionOrder) {
        this._registerChangeHandler();
      }
    }
  };


  /**
   * Prepare initial DOM options with display/selection order attributes
   * @private
   */
  SelectionOrder.prototype._prepareInitialOptions = function() {
      var self = this;
      var selectedOpts = [];
      self.$element.children('option').each(function (i) {
        var $this = $(this);
        // Set default display order
        $this.attr(DATA_DISPLAY_ORDER_ATTRNAME, i);

        if (this.selected) {
          selectedOpts.push($this);
        }
      });

      // Sort selected options last (in order) in DOM
      if (selectedOpts.length) {
        selectedOpts = selectedOpts.sort(
          createJqAttrSorter(DATA_SELECTION_ORDER_ATTRNAME)
        );

        $.each(selectedOpts, function(i, $opt) {
          // Ensure data and selection order is set for all selected
          var data = Utils.GetData($opt[0], 'data');
          if (data) {
            data.selectionOrder = i;
          }
          $opt.attr(DATA_SELECTION_ORDER_ATTRNAME, i);

          $opt.detach();
          self.$element.append($opt);
        });
      }
  };


  /**
   * Register change handler on container (select) to monitor for manual
   * changes made to selections via DOM/jQuery.
   *
   * Any options selected before the change event may lose their relative
   * order unfortunately:
   * For example, `$select.val(['3','2','1']).trigger('change')` will
   * not be able to track the value order, but will fallback to DOM option
   * order essentially.
   *
   * jQuery.valHooks could be used to "monitor" for individual changes, however
   *
   *
   * @private
   */
  SelectionOrder.prototype._registerChangeHandler = function() {
    var self = this;
    self.$element.on('change', function() {
      var selectedOpts = [];
      var updatedSelectedOrder = false;

      self.$element.children('option').each(function (i) {
        var $this = $(this);
        var selectionOrder = this.getAttribute(DATA_SELECTION_ORDER_ATTRNAME);
        var data;

        if (this.selected) {
          selectedOpts.push($this);
          // Ensure selection order is set
          if (selectionOrder == null) {
            var newOrder = (new Date()).getTime();
            this.setAttribute(DATA_SELECTION_ORDER_ATTRNAME, newOrder);
            
            data = self.item($this);
            data.selectionOrder = newOrder;

            updatedSelectedOrder = true;
          }
        }
        else if (selectionOrder != null) {
          // Ensure selection order is unset
          this.removeAttribute(DATA_SELECTION_ORDER_ATTRNAME);

          data = self.item($this);
          if (data.selectionOrder != null) {
            delete data.selectionOrder;
          }
        }
      });


      if (updatedSelectedOrder) {
        // Sort selected options last (in order) in DOM
        if (selectedOpts.length) {
          selectedOpts = selectedOpts.sort(
            createJqAttrSorter(DATA_SELECTION_ORDER_ATTRNAME)
          );

          $.each(selectedOpts, function (i, $opt) {
            // Ensure data and selection order is set for all selected
            var data = Utils.GetData($opt[0], 'data');
            if (data) {
              data.selectionOrder = i;
            }
            $opt.attr(DATA_SELECTION_ORDER_ATTRNAME, i);

            $opt.detach();
            self.$element.append($opt);
          });
        }
      }

    });
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

        $opt.attr(DATA_SELECTION_ORDER_ATTRNAME, newOrder);
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
        $opt.attr(DATA_SELECTION_ORDER_ATTRNAME, null);

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
        // Sort data based on original option order, not adjusted order.
        // Results/sorter may sort results into more desired order later though.
        data.results = self.queryResultSorter(data.results);
      }

      callback(data);
    }

    decorated.call(this, params, queryCallback);
  };


  SelectionOrder.prototype.addOptions = function (decorated, $options) {
    decorated.call(this, $options);

    if (this.keepSelectionOrder) {
      // Add new option at the end
      var $lastOpt = this.$element.children('option').last();
      var nextOrder = parseInt(
        $lastOpt.attr(DATA_DISPLAY_ORDER_ATTRNAME) || '0',
        10
      ) + 1;
      for (var i = 0; i < $options.length; i++) {
        var $opt = $options[i];
        $opt.attr(DATA_DISPLAY_ORDER_ATTRNAME, nextOrder + i);
      }
    }
  };


  SelectionOrder.prototype.item = function (decorated, $option) {
    var data = decorated.call(this, $option);

    if (this.keepSelectionOrder) {
      var attrValue;

      // if `option` item
      if (data.id != null) {
        // Default selection order using `data-selection-order` attrib
        if (data.selectionOrder === undefined) {
          attrValue = $option.attr(DATA_SELECTION_ORDER_ATTRNAME);
          if (attrValue != null) {
            data.selectionOrder = parseInt(attrValue,10);
          }
        }

        // Default option/result display order using `data-display-order` attrib
        if (data.displayOrder === undefined) {
          attrValue = $option.attr(DATA_DISPLAY_ORDER_ATTRNAME);
          if (attrValue != null) {
            data.displayOrder = parseInt(attrValue, 10);
          }
        }
      }
    }

    return data;
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

  var createJqAttrSorter = function(attrName) {
    /**
     * Sorter for JQuery objects by a given attr name
     * Sort ordered items first, then leave all others in same order as original
     */
    return function ($a, $b) {
      var aVal = $a.attr(attrName),
          bVal = $b.attr(attrName);

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
