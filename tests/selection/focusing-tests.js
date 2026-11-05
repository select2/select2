QUnit.module('Selection containers - Managing focus');

var SingleSelection = require('select2/selection/single');

var $ = require('jquery');
var Options = require('select2/options');

var options = new Options({});

QUnit.test('close sets the focus to the selection', function (assert) {
  var $container = $('#qunit-fixture .event-container');
  var container = new MockContainer();
  var selection = new SingleSelection($('#qunit-fixture .single'), options);

  var $selection = selection.render();
  selection.bind(container, $container);

  selection.update([
    {
      id: 'test',
      text: 'test'
    }
  ]);

  $container.append($selection);

  assert.notEqual(
    document.activeElement,
    $selection[0],
    'The selection had focus originally'
  );

  container.trigger('close');

  assert.equal(
    document.activeElement,
    $selection[0],
    'After close, focus must be set to selection'
  );
});

QUnit.test('close does not scroll to the selection', function (assert) {
  var $container = $('#qunit-fixture .event-container');
  var container = new MockContainer();
  var selection = new SingleSelection($('#qunit-fixture .single'), options);

  var $selection = selection.render();
  selection.bind(container, $container);

  $container.append($selection);

  // Record the options passed when the focus is restored
  var focusOptions = null;
  var nativeFocus = $selection[0].focus;

  $selection[0].focus = function (opts) {
    focusOptions = opts;

    return nativeFocus.apply(this, arguments);
  };

  container.trigger('close');

  assert.ok(
    focusOptions != null && focusOptions.preventScroll === true,
    'The focus must be restored without scrolling the page'
  );

  assert.equal(
    document.activeElement,
    $selection[0],
    'After close, focus must be set to selection'
  );
});
