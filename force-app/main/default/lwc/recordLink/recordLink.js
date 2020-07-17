import { LightningElement, api } from 'lwc'
import { NavigationMixin } from 'lightning/navigation'

export default class RecordLink extends NavigationMixin(LightningElement) {
  @api label
  @api recordId

  @api objectApiName
  @api actionName = 'view'

  @api title
  @api target = '_parent'
  @api isVisualforce = false

  get href () { return this.isVisualforce ? '/' + this.recordId : '#' }
  get titleText () { return this.title ? this.title : this.label }

  clickRecord (e) {
    if (!this.isVisualforce) e.preventDefault()
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
