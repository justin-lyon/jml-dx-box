import { LightningElement, api } from 'lwc';

export default class NewCase extends LightningElement {
  @api thing;
  @api recordId;
}
