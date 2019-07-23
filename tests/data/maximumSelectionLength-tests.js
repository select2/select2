module('Data adapters - Maximum selection length');

var SelectData = require('select2/data/select');
var MaximumSelectionLength = require('select2/data/maximumSelectionLength');

var $ = require('jquery');
var Options = require('select2/options');
var Utils = require('select2/utils');

var MaximumSelectionData = Utils.Decorate(SelectData, MaximumSelectionLength);

test('0 never displays the notice', function (assert) {
  assert.expect(3);

  var $select = $('#qunit-fixture .multiple');

  var zeroOptions = new Options({
    maximumSelectionLength: 0
  });

  var container = new MockContainer();
  var data = new MaximumSelectionData($select, zeroOptions);

  data.bind(container, null);

  data.on('results:message', function () {
    assert.ok(false, 'The message should not be displayed');
  });

  data.query({
    term: ''
  }, function () {
    assert.ok(true, 'The results should be queried');
  });

  $select.val(['One']);

  data.query({
    term: ''
  }, function () {
    assert.ok(true, 'The results should be queried');
  });

  $select.val(['One', 'Two']);

  data.query({
    term: ''
  }, function () {
    assert.ok(true, 'The results should be queried');
  });
});

test('< 0 never displays the notice', function (assert) {
  assert.expect(3);

  var $select = $('#qunit-fixture .multiple');

  var negativeOptions = new Options({
    maximumSelectionLength: -1
  });

  var container = new MockContainer();
  var data = new MaximumSelectionData($select, negativeOptions);

  data.bind(container, null);

  data.on('results:message', function () {
    assert.ok(false, 'The message should not be displayed');
  });

  data.query({
    term: ''
  }, function () {
    assert.ok(true, 'The results should be queried');
  });

  $select.val(['One']);

  data.query({
    term: ''
  }, function () {
    assert.ok(true, 'The results should be queried');
  });

  $select.val(['One', 'Two']);

  data.query({
    term: ''
  }, function () {
    assert.ok(true, 'The results should be queried');
  });
});

test('triggers when >= 1 selection' , function (assert) {
  assert.expect(2);

  var $select = $('#qunit-fixture .multiple');

  var maxOfOneOptions = new Options({
    maximumSelectionLength: 1
  });

  var container = new MockContainer();
  var data = new MaximumSelectionData($select, maxOfOneOptions);

  data.bind(container, null);

  data.on('results:message', function () {
    assert.ok(true, 'The message should be displayed');
  });

  $select.val(['One']);

  data.query({
    term: ''
  }, function () {
    assert.ok(false, 'The results should not be queried');
  });

  $select.val(['One', 'Two']);

  data.query({
    term: ''
  }, function () {
    assert.ok(false, 'The results should not be queried');
  });
});

test('triggers after selection' , function (assert) {
  assert.expect(1);

  var $select = $('#qunit-fixture .multiple');

  var maxOfOneOptions = new Options({
    maximumSelectionLength: 1
  });

  var container = new MockContainer();
  var data = new MaximumSelectionData($select, maxOfOneOptions);

  data.bind(container, null);

  data.on('results:message', function () {
    assert.ok(true, 'The message should be displayed');
  });

  $select.val(['One']);

  container.trigger('select', {
    data: {}
  });
});
