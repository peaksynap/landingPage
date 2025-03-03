import * as THREE from "three";
import Experience from "./Experience";
import { WebGLRenderer } from "three";
import {
  SelectiveBloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
} from "postprocessing";

import gsap from "gsap";

export default class Renderer {
  constructor() {
    this.experience = new Experience();

    this.sizes = this.experience.size;
    this.canvas = this.experience.canvas;
    this.scene = this.experience.scene;
    this.mobileSize = this.experience.size.mobileSize;
    this.camera = this.experience.camera.instance;
    this.controls = this.experience.camera.controls;

    this.world = this.experience.world;

    this.setUpRenderer();

    //? after resources are ready
    this.experience.resources.on("resourcesReady", () => {
      this.bloomModels = this.world.bloomModels;

      this.bloomEffect.selection.set(this.bloomModels);
    });
  }

  setUpRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      powerPreference: "high-performance",
      antialias: false,
      stencil: false,
      depth: false,
    });

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
    this.renderer.setClearColor("#000000");
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    //? bloom effect

    this.bloomEffect = new SelectiveBloomEffect(this.scene, this.camera, {
      intensity: 5,
      mipmapBlur: true,
      luminanceThreshold: 0,
      luminanceSmoothing: 0.2,
      radius: 0.618,
      resolutionScale: 4,
    });

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(new EffectPass(this.camera, this.bloomEffect));
  }

  resize() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);

    this.composer.setSize(this.sizes.width, this.sizes.height);
  }

  setDebugger() {
    if (this.experience.debug.active) {
      this.rendererDebug =
        this.experience.debug.gui.addFolder("renderer-Debug");

      this.rendererDebug
        .add(this.renderer, "toneMappingExposure")
        .min(0)
        .max(10)
        .step(0.05)
        .onChange(() => {});

      this.rendererDebug.add(this.renderer, "toneMapping", {
        NoToneMapping: THREE.NoToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        Linear: THREE.LinearToneMapping,
      });

      this.rendererDebug
        .add(this.bloomEffect, "intensity")
        .min(0)
        .max(10)
        .step(0.01);
    }
  }

  update() {
    //? normal renderer no lights no bloom effect
    // this.renderer.render(this.scene, this.camera);

    //? so it has bloom effect
    this.composer.render(this.scene, this.camera);
  }
}
