---
title: Array
taxonomy:
    category: docs
---



  <h3 id="data">
    Array
  </h3>

  <p>
    Select2 allows creating the results based on an array of data objects that
    is included when initializing Select2.
  </p>

  <div class="row">
    <div class="col-sm-6">
      <dl class="dl-horizontal">
        <dt>Key</dt>
        <dd><code>data</code></dd>

        <dt>Value</dt>
        <dd>array of objects</dd>
      </dl>
    </div>

    <div class="col-sm-6">
      <dl class="dl-horizontal">
        <dt>Adapter</dt>
        <dd>
          <code title="select2/data/array">ArrayAdapter</code>
        </dd>
      </dl>
    </div>
  </div>

  <p>
    The objects that the users can select from should be passed as an array
    with each object containing <code>id</code> and <code>text</code>
    properties.
  </p>

Select2 provides the `SingleSelection` and `MultipleSelection` adapters as default implementations of the `SelectionAdapter` for single- and multi-select controls, respectively.  Both `SingleSelection` and `MultipleSelection` extend the base `BaseSelection` adapter.

The selection adapter can be overridden by assigning a custom adapter to the `selectionAdapter` configuration option.
 
## Decorators