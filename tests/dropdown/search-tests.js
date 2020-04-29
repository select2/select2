module('Dropdown - Search');

var Dropdown = require('select2/dropdown');
var DropdownSearch = Utils.Decorate(
  Dropdown,
  require('select2/dropdown/search')
);

var $ = require('jquery');
var Options = require('select2/options');
var Utils = require('select2/utils');

var options = new Options({});

test('search box defaults autocomplete to off', function (assert) {
  var $select = $('#qunit-fixture .single');

  var dropdown = new DropdownSearch($select, options);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  assert.equal(
    $dropdown.find('input').attr('autocomplete'),
    'off',
    'The search box has autocomplete disabled'
  );
});

test('search box sets autocomplete from options', function (assert) {
  var $select = $('#qunit-fixture .single');

  var autocompleteOptions = new Options({
    autocomplete: 'country-name'
  });

  var dropdown = new DropdownSearch($select, autocompleteOptions);
  var $dropdown = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, $('<span></span>'));

  assert.equal(
    $dropdown.find('input').attr('autocomplete'),
    'country-name',
    'The search box sets the right autocomplete attribute'
  );
});
