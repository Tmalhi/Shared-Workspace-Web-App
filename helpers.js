// ----- helpers.js (FINAL) -----

// 1) Backend URL
window.API = window.API || "http://localhost:5000";

// 2) Optional: set this BEFORE helpers.js if you deploy under a subpath (e.g. GitHub Pages project)
// Example in HTML (before helpers.js):
// <script>window.SITE_BASE = "/your-repo-name/";</script>
window.SITE_BASE = window.SITE_BASE || "/";

// 3) Auth header helper
window.authHeaders = function () {
  try {
    const token = JSON.parse(localStorage.getItem("authToken") || "null");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
};

// 4) One-click logout (single definition, robust redirect)
window.setupLogout = function (anchorId) {
  const a = document.getElementById(anchorId);
  if (!a) return;

  a.addEventListener("click", (e) => {
    e.preventDefault();

    // clear session
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInUser");

    // normalize base path (ensure trailing slash)
    const base = window.SITE_BASE.endsWith("/") ? window.SITE_BASE : window.SITE_BASE + "/";

    // Redirect to site root so the server serves index.html automatically
    // Works for http-server, most static hosts, and GitHub Pages (when SITE_BASE is set)
    window.location.assign(window.location.origin + base);

    // If you specifically want index.html, uncomment this fallback:
    // window.location.assign(window.location.origin + base + "index.html");
  });
};
