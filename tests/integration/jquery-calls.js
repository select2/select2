QUnit.module('select2(val)');

var Utils = require('select2/utils');

QUnit.test('multiple elements with arguments works', function (assert) {
  var $ = require('jquery');
  require('jquery.select2');

  var $first = $(
    '<select>' + '<option>1</option>' + '<option>2</option>' + '</select>'
  );
  var $second = $first.clone();

  var $both = $first.add($second);
  $both.select2();

  $both.select2('val', '2');

  assert.equal(
    $first.val(),
    '2',
    'The call should change the value on the first element'
  );
  assert.equal(
    $second.val(),
    '2',
    'The call should also change the value on the second element'
  );
});

QUnit.test(
  'initializes when jQuery $.data contains' + ' cyclic reference',
  function (assert) {
    var $ = require('jquery');
    require('jquery.select2');

    var $select = $(
      '<select>' +
        '<option>One</option>' +
        '<option>Two</option>' +
        '<option value="3" selected>Three</option>' +
        '</select>'
    );

    // Add a circular reference object using jQuery.
    var recursiveObject = {};

    recursiveObject.same = recursiveObject;

    $select.data('same', recursiveObject);

    $select.select2();

    assert.equal(
      $select.val(),
      '3',
      'The option value should be pulled correctly'
    );
  }
);

QUnit.test(
  '$element.data returns instance and options correctly',
  function (assert) {
    var $ = require('jquery');
    require('jquery.select2');

    var $select = $(
      '<select>' +
        '<option value="1">One</option>' +
        '<option value="2">Two</option>' +
        '<option value="3" selected>Three</option>' +
        '</select>'
    );

    // Initialize.
    $select.select2({ maximumSelectionLength: 2, multiple: true });

    assert.equal($select.val(), '3', 'Only 1 option should be pulled.');

    // Try to resolve instance via .data('select2').
    var $instance = $select.data('select2');
    assert.ok($instance);
    assert.ok($instance.options);

    // Ensure $select.data('select2') is the same instance
    // created by .select2()
    assert.equal($instance, Utils.GetData($instance.$element[0], 'select2'));

    // Ensure initialized property matches.
    assert.equal($instance.options.options.maximumSelectionLength, 2);
  }
);

QUnit.module('select2 search field identifiers');


//   Check search field identification across single and multiple controls.
QUnit.test('search fields have unique IDs and no names', function (assert) {
  // Keep several controls mounted to check identifiers across instances.
  var $ = require('jquery');
  require('jquery.select2');
  var $fixture = $('#qunit-fixture');
  var searchIds = [];

  for (var index = 0; index < 4; index++) {
    // Alternate between dropdown inputs and inline textareas.
    var $select = $('<select><option>One</option></select>')
      .attr('id', 'search-field-' + index)
      .prop('multiple', index % 2 === 1)
      .appendTo($fixture);
    $select.select2({ dropdownParent: $fixture });
    $select.select2('open');
    var $search = $fixture.find(
      '.select2-container--open .select2-search__field'
    );
    var searchId = $search.attr('id');

    // Identify the active search without adding a submitted form field.
    assert.equal($search.length, 1, 'One search field is active');
    assert.ok(searchId, 'The search field has an ID');
    assert.strictEqual(
      $.inArray(searchId, searchIds),
      -1,
      'Each control has a distinct search field ID'
    );
    assert.strictEqual($search.attr('name'), undefined, 'The field has no name');
    searchIds.push(searchId);
    $select.select2('close');
  }

  // Remove all generated controls before the fixture is reset.
  $fixture.find('select').select2('destroy');
});


//   Check search field identification through destruction and reinitialization.
QUnit.test('search field IDs survive reinitialization without duplicates', function (assert) {
  // Exercise both search adapters through the public plugin methods.
  var $ = require('jquery');
  require('jquery.select2');
  var $fixture = $('#qunit-fixture');

  for (var index = 0; index < 2; index++) {
    // Open each control to attach its search field to the document.
    var $select = $('<select><option>One</option></select>')
      .attr('id', 'search-lifecycle-' + index)
      .prop('multiple', index === 1)
      .appendTo($fixture);
    var options = { dropdownParent: $fixture };
    $select.select2(options);
    $select.select2('open');
    var searchId = $fixture.find('.select2-search__field').attr('id');
    assert.ok(searchId, 'The initial search field has an ID');

    // Destroying an open control must remove its identified search field.
    $select.select2('destroy');
    assert.strictEqual(
      document.getElementById(searchId),
      null,
      'The search field is removed on destroy'
    );

    // Reinitialization must attach one replacement with the same stable ID.
    $select.select2(options);
    $select.select2('open');
    var $search = $fixture.find('.select2-search__field');
    assert.strictEqual($search.attr('id'), searchId, 'The ID remains stable');
    assert.strictEqual(
      document.getElementById(searchId),
      $search[0],
      'The ID resolves to the replacement field'
    );
    assert.equal(
      $fixture.find('[id="' + searchId + '"]').length,
      1,
      'The search field ID occurs once'
    );
    $select.select2('destroy');
  }
});