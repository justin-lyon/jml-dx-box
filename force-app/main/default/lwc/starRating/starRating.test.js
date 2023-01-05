import { createElement } from 'lwc';
import StarRating from 'c/starRating';

const initCmp = (el, { isReadOnly = false, rating = 1, maxRating = 5 }) => {
  const cmp = createElement('c-star-rating', {
    is: el
  });
  cmp.readOnly = isReadOnly;
  cmp.rating = rating;
  cmp.maxRating = maxRating;
  document.body.appendChild(cmp);
  return cmp;
};

jest.mock('c/icon');
describe('c-star-rating', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('constructs', () => {
    const maxRating = 5;
    const cmp = initCmp(StarRating, { maxRating });

    const stars = cmp.shadowRoot.querySelectorAll('c-star');
    expect(stars.length).toBe(maxRating);
  });

  it('has 1 active star', () => {
    const rating = 1;
    const maxRating = 5;
    const cmp = initCmp(StarRating, { rating, maxRating });

    const activeStars = Array.from(
      cmp.shadowRoot.querySelectorAll('c-star')
    ).filter((el) => el.star.isActive);
    expect(activeStars.length).toBe(rating);
  });
});
