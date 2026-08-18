(function () {
  if (window.__shInit) return;
  window.__shInit = true;

  function q(sel) {
    return document.querySelector(sel);
  }

  function setOpen(el, open) {
    if (el) el.classList.toggle("is-open", open);
  }

  function lockBody() {
    const drawerOpen = document.querySelector(".header-drawer.is-open");
    const modalOpen = document.querySelector(".app-modal.is-open");
    if (!modalOpen) {
      document.body.style.overflow = drawerOpen ? "hidden" : "";
    }
  }

  function closeMega() {
    document.querySelectorAll(".header__mega, .header__scrim").forEach(function (e) {
      e.classList.remove("is-open");
    });
    document.querySelectorAll(".header__tariffs-btn").forEach(function (b) {
      b.classList.remove("open");
    });
  }

  function closeAll() {
    closeMega();
    document.querySelectorAll(".header-drawer").forEach(function (e) {
      e.classList.remove("is-open");
    });
    if (window.appModal) {
      window.appModal.closeActive();
    }
    lockBody();
  }

  document.addEventListener("click", function (ev) {
    var t = ev.target.closest ? ev.target.closest("[data-sh]") : null;
    if (t) {
      var act = t.getAttribute("data-sh");
      if (act === "tar") {
        ev.preventDefault();
        var mega = q(".header__mega");
        var scrim = q(".header__scrim");
        var open = !(mega && mega.classList.contains("is-open"));
        setOpen(mega, open);
        setOpen(scrim, open);
        t.classList.toggle("open", open);
      } else if (act === "tar-close") {
        ev.preventDefault();
        closeMega();
      } else if (act === "menu") {
        ev.preventDefault();
        var d = q(".header-drawer");
        setOpen(d, !(d && d.classList.contains("is-open")));
        lockBody();
      } else if (act === "menu-close") {
        setOpen(q(".header-drawer"), false);
        lockBody();
      } else if (act === "city") {
        ev.preventDefault();
        closeMega();
        setOpen(q(".header-drawer"), false);
        var cityModal = q("#city-picker-modal");
        if (window.appModal && cityModal) {
          window.appModal.open(cityModal, t);
        }
        lockBody();
      } else if (act === "callback") {
        ev.preventDefault();
        closeMega();
        setOpen(q(".header-drawer"), false);
        var callbackModal = q("#callback-modal");
        if (window.appModal && callbackModal) {
          window.appModal.open(callbackModal, t);
        }
        lockBody();
      } else if (act === "close") {
        ev.preventDefault();
        var modal = t.closest(".app-modal");
        if (modal && window.appModal) {
          window.appModal.close(modal);
        }
        lockBody();
      }
      return;
    }
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") closeAll();
  });

  var utilScroll = {
    lastY: 0,
    acc: 0,
    hidden: false,
    ticking: false,
  };

  var UTIL_HIDE_AFTER = 36;
  var UTIL_SHOW_AFTER = 14;
  var UTIL_TOP_THRESHOLD = 10;

  function applyUtilBar(h, y) {
    if (window.innerWidth <= 980) {
      if (utilScroll.hidden) {
        h.classList.remove("is-util-hidden");
        utilScroll.hidden = false;
      }
      utilScroll.acc = 0;
      utilScroll.lastY = y;
      return;
    }

    var delta = y - utilScroll.lastY;

    if (y <= UTIL_TOP_THRESHOLD) {
      utilScroll.acc = 0;
      if (utilScroll.hidden) {
        h.classList.remove("is-util-hidden");
        utilScroll.hidden = false;
      }
    } else {
      if ((delta > 0 && utilScroll.acc < 0) || (delta < 0 && utilScroll.acc > 0)) {
        utilScroll.acc = delta;
      } else {
        utilScroll.acc += delta;
      }

      if (!utilScroll.hidden && utilScroll.acc >= UTIL_HIDE_AFTER && y > 52) {
        h.classList.add("is-util-hidden");
        utilScroll.hidden = true;
        utilScroll.acc = 0;
      } else if (utilScroll.hidden && utilScroll.acc <= -UTIL_SHOW_AFTER) {
        h.classList.remove("is-util-hidden");
        utilScroll.hidden = false;
        utilScroll.acc = 0;
      }
    }

    utilScroll.lastY = y;
  }

  function onScroll() {
    var h = q(".header:not(:has(.header__menu))");
    if (!h) return;

    if (utilScroll.ticking) return;
    utilScroll.ticking = true;

    requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset || 0;
      h.classList.toggle("is-scrolled", y > 20);
      applyUtilBar(h, y);
      utilScroll.ticking = false;
    });
  }

  window.addEventListener("resize", function () {
    var h = q(".header:not(:has(.header__menu))");
    if (!h) return;
    if (window.innerWidth <= 980) {
      h.classList.remove("is-util-hidden");
      utilScroll.hidden = false;
      utilScroll.acc = 0;
    }
    utilScroll.lastY = window.scrollY || window.pageYOffset || 0;
  });
  window.addEventListener("scroll", onScroll, { passive: true });

  var citySearch = q(".city-picker__search");
  if (citySearch) {
    citySearch.addEventListener("input", function () {
      var qv = citySearch.value.trim().toLowerCase();
      document.querySelectorAll(".city-picker__pills a").forEach(function (a) {
        a.hidden = Boolean(qv) && a.textContent.toLowerCase().indexOf(qv) === -1;
      });
      document.querySelectorAll(".city-picker__grid > div").forEach(function (col) {
        var name = (col.querySelector(".city-picker__region") || {}).textContent || "";
        var kids = Array.from(col.querySelectorAll(".city-picker__cities a"));
        var nameHit = name.toLowerCase().indexOf(qv) !== -1;
        kids.forEach(function (k) {
          k.hidden = Boolean(qv) && !nameHit && k.textContent.toLowerCase().indexOf(qv) === -1;
        });
        var anyKid = kids.some(function (k) {
          return !k.hidden;
        });
        col.hidden = Boolean(qv) && !nameHit && !anyKid;
      });
      document.querySelectorAll(".city-picker__section").forEach(function (sec) {
        var visible = sec.querySelector("a:not([hidden]), .city-picker__grid > div:not([hidden])");
        sec.hidden = Boolean(qv) && !visible;
      });
    });
  }
})();
