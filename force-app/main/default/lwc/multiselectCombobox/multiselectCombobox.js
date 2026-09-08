import { LightningElement, api } from 'lwc';
import { createUuid } from 'c/utils';

const VARIANTS = ['standard', 'label-hidden', 'label-inline', 'label-stacked'];
const DROPDOWN_LENGTHS = [5, 7, 10];

const ARROW_DOWN = 'ArrowDown';
const ARROW_UP = 'ArrowUp';
const ENTER = 'Enter';
const ESCAPE = 'Escape';
const HOME = 'Home';
const END = 'End';

// A valueless attribute in an LWC template arrives as true, but a plain
// `show-pills=""` in hand written markup arrives as ''. Treat both as true.
const toBoolean = (value) => {
  if (value === '') return true;
  if (value === 'false') return false;
  return Boolean(value);
};

// A typo'd numeric attribute silently meant "no constraint", which is the
// worst possible default for min/max.
const warnUnparsed = (name, raw, parsed) => {
  if (parsed === undefined && raw !== undefined && raw !== null && raw !== '') {
    console.warn(
      `c-multiselect-combobox: ${name}="${raw}" is not a number and was ignored.`
    );
  }
};

const toNumber = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
};

/**
 * Multi select combobox built on the SLDS combobox blueprint and the
 * ARIA 1.2 combobox pattern.
 *
 * A `min` of 1 or more makes the field mandatory on its own, so `isRequired`
 * covers both and drives the asterisk and aria-required. Setting `required`
 * alongside `min` is redundant but harmless.
 */
export default class MultiselectCombobox extends LightningElement {
  @api name;
  @api label;
  @api placeholder = 'Select an Option';
  @api messageWhenValueMissing = 'Complete this field.';
  @api messageWhenRangeUnderflow;
  @api messageWhenRangeOverflow;

  searchTerm = '';
  isOpen = false;
  isFocused = false;
  activeIndex = -1;
  errorMessage = '';

  _uid = createUuid();
  _options = [];
  _value = [];
  _variant = 'standard';
  _dropdownLength = 5;
  _showPills = false;
  _required = false;
  _disabled = false;
  _min;
  _max;
  _customValidity = '';
  _pendingInputFocus = false;
  _scrolledIndex = -1;
  _optionsRevision = 0;
  _pillItemsKey = null;
  _pillItems = [];
  _restoringFocus = false;

  @api
  get options() {
    // Copy, to match the value getter. Returning _options let callers push
    // into internal state without triggering a re-render.
    return this._options.map((option) => ({ ...option }));
  }

  set options(value) {
    const incoming = Array.isArray(value) ? value : [];
    const seen = new Set();
    const unique = [];

    for (const option of incoming) {
      // A null row or a missing value would throw, or collapse several
      // options into one, and this setter runs during the parent's render.
      if (!option || option.value === undefined || option.value === null) {
        continue;
      }
      // option.value is the list key, so a repeat is an LWC render error.
      if (seen.has(option.value)) continue;
      seen.add(option.value);
      unique.push({ ...option });
    }

    if (unique.length !== incoming.length) {
      console.warn(
        `c-multiselect-combobox: dropped ${
          incoming.length - unique.length
        } option(s) that were empty or had duplicate values.`
      );
    }

    this._options = unique;
    this._optionsRevision += 1;
  }

  @api
  get value() {
    return [...this._value];
  }

  set value(value) {
    let next;
    if (Array.isArray(value)) next = value;
    else if (value === undefined || value === null || value === '') next = [];
    else next = [value];

    // Duplicates would collide as list keys in the pills child and would be
    // counted twice by min/max.
    this._value = [...new Set(next)];
  }

  @api
  get variant() {
    return this._variant;
  }

  set variant(value) {
    if (value && !VARIANTS.includes(value)) {
      // An @api setter runs during the parent's render, so throwing here takes
      // the whole parent down. Base components warn and fall back instead.
      console.warn(
        `c-multiselect-combobox: variant expects one of ${VARIANTS.join(
          ', '
        )}, got "${value}". Falling back to standard.`
      );
      this._variant = 'standard';
      return;
    }
    this._variant = value || 'standard';
  }

  @api
  get dropdownLength() {
    return this._dropdownLength;
  }

  set dropdownLength(value) {
    const num = toNumber(value);
    this._dropdownLength = DROPDOWN_LENGTHS.includes(num) ? num : 5;
  }

  @api
  get showPills() {
    return this._showPills;
  }

  set showPills(value) {
    this._showPills = toBoolean(value);
  }

  @api
  get required() {
    return this._required;
  }

  set required(value) {
    this._required = toBoolean(value);
  }

  @api
  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    this._disabled = toBoolean(value);
  }

  @api
  get min() {
    return this._min;
  }

  set min(value) {
    this._min = toNumber(value);
    warnUnparsed('min', value, this._min);
  }

  @api
  get max() {
    return this._max;
  }

  set max(value) {
    this._max = toNumber(value);
    warnUnparsed('max', value, this._max);
  }

  @api
  get validity() {
    const min = this.effectiveMin;
    const max = this.effectiveMax;
    const count = this._value.length;

    const valueMissing = this.isRequired && count === 0;
    const rangeUnderflow = min !== undefined && count < min;
    // The UI blocks selection at max, but the value setter does not, so an
    // over-long value assigned programmatically has to be reportable.
    const rangeOverflow = max !== undefined && count > max;
    const customError = !!this._customValidity;

    return {
      valueMissing,
      rangeUnderflow,
      rangeOverflow,
      customError,
      valid: !(valueMissing || rangeUnderflow || rangeOverflow || customError)
    };
  }

  @api
  checkValidity() {
    return this.validity.valid;
  }

  @api
  reportValidity() {
    const isValid = this.validity.valid;
    this.errorMessage = isValid ? '' : this.validationMessage;
    return isValid;
  }

  @api
  setCustomValidity(message) {
    this._customValidity = message || '';
  }

  @api
  focus() {
    const input = this.inputElement;
    if (input) input.focus();
  }

  connectedCallback() {
    // All @api props are assigned before this runs, so it is the first point
    // at which min and max can be compared.
    if (this._max !== undefined && this._max < 1) {
      console.warn(
        `c-multiselect-combobox: max="${this._max}" would make every option unselectable and was ignored.`
      );
    } else if (
      this._min !== undefined &&
      this._max !== undefined &&
      this._min > this._max
    ) {
      console.warn(
        `c-multiselect-combobox: min (${this._min}) exceeds max (${this._max}), which can never be satisfied. Treating min as ${this._max}.`
      );
    }
  }

  renderedCallback() {
    if (this._pendingInputFocus) {
      this._pendingInputFocus = false;
      this.focus();
    }

    this.scrollActiveIntoView();
  }

  // aria-activedescendant moves a virtual cursor rather than real focus, so
  // the browser will not scroll the highlighted option into view for us.
  scrollActiveIntoView() {
    if (this.activeIndex === this._scrolledIndex) return;
    this._scrolledIndex = this.activeIndex;
    if (this.activeIndex < 0) return;

    const active = this.template.querySelector(
      `[data-index="${this.activeIndex}"]`
    );
    // jsdom has no layout, so scrollIntoView is undefined under Jest.
    if (active && active.scrollIntoView) {
      active.scrollIntoView({ block: 'nearest' });
    }
  }

  get inputElement() {
    return this.template.querySelector('[data-input]');
  }

  get inputId() {
    return `input-${this._uid}`;
  }
  get listboxId() {
    return `listbox-${this._uid}`;
  }
  get helpId() {
    return `help-${this._uid}`;
  }

  // min and max are set independently, so they can only be reconciled on
  // read. A max below 1 or a min above max would otherwise be an unescapable
  // deadlock: nothing selectable, or nothing that satisfies validity.
  get effectiveMax() {
    if (this._max === undefined || this._max < 1) return undefined;
    return this._max;
  }

  get effectiveMin() {
    if (this._min === undefined || this._min < 1) return undefined;
    const max = this.effectiveMax;
    return max !== undefined && this._min > max ? max : this._min;
  }

  get isAtMax() {
    const max = this.effectiveMax;
    return max !== undefined && this._value.length >= max;
  }

  // A selected value that is no longer in options (a deactivated picklist
  // entry, stale record data) is still shown, so it can be deselected. The
  // alternative, silently dropping it, destroys data the user can see.
  get resolvedOptions() {
    const known = new Set(this._options.map((option) => option.value));
    const orphans = this._value
      .filter((value) => !known.has(value))
      .map((value) => ({ label: String(value), value }));

    const all = orphans.length ? [...this._options, ...orphans] : this._options;

    return all.map((option, index) => ({
      ...option,
      id: `option-${this._uid}-${index}`
    }));
  }

  get filteredOptions() {
    const term = this.searchTerm.trim().toLowerCase();
    const options = this.resolvedOptions;
    if (!term) return options;
    return options.filter((option) =>
      String(option.label).toLowerCase().includes(term)
    );
  }

  get visibleOptions() {
    const atMax = this.isAtMax;

    return this.filteredOptions.map((option, index) => {
      const isSelected = this._value.includes(option.value);
      const isActive = index === this.activeIndex;
      const isDisabled = !!option.disabled || (atMax && !isSelected);

      return {
        key: option.value,
        id: option.id,
        index,
        label: option.label,
        value: option.value,
        isSelected,
        isDisabled,
        ariaSelected: isSelected ? 'true' : 'false',
        ariaDisabled: isDisabled ? 'true' : 'false',
        optionClass: this.getOptionClass(isSelected, isActive, isDisabled)
      };
    });
  }

  get hasVisibleOptions() {
    return this.filteredOptions.length > 0;
  }

  get pillItems() {
    // Stable reference while nothing relevant changed, otherwise the child
    // re-renders on every keystroke in the search box.
    const key = `${this._optionsRevision}|${this._value.join('\u0000')}`;
    if (key !== this._pillItemsKey) {
      this._pillItemsKey = key;
      this._pillItems = this._value.map((value) => ({
        value,
        label: this.getLabelFor(value)
      }));
    }
    return this._pillItems;
  }

  get pillsLabel() {
    return this.label ? `Selected ${this.label}` : 'Selected Options';
  }

  get hasPills() {
    return this._showPills && this._value.length > 0;
  }

  get summaryText() {
    const count = this._value.length;
    if (count === 0) return '';
    if (count === 1) return this.getLabelFor(this._value[0]);
    return `${count} Options Selected`;
  }

  get displayValue() {
    return this.isFocused ? this.searchTerm : this.summaryText;
  }

  // While focused the input is an empty search box, so surface the summary
  // as the placeholder rather than losing it entirely.
  get computedPlaceholder() {
    return this.summaryText || this.placeholder;
  }

  get ariaExpanded() {
    return this.isOpen ? 'true' : 'false';
  }

  // min >= 1 cannot be satisfied by an empty field, so it is a required field
  // whether or not `required` was also set.
  @api
  get isRequired() {
    return this._required || this.effectiveMin !== undefined;
  }

  get ariaRequired() {
    return this.isRequired ? 'true' : 'false';
  }

  get ariaInvalid() {
    return this.errorMessage ? 'true' : 'false';
  }

  // Filtering changes the list silently for a screen reader, so announce the
  // count. The region itself is always rendered; only its text changes.
  get resultsAnnouncement() {
    if (!this.isOpen) return '';
    const count = this.filteredOptions.length;
    if (count === 0) return 'No matches found.';
    return `${count} ${count === 1 ? 'result' : 'results'} available.`;
  }

  // LWC's gid() removes an IDREF attribute for null, but logs an error for
  // undefined or ''. Return null when there is nothing to point at.
  get activeDescendantId() {
    if (!this.isOpen || this.activeIndex < 0) return null;
    const option = this.visibleOptions[this.activeIndex];
    return option ? option.id : null;
  }

  get listboxLabel() {
    return this.label ? `${this.label} options` : 'Options';
  }

  get validationMessage() {
    const { valueMissing, rangeUnderflow, rangeOverflow, customError } =
      this.validity;

    if (customError) return this._customValidity;
    if (valueMissing) return this.messageWhenValueMissing;

    if (rangeUnderflow) {
      const min = this.effectiveMin;
      return (
        this.messageWhenRangeUnderflow ||
        `Select at least ${min} ${min === 1 ? 'option' : 'options'}.`
      );
    }

    if (rangeOverflow) {
      const max = this.effectiveMax;
      return (
        this.messageWhenRangeOverflow ||
        `Select no more than ${max} ${max === 1 ? 'option' : 'options'}.`
      );
    }

    return '';
  }

  get formElementClass() {
    const classes = ['slds-form-element'];
    if (this._variant === 'label-inline') {
      classes.push('slds-form-element_horizontal');
    }
    if (this._variant === 'label-stacked') {
      classes.push('slds-form-element_stacked');
    }
    if (this.errorMessage) classes.push('slds-has-error');
    return classes.join(' ');
  }

  get labelClass() {
    const classes = ['slds-form-element__label'];
    if (this._variant === 'label-hidden') classes.push('slds-assistive-text');
    return classes.join(' ');
  }

  get containerClass() {
    const classes = ['slds-combobox_container'];
    if (this._value.length > 0) classes.push('slds-has-selection');
    return classes.join(' ');
  }

  get comboboxClass() {
    const classes = [
      'slds-combobox',
      'slds-dropdown-trigger',
      'slds-dropdown-trigger_click'
    ];
    if (this.isOpen) classes.push('slds-is-open');
    return classes.join(' ');
  }

  get dropdownClass() {
    return `slds-dropdown slds-dropdown_fluid slds-dropdown_length-${this._dropdownLength}`;
  }

  getOptionClass(isSelected, isActive, isDisabled) {
    const classes = [
      'slds-media',
      'slds-listbox__option',
      'slds-listbox__option_plain',
      'slds-media_small'
    ];
    if (isSelected) classes.push('slds-is-selected');
    if (isActive) classes.push('slds-has-focus');
    if (isDisabled) classes.push('slds-is-disabled');
    return classes.join(' ');
  }

  getLabelFor(value) {
    const match = this._options.find((option) => option.value === value);
    return match ? match.label : value;
  }

  handleFocus() {
    this.isFocused = true;
    // Entering the field fresh starts a clean search box. Focus restored by
    // handleOptionClick after an assistive-tech activation is not a fresh
    // entry and must not discard what was typed. isOpen cannot stand in for
    // this: focusout has already closed the dropdown by that point.
    if (!this._restoringFocus) this.searchTerm = '';
  }

  handleFocusOut(event) {
    const next = event.relatedTarget;
    const movedWithin = !!next && this.template.contains(next);

    // Only the input counts as "focused" for display purposes. The pills are
    // a separate tab stop, so stepping onto them must restore the summary.
    this.isFocused = movedWithin && next === this.inputElement;

    if (movedWithin) {
      // Still inside the field, so collapse the dropdown but do not judge
      // validity yet.
      if (next !== this.inputElement) this.close();
      return;
    }

    this.close();
    this.reportValidity();
  }

  handleInputClick() {
    if (this._disabled) return;
    if (this.isOpen) this.close();
    else this.open();
  }

  handleInput(event) {
    this.searchTerm = event.target.value;
    this.activeIndex = this.searchTerm ? 0 : -1;
    this.open();
  }

  handleKeyDown(event) {
    if (this._disabled) return;
    const { key } = event;

    if (key === ARROW_DOWN || key === ARROW_UP) {
      event.preventDefault();
      this.moveActive(key === ARROW_DOWN ? 1 : -1);
      return;
    }

    if (key === ENTER) {
      event.preventDefault();
      if (this.isOpen) this.toggleActiveOption();
      else this.open();
      return;
    }

    if (key === ESCAPE) {
      if (this.isOpen) {
        event.preventDefault();
        this.close();
      }
      return;
    }

    // Home and End only navigate the list while the input is empty,
    // otherwise they belong to the text caret.
    if (
      (key === HOME || key === END) &&
      this.isOpen &&
      this.searchTerm === ''
    ) {
      event.preventDefault();
      this.activeIndex = key === HOME ? 0 : this.visibleOptions.length - 1;
    }
  }

  // mousedown does nothing but guard focus: preventing the default stops the
  // input blurring, which keeps aria-activedescendant live and the dropdown
  // open. Activation lives in click, because assistive tech synthesises a
  // click with no preceding mousedown and would otherwise be unable to
  // select anything at all.
  handleOptionMouseDown(event) {
    if (event.button !== 0) return;
    event.preventDefault();
  }

  handleOptionClick(event) {
    if (this._disabled) return;

    const index = Number(event.currentTarget.dataset.index);
    const option = this.visibleOptions[index];
    if (!option || option.isDisabled) return;

    this.activeIndex = index;
    this.toggleValue(option.value);

    // A synthesised click arrives without the mousedown guard above, so focus
    // may have moved and focusout may already have closed the dropdown.
    // Restore both; a no-op when the mouse path kept them.
    this._restoringFocus = true;
    this.focus();
    this._restoringFocus = false;
    this.open();
  }

  handlePillRemove(event) {
    if (this._disabled) return;

    const { value, viaKeyboard } = event.detail;
    this.removeValue(value);

    // The pills own their own focus, except when the row empties out and
    // there is nothing left in it to focus.
    if (viaKeyboard && this._value.length === 0) {
      this._pendingInputFocus = true;
    }
  }

  moveActive(step) {
    if (!this.isOpen) {
      this.open();
      this.activeIndex = step > 0 ? 0 : this.visibleOptions.length - 1;
      return;
    }

    const count = this.visibleOptions.length;
    if (count === 0) {
      this.activeIndex = -1;
      return;
    }

    const next = this.activeIndex + step;
    if (next < 0) this.activeIndex = count - 1;
    else if (next >= count) this.activeIndex = 0;
    else this.activeIndex = next;
  }

  toggleActiveOption() {
    const option = this.visibleOptions[this.activeIndex];
    if (!option || option.isDisabled) return;
    this.toggleValue(option.value);
  }

  toggleValue(value) {
    if (this._value.includes(value)) {
      this._value = this._value.filter((v) => v !== value);
    } else {
      if (this.isAtMax) return;
      this._value = [...this._value, value];
    }

    this.afterValueChange();
  }

  removeValue(value) {
    this._value = this._value.filter((v) => v !== value);
    this.afterValueChange();
  }

  afterValueChange() {
    // Re-validate on every user-driven change, not just when an error is
    // already showing. Removing a selection can take a valid field invalid
    // (drop below min), and gating on errorMessage kept that silent until
    // blur. Only toggleValue and removeValue reach here, so this never fires
    // for a programmatic `value` assignment or on first render.
    this.reportValidity();
    this.fireSelected();
  }

  open() {
    if (this._disabled || this.isOpen) return;
    this.isOpen = true;
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.activeIndex = -1;
    // searchTerm deliberately survives: ARIA 1.2 says the first Escape closes
    // the popup and keeps the value. handleFocus clears it on the way back in.
  }

  fireSelected() {
    const selected = new CustomEvent('selected', { detail: [...this._value] });
    this.dispatchEvent(selected);
  }
}
