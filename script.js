const navigation = document.querySelector(".primary-nav");
history.scrollRestoration = "manual";

function scrollToSection(target) {
  const headerHeight = document.querySelector(".site-header").getBoundingClientRect().height;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, Math.max(0, targetTop));
  document.documentElement.style.scrollBehavior = "";
}

navigation.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;

  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;

  event.preventDefault();
  history.pushState(null, "", link.hash);
  scrollToSection(target);
});

window.addEventListener("popstate", () => {
  const target = document.getElementById(location.hash.slice(1));
  if (target) scrollToSection(target);
});

document.querySelector("#year").textContent = new Date().getFullYear();

const header = document.querySelector(".site-header");
const updateHeaderOnScroll = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
updateHeaderOnScroll();

const roleReadMore = document.querySelector(".role-read-more");
const extraRoleHighlights = document.querySelectorAll(".role-highlight-extra");
let roleHighlightHoverTimer;

function setRoleHighlightsExpanded(expanded) {
  extraRoleHighlights.forEach((highlight) => {
    highlight.hidden = !expanded;
  });
  roleReadMore.setAttribute("aria-expanded", String(expanded));
  roleReadMore.querySelector(".role-read-more-label").textContent = expanded ? "Show less" : "Read more";
  roleReadMore.querySelector(".role-read-more-icon").textContent = expanded ? "↑" : "↓";
}

roleReadMore.addEventListener("pointerenter", (event) => {
  const isExpanded = roleReadMore.getAttribute("aria-expanded") === "true";
  if ((event.pointerType === "mouse" || event.pointerType === "pen") && !isExpanded) {
    roleHighlightHoverTimer = window.setTimeout(() => {
      setRoleHighlightsExpanded(true);
    }, 180);
  }
});

roleReadMore.addEventListener("pointerleave", () => window.clearTimeout(roleHighlightHoverTimer));
roleReadMore.addEventListener("pointerdown", () => window.clearTimeout(roleHighlightHoverTimer));

roleReadMore.addEventListener("click", () => {
  window.clearTimeout(roleHighlightHoverTimer);
  const isExpanded = roleReadMore.getAttribute("aria-expanded") === "true";
  setRoleHighlightsExpanded(!isExpanded);
});

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(
    ".about-heading, .about-image, .about-content, .stat-row > div, .experience-heading, .role-card, .skills-heading, .analytics-panel, .skill-card, .toolbelt, .resume-copy, .resume-details, .contact-section > *"
  );
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });

  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    revealObserver.observe(target);
  });
}
