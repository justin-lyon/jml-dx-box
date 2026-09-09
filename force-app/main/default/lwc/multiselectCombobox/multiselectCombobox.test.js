import { createElement } from 'lwc';
import MultiselectCombobox from 'c/multiselectCombobox';

const OPTIONS = [
  { label: 'Accounts', value: 'Account' },
  { label: 'Reports', value: 'Report' },
  { label: 'Contacts', value: 'Contact' },
  { label: 'Files', value: 'File' }
];

const initCmp = (props = {}) => {
  const cmp = createElement('c-multiselect-combobox', {
    is: MultiselectCombobox
  });
  cmp.label = 'Relate To';
  cmp.options = OPTIONS;
  Object.assign(cmp, props);
  document.body.appendChild(cmp);
  return cmp;
};

const getInput = (cmp) => cmp.shadowRoot.querySelector('[data-input]');
const getOptions = (cmp) =>
  Array.from(cmp.shadowRoot.querySelectorAll('[role="option"][data-index]'));
const getPillsCmp = (cmp) =>
  cmp.shadowRoot.querySelector('c-multiselect-combobox-pills');
const getCombobox = (cmp) => cmp.shadowRoot.querySelector('.slds-combobox');
const isOpen = (cmp) => getCombobox(cmp).className.includes('slds-is-open');
const helpText = (cmp) =>
  cmp.shadowRoot.querySelector('.slds-form-element__help').textContent.trim();
const labels = (cmp) => getOptions(cmp).map((o) => o.textContent.trim());

const focusInput = (cmp) =>
  getInput(cmp).dispatchEvent(new FocusEvent('focus'));
const blurInput = (cmp, relatedTarget = null) =>
  getInput(cmp).dispatchEvent(
    new FocusEvent('focusout', { bubbles: true, relatedTarget })
  );
const pressKey = (cmp, key) =>
  getInput(cmp).dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
  );
const type = (cmp, text) => {
  const input = getInput(cmp);
  input.value = text;
  input.dispatchEvent(new CustomEvent('input'));
};

// A real mouse press: mousedown, which the component prevents to hold focus on
// the input, then click, which activates. Returns the mousedown.
const mouseSelect = (el, button = 0) => {
  const down = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    button
  });
  el.dispatchEvent(down);
  if (button === 0) {
    el.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true, button })
    );
  }
  return down;
};

// Assistive tech synthesises a bare click with no preceding mousedown.
const atActivate = (el) =>
  el.dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true })
  );

const open = async (cmp) => {
  focusInput(cmp);
  getInput(cmp).dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true })
  );
  await Promise.resolve();
};

describe('c-multiselect-combobox', () => {
  let warn;

  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe('selecting', () => {
    it('renders a multiselectable listbox of options', async () => {
      const cmp = initCmp();
      await open(cmp);

      expect(getOptions(cmp).length).toBe(OPTIONS.length);
      expect(
        cmp.shadowRoot
          .querySelector('[role="listbox"]')
          .getAttribute('aria-multiselectable')
      ).toBe('true');
      expect(getInput(cmp).getAttribute('role')).toBe('combobox');
      expect(getInput(cmp).getAttribute('aria-expanded')).toBe('true');
    });

    it('toggles with the mouse, holds focus, and stays open', async () => {
      const cmp = initCmp();
      const handler = jest.fn();
      cmp.addEventListener('selected', handler);
      await open(cmp);

      // preventDefault on mousedown is what keeps the input focused, and so
      // what keeps aria-activedescendant live
      expect(mouseSelect(getOptions(cmp)[0]).defaultPrevented).toBe(true);
      mouseSelect(getOptions(cmp)[1]);
      await Promise.resolve();

      expect(cmp.value).toEqual(['Account', 'Report']);
      expect(handler.mock.calls[1][0].detail).toEqual(['Account', 'Report']);
      expect(getOptions(cmp)[0].getAttribute('aria-selected')).toBe('true');
      expect(isOpen(cmp)).toBe(true);

      mouseSelect(getOptions(cmp)[0]);
      await Promise.resolve();
      expect(cmp.value).toEqual(['Report']);
    });

    it('selects from a bare click, keeping the filter and the dropdown', async () => {
      const cmp = initCmp();
      await open(cmp);
      type(cmp, 'cont');
      await Promise.resolve();

      // the real assistive-tech sequence: focus leaves the input first, so
      // focusout closes the dropdown, and only then does the click land
      blurInput(cmp);
      await Promise.resolve();
      atActivate(getOptions(cmp)[0]);
      await Promise.resolve();

      expect(cmp.value).toEqual(['Contact']);
      expect(getInput(cmp).value).toBe('cont');
      expect(isOpen(cmp)).toBe(true);
    });

    it('ignores a right click', async () => {
      const cmp = initCmp();
      await open(cmp);

      const down = mouseSelect(getOptions(cmp)[0], 2);
      await Promise.resolve();

      expect(cmp.value).toEqual([]);
      expect(down.defaultPrevented).toBe(false);
    });
  });

  describe('keyboard', () => {
    it('walks the options with the arrows and Home/End, wrapping', async () => {
      const cmp = initCmp();
      const activeId = () =>
        getInput(cmp).getAttribute('aria-activedescendant');

      focusInput(cmp);
      pressKey(cmp, 'ArrowDown');
      await Promise.resolve();
      expect(activeId()).toBe(getOptions(cmp)[0].id);

      pressKey(cmp, 'ArrowUp');
      await Promise.resolve();
      expect(activeId()).toBe(getOptions(cmp)[OPTIONS.length - 1].id);

      pressKey(cmp, 'Home');
      await Promise.resolve();
      expect(activeId()).toBe(getOptions(cmp)[0].id);

      pressKey(cmp, 'End');
      await Promise.resolve();
      expect(activeId()).toBe(getOptions(cmp)[OPTIONS.length - 1].id);
    });

    it('toggles with Enter without closing, and Escape closes but keeps the term', async () => {
      const cmp = initCmp();
      await open(cmp);
      type(cmp, 'cont');
      await Promise.resolve();

      pressKey(cmp, 'Enter');
      await Promise.resolve();
      expect(cmp.value).toEqual(['Contact']);
      expect(isOpen(cmp)).toBe(true);

      pressKey(cmp, 'Escape');
      await Promise.resolve();
      expect(isOpen(cmp)).toBe(false);
      expect(getInput(cmp).value).toBe('cont');
      expect(getInput(cmp).hasAttribute('aria-activedescendant')).toBe(false);
    });
  });

  describe('filtering', () => {
    it('narrows the list and exposes an empty state as an option', async () => {
      const cmp = initCmp();
      await open(cmp);

      type(cmp, 'cont');
      await Promise.resolve();
      expect(labels(cmp)).toEqual(['Contacts']);

      type(cmp, 'zzz');
      await Promise.resolve();
      expect(getOptions(cmp).length).toBe(0);
      const empty = cmp.shadowRoot.querySelector('[role="option"]');
      expect(empty.textContent.trim()).toBe('No matches found.');
      expect(empty.getAttribute('aria-disabled')).toBe('true');
    });

    it('moves aria-activedescendant when the filter changes the active option', async () => {
      const cmp = initCmp();
      await open(cmp);
      const activeId = () =>
        getInput(cmp).getAttribute('aria-activedescendant');

      type(cmp, 'o');
      await Promise.resolve();
      const first = activeId();
      expect(labels(cmp)[0]).toBe('Accounts');

      type(cmp, 'or');
      await Promise.resolve();
      expect(labels(cmp)[0]).toBe('Reports');
      // ids keyed to the filtered index would leave this unchanged, so nothing
      // would be announced
      expect(activeId()).not.toBe(first);
    });

    it('announces the result count', async () => {
      const cmp = initCmp();
      const status = () =>
        cmp.shadowRoot.querySelector('[role="status"]').textContent.trim();
      await open(cmp);
      expect(status()).toBe('4 results available.');

      type(cmp, 'cont');
      await Promise.resolve();
      expect(status()).toBe('1 result available.');

      type(cmp, 'zzz');
      await Promise.resolve();
      expect(status()).toBe('No matches found.');
    });
  });

  it('shows the summary when blurred and a search box when focused', async () => {
    const cmp = initCmp({ value: ['Account'] });
    await Promise.resolve();
    expect(getInput(cmp).value).toBe('Accounts');

    cmp.value = ['Account', 'Report'];
    await Promise.resolve();
    expect(getInput(cmp).value).toBe('2 Options Selected');

    focusInput(cmp);
    await Promise.resolve();
    expect(getInput(cmp).value).toBe('');
    expect(getInput(cmp).placeholder).toBe('2 Options Selected');

    blurInput(cmp);
    await Promise.resolve();
    expect(getInput(cmp).value).toBe('2 Options Selected');
  });

  describe('validity', () => {
    it('reports a required field with aria state and a persistent live region', async () => {
      const cmp = initCmp({ required: true });
      await Promise.resolve();

      // the live region must already be in the tree, or nothing is announced
      expect(
        cmp.shadowRoot.querySelector('.slds-form-element__help')
      ).not.toBeNull();
      expect(helpText(cmp)).toBe('');
      expect(getInput(cmp).getAttribute('aria-required')).toBe('true');
      expect(getInput(cmp).getAttribute('aria-invalid')).toBe('false');

      expect(cmp.reportValidity()).toBe(false);
      await Promise.resolve();

      expect(helpText(cmp)).toBe('Complete this field.');
      expect(getInput(cmp).getAttribute('aria-invalid')).toBe('true');
      expect(
        cmp.shadowRoot.querySelector('.slds-form-element').className
      ).toEqual(expect.stringContaining('slds-has-error'));
    });

    it('treats min as required and re-reports as the count crosses it', async () => {
      const cmp = initCmp({ min: 2 });
      await Promise.resolve();
      expect(getInput(cmp).getAttribute('aria-required')).toBe('true');
      expect(cmp.shadowRoot.querySelector('.slds-required')).not.toBeNull();

      await open(cmp);
      mouseSelect(getOptions(cmp)[0]);
      await Promise.resolve();
      expect(helpText(cmp)).toBe('Select at least 2 options.');

      mouseSelect(getOptions(cmp)[1]);
      await Promise.resolve();
      expect(helpText(cmp)).toBe('');

      // dropping back below min must report again, not stay silent
      mouseSelect(getOptions(cmp)[1]);
      await Promise.resolve();
      expect(helpText(cmp)).toBe('Select at least 2 options.');
    });

    it('blocks unselected options at max', async () => {
      const cmp = initCmp({ max: 2, value: ['Account', 'Report'] });
      await open(cmp);

      const [accounts, , contacts] = getOptions(cmp);
      expect(contacts.getAttribute('aria-disabled')).toBe('true');

      mouseSelect(contacts);
      await Promise.resolve();
      expect(cmp.value).toEqual(['Account', 'Report']);

      // already-selected options still toggle off
      mouseSelect(accounts);
      await Promise.resolve();
      expect(cmp.value).toEqual(['Report']);
    });

    it('lets setCustomValidity win and clear', () => {
      const cmp = initCmp({ value: ['Account'] });

      cmp.setCustomValidity('nope');
      expect(cmp.checkValidity()).toBe(false);
      cmp.reportValidity();
      expect(helpText(cmp)).toBe('');

      cmp.setCustomValidity('');
      expect(cmp.checkValidity()).toBe(true);
    });

    it('reconciles a contradictory min and max instead of deadlocking', async () => {
      const brick = initCmp({ max: 0 });
      await open(brick);
      expect(
        getOptions(brick).every(
          (o) => o.getAttribute('aria-disabled') === 'false'
        )
      ).toBe(true);

      const clamped = initCmp({ min: 3, max: 2 });
      await open(clamped);
      mouseSelect(getOptions(clamped)[0]);
      mouseSelect(getOptions(clamped)[1]);
      await Promise.resolve();
      expect(clamped.checkValidity()).toBe(true);
      expect(warn).toHaveBeenCalled();
    });

    it('reports overflow when value is set past max programmatically', () => {
      const cmp = initCmp({ max: 2, value: ['Account', 'Report', 'Contact'] });
      expect(cmp.validity.rangeOverflow).toBe(true);
      expect(cmp.checkValidity()).toBe(false);
    });
  });

  describe('input sanitising', () => {
    it('drops empty and duplicate options rather than throwing', async () => {
      const cmp = createElement('c-multiselect-combobox', {
        is: MultiselectCombobox
      });

      // a setter throwing here would take the consumer's render down with it
      expect(() => {
        cmp.options = [
          { label: 'Accounts', value: 'Account' },
          null,
          { label: 'No value here' },
          { label: 'Accounts again', value: 'Account' }
        ];
      }).not.toThrow();

      document.body.appendChild(cmp);
      await open(cmp);
      expect(getOptions(cmp).length).toBe(1);
      expect(warn).toHaveBeenCalled();
    });

    it('dedupes values and does not leak the options array', () => {
      const cmp = initCmp({ value: ['Account', 'Account', 'Report'] });
      expect(cmp.value).toEqual(['Account', 'Report']);

      cmp.options.push({ label: 'Injected', value: 'X' });
      expect(cmp.options.length).toBe(OPTIONS.length);
    });

    it('keeps a selection that is no longer in options deselectable', async () => {
      const cmp = initCmp({ value: ['GHOST'], max: 1 });
      await open(cmp);

      const orphan = getOptions(cmp).find(
        (o) => o.textContent.trim() === 'GHOST'
      );
      expect(orphan.getAttribute('aria-selected')).toBe('true');

      mouseSelect(orphan);
      await Promise.resolve();
      expect(cmp.value).toEqual([]);
    });
  });

  describe('swapping the options list', () => {
    const OTHER = [
      { label: 'Dogs', value: 'dogs' },
      { label: 'Cats', value: 'cats' }
    ];

    it('resets and tells the consumer when a new list arrives', async () => {
      const cmp = initCmp({ showPills: true, value: ['Account', 'Report'] });
      const handler = jest.fn();
      cmp.addEventListener('selected', handler);
      await open(cmp);
      type(cmp, 'cont');
      await Promise.resolve();

      cmp.options = OTHER;
      await Promise.resolve();

      expect(cmp.value).toEqual([]);
      expect(labels(cmp)).toEqual(['Dogs', 'Cats']);
      expect(getPillsCmp(cmp)).toBeNull();
      expect(isOpen(cmp)).toBe(false);
      expect(getInput(cmp).value).toBe('');
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].detail).toEqual([]);
    });

    it('keeps the value when options merely arrive late', async () => {
      const cmp = createElement('c-multiselect-combobox', {
        is: MultiselectCombobox
      });
      // a wire commonly resolves after value is assigned
      cmp.value = ['Account'];
      document.body.appendChild(cmp);
      await Promise.resolve();

      cmp.options = OPTIONS;
      await Promise.resolve();
      expect(cmp.value).toEqual(['Account']);
    });

    it('does not reset for an equivalent list', async () => {
      const cmp = initCmp({ value: ['Account'] });
      const handler = jest.fn();
      cmp.addEventListener('selected', handler);
      await Promise.resolve();

      cmp.options = OPTIONS.map((o) => ({ ...o }));
      await Promise.resolve();

      expect(cmp.value).toEqual(['Account']);
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('pills', () => {
    it('renders only with show-pills and a selection, labelled by field', async () => {
      const cmp = initCmp({ value: ['Account'] });
      await Promise.resolve();
      expect(getPillsCmp(cmp)).toBeNull();

      cmp.showPills = true;
      await Promise.resolve();
      expect(getPillsCmp(cmp).items).toEqual([
        { value: 'Account', label: 'Accounts' }
      ]);
      expect(getPillsCmp(cmp).label).toBe('Selected Relate To');

      cmp.value = [];
      await Promise.resolve();
      expect(getPillsCmp(cmp)).toBeNull();
    });

    it('removes through the child, preserving non-string values', async () => {
      const cmp = initCmp({
        options: [
          { label: 'One', value: 1 },
          { label: 'Two', value: 2 }
        ],
        value: [1, 2],
        showPills: true
      });
      await Promise.resolve();

      // dataset stringifies, so passing the value back would never match
      mouseSelect(
        getPillsCmp(cmp).shadowRoot.querySelector('.slds-pill__remove')
      );
      await Promise.resolve();
      expect(cmp.value).toEqual([2]);
    });

    it('takes focus back when the keyboard empties the row', async () => {
      const cmp = initCmp({ showPills: true, value: ['Account'] });
      await Promise.resolve();

      getPillsCmp(cmp).dispatchEvent(
        new CustomEvent('remove', {
          detail: { value: 'Account', viaKeyboard: true }
        })
      );
      await Promise.resolve();

      expect(getPillsCmp(cmp)).toBeNull();
      expect(cmp.shadowRoot.activeElement).toBe(getInput(cmp));
    });
  });
});
