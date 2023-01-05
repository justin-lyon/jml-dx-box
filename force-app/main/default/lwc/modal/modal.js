import { LightningElement, api, track } from "lwc";

const SIZE_OPTIONS = ["small", "medium", "large"];

export default class Modal extends LightningElement {
  @track _isShown = false;
  @api hideHeader = false;
  @api hideFooter = false;

  @track _size = "medium";

  @api
  set isShown(val) {
    this._isShown = val;

    if (this.isShown) {
      console.log("isShown", this.isShown);
      // todo trap focus
      console.log(
        JSON.parse(JSON.stringify([...this.querySelectorAll("*[tabindex]")]))
      );
      console.log(
        JSON.parse(JSON.stringify([...this.querySelectorAll(".focusable")]))
      );
    } else {
      console.log("isShown", this.isShown);
    }
  }
  get isShown() {
    return this._isShown;
  }

  @api
  set size(val) {
    if (!SIZE_OPTIONS.includes(val)) {
      throw new Error(
        `Property size expects values: ${SIZE_OPTIONS.join(", ")}`
      );
    }
    this._size = val;
  }
  get size() {
    return this._size;
  }

  constructor() {
    super();

    // bind click listener to template
    this.template.addEventListener("click", (event) => {
      console.log(
        "capture click",
        event.target.nodeName.toLowerCase(),
        event.target.classList
      );
      const name = event.target.nodeName.toLowerCase();
      const classList = [...event.target.classList];

      // if section.slds-modal or div.slds-modal_container
      if (
        (name === "section" && classList.includes("slds-modal")) ||
        (name === "div" && classList.includes("slds-modal__container"))
      ) {
        console.log("clicking in backdrop", name, classList);
        this.fireClosed();
      } else {
        console.log("clicking in modal", name, classList);
      }
    });
  }

  get sectionClass() {
    const classes = [];
    classes.push("slds-modal");

    if (this._size) {
      const sizeClass = `slds-modal_${this._size}`;
      classes.push(sizeClass);
    }

    if (this.isShown) {
      classes.push("slds-fade-in-open");
    }

    return classes.join(" ");
  }

  get headerClass() {
    const classes = [];
    classes.push("slds-modal__header");

    if (this.hideHeader) {
      classes.push("slds-modal__header_empty");
    }

    return classes.join(" ");
  }

  get backdropClass() {
    const classes = [];
    classes.push("slds-backdrop");

    if (this.isShown) {
      classes.push("slds-backdrop_open");
    }

    return classes.join(" ");
  }

  clickedClose() {
    this.fireClosed();
  }

  handleKeyup(event) {
    if (event.keyCode && event.keyCode === 27) {
      this.fireClosed();
    }
  }

  fireClosed() {
    const close = new CustomEvent("close");
    this.dispatchEvent(close);
  }
}
