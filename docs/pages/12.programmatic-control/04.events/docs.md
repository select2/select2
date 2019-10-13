---
title: Events
metadata:
    description: Listening to Select2's built-in events, and manually triggering events on the Select2 component.
taxonomy:
    category: docs
process:
    twig: true
never_cache_twig: true
---

Select2 will trigger a few different events when different actions are taken using the component, allowing you to add custom hooks and perform actions.  You may also manually trigger these events on a Select2 control using `.trigger`.

| Event | Description |
| ----- | ----------- |
| `change` | Triggered whenever an option is selected or removed. |
| `change.select2` | Scoped version of `change`.  See [below](#limiting-the-scope-of-the-change-event) for more details. |
| `select2:closing` | Triggered before the dropdown is closed. This event can be prevented. |
| `select2:close` | Triggered whenever the dropdown is closed. `select2:closing` is fired before this and can be prevented. |
| `select2:opening` | Triggered before the dropdown is opened. This event can be prevented. |
| `select2:open` | Triggered whenever the dropdown is opened. `select2:opening` is fired before this and can be prevented. |
| `select2:selecting` | Triggered before a result is selected. This event can be prevented. |
| `select2:select` | Triggered whenever a result is selected. `select2:selecting` is fired before this and can be prevented. |
| `select2:unselecting` | Triggered before a selection is removed. This event can be prevented. |
| `select2:unselect` | Triggered whenever a selection is removed. `select2:unselecting` is fired before this and can be prevented. |
| `select2:clearing` | Triggered before all selections are cleared. This event can be prevented. |
| `select2:clear` | Triggered whenever all selections are cleared. `select2:clearing` is fired before this and can be prevented. |

## Listening for events

All public events are relayed using the jQuery event system, and they are triggered on the `<select>` element that Select2 is attached to. You can attach to them using the [`.on` method](https://api.jquery.com/on/) provided by jQuery:

```
$('#mySelect2').on('select2:select', function (e) {
  // Do something
});
```

## Event data

When `select2:select` is triggered, data from the selection can be accessed via the `params.data` property:

```
$('#mySelect2').on('select2:select', function (e) {
    var data = e.params.data;
    console.log(data);
});
```

`e.params.data` will return an object containing the selection properties.  Any additional data for the selection that was provided in the [data source](/data-sources/formats) will be included in this object as well.  For example:

```
{
  "id": 1,
  "text": "Tyto alba",
  "genus": "Tyto",
  "species": "alba"
}
```

## Triggering events

You can manually trigger events on a Select2 control using the jQuery [`trigger`](http://api.jquery.com/trigger/) method.  However, if you want to pass some data to any handlers for the event, you need to construct a new [jQuery `Event` object](http://api.jquery.com/category/events/event-object/) and trigger on that:

```
var data = {
  "id": 1,
  "text": "Tyto alba",
  "genus": "Tyto",
  "species": "alba"
};

$('#mySelect2').trigger({
    type: 'select2:select',
    params: {
        data: data
    }
});
```

### Limiting the scope of the `change` event

It's common for other components to be listening to the `change` event, or for custom event handlers to be attached that may have side effects.  To limit the scope to **only** notify Select2 of the change, use the `.select2` event namespace:

```
$('#mySelect2').val('US'); // Change the value or make some change to the internal state
$('#mySelect2').trigger('change.select2'); // Notify only Select2 of changes
```

## Examples

<div class="s2-example">
  <p>
    <select class="js-states js-example-events form-control"></select>
  </p>
  <p>
    <select class="js-states js-example-events form-control" multiple="multiple"></select>
  </p>
</div>

<div class="s2-event-log">
  <ul class="js-event-log"></ul>
</div>

<pre data-fill-from=".js-code-events"></pre>

<script type="text/javascript" class="js-code-events">
var $eventLog = $(".js-event-log");
var $eventSelect = $(".js-example-events");

$eventSelect.select2();

$eventSelect.on("select2:open", function (e) { log("select2:open", e); });
$eventSelect.on("select2:close", function (e) { log("select2:close", e); });
$eventSelect.on("select2:select", function (e) { log("select2:select", e); });
$eventSelect.on("select2:unselect", function (e) { log("select2:unselect", e); });

$eventSelect.on("change", function (e) { log("change"); });

function log (name, evt) {
  if (!evt) {
    var args = "{}";
  } else {
    var args = JSON.stringify(evt.params, function (key, value) {
      if (value && value.nodeName) return "[DOM node]";
      if (value instanceof $.Event) return "[$.Event]";
      return value;
    });
  }
  var $e = $("<li>" + name + " -> " + args + "</li>");
  $eventLog.append($e);
  $e.animate({ opacity: 1 }, 10000, 'linear', function () {
    $e.animate({ opacity: 0 }, 2000, 'linear', function () {
      $e.remove();
    });
  });
}
</script>

## Preventing events

See [https://stackoverflow.com/a/26706695/2970321](https://stackoverflow.com/a/26706695/2970321).

## Internal Select2 events

Select2 has an [internal event system](/advanced/default-adapters/selection#eventrelay) that works independently of the DOM event system, allowing adapters to communicate with each other. This internal event system is only accessible from plugins and adapters that are connected to Select2 - **not** through the jQuery event system.

You can find more information on the public events triggered by individual adapters in the [advanced chapter](/advanced).
