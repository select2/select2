module('Internationalization - Detection');

/**
 * Select2 should detect languages through the
 * below options in the order of priority:
 * 
 * - language option
 * - lang property of the select element
 * - Defaults set via the code
 *   $.fn.select2.defaults.set('language', '<LANGUAGE>');
 * - Closest parent element with lang
 */

test('detect language option', function (assert) {
  var $ = require('jquery');
  require('jquery.select2');
  $.fn.select2.defaults.set('language', 'eu');
  var $select = $(
    '<html lang="es">' +
      '<select lang="el">' +
      '</select>' +
    '</html>').select2({
    language: 'zh-CN'
  });
  assert.equal($select.data('select2').options.options.language[0],
               'zh-CN');
});

test('detect select lang attribute', function (assert) {
  var $ = require('jquery');
  require('jquery.select2');
  $.fn.select2.defaults.set('language', 'eu');
  var $select = $(
    '<html lang="es">' +
      '<select lang="el">' +
      '</select>' +
    '</html>').select2();
  assert.equal($select.data('select2').options.options.language[0],
               'el');
});

test('detect default language', function (assert) {
  var $ = require('jquery');
  require('jquery.select2');
  $.fn.select2.defaults.set('language', 'eu');
  var $select = $('<html lang="es"><select></select></html>').select2();
  assert.equal($select.data('select2').options.options.language[0],
               'eu');
});