(function () {
  const WA_NUMBER = "447463576016";
  let currentLang = "en";

  function detectLanguage() {
    const params = new URLSearchParams(window.location.search);
    const paramLang = params.get("lang");
    if (paramLang && translations[paramLang]) return paramLang;

    const stored = localStorage.getItem("belt-lang");
    if (stored && translations[stored]) return stored;

    const browserLang = (navigator.language || navigator.languages?.[0] || "en").toLowerCase();
    if (browserLang.startsWith("pt")) return "pt";
    if (browserLang.startsWith("es")) return "es";
    return "en";
  }

  function applyTranslations(lang) {
    currentLang = lang;
    localStorage.setItem("belt-lang", lang);
    document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;

    const dict = translations[lang];
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key]) {
        if (el.tagName === "META") {
          el.setAttribute("content", dict[key]);
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // Update WhatsApp links
    var msg = encodeURIComponent(dict["whatsapp.message"] || "");
    var waUrl = "https://wa.me/" + WA_NUMBER + "?text=" + msg;
    document.querySelectorAll(".wa-link").forEach(function (a) {
      a.href = waUrl;
    });

    // Update active flag
    var activeFlag = document.getElementById("active-flag");
    if (activeFlag) {
      activeFlag.src = "assets/flags/" + getFlagFile(lang);
      activeFlag.alt = lang.toUpperCase();
    }

    // Update meta description
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict["hero.subtitle"]) {
      metaDesc.setAttribute("content", dict["hero.subtitle"]);
    }
  }

  function getFlagFile(lang) {
    var map = { pt: "br.svg", en: "us.svg", es: "es.svg" };
    return map[lang] || "us.svg";
  }

  function setupLanguageToggle() {
    var toggle = document.getElementById("lang-toggle");
    var dropdown = document.getElementById("lang-dropdown");
    if (!toggle || !dropdown) return;

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });

    dropdown.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = this.getAttribute("data-lang");
        document.body.style.opacity = "0";
        setTimeout(function () {
          applyTranslations(lang);
          dropdown.classList.remove("open");
          document.body.style.opacity = "1";
        }, 200);
      });
    });

    document.addEventListener("click", function () {
      dropdown.classList.remove("open");
    });
  }

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var target = document.querySelector(this.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
          // Close mobile menu if open
          var nav = document.getElementById("nav-menu");
          if (nav) nav.classList.remove("open");
          var overlay = document.getElementById("nav-overlay");
          if (overlay) overlay.classList.remove("open");
        }
      });
    });
  }

  function setupMobileMenu() {
    var hamburger = document.getElementById("hamburger");
    var nav = document.getElementById("nav-menu");
    var overlay = document.getElementById("nav-overlay");
    if (!hamburger || !nav) return;

    hamburger.addEventListener("click", function () {
      nav.classList.toggle("open");
      if (overlay) overlay.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", nav.classList.contains("open"));
    });

    if (overlay) {
      overlay.addEventListener("click", function () {
        nav.classList.remove("open");
        overlay.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    }
  }

  function setupHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    currentLang = detectLanguage();
    applyTranslations(currentLang);
    setupLanguageToggle();
    setupSmoothScroll();
    setupMobileMenu();
    setupHeaderScroll();
  });
})();
