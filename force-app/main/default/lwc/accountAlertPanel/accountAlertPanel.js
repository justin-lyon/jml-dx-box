import { LightningElement, api, track } from 'lwc'

export default class AccountAlertPanel extends LightningElement {
  @api recordId
  @track alerts

  get hasAlerts () { return this.alerts && this.alerts.length > 0 }

}