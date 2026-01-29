import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import { gsap } from "gsap";
import { ScrollTrigger, SplitText, ScrollSmoother } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother);

document.addEventListener("DOMContentLoaded", () => {
  const smoother = ScrollSmoother.create({
    smooth: 2,
    effects: true,
    normalizeScroll: true,
    wholePixels: true,
  });

  // Navigate to sections when clicking nav links (works with ScrollSmoother)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const hash = link.getAttribute("href");
    if (hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;
    link.addEventListener("click", e => {
      e.preventDefault();
      smoother.scrollTo(target, true, "top top");
      // Close mobile menu if open
      const mobileMenu = document.getElementById("mobile-menu");
      if (mobileMenu && mobileMenu.classList.contains("open")) {
        mobileMenu.classList.remove("open");
      }
    });
  });

  const flickerElements = gsap.utils.toArray(".flicker");
  const splitElements = gsap.utils.toArray(".split");

  gsap.set(".split", { opacity: 1 });

  document.fonts.ready.then(() => {
    splitElements.forEach(splitElement => {
      SplitText.create(splitElement, {
        type: "words,lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        onSplit: instance => {
          return gsap.from(instance.lines, {
            yPercent: 120,
            stagger: 0.1,
            scrollTrigger: {
              trigger: splitElement,
              start: "top 85%",
              end: "bottom 20%",
            },
          });
        },
      });
    });

    flickerElements.forEach(flickerElement => {
      SplitText.create(flickerElement, {
        type: "words, chars",
        autoSplit: true,
        onSplit: instance => {
          return gsap.from(instance.words, {
            opacity: 1,
            stagger: 0.2,
            duration: 0.2,
            keyframes: {
              "0%": { opacity: 0 },
              "10%": { opacity: 1 },
              "20%": { opacity: 0 },
              "50%": { opacity: 1 },
              "60%": { opacity: 0 },
              "100%": { opacity: 1 },
              easeEach: "steps(1)",
            },
            scrollTrigger: {
              trigger: flickerElement,
              start: "top 85%",
              end: "bottom 20%",
            },
          });
        },
      });
    });
  });

  const newsArticlesContainers = gsap.utils.toArray(".news-articles");

  newsArticlesContainers.forEach(container => {
    const newsArticles = container.querySelectorAll(".news-article");

    gsap.from(newsArticles, {
      opacity: 0,
      yPercent: 100,
      duration: 1,
      ease: "power2.out",
      stagger: {
        amount: 0.5,
        each: 0.25,
      },
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
        end: "bottom 20%",
      },
    });
  });

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

  function updateActiveTab(activeIndex) {
    sectorTabs.forEach((tab, index) => {
      if (index === activeIndex) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });
  }

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

  sectorTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const slideIndex = parseInt(tab.getAttribute("data-slide"));
      sectorContentSwiper.slideTo(slideIndex);
    });
  });

  // Drag-to-scroll for sector tabs container
  const sectorTabsContainer = document.querySelector(".sector-tabs");
  if (sectorTabsContainer) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasDragged = false;

    sectorTabsContainer.addEventListener("mousedown", e => {
      isDown = true;
      hasDragged = false;
      sectorTabsContainer.classList.add("dragging");
      startX = e.pageX;
      scrollLeft = sectorTabsContainer.scrollLeft;
    });

    sectorTabsContainer.addEventListener("mousemove", e => {
      if (!isDown) return;
      e.preventDefault();
      hasDragged = true;
      const walk = (e.pageX - startX) * 1.2; // scroll speed multiplier
      sectorTabsContainer.scrollLeft = scrollLeft - walk;
      startX = e.pageX;
      scrollLeft = sectorTabsContainer.scrollLeft;
    });

    sectorTabsContainer.addEventListener("mouseleave", () => {
      isDown = false;
      sectorTabsContainer.classList.remove("dragging");
    });

    sectorTabsContainer.addEventListener("mouseup", () => {
      isDown = false;
      sectorTabsContainer.classList.remove("dragging");
      setTimeout(() => {
        hasDragged = false;
      }, 0);
    });

    sectorTabsContainer.addEventListener(
      "click",
      e => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );
  }

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      if (!previousButton.disabled) {
        sectorContentSwiper.slidePrev();
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (!nextButton.disabled) {
        sectorContentSwiper.slideNext();
      }
    });
  }

  sectorContentSwiper.on("slideChange", () => {
    const activeIndex = sectorContentSwiper.activeIndex;
    updateActiveTab(activeIndex);
    updateNavigationButtons(activeIndex);
  });

  updateNavigationButtons(sectorContentSwiper.activeIndex);

  const heritageElements = gsap.utils.toArray("[data-gsap-id='heritage']");

  heritageElements.forEach(heritageElement => {
    const image = heritageElement.querySelector("[data-gsap-id='image']");
    const topLeftIcon = heritageElement.querySelector("[data-gsap-id='top-left-icon']");
    const bottomRightIcon = heritageElement.querySelector("[data-gsap-id='bottom-right-icon']");
    const line = heritageElement.querySelector("[data-gsap-id='line']");
    const dot = heritageElement.querySelector("[data-gsap-id='dot']");
    const text = heritageElement.querySelector("[data-gsap-id='text']");

    gsap.set(image, { opacity: 0 });
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

    tl.to([image, topLeftIcon, bottomRightIcon], {
      opacity: 1,
      duration: 1,
    })
      .to(
        line,
        {
          scaleY: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "<"
      )
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

  const environmentIcon = document.querySelector("[data-gsap-id='environment-icon']");

  if (environmentIcon) {
    const leaves = environmentIcon.querySelector("[data-gsap-id='leaves']");
    const smallCircle = environmentIcon.querySelector("[data-gsap-id='small-circle']");
    const bigCircle = environmentIcon.querySelector("[data-gsap-id='big-circle']");

    if (leaves && smallCircle && bigCircle) {
      const redPaths = leaves.querySelectorAll("path[fill='#BD0A27']");

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

  const exportIcon = document.querySelector("[data-gsap-id='export-icon']");

  if (exportIcon) {
    const whiteCircles = exportIcon.querySelectorAll("[data-gsap-id='white-circle']");
    const redCircles = exportIcon.querySelectorAll("[data-gsap-id='red-circle']");

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

  // Products accordion: show the image that matches the open panel (GSAP zoom + blur reveal)
  const accordionItems = document.querySelectorAll(".accordion-item");
  const accordionImages = document.querySelectorAll(".products-accordion-img");

  accordionItems.forEach(item => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      const panel = item.getAttribute("data-accordion-panel");
      const targetImage = document.querySelector(`.products-accordion-img[data-accordion-panel="${panel}"]`);
      if (!targetImage) return;

      const others = [...accordionImages].filter(img => img !== targetImage);

      gsap.to(others, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        overwrite: true,
      });

      gsap.fromTo(
        targetImage,
        { opacity: 0, filter: "blur(10px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.5,
          delay: 0.08,
          ease: "power2.out",
          overwrite: true,
        }
      );
    });
  });

  const globeIcon = document.querySelector("[data-gsap-id='globe-icon']");

  if (globeIcon) {
    const circles = globeIcon.querySelectorAll("[data-gsap-id='circle']");

    const latLines = globeIcon.querySelectorAll("[data-gsap-id='lat-line']");

    const holder = globeIcon.querySelector("#holder");

    const globeElements = [...circles, ...latLines];

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
