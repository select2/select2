module('Data adapters - Array');

var ArrayData = require('select2/data/array');
var $ = require('jquery');
var Options = require('select2/options');

var options = new Options({
  data: [
    {
      id: 'default',
      text: 'Default'
    },
    {
      id: '1',
      text: 'One'
    },
    {
      id: '2',
      text: '2'
    }
  ]
});

test('current gets default for single', function (assert) {
  var $select = $('#qunit-fixture .single');

  var data = new ArrayData($select, options);

  data.current(function (val) {
    assert.deepEqual(
      val,
      [],
      'There should be no default selection.'
    );
  });
});

test('current gets default for multiple', function (assert) {
  var $select = $('#qunit-fixture .multiple');

  var data = new ArrayData($select, options);

  data.current(function (val) {
    assert.deepEqual(
      val,
      [],
      'There should be no default selection.'
    );
  });
});

test('current works with existing selections', function (assert) {
  var $select = $('#qunit-fixture .multiple');

  var data = new ArrayData($select, options);

  $select.val(['3']);

  data.current(function (val) {
    assert.deepEqual(
      val,
      [{
        id: '3',
        text: 'Three'
      }],
      'The text and id should match the value and text for the option tag.'
    );
  });
});

test('current works with selected data', function (assert) {
  var $select = $('#qunit-fixture .single');

  var data = new ArrayData($select, options);

  data.select({
    id: '2',
    text: '2'
  });

  data.current(function (val) {
    assert.deepEqual(
      val,
      [{
        id: '2',
        text: '2'
      }],
      'The text and id should match the selected array data.'
    );
  });
});

test('select works for single', function (assert) {
  var $select = $('#qunit-fixture .single');

  var data = new ArrayData($select, options);

  assert.equal($select.val(), null);

  data.select({
    id: '1',
    text: 'One'
  });

  assert.equal($select.val(), '1');
});

test('multiple sets the value', function (assert) {
  var $select = $('#qunit-fixture .multiple');

  var data = new ArrayData($select, options);

  assert.equal($select.val(), null);

  data.select({
    id: 'default',
    text: 'Default'
  });

  assert.deepEqual($select.val(), ['default']);
});

test('multiple adds to the old value', function (assert) {
  var $select = $('#qunit-fixture .multiple');

  var data = new ArrayData($select, options);

  $select.val(['3']);

  assert.deepEqual($select.val(), ['3']);

  data.select({
    id: 'default',
    text: 'Default'
  });

  assert.deepEqual($select.val(), ['3', 'default']);
});
