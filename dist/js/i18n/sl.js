/*! Select2 4.0.3 | https://github.com/select2/select2/blob/master/LICENSE.md */

(function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var e=jQuery.fn.select2.amd;return e.define("select2/i18n/sl",[],function(){return{errorLoading:function(){return"Zadetkov iskanja ni bilo mogoče pridobiti."},inputTooLong:function(n){var i=n.input.length-n.maximum,e="Prosim zbrišite "+i+" znak";return 2==i?e+="a":1!=i&&(e+="e"),e},inputTooShort:function(n){var i=n.minimum-n.input.length,e="Prosim vpišite še vsaj "+i+" znak";return 2==i?e+="a":1!=i&&(e+="e"),e},loadingMore:function(){return"Nalagam več zadetkov…"},maximumSelected:function(n){var i="Označite lahko največ "+n.maximum+" predmet";return 2==n.maximum?i+="a":1!=n.maximum&&(i+="e"),i},noResults:function(){return"Ni zadetkov."},searching:function(){return"Iščem…"}}}),{define:e.define,require:e.require}})();
