import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getOneRecordById from "@salesforce/apex/LookupAuraService.getOneRecordById";
import getRecent from "@salesforce/apex/LookupAuraService.getRecent";
import getRecords from "@salesforce/apex/LookupAuraService.getRecords";

const ARROW_UP = "ArrowUp";
const ARROW_DOWN = "ArrowDown";
const ENTER = "Enter";
const ESCAPE = "Escape";
const ACTIONABLE_KEYS = [ARROW_UP, ARROW_DOWN, ENTER, ESCAPE];

export default class Lookup extends LightningElement {
  _connected = false;

  selectedId = null;
  value = "";

  records = [];
  focused = false;
  record = null;
  error = null;
  activeId = null;

  get displayValue() {
    return this.value;
  }
  set displayValue(v) {
    this.value = v;
  }

  @api sobjectName;
  @api iconName;
  @api name;

  @api fieldLabel = "Search";
  @api title = "Name";
  @api subtitle = "Id";
  @api minimumCharacterSearchDebounce = 2;
  @api readOnly = false;
  @api required = false;
  @api messageWhenInputError = "This field is required.";

  _defaultRecordId = null;
  @api
  get defaultRecordId() {
    return this._defaultRecordId;
  }
  set defaultRecordId(value) {
    if (value === this._defaultRecordId) return;

    this._defaultRecordId = value;

    if (value !== null) {
      this.requestOneById();
    }
  }

  @api checkValidity() {
    const isRequired = this.required;
    const hasSelection = !!this.selectedId;
    // Either its NOT required, and we exit with truthy.
    // OR it IS required, and we then must have a selection.
    return !isRequired || hasSelection;
  }

  @api reportValidity() {
    const isValid = this.checkValidity();
    this.error = isValid ? {} : { message: this.messageWhenInputError };
    return isValid;
  }

  connectedCallback() {
    if (!this.defaultRecordId) {
      this.requestRecent();
    }

    this._connected = true;
  }

  get searchInput() {
    return this.template.querySelector("#searchInput");
  }

  get isReadOnly() {
    return this.readOnly || this.record;
  }
  get showListbox() {
    return this.focused && this.records.length > 0 && !this.record;
  }
  get showClear() {
    return (
      !this.readOnly && (this.record || (!this.record && this.value.length > 0))
    );
  }
  get hasError() {
    return this.error ? this.error.message : "";
  }
  get recordIds() {
    return this.records.map((r) => r.Id);
  }

  get containerClasses() {
    const classes = ["slds-combobox_container"];

    if (this.record) {
      classes.push("slds-has-selection");
    }

    return classes.join(" ");
  }

  get inputClasses() {
    const classes = ["slds-input", "slds-combobox__input"];

    if (this.record) {
      classes.push("slds-combobox__input-value");
    }

    return classes.join(" ");
  }

  get comboboxClasses() {
    const classes = [
      "slds-combobox",
      "slds-dropdown-trigger",
      "slds-dropdown-trigger_click"
    ];

    if (this.showListbox) {
      classes.push("slds-is-open");
    }
    if (this.hasError) {
      classes.push("slds-has-error");
    }

    return classes.join(" ");
  }

  onKeyup(event) {
    if (this.readOnly) return;
    const searchTerm = event.target.value;
    this.value = searchTerm;

    this.error = null;

    const keyAction = {
      ArrowUp: () => {
        this.cycleActive(false);
      },
      ArrowDown: () => {
        this.cycleActive(true);
      },
      Enter: () => {
        this.selectItem();
      },
      Escape: () => {
        this.clearSelection();
      }
    };

    if (ACTIONABLE_KEYS.includes(event.code)) {
      keyAction[event.code]();
    } else {
      if (searchTerm.length >= this.minimumCharacterSearchDebounce) {
        this.debounceSearch(searchTerm);
      } else if (searchTerm.length === 0) {
        this.records = [];
        this.requestRecent();
      } else {
        this.error = {
          message: `Please enter ${this.minimumCharacterSearchDebounce} or more characters.`
        };
      }
    }
  }

  handleSelected(event) {
    this.selectedId = event.detail;
    this.record = this.records.find((record) => record.Id === this.selectedId);
    this.displayValue = this.record[this.title];
    this.fireSelected();
  }

  search(searchTerm) {
    const searcher = this.getSearcher(searchTerm);
    this.error = null;

    getRecords({ searcher })
      .then((data) => {
        const newData = JSON.parse(data);
        this.records = newData.flat().sort((a, b) => this.sortAlpha(a, b));
        this.initActiveId();

        if (this.records.length === 0) {
          this.fireToast({
            title: "Info",
            variant: "info",
            message: "No records found, please refine your search."
          });
        }
      })
      .catch((error) => {
        console.error("Error searching records: ", error);
        this.error = error;
      });
  }

  debounceSearch(searchTerm) {
    window.clearTimeout(this.delaySearch);
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.delaySearch = setTimeout(() => {
      this.search(searchTerm);
    }, 300);
  }

  requestOneById() {
    const searcher = this.getSearcher();
    this.error = null;

    getOneRecordById({ searcher, recordId: this.defaultRecordId })
      .then((data) => {
        const records = JSON.parse(data);
        this.records = records;
        this.record = records[0];
        this.selectedId = this.record.Id;
        this.displayValue = this.record[this.title];
      })
      .catch((error) => {
        console.error("Error getting record by Id", error);
        this.error = error;
      });
  }

  requestRecent() {
    const searcher = this.getSearcher();
    this.error = null;

    getRecent({ searcher })
      .then((data) => {
        this.records = JSON.parse(data);
        this.initActiveId();
      })
      .catch((error) => {
        console.error("Error requesting recents", error);
        this.error = error;
      });
  }

  initActiveId() {
    if (this.records.length > 0) {
      this.activeId = this.records[0].Id;
    }
  }

  clearSelection() {
    this.selectedId = null;
    this.record = null;
    this.displayValue = "";
    this.error = null;
    this.requestRecent();
    this.fireSelected();
    this.reportValidity();
  }

  fireSelected() {
    const selected = new CustomEvent("selected", {
      detail: { value: this.selectedId }
    });
    this.dispatchEvent(selected);
  }

  cycleActive(forwards) {
    const currentIndex = this.recordIds.indexOf(this.activeId);
    if (currentIndex === -1 || currentIndex === this.records.length) {
      this.activeId = this.recordIds[0];
    } else if (!forwards && currentIndex === 0) {
      this.activeId = this.recordIds[this.recordIds.length - 1];
    } else if (forwards) {
      this.activeId = this.recordIds[currentIndex + 1];
    } else {
      this.activeId = this.recordIds[currentIndex - 1];
    }
  }

  selectItem() {
    if (!this.records || this.records.length === 0) return;

    const listbox = this.template.querySelector("c-listbox");
    listbox.selectItem();
  }

  setFocus(event) {
    this.focused = event.type === "focus";
    if (event.type === "blur") {
      this.reportValidity();
    }
  }

  getSearcher(searchTerm) {
    return {
      searchTerm: searchTerm || "",
      objectName: this.sobjectName,
      fields: [this.title, this.subtitle]
    };
  }

  sortAlpha(a, b) {
    const aName = a[this.title].toLowerCase();
    const bName = b[this.title].toLowerCase();

    if (aName < bName) return -1;
    if (aName > bName) return 1;

    return 0;
  }

  fireToast(notification) {
    const toast = new ShowToastEvent(notification);
    this.dispatchEvent(toast);
  }
}
