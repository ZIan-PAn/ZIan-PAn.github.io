(() => {
  "use strict";
  const viewer = document.querySelector("#image-viewer");
  const image = document.querySelector("#viewer-image");
  const caption = document.querySelector("#viewer-caption");
  const original = document.querySelector("#viewer-original");
  let opener;

  if (viewer && typeof viewer.showModal === "function") {
    document.querySelectorAll("a[data-lightbox]").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        opener = link;
        image.src = link.href;
        image.alt = link.querySelector("img").alt;
        caption.textContent = link.dataset.caption;
        original.href = link.href;
        viewer.showModal();
        document.body.classList.add("viewer-open");
      });
    });
    document.querySelector("#viewer-close").addEventListener("click", () => viewer.close());
    viewer.addEventListener("click", (event) => {
      if (event.target === viewer) {
        const box = viewer.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) viewer.close();
      }
    });
    viewer.addEventListener("close", () => {
      document.body.classList.remove("viewer-open");
      opener?.focus({ preventScroll: true });
    });
  }

  const nav = [...document.querySelectorAll(".nav-links a")];
  const sections = nav.map((link) => document.querySelector(link.hash));
  const backTop = document.querySelector(".back-top");
  let scheduled = false;
  function updateNavigation() {
    let active = 0;
    sections.forEach((section, i) => {
      if (section.getBoundingClientRect().top <= 160) active = i;
    });
    nav.forEach((link, i) => {
      if (i === active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    backTop.hidden = window.scrollY < 900;
    scheduled = false;
  }
  window.addEventListener("scroll", () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateNavigation);
    }
  }, { passive: true });
  updateNavigation();

  let openDetails = [];
  window.addEventListener("beforeprint", () => {
    document.querySelectorAll("img[loading]").forEach((img) => { img.loading = "eager"; });
    openDetails = [...document.querySelectorAll("details[open]")];
    document.querySelectorAll("details").forEach((detail) => { detail.open = true; });
  });
  window.addEventListener("afterprint", () => {
    document.querySelectorAll("details").forEach((detail) => { detail.open = openDetails.includes(detail); });
  });
})();
