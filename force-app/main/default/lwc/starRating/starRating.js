import { LightningElement, api, track } from "lwc";

const SIZES = [
  "xx-small",
  "x-small",
  "small",
  "medium",
  "large",
  "x-large",
  "xx-large"
];

export default class StarRating extends LightningElement {
  @track score = 0;
  @track maxScore = 5;
  @track stars = [];
  @api readOnly = false;
  @api activeColor = "#ffd055";
  @api inactiveColor = "#d8d8d8";

  @api
  get rating() {
    return this.score;
  }

  set rating(value) {
    this.score = value;
    this.generateStars();
  }

  @api
  get maxRating() {
    return this.maxScore;
  }

  set maxRating(value) {
    this.maxScore = Number(value);
  }

  _size = "small";
  @api
  get size() {
    return this._size;
  }

  set size(val) {
    if (!SIZES.includes(val)) {
      throw new Error(
        `Error in StarRating.js. Invalid value assigned to size attribute. Valid attributes are ${SIZES.join(
          ", "
        )}`
      );
    }
    this._size = val;
  }

  generateStars() {
    this.stars = [];
    for (let i = 1; i < this.maxRating + 1; i++) {
      const isActive = i <= this.score;
      const star = {
        id: i,
        isActive
      };
      this.stars.push(star);
    }
  }

  starClicked(event) {
    const clickedStar = event.detail;
    this.rating = clickedStar;
    this.ratingChanged();
  }

  ratingChanged() {
    const value = new CustomEvent("value", { detail: this.score });
    this.dispatchEvent(value);
  }

  connectedCallback() {
    this.generateStars();
  }
}
