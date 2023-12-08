import { LightningElement, api } from 'lwc';
import {
  subscribe as subToPlatformEvent,
  unsubscribe as unsubFromPlatformEvent,
  isEmpEnabled
} from 'lightning/empApi';
import { RefreshEvent } from 'lightning/refresh';

export default class RecordRefreshListener extends LightningElement {
  @api recordId;
  channelName = '/event/RecordUpdated__e';
  subscription = {};

  async connectedCallback() {
    if (!isEmpEnabled) {
      console.warn('emp is not enabled in this context', this.recordId);
      return;
    }

    await this.subscribe().catch((error) => {
      console.error('error', error);
    });
  }

  async disconnectedCallback() {
    await this.unsubscribe();
  }

  subscribe() {
    const callback = (response) => {
      const recordId = response.data.payload.RecordId__c;
      if (this.recordId === recordId) {
        this.dispatchEvent(new RefreshEvent());
      }
    };

    return subToPlatformEvent(this.channelName, -1, callback).then(
      (response) => {
        this.subscription = response;
      }
    );
  }

  unsubscribe() {
    return unsubFromPlatformEvent(this.subscription, (response) => {
      console.log('unsubscribed', JSON.stringify(response));
      this.subscription = null;
    });
  }
}
