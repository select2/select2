QUnit.module('Accessibility - All');

var BaseSelection = require('select2/selection/base');
var SingleSelection = require('select2/selection/single');
var MultipleSelection = require('select2/selection/multiple');

var $ = require('jquery');

var Options = require('select2/options');
var options = new Options({});

QUnit.test('title is carried over from original element', function (assert) {
  var $select = $('#qunit-fixture .single');

  var selection = new BaseSelection($select, options);
  var $selection = selection.render();

  assert.equal(
    $selection.attr('title'),
    $select.attr('title'),
    'The title should have been copied over from the original element'
  );
});

QUnit.test(
  'aria-expanded reflects the state of the container',
  function (assert) {
    var $select = $('#qunit-fixture .single');

    var selection = new BaseSelection($select, options);
    var $selection = selection.render();

    var container = new MockContainer();

    selection.bind(container, $('<span></span>'));

    assert.equal(
      $selection.attr('aria-expanded'),
      'false',
      'The container should not be expanded when it is closed'
    );

    container.trigger('open');

    assert.equal(
      $selection.attr('aria-expanded'),
      'true',
      'The container should be expanded when it is opened'
    );
  }
);

QUnit.test('static aria attributes are present', function (assert) {
  var $select = $('#qunit-fixture .single');

  var selection = new BaseSelection($select, options);
  var $selection = selection.render();

  assert.equal(
    $selection.attr('role'),
    'combobox',
    'The container should identify as a combobox'
  );

  assert.equal(
    $selection.attr('aria-haspopup'),
    'true',
    'The dropdown is considered a popup of the container'
  );
});

QUnit.test('origin aria label is preserved', function (assert) {
  var $select = $('#qunit-fixture .single');
  $select.attr('aria-label', 'label');
  $select.attr('aria-labelledby', 'element');

  var selection = new BaseSelection($select, options);
  var $selection = selection.render();

  assert.equal(
    $selection.attr('aria-label'),
    'label',
    'The aria-label from the select element has been preserved'
  );

  assert.equal(
    $selection.attr('aria-labelledby'),
    'element',
    'The aria-labelledby from the select element has been preserved'
  );
});

QUnit.test('the container should be in the tab order', function (assert) {
  var $select = $('#qunit-fixture .single');

  var selection = new BaseSelection($select, options);
  var $selection = selection.render();

  var container = new MockContainer();
  selection.bind(container, $('<span></span>'));

  assert.equal(
    $selection.attr('tabindex'),
    '0',
    'The tab index should allow it to fit in the natural tab order'
  );

  container.trigger('disable');

  assert.equal(
    $selection.attr('tabindex'),
    '-1',
    'The selection should be dropped out of the tab order when disabled'
  );

  container.trigger('enable');

  assert.equal(
    $selection.attr('tabindex'),
    '0',
    'The tab index should be restored when re-enabled'
  );
});

QUnit.test('a custom tabindex is copied', function (assert) {
  var $select = $('#qunit-fixture .single');
  $select.attr('tabindex', '999');

  var selection = new BaseSelection($select, options);
  var $selection = selection.render();

  var container = new MockContainer();
  selection.bind(container, $('<span></span>'));

  assert.equal(
    $selection.attr('tabindex'),
    '999',
    'The tab index should match the original tab index'
  );

  container.trigger('disable');

  assert.equal(
    $selection.attr('tabindex'),
    '-1',
    'The selection should be dropped out of the tab order when disabled'
  );

  container.trigger('enable');

  assert.equal(
    $selection.attr('tabindex'),
    '999',
    'The tab index should be restored when re-enabled'
  );
});

QUnit.test('aria-disabled should reflected disabled state', function (assert) {
  var $select = $('#qunit-fixture .single');

  var selection = new BaseSelection($select, options);
  var $selection = selection.render();

  var container = new MockContainer();
  selection.bind(container, $('<span></span>'));

  assert.equal(
    $selection.attr('aria-disabled'),
    'false',
    'The tab index should match the original tab index'
  );

  container.trigger('disable');

  assert.equal(
    $selection.attr('aria-disabled'),
    'true',
    'The selection should be dropped out of the tab order when disabled'
  );

  container.trigger('enable');

  assert.equal(
    $selection.attr('aria-disabled'),
    'false',
    'The tab index should be restored when re-enabled'
  );
});

QUnit.module('Accessibility - Single');

QUnit.test(
  'aria-labelledby should match the rendered container',
  function (assert) {
    var $select = $('#qunit-fixture .single');

    var selection = new SingleSelection($select, options);
    var $selection = selection.render();

    var container = new MockContainer();
    selection.bind(container, $('<span></span>'));

    var $rendered = $selection.find('.select2-selection__rendered');

    assert.equal(
      $selection.attr('aria-labelledby'),
      $rendered.attr('id'),
      'The rendered selection should label the container'
    );
  }
);

QUnit.test('selection changes retain the live label', function (assert) {
  var $fixture = $('#qunit-fixture');
  var $label = $('<label for="country">Country</label>').appendTo($fixture);
  var $select = $(
    '<select id="country"><option>Canada</option><option>Japan</option></select>'
  )
    .appendTo($fixture)
    .select2();
  var $selection = $select.next().find('[role="combobox"]');
  var $rendered = $selection.find('.select2-selection__rendered');

  assert.ok($label[0].id, 'The visible label can be referenced');
  assert.strictEqual($selection.attr('aria-labelledby'), $label[0].id);
  assert.strictEqual($selection.attr('aria-controls'), $rendered[0].id);

  $select.val('Japan').trigger('change');
  $label.text('Destination');

  assert.strictEqual($rendered.text(), 'Japan');
  assert.strictEqual(
    document.getElementById($selection.attr('aria-labelledby')),
    $label[0],
    'The control still refers to the live label'
  );
  $select.select2('destroy');
});

QUnit.test('wrapping and external labels follow DOM order', function (assert) {
  var $fixture = $('#qunit-fixture');
  var $wrapper = $(
    '<label>Country <select id="country"></select></label>'
  ).appendTo($fixture);
  var $extra = $(
    '<label id="scope" for="country">of residence</label>'
  ).appendTo($fixture);
  var $select = $wrapper.find('select').select2();
  var $selection = $select.next().find('[role="combobox"]');

  assert.ok($wrapper[0].id, 'The wrapping label has a usable ID');
  assert.strictEqual(
    $selection.attr('aria-labelledby'),
    $wrapper[0].id + ' ' + $extra[0].id
  );
  $select.select2('destroy');
  assert.strictEqual($extra[0].id, 'scope', 'The existing label ID survives');
});

QUnit.test('explicit ARIA names take precedence', function (assert) {
  var $fixture = $('#qunit-fixture');
  $('<label for="country">Country</label>').appendTo($fixture);
  $(
    '<span id="shipping">Shipping</span><span id="address">address</span>'
  ).appendTo($fixture);
  var $select = $(
    '<select id="country" aria-label="Destination" ' +
      'aria-labelledby="shipping address"></select>'
  )
    .appendTo($fixture)
    .select2();
  var $selection = $select.next().find('[role="combobox"]');

  assert.strictEqual($selection.attr('aria-labelledby'), 'shipping address');

  $select.select2('destroy');
  $select.removeAttr('aria-labelledby').select2();
  $selection = $select.next().find('[role="combobox"]');
  assert.strictEqual($selection.attr('aria-label'), 'Destination');
  assert.notOk($selection.attr('aria-labelledby'));
  $select.select2('destroy');
});

QUnit.test('unusable ARIA names fall back to the label', function (assert) {
  var $fixture = $('#qunit-fixture');
  $('<span id="account">Account</span>').appendTo($fixture);
  var cases = [
    ['aria-label', '   ', 'native-label'],
    ['aria-labelledby', 'missing unknown', 'native-label'],
    ['aria-labelledby', 'missing account', 'missing account']
  ];

  $.each(cases, function (_, testCase) {
    var $group = $(
      '<div><label for="country" id="native-label">Country</label>' +
        '<select id="country"><option>Canada</option></select></div>'
    ).appendTo($fixture);
    var $select = $group
      .find('select')
      .attr(testCase[0], testCase[1])
      .select2();
    var $selection = $select.next().find('[role="combobox"]');

    assert.strictEqual(
      $selection.attr('aria-labelledby'),
      testCase[2],
      testCase[0] + '="' + testCase[1] + '"'
    );
    $select.select2('destroy');
    $group.remove();
  });
});

QUnit.test('label IDs are safe across reinitialization', function (assert) {
  var $fixture = $('#qunit-fixture');
  var $label = $('<label for="country">Country</label>').appendTo($fixture);
  var $select = $('<select id="country"></select>')
    .appendTo($fixture)
    .select2();
  var firstId = $label[0].id;
  $select.select2('destroy');
  assert.notOk($label[0].id, 'Destroy restores the original label');

  // Occupy the next generated ID before reinitializing the widget.
  var reservedId = firstId.replace(/\d+$/, function (number) {
    return String(Number(number) + 1);
  });
  var $other = $('<span></span>').attr('id', reservedId).appendTo($fixture);
  $select.select2();
  var $selection = $select.next().find('[role="combobox"]');
  var currentId = $selection.attr('aria-labelledby');
  assert.strictEqual(document.getElementById(currentId), $label[0]);
  assert.notStrictEqual(currentId, reservedId, 'The selected ID is unique');
  assert.strictEqual(document.getElementById(reservedId), $other[0]);

  $label[0].id = 'new-author-id';
  $select.select2('destroy');
  assert.strictEqual($label[0].id, 'new-author-id');
});

QUnit.module('Accessibility - Multiple');
