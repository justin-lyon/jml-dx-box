import { LightningElement, api, track, wire } from 'lwc'
import getAlertsByAccount from '@salesforce/apex/AccountAlertsPanelAuraService.getAlertsByAccount'

export default class AccountAlertPanel extends LightningElement {
  @api recordId
  @track alerts

  @track infos
  @track warnings
  @track dangers

  connectedCallback () {
    console.log('connected callback', this.recordId)
    this.fetchAlerts()
  }

  fetchAlerts () {
    getAlertsByAccount({ accountId: this.recordId })
      .then(data => {
        console.log('data', data)
        this.alerts = data
        this.infos = this.filterByType(data, 'Info')
        this.warnings = this.filterByType(data, 'Warning')
        this.dangers = this.filterByType(data, 'Danger')
      })
      .catch(err => {
        console.error('error getting alerts', err.message)
      })
  }

  filterByType (data, type) {
    return data.filter(d => d.type === type)
  }
}