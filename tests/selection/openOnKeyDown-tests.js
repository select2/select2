module('Selection containers - Open On Key Down');

var KEYS = require('select2/keys');
var $ = require('jquery');

/**
 * Build a keydown event with the given key code and extra options.
 *
 * @param  {Number} keyCode     the keyboard code to be used for the 'which'
 *                              attribute of the keydown event.
 * @param  {Object} eventProps  extra properties to build the keydown event.
 *
 * @return {jQuery.Event} a 'keydown' type event.
 */
function buildKeyDownEvent (keyCode, eventProps) {
  return $.Event('keydown', $.extend({}, { which: keyCode }, eventProps));
}

/**
 * Wrapper function providing a select2 element with a given enabled/disabled
 * state that will get a given keydown event triggered on it. Provide an
 * assertion callback function to test the results of the triggered event.
 *
 * @param  {Boolean}  isEnabled   the enabled state of the desired select2
 *                                element.
 * @param  {String}   testName    name for the test.
 * @param  {Number}   keyCode     used to set the 'which' attribute of the
 *                                keydown event.
 * @param  {Object}   eventProps  attributes to be used to build the keydown
 *                                event.
 * @param  {Function} fn          assertion callback to perform checks on the
 *                                result of triggering the event, receives the
 *                                'assert' variable for the test and the select2
 *                                instance behind the built <select> element.
 * @return {null}
 */
function testAbled(isEnabled, testName, keyCode, eventProps, fn) {
  test(testName, function (assert) {
    var $element = $(
      '<select>' +
        '<option>one</option>' +
        '<option>two</option>' +
      '</select>'
    );
    $('#qunit-fixture').append($element);
    $element.select2({ disabled: !isEnabled });

    var select2 = $element.data('select2');
    var $selection = select2.$selection;

    assert.notOk(select2.isOpen(), 'The instance should not be open');
    assert.equal(select2.isEnabled(), isEnabled);

    var event = buildKeyDownEvent(keyCode, eventProps);
    assert.ok(event.which, 'The event\'s key code (.which) should be set');

    $selection.trigger(event);

    fn(assert, select2);
  });
}

/**
 * Test the given keydown event on an enabled element. See #testAbled for
 * params.
 */
function testEnabled (testName, keyCode, eventProps, fn) {
  testAbled(true, testName, keyCode, eventProps, fn);
}

/**
 * Test the given keydown event on a disabled element. See #testAbled for
 * params.
 */
function testDisabled (testName, keyCode, eventProps, fn) {
  testAbled(false, testName, keyCode, eventProps, fn);
}

/**
 * Assertion function used by the above test* wrappers. Asserts that the given
 * select2 instance is open.
 *
 * @param  {Assert}   assert
 * @param  {Select2}  select
 * @return {null}
 */
function assertOpened (assert, select2) {
  assert.ok(select2.isOpen(), 'The element should be open');
}

/**
 * Assertion function used by the above test* wrappers. Asserts that the given
 * select2 instance is not open.
 *
 * @param  {Assert}   assert
 * @param  {Select2}  select
 * @return {null}
 */
function assertNotOpened (assert, select2) {
  assert.notOk(select2.isOpen(), 'The element should not be open');
}

/**
 * ENTER, SPACE, and ALT+DOWN should all open an enabled select2 element.
 */
testEnabled(
  'enabled element will open on ENTER',
  KEYS.ENTER, {},
  assertOpened
);
testEnabled(
  'enabled element will open on SPACE',
  KEYS.SPACE, {},
  assertOpened
);
testEnabled(
  'enabled element will open on ALT+DOWN',
  KEYS.DOWN, { altKey: true },
  assertOpened
);

/**
 * Some other keys triggered on an enabled select2 element should not open it.
 */
testEnabled(
  'enabled element will not open on UP',
  KEYS.UP, {},
  assertNotOpened
);
testEnabled(
  'enabled element will not open on DOWN',
  KEYS.UP, {},
  assertNotOpened
);
testEnabled(
  'enabled element will not open on LEFT',
  KEYS.UP, {},
  assertNotOpened
);
testEnabled(
  'enabled element will not open on RIGHT',
  KEYS.UP, {},
  assertNotOpened
);

/*
 * The keys that will open an enabled select2 element should not open a disabled
 * one.
 */
testDisabled(
  'disabled element will not open on ENTER',
  KEYS.ENTER, {},
  assertNotOpened
);
testDisabled(
  'disabled element will not open on SPACE',
  KEYS.SPACE, {},
  assertNotOpened
);
testDisabled(
  'disabled element will not open on ALT+DOWN',
  KEYS.DOWN, { altKey: true },
  assertNotOpened
);

/**
 * Other keys should continue to not open a disabled select2 element.
 */
testDisabled(
  'disabled element will not open on UP',
  KEYS.UP, {},
  assertNotOpened
);
testDisabled(
  'disabled element will not open on DOWN',
  KEYS.UP, {},
  assertNotOpened
);
testDisabled(
  'disabled element will not open on LEFT',
  KEYS.UP, {},
  assertNotOpened
);
testDisabled(
  'disabled element will not open on RIGHT',
  KEYS.UP, {},
  assertNotOpened
);
