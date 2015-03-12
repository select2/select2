/*!
 * Select2 4.0.0-rc.1 - Thu, 12 Mar 2015 00:26:05 GMT
 * https://select2.github.io
 *
 * Released under the MIT license
 * https://github.com/select2/select2/blob/master/LICENSE.md
 */

(function(){if(window.define)var e=window.define;if(window.require)var t=window.require;if(window.jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var e=jQuery.fn.select2.amd.define,t=jQuery.fn.select2.amd.require;e("select2/i18n/nb",[],function(){return{inputTooLong:function(e){var t=e.input.length-e.maximum;return"Vennligst fjern "+t+" tegn"},inputTooShort:function(e){var t=e.minimum-e.input.length,n="Vennligst skriv inn ";return t>1?n+=" flere tegn":n+=" tegn til",n},loadingMore:function(){return"Laster flere resultater…"},maximumSelection:function(e){return"Du kan velge maks "+e.maximum+" elementer"},noResults:function(){return"Ingen treff"},searching:function(){return"Søker…"}}}),t("jquery.select2"),jQuery.fn.select2.amd={define:e,require:t}})();