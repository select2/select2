module('Options - Copying from element');

var $ = require('jquery');

var Options = require('select2/options');

test('copies disabled attribute when set', function (assert) {
  var $test = $('<select disabled></select>');

  var options = new Options({}, $test);

  assert.ok(options.get('disabled'));
});

test('does not copy disabled attribute when not set', function (assert) {
  var $test = $('<select></select>');

  var options = new Options({}, $test);

  assert.ok(!options.get('disabled'));
});

test('disabled attribute does not override disable option', function (assert) {
  var $test = $('<select disabled></select>');

  var options = new Options({
    disabled: false
  }, $test);

  assert.ok(!options.get('disabled'));
});

test('disabled option is synchronized back', function (assert) {
  var $test = $('<select disabled></select>');

  assert.ok($test.prop('disabled'));

  var options = new Options({
    disabled: false
  }, $test);

  assert.ok(!$test.prop('disabled'));
});

test('copies multiple attribute when set', function (assert) {
  var $test = $('<select multiple></select>');

  var options = new Options({}, $test);

  assert.ok(options.get('multiple'));
});

test('does not copy multiple attribute when not set', function (assert) {
  var $test = $('<select></select>');

  var options = new Options({}, $test);

  assert.ok(!options.get('multiple'));
});

test('multiple attribute does not override multiple option', function (assert) {
  var $test = $('<select multiple></select>');

  var options = new Options({
    multiple: false
  }, $test);

  assert.ok(!options.get('multiple'));
});

test('multiple option is synchronized back', function (assert) {
  var $test = $('<select multiple></select>');

  assert.ok($test.prop('multiple'));

  var options = new Options({
    multiple: false
  }, $test);

  assert.ok(!$test.prop('multiple'));
});

test('copies autocomplete attribute when set', function (assert) {
  var $test = $('<select autocomplete="country-name"></select>');

  if ($test.prop('autocomplete') !== 'country-name') {
    // Browser does not support the autocomplete attribute on a select
    assert.ok(true);
    return;
  }

  var options = new Options({}, $test);

  assert.equal(options.get('autocomplete'), 'country-name');
});

test('does not copy autocomplete attribute when not set', function (assert) {
  var $test = $('<select></select>');

  var options = new Options({}, $test);

  assert.equal(options.get('autocomplete'), 'off');
});

test('autocomplete attribute does not override option', function (assert) {
  var $test = $('<select autocomplete="country-name"></select>');

  var options = new Options({
    autocomplete: 'organization'
  }, $test);

  assert.ok(options.get('autocomplete'), 'organization');
});
