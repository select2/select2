/**
 * Select2 Bootstrap styling.
 */
(function ($, undefined) {
    "use strict";

    // Expected to be merged with the base classes in prepareOpts to get the Bootstrap look&feel.
    // When extended, pay attention that the Bootstrap theme is based on the native one.
    $.fn.select2.defaults.classes_bootstrap = $.extend({}, $.fn.select2.defaults.classes_native, {
        "choice": $.fn.select2.defaults.classes_native["choice"] + " select2-choice-bootstrap",
        "container": $.fn.select2.defaults.classes_native["container"] + " select2-container-bootstrap",
        "container-active": $.fn.select2.defaults.classes_native["container-active"] + " select2-container-active-bootstrap",
        "container-multi": $.fn.select2.defaults.classes_native["container-multi"] + " select2-container-multi-bootstrap",
        "dropdown-open": $.fn.select2.defaults.classes_native["dropdown-open"] + " select2-dropdown-open-bootstrap"
    });

    $.fn.select2.defaults.theme_default = "bootstrap";

}(jQuery));
