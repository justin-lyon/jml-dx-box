import { LightningElement, api } from 'lwc'

export default class Modal extends LightningElement {
  @api isShown = false

  @api
  closeModal () {
    this.isShown = false
  }

  @api
  showModal () {
    this.isShown = true
  }

  @api
  toggleModal () {
    this.isShown = !this.isShown
  }

  get sectionClass () {
    return 'slds-modal ' + (this.isShown ? ' slds-fade-in-open' : '')
  }

  get backdropClass () {
    return 'slds-backdrop ' + (this.isShown ? ' slds-backdrop_open' : '')
  }

  clickedClose () {
    this.fireClosed()
  }

  handleKeyup (event) {
    if (event.keyCode && event.keyCode === 27) {
      this.fireClosed()
    }
  }

  fireClosed () {
    const close = new CustomEvent('close')
    this.dispatchEvent(close)
  }
}