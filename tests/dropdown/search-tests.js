QUnit.module('Dropdown - Search');

var Dropdown = require('select2/dropdown');
var DropdownSearch = Utils.Decorate(
  Dropdown,
  require('select2/dropdown/search')
);

var $ = require('jquery');
var Options = require('select2/options');
var Utils = require('select2/utils');

var options = new Options({});

QUnit.test('search box defaults autocomplete to off', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  assert.equal(
    $dropdown.find('input').attr('autocomplete'),
    'off',
    'The search box has autocomplete disabled'
  );
});

QUnit.test('search box sets autocomplete from options', function (assert) {
  var $select = $('#qunit-fixture .single');

  var autocompleteOptions = new Options({
    autocomplete: 'country-name'
  });

  var dropdown = new DropdownSearch($select, autocompleteOptions);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  assert.equal(
    $dropdown.find('input').attr('autocomplete'),
    'country-name',
    'The search box sets the right autocomplete attribute'
  );
});

QUnit.test(
  'search does not fire duplicate query when input value does not change',
  function (assert) {
    var $select = $('#qunit-fixture .single');

    var dropdown = new DropdownSearch($select, options);
    var $dropdown = dropdown.render();

    var container = new MockContainer();
    dropdown.bind(container, $('<span></span>'));

    var $search = $dropdown.find('input');
    var queryCount = 0;

    dropdown.on('query', function () {
      queryCount++;
    });

    // Typing a value triggers a search
    $search.val('test');
    $search.trigger('input');

    assert.equal(
      queryCount,
      1,
      'A query is triggered when the value is entered'
    );

    // Re-triggering input with the same value should not trigger another
    // search (e.g. Korean IME input events that fire on arrow/enter keys)
    $search.trigger('input');

    assert.equal(
      queryCount,
      1,
      'No duplicate query is triggered when the value is unchanged'
    );
  }
);

QUnit.test(
  'search still fires query when input value changes after a duplicate',
  function (assert) {
    var $select = $('#qunit-fixture .single');

    var dropdown = new DropdownSearch($select, options);
    var $dropdown = dropdown.render();

    var container = new MockContainer();
    dropdown.bind(container, $('<span></span>'));

    var $search = $dropdown.find('input');
    var queryCount = 0;

    dropdown.on('query', function () {
      queryCount++;
    });

    $search.val('test');
    $search.trigger('input');

    assert.equal(queryCount, 1, 'First value triggers a query');

    // Same value again: duplicate suppressed
    $search.trigger('input');

    assert.equal(queryCount, 1, 'Repeated value does not trigger a query');

    // New value: search should fire again
    $search.val('test2');
    $search.trigger('input');

    assert.equal(
      queryCount,
      2,
      'A changed value triggers a query again after suppression'
    );
  }
);
