import { createElement } from 'lwc';
import MultiselectComboboxPills from 'c/multiselectComboboxPills';

const ITEMS = [
  { label: 'Accounts', value: 'Account' },
  { label: 'Reports', value: 'Report' },
  { label: 'Contacts', value: 'Contact' }
];

const initCmp = (items = ITEMS) => {
  const cmp = createElement('c-multiselect-combobox-pills', {
    is: MultiselectComboboxPills
  });
  cmp.items = items;
  document.body.appendChild(cmp);
  return cmp;
};

const getPills = (cmp) =>
  Array.from(cmp.shadowRoot.querySelectorAll('[data-pill-index]'));
const getRemovers = (cmp) =>
  Array.from(cmp.shadowRoot.querySelectorAll('.slds-pill__remove'));
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
    const cmp = initCmp();

    const listbox = cmp.shadowRoot.querySelector('[role="listbox"]');
    expect(listbox.getAttribute('aria-orientation')).toBe('horizontal');
    expect(listbox.getAttribute('aria-label')).toBe('Selected Options');
    expect(getPills(cmp).length).toBe(3);
    expect(getPills(cmp)[0].getAttribute('aria-selected')).toBe('true');
  });

  it('describes the delete affordance on each pill, not the listbox', () => {
    const cmp = initCmp();

    // focus lands on the pill, and a description on an ancestor is never
    // announced to a focused descendant
    expect(
      cmp.shadowRoot
        .querySelector('[role="listbox"]')
        .hasAttribute('aria-describedby')
    ).toBe(false);

    for (const pill of getPills(cmp)) {
      const help = cmp.shadowRoot.querySelector(
        `[id="${pill.getAttribute('aria-describedby')}"]`
      );
      expect(help.textContent.trim()).toBe(
        'Press delete or backspace to remove'
      );
    }
  });

  it('is one tab stop and moves real focus with the arrows, wrapping', async () => {
    const cmp = initCmp();
    expect(tabindexes(cmp)).toEqual(['0', '-1', '-1']);

    pressKey(getPills(cmp)[0], 'ArrowRight');
    await Promise.resolve();
    expect(tabindexes(cmp)).toEqual(['-1', '0', '-1']);
    expect(cmp.shadowRoot.activeElement).toBe(getPills(cmp)[1]);

    pressKey(getPills(cmp)[1], 'ArrowLeft');
    pressKey(getPills(cmp)[0], 'ArrowLeft');
    await Promise.resolve();
    expect(cmp.shadowRoot.activeElement).toBe(getPills(cmp)[2]);
  });

  it('removes with Delete and moves focus to the surviving pill', async () => {
    const cmp = initCmp();
    const handler = jest.fn();
    cmp.addEventListener('remove', handler);

    // deleting the last pill falls back to the previous one
    pressKey(getPills(cmp)[2], 'Delete');
    expect(handler.mock.calls[0][0].detail).toEqual({
      value: 'Contact',
      viaKeyboard: true
    });

    cmp.items = ITEMS.slice(0, 2);
    await Promise.resolve();
    expect(cmp.shadowRoot.activeElement).toBe(getPills(cmp)[1]);

    // deleting any other pill keeps the index, so the one sliding into place
    // takes focus
    pressKey(getPills(cmp)[0], 'Backspace');
    cmp.items = ITEMS.slice(1, 2);
    await Promise.resolve();
    expect(tabindexes(cmp)).toEqual(['0']);
  });

  it('removes from the icon by mouse and by bare click, ignoring right click', () => {
    const cmp = initCmp();
    const handler = jest.fn();
    cmp.addEventListener('remove', handler);

    // mousedown is prevented so the combobox input keeps focus
    expect(mouseSelect(getRemovers(cmp)[0]).defaultPrevented).toBe(true);
    expect(handler.mock.calls[0][0].detail).toEqual({
      value: 'Account',
      viaKeyboard: false
    });

    // assistive tech synthesises a click with no mousedown
    atActivate(getRemovers(cmp)[1]);
    expect(handler.mock.calls[1][0].detail.value).toBe('Report');

    const down = mouseSelect(getRemovers(cmp)[2], 2);
    expect(handler).toHaveBeenCalledTimes(2);
    expect(down.defaultPrevented).toBe(false);
  });

  it('carries non-string values through the remove icon intact', () => {
    const cmp = initCmp([
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 }
    ]);
    const handler = jest.fn();
    cmp.addEventListener('remove', handler);

    // dataset stringifies, so the index is what travels, not the value
    mouseSelect(getRemovers(cmp)[1]);
    expect(handler.mock.calls[0][0].detail.value).toBe(2);
  });

  it('does not grab focus when the parent declines the removal', async () => {
    const cmp = initCmp();

    pressKey(getPills(cmp)[0], 'Delete');
    await Promise.resolve();
    expect(getPills(cmp).length).toBe(3);
    expect(cmp.shadowRoot.activeElement).toBeNull();

    // and the intent must not latch onto a later, unrelated update
    cmp.items = [...ITEMS, { label: 'Files', value: 'File' }];
    await Promise.resolve();
    expect(cmp.shadowRoot.activeElement).toBeNull();
  });

  it('is inert when disabled', async () => {
    const cmp = initCmp();
    cmp.disabled = true;
    await Promise.resolve();

    const handler = jest.fn();
    cmp.addEventListener('remove', handler);

    mouseSelect(getRemovers(cmp)[0]);
    pressKey(getPills(cmp)[0], 'Delete');
    pressKey(getPills(cmp)[0], 'ArrowRight');
    await Promise.resolve();

    expect(handler).not.toHaveBeenCalled();
    expect(tabindexes(cmp)).toEqual(['-1', '-1', '-1']);
    expect(cmp.shadowRoot.activeElement).toBeNull();
  });

  it('clamps the roving index when items shrink underneath it', async () => {
    const cmp = initCmp();

    pressKey(getPills(cmp)[0], 'ArrowLeft');
    await Promise.resolve();
    expect(tabindexes(cmp)).toEqual(['-1', '-1', '0']);

    cmp.items = ITEMS.slice(0, 1);
    await Promise.resolve();
    expect(tabindexes(cmp)).toEqual(['0']);
  });
});
