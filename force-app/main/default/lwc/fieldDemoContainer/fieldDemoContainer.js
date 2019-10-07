import { LightningElement, track } from 'lwc'

export default class WipContainer extends LightningElement {
  @track ratingValue = 0
  @track accountId
  @track contactId

  handleValue (event) {
    this.ratingValue = event.detail
  }

  handleAccountLookup (event) {
    this.accountId = event.detail
  }

  handleContactLookup (event) {
    this.contactId = event.detail
  }
}
