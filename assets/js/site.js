
document.addEventListener("DOMContentLoaded", function () {
  // ---- exact image paths
  const KID = "assets/img/kid-tanay.jpg";
  const PRESENT = "assets/img/today-tanay.jpg";

  // Find the sidebar in a robust way (desktop or mobile)
  const sidebar =
    document.querySelector("#quarto-sidebar") ||
    document.querySelector("aside.sidebar") ||
    document.querySelector("nav.sidebar");

  if (!sidebar) return;

  // Avoid duplicate insertion
  if (document.getElementById("sidebar-photo-block")) return;

  function buildBlock() {
    const block = document.createElement("div");
    block.id = "sidebar-photo-block";
    block.className = "sidebar-photo";
    block.innerHTML = `
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
      </button>
    `;
    return block;
  }

  function insertBlock() {
    if (document.getElementById("sidebar-photo-block")) return true;

    const titleEl = sidebar.querySelector(".sidebar-title");
    if (!titleEl) return false;

    const block = buildBlock();
    titleEl.insertAdjacentElement("afterend", block);

    // Toggle logic
    const img = block.querySelector("#profile-photo");
    const btn = block.querySelector("#toggle-photo");
    let showingKid = true;

    btn.addEventListener("click", () => {
      const label = btn.querySelector(".swap");
      img.classList.add("fadeout");
      setTimeout(() => {
        showingKid = !showingKid;
        img.src = showingKid ? img.dataset.kid : img.dataset.present;
        img.alt = showingKid ? "Tanay Kasyap (kid photo)" : "Tanay Kasyap (present photo)";
        if (label) label.textContent = showingKid ? "See present me" : "Back to kid me";
        img.classList.remove("fadeout");
      }, 140);
    });

    return true;
  }

  // Try immediately
  if (insertBlock()) return;

  // If .sidebar-title not yet present (mobile/async), observe and insert once available
  const mo = new MutationObserver(() => {
    if (insertBlock()) mo.disconnect();
  });
  mo.observe(sidebar, { subtree: true, childList: true });
});

