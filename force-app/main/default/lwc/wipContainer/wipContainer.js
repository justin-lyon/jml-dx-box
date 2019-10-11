import { LightningElement, api, track } from 'lwc'
import { NavigationMixin } from 'lightning/navigation'

export default class WipContainer extends NavigationMixin(LightningElement) {
  @track mdtId
  @track options = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' }
  ]

  handleMdtSelected (event) {
    this.mdtId = event.detail
  }
}
