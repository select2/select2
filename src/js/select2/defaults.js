define([
  'jquery',
  'require',

  './results',

  './selection/single',
  './selection/multiple',
  './selection/placeholder',
  './selection/allowClear',
  './selection/search',
  './selection/eventRelay',

  './utils',
  './translation',
  './diacritics',

  './data/select',
  './data/array',
  './data/ajax',
  './data/tags',
  './data/tokenizer',
  './data/minimumInputLength',
  './data/maximumInputLength',
  './data/maximumSelectionLength',

  './dropdown',
  './dropdown/search',
  './dropdown/hidePlaceholder',
  './dropdown/infiniteScroll',
  './dropdown/attachBody',
  './dropdown/minimumResultsForSearch',
  './dropdown/selectOnClose',
  './dropdown/closeOnSelect',

  './i18n/en'
], function ($, require,

             ResultsList,

             SingleSelection, MultipleSelection, Placeholder, AllowClear,
             SelectionSearch, EventRelay,

             Utils, Translation, DIACRITICS,

             SelectData, ArrayData, AjaxData, Tags, Tokenizer,
             MinimumInputLength, MaximumInputLength, MaximumSelectionLength,

             Dropdown, DropdownSearch, HidePlaceholder, InfiniteScroll,
             AttachBody, MinimumResultsForSearch, SelectOnClose, CloseOnSelect,

             EnglishTranslation) {
  function Defaults () {
    this.reset();
  }

  Defaults.prototype.apply = function (options) {
    options = $.extend(true, {}, this.defaults, options);

    function constructAdapter (type, getBase, loadDecorators) {
      var adapterName = type + 'Adapter';
      var AdapterClass = options[adapterName];
      var decorators = [];

      if (AdapterClass == null) {
        AdapterClass = getBase();
        loadDecorators(decorators);
      }

      var decorator = options[type + 'Decorator'];
      if (decorator != null) {
        decorators.push(decorator);
      }

      $.each(decorators, function (i, DecoratorClass) {
        AdapterClass = Utils.Decorate(AdapterClass, DecoratorClass);
      });

      options[adapterName] = AdapterClass;
    }

    constructAdapter('data', function () {
      return options.ajax != null ? AjaxData :
        options.data != null ? ArrayData :
          SelectData;
    }, function (decorators) {

      if (options.minimumInputLength > 0) {
        decorators.push(MinimumInputLength);
      }

      if (options.maximumInputLength > 0) {
        decorators.push(MaximumInputLength);
      }

      if (options.maximumSelectionLength > 0) {
        decorators.push(MaximumSelectionLength);
      }

      if (options.tags) {
        decorators.push(Tags);
      }

      if (options.tokenSeparators != null || options.tokenizer != null) {
        decorators.push(Tokenizer);
      }

      if (options.query != null) {
        var Query = require(options.amdBase + 'compat/query');

        decorators.push(Query);
      }

      if (options.initSelection != null) {
        var InitSelection = require(options.amdBase + 'compat/initSelection');

        decorators.push(InitSelection);
      }
    });

    constructAdapter('results', function () {
      return ResultsList;
    }, function (decorators) {

      if (options.ajax != null) {
        decorators.push(InfiniteScroll);
      }

      if (options.placeholder != null) {
        decorators.push(HidePlaceholder);
      }

      if (options.selectOnClose) {
        decorators.push(SelectOnClose);
      }
    });

    constructAdapter('dropdown', function () {
      return Dropdown;
    }, function (decorators) {

      if (!options.multiple) {
        decorators.push(DropdownSearch);
      }

      if (options.minimumResultsForSearch !== 0) {
        decorators.push(MinimumResultsForSearch);
      }

      if (options.closeOnSelect) {
        decorators.push(CloseOnSelect);
      }

      if (
        options.dropdownCssClass != null ||
        options.dropdownCss != null ||
        options.adaptDropdownCssClass != null
      ) {
        var DropdownCSS = require(options.amdBase + 'compat/dropdownCss');

        decorators.push(DropdownCSS);
      }

      decorators.push(AttachBody);
    });

    constructAdapter('selection', function () {
      return options.multiple ? MultipleSelection : SingleSelection;
    }, function (decorators) {

      // Add the placeholder mixin if a placeholder was specified
      if (options.placeholder != null) {
        decorators.push(Placeholder);
      }

      if (options.allowClear) {
        decorators.push(AllowClear);
      }

      if (options.multiple) {
        decorators.push(SelectionSearch);
      }

      if (
        options.containerCssClass != null ||
        options.containerCss != null ||
        options.adaptContainerCssClass != null
      ) {
        var ContainerCSS = require(options.amdBase + 'compat/containerCss');

        decorators.push(ContainerCSS);
      }

      decorators.push(EventRelay);
    });

    if (typeof options.language === 'string') {
      // Check if the language is specified with a region
      if (options.language.indexOf('-') > 0) {
        // Extract the region information if it is included
        var languageParts = options.language.split('-');
        var baseLanguage = languageParts[0];

        options.language = [options.language, baseLanguage];
      } else {
        options.language = [options.language];
      }
    }

    if ($.isArray(options.language)) {
      var languages = new Translation();
      options.language.push('en');

      var languageNames = options.language;

      for (var l = 0; l < languageNames.length; l++) {
        var name = languageNames[l];
        var language = {};

        try {
          // Try to load it with the original name
          language = Translation.loadPath(name);
        } catch (e) {
          try {
            // If we couldn't load it, check if it wasn't the full path
            name = this.defaults.amdLanguageBase + name;
            language = Translation.loadPath(name);
          } catch (ex) {
            // The translation could not be loaded at all. Sometimes this is
            // because of a configuration problem, other times this can be
            // because of how Select2 helps load all possible translation files.
            if (options.debug && window.console && console.warn) {
              console.warn(
                'Select2: The language file for "' + name + '" could not be ' +
                'automatically loaded. A fallback will be used instead.'
              );
            }

            continue;
          }
        }

        languages.extend(language);
      }

      options.translations = languages;
    } else {
      var baseTranslation = Translation.loadPath(
        this.defaults.amdLanguageBase + 'en'
      );
      var customTranslation = new Translation(options.language);

      customTranslation.extend(baseTranslation);

      options.translations = customTranslation;
    }

    return options;
  };

  Defaults.prototype.reset = function () {
    function stripDiacritics (text) {
      // Used 'uni range + named function' from http://jsperf.com/diacritics/18
      function match(a) {
        return DIACRITICS[a] || a;
      }

      return text.replace(/[^\u0000-\u007E]/g, match);
    }

    function matcher (params, data) {
      // Always return the object if there is nothing to compare
      if ($.trim(params.term) === '') {
        return data;
      }

      // Do a recursive check for options with children
      if (data.children && data.children.length > 0) {
        // Clone the data object if there are children
        // This is required as we modify the object to remove any non-matches
        var match = $.extend(true, {}, data);

        // Check each child of the option
        for (var c = data.children.length - 1; c >= 0; c--) {
          var child = data.children[c];

          var matches = matcher(params, child);

          // If there wasn't a match, remove the object in the array
          if (matches == null) {
            match.children.splice(c, 1);
          }
        }

        // If any children matched, return the new object
        if (match.children.length > 0) {
          return match;
        }

        // If there were no matching children, check just the plain object
        return matcher(params, match);
      }

      var original = stripDiacritics(data.text).toUpperCase();
      var term = stripDiacritics(params.term).toUpperCase();

      // Check if the text contains the term
      if (original.indexOf(term) > -1) {
        return data;
      }

      // If it doesn't contain the term, don't return anything
      return null;
    }

    this.defaults = {
      amdBase: './',
      amdLanguageBase: './i18n/',
      closeOnSelect: true,
      debug: false,
      dropdownAutoWidth: false,
      escapeMarkup: Utils.escapeMarkup,
      language: EnglishTranslation,
      matcher: matcher,
      minimumInputLength: 0,
      maximumInputLength: 0,
      maximumSelectionLength: 0,
      minimumResultsForSearch: 0,
      selectOnClose: false,
      sorter: function (data) {
        return data;
      },
      templateResult: function (result) {
        return result.text;
      },
      templateSelection: function (selection) {
        return selection.text;
      },
      theme: 'default',
      width: 'resolve'
    };
  };

  Defaults.prototype.set = function (key, value) {
    var camelKey = $.camelCase(key);

    var data = {};
    data[camelKey] = value;

    var convertedData = Utils._convertData(data);

    $.extend(this.defaults, convertedData);
  };

  var defaults = new Defaults();

  return defaults;
});
