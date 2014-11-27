module('Selection containers - Multiple');

var MultipleSelection = require('select2/selection/multiple');

var $ = require('jquery');
var Options = require('select2/options');
var Utils = require('select2/utils');

var options = new Options({});

test('display uses templateSelection', function (assert) {
  var called = false;

  var templateOptions = new Options({
    templateSelection: function (data) {
      called = true;

      return data.text;
    }
  });

  var selection = new MultipleSelection(
    $('#qunit-fixture .multiple'),
    templateOptions
  );

  var out = selection.display({
    text: 'test'
  });

  assert.ok(called);

  assert.equal(out, 'test');
});

test('empty update clears the selection', function (assert) {
  var selection = new MultipleSelection(
    $('#qunit-fixture .multiple'),
    options
  );

  var $selection = selection.render();
  var $rendered = $selection.find('.select2-selection__rendered');

  $rendered.text('testing');

  selection.update([]);

  assert.equal($rendered.text(), '');
});
