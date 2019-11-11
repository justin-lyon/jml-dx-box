import { LightningElement, api, track } from 'lwc'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import getAlertsByAccount from '@salesforce/apex/AccountAlertsPanelAuraService.getAlertsByAccount'

export default class AccountAlertPanel extends LightningElement {
  @api recordId
  @track alerts

  @track infos
  @track warnings
  @track dangers

  connectedCallback () {
    this.fetchAlerts()
  }

  fetchAlerts () {
    getAlertsByAccount({ accountId: this.recordId })
      .then(data => {
        this.alerts = data
        this.infos = this.filterByType(data, 'Info')
        this.warnings = this.filterByType(data, 'Warning')
        this.dangers = this.filterByType(data, 'Danger')
        this.toastAlert()
      })
      .catch(err => {
        console.error('error getting alerts', err.message)
      })
  }

  filterByType (data, type) {
    return data.filter(d => d.type === type)
  }

  toastAlert () {
    if (this.dangers && this.dangers.length > 0) {
      this.toast({
        title: 'Danger',
        message: 'active alert on this record.',
        variant: 'error' })
    } else if (this.warnings && this.warnings.length > 0) {
      this.toast({
        title: 'Warning',
        message: 'active alert on this record.',
        variant: 'warning' })
    } else if (this.infos && this.infos.length > 0) {
      this.toast({
        title: 'Info',
        message: 'active alert on this record.',
        variant: 'info' })
    }
  }

  toast ({ title, message, variant }) {
    const toast = new ShowToastEvent({
      title,
      message,
      variant
    })
    this.dispatchEvent(toast)
  }
}