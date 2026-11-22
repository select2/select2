var $ = require('jquery');
var Options = require('select2/options');
var Defaults = require('select2/defaults');

QUnit.module('Options - Translations', {
  beforeEach: function () {
    Defaults.reset();
  },
  afterEach: function () {
    Defaults.reset();
  }
});

QUnit.test(
  'partial dictionaries are reset when default reset',
  function (assert) {
    Defaults.set('language', {
      test: 'testing'
    });

    Defaults.reset();

    assert.ok(
      !Defaults.defaults.language.test,
      'The partial dictionary should have been reset'
    );
  }
);

QUnit.test('default language chain is English', function (assert) {
  var $element = $('<select></select>');

  var options = new Options({}, $element);

  assert.deepEqual(options.get('language'), ['en']);
});

QUnit.test(
  'default translation includes all of the required messages',
  function (assert) {
    var $element = $('<select></select>');

    var options = new Options({}, $element);

    assert.deepEqual(Object.keys(options.get('translations').all()), [
      'errorLoading',
      'inputTooLong',
      'inputTooShort',
      'loadingMore',
      'maximumSelected',
      'noResults',
      'searching',
      'removeAllItems',
      'removeItem',
      'search'
    ]);
  }
);

QUnit.test('partial dictionaries can be passed', function (assert) {
  var $element = $('<select></select>');

  var options = new Options(
    {
      language: {
        searching: function () {
          return 'Something';
        }
      }
    },
    $element
  );

  var translations = options.get('translations');

  assert.equal(
    translations.get('searching')(),
    'Something',
    'The partial dictionary still overrides translations'
  );

  assert.equal(
    translations.get('noResults')(),
    'No results found',
    'You can still get English translations for keys not passed in'
  );
});

QUnit.test(
  'partial dictionaries can be combined with defaults',
  function (assert) {
    var $element = $('<select></select>');

    Defaults.set('language', {
      test: function () {
        return 'Testing';
      }
    });

    var options = new Options(
      {
        language: {
          searching: function () {
            return 'Something';
          }
        }
      },
      $element
    );

    var translations = options.get('translations');

    assert.equal(
      translations.get('searching')(),
      'Something',
      'The partial dictionary still overrides translations'
    );

    assert.equal(
      translations.get('test')(),
      'Testing',
      'The defaults were included in the fallback chain'
    );

    assert.equal(
      translations.get('noResults')(),
      'No results found',
      'You can still get English translations for keys not passed in'
    );
  }
);

QUnit.test(
  'partial dictionaries can used in fallback chains',
  function (assert) {
    var $element = $('<select></select>');

    var options = new Options(
      {
        language: [
          {
            searching: function () {
              return 'Something';
            }
          },
          {
            test: function () {
              return 'Testing';
            }
          }
        ]
      },
      $element
    );

    var translations = options.get('translations');

    assert.equal(
      translations.get('searching')(),
      'Something',
      'The partial dictionary still overrides translations'
    );

    assert.equal(
      translations.get('test')(),
      'Testing',
      'The defaults were included in the fallback chain'
    );

    assert.equal(
      translations.get('noResults')(),
      'No results found',
      'You can still get English translations for keys not passed in'
    );
  }
);

QUnit.test('language can be set via the options', function (assert) {
  var $element = $('<select></select>');

  var options = new Options(
    {
      language: 'es'
    },
    $element
  );

  assert.deepEqual(options.get('language'), ['es', 'en']);
});

QUnit.test('multi-part language is broken out', function (assert) {
  var $element = $('<select></select>');

  var options = new Options(
    {
      language: 'pt-BR'
    },
    $element
  );

  assert.deepEqual(options.get('language'), ['pt-BR', 'pt', 'en']);
});

QUnit.test('default language can be set', function (assert) {
  var $element = $('<select></select>');

  Defaults.set('language', 'es');

  var options = new Options({}, $element);

  assert.deepEqual(options.get('language'), ['es', 'en']);
});

QUnit.test('lanugage set via options adds to default chain', function (assert) {
  var $element = $('<select></select>');

  Defaults.set('language', 'es');

  var options = new Options(
    {
      language: 'it'
    },
    $element
  );

  assert.deepEqual(options.get('language'), ['it', 'es', 'en']);
});

QUnit.test('default language chain can be set', function (assert) {
  var $element = $('<select></select>');

  Defaults.set('language', ['es', 'it', 'en']);

  var options = new Options({}, $element);

  assert.deepEqual(options.get('language'), ['es', 'it', 'en']);
});

QUnit.test('language can be set by lang attr', function (assert) {
  var $element = $('<select lang="es"></select>');

  var options = new Options({}, $element);

  assert.deepEqual(options.get('language'), ['es', 'en']);
});

QUnit.test('language can be inherited by lang attr', function (assert) {
  var $element = $('<div lang="es"><select></select></div>').find('select');

  var options = new Options({}, $element);

  assert.deepEqual(options.get('language'), ['es', 'en']);
});

QUnit.test(
  'multi-part language can be inherited by lang attr',
  function (assert) {
    var $element = $('<div lang="pt-BR"><select></select></div>').find(
      'select'
    );

    var options = new Options({}, $element);

    assert.deepEqual(options.get('language'), ['pt-BR', 'pt', 'en']);
  }
);

QUnit.test('lang attr overrides default language', function (assert) {
  var $element = $('<select lang="it"></select>');

  Defaults.set('language', 'es');

  var options = new Options({}, $element);

  assert.deepEqual(options.get('language'), ['it', 'es', 'en']);
});

QUnit.test('default language overrides inherited lang attr', function (assert) {
  var $element = $('<div lang="it"><select></select></div>').find('select');

  Defaults.set('language', 'es');

  var options = new Options({}, $element);

  assert.deepEqual(options.get('language'), ['es', 'it', 'en']);
});

QUnit.test(
  'partial dictionary overrides element lang attr (#5995)',
  function (assert) {
    var $element = $('<select lang="en"></select>');

    var options = new Options(
      {
        language: {
          noResults: function () {
            return 'override works';
          }
        }
      },
      $element
    );

    assert.equal(
      options.get('translations').get('noResults')(),
      'override works',
      'The explicit partial override wins over the element lang="en" file'
    );
  }
);

QUnit.test(
  'string language option follows element lang attr in precedence chain',
  function (assert) {
    var $element = $('<select lang="fr"></select>');

    var options = new Options(
      {
        language: 'de'
      },
      $element
    );

    assert.deepEqual(
      options.get('language'),
      ['fr', 'de', 'en'],
      'The element lang attr takes precedence over the string language option'
    );
  }
);

QUnit.test('full language precedence chain (#5995)', function (assert) {
  Defaults.set('language', 'es');

  var $element = $('<select lang="fr"></select>');

  var options = new Options(
    {
      language: 'de'
    },
    $element
  );

  assert.deepEqual(
    options.get('language'),
    ['fr', 'de', 'es', 'en'],
    'The precedence chain is element lang > option > defaults > en'
  );
});

QUnit.test(
  'partial dictionary overrides non-English element lang attr (#5995)',
  function (assert) {
    var $element = $('<select lang="fr"></select>');

    var options = new Options(
      {
        language: {
          noResults: function () {
            return 'override works';
          }
        }
      },
      $element
    );

    assert.equal(
      options.get('translations').get('noResults')(),
      'override works',
      'The explicit partial override wins over the element lang="fr" file'
    );
  }
);

QUnit.test(
  'object language option overrides element lang string (#5995)',
  function (assert) {
    var $element = $('<select lang="fr"></select>');

    var options = new Options(
      {
        language: {
          noResults: function () {
            return 'override works';
          }
        }
      },
      $element
    );

    var language = options.get('language');

    assert.ok(
      typeof language[0] === 'object' && language[0] !== null,
      'The object override is first in the language chain'
    );
    assert.equal(language[1], 'fr', 'The element lang string follows');
    assert.equal(language[2], 'en', 'English is the final fallback');

    assert.equal(
      options.get('translations').get('noResults')(),
      'override works',
      'The object override wins over the element lang="fr" file'
    );
  }
);

QUnit.test(
  'object defaults language overrides option language string (#5995)',
  function (assert) {
    Defaults.set('language', {
      noResults: function () {
        return 'defaults override';
      }
    });

    var $element = $('<select lang="fr"></select>');

    var options = new Options(
      {
        language: 'de'
      },
      $element
    );

    var language = options.get('language');

    assert.ok(
      typeof language[0] === 'object' && language[0] !== null,
      'The object defaults override is first in the language chain'
    );
    assert.equal(language[1], 'fr', 'The element lang string follows');
    assert.equal(language[2], 'de', 'The option language string follows');
    assert.equal(language[3], 'en', 'English is the final fallback');

    assert.equal(
      options.get('translations').get('noResults')(),
      'defaults override',
      'The object defaults override wins over the option language string'
    );
  }
);

QUnit.test(
  'object language option overrides defaults language string (#5995)',
  function (assert) {
    Defaults.set('language', 'es');

    var $element = $('<select lang="fr"></select>');

    var options = new Options(
      {
        language: {
          noResults: function () {
            return 'option override';
          }
        }
      },
      $element
    );

    assert.equal(
      options.get('translations').get('noResults')(),
      'option override',
      'The object option override wins over the defaults language string'
    );
  }
);
