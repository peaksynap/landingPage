import Experience from "./Experience";

export default class Parallax {
  constructor() {
    this.experience = new Experience();
    this.size = this.experience.size;
    this.camera = this.experience.camera.instance;
    this.cameraGroup = this.experience.camera.instanceGroup;

    this.time = this.experience.time;
    this.scrollY = window.scrollY;
    this.cursor = {};
    this.cursor.x = 0;
    this.cursor.y = 0;

    this.parallaxX = null;
    this.parallaxY = null;

    window.addEventListener("scroll", () => {
      this.scrollY = window.scrollY;
    });

    window.addEventListener("mousemove", (mouse) => {
      this.cursor.x = mouse.clientX / this.size.width - 0.5;
      this.cursor.y = mouse.clientY / this.size.height - 0.5;
    });
  }

  update() {
    if (this.size.width > 778) {
      this.parallaxX = this.cursor.x * 0.25;
      this.parallaxY = -this.cursor.y * 0.25;
      this.cameraGroup.rotation.x +=
        (this.parallaxX - this.cameraGroup.rotation.x) *
        0.005 *
        this.time.delta;
      this.cameraGroup.rotation.y +=
        (this.parallaxY - this.cameraGroup.rotation.y) *
        0.005 *
        this.time.delta;
    }
  }
}
