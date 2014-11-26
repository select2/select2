module('Data adapters - Select - current');

var SelectData = require('select2/data/select');
var $ = require('jquery');
var Options = require('select2/options');
var options = new Options({});

test('current gets default for single', function (assert) {
  var $select = $('#qunit-fixture .single');

  var data = new SelectData($select, options);

  data.current(function (val) {
    assert.equal(
      val.length,
      1,
      'There should only be one selected option'
    );

    var option = val[0];

    assert.equal(
      option.id,
      'default',
      'The value of the option tag should be the id'
    );

    assert.equal(
      option.text,
      'Default',
      'The text within the option tag should be the text'
    );
  });
});

test('current gets default for multiple', function (assert) {
  var $select = $('#qunit-fixture .multiple');

  var data = new SelectData($select, options);

  data.current(function (val) {
    assert.equal(
      val.length,
      0,
      'Multiple selects have no default selection.'
    );
  });
});

test('current gets options with explicit value', function (assert) {
  var $select = $('#qunit-fixture .single');

  var data = new SelectData($select, options);

  $select.val('1');

  data.current(function (val) {
    assert.equal(
      val.length,
      1,
      'There should be one selected option'
    );

    var option = val[0];

    assert.equal(
      option.id,
      '1',
      'The option value should be the selected id'
    );

    assert.equal(
      option.text,
      'One',
      'The text should match the text for the option tag'
    );
  });
});

test('current gets options with implicit value', function (assert) {
  var $select = $('#qunit-fixture .single');

  var data = new SelectData($select, options);

  $select.val('2');

  data.current(function (val) {
    assert.equal(
      val.length,
      1,
      'There should only be one selected value'
    );

    var option = val[0];

    assert.equal(
      option.id,
      '2',
      'The id should be the same as the option text'
    );

    assert.equal(
      option.text,
      '2',
      'The text should be the same as the option text'
    );
  });
});

test('select works for single', function (assert) {
  var $select = $('#qunit-fixture .single');

  var data = new SelectData($select, options);

  assert.equal($select.val(), 'default');

  data.select({
    id: '1',
    text: 'One'
  });

  assert.equal($select.val(), '1');
});

test('multiple sets the value', function (assert) {
  var $select = $('#qunit-fixture .multiple');

  var data = new SelectData($select, options);

  assert.equal($select.val(), null);

  data.select({
    id: 'default',
    text: 'Default'
  });

  assert.deepEqual($select.val(), ['default']);
});

test('multiple adds to the old value', function (assert) {
  var $select = $('#qunit-fixture .multiple');

  var data = new SelectData($select, options);

  $select.val(['2']);

  assert.deepEqual($select.val(), ['2']);

  data.select({
    id: 'default',
    text: 'Default'
  });

  assert.deepEqual($select.val(), ['default', '2']);
});

module('Data adapter - Select - query');

test('all options are returned with no term', function (assert) {
  var $select = $('#qunit-fixture .single');

  var data = new SelectData($select, options);

  data.query({}, function (data) {
    assert.equal(
      data.length,
      3,
      'The number of items returned should be equal to the number of options'
    );
  });
});

test('the matcher checks the text', function (assert) {
  var $select = $('#qunit-fixture .single');

  var data = new SelectData($select, options);

  data.query({
    term: 'Default'
  }, function (data) {
    assert.equal(
      data.length,
      1,
      'Only the "Default" option should be found'
    );
  });
});

test('the matcher ignores case', function (assert) {
  var $select = $('#qunit-fixture .single');

  var data = new SelectData($select, options);

  data.query({
    term: 'one'
  }, function (data) {
    assert.equal(
      data.length,
      1,
      'The "One" option should still be found'
    );
  });
});

test('no options may be returned with no matches', function (assert) {
  var $select = $('#qunit-fixture .single');

  var data = new SelectData($select, options);

  data.query({
    term: 'qwerty'
  }, function (data) {
    assert.equal(
      data.length,
      0,
      'Only matching items should be returned'
    );
  });
});

test('optgroup tags are marked with children', function (assert) {
  var $select = $('#qunit-fixture .groups');

  var data = new SelectData($select, options);

  data.query({}, function (data) {
    assert.ok(
      'children' in data[0],
      'The optgroup element should have children when queried'
    );
  });
});

test('empty optgroups are still shown when queried', function (assert) {
  var $select = $('#qunit-fixture .groups');

  var data = new SelectData($select, options);

  data.query({}, function (data) {
    assert.equal(
      data.length,
      2,
      'The empty optgroup element should still be returned when queried'
    );

    var item = data[1];

    assert.equal(
      item.text,
      'Empty',
      'The text of the empty optgroup should match the label'
    );

    assert.equal(
      item.children.length,
      0,
      'There should be no children in the empty opgroup'
    );
  });
});
