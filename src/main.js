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

  ScrollTrigger.create({
    start: "top top-=80",
    end: 99999,
    toggleClass: { className: "scrolled", targets: "#header" },
  });

  // Navigate to sections when clicking nav links (works with ScrollSmoother)
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const hash = link.getAttribute("href");
    if (hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;
    link.addEventListener("click", (e) => {
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
    splitElements.forEach((splitElement) => {
      SplitText.create(splitElement, {
        type: "words,lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        onSplit: (instance) => {
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

    flickerElements.forEach((flickerElement) => {
      SplitText.create(flickerElement, {
        type: "words, chars",
        autoSplit: true,
        onSplit: (instance) => {
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

  newsArticlesContainers.forEach((container) => {
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

  // Stats section: single entry animation for all three icons (once on scroll into view)
  // Stats section: build up animation for all three icons
  const statsSection = document.getElementById("statistics");
  if (statsSection) {
    // Environment Icon
    const envIcon = statsSection.querySelector(
      '[data-gsap-id="environment-icon"]',
    );
    if (envIcon) {
      const bgCircle = envIcon.querySelector("#background-circle");
      const bigCircle = envIcon.querySelector("#big-circle");
      const smallCircle = envIcon.querySelector("#small-circle");
      const leaves = envIcon.querySelectorAll("#leaves path");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: envIcon,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.set([bgCircle, bigCircle, smallCircle, leaves], {
        opacity: 0,
        scale: 0,
        transformOrigin: "center center",
      });
      // Set background opacity target to match design (0.22)
      tl.to(bgCircle, {
        opacity: 0.22,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      })
        .to(
          bigCircle,
          { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
          "-=0.4",
        )
        .to(
          smallCircle,
          { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
          "-=0.4",
        )
        .to(
          leaves,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "back.out(1.7)",
          },
          "-=0.4",
        );
    }

    // Export Icon
    const exportIcon = statsSection.querySelector(
      '[data-gsap-id="export-icon"]',
    );
    if (exportIcon) {
      const bgCircles = exportIcon.querySelectorAll("#background-circles path");
      const centerCircles = exportIcon.querySelectorAll("#center-circles path");
      const outerCircles = exportIcon.querySelectorAll("#outer-circles path");
      const innerLines = exportIcon.querySelectorAll("#inner-lines path");
      const connectLines = exportIcon.querySelectorAll(
        "#connecting-lines path",
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: exportIcon,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.set(
        [bgCircles, centerCircles, outerCircles, innerLines, connectLines],
        { opacity: 0, scale: 0, transformOrigin: "center center" },
      );

      tl.to(bgCircles, {
        opacity: 0.22,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
      })
        .to(
          centerCircles,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.4",
        )
        .to(
          outerCircles,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "back.out(1.7)",
          },
          "-=0.4",
        )
        .to(
          connectLines,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.4",
        )
        .to(
          innerLines,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
          },
          "<",
        );
    }

    // Globe Icon
    const globeIcon = statsSection.querySelector('[data-gsap-id="globe-icon"]');
    if (globeIcon) {
      const gradientCircle = globeIcon.querySelector("#gradient-circle");
      const holder = globeIcon.querySelector("#holder");
      const circles = globeIcon.querySelectorAll('[data-gsap-id="circle"]');
      const latLines = globeIcon.querySelectorAll('[data-gsap-id="lat-line"]');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: globeIcon,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.set([gradientCircle, holder, circles, latLines], {
        opacity: 0,
        scale: 0,
        transformOrigin: "center center",
      });

      tl.to(gradientCircle, {
        opacity: 0.22,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      })
        .to(
          holder,
          { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
          "-=0.4",
        )
        .to(
          circles,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.4",
        )
        .to(
          latLines,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.4",
        );
    }
  }

  const heroSwiper = new Swiper(".hero-swiper", {
    loop: true,
    speed: 1000,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    keyboard: true,
    grabCursor: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    on: {
      init: function () {
        animateSlide(this.slides[this.activeIndex]);
      },
      slideChangeTransitionStart: function () {
        animateSlide(this.slides[this.activeIndex]);
      },
    },
  });

  function animateSlide(slide) {
    const title = slide.querySelector("[data-gsap-id='slide-title']");
    const btn = slide.querySelector("[data-gsap-id='slide-btn']");
    const img = slide.querySelector("[data-gsap-id='slide-img']");

    // Clean up previous SplitText or animations if any
    if (title && title._gsapSplitText) {
      title._gsapSplitText.revert();
    }

    const tl = gsap.timeline();

    // Image Fade and subtle scale
    if (img) {
      tl.fromTo(
        img,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" },
        0,
      );
    }

    // Title Flicker Animation
    if (title) {
      const split = new SplitText(title, { type: "words, chars" });
      title._gsapSplitText = split;

      tl.from(
        split.words,
        {
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
        },
        0.5,
      );
    }

    // Button Fade Animation (No scale/bounce)
    if (btn) {
      tl.fromTo(
        btn,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
        },
        "-=0.8",
      );
    }
  }

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

  sectorTabs.forEach((tab) => {
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

    sectorTabsContainer.addEventListener("mousedown", (e) => {
      isDown = true;
      hasDragged = false;
      sectorTabsContainer.classList.add("dragging");
      startX = e.pageX;
      scrollLeft = sectorTabsContainer.scrollLeft;
    });

    sectorTabsContainer.addEventListener("mousemove", (e) => {
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
      (e) => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true,
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

  heritageElements.forEach((heritageElement) => {
    const image = heritageElement.querySelector("[data-gsap-id='image']");
    const topLeftIcon = heritageElement.querySelector(
      "[data-gsap-id='top-left-icon']",
    );
    const bottomRightIcon = heritageElement.querySelector(
      "[data-gsap-id='bottom-right-icon']",
    );
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
        "<",
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

  // Products accordion: show the image that matches the open panel (GSAP zoom + blur reveal)
  const accordionItems = document.querySelectorAll(".accordion-item");
  const accordionImages = document.querySelectorAll(".products-accordion-img");

  accordionItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      const panel = item.getAttribute("data-accordion-panel");
      const targetImage = document.querySelector(
        `.products-accordion-img[data-accordion-panel="${panel}"]`,
      );
      if (!targetImage) return;

      const others = [...accordionImages].filter((img) => img !== targetImage);

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
        },
      );

      // Pointer Animations
      if (panel === "0") {
        animatePointersIn();
      } else {
        animatePointersOut();
      }
    });
  });

  function animatePointersIn() {
    const pointers = document.querySelectorAll(
      ".image-pointer-1, .image-pointer-2",
    );

    pointers.forEach((pointer) => {
      // Use attribute selectors to handle potential duplicate IDs in inline SVGs
      const text = pointer.querySelector('[id="text"]');
      const line = pointer.querySelector('[id="line-to-text"]');
      // Select direct children of the group with id="pointer"
      const pointerGroup = pointer.querySelector('[id="pointer"]');
      const bullseyeParts = pointerGroup
        ? pointerGroup.querySelectorAll('*:not([id="line-to-text"])')
        : [];

      gsap.set(pointer, { opacity: 1 }); // Ensure parent is visible

      const tl = gsap.timeline();

      // 1. Bullseye (Scale/Fade in)
      if (bullseyeParts.length > 0) {
        tl.fromTo(
          bullseyeParts,
          { opacity: 0, scale: 0, transformOrigin: "center center" },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "back.out(1.7)",
          },
        );
      }

      // 2. Line (Draw)
      if (line) {
        const length = line.getTotalLength();
        tl.fromTo(
          line,
          { strokeDasharray: length, strokeDashoffset: length },
          { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" },
        );
      }

      // 3. Text (Fade/Slide in)
      if (text) {
        tl.fromTo(
          text,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        );
      }
    });
  }

  function animatePointersOut() {
    const pointers = document.querySelectorAll(
      ".image-pointer-1, .image-pointer-2",
    );
    gsap.to(pointers, { opacity: 0, duration: 0.3, overwrite: true });
  }

  // Initial state for pointers
  gsap.set(".image-pointer-1, .image-pointer-2", { opacity: 1 }); // Let them be visible if Safety is default open?
  // Check if Safety is default open [open] attribute on details
  // Line 2491 in index.html says name="why-choose-spafax" open data-accordion-panel="0"
  // So yes, Safety is open by default.
  // We should trigger animation or set initial state to "In".
  // Since js runs on load, we can run animatePointersIn() initially if panel 0 is open.

  if (
    document.querySelector('.accordion-item[data-accordion-panel="0"][open]')
  ) {
    // Small delay to ensure layout is ready
    setTimeout(animatePointersIn, 100);
  } else {
    gsap.set(".image-pointer-1, .image-pointer-2", { opacity: 0 });
  }

  // Mobile Menu Logic
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuClose = document.getElementById("mobile-menu-close");
  const mobileMenuNavLinks = document.querySelectorAll(".mobile-nav-link");

  function toggleMobileMenu() {
    document.body.classList.toggle("overlay-open");
  }

  function closeMobileMenu() {
    document.body.classList.remove("overlay-open");
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  mobileMenuNavLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
});
