import { LightningElement, api, track, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

const VARIANTS = ['standard', 'label-hidden', 'label-inline', 'label-stacked'];

export default class Picklist extends LightningElement {
  @api fieldDescribe;
  @api recordTypeId;
  @api default;

  @api label;
  @api fieldLevelHelp;
  @api disabled = false;
  @api required = false;

  @track errors = [];
  @track _variant;
  @api
  get variant() {
    return this._variant;
  }

  set variant(val) {
    if (!VARIANTS.includes(val))
      throw new Error(
        'Property variant expects values of ',
        VARIANTS.join(', ')
      );

    this._variant = val;
  }

  @api
  get value() {
    return this.selected;
  }

  set value(val) {
    this.selected = val || '';
  }

  @track selected;
  @track options;

  @wire(getPicklistValues, {
    recordTypeId: '$recordTypeId',
    fieldApiName: '$fieldDescribe'
  })
  wiredPicklistValues({ error, data }) {
    if (error) {
      this.errors.push(error);
      console.error('Error', error);
    } else if (data) {
      const options = data.values.map(({ label, value }) => ({ label, value }));
      if (!this.required && !data.defaultValue) {
        options.unshift({ label: 'None', value: '' });
      }
      this.options = options;
      this.setDefaultSelected(data);
    }
  }

  setDefaultSelected({ defaultValue }) {
    if (this.default) {
      this.selected = this.default;
    } else if (defaultValue) {
      this.selected = defaultValue.value;
    } else {
      this.selected = this.options[0].value;
    }

    this.fireSelected();
  }

  onChange(event) {
    this.selected = event.target.value;
    this.fireSelected();
  }

  fireSelected() {
    const selected = new CustomEvent('selected', {
      detail: this.selected
    });
    this.dispatchEvent(selected);
  }
}
