import { LightningElement } from 'lwc';

const RELATE_TO_OPTIONS = [
  { label: 'Accounts', value: 'account' },
  { label: 'Reports', value: 'report' },
  { label: 'Contacts', value: 'contact' },
  { label: 'Files', value: 'file' },
  { label: 'Groups', value: 'group' },
  { label: 'Leads', value: 'lead' },
  { label: 'Notes', value: 'note' },
  {
    label:
      "It's best not to stare at the sun during an eclipse. Actors don't necessarily want to be famous or rich or anything else.",
    value:
      "it's best not to stare at the sun during an eclipse. actors don't necessarily want to be famous or rich or anything else."
  }
];

const OPTIONS_2 = [
  { label: 'Dogs', value: 'dogs' },
  { label: 'Cats', value: 'cats' },
  { label: 'Birds', value: 'birds' },
  { label: 'Fish', value: 'fish' }
];

export default class WipContainer extends LightningElement {
  relateToOptions = RELATE_TO_OPTIONS;
  selectedValues = [];

  handleSelected(event) {
    console.log('handling selected', event.type, event.detail);
    this.selectedValues = event.detail;
    console.log('selectedValues', JSON.stringify(this.selectedValues));
  }

  swapOptions() {
    if (this.relateToOptions === OPTIONS_2) {
      this.relateToOptions = RELATE_TO_OPTIONS;
      return;
    }
    this.relateToOptions = OPTIONS_2;
  }
}
