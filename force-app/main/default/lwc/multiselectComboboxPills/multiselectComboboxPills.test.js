import { createElement } from 'lwc';
import MultiselectComboboxPills from 'c/multiselectComboboxPills';

const ITEMS = [
  { label: 'Accounts', value: 'Account' },
  { label: 'Reports', value: 'Report' },
  { label: 'Contacts', value: 'Contact' }
];

const initCmp = (el, { items = ITEMS } = {}) => {
  const cmp = createElement('c-multiselect-combobox-pills', { is: el });
  cmp.items = items;
  document.body.appendChild(cmp);
  return cmp;
};

const getPills = (cmp) =>
  Array.from(cmp.shadowRoot.querySelectorAll('[data-pill-index]'));
const tabindexes = (cmp) =>
  getPills(cmp).map((p) => p.getAttribute('tabindex'));
const pressKey = (target, key) =>
  target.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
  );
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
const atActivate = (el) =>
  el.dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true })
  );

describe('c-multiselect-combobox-pills', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('renders a horizontal listbox of pills', () => {
    const cmp = initCmp(MultiselectComboboxPills);

    const listbox = cmp.shadowRoot.querySelector('[role="listbox"]');
    expect(listbox.getAttribute('aria-orientation')).toBe('horizontal');
    expect(listbox.getAttribute('aria-label')).toBe('Selected Options');

    const pills = getPills(cmp);
    expect(pills.length).toBe(3);
    expect(pills[0].getAttribute('role')).toBe('option');
    expect(pills[0].getAttribute('aria-selected')).toBe('true');
  });

  it('describes the delete affordance on each pill, not the listbox', () => {
    const cmp = initCmp(MultiselectComboboxPills);

    // focus lands on the pill, and a description on an ancestor is not
    // announced to a focused descendant
    const listbox = cmp.shadowRoot.querySelector('[role="listbox"]');
    expect(listbox.hasAttribute('aria-describedby')).toBe(false);

    for (const pill of getPills(cmp)) {
      const help = cmp.shadowRoot.querySelector(
        `[id="${pill.getAttribute('aria-describedby')}"]`
      );
      expect(help.textContent.trim()).toBe(
        'Press delete or backspace to remove'
      );
    }
  });

  it('expands so wrapped pill rows are not clipped', () => {
    const cmp = initCmp(MultiselectComboboxPills);

    const group = cmp.shadowRoot.querySelector('.slds-listbox_selection-group');
    expect(group.className).toEqual(
      expect.stringContaining('slds-is-expanded')
    );
  });

  it('keeps the row to a single tab stop', () => {
    const cmp = initCmp(MultiselectComboboxPills);
    expect(tabindexes(cmp)).toEqual(['0', '-1', '-1']);
  });

  it('moves the roving tabindex with the arrow keys and wraps', async () => {
    const cmp = initCmp(MultiselectComboboxPills);

    pressKey(getPills(cmp)[0], 'ArrowRight');
    await Promise.resolve();
    expect(tabindexes(cmp)).toEqual(['-1', '0', '-1']);

    pressKey(getPills(cmp)[1], 'ArrowLeft');
    await Promise.resolve();
    expect(tabindexes(cmp)).toEqual(['0', '-1', '-1']);

    // wraps backwards off the first pill
    pressKey(getPills(cmp)[0], 'ArrowLeft');
    await Promise.resolve();
    expect(tabindexes(cmp)).toEqual(['-1', '-1', '0']);
  });

  it('fires remove from Delete and Backspace, flagged as keyboard', () => {
    const cmp = initCmp(MultiselectComboboxPills);
    const handler = jest.fn();
    cmp.addEventListener('remove', handler);

    pressKey(getPills(cmp)[1], 'Delete');
    expect(handler.mock.calls[0][0].detail).toEqual({
      value: 'Report',
      viaKeyboard: true
    });

    pressKey(getPills(cmp)[0], 'Backspace');
    expect(handler.mock.calls[1][0].detail).toEqual({
      value: 'Account',
      viaKeyboard: true
    });
  });

  it('fires remove from the icon, not flagged as keyboard', () => {
    const cmp = initCmp(MultiselectComboboxPills);
    const handler = jest.fn();
    cmp.addEventListener('remove', handler);

    mouseSelect(cmp.shadowRoot.querySelector('.slds-pill__remove'));

    expect(handler.mock.calls[0][0].detail).toEqual({
      value: 'Account',
      viaKeyboard: false
    });
  });

  it('removes from a bare click, as assistive tech synthesises it', () => {
    const cmp = initCmp(MultiselectComboboxPills);
    const handler = jest.fn();
    cmp.addEventListener('remove', handler);

    atActivate(cmp.shadowRoot.querySelector('.slds-pill__remove'));

    expect(handler.mock.calls[0][0].detail).toEqual({
      value: 'Account',
      viaKeyboard: false
    });
  });

  it('prevents mousedown default so the combobox input keeps focus', () => {
    const cmp = initCmp(MultiselectComboboxPills);
    const down = mouseSelect(
      cmp.shadowRoot.querySelector('.slds-pill__remove')
    );
    expect(down.defaultPrevented).toBe(true);
  });

  it('ignores a right click on the remove icon', () => {
    const cmp = initCmp(MultiselectComboboxPills);
    const handler = jest.fn();
    cmp.addEventListener('remove', handler);

    const down = mouseSelect(
      cmp.shadowRoot.querySelector('.slds-pill__remove'),
      2
    );

    expect(handler).not.toHaveBeenCalled();
    expect(down.defaultPrevented).toBe(false);
  });

  it('falls back to the previous pill when the last one is deleted', async () => {
    const cmp = initCmp(MultiselectComboboxPills);

    pressKey(getPills(cmp)[2], 'Delete');
    cmp.items = ITEMS.slice(0, 2);
    await Promise.resolve();

    expect(tabindexes(cmp)).toEqual(['-1', '0']);
  });

  it('keeps the index when a middle pill is deleted', async () => {
    const cmp = initCmp(MultiselectComboboxPills);

    pressKey(getPills(cmp)[0], 'Delete');
    cmp.items = ITEMS.slice(1);
    await Promise.resolve();

    expect(tabindexes(cmp)).toEqual(['0', '-1']);
  });

  it('actually moves focus, not just the tabindex', async () => {
    const cmp = initCmp(MultiselectComboboxPills);

    pressKey(getPills(cmp)[0], 'ArrowRight');
    await Promise.resolve();

    expect(cmp.shadowRoot.activeElement).toBe(getPills(cmp)[1]);
  });

  it('moves focus to the surviving pill after a delete', async () => {
    const cmp = initCmp(MultiselectComboboxPills);

    pressKey(getPills(cmp)[2], 'Delete');
    cmp.items = ITEMS.slice(0, 2);
    await Promise.resolve();

    expect(cmp.shadowRoot.activeElement).toBe(getPills(cmp)[1]);
  });

  it('does not grab focus when the parent declines the removal', async () => {
    const cmp = initCmp(MultiselectComboboxPills);

    // parent ignores the event, so items never change
    pressKey(getPills(cmp)[0], 'Delete');
    await Promise.resolve();

    expect(getPills(cmp).length).toBe(3);
    expect(cmp.shadowRoot.activeElement).toBeNull();

    // and the intent must not latch onto a later, unrelated update
    cmp.items = [...ITEMS, { label: 'Files', value: 'File' }];
    await Promise.resolve();
    expect(cmp.shadowRoot.activeElement).toBeNull();
  });

  it('focuses the current pill on demand', async () => {
    const cmp = initCmp(MultiselectComboboxPills);

    cmp.focus();
    await Promise.resolve();

    expect(cmp.shadowRoot.activeElement).toBe(getPills(cmp)[0]);
  });

  it('is inert when disabled', async () => {
    const cmp = initCmp(MultiselectComboboxPills);
    cmp.disabled = true;
    await Promise.resolve();

    expect(tabindexes(cmp)).toEqual(['-1', '-1', '-1']);

    const handler = jest.fn();
    cmp.addEventListener('remove', handler);

    mouseSelect(cmp.shadowRoot.querySelector('.slds-pill__remove'));
    pressKey(getPills(cmp)[0], 'Delete');
    pressKey(getPills(cmp)[0], 'ArrowRight');
    await Promise.resolve();

    expect(handler).not.toHaveBeenCalled();
    expect(tabindexes(cmp)).toEqual(['-1', '-1', '-1']);
    expect(cmp.shadowRoot.activeElement).toBeNull();
  });

  it('carries non-string values through the remove icon intact', () => {
    const cmp = initCmp(MultiselectComboboxPills, {
      items: [
        { label: 'One', value: 1 },
        { label: 'Two', value: 2 }
      ]
    });
    const handler = jest.fn();
    cmp.addEventListener('remove', handler);

    mouseSelect(cmp.shadowRoot.querySelectorAll('.slds-pill__remove')[1]);

    expect(handler.mock.calls[0][0].detail.value).toBe(2);
  });

  it('clamps the roving index when items shrink underneath it', async () => {
    const cmp = initCmp(MultiselectComboboxPills);

    pressKey(getPills(cmp)[0], 'ArrowLeft');
    await Promise.resolve();
    expect(tabindexes(cmp)).toEqual(['-1', '-1', '0']);

    cmp.items = ITEMS.slice(0, 1);
    await Promise.resolve();
    expect(tabindexes(cmp)).toEqual(['0']);
  });
});
