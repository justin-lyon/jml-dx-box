import { LightningElement, api, track, wire } from 'lwc'
import { refreshApex } from '@salesforce/apex'
import getAlertsByContact from '@salesforce/apex/ContactAlertPanelAuraService.getAlertsByContact'

export default class ContactAlertPanel extends LightningElement {
  @api recordId
  @api hasToast
  @track alerts
  wiredAlertResult

  onRefresh () {
    return refreshApex(this.wiredAlertResult)
  }

  @wire(getAlertsByContact, { contactId: '$recordId' })
  wiredAlerts (result) {
    this.wiredAlertResult = result
    this.alerts = []
    if (result.data) {
      this.alerts = result.data

    } else if (result.error) {
      console.error('Error getting alerts', result.error.message)
    }
  }
}