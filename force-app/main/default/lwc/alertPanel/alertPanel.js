import { LightningElement, api, track } from 'lwc'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class AlertPanel extends LightningElement {
  @track _alerts
  @track dangers
  @track warnings
  @track infos

  @track showAlertPanel = false
  @track showDangerPanel = false
  @track showWarningPanel = false
  @track showInfoPanel = false

  @api hasToast = false

  @api
  get alerts () { return this._alerts }
  set alerts (data) {
    if (data && data.length > 0) {
      this._alerts = data
      this.infos = this.filterByType(data, 'Info')
      this.warnings = this.filterByType(data, 'Warning')
      this.dangers = this.filterByType(data, 'Danger')

      if (this.hasToast) this.toastAlert()
    }
  }

  get dangerLabel () { return 'Danger (' + this.dangers.length + ')'}
  get warningLabel () { return 'Warning (' + this.warnings.length + ')' }
  get infoLabel () { return 'Info (' + this.infos.length + ')' }

  get hasAlerts () { return this._alerts && this._alerts.length > 0 }
  get hasDanger () { return this.dangers && this.dangers.length > 0 }
  get hasWarning () { return this.warnings && this.warnings.length > 0 }
  get hasInfo () { return this.infos && this.infos.length > 0 }

  clickRefresh () {
    const refresh = new CustomEvent('refresh')
    this.dispatchEvent(refresh)
  }

  filterByType (data, type) {
    return data.filter(d => d.type === type)
  }

  toastAlert () {
    if (this.dangers && this.dangers.length > 0) {
      this.toast({
        title: 'Danger',
        message: 'Active alert on this record.',
        variant: 'error'
      })
    } else if (this.warnings && this.warnings.length > 0) {
      this.toast({
        title: 'Warning',
        message: 'Active alert on this record.',
        variant: 'warning'
      })
    } else if (this.infos && this.infos.length > 0) {
      this.toast({
        title: 'Info',
        message: 'Active alert on this record.',
        variant: 'info'
      })
    }
  }

  closeAlertPanel () {
    this.clearAlertState()
  }

  clickDangerAlert () {
    this.clearAlertState()
    this.showAlertPanel = true
    this.showDangerPanel = true
    this.setButtonActive('danger')
  }

  clickWarningAlert () {
    this.clearAlertState()
    this.showAlertPanel = true
    this.showWarningPanel = true
    this.setButtonActive('warning')
  }

  clickInfoAlert () {
    this.clearAlertState()
    this.showAlertPanel = true
    this.showInfoPanel = true
    this.setButtonActive('info')
  }

  clearAlertState () {
    this.showAlertPanel = false
    this.showDangerPanel = false
    this.showWarningPanel = false
    this.showInfoPanel = false

    const activeButtons = this.template.querySelectorAll('button.alert-button.active')
    if (activeButtons) {
      [ ...activeButtons ].forEach(btn => btn.classList.remove('active'))
    }
  }

  setButtonActive (type) {
    const selector = 'button.' + type
    const activeBtn = this.template.querySelector(selector)
    activeBtn.classList.add('active')
  }

  toast ({ title, message, variant }) {
    const toast = new ShowToastEvent({
      title,
      message,
      variant
    })
    this.dispatchEvent(toast)
  }
}