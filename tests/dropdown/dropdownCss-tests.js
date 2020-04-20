module('Dropdown - dropdownCssClass');

var $ = require('jquery');
var Utils = require('select2/utils');
var Options = require('select2/options');

var Dropdown = require('select2/dropdown');
var DropdownCSS = Utils.Decorate(
  Dropdown,
  require('select2/dropdown/dropdownCss')
);

test('all classes will be copied if :all: is used', function (assert) {
  var $element = $('<select class="test copy works"></select>');
  var options = new Options({
    dropdownCssClass: ':all:'
  });

  var select = new DropdownCSS($element, options);
  var $dropdown = select.render();

  assert.ok($dropdown.hasClass('test'));
  assert.ok($dropdown.hasClass('copy'));
  assert.ok($dropdown.hasClass('works'));
  assert.ok(!$dropdown.hasClass(':all:'));
});

test(':all: can be used with other classes', function (assert) {
  var $element = $('<select class="test copy works"></select>');
  var options = new Options({
    dropdownCssClass: ':all: other'
  });

  var select = new DropdownCSS($element, options);
  var $dropdown = select.render();

  assert.ok($dropdown.hasClass('test'));
  assert.ok($dropdown.hasClass('copy'));
  assert.ok($dropdown.hasClass('works'));
  assert.ok($dropdown.hasClass('other'));
  assert.ok(!$dropdown.hasClass(':all:'));
});

test('classes can be passed in as a string', function (assert) {
  var $element = $('<select class="test copy works"></select>');
  var options = new Options({
    dropdownCssClass: 'other'
  });

  var select = new DropdownCSS($element, options);
  var $dropdown = select.render();

  assert.ok($dropdown.hasClass('other'));
});
