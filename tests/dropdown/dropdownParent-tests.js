module('Dropdown - attachBody - dropdownParent option');

test('can be a selector string', function (assert) {
    assert.expect(1);

    var $ = require('jquery');

    var $select = $('<select></select>');
    var $parent = $('<div id="parent"></div>');

    $('#qunit-fixture').append($parent);

    var Utils = require('select2/utils');
    var Options = require('select2/options');

    var Dropdown = require('select2/dropdown');
    var AttachBody = require('select2/dropdown/attachBody');

    var DropdownAdapter = Utils.Decorate(Dropdown, AttachBody);

    var dropdown = new DropdownAdapter($select, new Options({
        dropdownParent: '#parent'
    }));

    assert.equal(
        dropdown.$dropdownParent[0],
        $parent[0],
        'Should be parsed using the selector as a jQuery object'
    );
});

test('can be a jQuery object', function (assert) {
    assert.expect(1);

    var $ = require('jquery');

    var $select = $('<select></select>');
    var $parent = $('<div id="parent"></div>');

    $('#qunit-fixture').append($parent);

    var Utils = require('select2/utils');
    var Options = require('select2/options');

    var Dropdown = require('select2/dropdown');
    var AttachBody = require('select2/dropdown/attachBody');

    var DropdownAdapter = Utils.Decorate(Dropdown, AttachBody);

    var dropdown = new DropdownAdapter($select, new Options({
        dropdownParent: $parent
    }));

    assert.equal(
        dropdown.$dropdownParent[0],
        $parent[0],
        'Should just take the passed in jQuery object'
    );
});

test('defaults to the document body', function (assert) {
    assert.expect(1);

    var $ = require('jquery');

    var $select = $('<select></select>');

    var Utils = require('select2/utils');
    var Options = require('select2/options');

    var Dropdown = require('select2/dropdown');
    var AttachBody = require('select2/dropdown/attachBody');

    var DropdownAdapter = Utils.Decorate(Dropdown, AttachBody);

    var dropdown = new DropdownAdapter($select, new Options({}));

    assert.equal(
        dropdown.$dropdownParent[0],
        document.body,
        'Should default to wrapping document.body'
    );
});
