import { LightningElement, api } from 'lwc';
import LIGHTNING_KIT from '@salesforce/resourceUrl/LightningKit';

const SIZES = [
  'xx-small',
  'x-small',
  'small',
  'medium',
  'large',
  'x-large',
  'xx-large'
];

export default class Star extends LightningElement {
  @api star;

  @api readOnly = false;
  @api activeColor = '#ffd055';
  @api inactiveColor = '#d8d8d8';

  _size = 'small';
  @api
  get size() {
    return this._size;
  }

  set size(val) {
    if (!SIZES.includes(val)) {
      throw new Error(
        `Error in Star.js. Invalid value assigned to size attribute. Valid attributes are ${SIZES.join(
          ', '
        )}`
      );
    }
    this._size = val;
  }

  clickStar() {
    if (!this.readOnly) {
      const selected = new CustomEvent('selected', { detail: this.star.id });
      this.dispatchEvent(selected);
    }
  }

  iconName = 'star';

  get resourceUrl() {
    return LIGHTNING_KIT;
  }
  get resourcePath() {
    return 'svg/symbols.svg';
  }

  get classes() {
    const classes = [];
    classes.push('star-container');
    classes.push(this.size);
    classes.push(this.isReadOnly());
    return classes.join(' ');
  }

  isReadOnly() {
    return this.readOnly ? '' : 'clickable';
  }

  get color() {
    return this.star.isActive ? this.activeColor : this.inactiveColor;
  }
}
