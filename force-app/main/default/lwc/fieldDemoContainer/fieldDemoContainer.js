/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import CASE_STATUS from '@salesforce/schema/Case.Status';
import ACCOUNT_TYPE from '@salesforce/schema/Account.Type';
import CASE_SUBTYPE from '@salesforce/schema/Case.Subtype__c';

export default class WipContainer extends NavigationMixin(LightningElement) {
  @track ratingValue = 0;
  @track accountId;
  @track contactId;
  @track contactId2;

  handleValue(event) {
    this.ratingValue = event.detail;
  }

  handleAccountLookup(event) {
    this.accountId = event.detail.value;
  }

  handleContactLookup(event) {
    this.contactId = event.detail.value;
  }

  handleContactLookup2(event) {
    this.contactId2 = event.detail.value;
  }

  // Leaflet Map
  @track map;
  pins = [
    {
      record: { Name: 'Slalom Dallas', Id: '0015400000NjnGEAAZ' },
      lat: 32.95574,
      lng: -96.824257
    },
    {
      record: { Name: 'Dallas House of Blues', Id: '0015400000NjnGwAAJ' },
      lat: 32.785327,
      lng: -96.808264
    },
    {
      record: { Name: 'Plano H Mart', Id: '0015400000NjnI0AAJ' },
      lat: 33.039529,
      lng: -96.696605
    }
  ];

  newPin = {
    record: { Name: 'Rockwall', Id: '0015400000NjnI1AAJ' },
    lat: 32.899261,
    lng: -96.480826
  };

  @track rockwallMarker;

  onMapInit() {
    this.map = this.template.querySelector('.wip-map');
    this.setMapRecords();
    setTimeout(() => {
      this.addNewPin();

      setTimeout(() => {
        this.removeMarker();
      }, 1000);
    }, 1000);
  }

  onMarkerClick(event) {
    this.gotoRecord(event.detail);
  }

  gotoRecord(recordId) {
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId,
        objectApiName: 'Account',
        actionName: 'view'
      }
    });
  }

  setMapRecords() {
    this.map.setMarkers(this.pins);
  }

  addNewPin() {
    this.rockwallMarker = this.map.addMarker(this.newPin);
  }

  removeMarker() {
    this.map.removeMarker(this.rockwallMarker);
  }

  // MDT Picker
  @track mdtId;

  handleMdtSelected(event) {
    this.mdtId = event.detail;
  }

  // Picklist
  masterRecordTypeId = '012000000000000AAA'; // Master RT Id
  _selectedStatus;
  get caseStatusDescribe() {
    return CASE_STATUS;
  }

  onCaseStatusChange(event) {
    this._selectedStatus = event.detail;
  }

  _selectedType;
  get accountTypeDescribe() {
    return ACCOUNT_TYPE;
  }

  onAccountTypeChange(event) {
    this._selectedType = event.detail;
  }

  _selectedSubtype;
  get caseSubtypeDescribe() {
    return CASE_SUBTYPE;
  }

  onCaseSubtypeChange(event) {
    this._selectedSubtype = event.detail;
  }
}
