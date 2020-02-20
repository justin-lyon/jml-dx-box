import { LightningElement, api, track } from 'lwc'

const SIZE_OPTIONS = [
  'small',
  'medium',
  'large'
]

export default class Modal extends LightningElement {
  @api isShown = false
  @track _size = 'medium'

  @api
  set size (val) {
    if (!SIZE_OPTIONS.includes(val)) {
      throw new Error(`Property size expects values ${SIZE_OPTIONS.join(', ')}`)
    }
    this._size = val
  }

  get size () { return this._size }

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
    const classes = []
    classes.push('slds-modal')

    if (this._size) {
      const sizeClass = `slds-modal_${this._size}`
      classes.push(sizeClass)
    }

    if (this.isShown) {
      classes.push('slds-fade-in-open')
    }

    return classes.join(' ')
  }

  get backdropClass () {
    const classes = []
    classes.push('slds-backdrop')

    if (this.isShown) {
      classes.push('slds-backdrop_open')
    }

    return classes.join(' ')
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