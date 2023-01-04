import { LightningElement, api } from "lwc";

export default class Icon extends LightningElement {
  @api resourceUrl;
  @api resourcePath;
  @api iconName;

  @api fill;
  @api alt;
  @api ariaHidden;
}
