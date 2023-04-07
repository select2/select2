module('select2(data)');

var $ = require('jquery');
var Select2 = require('select2/core');
var Options = require('select2/options');

test('single default selection returned', function (assert) {
  var $select = $(
    '<select>' +
      '<option>One</option>' +
      '<option>Two</option>' +
      '<option value="3" selected>Three</option>' +
    '</select>'
  );
  var options = new Options({});

  var select = new Select2($select, options);

  var items = select.data();

  assert.equal(
    items.length,
    1,
    'The one selected item should be returned'
  );

  var first = items[0];

  assert.equal(
    first.id,
    '3',
    'The first option was correct'
  );

  assert.equal(
    first.text,
    'Three',
    'The first option was correct'
  );
});

test('multiple default selections returned', function (assert) {
  var $select = $(
    '<select multiple>' +
      '<option selected>One</option>' +
      '<option>Two</option>' +
      '<option value="3" selected>Three</option>' +
    '</select>'
  );
  var options = new Options({});

  var select = new Select2($select, options);

  var items = select.data();

  assert.equal(
    items.length,
    2,
    'The two selected items should be returned'
  );

  var first = items[0];

  assert.equal(
    first.id,
    'One',
    'The first option was correct'
  );

  var second = items[1];

  assert.equal(
    second.id,
    '3',
    'The option value should be pulled correctly'
  );
});

module('select2(val)');

test('single value matches jquery value', function (assert) {
  var $select = $(
    '<select>' +
      '<option>One</option>' +
      '<option>Two</option>' +
      '<option value="3" selected>Three</option>' +
    '</select>'
  );
  var options = new Options({});

  var select = new Select2($select, options);

  var value = select.val();

  assert.equal(
    value,
    '3',
    'The value should match the option tag attribute'
  );

  assert.equal(
    value,
    $select.val(),
    'The value should match the jquery value'
  );
});

test('multiple value matches the jquery value', function (assert) {
  var $select = $(
    '<select multiple>' +
      '<option selected>One</option>' +
      '<option>Two</option>' +
      '<option value="3" selected>Three</option>' +
    '</select>'
  );
  var options = new Options({});

  var select = new Select2($select, options);

  var value = select.val();

  assert.equal(
    value.length,
    2,
    'Two options should be selected'
  );

  assert.deepEqual(
    value,
    ['One', '3'],
    'The values should match the option tag attribute'
  );

  assert.deepEqual(
    value,
    $select.val(),
    'The values should match the jquery values'
  );
});

test('selection and clearing of data from ajax source', function (assert) {
  var asyncDone = assert.async();

  var dataURL = 'http://127.0.0.1/test';
  $.mockjax({
    url: dataURL,
    responseText: {results: [{id: 6128, text: '6128'}]},
    logging: 1
  });

  var $container = $('#qunit-fixture');
  var $select = $('<select></select>');
  $container.append($select);

  var select = new Select2($select, {ajax: {url: dataURL}, multiple: true});
 
  assert.equal(
    $select.find(':selected').length,
    0,
    'No items should be selected'
  );

  // Open the dropdown menu, to perform an AJAX request
  select.selection.trigger('query', {term: '6128'});

  var selectionStatus = null;
  select.on('results:all', function() {

    // First call: select a result from the dropdown menu
    if (selectionStatus === null) {

      $('.select2-results__option').trigger('mouseup');
      assert.equal(
        $select.find(':selected').length,
        1,
        'One item should be selected'
      );

      // Trigger a second call
      selectionStatus = true;
      select.selection.trigger('query', {term: '6128'});

    // Second call: unselect the previously-selected item
    } else if (selectionStatus == true) {

      $('.select2-results__option[aria-selected=true]').trigger('mouseup');
      assert.equal(
        $select.find(':selected').length,
        0,
        'The previously-selected item should have been unselected'
      );

      asyncDone();
    }
  });
});
