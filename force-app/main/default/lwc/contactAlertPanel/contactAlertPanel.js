import { LightningElement, api, track } from 'lwc'
import getAlertsByContact from '@salesforce/apex/ContactAlertPanelAuraService.getAlertsByContact'

export default class ContactAlertPanel extends LightningElement {
  @api recordId
  @track alerts

  connectedCallback () {
    this.fetchAlerts()
  }

  fetchAlerts () {
    getAlertsByContact({ contactId: this.recordId })
      .then(data => {
        this.alerts = data
      })
      .catch(err => {
        console.error('error getting alerts', err.message)
      })
  }
}