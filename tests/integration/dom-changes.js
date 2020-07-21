/*jshint browser: true */
module('DOM integration');

test('adding a new unselected option changes nothing', function (assert) {
  // Any browsers which support mutation observers will not trigger the event
  var expected = 4;
  if (window.MutationObserver) {
    expected = 2;
  } else if (!window.addEventListener) {
    expected = 2;
  }

  assert.expect(expected);

  var asyncDone = null;
  var syncDone = assert.async();

  if (expected != 2) {
    asyncDone = assert.async();
  }

  var $ = require('jquery');
  var Options = require('select2/options');
  var Select2 = require('select2/core');

  var $select = $(
    '<select>' +
      '<option>One</option>' +
      '<option>Two</option>' +
    '</select>'
  );

  $('#qunit-fixture').append($select);

  var select = new Select2($select);

  select.on('selection:update', function (args) {
    assert.equal(
      args.data.length,
      1,
      'There was more than one selection'
    );

    assert.equal(
      args.data[0].id,
      'One',
      'The selection changed to something other than One'
    );

    if (expected != 2) {
      asyncDone();
    }
  });

  assert.equal(
    $select.val(),
    'One'
  );

  var $option = $('<option>Three</option>');

  $select.append($option);

  assert.equal(
    $select.val(),
    'One'
  );

  syncDone();
});

test('adding a new selected option changes the value', function (assert) {
  // handle IE 8 not being supported
  var expected = 4;
  if (!window.MutationObserver && !window.addEventListener) {
    expected = 2;
  }

  assert.expect(expected);

  var asyncDone = null;
  var syncDone = assert.async();

  if (expected != 2) {
    asyncDone = assert.async();
  }

  var $ = require('jquery');
  var Options = require('select2/options');
  var Select2 = require('select2/core');

  var $select = $(
    '<select>' +
      '<option>One</option>' +
      '<option>Two</option>' +
    '</select>'
  );

  $('#qunit-fixture').append($select);

  var select = new Select2($select);

  select.on('selection:update', function (args) {
    assert.equal(
      args.data.length,
      1,
      'There was more than one selection'
    );

    assert.equal(
      args.data[0].id,
      'Three',
      'The selection did not change to Three'
    );

    if (expected != 2) {
      asyncDone();
    }
  });

  assert.equal(
    $select.val(),
    'One'
  );

  var $option = $('<option selected>Three</option>');

  $select.append($option);

  assert.equal(
    $select.val(),
    'Three'
  );

  syncDone();
});

test('removing an unselected option changes nothing', function (assert) {
  // Any browsers which support mutation observers will not trigger the event
  var expected = 4;
  if (!window.MutationObserver && !window.addEventListener) {
    expected = 2;
  }

  assert.expect(expected);

  var asyncDone = null;
  var syncDone = assert.async();

  if (expected != 2) {
    asyncDone = assert.async();
  }

  var $ = require('jquery');
  var Options = require('select2/options');
  var Select2 = require('select2/core');

  var $select = $(
    '<select>' +
      '<option>One</option>' +
      '<option>Two</option>' +
    '</select>'
  );

  $('#qunit-fixture').append($select);

  var select = new Select2($select);

  select.on('selection:update', function (args) {
    assert.equal(
      args.data.length,
      1,
      'There was more than one selection'
    );

    assert.equal(
      args.data[0].id,
      'One',
      'The selection changed to something other than One'
    );

    if (expected != 2) {
      asyncDone();
    }
  });

  assert.equal(
    $select.val(),
    'One'
  );

  $select.children().eq(1).remove();

  assert.equal(
    $select.val(),
    'One'
  );

  syncDone();
});

test('removing a selected option changes the value', function (assert) {
  // handle IE 8 not being supported
  var expected = 3;
  if (!window.MutationObserver && !window.addEventListener) {
    expected = 2;
  }

  assert.expect(expected);

  var asyncDone = null;
  var syncDone = assert.async();

  if (expected != 2) {
    asyncDone = assert.async();
  }

  var $ = require('jquery');
  var Options = require('select2/options');
  var Select2 = require('select2/core');

  var $select = $(
    '<select>' +
      '<option>One</option>' +
      '<option>Two</option>' +
    '</select>'
  );

  $('#qunit-fixture').append($select);

  var select = new Select2($select);

  select.on('selection:update', function (args) {
    assert.equal(
      args.data.length,
      1,
      'There was more than one selection'
    );

    if (expected != 2) {
      asyncDone();
    }
  });

  assert.equal(
    $select.val(),
    'One'
  );

  $select.children().eq(0).remove();

  assert.equal(
    $select.val(),
    'Two'
  );

  syncDone();
});

test('searching tags does not loose focus', function (assert) {
  assert.expect(1);

  var asyncDone = assert.async();
  var $ = require('jquery');
  var Options = require('select2/options');
  var Select2 = require('select2/core');

  var $select = $(
    '<select multiple="multiple">' +
    '  <option value="1">Text1</option>' +
    ' <option value="2">Text2</option>' +
    '</select>'
  );

  $('#qunit-fixture').append($select);

  var select = new Select2($select, {tags: true});

  var inputEl = select.selection.$search[0];
  inputEl.focus();

  select.on('selection:update', function() {
    assert.equal(document.activeElement, inputEl);
    asyncDone();
  });

  select.selection.trigger('query', {term: 'f'});
  select.selection.trigger('query', {term: 'ff'});
});


test('adding multiple options calls selection:update once', function (assert) {
  assert.expect(1);

  var asyncDone = assert.async();

  var $ = require('jquery');
  var Select2 = require('select2/core');

  var content = '<select>';
  var options = '';

  for (var i = 0; i < 4000; i++) {
    options += '<option>' + i + '</option>';
  }

  content += options;
  content += '</select>';

  var $select = $(content);

  $('#qunit-fixture').append($select);

  var select = new Select2($select);

  var eventCalls = 0;

  select.on('selection:update', function () {
    eventCalls++;
  });

  $select.html(options);

  setTimeout(function () {
    assert.equal(
      eventCalls,
      1,
      'selection:update was called more than once'
    );
    asyncDone();
  }, 0);
});

test('disabling containing fieldset disables the control', function (assert) {
  assert.expect(2);

  var asyncDone = assert.async();

  var $ = require('jquery');
  var Select2 = require('select2/core');

  var $fieldset = $(
    '<fieldset>' +
    '  <select></select>' +
    '</fieldset>');

  var $select = $fieldset.children();

  $('#qunit-fixture').append($fieldset);
  
  var select = new Select2($select);

  assert.equal(
    select.isDisabled(),
    false);

  $fieldset.prop('disabled', true);

  setTimeout(function () {
    assert.equal(
      select.isDisabled(),
      true);

    asyncDone();
  }, 0);
});

test('control retains disabled state when parent is toggled', function (assert) {
  assert.expect(2);

  var asyncDone = assert.async();

  var $ = require('jquery');
  var Select2 = require('select2/core');

  var $fieldset = $(
    '<fieldset>' +
    '  <select></select>' +
    '</fieldset>');

  var $select = $fieldset.children();

  $('#qunit-fixture').append($fieldset);

  var select = new Select2($select, {
    disabled: true
  });

  assert.equal(
    select.isDisabled(),
    true);

  $fieldset.prop('disabled', true);
  $fieldset.prop('disabled', false);

  setTimeout(function () {
    assert.equal(
      select.isDisabled(),
      true);

    asyncDone();
  }, 0);
});
