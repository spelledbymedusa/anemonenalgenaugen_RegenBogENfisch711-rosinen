/* main.js — Navigation, Reveal-Animationen, Header-Scroll */

(function () {
  "use strict";

  // ---- Header-Scroll-Effekt + Scroll Progress ----
  var header = document.querySelector(".site-header");
  var progress = document.getElementById("scroll-progress");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
      if (progress) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---- Active Nav State ----
  var path = location.pathname.split("/").pop() || "index.html";
  var navLinks = document.querySelectorAll(".menu a");
  navLinks.forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path) a.classList.add("is-active");
  });
  // Brand link active on index
  if (path === "index.html") {
    var brand = document.querySelector(".brand");
    if (brand) brand.classList.add("is-active");
  }

  // ---- Reveal-on-Scroll (desktop only — mobile shows everything immediately) ----
  var reveals = document.querySelectorAll(".reveal");
  var isMobile = window.matchMedia("(max-width: 820px)").matches;
  if (isMobile) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
