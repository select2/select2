module('Selection containers - Inline search - Placeholder');

var MultipleSelection = require('select2/selection/multiple');
var InlineSearch = require('select2/selection/search');
var SelectionPlaceholder = require('select2/selection/placeholder');

var $ = require('jquery');
var Options = require('select2/options');
var Utils = require('select2/utils');

var CustomSelection = Utils.Decorate(
  Utils.Decorate(MultipleSelection, SelectionPlaceholder),
  InlineSearch
);

test('width does not extend the search box', function (assert) {
    assert.expect(2);

    var $container = $(
      '<div style="width: 100px; display: table-cell">' +
      '<div style="width: 100%" ' +
      'class="select2-container select2-container--default"></div>' +
      '</div>'
    );
    var container = new MockContainer();

    var $element = $('#qunit-fixture .multiple');
    var selection = new CustomSelection($element, new Options({
      placeholder: 'Test placeholder'
    }));

    var $selection = selection.render();
    selection.bind(container, $container);

    // Make it visible so the browser can place focus on the search
    $container.append($selection);
    $('#qunit-fixture').append($container);

    // Update the selection so the search is rendered
    selection.update([]);

    var $search = $selection.find('input');

    assert.equal(
      $search.outerWidth(),
      100,
      'The search should be the entire width of the container'
    );

    assert.equal(
      $container.children().outerWidth(),
      100,
      'The container should be the width assigned to the parent in CSS'
    );
  });
