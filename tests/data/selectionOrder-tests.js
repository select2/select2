module('Data adapters - SelectionOrder');

var Select2 = require('select2/core');

var SelectData = require('select2/data/select');
var SelectionOrder = require('select2/data/selectionOrder');
var Tags = require('select2/data/tags');

var MultipleSelection = require('select2/selection/multiple');

var $ = require('jquery');
var Options = require('select2/options');
var Utils = require('select2/utils');

var options = new Options({});

test('initial dom display order preserved', function (assert) {
  assert.expect(2);

  var options = new Options({
    keepSelectionOrder: true
  });

  var $select = $(
    '<select multiple>' +
      '<option selected data-selection-order="2">One</option>' +
      '<option>Two</option>' +
      '<option value="3" selected data-selection-order="1">Three</option>' +
      '<option value="4" selected>Four</option>' +  // No defined order
    '</select>'
  );

  var container = new MockContainer();
  var $container = $('<div></div>');

  var OrderedSelectData = Utils.Decorate(SelectData, SelectionOrder);

  var dataAdapter = new OrderedSelectData($select, options);
  dataAdapter.bind(container, $container);

  dataAdapter.query({
    term: ''
  }, function (data) {
    assert.equal(data.results.length, 4);

    var itemIds = $.map(data.results, function(item) { return item.id; });

    // Verify display order preserved
    assert.deepEqual(
      itemIds,
      ['One', 'Two', '3', '4'],
      'The values should be in display order'
    );

  });
});


test('initial dom selection order preserved', function (assert) {
  assert.expect(2);

  var options = new Options({
    keepSelectionOrder: true
  });

  var $select = $(
    '<select multiple>' +
      '<option selected data-selection-order="2">One</option>' +
      '<option>Two</option>' +
      '<option value="3" selected data-selection-order="1">Three</option>' +
      '<option value="4" selected>Four</option>' +  // No defined order
    '</select>'
  );

  var container = new MockContainer();
  var $container = $('<div></div>');

  var OrderedSelectData = Utils.Decorate(SelectData, SelectionOrder);

  var dataAdapter = new OrderedSelectData($select, options);
  dataAdapter.bind(container, $container);

  dataAdapter.current(function (data) {
    assert.equal(data.length, 3);

    var itemIds = $.map(data, function(item) { return item.id; });

    // Verify explicit selection order preserved
    assert.deepEqual(
      itemIds,
      ['3', 'One', '4'],
      'The values should be in selection order'
    );
  });
});




test('selection order after changes preserved', function (assert) {
  assert.expect(6);

  var options = new Options({
    keepSelectionOrder: true
  });

  var $select = $(
    '<select multiple>' +
      '<option selected data-selection-order="2">One</option>' +
      '<option>Two</option>' +
      '<option value="3" selected data-selection-order="1">Three</option>' +
      '<option value="4" selected>Four</option>' +  // No defined order
    '</select>'
  );

  var container = new MockContainer();
  var $container = $('<div></div>');

  var OrderedSelectData = Utils.Decorate(SelectData, SelectionOrder);

  var dataAdapter = new OrderedSelectData($select, options);
  dataAdapter.bind(container, $container);

  dataAdapter.select({
    id: 'Two',
    text: 'Two'
  });

  var expectedIds = ['3', 'One', '4', 'Two'];

  dataAdapter.current(function (data) {
    assert.equal(data.length, expectedIds.length);

    var itemIds = $.map(data, function(item) { return item.id; });

    // Verify explicit selection order preserved
    assert.deepEqual(
      itemIds,
      expectedIds,
      'The values should be in selection order'
    );
  });

  // jQuery value is same order
  assert.deepEqual($select.val(), expectedIds);


  // ########################################################
  // Check after unselecting existing and re-selecting
  dataAdapter.unselect({
    id: '3',
    text: 'Three'
  });

  dataAdapter.select({
    id: '3',
    text: 'Three'
  });

  expectedIds = ['One', '4', 'Two', '3'];

  dataAdapter.current(function (data) {
    assert.equal(data.length, expectedIds.length);

    var itemIds = $.map(data, function(item) { return item.id; });

    // Verify explicit selection order preserved
    assert.deepEqual(
      itemIds,
      expectedIds,
      'The values should be in selection order after unselect/select'
    );
  });

  // jQuery value is same order
  assert.deepEqual($select.val(), expectedIds);
});


test('selection order after changes preserved (with tags)', function (assert) {
  assert.expect(9);

  var options = new Options({
    keepSelectionOrder: true,
    tags: true
  });

  var $select = $(
    '<select multiple>' +
      '<option selected data-selection-order="2">One</option>' +
      '<option>Two</option>' +
      '<option value="3" selected data-selection-order="1">Three</option>' +
      '<option value="4" selected>Four</option>' +  // No defined order
    '</select>'
  );

  var container = new MockContainer();
  var $container = $('<div></div>');

  var OrderedSelectData = Utils.Decorate(
    Utils.Decorate(SelectData, SelectionOrder),
    Tags);

  var dataAdapter = new OrderedSelectData($select, options);
  dataAdapter.bind(container, $container);


  // Should query and find 'One', plus suggest new tag 'On'
  // By default, tags are inserted into beginning of results
  var expectedIdsResultsOrder = ['On', 'One'];

  dataAdapter.query({
    term: 'On'
  }, function (data) {
    assert.equal(data.results.length, expectedIdsResultsOrder.length);

    var itemIds = $.map(data.results, function(item) { return item.id; });

    // Verify tag in results order preserved
    assert.deepEqual(
      itemIds,
      expectedIdsResultsOrder,
      'The query results values should be in results order'
    );

    // Select new tag
    dataAdapter.select(data.results[0]);
  });


  // New tag 'On' should still get returned at end of selections
  var expectedIdsSelectionOrder = ['3', 'One', '4', 'On'];

  dataAdapter.current(function (data) {
    assert.equal(data.length, expectedIdsSelectionOrder.length);

    var itemIds = $.map(data, function(item) { return item.id; });

    // Verify explicit selection order preserved
    assert.deepEqual(
      itemIds,
      expectedIdsSelectionOrder,
      'The values should be in selection order'
    );
  });

  // jQuery value is same order
  assert.deepEqual($select.val(), expectedIdsSelectionOrder);



  // ########################################################
  // Check after unselecting existing and re-selecting
  dataAdapter.unselect({
    id: 'On',
    text: 'On'
  });

  dataAdapter.query({
    term: 'On'
  }, function (data) {
    assert.equal(
      data.results[0].id,
      'On',
      'New tag should be first in results again');

    // Select new tag
    dataAdapter.select(data.results[0]);
  });

  dataAdapter.current(function (data) {
    assert.equal(data.length, expectedIdsSelectionOrder.length);

    var itemIds = $.map(data, function(item) { return item.id; });

    // Verify explicit selection order preserved
    assert.deepEqual(
      itemIds,
      expectedIdsSelectionOrder,
      'The values should be in selection order after unselect/select tag'
    );
  });

  // jQuery value is same order
  assert.deepEqual($select.val(), expectedIdsSelectionOrder);
});



test('query display order after changes preserved', function (assert) {
  assert.expect(2);

  var options = new Options({
    keepSelectionOrder: true
  });

  var $select = $(
    '<select multiple>' +
      '<option selected data-selection-order="2">One</option>' +
      '<option>Two</option>' +
      '<option value="3" selected data-selection-order="1">Three</option>' +
      '<option value="4" selected>Four</option>' +  // No defined order
    '</select>'
  );

  var container = new MockContainer();
  var $container = $('<div></div>');

  var OrderedSelectData = Utils.Decorate(SelectData, SelectionOrder);

  var dataAdapter = new OrderedSelectData($select, options);
  dataAdapter.bind(container, $container);

  // Should return options in original display order
  var expectedIds = ['One', '3'];

  dataAdapter.query({
    term: 'e'
  }, function (data) {
    assert.equal(data.results.length, expectedIds.length);

    var itemIds = $.map(data.results, function(item) { return item.id; });

    // Verify results order preserved
    assert.deepEqual(
      itemIds,
      expectedIds,
      'The query results values should be in display order'
    );
  });

});


test('query display order after changes preserved (with tags)',
function (assert) {
  assert.expect(2);

  var options = new Options({
    keepSelectionOrder: true
  });

  var $select = $(
    '<select multiple>' +
      '<option selected data-selection-order="2">One</option>' +
      '<option>Two</option>' +
      '<option value="3" selected data-selection-order="1">Three</option>' +
      '<option value="4" selected>Four</option>' +  // No defined order
    '</select>'
  );

  var container = new MockContainer();
  var $container = $('<div></div>');

  var OrderedSelectData = Utils.Decorate(
    Utils.Decorate(SelectData, SelectionOrder),
    Tags);

  var dataAdapter = new OrderedSelectData($select, options);
  dataAdapter.bind(container, $container);

  // Should return options in original display order, with new tag at start
  var expectedIds = ['e', 'One', '3'];

  dataAdapter.query({
    term: 'e'
  }, function (data) {
    assert.equal(data.results.length, expectedIds.length);

    var itemIds = $.map(data.results, function(item) { return item.id; });

    // Verify results order preserved
    assert.deepEqual(
      itemIds,
      expectedIds,
      'The query results values should be in display order'
    );
  });

});





module('Data adapters - SelectionOrder - integration');

test('multiple default selections returned in order', function (assert) {
  var $select = $(
    '<select multiple>' +
      '<option selected data-selection-order="2">One</option>' +
      '<option>Two</option>' +
      '<option value="3" selected data-selection-order="1">Three</option>' +
      '<option value="4" selected>Four</option>' +  // No defined order
    '</select>'
  );
  var options = {
    keepSelectionOrder: true
  };

  var select = new Select2($select, options);

  var items = select.data();
  var itemIds = $.map(items, function(item) { return item.id; });

  assert.equal(
    items.length,
    3,
    'The three selected items should be returned'
  );

  // Verify selection
  assert.deepEqual(
    itemIds,
    ['3', 'One', '4'],
    'The values should be in selection order'
  );
});


test('multiple value matches the jquery value', function (assert) {
  var $select = $(
    '<select multiple>' +
      '<option selected data-selection-order="2">One</option>' +
      '<option>Two</option>' +
      '<option value="3" selected data-selection-order="1">Three</option>' +
      '<option value="4" selected>Four</option>' +  // No defined order
    '</select>'
  );
  var options = {
    keepSelectionOrder: true
  };

  var select = new Select2($select, options);

  var value = $select.val();

  assert.equal(
    value.length,
    3,
    'Three options should be selected'
  );

  assert.deepEqual(
    value,
    ['3', 'One', '4'],
    'The values should match the option tag attribute'
  );

  assert.deepEqual(
    value,
    $select.val(),
    'The values should match the jquery values'
  );
});


// Really just testing limitation of SelectionOrder because of
// how jQuery applies val().  If the options were individually selected
// and a 'change' event fired between, the decorator could track
test('setting value via jQuery cant preserve selection ordering',
function (assert) {
  var $select = $(
    '<select multiple>' +
      '<option>One</option>' +
      '<option>Two</option>' +
      '<option value="3">Three</option>' +
      '<option value="4">Four</option>' +
    '</select>'
  );
  var options = {
    keepSelectionOrder: true
  };

  var select = new Select2($select, options);

  $select.val(['3','One','4']).trigger('change');

  // In this scenario, the selection order falls back to option DOM order
  var expectedIds = ['One','3', '4'];
  var value = $select.val();

  assert.equal(
    value.length,
    expectedIds.length,
    'Expected options should be selected'
  );

  assert.deepEqual(
    value,
    expectedIds,
    'The value order isn\'t correct'
  );
});


// Test that manually setting option.selected with a 'change' event
// inbetween can track selection order propertly still.
test('setting value via indiv option preserves selection ordering',
function (assert) {
  var $select = $(
    '<select multiple>' +
      '<option value="One">One</option>' +
      '<option>Two</option>' +
      '<option value="3">Three</option>' +
      '<option value="4">Four</option>' +
    '</select>'
  );
  var options = {
    keepSelectionOrder: true
  };

  var select = new Select2($select, options);

  $select.find('option[value=3]').prop('selected', true).trigger('change');
  $select.find('option[value=One]').prop('selected', true).trigger('change');
  $select.find('option[value=4]').prop('selected', true).trigger('change');

  var expectedIds = ['3', 'One', '4'];
  var value = $select.val();

  assert.equal(
    value.length,
    expectedIds.length,
    'Expected options should be selected'
  );

  assert.deepEqual(
    value,
    expectedIds,
    'The value order isn\'t correct'
  );
});


// Test that manually setting option.selected with a 'change' event
// inbetween cant track selection order when trackManualSelectionOrder=false
test('setting value via indiv option with trackManualSelectionOrder=false',
function (assert) {
  var $select = $(
    '<select multiple>' +
      '<option value="One">One</option>' +
      '<option>Two</option>' +
      '<option value="3">Three</option>' +
      '<option value="4">Four</option>' +
    '</select>'
  );
  var options = {
    keepSelectionOrder: true,
    trackManualSelectionOrder: false
  };

  var select = new Select2($select, options);

  $select.find('option[value=3]').prop('selected', true).trigger('change');
  $select.find('option[value=One]').prop('selected', true).trigger('change');
  $select.find('option[value=4]').prop('selected', true).trigger('change');

  var expectedIds = ['One', '3', '4'];
  var value = $select.val();

  assert.equal(
    value.length,
    expectedIds.length,
    'Expected options should be selected'
  );

  assert.deepEqual(
    value,
    expectedIds,
    'The value order isn\'t correct'
  );
});
