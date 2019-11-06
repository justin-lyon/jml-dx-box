import { createElement } from 'lwc'
import Star from 'c/star'

const initCmp = (el, data, isReadOnly = false) => {
  const cmp = createElement('c-star', {
    is: el
  })
  cmp.star = data
  cmp.readOnly = isReadOnly
  document.body.appendChild(cmp)
  return cmp
}

describe('c-star', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild)
    }
  })

  it ('constructs', () => {
    const cmp = initCmp(Star, { id: 1, isActive: true })

    const italic = cmp.shadowRoot.querySelector('i')
    expect(italic.className).toEqual(expect.stringContaining('fa-star'))
  })

  it('is clickable', () => {
    const cmp = initCmp(Star, { id: 1, isActive: true })

    const eventHandler = event => {
      expect(event.detail).toBe(cmp.star.id)
    }
    cmp.addEventListener('selected', eventHandler)

    const italic = cmp.shadowRoot.querySelector('i')
    italic.click()
  })

  it('is readonly', () => {
    const cmp = initCmp(Star, { id: 20, isActive: true }, true)

    const eventHandler = event => {
      expect(event.detail).not.toBe(cmp.star.id)
    }
    cmp.addEventListener('click', eventHandler)

    const italic = cmp.shadowRoot.querySelector('i')
    italic.click()

    expect(italic.className).not.toEqual(expect.stringContaining('clickable'))
  })
})