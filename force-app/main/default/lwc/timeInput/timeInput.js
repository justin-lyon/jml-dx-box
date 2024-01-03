import { LightningElement, api } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';
import TIME_ZONE from '@salesforce/i18n/timeZone';
import { DateTime } from 'c/luxon';

import { hourOptions, minuteOptions, meridiemOptions } from './options';

const locale = 'en-US';
const timezone = TIME_ZONE; // IANA Timezones ex: America/New_York or Asia/Seoul
const getDefaultDateTime = (meridiem) => {
  const hour = meridiem === 'AM' ? 6 : 18;
  return DateTime.fromObject(
    {
      hour,
      minute: '00'
    },
    { zone: timezone }
  );
};

export default class TimeInput extends LightningElement {
  @api defaultDateTime;
  @api defaultMeridiem = 'AM';
  @api required = false;
  @api maxWidth = 400;
  @api label = 'Placeholder Label';
  @api isDefaultNow = false;

  startingDate;
  selectedHour = '6';
  selectedMinute = '00';
  selectedMeridiem = 'AM';

  // BEGIN OUTPUT VARS
  @api
  get timeValue() {
    return this._value.toLocaleString(DateTime.TIME_24_SIMPLE);
  }
  set timeValue(newValue) {
    // This is an output only value, no setter required
    // However, there is an aura prod debug error when the value changes
    // because the LWC framework is trying to set something here
    // Error: [LWC error]: Invalid attempt to set a new value for property "timeValue" that
    // does not has a setter decorated with @api.
  }

  _value = null;
  @api
  get value() {
    return this._value.toUTC();
  }
  set value(newValue) {
    if (newValue === this._value) {
      return;
    }

    this._value = newValue;
    this.emitChanged();
  }
  // END OUTPUT VARS

  get hourOptions() {
    return hourOptions;
  }
  get minuteOptions() {
    return minuteOptions;
  }
  get meridiemOptions() {
    return meridiemOptions;
  }

  connectedCallback() {
    this.initStartingDatetime();
  }

  renderedCallback() {
    this.initCSSVariables();
  }

  initStartingDatetime() {
    const hasDefaultDateTime = this.defaultDateTime !== undefined;
    const defaultDate = (
      hasDefaultDateTime
        ? DateTime.fromISO(this.defaultDateTime)
        : getDefaultDateTime(this.defaultMeridiem)
    )
      .setLocale(locale)
      .setZone(timezone);
    const parts = defaultDate
      .setLocale(locale)
      .setZone(timezone)
      .toLocaleParts(DateTime.DATETIME_SHORT);
    const { year, month, day } = defaultDate;
    this.startingDate = DateTime.fromObject({
      year,
      month,
      day
    });

    const findByType = (key) => parts.find((i) => i.type === key).value;
    this.selectedHour = findByType('hour');
    this.selectedMinute = findByType('minute');
    this.selectedMeridiem = findByType('dayPeriod');
    this._value = defaultDate.toUTC();
  }

  initCSSVariables() {
    const css = this.template.host.style;
    css.setProperty('--maxWidth', `${this.maxWidth}px`);
  }

  onHourChanged(e) {
    const newValue = e.target.value;
    if (newValue === this.selectedHour) {
      return;
    }
    this.selectedHour = newValue;

    this.calculateNewValue();
  }

  onMinuteChanged(e) {
    const newValue = e.target.value;
    if (newValue === this.selectedMinute) {
      return;
    }
    this.selectedMinute = newValue;

    this.calculateNewValue();
  }

  onMeridiemChanged(e) {
    const newValue = e.target.value;
    if (newValue === this.selectedMeridiem) {
      return;
    }
    this.selectedMeridiem = newValue;

    this.calculateNewValue();
  }

  calculateNewValue() {
    const hour = this.getMilitaryHour(this.selectedHour, this.selectedMeridiem);
    const minute = this.selectedMinute;
    const { year, month, day } = this.startingDate;
    const dateObj = {
      year,
      month,
      day,
      hour,
      minute
    };
    const newDatetime = DateTime.fromObject(dateObj, {
      zone: timezone,
      locale
    });

    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.value = newDatetime;
  }

  getMilitaryHour(hourString, meridiem) {
    const isAM = meridiem === 'AM';
    const hour = Number(hourString);
    let militaryHour = hour;

    if (!isAM) {
      militaryHour = hour + 12;
    }

    return militaryHour.toString().padStart(2, '0');
  }

  emitChanged() {
    const valueChangedEvent = new FlowAttributeChangeEvent('value', this.value);
    this.dispatchEvent(valueChangedEvent);

    const timeChangedEvent = new FlowAttributeChangeEvent(
      'timeValue',
      this.timeValue
    );
    this.dispatchEvent(timeChangedEvent);
  }
}
