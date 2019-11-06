import { LightningElement, api, track } from 'lwc'

export default class AccountAlertPanel extends LightningElement {
  @api recordId
  @track alertsByType = [
    {
      name: 'info',
      label: 'Info',
      alerts: [
        {
          title: 'info 1',
          message: 'some info',
          type: {
            name: 'info',
            label: 'Info'
          }
        }
      ]
    },
    {
      name: 'warning',
      label: 'Warning',
      alerts: [
        {
          title: 'warning 1',
          message: 'some warning',
          type: {
            name: 'warning',
            label: 'Warning'
          }
        }
      ]
    },
    {
      name: 'danger',
      label: 'Danger',
      alerts: [
        {
          title: 'danger 1',
          message: 'some danger',
          type: {
            name: 'danger',
            label: 'Danger'
          }
        },
        {
          title: 'danger 2',
          message: 'some danger',
          type: {
            name: 'danger',
            label: 'Danger'
          }
        }
      ]
    }
  ]
}