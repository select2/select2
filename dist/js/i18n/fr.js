(function(){if(window.define)var e=window.define;if(window.require)var t=window.require;if(window.jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var e=jQuery.fn.select2.amd.define,t=jQuery.fn.select2.amd.require;e("select2/i18n/fr",[],function(){return{inputTooLong:function(e){var t=e.input.length-e.maximum,n="Supprimez "+t+" caractère";return t!==1&&(n+="s"),n},inputTooShort:function(e){var t=e.minimum-e.input.length,n="Saisissez "+t+" caractère";return t!==1&&(n+="s"),n},loadingMore:function(){return"Chargement de résultats supplémentaires…"},maximumSelection:function(e){var t="Vous pouvez seulement sélectionner "+e.maximum+" élément";return e.maximum!==1&&(t+="s"),t},noResults:function(){return"Aucun résultat trouvé"},searching:function(){return"Recherche en cours…"}}}),t("Select2"),jQuery.fn.select2.amd={define:e,require:t}})();