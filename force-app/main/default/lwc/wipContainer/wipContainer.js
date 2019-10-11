import { LightningElement, api, track } from 'lwc'
import { NavigationMixin } from 'lightning/navigation'

export default class WipContainer extends NavigationMixin(LightningElement) {
  @track mdtId
  @track options = [
    { label: 'User', value: 'user' },
    { label: 'Account', value: 'account' },
    { label: 'Case', value: 'case' },
    { label: 'Contact', value: 'contact' },
  ]

  handleMdtSelected (event) {
    this.mdtId = event.detail
  }
}
