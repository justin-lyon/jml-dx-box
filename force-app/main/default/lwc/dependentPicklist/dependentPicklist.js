import { LightningElement, api } from 'lwc';

export default class DependentPicklist extends LightningElement {
  @api objectApiName;
  @api parentFieldName;
  @api childFieldName;

  childChanged() {
    const parentSelect = this.template.querySelector('.parentSelect').value;
    const childSelect = this.template.querySelector('.childSelect').value;
    const select = new CustomEvent('select', {
      detail: {
        parentSelect,
        childSelect
      }
    });
    this.dispatchEvent(select);
  }
}
