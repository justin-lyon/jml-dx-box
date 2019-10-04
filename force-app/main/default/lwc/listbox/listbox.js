import { LightningElement, api } from 'lwc'

export default class Listbox extends LightningElement {
  @api records
  @api title
  @api context
  @api iconName
  @api active = false

  get hasRecords () {
    return this.records.length > 0
  }

  get shown () {
    return this.records.length > 0 && this.active
  }

  @api
  hasElement (el) {
    console.log('event.target', el)
    return this.template.contains(el)
  }
}
