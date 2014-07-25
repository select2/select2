/**
 * Select2 jQuery UI styling.
 */
(function ($, undefined) {
    "use strict";

    // Expected to be merged with the base classes in prepareOpts to get the jQuery UI look&feel.
    $.fn.select2.defaults["classes_jquery-ui"] = {
        // If ui-corner-right is wanted, to outline the dropdown arrow,
        // the arrow class would have to be split to -ltr and -rtl
        // variants.  The -rtl variant would be be set to ui-corned-left.
        "arrow": "ui-widget-content ui-corner-all",
        "arrow-icon": "ui-icon ui-icon-triangle-1-s",
        "container": "ui-widget ui-widget-content ui-corner-all",
        "drop": "ui-widget ui-widget-content ui-corner-bottom",
        "dropdown-closed": "ui-corner-all",
        "dropdown-open": "ui-corner-top",
        "dropicon-closed": "ui-icon-triangle-1-s",
        "dropicon-open": "ui-icon-triangle-1-n",
        "highlighted": "ui-state-hover",
        "input": "ui-widget-content ui-corner-all",
        "result-selectable" :"ui-corner-all",
        "search-choice": "ui-state-default ui-corner-all",
        "search-choice-close": "ui-icon ui-icon-close"
    };

}(jQuery));
