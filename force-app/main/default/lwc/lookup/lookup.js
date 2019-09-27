import { LightningElement, api, track, wire } from 'lwc'
import getRecords from '@salesforce/apex/LookupAuraService.getRecords'

export default class Lookup extends LightningElement {
  @track searchTerm = ''
  @track records = []

  @api sobjectName
  @api iconName

  @api title = 'Name'
  @api context = 'Id'

  search () {
    const searcher = {
      searchTerm: this.searchTerm,
      fieldsByObject: {}
    }
    searcher.fieldsByObject[this.sobjectName] = [ this.title, this.context ]

    console.log('searcher', searcher)

    getRecords({searcher})
      .then(data => {
        const newData = JSON.parse(data)
        this.records = newData.reduce((acc, val) => {
          return acc.concat(...val)
        }, [])
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
      this.search()
    } else if (this.searchTerm.length === 0) {
      this.records = []
    }
  }
}
