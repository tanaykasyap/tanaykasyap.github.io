<script>
document.addEventListener("DOMContentLoaded", function () {
  const KID = "assets/img/kid-tanay.jpg";
  const PRESENT = "assets/img/today-tanay.jpg";

  const aside = document.querySelector("aside.sidebar");
  if (!aside) return;
  if (document.getElementById("sidebar-photo-block")) return;

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
    <button id="toggle-photo" class="btn btn-primary w-100 mt-2" type="button">
      <span class="swap">See present me</span>
    </button>
  `;

  // Insert right AFTER the sidebar title in all layouts
  const titleEl = aside.querySelector(".sidebar-title") || aside.firstElementChild;
  if (titleEl) {
    titleEl.insertAdjacentElement("afterend", block);
  } else {
    aside.appendChild(block);
  }

  // Toggle logic (unchanged)
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
</script>
