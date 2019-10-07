import { LightningElement, track } from 'lwc'
import USER_ID from '@salesforce/user/Id'

export default class BaseDemoContainer extends LightningElement {
  @track currentUserId = USER_ID

  // Combobox
  @track cbSelected = 'inProgress'

  get cbOptions () {
    return [
      { label: 'New', value: 'new' },
      { label: 'In Progress', value: 'inProgress' },
      { label: 'Finished', value: 'finished' }
    ]
  }

  cbHandleChange ({ detail }) {
    this.cbSelected = detail.value
  }

  // Dual Listbox
  @track _dlSelected = []

  get dlOptions () {
    return [
      { label: 'English', value: 'en' },
      { label: 'German', value: 'de' },
      { label: 'Spanish', value: 'es' },
      { label: 'French', value: 'fr' },
      { label: 'Italian', value: 'it' },
      { label: 'Japanese', value: 'jp' },
      { label: 'Korean', value: 'kr' }
    ]
  }

  get dlSelected () {
    return this._dlSelected.length ? this._dlSelected : 'none'
  }

  dlHandleChange ({ detail }) {
    this._dlSelected = detail.value
  }

  // File Upload
  @track isUploaded = false

  handleUploadFinished () {
    this.isUploaded = true
  }

  // Formatted Date-Time
  get now () {
    return Date.now()
  }

  // Search Input
  @track searchTerm

  onSearchKeyup (event) {
    event.preventDefault()
    this.searchTerm = event.target.value
  }

  // Map
  @track markersTitle = 'These are my markers'
  @track mapMarkers = [
    {
      location: {
        Street: '5080 Spectrum Dr, Suite 650E',
        City: 'Addison',
        State: 'TX'
      },
      title: 'Slalom Dallas',
      description: 'The Slalom Dallas office in Addison, TX'
    },
    {
      location: {
        Street: '2200 N Lamar St',
        City: 'Dallas',
        State: 'TX'
      },
      title: 'Dallas House of Blues',
      description: 'HOB in Dallas'
    },
    {
      location: {
        Street: '3320 K Ave',
        City: 'Plano',
        State: 'TX'
      },
      title: 'Plano H Mart',
      description: 'Korean Grocer in Plano'
    },
    {
      location: {
        Street: '2059 Summer Lee Dr',
        City: 'Rockwall',
        State: 'TX'
      },
      title: 'The Harbor Rockwall',
      description: 'Park and Shopping Center'
    }
  ]

  // Radio Group
  @track rgSelected = ''

  get rgOptions () {
    return [
      { label: 'Ross', value: 'ross' },
      { label: 'Rachel', value: 'rachel' }
    ]
  }

  rgChanged ({ detail }) {
    this.rgSelected = detail.value
  }

  // Slider
  @track volume = 10

  onVolumeChanged ({ detail }) {
    this.volume = detail.value
  }
}
