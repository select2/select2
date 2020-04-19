module('Dropdown - selectionCssClass');

var $ = require('jquery');
var Utils = require('select2/utils');
var Options = require('select2/options');

var SingleSelection = require('select2/selection/single');
var SelectionCSS = Utils.Decorate(
  SingleSelection,
  require('select2/selection/selectionCss')
);

test('all classes will be copied if :all: is used', function (assert) {
  var $element = $('<select class="test copy works"></select>');
  var options = new Options({
    selectionCssClass: ':all:'
  });

  var select = new SelectionCSS($element, options);
  var $container = select.render();

  assert.ok($container.hasClass('test'));
  assert.ok($container.hasClass('copy'));
  assert.ok($container.hasClass('works'));
  assert.ok(!$container.hasClass(':all:'));
});

test(':all: can be used with other classes', function (assert) {
  var $element = $('<select class="test copy works"></select>');
  var options = new Options({
    selectionCssClass: ':all: other'
  });

  var select = new SelectionCSS($element, options);
  var $container = select.render();

  assert.ok($container.hasClass('test'));
  assert.ok($container.hasClass('copy'));
  assert.ok($container.hasClass('works'));
  assert.ok($container.hasClass('other'));
  assert.ok(!$container.hasClass(':all:'));
});

test('classes can be passed in as a string', function (assert) {
  var $element = $('<select class="test copy works"></select>');
  var options = new Options({
    selectionCssClass: 'other'
  });

  var select = new SelectionCSS($element, options);
  var $container = select.render();

  assert.ok($container.hasClass('other'));
  assert.ok(!$container.hasClass('copy'));
});
