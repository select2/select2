---
title: Configuration
taxonomy:
    category: docs
---

Select2 has the following configuration options available. Note that this page is a work
in progress. The <a href="http://select2.github.io/select2/#documentation">previous
release's documentation</a> should cover the gaps here for the time being.

<table class="table table-bordered table-striped">
  <thead>
      <tr>
          <th>Option</th>
          <th>Type</th>
          <th>Description</th>
      </tr>
  </thead>
  <tbody>
    <tr id="adaptContainerCssClass">
      <td>adaptContainerCssClass</td>
      <td></td>
      <td></td>
    </tr>
    <tr id="adaptDropdownCssClass">
      <td>adaptDropdownCssClass</td>
      <td></td>
      <td></td>
    </tr>
      <tr id="ajax">
          <td>ajax</td>
          <td></td>
          <td></td>
      </tr>
      <tr id="allowClear">
          <td>allowClear</td>
          <td>boolean</td>
          <td>
              <p>When set to <strong>true</strong>, causes a clear button to appear on the select box
        when a value is selected. Clicking the clear button will clear the selected value,
        effectively resetting the select box back to its placeholder value.</p>

              <p>Default value: <strong>false</strong></p>
          </td>
      </tr>
    <tr id="amdBase">
      <td>amdBase</td>
      <td>string</td>
      <td>
        <p>The base AMD loader path to be used for select2 dependency resolution. This option
        typically doesn't need to be changed, but is available for situations where module names
        may change as a result of certain build environments.</p>

        <p>Default value: <strong>&quot;./&quot;</strong></p>
      </td>
    </tr>
    <tr id="amdLanguageBase">
      <td>amdLanguageBase</td>
      <td>string</td>
      <td>
        <p>The base AMD loader language path to be used for select2 language file resolution. This
        option typically doesn't need to be changed, but is available for situations where module
        names may change as a result of certain build environments.</p>

        <p>Default value: <strong>&quot;./i18n/&quot;</strong></p>
      </td>
    </tr>
      <tr id="closeOnSelect">
          <td>closeOnSelect</td>
          <td>boolean</td>
          <td>
              <p>When set to <strong>false</strong>, keeps the dropdown open upon selecting an option,
        making it easy to quickly select multiple items. <em>Note that this option is only
        applicable to multi-select controls</em>.</p>

              <p>Default value: <strong>true</strong></p>
          </td>
      </tr>
    <tr id="containerCss">
      <td>containerCss</td>
      <td></td>
      <td></td>
    </tr>
    <tr id="containerCssClass">
      <td>containerCssClass</td>
      <td></td>
      <td></td>
    </tr>
    <tr id="dataAdapter">
      <td>dataAdapter</td>
      <td></td>
      <td></td>
    </tr>
    <tr id="debug">
      <td>debug</td>
      <td>boolean</td>
      <td></td>
    </tr>
      <tr id="dir">
          <td>dir</td>
          <td></td>
          <td></td>
      </tr>
      <tr id="disabled">
          <td>disabled</td>
          <td>boolean</td>
          <td>
              <p>When set to <strong>true</strong>, the select control will be disabled.</p>

              <p>Default value: <strong>false</strong></p>
          </td>
      </tr>
    <tr id="dropdownAdapter">
      <td>dropdownAdapter</td>
      <td></td>
      <td></td>
    </tr>
    <tr id="dropdownAutoWidth">
      <td>dropdownAutoWidth</td>
      <td>boolean</td>
      <td></td>
    </tr>
    <tr id="dropdownCss">
      <td>dropdownCss</td>
      <td></td>
      <td></td>
    </tr>
    <tr id="dropdownCssClass">
      <td>dropdownCssClass</td>
      <td></td>
      <td></td>
    </tr>
      <tr id="dropdownParent">
          <td>dropdownParent</td>
          <td></td>
          <td></td>
      </tr>
    <tr id="escapeMarkup">
      <td>escapeMarkup</td>
      <td></td>
      <td></td>
    </tr>
    <tr id="initSelection">
      <td>initSelection</td>
      <td></td>
      <td></td>
    </tr>
      <tr id="language">
          <td>language</td>
          <td></td>
          <td></td>
      </tr>
    <tr id="matcher">
      <td>matcher</td>
      <td></td>
      <td></td>
    </tr>
      <tr id="maximumInputLength">
          <td>maximumInputLength</td>
          <td>integer</td>
          <td>
        <p>Maximum number of characters that may be provided for a search term.</p>

        <p>Default value: <strong>0</strong></p>   
      </td>
      </tr>
      <tr id="maximumSelectionLength">
          <td>maximumSelectionLength</td>
          <td>integer</td>
          <td>
        <p>The maximum number of items that may be selected in a multi-select control. If the
        value of this option is less than 1, the number of selected items will not be limited.</p>

        <p>Default value: <strong>0</strong></p>
      </td>
      </tr>
      <tr id="minimumInputLength">
          <td>minimumInputLength</td>
          <td>integer</td>
          <td>
              <p>Minimum number of characters required to start a search. This options is primarily
        useful in cases where data is loaded via the <code>ajax</code> option.</p>

        <p>Default value: <strong>0</strong></p>
          </td>
      </tr>
      <tr id="minimumResultsForSearch">
          <td>minimumResultsForSearch</td>
          <td>integer</td>
          <td>
              <p>The minimum number of results required in the initial population of the dropdown to
        keep the search box. This option is useful for cases where local data is used with a small
        result set, and the search box would simply be a waste of screen real estate. Set this
        value to -1 to permanently hide the search box.</p>

        <p>Default value: <strong>0</strong></p>
          </td>
      </tr>
    <tr id="multiple">
      <td>multiple</td>
      <td></td>
      <td>
        This option enables multi-select (pillbox) mode.  Select2 will automatically map the value of the `multiple` HTML attribute to this option during initialization.
      </td>
    </tr>
      <tr id="placeholder">
          <td>placeholder</td>
          <td></td>
          <td></td>
      </tr>
    <tr id="query">
      <td>query</td>
      <td></td>
      <td></td>
    </tr>
    <tr id="resultsAdapter">
      <td>resultsAdapter</td>
      <td></td>
      <td></td>
    </tr>
    <tr id="selectionAdapter">
      <td>selectionAdapter</td>
      <td></td>
      <td></td>
    </tr>
      <tr id="selectOnClose">
          <td>selectOnClose</td>
          <td>boolean</td>
          <td>
        <p>Default value: <strong>false</strong></p>
      </td>
      </tr>
    <tr id="sorter">
      <td>sorter</td>
      <td>function</td>
      <td></td>
    </tr>
      <tr id="tags">
          <td>tags</td>
          <td></td>
          <td></td>
      </tr>
      <tr id="templateResult">
          <td>templateResult</td>
          <td>function</td>
          <td></td>
      </tr>
      <tr id="templateSelection">
          <td>templateSelection</td>
          <td>function</td>
          <td></td>
      </tr>
      <tr id="theme">
          <td>theme</td>
          <td>string</td>
          <td>
        <p>Default value: <strong>default</strong></p>
      </td>
      </tr>
    <tr id="tokenizer">
      <td>tokenizer</td>
      <td></td>
      <td></td>
    </tr>
    <tr id="tokenSeparators">
      <td>tokenSeparators</td>
      <td></td>
      <td></td>
    </tr>
      <tr id="width">
          <td>width</td>
          <td>string</td>
          <td>
              <p>Specifies the <code>width</code> style attribute of the select2 container. The
        following values are supported:</p>

              <dl class="dl-horizontal">
                  <dt>element</dt>
                  <dd>Uses the computed element width from any applicable CSS rules.</dd>

                  <dt>resolve</dt>
                  <dd>Uses the <code>style</code> attribute value if available, falling
          back to the computed element width as necessary.</dd>

                  <dt>style</dt>
                  <dd>Width is determined from the <code>select</code> element's <code>style</code>
          attribute. If no <code>style</code> attribute is found, null is returned as the
          width.</dd>

                  <dt><em>{width_value}</em></dt>
                  <dd>Valid CSS values can be passed as a string (i.e. <code>80%</code>).</dd>
              </dl>

              <p>Default value: <strong>resolve</strong></p>
          </td>
      </tr>
  </tbody>
</table>
