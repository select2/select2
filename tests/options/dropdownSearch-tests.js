QUnit.module('Options - dropdownSearch / selectionSearch');

var Options = require('select2/options');

QUnit.test(
  'multiple selects search inline by default (unchanged behavior)',
  function (assert) {
    var options = new Options({
      multiple: true
    });

    assert.equal(
      typeof options.get('selectionAdapter').prototype.searchRemoveChoice,
      'function',
      'The inline SelectionSearch mixin is still applied by default'
    );

    assert.equal(
      typeof options.get('dropdownAdapter').prototype.handleSearch,
      'undefined',
      'The dropdown does not gain a search box by default'
    );
  }
);

QUnit.test(
  'dropdownSearch moves search into the dropdown for multiple selects',
  function (assert) {
    var options = new Options({
      multiple: true,
      dropdownSearch: true
    });

    assert.equal(
      typeof options.get('dropdownAdapter').prototype.handleSearch,
      'function',
      'The dropdown gained the DropdownSearch mixin'
    );

    assert.equal(
      typeof options.get('selectionAdapter').prototype.searchRemoveChoice,
      'undefined',
      'The inline SelectionSearch mixin was not applied'
    );
  }
);

QUnit.test(
  'selectionSearch: false hides search entirely for a multiple select',
  function (assert) {
    var options = new Options({
      multiple: true,
      selectionSearch: false
    });

    assert.equal(
      typeof options.get('selectionAdapter').prototype.searchRemoveChoice,
      'undefined',
      'The inline SelectionSearch mixin was not applied'
    );

    assert.equal(
      typeof options.get('dropdownAdapter').prototype.handleSearch,
      'undefined',
      'The dropdown did not gain a search box either'
    );
  }
);

QUnit.test(
  'dropdownSearch takes priority over selectionSearch: false',
  function (assert) {
    var options = new Options({
      multiple: true,
      dropdownSearch: true,
      selectionSearch: false
    });

    assert.equal(
      typeof options.get('dropdownAdapter').prototype.handleSearch,
      'function',
      'The dropdown still gained the DropdownSearch mixin'
    );
  }
);

QUnit.test(
  'dropdownSearch and selectionSearch are ignored for single selects',
  function (assert) {
    var options = new Options({
      multiple: false,
      dropdownSearch: true,
      selectionSearch: false
    });

    assert.equal(
      typeof options.get('dropdownAdapter').prototype.handleSearch,
      'function',
      'Single selects always search from the dropdown, as before'
    );
  }
);
