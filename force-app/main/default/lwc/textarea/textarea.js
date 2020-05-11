import { LightningElement, api, track, wire } from 'lwc'

export default class Textarea extends LightningElement {
  @api label
  @api name
  @api helpText
  @api required = false
  @api cols
  @api rows = 10
  @api messageWhenInputError = 'This field is required.'
  @api fieldDescribe
  @api showCharacterCount = false

  @track errorMessage
  @track _value = ''
  @api
  get value () { return this._value }
  set value (val) {
    const newVal = !!val ? val : ''
    this._value = newVal
    if (!!this.textarea) {
      this.textarea.value = this._value
    }
  }

  @api checkValidity () {
    return !this.required || Boolean(this.value && this.value.length > 0) && !this.isTooLong
  }

  @api reportValidity () {
    this.errorMessage = null
    const isValid = this.checkValidity()

    if (!isValid) {
      this.errorMessage = this.messageWhenInputError

    }
    if (this.isTooLong) {
      this.errorMessage = `${this.lengthDifference} too many characters.`
    }

    return isValid
  }

  renderedCallback() {
    this.textarea.value = this.value
  }

  get textarea() { return this.template.querySelector('textarea') }
  get maxLength () { return this.fieldDescribe.length }
  get currentLength () { return this.value.length }
  get isTooLong () { return this.currentLength > this.maxLength }
  get lengthDifference () { return (this.maxLength - this.currentLength) * -1 }
  get hasError () { return !!this.errorMessage }

  get formElementClass () {
    const classes = [ 'slds-form-element' ]
    if (this.hasError) {
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

  get countClass () {
    const classes = []
    if (this.isTooLong) {
      classes.push('slds-text-color_error')
    }
    return classes.join(classes)
  }

  onPaste () {
    this.fireUpdate()
    this.reportValidity()
  }

  onChange (event) {
    this.value = event.target.value

    this.fireUpdate()
    this.reportValidity()
  }

  fireUpdate () {
    const update = new CustomEvent('update', {
      detail: this.value
    })
    this.dispatchEvent(update)
  }
}