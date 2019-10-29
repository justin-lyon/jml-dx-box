import { createElement } from 'lwc'
import RecordLink from 'c/recordLink'
import { NavigationMixin } from 'lightning/navigation'

const initCmp = (el, {
  label = 'Rick Sanchez',
  recordId = '50000000000000a',
  objectApiName = 'Contact'
}) => {
  const cmp = createElement('c-record-link', {
    is: el
  })

  cmp.label = label
  cmp.recordId = recordId
  cmp.objectApiName = objectApiName

  document.body.appendChild(cmp)
  return cmp
}

describe('c-record-link', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the dom.
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild)
    }
  })

  it('constructs', () => {
    const label = 'Bobby Boucher'
    const cmp = initCmp(RecordLink, { label })

    const span = cmp.shadowRoot.querySelector('span.clickable')
    expect(span.textContent).toBe(label)
  })

  it('is clickable', () => {
    const cmp = initCmp(RecordLink, {})

    const clickHandler = event => {
      console.log('event.detail', event.detail)
    }
    cmp.addEventListener('standard__recordPage', clickHandler)
    const span = cmp.shadowRoot.querySelector('span')
    span.click()
  })
})
