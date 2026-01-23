import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const heroSwiper = new Swiper(".hero-swiper", {
    loop: true,
    speed: 2000,
    autoplay: true,
    grabCursor: true,
    parallax: true,
    keyboard: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  const sectorContentSwiper = new Swiper(".sector-content-swiper", {
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    spaceBetween: 0,
    allowTouchMove: false,
    speed: 500,
  });

  const sectorImageSwiper = new Swiper(".sector-image-swiper", {
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    spaceBetween: 0,
    allowTouchMove: false,
    speed: 500,
    controller: {
      control: sectorContentSwiper,
    },
  });

  sectorContentSwiper.controller.control = sectorImageSwiper;

  const sectorTabs = document.querySelectorAll(".sector-tab");
  const previousButton = document.querySelector(".previous-button");
  const nextButton = document.querySelector(".next-button");
  const totalSlides = sectorContentSwiper.slides.length;

  // Function to update active tab
  function updateActiveTab(activeIndex) {
    sectorTabs.forEach((tab, index) => {
      if (index === activeIndex) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });
  }

  // Function to update navigation button states
  function updateNavigationButtons(activeIndex) {
    if (previousButton) {
      if (activeIndex === 0) {
        previousButton.disabled = true;
        previousButton.classList.add("disabled");
      } else {
        previousButton.disabled = false;
        previousButton.classList.remove("disabled");
      }
    }

    if (nextButton) {
      if (activeIndex === totalSlides - 1) {
        nextButton.disabled = true;
        nextButton.classList.add("disabled");
      } else {
        nextButton.disabled = false;
        nextButton.classList.remove("disabled");
      }
    }
  }

  // Add click handlers to tabs
  sectorTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const slideIndex = parseInt(tab.getAttribute("data-slide"));
      sectorContentSwiper.slideTo(slideIndex);
      // Image swiper will sync automatically via controller
      // Tab will be updated via slideChange event
    });
  });

  // Add click handlers to navigation buttons
  // Since swipers are synced via controller, we only need to call slidePrev/Next on one
  if (previousButton) {
    previousButton.addEventListener("click", () => {
      if (!previousButton.disabled) {
        sectorContentSwiper.slidePrev();
        // Image swiper will sync automatically via controller
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (!nextButton.disabled) {
        sectorContentSwiper.slideNext();
        // Image swiper will sync automatically via controller
      }
    });
  }

  // Update active tab and navigation buttons when swiper changes
  sectorContentSwiper.on("slideChange", () => {
    const activeIndex = sectorContentSwiper.activeIndex;
    updateActiveTab(activeIndex);
    updateNavigationButtons(activeIndex);
  });

  // Initialize button states
  updateNavigationButtons(sectorContentSwiper.activeIndex);

  // GSAP animation for established element
  const heritageElements = gsap.utils.toArray("[data-gsap-id='heritage']");

  heritageElements.forEach(heritageElement => {
    const image = heritageElement.querySelector("[data-gsap-id='image']");
    const topLeftIcon = heritageElement.querySelector("[data-gsap-id='top-left-icon']");
    const bottomRightIcon = heritageElement.querySelector("[data-gsap-id='bottom-right-icon']");
    const line = heritageElement.querySelector("[data-gsap-id='line']");
    const dot = heritageElement.querySelector("[data-gsap-id='dot']");
    const text = heritageElement.querySelector("[data-gsap-id='text']");

    gsap.set(image, { scale: 0, opacity: 0 });
    gsap.set(topLeftIcon, { opacity: 0 });
    gsap.set(bottomRightIcon, { opacity: 0 });
    gsap.set(line, { scaleY: 0, transformOrigin: "top center" });
    gsap.set(dot, { opacity: 0 });
    gsap.set(text, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heritageElement,
        start: "top center",
        toggleActions: "play none none none",
      },
    });

    // Image pops in fast with scale
    tl.to(image, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
    })
      // Top left and bottom right icons fade in at the same time
      .to(
        [topLeftIcon, bottomRightIcon],
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        ">-0.1"
      )
      // Line fills from top to bottom
      .to(
        line,
        {
          scaleY: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "<"
      )
      // Dot and text appear instantly
      .to(dot, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      })
      .to(text, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      });
  });
});
