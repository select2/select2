QUnit.module('Options - Copying from element');

var $ = require('jquery');

var Options = require('select2/options');

QUnit.test('copies disabled attribute when set', function (assert) {
  var $test = $('<select disabled></select>');

  var options = new Options({}, $test);

  assert.ok(options.get('disabled'));
});

QUnit.test('does not copy disabled attribute when not set', function (assert) {
  var $test = $('<select></select>');

  var options = new Options({}, $test);

  assert.ok(!options.get('disabled'));
});

QUnit.test('disabled attribute does not override disable option', function (assert) {
  var $test = $('<select disabled></select>');

  var options = new Options({
    disabled: false
  }, $test);

  assert.ok(!options.get('disabled'));
});

QUnit.test('disabled option is synchronized back', function (assert) {
  var $test = $('<select disabled></select>');

  assert.ok($test.prop('disabled'));

  var options = new Options({
    disabled: false
  }, $test);

  assert.ok(!$test.prop('disabled'));
});

QUnit.test('copies multiple attribute when set', function (assert) {
  var $test = $('<select multiple></select>');

  var options = new Options({}, $test);

  assert.ok(options.get('multiple'));
});

QUnit.test('does not copy multiple attribute when not set', function (assert) {
  var $test = $('<select></select>');

  var options = new Options({}, $test);

  assert.ok(!options.get('multiple'));
});

QUnit.test('multiple attribute does not override multiple option', function (assert) {
  var $test = $('<select multiple></select>');

  var options = new Options({
    multiple: false
  }, $test);

  assert.ok(!options.get('multiple'));
});

QUnit.test('multiple option is synchronized back', function (assert) {
  var $test = $('<select multiple></select>');

  assert.ok($test.prop('multiple'));

  var options = new Options({
    multiple: false
  }, $test);

  assert.ok(!$test.prop('multiple'));
});

QUnit.test('copies autocomplete attribute when set', function (assert) {
  var $test = $('<select autocomplete="country-name"></select>');

  if ($test.prop('autocomplete') !== 'country-name') {
    // Browser does not support the autocomplete attribute on a select
    assert.ok(true);
    return;
  }

  var options = new Options({}, $test);

  assert.equal(options.get('autocomplete'), 'country-name');
});

QUnit.test('does not copy autocomplete attribute when not set', function (assert) {
  var $test = $('<select></select>');

  var options = new Options({}, $test);

  assert.equal(options.get('autocomplete'), 'off');
});

QUnit.test('autocomplete attribute does not override option', function (assert) {
  var $test = $('<select autocomplete="country-name"></select>');

  var options = new Options({
    autocomplete: 'organization'
  }, $test);

  assert.ok(options.get('autocomplete'), 'organization');
});

QUnit.test('copies dir attribute when set on the element', function (assert) {
  var $test = $('<select dir="rtl"></select>');

  var options = new Options({}, $test);

  assert.equal(options.get('dir'), 'rtl');
});

QUnit.test('inherits dir from a closest ancestor when unset', function (assert) {
  var $parent = $('<div dir="rtl"></div>');
  var $test = $('<select></select>');

  $parent.append($test);

  var options = new Options({}, $test);

  assert.equal(options.get('dir'), 'rtl');
});

QUnit.test('defaults dir to ltr when no ancestor has dir', function (assert) {
  var $test = $('<select></select>');

  var options = new Options({}, $test);

  assert.equal(options.get('dir'), 'ltr');
});

QUnit.test('does not crash when dir option is null and no ancestor has dir', function (assert) {
  var $test = $('<select></select>');

  var options = new Options({
    dir: null
  }, $test);

  assert.equal(options.get('dir'), 'ltr');
});
