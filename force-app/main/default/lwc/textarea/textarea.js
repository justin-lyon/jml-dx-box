import { LightningElement, api, track } from 'lwc'

export default class Textarea extends LightningElement {
  @api label
  @api name
  @api helpText
  @api required = false
  @api cols
  @api rows = 10
  @api messageWhenInputError = 'This field is required.'

  @track errorMessage
  @track _value
  @api
  get value () { return this._value }
  set value (val) {
    this._value = val
    const area = this.template.querySelector('textarea')
    if (area) {
      this.errorMessage = null
      area.value = this._value
    }
  }

  @api checkValidity () {
    return !this.required || Boolean(this.value && this.value.length > 0)
  }

  @api reportValidity () {
    const isValid = this.checkValidity()
    this.errorMessage = isValid ? null : this.messageWhenInputError
    return isValid
  }

  get formElementClass () {
    const classes = [ 'slds-form-element' ]
    if (this.errorMessage) {
      classes.push('slds-has-error')
    }
    return classes.join(' ')
  }

  get classList () {
    const classes = []
    classes.push('slds-textarea')
    if (this.cols) {
      classes.push('fill-width')
    }
    return classes.join(' ')
  }

  onChange () {
    this.reportValidity()
  }

  onBlur () {
    this.reportValidity()
  }

  onKeyup (event) {
    event.preventDefault()
    event.stopPropagation()

    const update = new CustomEvent('update', {
      detail: event.target.value
    })
    this.dispatchEvent(update)
  }
}