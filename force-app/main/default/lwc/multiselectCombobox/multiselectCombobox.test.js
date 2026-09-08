import { createElement } from 'lwc';
import MultiselectCombobox from 'c/multiselectCombobox';

const OPTIONS = [
  { label: 'Accounts', value: 'Account' },
  { label: 'Reports', value: 'Report' },
  { label: 'Contacts', value: 'Contact' },
  { label: 'Files', value: 'File' }
];

const initCmp = (
  el,
  {
    label = 'Relate To',
    options = OPTIONS,
    value,
    showPills,
    required,
    min,
    max
  } = {}
) => {
  const cmp = createElement('c-multiselect-combobox', { is: el });

  cmp.label = label;
  cmp.options = options;
  if (value !== undefined) cmp.value = value;
  if (showPills !== undefined) cmp.showPills = showPills;
  if (required !== undefined) cmp.required = required;
  if (min !== undefined) cmp.min = min;
  if (max !== undefined) cmp.max = max;

  document.body.appendChild(cmp);
  return cmp;
};

const getInput = (cmp) => cmp.shadowRoot.querySelector('[data-input]');
const getOptions = (cmp) =>
  Array.from(cmp.shadowRoot.querySelectorAll('[role="option"][data-index]'));
const getPillsCmp = (cmp) =>
  cmp.shadowRoot.querySelector('c-multiselect-combobox-pills');
const getFormElement = (cmp) =>
  cmp.shadowRoot.querySelector('.slds-form-element');
const getCombobox = (cmp) => cmp.shadowRoot.querySelector('.slds-combobox');

const focusInput = (cmp) =>
  getInput(cmp).dispatchEvent(new FocusEvent('focus'));
const blurInput = (cmp, relatedTarget = null) =>
  getInput(cmp).dispatchEvent(
    new FocusEvent('focusout', { bubbles: true, relatedTarget })
  );
const clickInput = (cmp) =>
  getInput(cmp).dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true })
  );
const pressKey = (target, key) =>
  target.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
  );
const type = (cmp, text) => {
  const input = getInput(cmp);
  input.value = text;
  input.dispatchEvent(new CustomEvent('input'));
};
// A real mouse press: mousedown, which the component prevents to hold focus
// on the input, then click, which actually activates. Returns the mousedown
// so tests can assert the focus guard fired.
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
  clickInput(cmp);
  await Promise.resolve();
};

describe('c-multiselect-combobox', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('renders one option per entry on a multiselectable listbox', async () => {
    const cmp = initCmp(MultiselectCombobox);
    await open(cmp);

    expect(getOptions(cmp).length).toBe(OPTIONS.length);

    const listbox = cmp.shadowRoot.querySelector('[role="listbox"]');
    expect(listbox.getAttribute('aria-multiselectable')).toBe('true');
    expect(getInput(cmp).getAttribute('role')).toBe('combobox');
    expect(getInput(cmp).getAttribute('aria-expanded')).toBe('true');
  });

  it('selects an option on click and fires selected with an array', async () => {
    const cmp = initCmp(MultiselectCombobox);
    const handler = jest.fn();
    cmp.addEventListener('selected', handler);

    await open(cmp);
    mouseSelect(getOptions(cmp)[0]);
    await Promise.resolve();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].detail).toEqual(['Account']);

    const option = getOptions(cmp)[0];
    expect(option.getAttribute('aria-selected')).toBe('true');
    // aria-checked deliberately absent: duplicates aria-selected on role=option
    expect(option.hasAttribute('aria-checked')).toBe(false);
    expect(option.className).toEqual(
      expect.stringContaining('slds-is-selected')
    );
  });

  it('selects from a bare click, as assistive tech synthesises it', async () => {
    const cmp = initCmp(MultiselectCombobox);
    await open(cmp);

    // no mousedown at all, which is what NVDA browse-mode Enter produces
    atActivate(getOptions(cmp)[0]);
    await Promise.resolve();

    expect(cmp.value).toEqual(['Account']);
  });

  it('prevents mousedown default so the input keeps focus', async () => {
    const cmp = initCmp(MultiselectCombobox);
    await open(cmp);

    const down = mouseSelect(getOptions(cmp)[0]);
    expect(down.defaultPrevented).toBe(true);
  });

  it('ignores a right click on an option', async () => {
    const cmp = initCmp(MultiselectCombobox);
    await open(cmp);

    const down = mouseSelect(getOptions(cmp)[0], 2);
    await Promise.resolve();

    expect(cmp.value).toEqual([]);
    // and the context menu is left alone
    expect(down.defaultPrevented).toBe(false);
  });

  it('exposes required and invalid state to assistive tech', async () => {
    const cmp = initCmp(MultiselectCombobox, { required: true });
    await Promise.resolve();
    expect(getInput(cmp).getAttribute('aria-required')).toBe('true');
    expect(getInput(cmp).getAttribute('aria-invalid')).toBe('false');

    cmp.reportValidity();
    await Promise.resolve();
    expect(getInput(cmp).getAttribute('aria-invalid')).toBe('true');
  });

  it('keeps the error live region in the tree while it is empty', async () => {
    const cmp = initCmp(MultiselectCombobox, { required: true });
    await Promise.resolve();

    const help = cmp.shadowRoot.querySelector('.slds-form-element__help');
    expect(help).not.toBeNull();
    expect(help.textContent.trim()).toBe('');
    expect(getInput(cmp).getAttribute('aria-describedby')).toBe(help.id);
  });

  it('announces the result count while filtering', async () => {
    const cmp = initCmp(MultiselectCombobox);
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

  it('exposes the empty state as an option, not presentation', async () => {
    const cmp = initCmp(MultiselectCombobox);
    await open(cmp);
    type(cmp, 'zzz');
    await Promise.resolve();

    const empty = cmp.shadowRoot.querySelector('[role="option"]');
    expect(empty.textContent.trim()).toBe('No matches found.');
    expect(empty.getAttribute('aria-disabled')).toBe('true');
  });

  it('keeps the typed term when the dropdown closes', async () => {
    const cmp = initCmp(MultiselectCombobox);
    await open(cmp);

    type(cmp, 'cont');
    await Promise.resolve();

    pressKey(getInput(cmp), 'Escape');
    await Promise.resolve();
    expect(getInput(cmp).value).toBe('cont');

    // and refocusing starts clean
    focusInput(cmp);
    await Promise.resolve();
    expect(getInput(cmp).value).toBe('');
  });

  it('restores the summary when focus moves to the pills', async () => {
    const cmp = initCmp(MultiselectCombobox, {
      showPills: true,
      value: ['Account', 'Report']
    });
    await Promise.resolve();

    focusInput(cmp);
    await Promise.resolve();
    expect(getInput(cmp).value).toBe('');

    blurInput(cmp, getPillsCmp(cmp));
    await Promise.resolve();
    expect(getInput(cmp).value).toBe('2 Options Selected');
  });

  it('stays open after a selection', async () => {
    const cmp = initCmp(MultiselectCombobox);
    await open(cmp);

    mouseSelect(getOptions(cmp)[0]);
    await Promise.resolve();
    mouseSelect(getOptions(cmp)[1]);
    await Promise.resolve();

    expect(getCombobox(cmp).className).toEqual(
      expect.stringContaining('slds-is-open')
    );
    expect(cmp.value).toEqual(['Account', 'Report']);
  });

  it('summarises the selection on initial render', async () => {
    const cmp = initCmp(MultiselectCombobox);
    expect(getInput(cmp).value).toBe('');

    cmp.value = ['Account'];
    await Promise.resolve();
    expect(getInput(cmp).value).toBe('Accounts');

    cmp.value = ['Account', 'Report'];
    await Promise.resolve();
    expect(getInput(cmp).value).toBe('2 Options Selected');
  });

  it('swaps the summary for an empty search box on focus', async () => {
    const cmp = initCmp(MultiselectCombobox, { value: ['Account', 'Report'] });
    await Promise.resolve();
    expect(getInput(cmp).value).toBe('2 Options Selected');

    focusInput(cmp);
    await Promise.resolve();
    expect(getInput(cmp).value).toBe('');
    // the summary survives as the placeholder
    expect(getInput(cmp).placeholder).toBe('2 Options Selected');

    blurInput(cmp);
    await Promise.resolve();
    expect(getInput(cmp).value).toBe('2 Options Selected');
  });

  it('filters options as the user types', async () => {
    const cmp = initCmp(MultiselectCombobox);
    await open(cmp);

    type(cmp, 'cont');
    await Promise.resolve();

    const labels = getOptions(cmp).map((o) => o.textContent.trim());
    expect(labels).toEqual(['Contacts']);

    type(cmp, 'zzz');
    await Promise.resolve();

    expect(getOptions(cmp).length).toBe(0);
    expect(cmp.shadowRoot.textContent).toEqual(
      expect.stringContaining('No matches found.')
    );
  });

  it('moves aria-activedescendant with the arrow keys and wraps', async () => {
    const cmp = initCmp(MultiselectCombobox);
    const input = getInput(cmp);

    focusInput(cmp);
    pressKey(input, 'ArrowDown');
    await Promise.resolve();
    expect(input.getAttribute('aria-activedescendant')).toBe(
      getOptions(cmp)[0].id
    );

    pressKey(input, 'ArrowUp');
    await Promise.resolve();
    expect(input.getAttribute('aria-activedescendant')).toBe(
      getOptions(cmp)[OPTIONS.length - 1].id
    );

    pressKey(input, 'ArrowDown');
    await Promise.resolve();
    expect(input.getAttribute('aria-activedescendant')).toBe(
      getOptions(cmp)[0].id
    );
  });

  it('toggles with Enter without closing, and Escape closes', async () => {
    const cmp = initCmp(MultiselectCombobox);
    const input = getInput(cmp);

    focusInput(cmp);
    pressKey(input, 'ArrowDown');
    pressKey(input, 'Enter');
    await Promise.resolve();

    expect(cmp.value).toEqual(['Account']);
    expect(getCombobox(cmp).className).toEqual(
      expect.stringContaining('slds-is-open')
    );

    pressKey(input, 'Escape');
    await Promise.resolve();

    expect(getCombobox(cmp).className).not.toEqual(
      expect.stringContaining('slds-is-open')
    );
    expect(input.hasAttribute('aria-activedescendant')).toBe(false);
  });

  it('blocks unselected options at max', async () => {
    const cmp = initCmp(MultiselectCombobox, {
      max: 2,
      value: ['Account', 'Report']
    });
    await open(cmp);

    const [accounts, , contacts] = getOptions(cmp);
    expect(contacts.getAttribute('aria-disabled')).toBe('true');

    mouseSelect(contacts);
    await Promise.resolve();
    expect(cmp.value).toEqual(['Account', 'Report']);

    // already selected options still toggle off
    mouseSelect(accounts);
    await Promise.resolve();
    expect(cmp.value).toEqual(['Report']);
  });

  describe('constraint configuration', () => {
    let warn;
    beforeEach(() => {
      warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });
    afterEach(() => warn.mockRestore());

    it('ignores a max below 1 instead of bricking the field', async () => {
      const cmp = initCmp(MultiselectCombobox, { max: 0 });
      await open(cmp);

      expect(
        getOptions(cmp).every(
          (o) => o.getAttribute('aria-disabled') === 'false'
        )
      ).toBe(true);

      mouseSelect(getOptions(cmp)[0]);
      await Promise.resolve();
      expect(cmp.value).toEqual(['Account']);
      expect(warn).toHaveBeenCalled();
    });

    it('clamps a min that exceeds max so validity is satisfiable', async () => {
      const cmp = initCmp(MultiselectCombobox, { min: 3, max: 2 });
      await open(cmp);

      mouseSelect(getOptions(cmp)[0]);
      mouseSelect(getOptions(cmp)[1]);
      await Promise.resolve();

      expect(cmp.value.length).toBe(2);
      expect(cmp.checkValidity()).toBe(true);
      expect(warn).toHaveBeenCalled();
    });

    it('ignores an unparseable max and says so', () => {
      const cmp = initCmp(MultiselectCombobox, { max: 'abc' });
      expect(cmp.max).toBeUndefined();
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('max="abc"'));
    });

    it('warns and falls back on a bad variant rather than throwing', () => {
      const cmp = createElement('c-multiselect-combobox', {
        is: MultiselectCombobox
      });
      expect(() => {
        cmp.variant = 'label-above';
      }).not.toThrow();
      expect(cmp.variant).toBe('standard');
      expect(warn).toHaveBeenCalled();
    });

    it('drops duplicate option values', async () => {
      const cmp = initCmp(MultiselectCombobox, {
        options: [
          { label: 'Accounts', value: 'Account' },
          { label: 'Accounts again', value: 'Account' }
        ]
      });
      await open(cmp);

      expect(getOptions(cmp).length).toBe(1);
      expect(warn).toHaveBeenCalled();
    });

    it('reports overflow when value is set past max programmatically', () => {
      const cmp = initCmp(MultiselectCombobox, {
        max: 2,
        value: ['Account', 'Report', 'Contact']
      });

      expect(cmp.validity.rangeOverflow).toBe(true);
      expect(cmp.checkValidity()).toBe(false);
      cmp.reportValidity();
      expect(cmp.validity.valid).toBe(false);
    });
  });

  it('dedupes values assigned through the public setter', () => {
    const cmp = initCmp(MultiselectCombobox, {
      value: ['Account', 'Account', 'Report']
    });
    expect(cmp.value).toEqual(['Account', 'Report']);
  });

  it('keeps a selection that is no longer in options deselectable', async () => {
    const cmp = initCmp(MultiselectCombobox, { value: ['GHOST'], max: 1 });
    await open(cmp);

    // the orphan is rendered so it can be removed, and it is not dropped
    expect(cmp.value).toEqual(['GHOST']);
    const orphan = getOptions(cmp).find(
      (o) => o.textContent.trim() === 'GHOST'
    );
    expect(orphan).toBeDefined();
    expect(orphan.getAttribute('aria-selected')).toBe('true');

    mouseSelect(orphan);
    await Promise.resolve();
    expect(cmp.value).toEqual([]);
  });

  it('does not leak the internal options array', () => {
    const cmp = initCmp(MultiselectCombobox);
    cmp.options.push({ label: 'Injected', value: 'X' });
    expect(cmp.options.length).toBe(OPTIONS.length);
  });

  it('ignores interaction while disabled', async () => {
    const cmp = createElement('c-multiselect-combobox', {
      is: MultiselectCombobox
    });
    cmp.options = OPTIONS;
    cmp.disabled = true;
    document.body.appendChild(cmp);

    clickInput(cmp);
    await Promise.resolve();
    expect(getCombobox(cmp).className).not.toEqual(
      expect.stringContaining('slds-is-open')
    );
    expect(getInput(cmp).disabled).toBe(true);
  });

  it('moves the highlight to first and last with Home and End', async () => {
    const cmp = initCmp(MultiselectCombobox);
    const input = getInput(cmp);

    focusInput(cmp);
    pressKey(input, 'ArrowDown');
    pressKey(input, 'End');
    await Promise.resolve();
    expect(input.getAttribute('aria-activedescendant')).toBe(
      getOptions(cmp)[OPTIONS.length - 1].id
    );

    pressKey(input, 'Home');
    await Promise.resolve();
    expect(input.getAttribute('aria-activedescendant')).toBe(
      getOptions(cmp)[0].id
    );
  });

  it('renders the empty state when options is empty', async () => {
    const cmp = initCmp(MultiselectCombobox, { options: [] });
    await open(cmp);

    expect(getOptions(cmp).length).toBe(0);
    const empty = cmp.shadowRoot.querySelector('[role="option"]');
    expect(empty.textContent.trim()).toBe('No matches found.');
  });

  it('survives options changing while the dropdown is open', async () => {
    const cmp = initCmp(MultiselectCombobox);
    const input = getInput(cmp);

    focusInput(cmp);
    pressKey(input, 'ArrowDown');
    pressKey(input, 'End');
    await Promise.resolve();

    cmp.options = [{ label: 'Only', value: 'Only' }];
    await Promise.resolve();

    // the stale activeIndex must not point at a missing option
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
    pressKey(input, 'Enter');
    await Promise.resolve();
    expect(cmp.value).toEqual([]);
  });

  it('clears a custom validity when set back to empty', () => {
    const cmp = initCmp(MultiselectCombobox, { value: ['Account'] });

    cmp.setCustomValidity('nope');
    expect(cmp.checkValidity()).toBe(false);

    cmp.setCustomValidity('');
    expect(cmp.checkValidity()).toBe(true);
  });

  it('keeps the filter applied across a mouse selection', async () => {
    const cmp = initCmp(MultiselectCombobox);
    await open(cmp);

    type(cmp, 'cont');
    await Promise.resolve();
    expect(getOptions(cmp).length).toBe(1);

    mouseSelect(getOptions(cmp)[0]);
    await Promise.resolve();

    expect(cmp.value).toEqual(['Contact']);
    expect(getOptions(cmp).length).toBe(1);
    expect(getInput(cmp).value).toBe('cont');
  });

  it('keeps the filter and the dropdown across an assistive-tech selection', async () => {
    const cmp = initCmp(MultiselectCombobox);
    await open(cmp);

    type(cmp, 'cont');
    await Promise.resolve();

    // the real AT sequence: focus leaves the input first, so focusout closes
    // the dropdown, and only then does the synthesised click land
    blurInput(cmp);
    await Promise.resolve();
    atActivate(getOptions(cmp)[0]);
    await Promise.resolve();

    expect(cmp.value).toEqual(['Contact']);
    expect(getInput(cmp).value).toBe('cont');
    expect(getOptions(cmp).length).toBe(1);
    expect(getCombobox(cmp).className).toEqual(
      expect.stringContaining('slds-is-open')
    );
  });

  it('routes a real pill removal through the child component', async () => {
    const cmp = initCmp(MultiselectCombobox, {
      showPills: true,
      value: ['Account', 'Report']
    });
    await Promise.resolve();

    // drive the actual child, not a synthesised event on the host
    const pills = getPillsCmp(cmp);
    const remove = pills.shadowRoot.querySelector('.slds-pill__remove');
    mouseSelect(remove);
    await Promise.resolve();

    expect(cmp.value).toEqual(['Report']);
    expect(pills.shadowRoot.querySelectorAll('[data-pill-index]').length).toBe(
      1
    );
  });

  it('treats min as making the field required', async () => {
    const cmp = initCmp(MultiselectCombobox, { min: 2 });
    await Promise.resolve();

    expect(cmp.isRequired).toBe(true);
    expect(getInput(cmp).getAttribute('aria-required')).toBe('true');
    expect(cmp.shadowRoot.querySelector('.slds-required')).not.toBeNull();
  });

  it('changes aria-activedescendant when the filter changes the active option', async () => {
    const cmp = initCmp(MultiselectCombobox);
    const input = getInput(cmp);
    await open(cmp);

    type(cmp, 'o');
    await Promise.resolve();
    const first = input.getAttribute('aria-activedescendant');
    expect(getOptions(cmp)[0].textContent.trim()).toBe('Accounts');

    type(cmp, 'or');
    await Promise.resolve();
    expect(getOptions(cmp)[0].textContent.trim()).toBe('Reports');

    // ids keyed to the filtered index would leave this string unchanged, so
    // nothing would be announced
    expect(input.getAttribute('aria-activedescendant')).not.toBe(first);
  });

  it('survives null and value-less entries in options', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const cmp = createElement('c-multiselect-combobox', {
      is: MultiselectCombobox
    });

    expect(() => {
      cmp.options = [
        { label: 'Accounts', value: 'Account' },
        null,
        { label: 'No value here' },
        undefined
      ];
    }).not.toThrow();

    document.body.appendChild(cmp);
    await open(cmp);

    expect(getOptions(cmp).length).toBe(1);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('removes a pill whose value is not a string', async () => {
    const cmp = initCmp(MultiselectCombobox, {
      options: [
        { label: 'One', value: 1 },
        { label: 'Two', value: 2 }
      ],
      value: [1, 2],
      showPills: true
    });
    await Promise.resolve();

    const pills = getPillsCmp(cmp);
    mouseSelect(pills.shadowRoot.querySelector('.slds-pill__remove'));
    await Promise.resolve();

    // dataset stringifies, so passing the value back would never match
    expect(cmp.value).toEqual([2]);
  });

  it('gives the pills row a label that names the field', async () => {
    const cmp = initCmp(MultiselectCombobox, {
      showPills: true,
      value: ['Account']
    });
    await Promise.resolve();

    expect(getPillsCmp(cmp).label).toBe('Selected Relate To');
  });

  it('reports a required field as invalid', async () => {
    const cmp = initCmp(MultiselectCombobox, { required: true });

    expect(cmp.checkValidity()).toBe(false);
    expect(cmp.reportValidity()).toBe(false);
    await Promise.resolve();

    expect(getFormElement(cmp).className).toEqual(
      expect.stringContaining('slds-has-error')
    );
    const help = cmp.shadowRoot.querySelector('.slds-form-element__help');
    expect(help.textContent.trim()).toBe('Complete this field.');
    expect(getInput(cmp).getAttribute('aria-describedby')).toBe(help.id);
  });

  it('enforces min and lets setCustomValidity win', async () => {
    const cmp = initCmp(MultiselectCombobox, { min: 2, value: ['Account'] });

    expect(cmp.validity.rangeUnderflow).toBe(true);
    cmp.reportValidity();
    await Promise.resolve();
    expect(
      cmp.shadowRoot
        .querySelector('.slds-form-element__help')
        .textContent.trim()
    ).toBe('Select at least 2 options.');

    cmp.setCustomValidity('nope');
    expect(cmp.checkValidity()).toBe(false);
    cmp.reportValidity();
    await Promise.resolve();
    expect(
      cmp.shadowRoot
        .querySelector('.slds-form-element__help')
        .textContent.trim()
    ).toBe('nope');
  });

  it('hands the selected items to the pills child', async () => {
    const cmp = initCmp(MultiselectCombobox, {
      showPills: true,
      value: ['Account', 'Report']
    });
    await Promise.resolve();

    expect(getPillsCmp(cmp).items).toEqual([
      { value: 'Account', label: 'Accounts' },
      { value: 'Report', label: 'Reports' }
    ]);
  });

  it('omits the pills child until there is something to show', async () => {
    const cmp = initCmp(MultiselectCombobox, { showPills: true });
    await Promise.resolve();
    expect(getPillsCmp(cmp)).toBeNull();

    cmp.value = ['Account'];
    await Promise.resolve();
    expect(getPillsCmp(cmp)).not.toBeNull();
  });

  it('never renders pills without show-pills', async () => {
    const cmp = initCmp(MultiselectCombobox, { value: ['Account'] });
    await Promise.resolve();
    expect(getPillsCmp(cmp)).toBeNull();
  });

  it('removes a value when the pills child reports a removal', async () => {
    const cmp = initCmp(MultiselectCombobox, {
      showPills: true,
      value: ['Account', 'Report']
    });
    const handler = jest.fn();
    cmp.addEventListener('selected', handler);
    await Promise.resolve();

    getPillsCmp(cmp).dispatchEvent(
      new CustomEvent('remove', {
        detail: { value: 'Account', viaKeyboard: false }
      })
    );
    await Promise.resolve();

    expect(cmp.value).toEqual(['Report']);
    expect(handler.mock.calls[0][0].detail).toEqual(['Report']);
  });

  it('takes focus back when the keyboard empties the pill row', async () => {
    const cmp = initCmp(MultiselectCombobox, {
      showPills: true,
      value: ['Account']
    });
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
