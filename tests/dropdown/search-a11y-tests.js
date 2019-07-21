module('Dropdown - Search - Accessibility');

var Utils = require('select2/utils');

var Dropdown = require('select2/dropdown');
var DropdownSearch = Utils.Decorate(
  Dropdown,
  require('select2/dropdown/search')
);

var $ = require('jquery');

var Options = require('select2/options');
var options = new Options({});

test('aria-autocomplete attribute is present', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  assert.equal(
    $dropdown.find('input').attr('aria-autocomplete'),
    'list',
    'The search box is marked as autocomplete'
  );
});

test('aria-activedescendant should not be set initiailly', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  var $search = $dropdown.find('input');

  assert.ok(
    !$search.attr('aria-activedescendant'),
    'The search box should not point to anything when it is first rendered'
  );
});

test('aria-activedescendant should be set after highlight', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  container.trigger('results:focus', {
    data: {
      _resultId: 'test'
    }
  });

  var $search = $dropdown.find('input');

  assert.equal(
    $search.attr('aria-activedescendant'),
    'test',
    'The search is pointing to the focused result'
  );
});

test('activedescendant should remove if there is no ID', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  var $search = $dropdown.find('input');
  $search.attr('aria-activedescendant', 'test');

  container.trigger('results:focus', {
    data: {}
  });

  assert.ok(
    !$search.attr('aria-activedescendant'),
    'There is no result for the search to be pointing to'
  );
});

test('aria-activedescendant should be removed when closed', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  var $search = $dropdown.find('input');
  $search.attr('aria-activedescendant', 'something');

  container.trigger('close');

  assert.ok(
    !$search.attr('aria-activedescendant'),
    'There is no active descendant when the dropdown is closed'
  );
});

test('aria-owns should not be set initiailly', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  var $search = $dropdown.find('input');

  assert.ok(
    !$search.attr('aria-owns'),
    'The search box should not point to the results when it is first rendered'
  );
});

test('aria-owns should be set when opened', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  var $search = $dropdown.find('input');

  container.trigger('open');

  assert.ok(
    $search.attr('aria-owns'),
    'The search should point to the results when it is opened'
  );
});

test('aria-owns should be removed when closed', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  var $search = $dropdown.find('input');
  $search.attr('aria-owns', 'something');

  container.trigger('close');

  assert.ok(
    !$search.attr('aria-owns'),
    'There are no results for the search box to point to when it is closed'
  );
});
