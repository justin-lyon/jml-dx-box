import { LightningElement } from 'lwc'
import debouncify from 'c/debouncify'

export default class WipContainer extends LightningElement {
  doThingLater = debouncify(() => {
    this.makeLog('thing is done later')
  }, 1000)

  doThingEvenLater = debouncify(() => {
    this.makeLog('thing is done EVEN later')
  }, 2000)

  clickButton () {
    console.log('click')
    this.doThingLater()
    this.doThingEvenLater()
  }

  makeLog (message) {
    console.log(message)
  }
}
