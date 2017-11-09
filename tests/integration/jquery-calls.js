module('select2(val)');

test('multiple elements with arguments works', function (assert) {
  var $ = require('jquery');
  require('jquery.select2');

  var $first = $(
    '<select>' +
      '<option>1</option>' +
      '<option>2</option>' +
    '</select>'
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

test('open focuses search input', function (assert) {
  var done = assert.async();

  var $ = require('jquery');
  require('jquery.select2');

  var $select2 = $(
    '<select>' +
      '<option>1</option>' +
      '<option>2</option>' +
    '</select>'
  );
  $('.qunit-fixture').append($select2);

  $select2.select2({minimumResultsForSearch: 1});

  var activeElement = document.activeElement;
  assert.equal($select2.has(':focus').length, 0, 'Select2 elements should not be focused. Focused element was ' + activeElement);
  assert.equal($('.select2').has(':focus').length, 0, 'Original select field should not be focused. Focused element was ' + activeElement);

  $select2.select2('open');

  setTimeout(function() {
    var $search = $('input.select2-search__field');
    assert.equal($search.length, 1, 'Search input should exist.');
    assert.ok($.contains(document.documentElement, $search[0]), 'Search input should be in DOM.');
    assert.ok($search.is(':visible'), 'Search input should be visible.');

    activeElement = document.activeElement;
    assert.ok($search.is(':focus'), 'Search input should be focused. Focused element was ' + activeElement);

    done();
  });
});
