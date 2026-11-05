# Pull Request: Comprehensive Modal and Dialog Integration (Positioning, Scroll Locking, Z-Index, and Focus Trapping)

This pull request includes a:

- [x] Bug fix
- [ ] New feature
- [ ] Translation

______________________________________________________________________

## Related Issues

Closes / Addresses:

- **#6391, #4236, #3125, #3897, #5800**: Parent scroll permanently locked after opening Select2 or leaking listeners when modal closed.
- **#6318, #4381, #3303, #3672, #5048**: Dropdown displaced or detached when container or modal has scroll offset, CSS `transform` (e.g. Bootstrap `.modal.fade .modal-dialog`), `perspective`, or `filter`.
- **#3388, #4533**: Dropdown renders behind dialog/modal overlay (due to z-index 1051 < Bootstrap 5's 1055 or HTML5 `<dialog>` `#top-layer`).
- **#1147, #5110**: Search input unclickable / unfocusable due to dialog focus trap interception (`_enforceFocus`).
- **#4218, #6000**: Orphaned dropdown when modal closes, and collapsed 0px / 100px width when initialized in hidden (`display: none`) dialogs.

______________________________________________________________________

## Summary of Changes

### 1. Auto-Detection of Modal/Dialog Containers (`dropdownParent`)

- **Problem**: `AttachBody` defaulted `this.$dropdownParent` to `$(document.body)`. In HTML5 `<dialog>`, elements on `document.body` render completely behind the native `#top-layer`. In Bootstrap / jQuery UI / ARIA dialogs, attaching to `body` triggers modal focus traps and places the dropdown in a disconnected stacking context.
- **Fix**: In \[src/js/select2/dropdown/attachBody.js\](file:///c:/phpserver/www/select2/src/js/select2/dropdown/attachBody.js), if `dropdownParent` is not explicitly configured, Select2 automatically checks for the closest `dialog, .modal, [role="dialog"], .ui-dialog` ancestor before falling back to `document.body`. Explicitly configured `dropdownParent` options continue to take absolute precedence.

### 2. Containing-Block & Scroll-Offset Math (`_positionDropdown`)

- **Problem**: When calculating offset coordinates, `_positionDropdown()` subtracted `$offsetParent.offset()` without adding `$offsetParent.scrollTop()` and `scrollLeft()`. In scrollable dialogs, this caused the dropdown to open shifted upward by the scroll amount. Additionally, checking only `position === 'static'` failed to identify CSS containing blocks established by `transform`, `perspective`, `filter`, `contain`, or `will-change`.
- **Fix**:
    - Implemented `AttachBody.prototype._getOffsetParent()` to correctly traverse ancestor containing blocks (including CSS `transform`, `perspective`, `filter`, and `contain`).
    - Added `$offsetParent.scrollTop()` and `$offsetParent.scrollLeft()` compensation for non-root offset parents.
    - Subtracted `clientTop` and `clientLeft` to account for container borders.

### 3. Eliminated Scroll Locking and Event Leakage (`_attachPositioningHandler` & `_detachPositioningHandler`)

- **Problem**: Select2 previously attached a scroll handler that forcefully reset `$(this).scrollTop(position.y)` on all parent elements with scrollbars, intentionally freezing modal scrolling. Furthermore, `_detachPositioningHandler` re-evaluated `parents().filter(Utils.hasScroll)` on close; if the modal had closed or changed dimensions, the filter returned false, leaving the scroll-locking handler permanently attached and freezing the modal forever.
- **Fix**:
    - Removed the `$(this).scrollTop(position.y)` freeze. When an ancestor container scrolls, Select2 now dynamically updates dropdown position and dimensions (`_positionDropdown()` and `_resizeDropdown()`).
    - Cached `this._$scrollWatchers` on the instance so `_detachPositioningHandler` reliably detaches event listeners from the exact elements that were bound, preventing memory and handler leaks.

### 4. Focus-Trapping Protection & Scroll-Jump Prevention

- **Problem**: Clicking or focusing inside the dropdown or dragging results scrollbars bubbled `focusin` and `touchstart` to `document`, triggering modal focus-containment listeners (e.g. Bootstrap's `_enforceFocus`) which stole focus back and blurred/closed Select2. Additionally, standard `focus()` calls caused browsers to abruptly jump page scroll positions.
- **Fix**:
    - Stopped `focusin`, `touchstart`, and `mousedown` propagation on `this.$dropdownContainer`.
    - Replaced unconstrained `focus()` calls in `src/js/select2/dropdown/search.js` and `src/js/select2/selection/search.js` with `focus({ preventScroll: true })`.

### 5. Native Wheel Event Propagation & Boundary Chaining

- **Problem**: When `jquery-mousewheel` was not present (such as non-full builds or modern bundlers), scrolling the options list reached top/bottom limits and chained to the modal, causing dismissal in modal frameworks that listen to ancestor scrolls.
- **Fix**:
    - Added native `wheel` listener in \[src/js/select2/results.js\](file:///c:/phpserver/www/select2/src/js/select2/results.js) with boundary checking (`scrollTop <= 0` and `scrollTop + clientHeight >= scrollHeight`) to prevent overscroll chaining.
    - Added CSS `overscroll-behavior: contain;` to `.select2-results__options` in \[src/scss/\_dropdown.scss\](file:///c:/phpserver/www/select2/src/scss/\_dropdown.scss).

### 6. Modal Lifecycle Synchronization & Zero-Width Prevention

- **Problem**: If a modal closed via Escape or background click, active Select2 dropdowns remained orphaned. Furthermore, initializing Select2 inside hidden (`display: none`) dialogs resolved container width to `0px` or `auto`.
- **Fix**:
    - Select2 automatically listens to modal hide events (`hide.bs.modal`, `hidden.bs.modal`, `dialogclose`, `close`) on parent dialogs and closes the dropdown cleanly.
    - Listens to `shown.bs.modal` to automatically recalculate and apply container width once the dialog becomes visible.
    - Updated `_resolveWidth()` to fallback to `'100%'` instead of `'auto'` when element width is 0 or unmeasurable during hidden initialization.

### 7. Z-Index Management

- **Problem**: The default `.select2-dropdown` had `z-index: 1051`, which is lower than Bootstrap 5's `--bs-modal-zindex: 1055` and custom lightboxes.
- **Fix**:
    - Updated default CSS z-index to `1060`.
    - Added dynamic z-index calculation in `AttachBody.prototype.position` that inspects ancestor z-indices and ensures the dropdown is always stacked on top.

______________________________________________________________________

## Verification & Quality Assurance

- **JSHint**: Passed with 0 errors across all 107 codebase files and 42 test suites (`npx grunt lint`).
- **Build / Packaging**: All distribution files (`dist/js/select2.js`, `dist/js/select2.min.js`, `dist/js/select2.full.js`, `dist/js/select2.full.min.js`, `dist/css/select2.css`, `dist/css/select2.min.css`) compiled cleanly with RequireJS, Almond, and Sass.
- **Unit Tests Added**: Added automated test coverage in \[tests/dropdown/dropdownParent-tests.js\](file:///c:/phpserver/www/select2/tests/dropdown/dropdownParent-tests.js) verifying automatic container detection for `<dialog>` and `.modal` elements while maintaining 100% backward compatibility for `document.body` fallback and explicit `dropdownParent` overrides.
