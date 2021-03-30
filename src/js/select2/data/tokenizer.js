define([
  'jquery',
  '../utils'
], function ($, Utils) {
  function Tokenizer (decorated, $element, options) {
    var tokenizer = options.get('tokenizer');

    if (tokenizer !== undefined) {
      this.tokenizer = tokenizer;
    }

    decorated.call(this, $element, options);
  }

  Tokenizer.prototype.bind = function (decorated, container, $container) {
    decorated.call(this, container, $container);

    this.$search =  container.dropdown.$search || container.selection.$search ||
      $container.find('.select2-search__field');
  };

  Tokenizer.prototype.query = function (decorated, params, callback) {
    var self = this;
    var usesTags = self.options.get('tags');

    function createAndSelect (data) {
      if (data.text == null || data.text === '') {
        return false;
      }

      // Normalize the data object so we can use it for checks
      var item = self._normalizeItem(data);
      var foundOptionItem = null;

      // Check if the option already exists with exact text match (like Tags
      // and SelectAdapter do). For backward compatibilty, also check id match.
      // Don't do partial matches because we may not have all available data
      // loaded to assume.
      var $existingOptions = self.$element.find('option').filter(function () {
        var option = self.item($(this));

        var optionText = (option.text || '').toUpperCase();
        var optionId = (option.id || '').toUpperCase();
        var paramsTerm = (data.text || '').toUpperCase();

        if (optionText === paramsTerm || optionId === paramsTerm) {
          foundOptionItem = option;
          return true;
        }
      });

      if ($existingOptions.length === 1 && foundOptionItem) {
        // Found single item matching, so use its full data instead
        // (to pick up correct id, etc)
        item = foundOptionItem;
      }

      // If an existing option wasn't found for it, create the option
      if (!$existingOptions.length) {
        // If tags, allow creating new options
        if (usesTags) {
          var $option = self.option(item);
          $option.attr('data-select2-tag', true);
          item.element = $option[0];

          self._removeOldTags();
          self.addOptions([$option]);
        } else {
          // Don't create new option or select item
          return false;
        }
      } else if (!usesTags && $existingOptions.length > 1) {
        // Multiple options matched (and shouldn't create new tags), so don't
        // select
        return false;
      }

      // Select the item, now that we know there is an option for it
      select(item);
    }

    function select (data) {
      self.trigger('select', {
        data: data
      });
    }

    params.term = params.term || '';

    var tokenData = this.tokenizer(params, this.options, createAndSelect);

    if (tokenData.term !== params.term) {
      // Replace the search term if we have the search box
      if (this.$search.length) {
        this.$search.val(tokenData.term);
        this.$search.trigger('focus');
      }

      params.term = tokenData.term;
    }

    decorated.call(this, params, callback);
  };

  Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
    var separators = options.get('tokenSeparators') || [];
    var term = params.term;
    var i = 0;

    var createTag = this.createTag || function (params) {
      // Mirror createTag functionality to match Tags.createTag if not available
      if (params.term == null) {
        return null;
      }

      var term = params.term.trim();

      if (term === '') {
        return null;
      }

      return {
        id: term,
        text: term
      };
    };

    while (i < term.length) {
      var termChar = term[i];

      if (separators.indexOf(termChar) === -1) {
        i++;

        continue;
      }

      var part = term.substr(0, i);
      var partParams = $.extend({}, params, {
        term: part
      });

      var data = createTag(partParams);

      if (data == null) {
        i++;
        continue;
      }

      if (callback(data) === false) {
        // Couldn't handle term, so keep matching term with separator. This
        // works best when user typing into search field, so we don't really
        // have additional data after splice. The underlying data adapter may
        // return no results then, letting the user correct their input. Pasting
        // multiple items at once when some items aren't found can yield
        // undesired results in some cases though.
        i++;
        continue;
      }

      // Reset the term to not include the tokenized portion
      term = term.substr(i + 1) || '';
      i = 0;
    }

    return {
      term: term
    };
  };

  return Tokenizer;
});
