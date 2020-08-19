import { LightningElement } from 'lwc'
import debouncify from 'c/debouncify'

export default class WipContainer extends LightningElement {
  isShown = false

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
