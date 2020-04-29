var $ = require('jquery');
var Utils = require('select2/utils');

module('Utils - GetUniqueElementId');

test('Adds a prefix to the existing ID if one exists', function (assert) {
    var $element = $('<select id="existing-id"></select>');

    var id = Utils.GetUniqueElementId($element[0]);

    assert.notEqual(id, 'existing-id');
    assert.notEqual(id.indexOf('existing-id'), -1);
});

test('Generated random ID is not a number', function (assert) {
    var $element = $('<select></select>');

    var id = Utils.GetUniqueElementId($element[0]);

    assert.ok(isNaN(id));
});

module('Utils - RemoveData');

test('The data-select2-id attribute is removed', function (assert) {
    var $element = $('<select data-select2-id="test"></select>');

    Utils.RemoveData($element[0]);

    assert.notEqual(
        $element.attr('data-select2-id'),
        'test',
        'The internal attribute was not removed when the data was cleared'
    );
});

test('The internal cache for the element is cleared', function (assert) {
    var $element = $('<select data-select2-id="test"></select>');

    Utils.__cache.test = {
        'foo': 'bar'
    };

    Utils.RemoveData($element[0]);

    assert.equal(Utils.__cache.test, null, 'The cache should now be empty');
});

test('Calling it on an element without data works', function (assert) {
    assert.expect(0);

    var $element = $('<select></select>');

    Utils.RemoveData($element[0]);
});