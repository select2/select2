module('Selection containers - Inline search - Accessibility');

var MultipleSelection = require('select2/selection/multiple');
var InlineSearch = require('select2/selection/search');

var $ = require('jquery');

var Utils = require('select2/utils');
var Options = require('select2/options');
var options = new Options({});

test('role attribute is set to searchbox', function (assert) {
  var $select = $('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection($select, options);
  var $selection = selection.render();

  var container = new MockContainer();
  selection.bind(container, $('<span></span>'));

  // Update the selection so the search is rendered
  selection.update([]);

  assert.equal(
    $selection.find('input').attr('role'),
    'searchbox',
    'The search box is marked as a search box'
  );
});

test('aria-autocomplete attribute is present', function (assert) {
  var $select = $('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection($select, options);
  var $selection = selection.render();

  var container = new MockContainer();
  selection.bind(container, $('<span></span>'));

  // Update the selection so the search is rendered
  selection.update([]);

  assert.equal(
    $selection.find('input').attr('aria-autocomplete'),
    'list',
    'The search box is marked as autocomplete'
  );
});

test('aria-activedescendant should not be set initiailly', function (assert) {
  var $select = $('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection($select, options);
  var $selection = selection.render();

  var container = new MockContainer();
  selection.bind(container, $('<span></span>'));

  // Update the selection so the search is rendered
  selection.update([]);

  var $search = $selection.find('input');

  assert.ok(
    !$search.attr('aria-activedescendant'),
    'The search box should not point to anything when it is first rendered'
  );
});

test('aria-activedescendant should be set after highlight', function (assert) {
  var $select = $('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection($select, options);
  var $selection = selection.render();

  var container = new MockContainer();
  selection.bind(container, $('<span></span>'));

  // Update the selection so the search is rendered
  selection.update([]);

  container.trigger('results:focus', {
    data: {
      _resultId: 'test'
    }
  });

  var $search = $selection.find('input');

  assert.equal(
    $search.attr('aria-activedescendant'),
    'test',
    'The search is pointing to the focused result'
  );
});

test('activedescendant should remove if there is no ID', function (assert) {
  var $select = $('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection($select, options);
  var $selection = selection.render();

  var container = new MockContainer();
  selection.bind(container, $('<span></span>'));

  // Update the selection so the search is rendered
  selection.update([]);

  var $search = $selection.find('input');
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
  var $select = $('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection($select, options);
  var $selection = selection.render();

  var container = new MockContainer();
  selection.bind(container, $('<span></span>'));

  // Update the selection so the search is rendered
  selection.update([]);

  var $search = $selection.find('input');
  $search.attr('aria-activedescendant', 'something');

  container.trigger('close');

  assert.ok(
    !$search.attr('aria-activedescendant'),
    'There is no active descendant when the dropdown is closed'
  );
});

test('aria-controls should not be set initiailly', function (assert) {
  var $select = $('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection($select, options);
  var $selection = selection.render();

  var container = new MockContainer();
  selection.bind(container, $('<span></span>'));

  // Update the selection so the search is rendered
  selection.update([]);

  var $search = $selection.find('input');

  assert.ok(
    !$search.attr('aria-controls'),
    'The search box should not point to the results when it is first rendered'
  );
});

test('aria-controls should be set when opened', function (assert) {
  var $select = $('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection($select, options);
  var $selection = selection.render();

  var container = new MockContainer();
  selection.bind(container, $('<span></span>'));

  // Update the selection so the search is rendered
  selection.update([]);

  var $search = $selection.find('input');

  container.trigger('open');

  assert.ok(
    $search.attr('aria-controls'),
    'The search should point to the results when it is opened'
  );
});

test('aria-controls should be removed when closed', function (assert) {
  var $select = $('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection($select, options);
  var $selection = selection.render();

  var container = new MockContainer();
  selection.bind(container, $('<span></span>'));

  // Update the selection so the search is rendered
  selection.update([]);

  var $search = $selection.find('input');
  $search.attr('aria-controls', 'something');

  container.trigger('close');

  assert.ok(
    !$search.attr('aria-controls'),
    'There are no results for the search box to point to when it is closed'
  );
});
