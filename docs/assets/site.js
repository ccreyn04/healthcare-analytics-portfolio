(function () {
  "use strict";

  const profile = window.SITE_PROFILE || {};
  const onProjectPage = window.location.pathname.includes("/projects/");
  const localPath = (path) => `${onProjectPage ? "../" : ""}${path}`;

  document.querySelectorAll("[data-profile]").forEach((element) => {
    const key = element.dataset.profile;
    if (profile[key]) element.textContent = profile[key];
  });

  const contactLinks = {
    email: profile.email ? `mailto:${profile.email}` : "",
    linkedin: profile.linkedin || "",
    github: profile.github || "",
    resume: profile.resume ? localPath(profile.resume) : ""
  };

  document.querySelectorAll("[data-contact]").forEach((element) => {
    const type = element.dataset.contact;
    const href = contactLinks[type];

    if (!href) {
      element.classList.add("is-hidden");
      return;
    }

    element.setAttribute("href", href);
    if (type === "linkedin" || type === "github") {
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noopener noreferrer");
    }
  });

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".navlinks");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
})();
