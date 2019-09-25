import { LightningElement, api, track, wire } from 'lwc'
import getRecords from '@salesforce/apex/LookupAuraService.getRecords'

export default class Lookup extends LightningElement {
  @track searchTerm = ''
  @track records = []

  search () {
    getRecords({
      searcher: {
        searchTerm: this.searchTerm,
        fieldsByObject: { Account: ['Name', 'Id'] }
    }})
      .then(data => {
        console.log('got data', JSON.parse(JSON.stringify(data)))
        console.log('got data', JSON.parse(data))
        const newData = JSON.parse(data)
        this.records = newData.reduce((acc, val) => {
          console.log('val', val)
          return acc.concat(...val)
        }, [])
        console.log('records', JSON.stringify(this.records))
      })
      .catch(error => {
        console.error('Error searching records: ', JSON.parse(JSON.stringify(error)))
      })
  }

  onChange (event) {
    event.preventDefault()
    this.searchTerm = event.target.value
    console.log('changed', event.target.value)

    if (this.searchTerm.length > 2) {
      this.search()
    } else if (this.searchTerm.length === 0) {
      this.records = []
    }
  }

  get hasRecords () {
    return this.records.length > 0
  }
}
