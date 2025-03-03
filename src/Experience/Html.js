import Experience from "./Experience";
import gsap from "gsap";

import faqQuestions from "./faqQuestions.js";
import data from "./data.js";

export default class HTML {
  constructor() {
    this.experience = new Experience();
    this.body = document.querySelector("body");
    this.canvas = this.experience.canvas;
    this.resources = this.experience.resources;
    this.mobile = this.experience.size.mobileSize;

    //? html data
    this.pageData = data;
    this.faqData = faqQuestions;

    //? animate background
    this.bg = document.createElement("div");
    this.bg.classList.add("bg");
    this.bgContent = `
      <div class="img-con">
      <img src="/textures/logo_2.png" alt="logo">

    </div>

    <div class="loader-language">
    <svg
  class="container" 
  x="0px" 
  y="0px"
  viewBox="0 0 55 23.1"
  height="23.1"
  width="55"
  preserveAspectRatio='xMidYMid meet'
>
  <path
    class="track" 
    fill="none" 
    stroke-width="4" 
    pathlength="100"
    d="M26.7,12.2c3.5,3.4,7.4,7.8,12.7,7.8c5.5,0,9.6-4.4,9.6-9.5C49,5,45.1,1,39.8,1c-5.5,0-9.5,4.2-13.1,7.8l-3.4,3.3c-3.6,3.6-7.6,7.8-13.1,7.8C4.9,20,1,16,1,10.5C1,5.4,5.1,1,10.6,1c5.3,0,9.2,4.5,12.7,7.8L26.7,12.2z"
  />
  <path
    class="car" 
    fill="none" 
    stroke-width="4" 
    pathlength="100"
    d="M26.7,12.2c3.5,3.4,7.4,7.8,12.7,7.8c5.5,0,9.6-4.4,9.6-9.5C49,5,45.1,1,39.8,1c-5.5,0-9.5,4.2-13.1,7.8l-3.4,3.3c-3.6,3.6-7.6,7.8-13.1,7.8C4.9,20,1,16,1,10.5C1,5.4,5.1,1,10.6,1c5.3,0,9.2,4.5,12.7,7.8L26.7,12.2z"
  />
</svg>


<div class="language"> 
    <div>Choose Language:</div>
    <div class="language-con">
      <div class="language-btn english">English</div>
      <div class="language-btn spanish">Spanish</div>
    </div>
</div>  



      `;
    this.bg.innerHTML = this.bgContent;
    this.body.appendChild(this.bg);

    //? html containers
    this.countdown = document.querySelector(".countdown");
    this.navButton = document.querySelector(".nav-button");
    this.headingOneContainer = document.querySelector("#heading");
    this.headingTwoContainer = document.querySelector("#heading-two");
    this.headingThreeContainer = document.querySelector("#heading-three");
    this.headingFourContainer = document.querySelector("#heading-four");
    this.headingFiveContainer = document.querySelector("#heading-five");
    this.headingSixContainer = document.querySelector("#heading-six");
    this.headingSevenContainer = document.querySelector("#heading-seven");
    this.headingEighthContainer = document.querySelector("#heading-eight");
    this.headingNineContainer = document.querySelector("#heading-nine");
    this.headingTenContainer = document.querySelector("#heading-ten");
    this.discoverPeakSynapContainer = document.querySelector(".discover-con");
    this.faqQuestionContainer = document.querySelector(
      ".faq-questions-main-con"
    );
    this.faqTitleContainer = document.querySelector(".faq-title");
    this.socialsPeakSynapContainer = document.querySelector(".socials-con");

    //? contact html title
    this.contactTitleContainer = document.querySelector(".contact-title");
    this.contactNameContainer = document.querySelector(".contact-name");
    this.contactEmailContainer = document.querySelector(".contact-email");
    this.contactPhoneContainer = document.querySelector(".contact-phone");
    this.contactMessageContainer = document.querySelector(".contact-message");
    this.contactUsContainer = document.querySelector(".contact-us");

    //? update count-down
    this.dayOfLive = new Date("2025-03-15T00:00:00").getTime();
    setInterval(() => {
      this.updateCountDown(this.dayOfLive, this.countdown);
    }, 1000);

    //? faqQuestion EVENT LISTENER
    this.faqQuestionContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("faq-question")) {
        if (e.target.classList.contains("active")) {
          e.target.classList.remove("active");
          this.icon = e.target.querySelector("svg");

          gsap.to(this.icon, {
            duration: 0.325,
            transform: "rotate(0deg)",
            fill: "#01d878",
            ease: "power1.out",
          });
          gsap.to(e.target, {
            backgroundColor: "#044336",
            color: "#01d87d",
            borderColor: "#01d87d",
            duration: 0.325,
            ease: "power1.out",
          });
          e.target.querySelector(".answer").style.display = "none";
        } else {
          e.target.classList.add("active");
          gsap.to(e.target, {
            backgroundColor: "#01d87d",
            color: "#044336",
            borderColor: "#affab8",
            duration: 0.325,
            ease: "power1.out",
          });
          this.icon = e.target.querySelector("svg");

          gsap.to(this.icon, {
            duration: 0.325,
            transform: "rotate(90deg)",
            fill: "#044336",
            ease: "power1.out",
          });
          e.target.querySelector(".answer").style.display = "flex";
        }
      }
    });

    //? what happenes when resources are ready
    this.resources.on("resourcesReady", () => {
      // document.querySelector(".language").style.display = "flex";
      gsap.to(".container", {
        duration: 2,
        opacity: 0,
        y: 0,
        ease: "ease-out",
        display: "none",
        onComplete: () => {
          gsap.to(".language", {
            pointerEvents: "all",
            duration: 1,
            opacity: 1,
            y: 0,
            ease: "back.out(6)",
          });
        },
      });
    });
  }

  chooseLanguage(language) {
    if (language === "english") {
      this.fetchData(0);
    }

    if (language === "spanish") {
      this.fetchData(1);
    }
  }

  fetchData(data) {
    this.dataCount = 0;
    //? fetch html
    this.navButtonHtml = this.pageData[data].navButton;
    this.headingOneHtml = this.pageData[data].headingOne;
    this.headingTwoHtml = this.pageData[data].headingTwo;
    this.headingThreeHtml = this.pageData[data].headingThree;
    this.headingFourHtml = this.pageData[data].headingFour;
    this.headingFiveHtml = this.pageData[data].headingFive;
    this.headingSixHtml = this.pageData[data].headingSix;
    this.headingSevenHtml = this.pageData[data].headingSeven;
    this.headingEighthHtml = this.pageData[data].headingEighth;
    this.discoverPeakSynapHtml = this.pageData[data].discoverPeakSynap;
    this.faqTitleHtml = this.pageData[data].faqTitle;
    this.socialsPeakSynapHtml = this.pageData[data].socialsPeakSynap;
    this.contactTitleHtml = this.pageData[data].contactTitle;
    this.contactNameHtml = this.pageData[data].contactName;
    this.contactEmailHtml = this.pageData[data].contactEmail;
    this.contactPhoneHtml = this.pageData[data].contactPhone;
    this.contactMessageHtml = this.pageData[data].contactMessage;
    this.contactUsHtml = this.pageData[data].contactUs;

    //? add data to html containers
    this.navButton.innerHTML = this.navButtonHtml;
    this.headingOneContainer.innerHTML = this.headingOneHtml;
    this.headingTwoContainer.innerHTML = this.headingTwoHtml;
    this.headingThreeContainer.innerHTML = this.headingThreeHtml;
    this.headingFourContainer.innerHTML = this.headingFourHtml;
    this.headingFiveContainer.innerHTML = this.headingFiveHtml;
    this.headingSixContainer.innerHTML = this.headingSixHtml;
    this.headingSevenContainer.innerHTML = this.headingSevenHtml;
    this.headingEighthContainer.innerHTML = this.headingEighthHtml;
    this.discoverPeakSynapContainer.innerHTML = this.discoverPeakSynapHtml;
    this.faqTitleContainer.innerHTML = this.faqTitleHtml;
    this.socialsPeakSynapContainer.innerHTML = this.socialsPeakSynapHtml;
    this.contactTitleContainer.innerHTML = this.contactTitleHtml;
    this.contactNameContainer.innerHTML = this.contactNameHtml;
    this.contactEmailContainer.innerHTML = this.contactEmailHtml;
    this.contactPhoneContainer.innerHTML = this.contactPhoneHtml;
    this.contactMessageContainer.innerHTML = this.contactMessageHtml;
    this.contactUsContainer.innerHTML = this.contactUsHtml;

    //? FETCH FAQ QUESTIONS and add them
    this.faqQuestionContainer.innerHTML = ``;
    this.faqData[data].questions.forEach((e) => {
      this.faqQuestion = document.createElement("div");
      this.faqQuestion.classList.add("faq-question");

      this.faqQuestion.innerHTML = `
                    <div class="question-icon">
              <div class="question">${e}</div>
              <div class="icon">
                <svg width="32px" height="32px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#01d87d" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z"></path> </g></svg>
              </div>
            </div>
            <div class="answer">${
              this.faqData[data].answers[this.dataCount]
            }</div>
        `;

      this.dataCount += 1;

      this.faqQuestionContainer.append(this.faqQuestion);
    });
  }

  updateCountDown(targetData, countdown) {
    const now = new Date().getTime();
    const timeLeft = targetData - now;

    let days = String(Math.floor(timeLeft / (1000 * 60 * 60 * 24)));

    if (days.length === 1) {
      days = `0${days}`;
    }
    let hours = String(
      Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    );

    if (hours.length === 1) {
      hours = `0${hours}`;
    }
    let minutes = String(
      Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    );

    if (minutes.length === 1) {
      minutes = `0${minutes}`;
    }
    let seconds = String(Math.floor((timeLeft % (1000 * 60)) / 1000));

    if (seconds.length === 1) {
      seconds = `0${seconds}`;
    }

    countdown.innerHTML = `
      ${days}:${hours}:${minutes}:${seconds}
    `;

    if (timeLeft <= 0) {
      this.countdown.innerHTML = `APP IS LIVE!`;
    }
  }

  update() {}
}
