QUnit.module('Utils - appendContent');

var $ = require('jquery');
var Utils = require('select2/utils');

QUnit.test('appends HTML string as escaped text', function (assert) {
  var $container = $('<div></div>');
  Utils.appendContent(
    $container[0],
    '<strong>test</strong>',
    Utils.escapeMarkup
  );

  assert.equal($container.find('strong').length, 0);
  assert.equal($container.text(), '<strong>test</strong>');
});

QUnit.test('appends String object as escaped text', function (assert) {
  var $container = $('<div></div>');
  var content = new String('<strong>test</strong>'); // jshint ignore:line
  Utils.appendContent($container[0], content, Utils.escapeMarkup);

  assert.equal($container.find('strong').length, 0);
  assert.equal($container.text(), '<strong>test</strong>');
});

QUnit.test('appends DOM/jQuery content as trusted HTML', function (assert) {
  var $container = $('<div></div>');
  Utils.appendContent(
    $container[0],
    $('<strong>test</strong>'),
    Utils.escapeMarkup
  );

  assert.equal($container.find('strong').length, 1);
  assert.equal($container.text(), 'test');
});

QUnit.test('appends null content as no-op', function (assert) {
  var $container = $('<div>existing</div>');
  Utils.appendContent($container[0], null, Utils.escapeMarkup);

  assert.equal($container.text(), 'existing');
});
