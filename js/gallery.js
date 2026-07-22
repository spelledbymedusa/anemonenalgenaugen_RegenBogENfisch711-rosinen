/* gallery.js — Lightbox für Galerie (Click-through) */

(function () {
  "use strict";

  var items = Array.prototype.slice.call(document.querySelectorAll("[data-gallery] .gallery__item"));
  if (items.length === 0) return;

  var lb = document.querySelector(".lightbox");
  var lbImg = lb ? lb.querySelector(".lightbox__img") : null;
  var lbCounter = lb ? lb.querySelector(".lightbox__counter") : null;
  var current = 0;

  function srcOf(item) {
    var img = item.querySelector("img");
    return img ? img.getAttribute("src") : "";
  }

  function show(i) {
    if (!lbImg) return;
    current = (i + items.length) % items.length;
    lbImg.src = srcOf(items[current]);
    if (lbCounter) lbCounter.textContent = (current + 1) + " / " + items.length;
  }

  function open(i) {
    if (!lb) return;
    show(i);
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    if (!lb) return;
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  items.forEach(function (item, i) {
    item.addEventListener("click", function () { open(i); });
  });

  if (lb) {
    lb.addEventListener("click", function (e) {
      if (e.target === lb) close();
    });
    var closeBtn = lb.querySelector(".lightbox__close");
    if (closeBtn) closeBtn.addEventListener("click", close);
    var prev = lb.querySelector(".lightbox__nav--prev");
    var next = lb.querySelector(".lightbox__nav--next");
    if (prev) prev.addEventListener("click", function (e) { e.stopPropagation(); show(current - 1); });
    if (next) next.addEventListener("click", function (e) { e.stopPropagation(); show(current + 1); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }
})();
