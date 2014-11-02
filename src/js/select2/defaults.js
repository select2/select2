define([
  'jquery',
  './results',

  './selection/single',
  './selection/multiple',
  './selection/placeholder',

  './utils',
  './translation',

  './data/select',
  './data/array',
  './data/ajax',
  './data/tags',

  './dropdown',
  './dropdown/search',
  './dropdown/hidePlaceholder',

  './i18n/en'
], function ($, ResultsList,
             SingleSelection, MultipleSelection, Placeholder,
             Utils, Translation,
             SelectData, ArrayData, AjaxData, Tags,
             Dropdown, Search, HidePlaceholder,
             EnglishTranslation) {
  function Defaults () {
    this.reset();
  }

  Defaults.prototype.apply = function (options) {
    options = $.extend({}, this.defaults, options);

    if (options.dataAdapter == null) {
      if (options.ajax) {
        options.dataAdapter = AjaxData;
      } else if (options.data) {
        options.dataAdapter = ArrayData;
      } else {
        options.dataAdapter = SelectData;
      }
    }

    if (options.tags != null) {
      options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
    }

    if (options.resultsAdapter == null) {
      options.resultsAdapter = ResultsList;

      if (options.placeholder != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          HidePlaceholder
        );
      }
    }

    if (options.dropdownAdapter == null) {
      var SearchableDropdown = Utils.Decorate(Dropdown, Search);

      options.dropdownAdapter = SearchableDropdown;
    }

    if (options.selectionAdapter == null) {
      if (options.multiple) {
        options.selectionAdapter = MultipleSelection;
      } else {
        options.selectionAdapter = SingleSelection;
      }

      // Add the placeholder mixin if a placeholder was specified
      if (options.placeholder != null) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          Placeholder
        );
      }
    }

    if (typeof options.language === 'string') {
      options.language = [options.language];
    }

    if ($.isArray(options.language)) {
      var languages = new Translation();
      var languageNames = options.language.concat(this.defaults.language);

      for (var l = 0; l < languageNames.length; l++) {
        var name = languageNames[l];
        var language = {};

        try {
          // Try to load it with the original name
          language = Translation.loadPath(name);
        } catch (e) {
          // If we couldn't load it, check if it wasn't the full path
          name = 'select2/i18n/' + name;
          language = Translation.loadPath(name);
        }

        languages.extend(language);
      }

      options.translations = languages;
    } else {
      options.translations = new Translations(options.language);
    }

    return options;
  };

  Defaults.prototype.reset = function () {
    this.defaults = {
      language: ['select2/i18n/en'],
      templateResult: function (result) {
        return result.text;
      }
    };
  };

  var defaults = new Defaults();

  return defaults;
});
