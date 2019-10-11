import { LightningElement, api, track } from 'lwc'

export default class WipContainer extends LightningElement {
  @track mdtId = ''
  @track selectedStatus = ''
  @track filterTest = 'Account'

  @api comboLabel = ''
  @api pickerLabel = ''
  @api iconName = 'utility:setup'
  @api placeholder = 'Search...'

  @api mdtName = ''
  @api title = 'MasterLabel'
  @api context = 'Id'
  @api filterOptions = []
  @api filterBy = 'MasterLabel'

  handleStatusSelected (event) {
    this.selectedStatus = event.target.value
    const mdtPicker = this.template.querySelector('c-metadata-picker')
    mdtPicker.clear()
    mdtPicker.getFilterMetadata(this.selectedStatus)
  }

  handleMdtSelected (event) {
    console.log('finder mdt selected', JSON.parse(JSON.stringify(event.detail)))
    this.mdtId = event.detail ? event.detail.Id : ''
    this.selectedStatus = event.detail && event.detail[this.filterBy] ? event.detail[this.filterBy].toLowerCase() : this.selectedStatus

    if (event.detail && event.detail.Id) {
      this.fireSelected()
      const mdtPicker = this.template.querySelector('c-metadata-picker')
      mdtPicker.getFilterMetadata(this.selectedStatus)
    }
  }

  fireSelected () {
    const selected = new CustomEvent('selected', {
      detail: this.mdtId
    })
    this.dispatchEvent(selected)
  }
}
