import { LightningElement, api } from 'lwc';

export default class Icon extends LightningElement {
  @api resourceUrl;
  @api resourcePath;
  @api iconName;

  @api fill;
  @api alt;
  @api ariaHidden = false;

  get icon() {
    const parts = [this.resourceUrl];
    if (this.resourcePath) {
      parts.push(this.resourcePath);
    }
    return `${parts.join('/')}#${this.iconName}`;
  }

  get color() {
    return `fill: ${this.fill};`;
  }
}
