import { ShowToastEvent } from "lightning/platformShowToastEvent";

let component = null;

const init = (cmp) => {
  component = cmp;
};

const toast = (title, message, variant, mode) => {
  if (!component) {
    throw new Error("Component is null. Call init with `this`.");
  }

  const event = new ShowToastEvent({
    title,
    message,
    variant,
    mode
  });

  component.dispatchEvent(event);
};

const error = (title, message) => {
  toast(title, message, "error", "sticky");
};

const warning = (title, message) => {
  toast(title, message, "warning", "pester");
};

const success = (title, message) => {
  toast(title, message, "success", "dismissible");
};

const info = (title, message) => {
  toast(title, message, "info", "dismissible");
};

export { init, error, warning, success, info };
