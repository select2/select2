module('Dropdown - attachBody - positioning');

test('appends to the dropdown parent', function (assert) {
    expect(4);

    var $ = require('jquery');

    var $select = $('<select></select>');
    var $parent = $('<div></div>');

    var $container = $('<span></span>');
    var container = new MockContainer();

    $parent.appendTo($('#qunit-fixture'));
    $select.appendTo($parent);

    var Utils = require('select2/utils');
    var Options = require('select2/options');

    var Dropdown = require('select2/dropdown');
    var AttachBody = require('select2/dropdown/attachBody');

    var DropdownAdapter = Utils.Decorate(Dropdown, AttachBody);

    var dropdown = new DropdownAdapter($select, new Options({
        dropdownParent: $parent
    }));

    assert.equal(
        $parent.children().length,
        1,
        'Only the select should be in the container'
    );

    var $dropdown = dropdown.render();

    dropdown.bind(container, $container);

    dropdown.position($dropdown, $container);

    assert.equal(
        $parent.children().length,
        1,
        'The dropdown should not be placed until after it is opened'
    );

    dropdown._showDropdown();

    assert.equal(
        $parent.children().length,
        2,
        'The dropdown should now be in the container as well'
    );

    assert.ok(
        $.contains($parent[0], $dropdown[0]),
        'The dropdown should be contained within the parent container'
    );
});