import { createElement } from 'lwc'
import StarRating from 'c/starRating'

const initCmp = (el, { isReadOnly = false, rating = 1, maxRating = 5 }) => {
  const cmp = createElement('c-star-rating', {
    is: el
  })
  cmp.readOnly = isReadOnly
  cmp.rating = rating
  cmp.maxRating = maxRating
  document.body.appendChild(cmp)
  return cmp
}

describe('c-star-rating', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the dom.
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild)
    }
  })

  it('constructs', () => {
    const maxRating = 5
    const cmp = initCmp(StarRating, { maxRating })

    // verify i element
    const stars = cmp.shadowRoot.querySelectorAll('c-star')
    expect(stars.length).toBe(maxRating)
  })

  it('has 1 active star', () => {
    const rating = 1
    const maxRating = 5
    const cmp = initCmp(StarRating, { rating, maxRating })

    const activeStars = Array.from(cmp.shadowRoot.querySelectorAll('c-star'))
      .filter(el => {
        return el.star.isActive
      })
    expect(activeStars.length).toBe(rating)
  })
})
