import { LightningElement, api, track, wire } from "lwc";
import { refreshApex } from "@salesforce/apex";
import getAlertsByAccount from "@salesforce/apex/AccountAlertPanelAuraService.getAlertsByAccount";

export default class AccountAlertPanel extends LightningElement {
  @api recordId;
  @api hasToast;
  @track alerts;
  wiredAlertResult;

  onRefresh() {
    refreshApex(this.wiredAlertResult);
  }

  @wire(getAlertsByAccount, { accountId: "$recordId" })
  wiredAlerts(result) {
    this.wiredAlertResult = result;
    this.alerts = [];
    if (result.data) {
      this.alerts = result.data;
    } else if (result.error) {
      console.error("error refreshing", result.error);
    }
  }
}
