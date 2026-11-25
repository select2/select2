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
  'explicit aria-label takes precedence over the native label',
  function (assert) {
    var $fixture = $('#qunit-fixture');
    var $label = $('<label for="country">Country</label>').appendTo($fixture);
    var $select = $(
      '<select id="country" aria-label="Destination">' +
        '<option>Canada</option><option>Japan</option>' +
        '</select>'
    ).appendTo($fixture);

    var selection = new SingleSelection($select, options);
    var $selection = selection.render();

    var container = new MockContainer();
    container.id = 'country';
    selection.bind(container, $('<span></span>'));

    assert.strictEqual(
      $selection.attr('aria-label'),
      'Destination',
      'The explicit aria-label is preserved'
    );
    assert.notOk(
      $selection.attr('aria-labelledby'),
      'aria-labelledby is not set when aria-label is present'
    );

    selection.destroy();
    assert.notOk($label[0].id, 'No generated label id remains on destroy');
  }
);

QUnit.test(
  'explicit aria-labelledby takes precedence over the native label',
  function (assert) {
    var $fixture = $('#qunit-fixture');
    var $label = $('<label for="country">Country</label>').appendTo($fixture);
    $('<span id="shipping">Shipping</span>').appendTo($fixture);
    var $select = $(
      '<select id="country" aria-labelledby="shipping">' +
        '<option>Canada</option><option>Japan</option>' +
        '</select>'
    ).appendTo($fixture);

    var selection = new SingleSelection($select, options);
    var $selection = selection.render();

    var container = new MockContainer();
    container.id = 'country';
    selection.bind(container, $('<span></span>'));

    assert.strictEqual(
      $selection.attr('aria-labelledby'),
      'shipping',
      'The explicit aria-labelledby is preserved'
    );
    assert.notOk(
      $selection.attr('aria-label'),
      'aria-label is not set when only aria-labelledby is present'
    );

    selection.destroy();
  }
);

QUnit.test(
  'native label is used as the accessible name when no explicit ARIA',
  function (assert) {
    var $fixture = $('#qunit-fixture');
    var $label = $('<label for="country">Country</label>').appendTo($fixture);
    var $select = $(
      '<select id="country"><option>Canada</option><option>Japan</option></select>'
    ).appendTo($fixture);

    var selection = new SingleSelection($select, options);
    var $selection = selection.render();

    var container = new MockContainer();
    container.id = 'country';
    selection.bind(container, $('<span></span>'));

    assert.ok(
      $label[0].id,
      'The label gets a generated id so it can be referenced'
    );
    assert.strictEqual(
      $selection.attr('aria-labelledby'),
      $label[0].id,
      'The container is labelled by the native label'
    );
    assert.notOk(
      $selection.attr('aria-label'),
      'No aria-label is set on the container'
    );

    selection.destroy();
    assert.notOk($label[0].id, 'The generated label id is removed on destroy');
  }
);

QUnit.module('Accessibility - Multiple');

QUnit.test(
  'explicit aria-label takes precedence over the native label',
  function (assert) {
    var $fixture = $('#qunit-fixture');
    var $label = $('<label for="countries">Countries</label>').appendTo(
      $fixture
    );
    var $select = $(
      '<select id="countries" multiple aria-label="Destinations">' +
        '<option>Canada</option><option>Japan</option>' +
        '</select>'
    ).appendTo($fixture);

    var selection = new MultipleSelection($select, options);
    var $selection = selection.render();

    var container = new MockContainer();
    container.id = 'countries';
    selection.bind(container, $('<span></span>'));

    assert.strictEqual(
      $selection.attr('aria-label'),
      'Destinations',
      'The explicit aria-label is preserved'
    );
    assert.notOk(
      $selection.attr('aria-labelledby'),
      'aria-labelledby is not set when aria-label is present'
    );

    selection.destroy();
    assert.notOk($label[0].id, 'No generated label id remains on destroy');
  }
);

QUnit.test(
  'explicit aria-labelledby takes precedence over the native label',
  function (assert) {
    var $fixture = $('#qunit-fixture');
    var $label = $('<label for="countries">Countries</label>').appendTo(
      $fixture
    );
    $('<span id="shipping">Shipping</span>').appendTo($fixture);
    var $select = $(
      '<select id="countries" multiple aria-labelledby="shipping">' +
        '<option>Canada</option><option>Japan</option>' +
        '</select>'
    ).appendTo($fixture);

    var selection = new MultipleSelection($select, options);
    var $selection = selection.render();

    var container = new MockContainer();
    container.id = 'countries';
    selection.bind(container, $('<span></span>'));

    assert.strictEqual(
      $selection.attr('aria-labelledby'),
      'shipping',
      'The explicit aria-labelledby is preserved'
    );
    assert.notOk(
      $selection.attr('aria-label'),
      'aria-label is not set when only aria-labelledby is present'
    );

    selection.destroy();
  }
);

QUnit.test(
  'native label is used as the accessible name when no explicit ARIA',
  function (assert) {
    var $fixture = $('#qunit-fixture');
    var $label = $('<label for="countries">Countries</label>').appendTo(
      $fixture
    );
    var $select = $(
      '<select id="countries" multiple>' +
        '<option>Canada</option><option>Japan</option>' +
        '</select>'
    ).appendTo($fixture);

    var selection = new MultipleSelection($select, options);
    var $selection = selection.render();

    var container = new MockContainer();
    container.id = 'countries';
    selection.bind(container, $('<span></span>'));

    assert.ok(
      $label[0].id,
      'The label gets a generated id so it can be referenced'
    );
    assert.strictEqual(
      $selection.attr('aria-labelledby'),
      $label[0].id,
      'The container is labelled by the native label'
    );
    assert.notOk(
      $selection.attr('aria-label'),
      'No aria-label is set on the container'
    );

    selection.destroy();
    assert.notOk($label[0].id, 'The generated label id is removed on destroy');
  }
);
