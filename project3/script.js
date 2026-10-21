(() => {
  "use strict";

  const viewer = document.querySelector("#image-viewer");
  const image = document.querySelector("#viewer-image");
  const caption = document.querySelector("#viewer-caption");
  const original = document.querySelector("#viewer-original");

  if (viewer && typeof viewer.showModal === "function") {
    document.querySelectorAll("a[data-lightbox]").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const thumbnail = link.querySelector("img");
        image.src = link.href;
        image.alt = thumbnail.alt;
        caption.textContent = link.dataset.caption || thumbnail.alt;
        original.href = link.href;
        viewer.showModal();
        document.body.classList.add("viewer-open");
      });
    });
    document.querySelector("#viewer-close").addEventListener("click", () => viewer.close());
    viewer.addEventListener("click", (event) => {
      if (event.target === viewer) viewer.close();
    });
    viewer.addEventListener("close", () => document.body.classList.remove("viewer-open"));
  }

  const backTop = document.querySelector(".back-top");
  const updateBackTop = () => backTop.classList.toggle("visible", window.scrollY > 900);
  window.addEventListener("scroll", updateBackTop, { passive: true });
  updateBackTop();

  const nav = [...document.querySelectorAll(".nav-links a")];
  const destinations = nav.map((link) => document.querySelector(link.hash));
  let scheduled = false;
  const updateNavigation = () => {
    let active = 0;
    destinations.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= 140) active = index;
    });
    nav.forEach((link, index) => {
      if (index === active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    scheduled = false;
  };
  window.addEventListener("scroll", () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateNavigation);
    }
  }, { passive: true });
  updateNavigation();

  let originallyOpen = [];
  window.addEventListener("beforeprint", () => {
    document.querySelectorAll("img[loading]").forEach((img) => { img.loading = "eager"; });
    originallyOpen = [...document.querySelectorAll("details[open]")];
    document.querySelectorAll("details").forEach((detail) => { detail.open = true; });
  });
  window.addEventListener("afterprint", () => {
    document.querySelectorAll("details").forEach((detail) => {
      detail.open = originallyOpen.includes(detail);
    });
  });
})();
