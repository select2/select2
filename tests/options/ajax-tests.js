QUnit.module('Defaults - Ajax');

QUnit.test(
  'options are merged recursively with default options',
  function (assert) {
    var defaults = require('select2/defaults');

    var ajaxDelay = 250;
    var ajaxUrl = 'http://www.test.com';

    var mergedOptions;

    defaults.set('ajax--delay', ajaxDelay);

    mergedOptions = defaults.apply({
      ajax: {
        url: ajaxUrl
      }
    });

    assert.equal(
      mergedOptions.ajax.delay,
      ajaxDelay,
      'Ajax default options are present on the merged options'
    );

    assert.equal(
      mergedOptions.ajax.url,
      ajaxUrl,
      'Ajax provided options are present on the merged options'
    );

    defaults.reset();
  }
);

QUnit.test(
  'more than one default option can be changed via set()',
  function (assert) {
    var defaults = require('select2/defaults');
    var ajaxDelay = 123;
    var dataDataType = 'xml';
    defaults.set('ajax--delay', ajaxDelay);
    defaults.set('ajax--data-type', dataDataType);

    assert.equal(
      defaults.defaults.ajax.delay,
      ajaxDelay,
      'Both ajax.delay and ajax.dataType present in defaults'
    );
    assert.equal(
      defaults.defaults.ajax.dataType,
      dataDataType,
      'Both ajax.delay and ajax.dataType present in defaults'
    );
    defaults.reset();
  }
);

QUnit.module('Data adapter - Ajax');

QUnit.test(
  'query normalizes results with the adapter bound as `this`',
  function (assert) {
    var AjaxData = require('select2/data/ajax');
    var Options = require('select2/options');
    var $ = require('jquery');

    var $select = $('#qunit-fixture .single-empty');

    var options = new Options({
      ajax: {
        transport: function (params, success) {
          success({
            results: [
              { id: 'a', text: 'First' },
              {
                text: 'Group',
                children: [{ id: 'b', text: 'Child' }]
              }
            ]
          });
        }
      }
    });

    var data = new AjaxData($select, options);

    var container = new MockContainer();
    data.bind(container, $('<div></div>'));

    data.query({}, function (results) {
      assert.ok(
        results.results[0]._resultId,
        'A top-level AJAX result should receive a generated result ID'
      );

      assert.ok(
        results.results[1].children[0]._resultId,
        'A nested optgroup child should receive a generated result ID'
      );
    });
  }
);

QUnit.test(
  'query displays an error message when the request times out',
  function (assert) {
    var done = assert.async();

    var AjaxData = require('select2/data/ajax');
    var Options = require('select2/options');
    var $ = require('jquery');

    var $select = $('#qunit-fixture .single-empty');

    var messages = [];

    var options = new Options({
      ajax: {
        transport: function (params, success, failure) {
          var $request = {};

          window.setTimeout(function () {
            // jQuery reports timed out requests with a status of 0
            $request.status = 0;
            failure($request, 'timeout', 'timeout');

            assert.deepEqual(
              messages,
              ['errorLoading'],
              'A timed out request should display the error message'
            );

            done();
          }, 0);

          return $request;
        }
      }
    });

    var data = new AjaxData($select, options);

    data.on('results:message', function (params) {
      messages.push(params.message);
    });

    data.query({}, function () {});
  }
);

QUnit.test(
  'query does not display an error message when the request is aborted',
  function (assert) {
    var AjaxData = require('select2/data/ajax');
    var Options = require('select2/options');
    var $ = require('jquery');

    var $select = $('#qunit-fixture .single-empty');

    var messages = [];

    var options = new Options({
      ajax: {
        transport: function (params, success, failure) {
          var $request = {
            abort: function () {
              $request.status = 0;
              failure($request, 'abort', 'abort');
            }
          };

          return $request;
        }
      }
    });

    var data = new AjaxData($select, options);

    data.on('results:message', function (params) {
      messages.push(params.message);
    });

    data.query({ term: 'a' }, function () {});

    // The second query aborts the pending first request
    data.query({ term: 'ab' }, function () {});

    assert.deepEqual(
      messages,
      [],
      'An aborted request should not display the error message'
    );
  }
);
