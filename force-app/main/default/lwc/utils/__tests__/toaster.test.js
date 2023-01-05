import { toaster } from '../utils';

import { createElement, LightningElement } from 'lwc';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';

class Stub extends LightningElement {}

const flushPromises = () => {
  return Promise.resolve();
};

jest.spyOn(toaster, 'init');

describe('utils/toaster', () => {
  let cmp;
  let handler;

  beforeEach(() => {
    cmp = createElement('c-stub', { is: Stub });
    handler = jest.fn();

    cmp.addEventListener(ShowToastEventName, handler);
    toaster.init(cmp);
  });

  it('should be defined', () => {
    expect(toaster).toBeDefined();
  });

  describe('requirements', () => {
    it('should dispatch error toast', async () => {
      const expectedTitle = 'Guetta';
      const expectedMessage = 'this aint a heartbreak anthem';
      const expectedMode = 'sticky';
      const expectedVariant = 'error';

      toaster.error(expectedTitle, expectedMessage);
      await flushPromises();

      expect(handler).toHaveBeenCalledTimes(1);
      const { title, message, mode, variant } = handler.mock.calls[0][0].detail;

      expect(title).toBe(expectedTitle);
      expect(message).toBe(expectedMessage);
      expect(mode).toBe(expectedMode);
      expect(variant).toBe(expectedVariant);
    });

    it('should dispatch warning toast', async () => {
      const expectedTitle = 'Doja Cat';
      const expectedMessage = 'this aint a heartbreak anthem';
      const expectedMode = 'pester';
      const expectedVariant = 'warning';

      toaster.warning(expectedTitle, expectedMessage);
      await flushPromises();

      expect(handler).toHaveBeenCalledTimes(1);
      const { title, message, mode, variant } = handler.mock.calls[0][0].detail;

      expect(title).toBe(expectedTitle);
      expect(message).toBe(expectedMessage);
      expect(mode).toBe(expectedMode);
      expect(variant).toBe(expectedVariant);
    });

    it('should dispatch success toast', async () => {
      const expectedTitle = 'dua lipa';
      const expectedMessage = 'i should have stayed at home';
      const expectedMode = 'dismissible';
      const expectedVariant = 'success';

      toaster.success(expectedTitle, expectedMessage);
      await flushPromises();

      expect(handler).toHaveBeenCalledTimes(1);
      const { title, message, mode, variant } = handler.mock.calls[0][0].detail;

      expect(title).toBe(expectedTitle);
      expect(message).toBe(expectedMessage);
      expect(mode).toBe(expectedMode);
      expect(variant).toBe(expectedVariant);
    });

    it('should dispatch info toast', async () => {
      const expectedTitle = 'GAYLE';
      const expectedMessage = 'abcdefu';
      const expectedMode = 'dismissible';
      const expectedVariant = 'info';

      toaster.info(expectedTitle, expectedMessage);
      await flushPromises();

      expect(handler).toHaveBeenCalledTimes(1);
      const { title, message, mode, variant } = handler.mock.calls[0][0].detail;

      expect(title).toBe(expectedTitle);
      expect(message).toBe(expectedMessage);
      expect(mode).toBe(expectedMode);
      expect(variant).toBe(expectedVariant);
    });
  });
});
