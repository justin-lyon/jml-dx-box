import { LightningElement, api } from 'lwc'

export default class Textarea extends LightningElement {
  @api label
  @api cols
  @api rows = 10

  @api value

  get classList () {
    const classes = []
    classes.push('slds-textarea')
    if (this.cols) {
      classes.push('fill-width')
    }
    return classes.join(' ')
  }

  onChange (event) {
    event.preventDefault()
    event.stopPropagation()
    const change = new CustomEvent('change', {
      detail: event.target.value
    })
    this.dispatchEvent(change)
  }

  onKeyup (event) {
    event.preventDefault()
    event.stopPropagation()
    const keyup = new CustomEvent('keyup', {
      detail: event.target.value
    })
    this.dispatchEvent(keyup)
  }
}