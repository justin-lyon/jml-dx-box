import { debouncify } from "../utils";

// Placeholder for debouncify
const callback = jest.fn();

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");
jest.spyOn(global, "clearTimeout");

describe("utils/debouncify", () => {
  it("should be defined", () => {
    expect(debouncify).toBeDefined();
  });

  describe("requirements", () => {
    it("should return a debounced method", () => {
      const ctx = {};
      ctx.debounced = debouncify(callback, 0);
      jest.spyOn(ctx, "debounced");
      expect(ctx.debounced).toBeDefined();
      expect(ctx.debounced).toHaveBeenCalledTimes(0);
    });

    it("should invoke callback after specified delay", () => {
      const ctx = {};
      const delay = 0;
      ctx.debounced = debouncify(callback, delay);
      jest.spyOn(ctx, "debounced");

      ctx.debounced();

      expect(clearTimeout).toHaveBeenCalledTimes(1);
      expect(clearTimeout).toHaveBeenLastCalledWith(null);
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), delay);
    });
  });
});
