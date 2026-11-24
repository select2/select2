QUnit.module('Utils - extend');

var Utils = require('select2/utils');

QUnit.test(
  'Utils.extend merges multiple sources into the target',
  function (assert) {
    var target = { a: 1 };

    var result = Utils.extend(target, { b: 2 }, { c: 3 });

    assert.strictEqual(result, target, 'The target object is returned');
    assert.deepEqual(target, { a: 1, b: 2, c: 3 }, 'All sources are merged');
  }
);

QUnit.test(
  'Utils.extend lets later sources override earlier ones',
  function (assert) {
    var target = {};

    Utils.extend(target, { a: 1, b: 1 }, { b: 2, c: 2 }, { c: 3 });

    assert.deepEqual(target, { a: 1, b: 2, c: 3 }, 'Later sources win');
  }
);

QUnit.test('Utils.extend skips null and undefined sources', function (assert) {
  var target = { a: 1 };

  Utils.extend(target, null, { b: 2 }, undefined);

  assert.deepEqual(
    target,
    { a: 1, b: 2 },
    'Null/undefined sources are skipped'
  );
});

QUnit.test('Utils.extend copies functions by reference', function (assert) {
  var fn = function () {};
  var target = {};

  Utils.extend(target, { fn: fn });

  assert.strictEqual(target.fn, fn, 'Functions are not copied by value');
});

QUnit.test(
  'Utils.extend ignores trailing non-object arguments',
  function (assert) {
    // Mirrors $.extend({}, defaults, options, true) in data/ajax.js, where
    // the trailing `true` is treated as a source (booleans have no
    // enumerable properties) rather than a deep flag.
    var target = {};

    Utils.extend(target, { a: 1 }, true);

    assert.deepEqual(target, { a: 1 }, 'Trailing non-object is a no-op');
  }
);

QUnit.module('Utils - deepExtend');

QUnit.test(
  'Utils.deepExtend merges multiple sources into the target',
  function (assert) {
    var target = { a: 1 };

    var result = Utils.deepExtend(target, { b: 2 }, { c: 3 });

    assert.strictEqual(result, target, 'The target object is returned');
    assert.deepEqual(target, { a: 1, b: 2, c: 3 }, 'All sources are merged');
  }
);

QUnit.test(
  'Utils.deepExtend lets later sources override earlier ones',
  function (assert) {
    var target = {};

    Utils.deepExtend(target, { a: 1, b: 1 }, { b: 2, c: 2 }, { c: 3 });

    assert.deepEqual(target, { a: 1, b: 2, c: 3 }, 'Later sources win');
  }
);

QUnit.test(
  'Utils.deepExtend skips null and undefined sources',
  function (assert) {
    var target = { a: 1 };

    Utils.deepExtend(target, null, { b: 2 }, undefined);

    assert.deepEqual(
      target,
      { a: 1, b: 2 },
      'Null/undefined sources are skipped'
    );
  }
);

QUnit.test(
  'Utils.deepExtend clones nested plain objects instead of sharing references',
  function (assert) {
    var source = { nested: { x: 1 } };
    var target = {};

    Utils.deepExtend(target, source);

    assert.notStrictEqual(
      target.nested,
      source.nested,
      'Nested objects are cloned'
    );
    assert.deepEqual(target.nested, { x: 1 }, 'Clone has same contents');

    target.nested.x = 99;

    assert.equal(
      source.nested.x,
      1,
      'Mutating the clone does not affect the source'
    );
  }
);

QUnit.test(
  'Utils.deepExtend clones nested arrays instead of sharing references',
  function (assert) {
    var source = { items: [1, 2, 3] };
    var target = {};

    Utils.deepExtend(target, source);

    assert.notStrictEqual(target.items, source.items, 'Arrays are cloned');
    assert.deepEqual(target.items, [1, 2, 3], 'Clone has same contents');

    target.items.push(4);

    assert.equal(
      source.items.length,
      3,
      'Mutating the clone does not affect the source'
    );
  }
);

QUnit.test(
  'Utils.deepExtend reuses existing nested objects and arrays on the target',
  function (assert) {
    var existing = { x: 1 };
    var existingItems = [1];
    var target = { nested: existing, items: existingItems };

    Utils.deepExtend(target, { nested: { y: 2 }, items: [2] });

    assert.strictEqual(
      target.nested,
      existing,
      'Existing nested object on target is reused'
    );
    assert.deepEqual(target.nested, { x: 1, y: 2 }, 'Reused object is merged');
    assert.strictEqual(
      target.items,
      existingItems,
      'Existing array on target is reused'
    );
    assert.deepEqual(target.items, [2], 'Existing array index is overwritten');
  }
);

QUnit.test('Utils.deepExtend copies functions by reference', function (assert) {
  var fn = function () {};
  var target = {};

  Utils.deepExtend(target, { fn: fn });

  assert.strictEqual(target.fn, fn, 'Functions are not copied by value');
});

QUnit.test(
  'Utils.deepExtend ignores trailing non-object arguments',
  function (assert) {
    var target = {};

    Utils.deepExtend(target, { a: 1 }, true);

    assert.deepEqual(target, { a: 1 }, 'Trailing non-object is a no-op');
  }
);
