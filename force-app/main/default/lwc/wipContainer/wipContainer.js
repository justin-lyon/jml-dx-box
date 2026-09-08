import { LightningElement } from 'lwc';

const RELATE_TO_OPTIONS = [
  { label: 'Accounts', value: 'Account' },
  { label: 'Reports', value: 'Report' },
  { label: 'Contacts', value: 'Contact' },
  { label: 'Files', value: 'File' },
  { label: 'Groups', value: 'Group' },
  { label: 'Leads', value: 'Lead' },
  { label: 'Notes', value: 'Note' },
  {
    label:
      "It's best not to stare at the sun during an eclipse. Actors don't necessarily want to be famous or rich or anything else.",
    value:
      "It's best not to stare at the sun during an eclipse. Actors don't necessarily want to be famous or rich or anything else."
  }
];

export default class WipContainer extends LightningElement {
  relateToOptions = RELATE_TO_OPTIONS;
  selectedValues = [];

  handleSelected(event) {
    console.log('handling selected', event.type, event.detail);
    this.selectedValues = event.detail;
  }
}
