import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter {
  constructor() {
    super();

    this.setUpSizes();

    window.addEventListener("resize", () => {
      this.setUpSizes();
      this.trigger("resize");
    });
  }

  setUpSizes() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.mobileSize = this.width < 1200 ? true : false;
  }
}
