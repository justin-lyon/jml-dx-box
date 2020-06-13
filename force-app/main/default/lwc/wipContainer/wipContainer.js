import { LightningElement, track } from 'lwc'

export default class WipContainer extends LightningElement {
  @track isShown = false

  toggleModal () {
    this.isShown = !this.isShown
  }

  closeModal () {
    this.isShown = false
  }

  handleClick (event) {
    console.log('click', event.target)
  }
}
