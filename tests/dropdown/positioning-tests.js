QUnit.module('Dropdown - attachBody - positioning');

QUnit.test('appends to the dropdown parent', function (assert) {
    assert.expect(4);

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

QUnit.test('dropdown is positioned down with static margins', function (assert) {
    var $ = require('jquery');
    var $select = $('<select></select>');
    var $parent = $('<div></div>');
    $parent.css({
        position: 'static',
        marginTop: '5px',
        marginLeft: '10px'
    });

    var $container = $('<span>test</span>');
    var container = new MockContainer();

    $('#qunit-fixture').empty();

    $parent.appendTo($('#qunit-fixture'));
    $container.appendTo($parent);

    var Utils = require('select2/utils');
    var Options = require('select2/options');

    var Dropdown = require('select2/dropdown');
    var AttachBody = require('select2/dropdown/attachBody');

    var DropdownAdapter = Utils.Decorate(Dropdown, AttachBody);

    var dropdown = new DropdownAdapter($select, new Options({
        dropdownParent: $parent
    }));

    var $dropdown = dropdown.render();

    assert.equal(
        $dropdown[0].style.top,
        0,
        'The drodpown should not have any offset before it is displayed'
    );

    dropdown.bind(container, $container);
    dropdown.position($dropdown, $container);
    dropdown._showDropdown();

    assert.ok(
        dropdown.$dropdown.hasClass('select2-dropdown--below'),
        'The dropdown should be forced down'
    );

    assert.equal(
        $dropdown.css('top').replace(/\D+/, ''),
        $container.outerHeight() + 5,
        'The offset should be 5px at the top'
    );

    assert.equal(
        $dropdown.css('left'),
        '10px',
        'The offset should be 10px on the left'
    );
});

QUnit.test('dropdown is positioned down with absolute offsets', function (assert) {
    var $ = require('jquery');
    var $select = $('<select></select>');
    var $parent = $('<div></div>');
    $parent.css({
        position: 'absolute',
        top: '10px',
        left: '5px'
    });

    var $container = $('<span>test</span>');
    var container = new MockContainer();

    $parent.appendTo($('#qunit-fixture'));
    $container.appendTo($parent);

    var Utils = require('select2/utils');
    var Options = require('select2/options');

    var Dropdown = require('select2/dropdown');
    var AttachBody = require('select2/dropdown/attachBody');

    var DropdownAdapter = Utils.Decorate(Dropdown, AttachBody);

    var dropdown = new DropdownAdapter($select, new Options({
        dropdownParent: $parent
    }));

    var $dropdown = dropdown.render();

    assert.equal(
        $dropdown[0].style.top,
        0,
        'The drodpown should not have any offset before it is displayed'
    );

    dropdown.bind(container, $container);
    dropdown.position($dropdown, $container);
    dropdown._showDropdown();

    assert.ok(
        dropdown.$dropdown.hasClass('select2-dropdown--below'),
        'The dropdown should be forced down'
    );

    assert.equal(
        $dropdown.css('top').replace(/\D+/, ''),
        $container.outerHeight(),
        'There should not be an extra top offset'
    );

    assert.equal(
        $dropdown.css('left'),
        '0px',
        'There should not be an extra left offset'
    );
});

QUnit.test('dropdown is positioned even when not in document', function (assert) {
    var $ = require('jquery');
    var $select = $('<select></select>');

    var $container = $('<span>test</span>');
    var container = new MockContainer();

    var Utils = require('select2/utils');
    var Options = require('select2/options');

    var Dropdown = require('select2/dropdown');
    var AttachBody = require('select2/dropdown/attachBody');

    var DropdownAdapter = Utils.Decorate(Dropdown, AttachBody);

    var dropdown = new DropdownAdapter($select, new Options({
        dropdownParent: $('html')
    }));

    var $dropdown = dropdown.render();

    assert.equal(
        $dropdown[0].style.top,
        0,
        'The drodpown should not have any offset before it is displayed'
    );

    dropdown.bind(container, $container);
    dropdown.position($dropdown, $container);
    dropdown._showDropdown();

    assert.ok(
        dropdown.$dropdown.hasClass('select2-dropdown--below'),
        'The dropdown should be forced down'
    );

    assert.equal(
        $dropdown.css('top'),
        '0px',
        'The offset should be 0px at the top'
    );

    assert.equal(
        $dropdown.css('left'),
        '0px',
        'The offset should be 0px on the left'
    );
});
