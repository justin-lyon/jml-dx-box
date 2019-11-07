import { LightningElement, api, track, wire } from 'lwc'
import getAlertsByAccount from '@salesforce/apex/AccountAlertsPanelAuraService.getAlertsByAccount'

export default class AccountAlertPanel extends LightningElement {
  @api recordId
  @track alerts

  @wire(getAlertsByAccount, { accountId: '$recordId' })
  wiredAlerts ({ error, data }) {
    console.log('accountId', this.recordId)
    if (error) {
      console.error('Error retrieving alerts', error.message)
      return
    }
    console.log('data', data)
    this.alerts = data
  }

  connectedCallback () {
    console.log('connected callback', this.recordId)
    getAlertsByAccount({ accountId: this.recordId })
      .then(data => {
        console.log('data', data)
      })
      .catch(err => {
        console.error('error getting alerts', err.message)
      })
  }
}