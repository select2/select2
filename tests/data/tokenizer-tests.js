module('Data adaptor - Tokenizer');

test('triggers the select event', function (assert) {
  assert.expect(2);

  var SelectData = require('select2/data/select');
  var Tokenizer = require('select2/data/tokenizer');
  var Tags = require('select2/data/tags');

  var Options = require('select2/options');
  var Utils = require('select2/utils');

  var $ = require('jquery');

  var TokenizedSelect = Utils.Decorate(
    Utils.Decorate(SelectData, Tags),
    Tokenizer
  );
  var $select = $('#qunit-fixture .single');

  var options = new Options({
    tags: true,
    tokenSeparators: [',']
  });

  var container = new MockContainer();
  container.dropdown = container.selection = {};

  var $container = $('<div></div>');

  var data = new TokenizedSelect($select, options);
  data.bind(container, $container);

  data.on('select', function () {
    assert.ok(true, 'The select event should be triggered');
  });

  data.query({
    term: 'first,second'
  }, function () {
    assert.ok(true, 'The callback should have succeeded');
  });
});

test('createTag can return null', function (assert) {
  assert.expect(3);

  var SelectData = require('select2/data/select');
  var Tokenizer = require('select2/data/tokenizer');
  var Tags = require('select2/data/tags');

  var Options = require('select2/options');
  var Utils = require('select2/utils');

  var $ = require('jquery');

  var TokenizedSelect = Utils.Decorate(
    Utils.Decorate(SelectData, Tags),
    Tokenizer
  );
  var $select = $('#qunit-fixture .single');

  var options = new Options({
    tags: true,
    tokenSeparators: [','],
    createTag: function () {
      assert.ok(true, 'createTag should have been called');

      return null;
    }
  });

  var container = new MockContainer();
  container.dropdown = container.selection = {};

  var $container = $('<div></div>');

  var data = new TokenizedSelect($select, options);
  data.bind(container, $container);

  data.on('select', function (params) {
    if (params.data == null) {
      assert.ok(false, 'Null data should never be selected');
    }
  });

  data.query({
    term: 'first,second'
  }, function () {
    assert.ok(true, 'The callback should have succeeded');
  });
});

test('createTag returning null does not cut the term', function (assert) {
  assert.expect(4);

  var SelectData = require('select2/data/select');
  var Tokenizer = require('select2/data/tokenizer');
  var Tags = require('select2/data/tags');

  var Options = require('select2/options');
  var Utils = require('select2/utils');

  var $ = require('jquery');

  var TokenizedSelect = Utils.Decorate(
    Utils.Decorate(SelectData, Tags),
    Tokenizer
  );
  var $select = $('#qunit-fixture .single');

  var options = new Options({
    tags: true,
    tokenSeparators: [',', '"'],
    createTag: function (params) {
      var term = params.term;

      // Ignore blanks
      if (term.length === 0) {
        return null;
      }

      // Ignore the leading quote
      if (term === '"') {
        return null;
      }

      // If there is a leading quote, check for a second one
      if (term[0] === '"' && term[term.length - 1] !== '"') {
        return null;
      }

      var text = term.substr(1, term.length - 2);

      return {
        id: term,
        text: text
      };
    }
  });

  var container = new MockContainer();
  container.dropdown = container.selection = {};

  var $container = $('<div></div>');

  var data = new TokenizedSelect($select, options);
  data.bind(container, $container);

  data.on('select', function (params) {
    assert.ok(params.data, 'Data should not be null');

    assert.equal(
      params.data.id,
      '"first, second"',
      'The id should have the quotes'
    );

    assert.equal(
      params.data.text,
      'first, second',
      'The text should not have the quotes'
    );
  });

  data.query({
    term: '"first, second",abc'
  }, function () {
    assert.ok(true, 'The callback should have succeeded');
  });
});

test('works with multiple tokens given', function (assert) {
  assert.expect(4);

  var SelectData = require('select2/data/select');
  var Tokenizer = require('select2/data/tokenizer');
  var Tags = require('select2/data/tags');

  var Options = require('select2/options');
  var Utils = require('select2/utils');

  var $ = require('jquery');

  var TokenizedSelect = Utils.Decorate(
    Utils.Decorate(SelectData, Tags),
    Tokenizer
  );
  var $select = $('#qunit-fixture .multiple');

  var options = new Options({
    tags: true,
    tokenSeparators: [',']
  });

  var container = new MockContainer();
  container.dropdown = container.selection = {};

  var $container = $('<div></div>');

  var data = new TokenizedSelect($select, options);
  data.bind(container, $container);

  data.on('select', function () {
    assert.ok(true, 'The select event should be triggered');
  });

  data.query({
    term: 'first,second,third'
  }, function () {
    assert.ok(true, 'The callback should have succeeded');
  });

  assert.equal(
    $select.children('option').length,
    3,
    'The two new tags should have been created'
  );
});

test('matches option text, not value (no tags)', function (assert) {
  assert.expect(7);

  var SelectData = require('select2/data/select');
  var Tokenizer = require('select2/data/tokenizer');

  var Options = require('select2/options');
  var Utils = require('select2/utils');

  var $ = require('jquery');

  var TokenizedSelect = Utils.Decorate(
    SelectData,
    Tokenizer
  );
  var $select = $('#qunit-fixture .single');

  var options = new Options({
    tags: false,
    tokenSeparators: [',']
  });

  var container = new MockContainer();
  container.dropdown = container.selection = {};

  var $container = $('<div></div>');

  var data = new TokenizedSelect($select, options);
  data.bind(container, $container);

  var validItemSelected = false;

  data.on('select', function (params) {
    assert.ok(params.data, 'Data should not be null');

    assert.equal(
      params.data.id,
      '1',
      'The id should have our different value'
    );

    assert.equal(
      params.data.text,
      'One',
      'The text should match the expected option'
    );

    validItemSelected = true;
  });

  assert.equal(
    $select.children('option').length,
    1,
    'The original option should only exist'
  );

  // Ensure value is different than text
  $($select.children('option')[0]).val('1');

  data.query({
    // Try to match by text (One), not value (1)
    // Use trailing delimiter to force eval by tokenizer
    term: 'One,Unknown,'
  }, function () {
    assert.ok(true, 'The callback should have succeeded');
  });

  assert.ok(validItemSelected, 'The single valid term should have selected');

  assert.equal(
    $select.children('option').length,
    1,
    'The original option should only exist'
  );

});


test('matches option text (with tags)', function (assert) {
  assert.expect(10);

  var SelectData = require('select2/data/select');
  var Tokenizer = require('select2/data/tokenizer');
  var Tags = require('select2/data/tags');

  var Options = require('select2/options');
  var Utils = require('select2/utils');

  var $ = require('jquery');

  var TokenizedSelect = Utils.Decorate(
    Utils.Decorate(SelectData, Tags),
    Tokenizer
  );
  var $select = $('#qunit-fixture .single');

  var options = new Options({
    tags: true,
    tokenSeparators: [',']
  });

  var container = new MockContainer();
  container.dropdown = container.selection = {};

  var $container = $('<div></div>');

  var data = new TokenizedSelect($select, options);
  data.bind(container, $container);

  var validItemSelected = false;

  data.on('select', function (params) {
    assert.ok(params.data, 'Data should not be null');

    assert.ok(
      params.data.id === '1' || params.data.id === 'Unknown',
      'The id should match the values of one of our terms: ' + params.data.id
    );

    assert.ok(
      params.data.text === 'One' || params.data.text === 'Unknown',
      'The text should match the text of one of our terms: ' + params.data.text
    );

    // Mock SelectAdapter selecting option (since all container events
    // aren't bound/handled in unit test). This keeps Tags from removing
    // as an "old tag".
    params.data.element.selected = true;

    validItemSelected = true;
  });

  assert.equal(
    $select.children('option').length,
    1,
    'The original option should only exist'
  );

  // Ensure value is different than text (so we ensure match on text, not value)
  $($select.children('option')[0]).val('1');

  data.query({
    // Try to match by text (One), not value (1); and add new Unknown
    // Use trailing delimiter to force eval by tokenizer
    term: 'One,Unknown,'
  }, function () {
    assert.ok(true, 'The callback should have succeeded');
  });

  assert.ok(validItemSelected, 'The single valid term should have selected');

  assert.equal(
    $select.children('option').length,
    2,
    'The original option and new Unknown should exist'
  );

});


test('select token if exact match found with other partial matches (no tags)',
function (assert) {
  var SelectData = require('select2/data/select');
  var Tokenizer = require('select2/data/tokenizer');

  var Options = require('select2/options');
  var Utils = require('select2/utils');

  var $ = require('jquery');

  var TokenizedSelect = Utils.Decorate(
    SelectData,
    Tokenizer
  );
  var $select = $('#qunit-fixture .multiple');
  $select.append($('<option>Two Thousand</option>'));

  var options = new Options({
    tags: false,
    tokenSeparators: [',']
  });

  var container = new MockContainer();
  container.dropdown = container.selection = {};

  var $container = $('<div></div>');

  var data = new TokenizedSelect($select, options);
  data.bind(container, $container);


  // Check whether select should be called
  var selectTriggered = false;
  data.on('select', function (params) {
    selectTriggered = true;

    assert.equal(
      params.data.text,
      'Two',
      'The text should match the exact match only'
    );
  });

  data.query({
    // Should have two partial matches ('Two' and 'Two Thousand'), but only
    // one exact match by text.
    term: 'Two,'
  }, function (data) {
    assert.ok(true, 'The callback should have succeeded');
  });

  assert.ok(selectTriggered, 'Select with "Two" should have fired');

  assert.equal(
    $select.children('option').length,
    3,
    'The original options should only exist'
  );
});


test('continue reading token after separator if no exact match (no tags)',
function (assert) {
  var SelectData = require('select2/data/select');
  var Tokenizer = require('select2/data/tokenizer');

  var Options = require('select2/options');
  var Utils = require('select2/utils');

  var $ = require('jquery');

  var TokenizedSelect = Utils.Decorate(
    SelectData,
    Tokenizer
  );
  var $select = $('#qunit-fixture .multiple');
  $select.append($('<option>Two Thousand</option>'));

  var options = new Options({
    tags: false,
    tokenSeparators: [',']
  });

  var container = new MockContainer();
  container.dropdown = container.selection = {};

  var $container = $('<div></div>');

  var data = new TokenizedSelect($select, options);
  data.bind(container, $container);

  data.on('select', function (params) {
    assert.ok(false, 'Select should not have triggered');
  });

  // Try to query with multiple matches followed by real match, but in our
  // case, token separator will be kept to let user correct their input.
  // Select event should not be triggered
  data.query({
    // Use trailing delimiter to force eval by tokenizer
    term: 'Tw,Two Thousand,'
  }, function (data) {
    assert.ok(true, 'The callback should have succeeded');

    assert.equal(
      data.results.length,
      0,
      'No results should match "Tw,Two Thousand" essentially'
    );
  });
});


test('select first token, but continue reading token after separator ' +
     'if no exact match found (no tags)',
function (assert) {
  var SelectData = require('select2/data/select');
  var Tokenizer = require('select2/data/tokenizer');

  var Options = require('select2/options');
  var Utils = require('select2/utils');

  var $ = require('jquery');

  var TokenizedSelect = Utils.Decorate(
    SelectData,
    Tokenizer
  );
  var $select = $('#qunit-fixture .multiple');
  $select.append($('<option>Two Thousand</option>'));

  var options = new Options({
    tags: false,
    tokenSeparators: [',']
  });

  var container = new MockContainer();
  container.dropdown = container.selection = {};

  var $container = $('<div></div>');

  var data = new TokenizedSelect($select, options);
  data.bind(container, $container);

  var selectTriggered = false;
  data.on('select', function (params) {
    assert.equal(
      params.data.text,
      'Two Thousand',
      'Should have received real match only'
    );
    selectTriggered = true;
  });


  // Try to query with single match followed by multiple matches
  // (that shouldn't select 'Tw')
  data.query({
    term: 'Two Thousand,Tw,'
  }, function (data) {
    assert.ok(true, 'The callback should have succeeded');

    assert.equal(
      data.results.length,
      0,
      'No results should have matched "Tw," essentially'
    );
  });

  assert.ok(selectTriggered, 'Select with "Two Thousand" should have fired');
});
