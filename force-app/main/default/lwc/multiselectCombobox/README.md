# `c-multiselect-combobox`

A multi-select combobox with typeahead filtering, an optional row of removable
pills, and min/max selection constraints, built on the
[SLDS combobox blueprint](https://www.lightningdesignsystem.com/components/combobox/)
and the [ARIA 1.2 combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).

## Usage

<!-- prettier-ignore -->
```html
<c-multiselect-combobox
  label="Relate To"
  options={relateToOptions}
  value={selected}
  onselected={handleSelected}
  show-pills
  required
  max="3"
></c-multiselect-combobox>
```

```js
relateToOptions = [
  { label: 'Accounts', value: 'account' },
  { label: 'Reports', value: 'report' },
  { label: 'Contacts', value: 'contact', disabled: true }
];

handleSelected(event) {
  this.selected = event.detail; // ['account', 'report']
}
```

## Properties

| Property                       | Type                               | Default                            | Description                                                                                                       |
| ------------------------------ | ---------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `options`                      | `Array<{label, value, disabled?}>` | `[]`                               | Available options. Entries that are `null` or lack a `value`, and entries with a duplicate `value`, are dropped.  |
| `value`                        | `Array`                            | `[]`                               | Selected values. Duplicates are removed; a non-array is wrapped in one; `null`, `undefined` and `''` become `[]`. |
| `label`                        | `String`                           | —                                  | Field label.                                                                                                      |
| `placeholder`                  | `String`                           | `'Select an Option'`               | Shown when nothing is selected.                                                                                   |
| `variant`                      | `String`                           | `'standard'`                       | `standard`, `label-hidden`, `label-inline` or `label-stacked`.                                                    |
| `show-pills`                   | `Boolean`                          | `false`                            | Render a removable pill per selection below the input.                                                            |
| `dropdown-length`              | `Number`                           | `5`                                | Visible rows before scrolling: `5`, `7` or `10`.                                                                  |
| `required`                     | `Boolean`                          | `false`                            |                                                                                                                   |
| `disabled`                     | `Boolean`                          | `false`                            |                                                                                                                   |
| `min`                          | `Number`                           | —                                  | Minimum selections.                                                                                               |
| `max`                          | `Number`                           | —                                  | Maximum selections.                                                                                               |
| `message-when-value-missing`   | `String`                           | `'Complete this field.'`           |                                                                                                                   |
| `message-when-range-underflow` | `String`                           | `'Select at least N options.'`     |                                                                                                                   |
| `message-when-range-overflow`  | `String`                           | `'Select no more than N options.'` |                                                                                                                   |

## Methods

| Method                       | Returns   | Description                                                            |
| ---------------------------- | --------- | ---------------------------------------------------------------------- |
| `focus()`                    | —         | Focuses the input.                                                     |
| `checkValidity()`            | `Boolean` | Whether the field is valid. Displays nothing.                          |
| `reportValidity()`           | `Boolean` | Validates and displays the error message.                              |
| `setCustomValidity(message)` | —         | Sets a custom error, overriding built-in messages. Pass `''` to clear. |
| `validity`                   | `Object`  | `{ valueMissing, rangeUnderflow, rangeOverflow, customError, valid }`  |

## Events

| Event      | Detail                         |
| ---------- | ------------------------------ |
| `selected` | `Array` of the selected values |

Fires when the user selects, deselects or removes a pill, and when a change to
`options` clears an existing selection. Does not fire when `value` is assigned
programmatically. Does not bubble.

## Behaviour

### Input display

| State            | Input shows                     |
| ---------------- | ------------------------------- |
| Nothing selected | `placeholder`                   |
| One selection    | that option's label             |
| Two or more      | `"N Options Selected"`          |
| Focused          | the search term, starting empty |

Typing filters options by case-insensitive substring match on `label`.

### Keyboard

| Key            | Closed                  | Open                                                |
| -------------- | ----------------------- | --------------------------------------------------- |
| `ArrowDown`    | opens, highlights first | next option, wraps                                  |
| `ArrowUp`      | opens, highlights last  | previous option, wraps                              |
| `Enter`        | opens                   | toggles the highlighted option, stays open          |
| `Escape`       | —                       | closes, keeps the search term                       |
| `Home` / `End` | —                       | first / last option, while the search term is empty |
| `Tab`          | —                       | closes and reports validity                         |

The pill row is a single tab stop. `ArrowLeft` and `ArrowRight` move between
pills; `Delete` and `Backspace` remove the focused pill.

### Constraints

- `min` of 1 or more makes the field required.
- At `max`, unselected options are disabled.
- `max` below 1 is ignored.
- `min` greater than `max` is treated as `max`.

Validity is re-reported on every selection change, so removing a selection that
drops the count below `min` shows the error immediately.

### Changing options

Assigning an `options` list with different values clears the current selection,
search term and error, and fires `selected` with `[]`. This does not apply to
the first assignment, and lists with matching values are treated as unchanged.

A selected value that is not in `options` still renders as a selected option so
it can be deselected.

## Limitations

- The dropdown is absolutely positioned and is clipped by an ancestor with
  `overflow: hidden`, such as a modal or datatable cell.
- No `+N more` toggle for long pill rows, and no option grouping.
- Strings other than the `message-when-*` properties are English only.

## Testing

```bash
npm run test:unit -- multiselectCombobox
```
