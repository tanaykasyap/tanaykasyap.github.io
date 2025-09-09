document.addEventListener("DOMContentLoaded", function () {
  // exact image paths (ensure these files exist)
  const KID ="assets/img/kid-tanay.jpg";
  const PRESENT ="assets/img/today-tanay.jpg";

  // Find the Quarto sidebar (handle multiple possible DOM shapes)
  const aside =
    document.querySelector("#quarto-sidebar") ||
    document.querySelector("nav.sidebar") ||
    document.querySelector("aside.sidebar") ||
    document.querySelector(".sidebar");

  if (!aside) { console.warn("Sidebar not found"); return; }
  if (document.getElementById("sidebar-photo-block")) return;

  // Find the title (your name) and search box
  const title =
    aside.querySelector(".sidebar-title, .title, .sidebar-header .title, .sidebar-header .sidebar-title");
  const search =
    aside.querySelector(".sidebar-search, #quarto-search, input[type='search']")?.closest("*");

  // Build the photo + button block
  const block = document.createElement("div");
  block.id = "sidebar-photo-block";
  block.className = "sidebar-photo";
  block.innerHTML = `
    <div class="photo-frame">
      <img id="profile-photo"
           src="${KID}"
           data-kid="${KID}"
           data-present="${PRESENT}"
           alt="Tanay Kasyap (kid photo)">
    </div>
    <button id="toggle-photo" class="btn btn-primary mt-2" type="button">
      <span class="swap">See present me</span>
    </button>
  `;

  // Insert **after the title** (i.e., directly under your name).
  if (title) {
    title.insertAdjacentElement("afterend", block);
  } else if (search) {
    aside.insertBefore(block, search);
  } else {
    aside.prepend(block);
  }

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
});
