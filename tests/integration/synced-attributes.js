module('autocomplete');

var $ = require('jquery');
var Select2 = require('select2/core');
var Options = require('select2/options');

test('autocomplete attribute is copied from ' +
  'select element to search input', function (assert) {
    var $select = $(
      '<select autocomplete="campaign-countries">' +
      '<option>US</option>' +
      '<option>CA</option>' +
      '<option>AU</option>' +
      '</select>'
    );

    var options = new Options({});

    var select = new Select2($select, options);
    var $dropdownInput = select.$dropdown.find('input');

    assert.equal(
      $dropdownInput.attr('autocomplete'),
      'campaign-countries',
      'The autocomplete attribute is copied from the ' +
      'select element to the search input'
    );
  });

test('autocomplete defaults to "off"', function (assert) {
  var $select = $(
    '<select>' +
    '<option>One</option>' +
    '<option>Two</option>' +
    '</select>'
  );

  var options = new Options({});

  var select = new Select2($select, options);
  var $dropdownInput = select.$dropdown.find('input');

  assert.equal(
    $dropdownInput.attr('autocomplete'),
    'off',
    'The autocomplete attribute defaults to "off" ' +
    'if not present on the select element'
  );
});
