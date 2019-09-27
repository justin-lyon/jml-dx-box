import { LightningElement, api } from 'lwc'

export default class ListboxItem extends LightningElement {
  @api record
  @api title
  @api context
  @api iconName

  get label () { return this.record[this.title] }
  get subLabel () { return this.record[this.context] }
}
