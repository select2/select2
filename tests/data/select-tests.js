module('Data adapters - Select');

var SelectData = require('select2/data/select');
var $ = require('jquery');
var Options = require('select2/options');

var options = new Options({});

test('current gets default for single', function (assert) {
  var $select = $('#qunit-fixture .single');

  var data = new SelectData($select, options);

  data.current(function (val) {
    assert.deepEqual(
      val,
      [{
        id: 'default',
        text: 'Default'
      }],
      'The first option should be selected by default (by the browser).'
    );
  });
});

test('current gets default for multiple', function (assert) {
  var $select = $('#qunit-fixture .multiple');

  var data = new SelectData($select, options);

  data.current(function (val) {
    assert.deepEqual(
      val,
      [],
      'Multiple selects have no default selection.'
    );
  });
});

test('current gets options with explicit value', function (assert) {
  var $select = $('#qunit-fixture .single');

  var data = new SelectData($select, options);

  $select.val('1');

  data.current(function (val) {
    assert.deepEqual(
      val,
      [{
        id: '1',
        text: 'One'
      }],
      'The text and id should match the value and text for the option tag.'
    );
  });
});

test('current gets options with implicit value', function (assert) {
  var $select = $('#qunit-fixture .single');

  var data = new SelectData($select, options);

  $select.val('2');

  data.current(function (val) {
    assert.deepEqual(
      val,
      [{
        id: '2',
        text: '2'
      }],
      'The text and id should match the text within the option tag.'
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
