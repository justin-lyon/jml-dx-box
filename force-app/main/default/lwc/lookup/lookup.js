import { LightningElement, api, track } from 'lwc'
import getRecent from '@salesforce/apex/LookupAuraService.getRecent'
import getRecords from '@salesforce/apex/LookupAuraService.getRecords'
import getSelectedRecord from '@salesforce/apex/LookupAuraService.getSelectedRecord'

const ARROW_UP = 'ArrowUp'
const ARROW_DOWN = 'ArrowDown'
const ENTER = 'Enter'
const ESCAPE = 'Escape'
const ACTIONABLE_KEYS = [ ARROW_UP, ARROW_DOWN, ENTER, ESCAPE ]

export default class Lookup extends LightningElement {
  @track inputValue = ''
  @track records = []
  @track focused = false
  @track selected = ''
  @track record
  @track error
  @track recordIds
  @track activeId = ''

  @api sobjectName
  @api iconName

  @api fieldLabel = 'Search'
  @api title = 'Name'
  @api context = 'Id'

  get isReadOnly () {
    return this.record ? true : false
  }

  get showListbox () {
    return this.focused && this.records.length > 0 && !this.record
  }

  get showClear () {
    return this.record || (!this.record && this.inputValue.length > 0)
  }

  get containerClasses () {
    const classes = [ 'slds-combobox_container' ]

    if (this.record) {
      classes.push('slds-has-selection')
    }

    return classes.join(' ')
  }

  get inputClasses () {
    const classes = [
      'slds-input',
      'slds-combobox__input' ]

    if (this.record) {
      classes.push('slds-combobox__input-value')
    }

    return classes.join(' ')
  }

  get comboboxClasses () {
    const classes = [
      'slds-combobox',
      'slds-dropdown-trigger',
      'slds-dropdown-trigger_click' ]

    if (this.showListbox) {
      classes.push('slds-is-open')
    }
    return classes.join(' ')
  }

  get hasError () {
    return this.error ? this.error.message : ''
  }

  connectedCallback () {
    this.requestRecent()
  }

  onKeyup (event) {
    this.inputValue = event.target.value
    this.error = null

    const keyAction = {
      ArrowUp: () => { this.cycleActive(false) },
      ArrowDown: () => { this.cycleActive(true) },
      Enter: () => { this.selectItem() },
      Escape: () => { this.clearSelection() }
    }

    if (ACTIONABLE_KEYS.includes(event.code)) {
      keyAction[event.code]()

    } else {
      if (this.inputValue.length > 2) {
        this.debounceSearch()
      } else if (this.inputValue.length === 0) {
        this.records = []
        this.requestRecent()
      } else {
        this.error = {
          message: 'Minimum 2 characters'
        }
      }
    }
  }

  setFocus (event) {
    this.focused = event.type === 'focus'
  }

  handleSelected (event) {
    this.selected = event.detail
    this.fireSelected()
    this.getSelected()
  }

  getSearcher () {
    return {
      searchTerm: this.inputValue,
      objectName: this.sobjectName,
      fields: [ this.title, this.context ]
    }
  }

  search () {
    const searcher = this.getSearcher()
    this.error = null

    getRecords({ searcher })
      .then(data => {
        const newData = JSON.parse(data)
        this.records = newData.flat().sort((a, b) => this.sortAlpha(a, b))
        this.recordIds = this.getRecordIds()
      })
      .catch(error => {
        console.error('Error searching records: ', error)
        this.error = error
      })
  }

  debounceSearch () {
    window.clearTimeout(this.delaySearch)
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.delaySearch = setTimeout(() => {
      this.search()
    }, 300)
  }

  requestRecent () {
    const searcher = this.getSearcher()
    this.error = null

    getRecent({ searcher })
      .then(data => {
        this.records = JSON.parse(data)
        this.recordIds = this.getRecordIds()
      })
      .catch(error => {
        console.error('Error requesting recents', error)
        this.error = error
      })
  }

  sortAlpha (a, b) {
    const aName = a[this.title].toLowerCase()
    const bName = b[this.title].toLowerCase()

    if (aName < bName) return -1
    if (aName > bName) return 1

    return 0
  }

  getSelected () {
    const searcher = this.getSearcher()
    this.error = null

    getSelectedRecord({ recordId: this.selected, searcher })
      .then(data => {
        this.record = JSON.parse(data)[0]
        this.inputValue = this.record[this.title]
      })
      .catch(error => {
        console.error('Error getting selected record', error)
        this.record = null
        this.error = error
      })
  }

  clearSelection () {
    this.selected = ''
    this.record = null
    this.inputValue = ''
    this.error = null
    this.requestRecent()
    this.fireSelected()
  }

  getRecordIds () {
    return this.records.map(record => record.Id)
  }

  fireSelected () {
    const selected = new CustomEvent('selected', {
      detail: this.selected
    })
    this.dispatchEvent(selected)
  }

  cycleActive (forwards) {
    const currentIndex = this.recordIds.indexOf(this.activeId)
    if (currentIndex === -1 || currentIndex === this.records.length) {
      this.activeId = this.recordIds[0]
    } else if (!forwards && currentIndex === 0) {
      this.activeId = this.recordIds[this.recordIds.length - 1]
    } else if (forwards) {
      this.activeId = this.recordIds[currentIndex + 1]
    } else {
      this.activeId = this.recordIds[currentIndex - 1]
    }
  }

  selectItem () {
    const listbox = this.template.querySelector('c-listbox')
    listbox.selectItem()
  }
}