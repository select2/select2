module('select2(api)', {
  afterEach: function() {
    $('body > .select2-container').remove();
  }
});

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

test('open focuses search input', function (assert) {
  var done = assert.async();

  var $ = require('jquery');
  require('jquery.select2');

  var  $fixture = $('#qunit-fixture');

  var $selectOrig = $(
    '<select>' +
      '<option>1</option>' +
      '<option>2</option>' +
    '</select>'
  );
  $fixture.append($selectOrig);

  $(function() {
    $selectOrig.select2({minimumResultsForSearch: 1});
    assertSelectyStuffIsNotFocused(assert, $selectOrig, $fixture);

    $selectOrig.select2('open');

    setTimeout(function() {
      var $search = $('body .select2-container input.select2-search__field');
      assert.equal($search.length, 1, 'Search input should exist.');
      var searchElem = $search[0];

      assert.ok($.contains(document.documentElement, $search[0]), 'Search input should be in DOM.');
      assert.ok($search.is(':visible'), 'Search input should be visible.');

      assert.equal(searchElem, searchElem.ownerDocument.activeElement, 'Search input should be focused. Focused element was ' + document.activeElement);

      done();
    });
  });
});

test('open focuses something reasonable when search input is invisible.', function (assert) {
  var done = assert.async();

  var $ = require('jquery');
  require('jquery.select2');

  var  $fixture = $('#qunit-fixture');

  var $selectOrig = $(
    '<select>' +
      '<option>1</option>' +
      '<option>2</option>' +
    '</select>'
  );
  $fixture.append($selectOrig);

  $(function() {
    $selectOrig.select2({minimumResultsForSearch: 99});
    assertSelectyStuffIsNotFocused(assert, $selectOrig, $fixture);

    $selectOrig.select2('open');

    setTimeout(function() {
      var $hidden = $('body .select2-search--dropdown.select2-search--hide');
      assert.equal($hidden.length, 1, 'A container for search should be hidden.');
      assert.ok($hidden.is(':hidden'), 'Hidden section should be hidden.');
      assert.equal($hidden.css('display'), 'none', 'Hidden section should have display:none.');

      var $container = $('body .select2-container');
      var $search = $container.find('input.select2-search__field');
      assert.ok($search.is(':hidden'), 'Select2 dropdown should not have a visible search field.');

      activeElement = document.activeElement;
      assert.ok($.contains($container[0], activeElement), 'Something in the dropdown should be focused. Focused element was ' + activeElement);

      done();
    });
  });
});

function assertSelectyStuffIsNotFocused(assert, $selectOrig, $fixture) {
    var activeElement = document.activeElement;
    assert.equal($selectOrig.has(':focus').length, 0, 'Original select field should not be focused. Focused element was ' + activeElement);
    assert.equal($fixture.find('.select2').has(':focus').length, 0, 'Select2 elements should not be focused. Focused element was ' + activeElement);
}

