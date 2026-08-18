(function () {
  const search = document.querySelector("[data-addr-search]");
  const input = search && search.querySelector("#addr-input");
  const sugg = search && search.querySelector("#addr-sugg");
  const findBtn = search && search.querySelector("#addr-find");
  const empty = search && search.querySelector("#addr-empty");
  const title = document.querySelector("#addr-result-title");
  const results = document.querySelector("[data-addr-results]");
  const resultSec = document.querySelector("#result");
  const tabs = document.querySelector("[data-addr-tabs]");

  let placeType = "flat";

  const closeSugg = () => {
    if (!search) return;
    search.classList.remove("is-open");
    if (sugg) sugg.hidden = true;
    if (input) input.setAttribute("aria-expanded", "false");
  };

  const openSugg = () => {
    if (!search) return;
    search.classList.add("is-open");
    if (sugg) sugg.hidden = false;
    if (input) input.setAttribute("aria-expanded", "true");
  };

  const applyType = () => {
    if (!results) return;
    results.querySelectorAll(".addr-prow__row").forEach((row) => {
      const types = (row.getAttribute("data-types") || "").split(",");
      row.hidden = types.indexOf(placeType) === -1;
    });
  };

  const resolve = () => {
    if (!input) return;
    const value = (input.value || "").trim();
    if (empty) empty.hidden = true;
    input.classList.remove("is-success");
    if (!value) return;
    if (value.toLowerCase().includes("полев")) {
      if (empty) empty.hidden = false;
      if (resultSec) resultSec.hidden = true;
      return;
    }
    input.classList.add("is-success");
    if (resultSec) resultSec.hidden = false;
    if (title) title.textContent = "Провайдеры по адресу: " + value;
    applyType();
    if (resultSec) resultSec.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (search && input && sugg && findBtn) {
    input.addEventListener("focus", openSugg);
    input.addEventListener("input", () => {
      if (empty) empty.hidden = true;
      input.classList.remove("is-success");
      openSugg();
    });
    input.addEventListener("blur", () => {
      window.setTimeout(closeSugg, 160);
    });
    sugg.querySelectorAll("[data-addr]").forEach((item) => {
      item.addEventListener("mousedown", (event) => {
        event.preventDefault();
        input.value = item.getAttribute("data-addr") || item.textContent.trim();
        closeSugg();
        resolve();
      });
    });
    findBtn.addEventListener("click", () => {
      closeSugg();
      resolve();
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        closeSugg();
        resolve();
      }
    });
  }

  if (tabs) {
    tabs.querySelectorAll("[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        tabs.querySelectorAll("[data-tab]").forEach((other) => {
          other.classList.remove("is-on");
          other.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-on");
        btn.setAttribute("aria-selected", "true");
        placeType = btn.getAttribute("data-tab") || "flat";
        applyType();
      });
    });
  }

  applyType();
})();
