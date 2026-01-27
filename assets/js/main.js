/* =========================
   COMPONENT LOADER
========================= */
async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Failed to load ${file}`);
    el.innerHTML = await res.text();

    if (id === "header") {
      initNavigation();
      initCookieBanner(); // ✅ banner exists now
    }
  } catch (err) {
    console.error(err);
  }
}


/* =========================
   NAVIGATION
========================= */

function initNavigation() {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const dropdowns = document.querySelectorAll(".dropdown");

  if (!menuToggle || !nav) return;

  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", open);
  });

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", e => {
      if (window.innerWidth > 768) return;
      e.preventDefault();

      dropdowns.forEach(d => d !== dropdown && d.classList.remove("open"));
      dropdown.classList.toggle("open");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      nav.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      dropdowns.forEach(d => d.classList.remove("open"));
    }
  });
}

/* =========================
   GOOGLE CONSENT MODE v2 (DEFAULT)
========================= */

window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }

gtag("consent", "default", {
  analytics_storage: "denied"
});

/* =========================
   COOKIE BANNER INITIALISER
========================= */

function initCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  if (!banner) {
    console.warn("Cookie banner not found");
    return;
  }

  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-reject");

  let consentData = null;
  try {
    consentData = JSON.parse(localStorage.getItem("cookie_consent"));
  } catch {
    consentData = null;
  }

  if (consentData && consentData.value === "accepted") {
    banner.style.display = "none";
    console.log("Cookie banner hidden (already accepted)");
    return;
  }

  banner.style.display = "flex";
  console.log("Cookie banner shown");

  if (acceptBtn) {
    acceptBtn.onclick = () => {
      console.log("Accept clicked");

      localStorage.setItem(
        "cookie_consent",
        JSON.stringify({
          value: "accepted",
          timestamp: new Date().toISOString()
        })
      );

      gtag("consent", "update", {
        analytics_storage: "granted"
      });

      banner.style.display = "none";
      console.log("Cookie banner hidden after accept");
    };
  }

  if (rejectBtn) {
    rejectBtn.onclick = () => {
      console.log("Reject clicked");

      localStorage.setItem(
        "cookie_consent",
        JSON.stringify({
          value: "rejected",
          timestamp: new Date().toISOString()
        })
      );

      banner.style.display = "none";
      console.log("Cookie banner hidden after reject");
    };
  }
}

/* =========================
   CONSENT HELPER
========================= */

function hasCookieConsent() {
  try {
    const data = JSON.parse(localStorage.getItem("cookie_consent"));
    return data && data.value === "accepted";
  } catch {
    return false;
  }
}

/* =========================
   CONDITIONAL GA4 LOADER
========================= */

(function loadAnalyticsConditionally() {
  if (!hasCookieConsent()) return;

  const gaScript = document.createElement("script");
  gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-S9HMXZM9BC";
  gaScript.async = true;
  document.head.appendChild(gaScript);

  gtag("js", new Date());
  gtag("config", "G-S9HMXZM9BC", {
    anonymize_ip: true
  });
})();

/* =========================
   BOOTSTRAP
========================= */


loadComponent("header", "/components/header.html");
loadComponent("footer", "/components/footer.html");
