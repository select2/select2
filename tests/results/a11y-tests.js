module('Results - Accessibility');

var $ = require('jquery');

var Options = require('select2/options');

var Results = require('select2/results');

test('role of results should be a listbox', function (assert) {
  var results = new Results($('<select></select>'), new Options({}));

  var $results = results.render();

  assert.equal($results.attr('role'), 'listbox');
});

test('multiple select should have aria-multiselectable', function (assert) {
  var results = new Results($('<select></select>'), new Options({
    multiple: true
  }));

  var $results = results.render();

  assert.equal($results.attr('aria-multiselectable'), 'true');
});
