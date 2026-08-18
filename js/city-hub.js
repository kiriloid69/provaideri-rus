(function () {
  const search = document.querySelector("[data-city-hub-search]");
  if (search) {
    const input = search.querySelector("#city-hub-addr");
    const sugg = search.querySelector("#city-hub-sugg");
    const findBtn = search.querySelector("#city-hub-find");
    const ok = search.querySelector("#city-hub-ok");
    const empty = search.querySelector("#city-hub-empty");

    const closeSugg = () => {
      search.classList.remove("is-open");
      if (sugg) sugg.hidden = true;
      if (input) input.setAttribute("aria-expanded", "false");
    };

    const openSugg = () => {
      search.classList.add("is-open");
      if (sugg) sugg.hidden = false;
      if (input) input.setAttribute("aria-expanded", "true");
    };

    const resolve = () => {
      const value = (input.value || "").trim().toLowerCase();
      ok.hidden = true;
      empty.hidden = true;
      input.classList.remove("is-success");
      if (!value) return;
      if (value.includes("полев")) {
        empty.hidden = false;
        return;
      }
      input.classList.add("is-success");
      ok.hidden = false;
    };

    input.addEventListener("focus", openSugg);
    input.addEventListener("input", () => {
      ok.hidden = true;
      empty.hidden = true;
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

  const sortWrap = document.querySelector("[data-city-hub-sort]");
  const rankList = document.querySelector("[data-city-hub-rank]");
  if (sortWrap && rankList) {
    const buttons = sortWrap.querySelectorAll("[data-sort]");
    const resort = (key) => {
      const rows = Array.from(rankList.children);
      rows.sort((a, b) => {
        const av = Number(a.dataset[key] || 0);
        const bv = Number(b.dataset[key] || 0);
        return key === "price" ? av - bv : bv - av;
      });
      rows.forEach((row, index) => {
        const medal = row.querySelector(".city-hub-medal");
        if (medal) {
          medal.textContent = String(index + 1);
          medal.classList.remove("city-hub-medal--g1", "city-hub-medal--g2", "city-hub-medal--g3");
          if (index === 0) medal.classList.add("city-hub-medal--g1");
          if (index === 1) medal.classList.add("city-hub-medal--g2");
          if (index === 2) medal.classList.add("city-hub-medal--g3");
        }
        row.classList.toggle("is-lead", index === 0);
        rankList.appendChild(row);
      });
    };
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((other) => other.classList.remove("city-street-sort__btn--active", "is-on"));
        btn.classList.add("city-street-sort__btn--active");
        resort(btn.getAttribute("data-sort"));
      });
    });
  }

  const mapTabs = document.querySelector("[data-city-hub-map]");
  const cap = document.querySelector("#city-hub-mcap-text");
  if (mapTabs && cap) {
    mapTabs.querySelectorAll(".city-hub-mtab").forEach((tab) => {
      tab.addEventListener("click", () => {
        mapTabs.querySelectorAll(".city-hub-mtab").forEach((other) => other.classList.remove("is-on"));
        tab.classList.add("is-on");
        cap.textContent = tab.getAttribute("data-cap") || cap.textContent;
      });
    });
  }

  const canvas = document.querySelector("[data-city-hub-canvas]");
  if (canvas) {
    const parseCenter = () => {
      const raw = (canvas.dataset.center || "52.6088,39.5992").split(",");
      const lat = Number(raw[0]);
      const lon = Number(raw[1]);
      return Number.isFinite(lat) && Number.isFinite(lon) ? [lat, lon] : [52.6088, 39.5992];
    };
    const zoom = Number(canvas.dataset.zoom) || 12;
    const points = [
      [52.6088, 39.5992, "Липецк"],
      [52.6047, 39.5702, "ул. Гагарина"],
      [52.609, 39.568, "ул. Космонавтов"],
      [52.599, 39.581, "пр-т Победы"],
    ];

    const mountIframe = () => {
      if (canvas.querySelector("iframe")) return;
      const [lat, lon] = parseCenter();
      const iframe = document.createElement("iframe");
      iframe.title = "Карта покрытия Липецка";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.src = `https://yandex.ru/map-widget/v1/?ll=${encodeURIComponent(`${lon},${lat}`)}&z=${zoom}&l=map`;
      iframe.setAttribute("allowfullscreen", "");
      Object.assign(iframe.style, { width: "100%", height: "100%", border: "0" });
      canvas.appendChild(iframe);
    };

    if (typeof ymaps !== "undefined") {
      ymaps.ready(() => {
        const map = new ymaps.Map(
          canvas,
          {
            center: parseCenter(),
            zoom,
            controls: ["zoomControl", "geolocationControl"],
          },
          { suppressMapOpenBlock: true }
        );
        points.forEach(([lat, lon, name]) => {
          map.geoObjects.add(
            new ymaps.Placemark(
              [lat, lon],
              { balloonContent: name, hintContent: name },
              { preset: "islands#greenCircleDotIcon" }
            )
          );
        });
      });
    } else {
      mountIframe();
    }
  }
})();
