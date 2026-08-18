(function () {
  const tabs = document.querySelector("[data-prov-tabs]");
  if (tabs) {
    const links = tabs.querySelectorAll("a[href^='#']");
    const setActive = (id) => {
      links.forEach((link) => {
        const on = link.getAttribute("href") === "#" + id;
        link.classList.toggle("is-on", on);
      });
    };
    links.forEach((link) => {
      link.addEventListener("click", () => {
        setActive((link.getAttribute("href") || "").slice(1));
      });
    });
    const sections = Array.from(links)
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);
    if (sections.length && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible && visible.target.id) setActive(visible.target.id);
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: [0.15, 0.4] }
      );
      sections.forEach((section) => observer.observe(section));
    }
  }

  const search = document.querySelector("[data-prov-check]");
  if (!search) return;
  const field = search.querySelector(".city-hub-search") || search;
  const input = search.querySelector("#prov-addr");
  const sugg = search.querySelector("#prov-sugg");
  const findBtn = search.querySelector("#prov-find");
  const ok = search.querySelector("#prov-ok");
  const no = search.querySelector("#prov-no");

  const closeSugg = () => {
    field.classList.remove("is-open");
    if (sugg) sugg.hidden = true;
    if (input) input.setAttribute("aria-expanded", "false");
  };
  const openSugg = () => {
    field.classList.add("is-open");
    if (sugg) sugg.hidden = false;
    if (input) input.setAttribute("aria-expanded", "true");
  };
  const resolve = () => {
    const value = (input.value || "").trim().toLowerCase();
    ok.hidden = true;
    no.hidden = true;
    input.classList.remove("is-success");
    if (!value) return;
    if (value.includes("полев")) {
      no.hidden = false;
      return;
    }
    input.classList.add("is-success");
    ok.hidden = false;
  };

  input.addEventListener("focus", openSugg);
  input.addEventListener("input", () => {
    ok.hidden = true;
    no.hidden = true;
    input.classList.remove("is-success");
    openSugg();
  });
  input.addEventListener("blur", () => window.setTimeout(closeSugg, 160));
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
})();
