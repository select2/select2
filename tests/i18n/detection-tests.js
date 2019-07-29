module('Internationalization - Detection');

test('setting language via options', function (assert) {
  var $ = require('jquery');
  require('jquery.select2');
  var $select = $('<select></select>').select2({
    language: 'zh-CN'
  });
  assert.equal($select.data('select2').options.options.language[0],
               'zh-CN');
});

test('setting language via select element lang attribute', function (assert) {
  var $ = require('jquery');
  require('jquery.select2');
  var $select = $('<select lang="el"></select>').select2();
  assert.equal($select.data('select2').options.options.language[0],
               'el');
});

test('setting language via defaults', function (assert) {
  var $ = require('jquery');
  require('jquery.select2');
  $.fn.select2.defaults.set('language', 'eu');
  var $select = $('<select></select>').select2();
  assert.equal($select.data('select2').options.options.language[0],
               'eu');
});

test('setting language via lang attribute', function (assert) {
  var $ = require('jquery');
  require('jquery.select2');
  var $select = $('<div lang="es"><select></select></div>').select2();
  assert.equal($select.data('select2').options.options.language[0],
               'es');
});