import { LightningElement, api, track, wire } from 'lwc'
import { CurrentPageReference } from 'lightning/navigation'
import { getRecord } from 'lightning/uiRecordApi'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

const FIELDS = []

export default class AlertPanel extends LightningElement {
  @track recordId
  @track recordName
  @track _nameField

  @track _alerts
  @track dangers
  @track warnings
  @track infos

  @track panelState = {
    show: false,
    showDanger: false,
    showWarning:false,
    showInfo: false
  }

  @api hasToast = false
  @api sobjectType
  @api
  get nameField () { return this.sobjectType + '.' + this._nameField }
  set nameField (value) {
    this._nameField = value
    FIELDS.push(this.nameField)
  }

  @api
  get alerts () { return this._alerts }
  set alerts (data) {
    if (data && data.length > 0) {
      this._alerts = data
      this.infos = this.filterByType(data, 'Info')
      this.warnings = this.filterByType(data, 'Warning')
      this.dangers = this.filterByType(data, 'Danger')
    }
  }

  get message () { return `Alert on ${this.sobjectType}, ${this.recordName}` }

  get dangerLabel () { return 'Danger (' + this.dangers.length + ')'}
  get warningLabel () { return 'Warning (' + this.warnings.length + ')' }
  get infoLabel () { return 'Info (' + this.infos.length + ')' }

  get hasAlerts () { return this._alerts && this._alerts.length > 0 }
  get hasDanger () { return this.dangers && this.dangers.length > 0 }
  get hasWarning () { return this.warnings && this.warnings.length > 0 }
  get hasInfo () { return this.infos && this.infos.length > 0 }

  @wire(CurrentPageReference)
  wiredPageRef (pageRef) {
    this.recordId = pageRef.attributes.recordId
  }

  @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
  wiredRecord ({ error, data }) {
    if (data) {
      this.recordName = data.fields[this._nameField].value

      if (this.hasToast) this.toastAlert()
    } else if (error) {
      console.error('error retrieving page record', JSON.parse(JSON.stringify(error)))
    }
  }

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
        message: this.message,
        variant: 'error'
      })
    } else if (this.warnings && this.warnings.length > 0) {
      this.toast({
        title: 'Warning',
        message: this.message,
        variant: 'warning'
      })
    } else if (this.infos && this.infos.length > 0) {
      this.toast({
        title: 'Info',
        message: this.message,
        variant: 'info'
      })
    }
  }

  closeAlertPanel () {
    this.clearAlertState()
  }

  clickDangerAlert () {
    this.clearAlertState()
    this.panelState.show = true
    this.panelState.showDanger = true
    this.setButtonActive('danger')
  }

  clickWarningAlert () {
    this.clearAlertState()
    this.panelState.show = true
    this.panelState.showWarning = true
    this.setButtonActive('warning')
  }

  clickInfoAlert () {
    this.clearAlertState()
    this.panelState.show = true
    this.panelState.showInfo = true
    this.setButtonActive('info')
  }

  clearAlertState () {
    this.panelState.show = false
    this.panelState.showDanger = false
    this.panelState.showWarning = false
    this.panelState.showInfo = false

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