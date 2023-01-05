import { createElement } from "lwc";
import Star from "c/star";

const initCmp = (el, data, isReadOnly = false) => {
  const cmp = createElement("c-star", {
    is: el
  });
  cmp.star = data;
  cmp.readOnly = isReadOnly;
  document.body.appendChild(cmp);
  return cmp;
};

jest.mock("c/icon");
describe("c-star", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("constructs", () => {
    const cmp = initCmp(Star, { id: 1, isActive: true });

    const starContainer = cmp.shadowRoot.querySelector("span");
    expect(starContainer.className).toEqual(
      expect.stringContaining("star-container")
    );
  });

  it("is clickable", () => {
    const cmp = initCmp(Star, { id: 1, isActive: true });

    const eventHandler = (event) => {
      expect(event.detail).toBe(cmp.star.id);
    };
    cmp.addEventListener("selected", eventHandler);

    const starContainer = cmp.shadowRoot.querySelector("span");
    starContainer.click();
  });

  it("is readonly", () => {
    const cmp = initCmp(Star, { id: 20, isActive: true }, true);

    const eventHandler = (event) => {
      expect(event.detail).not.toBe(cmp.star.id);
    };
    cmp.addEventListener("click", eventHandler);

    const starContainer = cmp.shadowRoot.querySelector("span");
    starContainer.click();

    expect(starContainer.className).not.toEqual(
      expect.stringContaining("clickable")
    );
  });
});
