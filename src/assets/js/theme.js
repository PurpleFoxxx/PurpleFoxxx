(function () {
  var STORAGE_KEY = "pfx-theme";
  var toggles = document.querySelectorAll("[data-theme-toggle], #theme-toggle");
  if (!toggles.length) return;

  function currentTheme() {
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  }

  function syncLabels(theme) {
    toggles.forEach(function (btn) {
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      var label = btn.querySelector("[data-theme-label]");
      if (label) label.textContent = theme === "dark" ? "Dark" : "Light";
    });
  }

  function setTheme(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {}
    syncLabels(theme);
  }

  toggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  });

  syncLabels(currentTheme());
})();
