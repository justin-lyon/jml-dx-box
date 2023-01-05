import { createUuid } from '../utils';

const v4 = new RegExp(
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
);

describe('utils/create-uuid', () => {
  it('should be defined.', () => {
    expect(createUuid).toBeDefined();
  });

  describe('requirements', () => {
    it('should generate a valid v4 uuid', () => {
      const uuid = createUuid();
      const isValid = v4.test(uuid);
      expect(isValid).toBe(true);
    });
  });
});
