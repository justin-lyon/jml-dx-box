import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class AlertPanelItem extends NavigationMixin(LightningElement) {
  @api alert;

  clickOpen() {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.alert.alertId,
        objectApiName: this.alert.sobjectType,
        actionName: "view"
      }
    });
  }
}
