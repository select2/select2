QUnit.module('Results - highlighting results');

QUnit.test('results:all with no data skips results:focus', function (assert) {
  assert.expect(0);

  var $ = require('jquery');

  var $select = $('<select></select>');
  var $parent = $('<div></div>');

  var $container = $('<span></span>');
  var container = new MockContainer();

  $parent.appendTo($('#qunit-fixture'));
  $select.appendTo($parent);

  var Utils = require('select2/utils');
  var Options = require('select2/options');

  var Results = require('select2/results');

  var results = new Results($select, new Options({}));

  // Fake the data adapter for the `setClasses` method
  results.data = {};
  results.data.current = function (callback) {
    callback([{ id: 'test' }]);
  };

  results.render();

  results.bind(container, $container);

  results.on('results:focus', function (params) {
    assert.ok(false, 'The results:focus event was triggered');
  });

  container.trigger('results:all', {
    data: {
      results: []
    }
  });
});

QUnit.test('results:all triggers results:focus on the first item', function (assert) {
  assert.expect(2);

  var $ = require('jquery');

  var $select = $('<select></select>');
  var $parent = $('<div></div>');

  var $container = $('<span></span>');
  var container = new MockContainer();

  $parent.appendTo($('#qunit-fixture'));
  $select.appendTo($parent);

  var Utils = require('select2/utils');
  var Options = require('select2/options');

  var Results = require('select2/results');

  var results = new Results($select, new Options({}));

  // Fake the data adapter for the `setClasses` method
  results.data = {};
  results.data.current = function (callback) {
    callback([{ id: 'test' }]);
  };

  results.render();

  results.bind(container, $container);

  results.on('results:focus', function (params) {
    assert.equal(params.data.id, 'test');
    assert.equal(params.data.text, 'Test');
  });

  container.trigger('results:all', {
    data: {
      results: [
        {
          id: 'test',
          text: 'Test'
        }
      ]
    }
  });
});

QUnit.test('results:append does not trigger results:focus', function (assert) {
  assert.expect(0);

  var $ = require('jquery');

  var $select = $('<select></select>');
  var $parent = $('<div></div>');

  var $container = $('<span></span>');
  var container = new MockContainer();

  $parent.appendTo($('#qunit-fixture'));
  $select.appendTo($parent);

  var Utils = require('select2/utils');
  var Options = require('select2/options');

  var Results = require('select2/results');

  var results = new Results($select, new Options({}));

  // Fake the data adapter for the `setClasses` method
  results.data = {};
  results.data.current = function (callback) {
    callback([{ id: 'test' }]);
  };

  results.render();

  results.bind(container, $container);

  results.on('results:focus', function () {
    assert.ok(false, 'The results:focus event was triggered');
  });

  container.trigger('results:append', {
    data: {
      results: [
        {
          id: 'test',
          text: 'Test'
        }
      ]
    }
  });
});

QUnit.test('scrollAfterSelect triggers results:focus', function (assert) {
  assert.expect(3);

  var $ = require('jquery');

  var $select = $('<select></select>');
  var $parent = $('<div></div>');

  var $container = $('<span></span>');
  var container = new MockContainer();

  $parent.appendTo($('#qunit-fixture'));
  $select.appendTo($parent);

  var Utils = require('select2/utils');
  var Options = require('select2/options');

  var Results = require('select2/results');

  var options = new Options({ scrollAfterSelect: true });
  var results = new Results($select, options);

  // Fake the data adapter for the `setClasses` method
  results.data = {};
  results.data.current = function (callback) {
    callback([{ id: 'test' }]);
  };

  results.render();

  results.bind(container, $container);

  // check that default for scrollAfterSelect is true
  assert.equal(options.get('scrollAfterSelect'), true);

  results.append({
    results: [
      {
        id: 'test',
        text: 'Test'
      }
    ]
  });

  results.on('results:focus', function (params) {
    assert.equal(params.data.id, 'test');
    assert.equal(params.data.text, 'Test');
  });

  container.trigger('select', {});
});

QUnit.test('!scrollAfterSelect does not trigger results:focus', function (assert) {
  assert.expect(1);

  var $ = require('jquery');

  var $select = $('<select></select>');
  var $parent = $('<div></div>');

  var $container = $('<span></span>');
  var container = new MockContainer();

  $parent.appendTo($('#qunit-fixture'));
  $select.appendTo($parent);

  var Utils = require('select2/utils');
  var Options = require('select2/options');

  var Results = require('select2/results');

  var options = new Options({ scrollAfterSelect: false });
  var results = new Results($select, options);

  // Fake the data adapter for the `setClasses` method
  results.data = {};
  results.data.current = function (callback) {
    callback([{ id: 'test' }]);
  };

  results.render();

  results.bind(container, $container);

  // check that default for scrollAfterSelect is false
  assert.equal(options.get('scrollAfterSelect'), false);

  results.append({
    results: [
      {
        id: 'test',
        text: 'Test'
      }
    ]
  });

  results.on('results:focus', function () {
    assert.ok(false, 'The results:focus event was triggered');
  });

  container.trigger('select', {});
});

QUnit.test('mouseenter clears aria-selected on all highlighted results', function (assert) {
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
  var Results = require('select2/results');

  var results = new Results($select, new Options({ multiple: true }));

  results.data = {};
  results.data.current = function (callback) {
    callback([]);
  };

  results.$results = results.render();
  results.$results.appendTo($parent);

  results.bind(container, $container);

  // Append three selectable options
  results.append({
    results: [
      { id: '1', text: 'One' },
      { id: '2', text: 'Two' },
      { id: '3', text: 'Three' }
    ]
  });

  var $options = results.$results.find('.select2-results__option--selectable');

  // Manually mark the first two as highlighted with aria-selected="true"
  $options.eq(0).addClass('select2-results__option--highlighted');
  $options[0].setAttribute('aria-selected', 'true');
  $options.eq(1).addClass('select2-results__option--highlighted');
  $options[1].setAttribute('aria-selected', 'true');

  // Trigger mouseenter on the third option to shift focus
  $options.eq(2).trigger('mouseenter');

  assert.equal($options[0].getAttribute('aria-selected'), 'false',
    'First previously-highlighted result should have aria-selected="false"');
  assert.notOk($options.eq(0).hasClass('select2-results__option--highlighted'),
    'First result should no longer be highlighted');
  assert.equal($options[1].getAttribute('aria-selected'), 'false',
    'Second previously-highlighted result should have aria-selected="false"');
  assert.notOk($options.eq(1).hasClass('select2-results__option--highlighted'),
    'Second result should no longer be highlighted');
});

QUnit.test('tag result is highlighted with no other selections', function (assert) {
  assert.expect(2);

  var $ = require('jquery');

  var $select = $('<select></select>');
  var $parent = $('<div></div>');

  var $container = $('<span></span>');
  var container = new MockContainer();

  $parent.appendTo($('#qunit-fixture'));
  $select.appendTo($parent);

  var Utils = require('select2/utils');
  var Options = require('select2/options');

  var Results = require('select2/results');
  var Tags = require('select2/dropdown/tagsSearchHighlight');
  var TagResults = Utils.Decorate(Results, Tags);

  var results = new TagResults($select, new Options({}));

  // Fake the data adapter for the `setClasses` method
  results.data = {};
  results.data.current = function (callback) {
    callback([]);
  };

  results.render();

  results.bind(container, $container);

  results.on('results:focus', function (params) {
    assert.equal(params.data.id, 'tag');
    assert.equal(params.data.text, 'Tag');
  });

  var tagElement = $('<option data-select2-tag="true"></option>')[0];

  container.trigger('results:all', {
    data: {
      results: [
        {
          id: 'tag',
          text: 'Tag',
          element: tagElement
        }
      ]
    }
  });
});

QUnit.test('tag result is highlighted with other selections', function (assert) {
  assert.expect(2);

  var $ = require('jquery');

  var $select = $('<select></select>');
  var $parent = $('<div></div>');

  var $container = $('<span></span>');
  var container = new MockContainer();

  $parent.appendTo($('#qunit-fixture'));
  $select.appendTo($parent);

  var Utils = require('select2/utils');
  var Options = require('select2/options');

  var Results = require('select2/results');
  var Tags = require('select2/dropdown/tagsSearchHighlight');
  var TagResults = Utils.Decorate(Results, Tags);

  var results = new TagResults($select, new Options({}));

  // Fake the data adapter for the `setClasses` method
  results.data = {};
  results.data.current = function (callback) {
    callback([{ id: 'test' }]);
  };

  results.render();

  results.bind(container, $container);

  results.on('results:focus', function (params) {
    assert.equal(params.data.id, 'tag');
    assert.equal(params.data.text, 'Tag');
  });

  var tagElement = $('<option data-select2-tag="true"></option>')[0];

  container.trigger('results:all', {
    data: {
      results: [
        {
          id: 'tag',
          text: 'Tag',
          element: tagElement
        },
        {
          id: 'test',
          text: 'Test'
        }
      ]
    }
  });
});
