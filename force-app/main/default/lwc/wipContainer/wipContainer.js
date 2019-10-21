import { LightningElement, track } from 'lwc'
import { NavigationMixin } from 'lightning/navigation'

export default class WipContainer extends NavigationMixin(LightningElement) {
  @track selected = {}

  setSelected (event) {
    this.selected = event.detail
  }
}
