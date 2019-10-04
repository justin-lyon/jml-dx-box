import { LightningElement, api, track } from 'lwc'
import getRecent from '@salesforce/apex/LookupAuraService.getRecent'
import getRecords from '@salesforce/apex/LookupAuraService.getRecords'

export default class Lookup extends LightningElement {
  @track searchTerm = ''
  @track records = []
  @track focused = false

  @api sobjectName
  @api iconName

  @api title = 'Name'
  @api context = 'Id'

  getSearcher () {
    return {
      searchTerm: this.searchTerm,
      objectName: this.sobjectName,
      fields: [ this.title, this.context ]
    }
  }

  search () {
    const searcher = this.getSearcher()

    console.log('searcher', searcher)

    getRecords({ searcher })
      .then(data => {
        const newData = JSON.parse(data)
        this.records = newData.flat().sort((a, b) => this.sortAlpha(a, b))
        console.log('records', JSON.parse(JSON.stringify(this.records)))
      })
      .catch(error => {
        console.error('Error searching records: ', JSON.parse(JSON.stringify(error)))
      })
  }

  onChange (event) {
    event.preventDefault()
    this.searchTerm = event.target.value

    if (this.searchTerm.length > 2) {
      this.debounceSearch()
    } else if (this.searchTerm.length === 0) {
      this.records = []
      this.requestRecent()
    }
  }

  debounceSearch () {
    window.clearTimeout(this.delaySearch)
    this.delaySearch = setTimeout(() => {
      this.search()
    }, 300)
  }

  connectedCallback () {
    this.requestRecent()
  }

  requestRecent () {
    const searcher = this.getSearcher()
    getRecent({ searcher })
      .then(data => {
        this.records = JSON.parse(data)
      })
      .catch(error => {
        console.error('Error requesting recents', JSON.parse(JSON.stringify(error)))
      })
  }

  sortAlpha (a, b) {
    const aName = a[this.title].toLowerCase()
    const bName = b[this.title].toLowerCase()

    if (aName < bName) return -1
    if (aName > bName) return 1

    return 0
  }

  setFocus (event) {
    const listbox = this.template.querySelector('c-listbox')
    this.focused = event.type === 'focus'

    if (event.target && listbox.hasElement(event.target)) {
      this.focused = true
    }
  }

  handleSelected (event) {
    console.log('selected', event.detail)
  }
}
