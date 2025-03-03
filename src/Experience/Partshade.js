import * as THREE from "three";
import Experience from "./Experience";

import backgroundVertexShader from "../shaders/background/vertexShader.glsl";
import backgroundFragmentShader from "../shaders/background/fragmentShader.glsl";
import firefliesVertexShader from "../shaders/fireflies/vertexShader.glsl";
import firefliesFragmentShader from "../shaders/fireflies/fragmentShader.glsl";

export default class Partshade {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.elapsedTime = this.experience.time.elapsed;

    this.setUpGradientBackground();
    this.setUpParticles();
  }

  setUpGradientBackground() {
    this.pallete = [
      new THREE.Color("#000000"),
      new THREE.Color("#000000"),
      new THREE.Color("#000000"),
      new THREE.Color("#000000"),
      new THREE.Color("#044336"),
    ];

    //? BACKGROUND

    this.backgroundMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        uColor: { value: this.pallete },
        resolution: { value: new THREE.Vector4() },
      },
      vertexShader: backgroundVertexShader,
      fragmentShader: backgroundFragmentShader,
    });

    this.geometry = new THREE.PlaneGeometry(20, 25, 100, 100);

    this.plane = new THREE.Mesh(this.geometry, this.backgroundMaterial);
    this.plane.position.set(0, -8, -2);
    this.scene.add(this.plane);
    //??
  }

  setUpParticles() {
    this.firefliesGeometry = new THREE.BufferGeometry();
    this.firefliesCount = 350;
    this.positionArray = new Float32Array(this.firefliesCount * 3);
    this.scaleArray = new Float32Array(this.firefliesCount * 1);

    for (let i = 0; i < this.firefliesCount; i++) {
      this.positionArray[i * 3 + 0] = Math.random() * 8;
      this.positionArray[i * 3 + 1] = Math.random() * 24;
      this.positionArray[i * 3 + 2] = Math.random() * 8;

      this.scaleArray[i] = Math.random();
    }

    this.firefliesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positionArray, 3)
    );

    this.firefliesGeometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(this.positionArray, 3)
    );

    this.firefliesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 15 },
      },

      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      vertexShader: firefliesVertexShader,
      fragmentShader: firefliesFragmentShader,
    });

    this.fireflies = new THREE.Points(
      this.firefliesGeometry,
      this.firefliesMaterial
    );

    this.fireflies.position.set(-4, -21, -2);
    this.scene.add(this.fireflies);
  }

  resize() {
    if (this.fireflies) {
      this.fireflies.material.uniforms.uPixelRatio.value = Math.min(
        window.devicePixelRatio,
        2
      );
    }
  }

  update() {
    this.elapsedTime = this.experience.time.elapsed;
    // console.log(this.elapsedTime);
    this.backgroundMaterial.uniforms.time.value = this.elapsedTime * 0.000015;

    if (this.fireflies) {
      this.fireflies.material.uniforms.uTime.value = this.elapsedTime * 0.0001;
    }
  }
}
