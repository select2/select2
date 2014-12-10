module('Options - Attributes');

var Options = require('select2/options');

test('no nesting', function (assert) {
  var $test = $('<select data-test="test"></select>');

  var options = new Options({}, $test);

  assert.equal(options.get('test'), 'test');
});

test('with nesting', function (assert) {
  var $test = $('<select data-first--second="test"></select>');

  var options = new Options({}, $test);

  assert.ok(!(options.get('first-Second')));
  assert.equal(options.get('first').second, 'test');
});
