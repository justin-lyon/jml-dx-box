import { LightningElement, api } from 'lwc'
import { NavigationMixin } from 'lightning/navigation'

export default class RecordLink extends NavigationMixin(LightningElement) {
  @api label
  @api recordId
  @api objectApiName
  @api actionName = 'view'

  clickRecord () {
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: this.recordId,
        objectApiName: this.objectApiName,
        actionName: this.actionName
      }
    })
  }
}