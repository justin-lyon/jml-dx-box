import { LightningElement, api } from 'lwc'

export default class Listbox extends LightningElement {
  @api records
  @api title
  @api context
  @api iconName

  get hasRecords () {
    return this.records.length > 0
  }
}
