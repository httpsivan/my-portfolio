// CURSOR
const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursor-ring");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + "px";
  cursor.style.top = my + "px";
});
function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(animateRing);
}
animateRing();
document
  .querySelectorAll(
    "a, button, input, textarea, .skill-card, .project-card, .interest-card",
  )
  .forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("hovered"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hovered"));
  });

// THEME TOGGLE
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

function applyTheme(theme) {
  if (theme === "light") {
    body.classList.add("light-mode");
  } else {
    body.classList.remove("light-mode");
  }
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "light") {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }
}

// ENTRY
function enterSite() {
  document.getElementById("entry-screen").classList.add("hidden");
  const main = document.getElementById("main-site");
  main.classList.add("visible");
  document.body.style.cursor = "none";
  setTimeout(startTyping, 600);
}

// ENTRY SCREEN TYPING ANIMATION
const entryRolesText =
  "Front-End Developer · UI/UX Designer · Graphic Designer";
let entryTextIndex = 0;
let entryTypingEl; // Will be assigned in DOMContentLoaded

function typeEntryText() {
  if (!entryTypingEl) return; // Ensure element exists
  if (entryTextIndex < entryRolesText.length) {
    entryTypingEl.textContent += entryRolesText.charAt(entryTextIndex);
    entryTextIndex++;
    setTimeout(typeEntryText, 50); // Typing speed (adjust as needed)
  }
}
// TYPING ANIMATION
const roles = ["Front-End Developer", "UI/UX Designer", "Graphic Designer"];
let ri = 0,
  ci = 0,
  deleting = false;
function startTyping() {
  const el = document.getElementById("typed-role");
  function type() {
    const word = roles[ri];
    if (!deleting) {
      el.textContent = word.substring(0, ci + 1);
      ci++;
      if (ci === word.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = word.substring(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
      }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  type();
}

// NAVBAR
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
  // Active nav
  const sections = ["home", "about", "skills", "projects", "contact"];
  let current = "";
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  document.querySelectorAll(".nav-links a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + current);
  });
});
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

// SCROLL REVEAL
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("revealed");
      }
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// SKILL BARS
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll(".skill-bar-fill").forEach((bar) => {
          bar.style.width = bar.dataset.pct + "%";
        });
      }
    });
  },
  { threshold: 0.3 },
);
document
  .querySelectorAll(".skills-bars")
  .forEach((el) => barObserver.observe(el));

// CONTACT FORM
async function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  const formspreeEndpoint = "https://formspree.io/f/xzdyoqnd";

  try {
    const response = await fetch(formspreeEndpoint, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      document.getElementById("contact-form").style.display = "none";
      document.getElementById("form-success").classList.add("show");
      form.reset();
    } else {
      const data = await response.json();
      console.error("Formspree error:", data);
      alert(
        "Oops! There was a problem sending your message. Please try again later.",
      );
    }
  } catch (error) {
    console.error("Network error:", error);
    alert(
      "Oops! There was a network error. Please check your internet connection and try again.",
    );
  }
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// Initialize entry screen typing on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  entryTypingEl = document.getElementById("entry-typed-roles");
  setTimeout(typeEntryText, 1400); // Start typing after other entry elements have appeared

  // Attach the submit event listener to the contact form
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleSubmit);
  }

  // Apply saved theme on initial load and attach toggle listener
  const savedTheme = localStorage.getItem("theme") || "dark"; // Default to dark
  applyTheme(savedTheme);
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
});
