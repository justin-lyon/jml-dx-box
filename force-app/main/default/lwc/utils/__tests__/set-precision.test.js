import { setPrecision } from "../utils";

describe("utils/set-precision", () => {
  it("should be defined", () => {
    expect(setPrecision).toBeDefined();
  });

  describe("requirements", () => {
    it("should return a float of 2 decimal places by default", () => {
      const input = 4.151;
      const expected = 4.15;

      const actual = setPrecision(input);

      expect(actual).toBe(expected);
      expect(typeof actual).toBe("number");
    });

    it("should return a float of specified decimal places", () => {
      const decimalPlaces = 3;
      const input = 4.2551;
      const expected = 4.255;

      const actual = setPrecision(input, decimalPlaces);

      expect(actual).toBe(expected);
      expect(typeof actual).toBe("number");
    });
  });
});
