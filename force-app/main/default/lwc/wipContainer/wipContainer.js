import { LightningElement } from "lwc";

export default class WipContainer extends LightningElement {
  accountId = null;
  handleAccountLookup(event) {
    console.log("handling account lookup", event.type, event.detail.value);
    this.accountId = event.detail.value;
  }
}
