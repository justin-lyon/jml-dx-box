import { LightningElement, api } from 'lwc';
import { createUuid } from 'c/utils';

const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const DELETE = 'Delete';
const BACKSPACE = 'Backspace';

/**
 * SLDS listbox of pills. Owns its own roving tabindex so the whole row is a
 * single tab stop, and reports removals to its parent.
 *
 * The pills carry role="option" inside this component's shadow root, which is
 * safe because nothing outside references them by id. The dropdown options
 * cannot be split out the same way, they are aria-activedescendant targets.
 */
export default class MultiselectComboboxPills extends LightningElement {
  @api label = 'Selected Options';

  focusIndex = 0;

  _uid = createUuid();
  _items = [];
  _pendingFocus = false;
  _disabled = false;
  // Index the user pressed Delete on, -1 when idle. Focus only chases a
  // removal the parent actually honoured.
  _removalIndex = -1;

  @api
  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    this._disabled = value === '' ? true : Boolean(value) && value !== 'false';
  }

  @api
  get items() {
    return this._items;
  }

  set items(value) {
    const previousCount = this._items.length;
    this._items = Array.isArray(value)
      ? value.map((item) => ({ ...item }))
      : [];
    const count = this._items.length;

    // Only chase focus when a keyboard removal actually took effect. Setting
    // the flag optimistically in the key handler left it latched whenever the
    // parent declined, and it then fired on an unrelated later render.
    if (this._removalIndex >= 0 && count < previousCount) {
      this.focusIndex =
        this._removalIndex >= count
          ? Math.max(count - 1, 0)
          : this._removalIndex;
      this._pendingFocus = count > 0;
    }
    this._removalIndex = -1;

    if (count === 0) this.focusIndex = 0;
    else if (this.focusIndex > count - 1) this.focusIndex = count - 1;
  }

  @api
  focus() {
    const pill = this.template.querySelector(
      `[data-pill-index="${this.focusIndex}"]`
    );
    if (pill) pill.focus();
  }

  renderedCallback() {
    if (!this._pendingFocus) return;
    this._pendingFocus = false;
    this.focus();
  }

  get helpId() {
    return `pill-help-${this._uid}`;
  }

  get pills() {
    return this._items.map((item, index) => ({
      key: item.value,
      label: item.label,
      index,
      // A disabled row is not a tab stop and not interactive.
      tabindex: this._disabled ? '-1' : index === this.focusIndex ? '0' : '-1'
    }));
  }

  handleKeyDown(event) {
    if (this._disabled) return;
    const index = Number(event.currentTarget.dataset.pillIndex);
    const { key } = event;

    if (key === ARROW_RIGHT || key === ARROW_LEFT) {
      event.preventDefault();
      const count = this._items.length;
      if (count === 0) return;
      const step = key === ARROW_RIGHT ? 1 : -1;
      this.focusIndex = (index + step + count) % count;
      this._pendingFocus = true;
      return;
    }

    if (key === DELETE || key === BACKSPACE) {
      event.preventDefault();
      const item = this._items[index];
      if (!item) return;

      // Focus is settled in the items setter, once the removal is confirmed.
      this._removalIndex = index;
      this.fireRemove(item.value, true);
    }
  }

  // mousedown guards focus only, so the combobox input does not blur. The
  // removal itself happens on click, which is what assistive tech synthesises.
  handleRemoveMouseDown(event) {
    if (this._disabled || event.button !== 0) return;
    event.preventDefault();
  }

  handleRemoveClick(event) {
    if (this._disabled) return;
    // Index, not value: dataset stringifies, so a numeric or boolean option
    // value came back as a string the parent could never match.
    const item = this._items[Number(event.currentTarget.dataset.removeIndex)];
    if (item) this.fireRemove(item.value, false);
  }

  fireRemove(value, viaKeyboard) {
    const remove = new CustomEvent('remove', {
      detail: { value, viaKeyboard }
    });
    this.dispatchEvent(remove);
  }
}
