import { LightningElement, track } from 'lwc'

export default class WipContainer extends LightningElement {
  @track isShown = false

  toggleModal () {
    this.isShown = !this.isShown
  }

  handleClosed () {
    this.isShown = false
  }
}
