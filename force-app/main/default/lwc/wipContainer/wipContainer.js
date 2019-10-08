/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, track } from 'lwc'
import { NavigationMixin } from 'lightning/navigation'

export default class WipContainer extends NavigationMixin(LightningElement) {
  @track map
  pins = [
    {
      record: { Name: 'Slalom Dallas', Id: '0015400000NjnGwAAJ' },
      lat: 32.955740,
      lng: -96.824257
    },
    {
      record: { Name: 'Dallas House of Blues', Id: '0015400000NjnGEAAZ' },
      lat: 32.785327,
      lng: -96.808264
    },
    {
      record: { Name: 'Plano H Mart', Id: '0015400000NjnI0AAJ' },
      lat: 33.039529,
      lng: -96.696605
    }
  ]

  newPin = {
    record: { Name: 'Rockwall', Id: '0015400000NjnI1AAJ' },
    lat: 32.899261,
    lng: -96.480826
  }

  @track rockwallMarker

  handleValue (event) {
    this.ratingValue = event.detail
  }

  onMapInit () {
    this.map = this.template.querySelector('.wip-map')
    this.setMapRecords()
    setTimeout(() => {
      this.addNewPin()

      setTimeout(() => {
        this.removeMarker()
      }, 1000)
    }, 1000)
  }

  onMarkerClick (event) {
    this.gotoRecord(event.detail)
  }

  gotoRecord (recordId) {
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId,
        objectApiName: 'Account',
        actionName: 'view'
      }
    })
  }

  setMapRecords () {
    this.map.setMarkers(this.pins)
  }

  addNewPin () {
    this.rockwallMarker = this.map.addMarker(this.newPin)
  }

  removeMarker () {
    this.map.removeMarker(this.rockwallMarker)
  }
}
