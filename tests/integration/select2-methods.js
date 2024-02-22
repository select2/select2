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
    response: function (settings) {
      this.responseText = {results: [{id: 6128, text: settings.data.term}]};
    },
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

  var queryTerms = ['firstQuery', 'secondQuery', 'thirdQuery', 'fourthQuery'];
  var queryTerm = queryTerms.shift();

  // Open the dropdown menu, to perform an AJAX request
  select.selection.trigger('query', {term: 'firstResult'});

  select.on('results:all', function() {

    // First call: select a result from the dropdown menu
    if (queryTerm == 'firstQuery') {

      $('.select2-results__option').trigger('mouseup');
      assert.equal(
        $select.find('option').length,
        1,
        'An HTML option element should have been created for the item'
      );

      // Trigger a second call
      select.selection.trigger('query', {term: 'secondResult'});

    // Second call: unselect the previously-selected item
    } else if (queryTerm == 'secondQuery') {

      $('.select2-results__option[aria-selected=true]').trigger('mouseup');
      assert.equal(
        $select.find('option').length,
        0,
        'The previously-created HTML option element should have been removed'
      );

      // Trigger a third call
      select.selection.trigger('query', {term: 'thirdResult'});

    // Third call: (re)select the item, which has updated text 'thirdResult'
    } else if (queryTerm == 'thirdQuery') {
      $('.select2-results__option').trigger('mouseup');
      assert.equal(
        $select.find('option').length,
        1,
        'An HTML option element should have been created for the item'
      );

      // Trigger a fourth call
      select.selection.trigger('query', {term: 'fourthResult'});

    // Fourth call: assert that the updated text is in place
    } else if (queryTerm == 'fourthQuery') {
      assert.equal(
        $select.find('option:selected').text(),
        'thirdResult'
      );

      asyncDone();
    }

    queryTerm = queryTerms.shift();
  });
});
