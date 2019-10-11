import { LightningElement, api, track } from 'lwc'

export default class WipContainer extends LightningElement {
  @track mdtId = ''
  @track selectedStatus = ''
  @track placeholder = 'Select One...'

  @api legend = 'MDT Picker'
  @api comboLabel = 'Trigger Status'
  @api pickerLabel = 'Trigger Picker'

  @api statusOptions = []
  @api filterBy = 'MasterLabel'
  @api filterTest = 'Account'

  handleStatusSelected (event) {
    this.selectedStatus = event.target.value
    const mdtPicker = this.template.querySelector('c-metadata-picker')
    mdtPicker.clear()
    mdtPicker.getFilterMetadata(this.selectedStatus)
  }

  handleMdtSelected (event) {
    this.mdtId = event.detail ? event.detail.Id : ''
    this.selectedStatus = event.detail && event.detail[this.filterBy] ? event.detail[this.filterBy].toLowerCase() : this.selectedStatus

    if (event.detail && event.detail.Id) this.fireSelected()
  }

  fireSelected () {
    const selected = new CustomEvent('selected', {
      detail: this.mdtId
    })
    this.dispatchEvent(selected)
  }
}
