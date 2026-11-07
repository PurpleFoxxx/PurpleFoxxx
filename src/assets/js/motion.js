(function () {
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var GLYPHS = "#%&$<>/\\01{}_+*";

  // ---- 1. Text decrypt / glyph scramble ----
  function decrypt(el, duration) {
    if (!el) return;
    var ms = duration || 620;
    var finalText = el.getAttribute("data-text") || el.textContent.trim();
    el.setAttribute("data-text", finalText);
    if (RM) {
      el.textContent = finalText;
      return;
    }
    var t0 = performance.now();
    function tick(now) {
      var k = Math.min(1, (now - t0) / ms);
      var lock = Math.floor(k * finalText.length);
      var out = "";
      for (var i = 0; i < finalText.length; i++) {
        var ch = finalText[i];
        if (i < lock || ch === " " || ch === "_" || ch === "—") {
          out += ch;
        } else {
          out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
      }
      el.textContent = out;
      if (k < 1) requestAnimationFrame(tick);
      else el.textContent = finalText;
    }
    requestAnimationFrame(tick);
  }

  // ---- 2. Split [data-reveal="words"] into word masks ----
  document.querySelectorAll('[data-reveal="words"]').forEach(function (el) {
    var raw = el.textContent.trim().replace(/\s+/g, " ");
    el.setAttribute("aria-label", raw);
    var words = raw.split(" ");
    el.innerHTML = words
      .map(function (w, i) {
        return (
          '<span class="w" aria-hidden="true"><span style="--i:' +
          i +
          '">' +
          w +
          "</span></span>"
        );
      })
      .join(" ");
  });

  // ---- 3. Count-up numbers ----
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var plain = el.getAttribute("data-plain") === "true";
    if (isNaN(target) || RM || plain) {
      el.textContent = String(target);
      return;
    }
    var dur = 850;
    var t0 = performance.now();
    function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = String(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = String(target);
    }
    requestAnimationFrame(step);
  }

  // ---- 4. Scroll observer (fires at 60% viewport height, matching Gruhas) ----
  var revealEls = document.querySelectorAll(
    "[data-reveal], [data-count], .rule-draw",
  );
  if (RM) {
    revealEls.forEach(function (el) {
      el.classList.add("in");
      if (el.hasAttribute("data-count")) countUp(el);
    });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var t = entry.target;
          t.classList.add("in");
          if (t.hasAttribute("data-count")) countUp(t);
          io.unobserve(t);
        });
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.05 },
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  }

  // ---- 5. Intro curtain: Fox crest + expanding PurpleFoxxx ----
  // Initial visit: ~3.8s (within 3-5s) | Every refresh: ~2.5s (within 2-3s)
  var intro = document.querySelector("[data-intro]");
  if (intro) {
    var curtain = intro.querySelector("[data-intro-curtain]");
    var seen = false;
    try {
      seen = sessionStorage.getItem("pfx-intro") === "1";
    } catch (_) {}

    if (RM) {
      intro.classList.add("intro-skip", "intro-done");
    } else {
      var totalMs = seen ? 2500 : 3800;
      var fadeAtMs = seen ? 1900 : 3100;
      if (curtain) {
        curtain.style.setProperty("--intro-dur", totalMs + "ms");
      }
      try {
        sessionStorage.setItem("pfx-intro", "1");
      } catch (_) {}

      intro.classList.add("intro-play");
      setTimeout(function () {
        intro.classList.add("intro-done");
      }, fadeAtMs);
      setTimeout(function () {
        intro.classList.add("intro-skip");
      }, totalMs + 100);
    }
  }

  // ---- 6. Decrypt on hover / focus (pack handles, etc.) ----
  document.querySelectorAll("[data-decrypt]").forEach(function (el) {
    var host = el.closest("[data-decrypt-trigger]") || el;
    host.addEventListener("mouseenter", function () {
      decrypt(el, 520);
    });
    host.addEventListener("focusin", function () {
      decrypt(el, 520);
    });
  });

  // ---- 7. Disciplines vertical tabs ----
  var discItems = document.querySelectorAll("[data-disc-item]");
  if (discItems.length) {
    function activateDisc(target) {
      discItems.forEach(function (item) {
        var active = item === target;
        item.classList.toggle("is-active", active);
        var btn = item.querySelector("[data-disc-btn]");
        if (btn) btn.setAttribute("aria-expanded", active ? "true" : "false");
      });
    }
    discItems.forEach(function (item) {
      var btn = item.querySelector("[data-disc-btn]");
      item.addEventListener("mouseenter", function () {
        if (window.matchMedia("(min-width: 768px)").matches) activateDisc(item);
      });
      if (btn) {
        btn.addEventListener("click", function () {
          activateDisc(item);
        });
        btn.addEventListener("focus", function () {
          activateDisc(item);
        });
      }
    });
  }

  // ---- 8. Pack row click toggle for touch/keyboard ----
  document.querySelectorAll(".pack-row").forEach(function (row) {
    row.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      row.classList.toggle("is-open");
    });
  });

  // ---- 9. Sticky tilted build cards straighten on scroll ----
  var buildCards = document.querySelectorAll(".build-card");
  if (buildCards.length && !RM) {
    var ticking = false;
    function updateCards() {
      var vh = window.innerHeight || 1;
      buildCards.forEach(function (card) {
        var r = card.getBoundingClientRect();
        var progress = 1 - Math.max(0, Math.min(1, (r.top - vh * 0.18) / (vh * 0.55)));
        card.style.setProperty("--straighten", progress.toFixed(3));
      });
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateCards);
        }
      },
      { passive: true },
    );
    updateCards();
  }

  // ---- 10. Full-screen Menu overlay with focus trap & Esc ----
  var menu = document.getElementById("site-menu");
  var openBtns = document.querySelectorAll("[data-menu-toggle]");
  var closeBtns = document.querySelectorAll("[data-menu-close]");
  var lastFocused = null;

  function setMenu(open) {
    if (!menu) return;
    var isMobile = window.matchMedia("(max-width: 767px)").matches;
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("menu-open", open);
    document.body.style.overflow = open && isMobile ? "hidden" : "";
    openBtns.forEach(function (b) {
      b.setAttribute("aria-expanded", open ? "true" : "false");
      var label = b.querySelector("[data-menu-label]");
      if (label) label.textContent = open ? "Close" : "Menu";
    });
    if (open) {
      lastFocused = document.activeElement;
      var closeBtn = menu.querySelector("[data-menu-close-primary]") || menu.querySelector("button, a");
      if (closeBtn) closeBtn.focus();
    } else if (lastFocused) {
      lastFocused.focus();
    }
  }

  openBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var isOpen = menu && menu.classList.contains("is-open");
      setMenu(!isOpen);
    });
  });
  closeBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setMenu(false);
    });
  });
  window.addEventListener("keydown", function (e) {
    if (!menu || !menu.classList.contains("is-open")) return;
    if (e.key === "Escape") {
      setMenu(false);
      return;
    }
    if (e.key === "Tab") {
      var focusables = menu.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // ---- 11. Copy email to clipboard ----
  document.querySelectorAll("[data-copy-email]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var email = btn.getAttribute("data-copy-email");
      var status = btn.querySelector("[data-copy-status]");
      if (!email) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).catch(function () {});
      }
      if (status) {
        var prev = status.textContent;
        status.textContent = "copied";
        setTimeout(function () {
          status.textContent = prev;
        }, 1800);
      }
    });
  });
})();
