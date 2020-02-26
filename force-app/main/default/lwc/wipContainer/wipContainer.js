import { LightningElement, track } from 'lwc'

export default class WipContainer extends LightningElement {
  @track description = 'Lorem ipsum dolor set'

  onChange (event) {
    this.description = event.detail
  }

  onKeyup (event) {
    this.description = event.detail
  }
}
