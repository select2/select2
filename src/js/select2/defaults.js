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
  './data/minimumInputLength',

  './dropdown',
  './dropdown/search',
  './dropdown/hidePlaceholder',
  './dropdown/infiniteScroll',

  './i18n/en',
  './compat/matcher'
], function ($, ResultsList,
             SingleSelection, MultipleSelection, Placeholder,
             Utils, Translation,
             SelectData, ArrayData, AjaxData, Tags, MinimumInputLength,
             Dropdown, Search, HidePlaceholder, InfiniteScroll,
             EnglishTranslation) {
  function Defaults () {
    this.reset();
  }

  Defaults.prototype.apply = function (options) {
    options = $.extend({}, this.defaults, options);

    if (options.dataAdapter == null) {
      if (options.ajax != null) {
        options.dataAdapter = AjaxData;
      } else if (options.data != null) {
        options.dataAdapter = ArrayData;
      } else {
        options.dataAdapter = SelectData;
      }
    }


    if (options.minimumInputLength > 0) {
      options.dataAdapter = Utils.Decorate(
        options.dataAdapter,
        MinimumInputLength
      );
    }

    if (options.tags != null) {
      options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
    }

    if (options.resultsAdapter == null) {
      options.resultsAdapter = ResultsList;

      if (options.ajax != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          InfiniteScroll
        );
      }

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
    function matcher (params, data) {
      var match = $.extend(true, {}, data);

      if (data.children) {
        for (var c = data.children.length - 1; c >= 0; c--) {
          var child = data.children[c];

          var matches = matcher(params, child);

          // If there wasn't a match, remove the object in the array
          if (matches === null) {
            match.children.splice(c, 1);
          }
        }

        if (match.children.length > 0) {
          return match;
        }
      }

      if ($.trim(params.term) === '') {
        return match;
      }

      if (data.text.toUpperCase().indexOf(params.term.toUpperCase()) > -1) {
        return match;
      }

      return null;
    }

    this.defaults = {
      language: ['select2/i18n/en'],
      matcher: matcher,
      minimumInputLength: 0,
      templateResult: function (result) {
        return result.text;
      },
      templateSelection: function (selection) {
        return selection.text;
      }
    };
  };

  var defaults = new Defaults();

  return defaults;
});
