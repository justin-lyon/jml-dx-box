import { LightningElement, api, track } from 'lwc'
import { NavigationMixin } from 'lightning/navigation'

export default class WipContainer extends NavigationMixin(LightningElement) {
  @track mdtId

  handleMdtSelected (event) {
    this.mdtId = event.detail
  }
}
