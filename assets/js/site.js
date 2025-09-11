// assets/js/site.js
(() => {
  const MOBILE_BP = 991.98; // Bootstrap lg breakpoint
  const KID = "assets/img/kid-tanay.jpg";
  const PRESENT = "assets/img/today-tanay.jpg";

  // Utility functions
  const isMobile = () => window.matchMedia(`(max-width:${MOBILE_BP}px)`).matches;
  const remove = (sel) => { 
    const els = document.querySelectorAll(sel);
    els.forEach(el => el.remove());
  };

  // Build desktop sidebar portrait
  function buildDesktopPortrait() {
    const wrap = document.createElement("div");
    wrap.id = "sidebar-photo-block";
    wrap.className = "sidebar-photo";
    wrap.innerHTML = `
      <div class="photo-frame">
        <img id="profile-photo"
             src="${KID}"
             data-kid="${KID}"
             data-present="${PRESENT}"
             alt="Tanay Kasyap (kid photo)"
             width="168" height="168" loading="eager">
      </div>
      <button id="toggle-photo" class="btn btn-primary w-100 mt-2" type="button">
        <span class="swap">See present me</span>
      </button>`;
    return wrap;
  }

  // Build mobile hero portrait with larger size
  function buildMobilePortrait() {
    const portrait = document.createElement("div");
    portrait.className = "hero-portrait-wrapper";
    portrait.innerHTML = `
      <div class="hero-portrait">
        <img id="mobile-profile-photo"
             src="${KID}"
             data-kid="${KID}"
             data-present="${PRESENT}"
             alt="Tanay Kasyap (kid photo)"
             width="180" height="180" loading="eager">
      </div>
      <button class="hero-portrait-toggle" type="button">
        <span class="swap">See present me</span>
      </button>`;
    return portrait;
  }

  // Wire up portrait toggle functionality
  function wirePortraitToggle(imgSelector, btnSelector) {
    const img = document.querySelector(imgSelector);
    const btn = document.querySelector(btnSelector);
    if (!img || !btn) return;
    
    let showingKid = true;
    btn.addEventListener("click", () => {
      const label = btn.querySelector(".swap");
      img.classList.add("fadeout");
      
      setTimeout(() => {
        showingKid = !showingKid;
        img.src = showingKid ? img.dataset.kid : img.dataset.present;
        img.alt = showingKid ? "Tanay Kasyap (kid photo)" : "Tanay Kasyap (present photo)";
        if (label) {
          label.textContent = showingKid ? "See present me" : "Back to kid me";
        }
        img.classList.remove("fadeout");
      }, 140);
    });
  }

  // Mount mobile navigation
  function mountMobileNav() {
    if (!isMobile()) {
      remove("#mobile-nav");
      return;
    }

    // Don't recreate if already exists
    if (document.getElementById("mobile-nav")) return;

    // Create mobile navigation structure
    const nav = document.createElement("nav");
    nav.id = "mobile-nav";
    nav.className = "mobile-nav";
    nav.innerHTML = `
      <div class="mobile-nav-header">
        <div class="mobile-nav-brand">Tanay Kasyap</div>
        <button class="mobile-nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
          <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
      <div class="mobile-nav-tabs hidden"></div>`;
    
    document.body.prepend(nav);

    // Populate navigation tabs
    const tabs = nav.querySelector(".mobile-nav-tabs");
    
    // Define the navigation items in the order you want them
    const navItems = [
      { text: "Home", href: "index.html" },
      { text: "Research", href: "research.html" },
      { text: "Teaching", href: "teaching.html" },
      { text: "Code", href: "code.html" },
      { text: "Fun", href: "fun.html" },
      { text: "CV", href: "cv.html" }
    ];

    // Add each navigation item as a tab
    navItems.forEach((item, index) => {
      const tab = document.createElement("a");
      tab.href = item.href;
      tab.textContent = item.text;
      
      // Mark the current page as active
      const currentPath = window.location.pathname;
      const tabPath = item.href;
      
      // Check if this is the active page
      if (currentPath.endsWith(tabPath) || 
          (currentPath.endsWith("/") && tabPath === "index.html") ||
          (currentPath.endsWith("index.html") && tabPath === "index.html")) {
        tab.classList.add("active");
      }
      
      tabs.appendChild(tab);
    });

    // Toggle menu functionality
    const toggleBtn = nav.querySelector(".mobile-nav-toggle");
    const tabsContainer = nav.querySelector(".mobile-nav-tabs");
    
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
      
      if (isExpanded) {
        tabsContainer.classList.add("hidden");
        toggleBtn.classList.remove("active");
        toggleBtn.setAttribute("aria-expanded", "false");
      } else {
        tabsContainer.classList.remove("hidden");
        toggleBtn.classList.add("active");
        toggleBtn.setAttribute("aria-expanded", "true");
        
        // Ensure the active tab is visible by scrolling to it
        setTimeout(() => {
          const activeTab = tabs.querySelector(".active");
          if (activeTab) {
            activeTab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
          }
        }, 100);
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !tabsContainer.classList.contains("hidden")) {
        tabsContainer.classList.add("hidden");
        toggleBtn.classList.remove("active");
        toggleBtn.setAttribute("aria-expanded", "false");
      }
    });

    // Close menu when clicking a tab link
    tabs.querySelectorAll("a").forEach(tab => {
      tab.addEventListener("click", () => {
        tabsContainer.classList.add("hidden");
        toggleBtn.classList.remove("active");
        toggleBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Mount desktop portrait in sidebar
  function mountDesktopPortrait() {
    if (isMobile()) return;
    
    // Remove any existing portrait
    remove("#sidebar-photo-block");
    
    // Find sidebar and insert portrait
    const sidebar = document.querySelector("#quarto-sidebar, aside.sidebar, nav.sidebar");
    if (!sidebar) return;
    
    const titleEl = sidebar.querySelector(".sidebar-title");
    if (!titleEl) return;
    
    const portrait = buildDesktopPortrait();
    titleEl.insertAdjacentElement("afterend", portrait);
    
    // Wire up toggle functionality
    wirePortraitToggle("#profile-photo", "#toggle-photo");
  }

  // Mount mobile portrait in hero
  function mountMobilePortrait() {
    if (!isMobile()) {
      remove(".hero-portrait-wrapper");
      return;
    }
    
    // Don't recreate if already exists
    if (document.querySelector(".hero-portrait-wrapper")) return;
    
    const hero = document.querySelector(".hero");
    if (!hero) return;
    
    // Find where to insert the portrait (after the emblem if it exists)
    const emblem = hero.querySelector(".hero-emblem");
    const portrait = buildMobilePortrait();
    
    if (emblem) {
      emblem.insertAdjacentElement("afterend", portrait);
    } else {
      hero.insertAdjacentElement("afterbegin", portrait);
    }
    
    // Wire up toggle functionality
    wirePortraitToggle("#mobile-profile-photo", ".hero-portrait-toggle");
  }

  // Hide Quarto's default headers on mobile
  function hideQuartoHeaders() {
    if (isMobile()) {
      // Hide all possible Quarto title elements
      const selectorsToHide = [
        "#quarto-header",
        ".quarto-title-meta",
        "#title-block-header",
        ".quarto-title",
        "h1.title",
        "header.page-header",
        ".page-header",
        ".quarto-title-block"
      ];
      
      selectorsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.style.display = "none";
        });
      });
    }
  }

  // Main initialization function
  function init() {
    hideQuartoHeaders();
    
    if (isMobile()) {
      mountMobileNav();
      mountMobilePortrait();
      // Hide desktop sidebar elements
      const sidebar = document.querySelector("#quarto-sidebar");
      if (sidebar) sidebar.style.display = "none";
    } else {
      mountDesktopPortrait();
      // Remove mobile elements if they exist
      remove("#mobile-nav");
      remove(".hero-portrait-wrapper");
    }
  }

  // Debounce utility for resize events
  const debounce = (fn, delay = 150) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  // Initialize on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    init();
    
    // Re-initialize on window resize with debouncing
    window.addEventListener("resize", debounce(() => {
      init();
    }, 200));
    
    // Also run after a short delay to catch any late-loading Quarto elements
    setTimeout(() => {
      hideQuartoHeaders();
    }, 100);
  });
})();