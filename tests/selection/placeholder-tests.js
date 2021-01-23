module('Selection containers - Placeholders');

var Placeholder = require('select2/selection/placeholder');
var SingleSelection = require('select2/selection/single');

var $ = require('jquery');
var Options = require('select2/options');
var Utils = require('select2/utils');

var SinglePlaceholder = Utils.Decorate(SingleSelection, Placeholder);

var placeholderOptions = new Options({
  placeholder: {
    id: 'placeholder',
    text: 'This is the placeholder'
  }
});

test('normalizing placeholder ignores objects', function (assert) {
  var selection = new SinglePlaceholder(
    $('#qunit-fixture .single'),
    placeholderOptions
  );

  var original = {
    id: 'test',
    text: 'testing'
  };

  var normalized = selection.normalizePlaceholder(original);

  assert.equal(original, normalized);
});

test('normalizing placeholder gives object for string', function (assert) {
  var selection = new SinglePlaceholder(
    $('#qunit-fixture .single'),
    placeholderOptions
  );

  var normalized = selection.normalizePlaceholder('placeholder');

  assert.equal(normalized.id, '');
  assert.equal(normalized.text, 'placeholder');
});

test('text is shown for placeholder option on single', function (assert) {
  var selection = new SinglePlaceholder(
    $('#qunit-fixture .single'),
    placeholderOptions
  );

  var $selection = selection.render();

  selection.update([{
    id: 'placeholder'
  }]);

  assert.equal($selection.text(), 'This is the placeholder');
});

test('title is set for placeholder option on single', function (assert) {
  var selection = new SinglePlaceholder(
    $('#qunit-fixture .single'),
    placeholderOptions
  );

  var $selection = selection.render();

  selection.update([{
    id: 'placeholder'
  }]);

  assert.equal(
    $selection.find('.select2-selection__rendered').attr('title'),
    'This is the placeholder'
  );
});

test('title is used for placeholder option on single', function (assert) {
  var placeholderTitleOptions = new Options({
    placeholder: {
      id: 'placeholder',
      text: 'This is the placeholder',
      title: 'This is the placeholder title'
    }
  });

  var selection = new SinglePlaceholder(
    $('#qunit-fixture .single'),
    placeholderTitleOptions
  );

  var $selection = selection.render();

  selection.update([{
    id: 'placeholder'
  }]);

  assert.equal(
    $selection.find('.select2-selection__rendered').attr('title'),
    'This is the placeholder title'
  );
});

test('placeholder is shown when no options are selected', function (assert) {
  var selection = new SinglePlaceholder(
    $('#qunit-fixture .multiple'),
    placeholderOptions
  );

  var $selection = selection.render();

  selection.update([]);

  assert.equal($selection.text(), 'This is the placeholder');
});
