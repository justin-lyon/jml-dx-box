import { api, LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class Navigator extends NavigationMixin(LightningElement) {
  @api
  navigate(pageRef) {
    this[NavigationMixin.Navigate](pageRef);
  }
}
