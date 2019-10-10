import { LightningElement, api, track } from 'lwc'
import { NavigationMixin } from 'lightning/navigation'

export default class WipContainer extends NavigationMixin(LightningElement) {
  @track mdtId
  @track selectedStatus
  @track statusOptions = [
    { label: 'User', value: 'user' },
    { label: 'Account', value: 'account' }
  ]
  @track placeholder = 'Select One...'

  @api legend = 'MDT Picker'
  @api comboLabel = 'Trigger Status'
  @api pickerLabel = 'Trigger Picker'

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
  }
}
