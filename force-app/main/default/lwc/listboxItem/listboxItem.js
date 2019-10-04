import { LightningElement, api } from 'lwc'

export default class ListboxItem extends LightningElement {
  @api record
  @api title
  @api context
  @api iconName

  get label () { return this.record[this.title] }
  get subLabel () { return this.record[this.context] }

  clickRecord (event) {
    console.log(event.target)
    const selected = new CustomEvent('selected', {
      bubbles: true,
      detail: this.record.Id
    })
    this.dispatchEvent(selected)
  }
}
