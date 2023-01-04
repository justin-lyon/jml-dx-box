import { toTitleCase } from "../utils";

describe("utils/to-title-case", () => {
  it("should be defined", () => {
    expect(toTitleCase).toBeDefined();
  });

  describe("requirements", () => {
    it("should capitalize the first letter of each word in a sentence.", () => {
      const unformatted = "the lord of the rings";

      const title = toTitleCase(unformatted);
      expect(title).toBe("The Lord Of The Rings");
    });
  });
});
