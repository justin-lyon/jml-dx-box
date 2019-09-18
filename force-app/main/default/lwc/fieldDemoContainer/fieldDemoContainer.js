import { LightningElement, track } from 'lwc'

export default class WipContainer extends LightningElement {
  @track ratingValue = 0

  handleValue(event) {
    this.ratingValue = event.detail
  }
}
