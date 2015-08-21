module('Data adaptor - Tokenizer');

test('triggers the select event', function (assert) {
  expect(2);

  var SelectData = require('select2/data/select');
  var Tokenizer = require('select2/data/tokenizer');
  var Tags = require('select2/data/tags');

  var Options = require('select2/options');
  var Utils = require('select2/utils');

  var $ = require('jquery');

  var TokenizedSelect = Utils.Decorate(
    Utils.Decorate(SelectData, Tags),
    Tokenizer
  );
  var $select = $('#qunit-fixture .single');

  var options = new Options({
    tags: true,
    tokenSeparators: [',']
  });

  var container = new MockContainer();
  container.dropdown = container.selection = {};
  
  var $container = $('<div></div>');

  var data = new TokenizedSelect($select, options);
  data.bind(container, $container);

  data.on('select', function () {
    assert.ok(true, 'The select event should be triggered');
  });

  data.query({
    term: 'first,second'
  }, function () {
    assert.ok(true, 'The callback should have succeeded');
  });
});