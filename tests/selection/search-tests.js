module('Selection containers - Inline search');

var MultipleSelection = require('select2/selection/multiple');
var InlineSearch = require('select2/selection/search');

var $ = require('jquery');
var Options = require('select2/options');
var Utils = require('select2/utils');

var options = new Options({});

test('backspace will remove a choice', function (assert) {
  assert.expect(3);

  var KEYS = require('select2/keys');

  var $container = $('#qunit-fixture .event-container');
  var container = new MockContainer();

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);

  var $element = $('#qunit-fixture .multiple');
  var selection = new CustomSelection($element, options);

  var $selection = selection.render();
  selection.bind(container, $container);

  // The unselect event should be triggered at some point
  selection.on('unselect', function () {
    assert.ok(true, 'A choice was unselected');
  });

  // Add some selections and render the search
  selection.update([
    {
      id: '1',
      text: 'One'
    }
  ]);

  var $search = $selection.find('input');
  var $choices = $selection.find('.select2-selection__choice');

  assert.equal($search.length, 1, 'The search was visible');
  assert.equal($choices.length, 1, 'The choice was rendered');

  // Trigger the backspace on the search
  var backspace = $.Event('keydown', {
    which: KEYS.BACKSPACE
  });
  $search.trigger(backspace);
});

test('backspace will set the search text', function (assert) {
  assert.expect(3);

  var KEYS = require('select2/keys');

  var $container = $('#qunit-fixture .event-container');
  var container = new MockContainer();

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);

  var $element = $('#qunit-fixture .multiple');
  var selection = new CustomSelection($element, options);

  var $selection = selection.render();
  selection.bind(container, $container);

  // Add some selections and render the search
  selection.update([
    {
      id: '1',
      text: 'One'
    }
  ]);

  var $search = $selection.find('input');
  var $choices = $selection.find('.select2-selection__choice');

  assert.equal($search.length, 1, 'The search was visible');
  assert.equal($choices.length, 1, 'The choice was rendered');

  // Trigger the backspace on the search
  var backspace = $.Event('keydown', {
    which: KEYS.BACKSPACE
  });
  $search.trigger(backspace);

  assert.equal($search.val(), 'One', 'The search text was set');
});

test('updating selection does not shift the focus', function (assert) {
  // Check for IE 8, which triggers a false negative during testing
  if (window.attachEvent && !window.addEventListener) {
    // We must expect 0 assertions or the test will fail
    assert.expect(0);
    return;
  }

  var $container = $('#qunit-fixture .event-container');
  var container = new MockContainer();

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);

  var $element = $('#qunit-fixture .multiple');
  var selection = new CustomSelection($element, options);

  var $selection = selection.render();
  selection.bind(container, $container);

  // Update the selection so the search is rendered
  selection.update([]);

  // Make it visible so the browser can place focus on the search
  $container.append($selection);

  var $search = $selection.find('input');
  $search.trigger('focus');

  assert.equal($search.length, 1, 'The search was not visible');

  assert.equal(
    document.activeElement,
    $search[0],
    'The search did not have focus originally'
  );

  // Trigger an update, this should redraw the search box
  selection.update([]);

  assert.equal($search.length, 1, 'The search box disappeared');

  assert.equal(
    document.activeElement,
    $search[0],
    'The search did not have focus after the selection was updated'
  );
});

test('the focus event shifts the focus', function (assert) {
  // Check for IE 8, which triggers a false negative during testing
  if (window.attachEvent && !window.addEventListener) {
    // We must expect 0 assertions or the test will fail
    assert.expect(0);
    return;
  }

  var $container = $('#qunit-fixture .event-container');
  var container = new MockContainer();

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);

  var $element = $('#qunit-fixture .multiple');
  var selection = new CustomSelection($element, options);

  var $selection = selection.render();
  selection.bind(container, $container);

  // Update the selection so the search is rendered
  selection.update([]);

  // Make it visible so the browser can place focus on the search
  $container.append($selection);

  // The search should not be automatically focused

  var $search = $selection.find('input');

  assert.notEqual(
    document.activeElement,
    $search[0],
    'The search had focus originally'
  );

  assert.equal($search.length, 1, 'The search was not visible');

  // Focus the container

  container.trigger('focus');

  // Make sure it focuses the search

  assert.equal($search.length, 1, 'The search box disappeared');

  assert.equal(
    document.activeElement,
    $search[0],
    'The search did not have focus originally'
  );
});

test('search box without text should propagate click', function (assert) {
  assert.expect(1);

  var $container = $('#qunit-fixture .event-container');
  var container = new MockContainer();

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);

  var $element = $('#qunit-fixture .multiple');
  var selection = new CustomSelection($element, options);

  var $selection = selection.render();
  selection.bind(container, $container);

  // Update the selection so the search is rendered
  selection.update([]);

  // Make it visible so the browser can place focus on the search
  $container.append($selection);

  $selection.on('click', function () {
    assert.ok(true, 'The click event should not have been trapped');
  });

  var $search = $selection.find('input');
  $search.trigger('click');
});

test('search box with text should not propagate click', function (assert) {
  assert.expect(0);

  var $container = $('#qunit-fixture .event-container');
  var container = new MockContainer();

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);

  var $element = $('#qunit-fixture .multiple');
  var selection = new CustomSelection($element, options);

  var $selection = selection.render();
  selection.bind(container, $container);

  // Update the selection so the search is rendered
  selection.update([]);

  // Make it visible so the browser can place focus on the search
  $container.append($selection);

  $selection.on('click', function () {
    assert.ok(false, 'The click event should have been trapped');
  });

  var $search = $selection.find('input');
  $search.val('test');
  $search.trigger('click');
});

test('search box with text should not close dropdown', function (assert) {
  assert.expect(0);

  var $container = $('#qunit-fixture .event-container');
  var container = new MockContainer();

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);

  var $element = $('#qunit-fixture .multiple');
  var selection = new CustomSelection($element, options);

  var $selection = selection.render();
  selection.bind(container, $container);

  // Update the selection so the search is rendered
  selection.update([]);

  // Make it visible so the browser can place focus on the search
  $container.append($selection);

  container.on('close', function () {
    assert.ok(false, 'The dropdown should not have closed');
  });

  var $search = $selection.find('input');
  $search.val('test');
  $search.trigger('click');
});
