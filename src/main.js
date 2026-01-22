import Swiper from "swiper/bundle";
import "swiper/css/bundle";
new Swiper(".swiper", {
  loop: true,
  autoplay: true,
  speed: 1000,
  grabCursor: true,
  pagination: {
    el: ".swiper-pagination",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
