/* main.js — Navigation, Reveal-Animationen, Header-Scroll */

(function () {
  "use strict";

  // ---- Hamburger-Menü ----
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".menu");
  var body = document.body;

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    body.classList.remove("menu-open");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      if (open) { closeMenu(); }
      else {
        toggle.setAttribute("aria-expanded", "true");
        menu.classList.add("is-open");
        body.classList.add("menu-open");
      }
    });

    // Menü-Link geklickt → schließen (außer Impressum-Scroll innerhalb gleicher Seite)
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        // Bei Anker-Links (#impressum) Menü schließen, Scroll läuft weiter
        closeMenu();
      });
    });

    // ESC schließt
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    // Klick außerhalb schließt
    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }

  // ---- Header-Scroll-Effekt ----
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---- Reveal-on-Scroll ----
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
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
