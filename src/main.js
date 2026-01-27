import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const heroSwiper = new Swiper(".hero-swiper", {
    loop: true,
    speed: 2000,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    autoplay: true,
    keyboard: true,
    grabCursor: true,
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

  // Environment icon alternating color animation
  const environmentIcon = document.querySelector("[data-gsap-id='environment-icon']");

  if (environmentIcon) {
    const leaves = environmentIcon.querySelector("[data-gsap-id='leaves']");
    const smallCircle = environmentIcon.querySelector("[data-gsap-id='small-circle']");
    const bigCircle = environmentIcon.querySelector("[data-gsap-id='big-circle']");

    if (leaves && smallCircle && bigCircle) {
      // Get all paths with red fill in the leaves
      const redPaths = leaves.querySelectorAll("path[fill='#BD0A27']");

      // Create alternating color animation: leaves vs circles
      gsap
        .timeline({ repeat: -1, yoyo: true })
        .to(
          redPaths,
          {
            fill: "white",
            duration: 1.5,
            ease: "power2.inOut",
          },
          0
        )
        .to(
          smallCircle,
          {
            fill: "#BD0A27",
            duration: 1.5,
            ease: "power2.inOut",
          },
          0
        )
        .to(
          bigCircle,
          {
            stroke: "#BD0A27",
            duration: 1.5,
            ease: "power2.inOut",
          },
          0
        );
    }
  }

  // Export icon alternating color animation
  const exportIcon = document.querySelector("[data-gsap-id='export-icon']");

  if (exportIcon) {
    // Get circles by data-gsap-id
    const whiteCircles = exportIcon.querySelectorAll("[data-gsap-id='white-circle']");
    const redCircles = exportIcon.querySelectorAll("[data-gsap-id='red-circle']");

    // Create alternating color animation matching the leaf rotation speed (1.5s per step)
    gsap
      .timeline({ repeat: -1, yoyo: true })
      .to(
        whiteCircles,
        {
          fill: "#BD0A27",
          duration: 1.5,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        redCircles,
        {
          fill: "white",
          duration: 1.5,
          ease: "power2.inOut",
        },
        0
      );
  }

  // Globe icon alternating color animation
  const globeIcon = document.querySelector("[data-gsap-id='globe-icon']");

  if (globeIcon) {
    // Get longitude circles using data-gsap-id
    const circles = globeIcon.querySelectorAll("[data-gsap-id='circle']");

    // Get latitude lines using data-gsap-id
    const latLines = globeIcon.querySelectorAll("[data-gsap-id='lat-line']");

    // Get the holder
    const holder = globeIcon.querySelector("#holder");

    // Combine circles and lines for the globe
    const globeElements = [...circles, ...latLines];

    // Create alternating color animation: globe vs holder
    gsap
      .timeline({ repeat: -1, yoyo: true })
      .to(
        globeElements,
        {
          fill: "white",
          duration: 1.5,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        holder,
        {
          fill: "#BD0A27",
          duration: 1.5,
          ease: "power2.inOut",
        },
        0
      );
  }
});
