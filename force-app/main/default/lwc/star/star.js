import { LightningElement } from 'lwc'
import Vendors from '@salesforce/resourceUrl/Vendors'
import { loadStyle } from 'lightning/platformResourceLoader'

export default class Star extends LightningElement {

  renderedCallback() {
    loadStyle(this, Vendors + '/fa/css/all.css')
      .catch(error => {
        console.error(error.message)
      })
  }
}
