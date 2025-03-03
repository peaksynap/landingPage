import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Experience from "./Experience";

import Partshade from "./Partshade";
import vertexShader from "../shaders/particle/vertexShader.glsl";
import fragmentShader from "../shaders/particle/fragmentShader.glsl";

//? slective bloom

export default class World {
  constructor() {
    this.experience = new Experience();

    this.debug = this.experience.debug;
    this.size = this.experience.size;
    this.time = this.experience.time;

    this.scene = this.experience.scene;
    this.sizes = this.experience.size;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera.instance;
    this.controls = this.experience.camera.controls;

    //? 3d models
    this.brain = null;
    this.fMolecule = null;
    this.sMolecule = null;
    this.bloomModels = [];

    gsap.registerPlugin(ScrollTrigger);

    //! HTML
    this.html = this.experience.html;

    this.bg = this.html.bg;

    this.languageCon = document.querySelector(".language");

    this.redColor = new THREE.Color(0x01d87d);

    this.greenColor = new THREE.Vector3(0.114, 0.9, 0.251);

    this.parallax = this.experience.parallax;

    this.debugSettings = {
      objectActive: true,
      myProperty: () => {
        if (this.scene.background) {
          this.scene.background = false;
        } else {
          this.scene.background = this.environmentTexture;
        }
      },

      stopObjectRotation: () => {
        if (this.debugSettings.objectActive) {
          this.debugSettings.objectActive = false;
        } else {
          this.debugSettings.objectActive = true;
        }
      },
    };

    this.setUpScene();

    //? parallax
    this.cursor = {};
    this.cursor.x = 0;
    this.cursor.y = 0;
    window.addEventListener("mousemove", (mouse) => {
      this.cursor.x = mouse.clientX / this.size.width - 0.5;
      this.cursor.y = mouse.clientY / this.size.height - 0.5;
    });

    //? molecule material
    this.whiteMoleculeMaterial = new THREE.MeshBasicMaterial({
      color: 0xf5f5f5,
    });

    //? line gradients
    this.synapFirstMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor2: { value: new THREE.Vector3(0, 0, 0) },
        uColor1: { value: new THREE.Vector3(0.086, 0.769, 0.998) },
        uThreshold: { value: 0 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthWrite: true,
    });

    this.synapSecondMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor2: { value: new THREE.Vector3(0, 0, 0) },
        uColor1: { value: new THREE.Vector3(0.114, 0.9, 0.251) }, // ? try one
        uThreshold: { value: 0 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthWrite: true,
    });

    this.synapThirdMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor2: { value: new THREE.Vector3(0, 0, 0) },
        uColor1: { value: new THREE.Vector3(0.114, 0.9, 0.251) },
        uThreshold: { value: 0 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,

      depthWrite: true,
    });

    this.synapFourthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor2: { value: new THREE.Vector3(0, 0, 0) },
        uColor1: { value: new THREE.Vector3(0.086, 0.769, 0.998) },

        uThreshold: { value: 0 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthTest: false,

      depthWrite: true,
    });

    this.synapFiveMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor2: { value: new THREE.Vector3(0, 0, 0) },
        uColor1: { value: new THREE.Vector3(0.086, 0.769, 0.998) },
        uThreshold: { value: 0 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,

      depthWrite: true,
    });

    this.synapSixthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor2: { value: new THREE.Vector3(0, 0, 0) },
        uColor1: { value: new THREE.Vector3(0.086, 0.769, 0.998) },
        uThreshold: { value: 0 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthWrite: true,
    });
  }

  setUpScene() {
    this.resources.on("resourcesReady", () => {
      window.scrollTo(0, 0);
      //? background texture and fireflies/stars
      this.partShade = new Partshade();

      this.brainModel = this.resources.items.brainModel;
      this.brainModel.scene.traverse((e) => {
        if (e.type === "Mesh") {
          if (e.material.map) {
            this.texture = e.material.map;

            if (e.name.startsWith("brain")) {
              this.brain = e;
              e.material = new THREE.MeshBasicMaterial({
                map: this.texture,
                color: 0xaeea94,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide,
                depthWrite: true,
              });
            }
          }

          if (e.name.startsWith("fMolecule")) {
            this.fMolecule = e;
            this.bloomModels.push(e);

            e.material = new THREE.MeshBasicMaterial({
              color: 0x578fca,
              transparent: true,
              opacity: 0.8,
            });

            e.material = this.whiteMoleculeMaterial;
          }

          if (e.name.startsWith("sMolecule")) {
            this.sMolecule = e;
            this.bloomModels.push(e);
            e.material = this.whiteMoleculeMaterial;
          }

          if (e.name.startsWith("synap_first")) {
            this.bloomModels.push(e);
            e.material = this.synapFirstMaterial;
          }

          if (e.name.startsWith("synap_second")) {
            this.bloomModels.push(e);
            e.material = this.synapSecondMaterial;
          }

          if (e.name.startsWith("synap_third")) {
            this.bloomModels.push(e);
            e.material = this.synapThirdMaterial;
          }

          if (e.name.startsWith("synap_fourth")) {
            this.bloomModels.push(e);
            e.material = this.synapFourthMaterial;
          }

          if (e.name.startsWith("synap_five")) {
            this.bloomModels.push(e);
            e.material = this.synapFiveMaterial;
          }

          if (e.name.startsWith("synap_six")) {
            this.bloomModels.push(e);
            e.material = this.synapSixthMaterial;
          }
        }
      });

      if (this.size.mobileSize) {
        this.brainModel.scene.position.x = -0.09;
      } else {
        this.brainModel.scene.position.x = 0.25;
        this.brainModel.scene.position.y = -0.15;
      }
      this.brainModel.scene.rotation.y = Math.PI * 1.5;
      this.brainModel.scene.scale.set(0, 0, 0);
      this.scene.add(this.brainModel.scene);

      //? call scene animations
      this.mixer = new THREE.AnimationMixer(this.brainModel.scene); //?
      this.animations = this.brainModel.animations;
      this.fAction = this.mixer.clipAction(this.animations[0]);
      this.fAction.play();
      this.sAction = this.mixer.clipAction(this.animations[1]);
      this.sAction.play();

      //? user chooses
      this.languageCon.addEventListener("click", (e) => {
        if (e.target.classList.contains("english")) {
          this.html.chooseLanguage("english");
          this.starterAnimations();
        } else if (e.target.classList.contains("spanish")) {
          this.html.chooseLanguage("spanish");
          this.starterAnimations();
        }
      });

      // this.debugActive();
    });
  }

  //? animations that happen once the user clicks on the desired language
  starterAnimations() {
    this.backgroundtl = gsap.timeline();

    this.backgroundtl
      .to(this.bg, {
        yPercent: -100,
        duration: 2,
        ease: "power1.inOut",
        display: "none",
      })
      .to(this.camera.position, {
        z: 1,
        duration: 1.5,
        ease: "power1.inOut",
      })
      .to(
        this.brainModel.scene.scale,
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 2.25,
          // delay:0.5,
          ease: "back.out(1.2)",
        },
        "<"
      )

      .to(
        this.brainModel.scene.rotation,
        {
          y: 0,
          duration: 2.25,
          ease: "back.out(1.5)",
          onComplete: () => {
            //? start on scroll animations
            this.setScrollAnimations();
          },
        },
        "<"
      )
      .to("nav", {
        y: 0,
        duration: 1,
        opacity: 1,
        ease: 1,
      })

      .to(".first-header span", {
        opacity: 1,
        y: 0,
        stagger: 0.4,
        duration: 0.6,
        ease: "power1.inOut",
      })
      .to(".second-header span", {
        opacity: 1,
        stagger: 0.4,
        duration: 0.6,
        ease: "power1.inOut",
      })
      .to(
        ".beta-btn",
        {
          opacity: 1,
          duration: 1,
          y: 0,
          // ease: "power1.inOut",
          ease: "back.out(1.7)",
          onComplete: () => {
            document.querySelector("body").style.overflowY = "auto";
          },
        },
        " <"
      )
      .to(".circle", {
        opacity: 1,
        duration: 1,
      });
  }

  //? animations that happen when the user scroll
  setScrollAnimations() {
    this.mm = gsap.matchMedia();

    //? HOW THE SCROLL TRIGGER WILL WORK ON DEVICES BIGGER THAN 1350PX
    this.mm.add("(min-width:1350px)", () => {
      //? first section
      this.firstMoveTimeline = new gsap.timeline({
        scrollTrigger: {
          trigger: "#heading",
          start: "top top",
          endTrigger: ".first-header",
          scrub: 0.6,
        },
      });
      this.firstMoveTimeline
        .to(
          "#heading",
          {
            opacity: 0,
            x: -200,
          },
          "same"
        )
        .to(
          this.brainModel.scene.position,
          {
            x: -0.5,
            y: -0.25,
            z: 0,
            // scrub: 5,
          },
          "same"
        )
        .to(
          this.brainModel.scene.rotation,
          {
            y: Math.PI / 1.625,
          },
          "same"
        )
        .to(
          this.brainModel.scene.scale,
          {
            x: 1.5,
            y: 1.5,
            z: 1.5,
          },
          "same"
        )
        .to(
          this.synapFirstMaterial.uniforms.uThreshold,
          {
            value: 2,
          },
          "<"
        );

      gsap.to(this.fMolecule.material.color, {
        r: this.redColor.r,
        g: this.redColor.g,
        b: this.redColor.b,

        scrollTrigger: {
          trigger: ".first-about",
          start: "top 50%",
          end: "bottom 65%",
          // markers: true,
          scrub: 0.6,
        },
      });
      //? third timeline
      this.thirdMoveTimeline = new gsap.timeline({
        scrollTrigger: {
          trigger: "#heading-three",
          start: "20px 80%",
          end: "bottom 80%",

          scrub: 0.6,
        },
      })
        .to(this.brainModel.scene.position, {
          x: 0.1,
          y: -0.25,
          z: 0,
        })
        .to(
          this.brainModel.scene.rotation,
          {
            y: Math.PI,
          },
          "<"
        )
        .to(
          this.brainModel.scene.scale,
          {
            x: 1.5,
            y: 1.5,
            z: 1.5,
          },
          "<"
        )
        .to(
          this.brain.material,
          {
            opacity: 1,
          },
          "<"
        )
        .to(this.synapSecondMaterial.uniforms.uThreshold, {
          value: 2,
        });

      //? this.fourthTimeline
      this.fourthMoveTimeline = new gsap.timeline({
        scrollTrigger: {
          trigger: "#heading-four",
          start: "20px 80%",
          end: "bottom bottom",
          // markers: true,
          scrub: 0.6,
        },
      })
        .to(this.brainModel.scene.position, {
          x: -0.5,
          y: -0.25,
          z: 0,
        })
        .to(
          this.brainModel.scene.scale,
          {
            x: 1.5,
            y: 1.5,
            z: 1.5,
          },
          "<"
        )
        .to(
          this.brainModel.scene.rotation,
          {
            y: Math.PI / 1.625,
          },
          "<"
        )
        .to(
          this.brain.material,
          {
            opacity: 0.6,
          },
          "<"
        );

      this.fifthMoveTimeline = new gsap.timeline({
        scrollTrigger: {
          trigger: "#heading-five",
          start: "20px 80%",
          end: "bottom bottom",
          // markers: true,
          scrub: 0.6,
        },
      })
        .to(this.brainModel.scene.rotation, {
          z: 0.25,
        })
        .to(
          this.synapThirdMaterial.uniforms.uThreshold,
          {
            value: 2,
          },
          "<"
        )

        .to(
          this.startLines,
          {
            third: true,
          },
          "<"
        );

      //? SIXTH
      this.sixthMoveTimeline = new gsap.timeline({
        scrollTrigger: {
          trigger: "#heading-six",
          start: "20px 80%",
          end: "bottom bottom",
          // markers: true,
          scrub: 0.6,
        },
      })
        .to(this.brainModel.scene.rotation, {
          z: 0.5,
        })
        .to(
          this.synapFirstMaterial.uniforms.uColor1.value,
          {
            x: this.greenColor.x,
            y: this.greenColor.y,
            z: this.greenColor.z,
          },
          "<"
        )
        .to(
          this.synapFourthMaterial.uniforms.uThreshold,
          {
            value: 2,
          },
          "<"
        );

      //? seventh
      this.seventhMoveTimeline = new gsap.timeline({
        scrollTrigger: {
          trigger: "#heading-seven",
          start: "20px 80%",
          end: "bottom bottom",
          // markers: true,
          scrub: 0.6,
        },
      })
        .to(this.brainModel.scene.rotation, {
          z: 0.75,
        })
        .to(
          this.brainModel.scene.scale,
          {
            x: 1.4,
            y: 1.4,
            z: 1.4,
          },
          "<"
        )
        .to(
          this.synapFourthMaterial.uniforms.uColor1.value,
          {
            x: this.greenColor.x,
            y: this.greenColor.y,
            z: this.greenColor.z,
          },
          "<"
        )
        .to(
          this.synapFiveMaterial.uniforms.uThreshold,
          {
            value: 2,
          },
          "<"
        );

      //? eight
      this.eightMoveTimeline = new gsap.timeline({
        scrollTrigger: {
          trigger: "#heading-eight",
          start: "20px 80%",
          end: "bottom bottom",
          // markers: true,
          scrub: 0.6,
        },
      })
        .to(this.brainModel.scene.rotation, {
          z: 0.99,
        })
        .to(
          this.brainModel.scene.scale,
          {
            x: 1.35,
            y: 1.35,
            z: 1.35,
          },
          "<"
        )
        .to(
          this.synapFiveMaterial.uniforms.uColor1.value,
          {
            x: this.greenColor.x,
            y: this.greenColor.y,
            z: this.greenColor.z,
          },
          "<"
        )
        .to(
          this.synapSixthMaterial.uniforms.uThreshold,
          {
            value: 2,
          },
          "<"
        );

      this.htmlScrollAnimationsLarge();
    });

    //? HOW THE SCROLL TRIGGER WILL WORK ON DEVICES LOWER THAN 1350PX -- PHONES/TABLETS
    this.mm.add("(max-width:1200px)", () => {
      this.firstMoveTimeline = new gsap.timeline({
        scrollTrigger: {
          trigger: "#heading",
          start: "top top",
          end: "bottom 60%",
          endTrigger: ".first-header",
          scrub: 0.6,
        },
      });

      this.firstMoveTimeline
        .to(
          this.brainModel.scene.rotation,
          {
            y: Math.PI / 2,
            z: 0.12,
          },
          "same"
        )
        .to(
          this.brainModel.scene.position,
          {
            y: 0.05,
            x: 0,
          },
          "same"
        )
        .to(
          this.brainModel.scene.scale,
          {
            x: 1.25,
            y: 1.25,
            z: 1.25,
          },
          "same"
        )
        .to(
          this.synapFirstMaterial.uniforms.uThreshold,
          {
            value: 2,
          },
          "<"
        );

      //? third timeline
      this.thirdMoveTimeline = new gsap.timeline({
        scrollTrigger: {
          trigger: "#heading-three",
          start: "top 90%",
          end: "bottom 90%",
          // markers: true,
          scrub: 0.6,
        },
      })
        .to(this.brainModel.scene.position, {
          x: 0.075,
        })
        .to(
          this.brainModel.scene.rotation,
          {
            y: Math.PI,
          },
          "<"
        )
        .to(
          this.brainModel.scene.scale,
          {
            x: 1,
            y: 1,
            z: 1,
          },
          "<"
        )
        .to(
          this.brain.material,
          {
            opacity: 1,
          },
          "<"
        )
        .to(this.synapSecondMaterial.uniforms.uThreshold, {
          value: 2,
        });

      this.fourthMoveTimeline = new gsap.timeline({
        scrollTrigger: {
          trigger: "#heading-four",
          start: "20px 80%",
          end: "bottom bottom",
          // markers: true,
          scrub: 0.6,
        },
      })

        .to(
          this.brainModel.scene.scale,
          {
            x: 1.25,
            y: 1.25,
            z: 1.25,
          },
          "<"
        )
        .to(
          this.brainModel.scene.position,
          {
            y: 0.05,
            x: 0,
          },
          "<"
        )
        .to(
          this.brainModel.scene.rotation,
          {
            y: Math.PI / 2,
            z: 0.12,
          },
          "<"
        )
        .to(
          this.brain.material,
          {
            opacity: 0.4,
          },
          "<"
        );

      this.fifthMoveTimeline = new gsap.timeline({
        scrollTrigger: {
          trigger: "#heading-five",
          start: "20px 80%",
          end: "bottom bottom",
          // markers: true,
          scrub: 0.6,
        },
      })
        .to(this.brainModel.scene.rotation, {
          z: 0.25,
        })
        .to(
          this.synapThirdMaterial.uniforms.uThreshold,
          {
            value: 2,
          },
          "<"
        );

      //? SIXTH
      this.sixthMoveTimeline = new gsap.timeline({
        scrollTrigger: {
          trigger: "#heading-six",
          start: "20px 80%",
          end: "bottom bottom",
          // markers: true,
          scrub: 0.6,
        },
      })
        .to(this.brainModel.scene.rotation, {
          z: 0.5,
        })
        .to(
          this.synapFourthMaterial.uniforms.uThreshold,
          {
            value: 2,
          },
          "<"
        )
        .to(
          this.synapFirstMaterial.uniforms.uColor1.value,
          {
            x: this.greenColor.x,
            y: this.greenColor.y,
            z: this.greenColor.z,
          },
          "<"
        );

      //? seventh
      this.seventhMoveTimeline = new gsap.timeline({
        scrollTrigger: {
          trigger: "#heading-seven",
          start: "20px 80%",
          end: "bottom bottom",
          // markers: true,
          scrub: 0.6,
        },
      })
        .to(this.brainModel.scene.rotation, {
          z: 0.75,
        })
        .to(
          this.synapFiveMaterial.uniforms.uThreshold,
          {
            value: 2,
          },
          "<"
        )
        .to(
          this.synapFourthMaterial.uniforms.uColor1.value,
          {
            x: this.greenColor.x,
            y: this.greenColor.y,
            z: this.greenColor.z,
          },
          "<"
        );
      // .to(
      //   this.brainModel.scene.scale,
      //   {
      //     x: 1.4,
      //     y: 1.4,
      //     z: 1.4,
      //   },
      //   "<"
      // );

      //? eight
      this.eightMoveTimeline = new gsap.timeline({
        scrollTrigger: {
          trigger: "#heading-eight",
          start: "20px 80%",
          end: "bottom bottom",
          // markers: true,
          scrub: 0.6,
        },
      })
        .to(this.brainModel.scene.rotation, {
          z: 0.99,
        })
        .to(
          this.brainModel.scene.scale,
          {
            x: 1.15,
            y: 1.15,
            z: 1.15,
          },
          "<"
        )
        .to(
          this.synapSixthMaterial.uniforms.uThreshold,
          {
            value: 2,
          },
          "<"
        )
        .to(
          this.synapFiveMaterial.uniforms.uColor1.value,
          {
            x: this.greenColor.x,
            y: this.greenColor.y,
            z: this.greenColor.z,
          },
          "<"
        );

      this.htmlScrollAnimationsSmall();
    });
  }

  //? how the html will behave when the user is viewing in desktop
  htmlScrollAnimationsLarge() {
    //? ABOUT
    gsap.to(".first-about", {
      opacity: 1,
      scrollTrigger: {
        trigger: ".first-about",
        start: "top 50%",
        end: "bottom 65%",
        // markers: true,
        scrub: 0.6,
      },
    });

    gsap.to(".second-about", {
      opacity: 1,
      scrollTrigger: {
        trigger: ".second-about",
        start: "-100px 50%",
        end: "bottom 65%",
        // markers: true,
        scrub: 0.6,
      },
    });
    //? MONETIZED
    this.monetizeCons = gsap.utils.toArray(".monetize");

    this.monetizeCons.forEach((con, i) => {
      gsap.to(con, {
        opacity: 1,
        x: 0,

        scrollTrigger: {
          trigger: con,
          start: "150px 80%",
          end: "+=50",
          // markers: true,
          scrub: 0.6,
        },
      });
    });

    //? targetSegmentsCon

    this.targetSegmentsCon = gsap.utils.toArray(".target-segment");

    this.targetSegmentsCon.forEach((con, i) => {
      gsap.to(con, {
        opacity: 1,
        scrollTrigger: {
          trigger: con,
          start: "+300px 80%",
          end: "bottom 95%",
          // markers: true,
          scrub: 0.6,
        },
      });
    });

    this.appSocialsCon = gsap.utils.toArray(".app-socials");

    this.appSocialsCon.forEach((con, i) => {
      gsap.to(con, {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: con,
          start: "top 70%",
          end: "+=50",
          // markers: true,
          scrub: 0.6,
        },
      });
    });

    gsap.to(".faq", {
      opacity: 1,
      x: 0,
      scrollTrigger: {
        trigger: ".faq",
        start: "top 65%",
        end: "+=50",

        scrub: 0.6,
      },
    });

    this.faqQuestionsCon = gsap.utils.toArray(".faq-question");

    this.faqQuestionsCon.forEach((con, i) => {
      gsap.to(con, {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: con,
          start: "top 60%",
          end: "+=50",

          scrub: 0.6,
        },
      });
    });

    //? contact-con
    gsap.to(".contact-con", {
      opacity: 1,
      x: 0,
      scrollTrigger: {
        trigger: ".contact-con",
        start: "top 45%",
        end: "+=50",
        scrub: 0.6,
      },
    });
  }

  //? how the  html will behave when the user is viewing in mobile
  htmlScrollAnimationsSmall() {
    gsap.to("#heading", {
      opacity: 0,
      scrollTrigger: {
        trigger: "#heading-two",
        start: "top 95%",
        end: "top 70%",
        scrub: 0.6,
      },
    });

    //? ABOUT
    gsap.to(".first-about", {
      opacity: 0,
      // x: -20,
      scrollTrigger: {
        trigger: ".first-about",
        start: "top 50%",
        end: "bottom 65%",
        // markers: true,
        scrub: 0.6,
      },
    });
    gsap.to(".second-about", {
      opacity: 0,
      // x: -20,
      scrollTrigger: {
        trigger: ".second-about",
        start: "top 50%",
        end: "bottom 65%",
        // markers: true,
        scrub: 0.6,
      },
    });
    //? MONETIZED
    this.monetizeCons = gsap.utils.toArray(".monetize");

    this.monetizeCons.forEach((con, i) => {
      gsap.to(con, {
        opacity: 0,
        // x: -125,

        scrollTrigger: {
          trigger: con,
          start: "top 55%",
          end: "bottom 55%",
          // markers: true,+
          scrub: 0.6,
        },
      });
    });

    //? targetSegmentsCon

    this.targetSegmentsCon = gsap.utils.toArray(".target-segment");

    this.targetSegmentsCon.forEach((con, i) => {
      gsap.to(con, {
        opacity: 0,

        scrollTrigger: {
          trigger: con,
          start: "center 30%",
          end: "bottom 70%",

          scrub: 0.6,
        },
      });
    });

    this.appSocialsCon = gsap.utils.toArray(".app-socials");

    this.appSocialsCon.forEach((con, i) => {
      gsap.to(con, {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: con,
          start: "top 70%",
          end: "+=50",
          // markers: true,
          scrub: 0.6,
        },
      });
    });

    gsap.to(".faq", {
      opacity: 1,
      x: 0,
      scrollTrigger: {
        trigger: ".faq",
        start: "top 65%",
        end: "+=50",

        scrub: 0.6,
      },
    });

    this.faqQuestionsCon = gsap.utils.toArray(".faq-question");

    this.faqQuestionsCon.forEach((con, i) => {
      gsap.to(con, {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: con,
          start: "top 60%",
          end: "+=50",

          scrub: 0.6,
        },
      });
    });

    //? contact-con
    gsap.to(".contact-con", {
      opacity: 1,
      x: 0,
      scrollTrigger: {
        trigger: ".contact-con",
        start: "top 45%",
        end: "+=50",
        scrub: 0.6,
      },
    });
  }

  //? debugger to fix scene
  debugActive() {
    if (this.experience.debug.active) {
      this.worldFolder = this.experience.debug.gui.addFolder("world-Debug");

      this.worldFolder
        .add(this.scene, "environmentIntensity")
        .min(0)
        .max(10)
        .step(0.05);

      this.worldFolder
        .add(this.debugSettings, "myProperty")
        .name("Background-Opacity");

      this.worldFolder
        .add(this.debugSettings, "stopObjectRotation")
        .name("ObjectRotation");

      if (this.brainModel) {
        this.worldFolder
          .add(this.brainModel.scene.rotation, "z")
          .min(0)
          .max(20)
          .step(0.01);
      }
    }
  }

  update() {
    if (this.partShade) {
      this.partShade.update();
    }

    if (this.fMolecule) {
      this.fMolecule.rotation.y += 0.01;
      this.fMolecule.rotation.z -= 0.01;
      this.fMolecule.rotation.x += 0.005;

      this.sMolecule.rotation.y += 0.01;
      this.sMolecule.rotation.z -= 0.01;
      this.sMolecule.rotation.x += 0.005;
    }
    if (this.mixer) {
      this.mixer.update(this.time.delta * 0.0005);
    }
  }
}
