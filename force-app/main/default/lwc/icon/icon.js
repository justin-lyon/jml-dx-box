import { LightningElement, api } from 'lwc'

const SIZES = [
  'xx-small',
  'x-small',
  'small',
  'medium',
  'large',
  'x-large',
  'xx-large'
]

export default class Icon extends LightningElement {
  @api resourceUrl
  @api resourcePath
  @api iconName
  @api fill

  _size = 'small'
  @api
  get size () { return this._size }

  set size (val) {
    if (!SIZES.includes(val)) {
      throw new Error(`Error in icon.js. Invalid value assigned to size attribute. Valid attributes are ${SIZES.join(', ')}`)
    }
    this._size = val
  }

  get icon () {
    const parts = [this.resourceUrl]
    if (this.resourcePath) {
      parts[0] += `/${this.resourcePath}`
    }
    return `${parts.join('/')}#${this.iconName}`
  }

  get classList () {
    const classes = []
    classes.push(this.size)
    return classes.join(' ')
  }

  get color () {
    return `fill: ${this.fill};`
  }
}
