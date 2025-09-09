<script>
(function () {
  function openHashTarget() {
    const id = decodeURIComponent(location.hash.replace('#',''));
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    // If the target is a <details>, open it; otherwise open the nearest <details>
    const details = el.tagName.toLowerCase() === 'details' ? el : el.closest('details');
    if (details && !details.open) details.open = true;
    (details || el).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  window.addEventListener('DOMContentLoaded', openHashTarget);
  window.addEventListener('hashchange', openHashTarget);
})();
</script>
