import { LightningElement, api } from 'lwc'
import FA from '@salesforce/resourceUrl/FontAwesome'
import { loadStyle } from 'lightning/platformResourceLoader'
import LIGHTNING_KIT from '@salesforce/resourceUrl/LightningKit'

export default class Star extends LightningElement {
  @api star

  @api readOnly = false
  @api activeColor = '#ffd055'
  @api inactiveColor = '#d8d8d8'

  clickStar () {
    if (!this.readOnly) {
      const selected = new CustomEvent('selected', { detail: this.star.id })
      this.dispatchEvent(selected)
    }
  }

  get salesforceIcon () { return `${LIGHTNING_KIT}/svg/icons#salesforce` }
  get starIcon () { return `${LIGHTNING_KIT}/svg/icons#star` }
  get classes () {
    const classes = []
    classes.push('fa fa-star lwc-star')
    classes.push(this.isReadOnly())
    return classes.join(' ')
  }

  isReadOnly () {
    return this.readOnly ? '' : 'clickable'
  }

  get color () {
    return 'color:' + (this.star.isActive ? this.activeColor : this.inactiveColor) + ';'
  }

  renderedCallback () {
    loadStyle(this, FA + '/css/all.css')
      .catch(error => {
        console.error(error.message)
      })
  }
}
