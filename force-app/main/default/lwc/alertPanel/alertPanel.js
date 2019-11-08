import { LightningElement, api } from 'lwc'

export default class AlertPanel extends LightningElement {
  @api dangers
  @api warnings
  @api infos

  get dangerLabel () { return 'Danger (' + this.dangers.length + ')'}
  get warningLabel () { return 'Warning (' + this.warnings.length + ')' }
  get infoLabel () { return 'Info (' + this.infos.length + ')' }

  get hasDanger () { return this.dangers && this.dangers.length > 0 }
  get hasWarning () { return this.warnings && this.warnings.length > 0 }
  get hasInfo () { return this.infos && this.infos.length > 0 }
}