---
title: Common problems
metadata:
    description: Commonly encountered issues when using Select2.
taxonomy:
    category: docs
---

### Select2 does not function properly when I use it inside a Bootstrap modal.

This issue occurs because Bootstrap modals tend to steal focus from other elements outside of the modal.  Since by default, Select2 [attaches the dropdown menu to the `<body>` element](/dropdown#dropdown-placement), it is considered "outside of the modal".

To avoid this problem, you may attach the dropdown to the modal itself with the [dropdownParent](/dropdown#dropdown-placement) setting:

```
<div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
    ...
    <select id="mySelect2">
        ...
    </select>
    ...
</div>

...

<script>
    $('#mySelect2').select2({
        dropdownParent: $('#myModal')
    });
</script>
```

This will cause the dropdown to be attached to the modal, rather than the `<body>` element.

**Alternatively**, you may simply globally override Bootstrap's behavior:

```
// Do this before you initialize any of your modals
$.fn.modal.Constructor.prototype.enforceFocus = function() {};
```

See [this answer](https://stackoverflow.com/questions/18487056/select2-doesnt-work-when-embedded-in-a-bootstrap-modal/19574076#19574076) for more information.

### The dropdown becomes misaligned/displaced when using pinch-zoom.

See [#5048](https://github.com/select2/select2/issues/5048).  The problem is that some browsers' implementations of pinch-zoom affect the `body` element, which [Select2 attaches to by default](https://select2.org/dropdown#dropdown-placement), causing it to render incorrectly.

The solution is to use `dropdownParent` to attach the dropdown to a more specific element.
