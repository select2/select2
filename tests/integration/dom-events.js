module('DOM events');

test('click on input of multiple select opens but do not closes the dropdown', 
  function (assert) {
    assert.expect(2);
    
    var $ = require('jquery');
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
    
    inputEl.click();

    assert.ok(
      select.isOpen(),
      'The dropdown should open when clicking on input on a closed select'
    );

    inputEl.click();

    assert.ok(
      select.isOpen(),
      'The dropdown should keep open when clicking on input on an open select'
    );
  }
);