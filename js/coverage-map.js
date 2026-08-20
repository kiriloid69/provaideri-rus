(function () {
  const root = document.querySelector("[data-cov]");
  const mapEl = document.getElementById("cov-map");
  if (!root || !mapEl || typeof ymaps === "undefined") return;
  const modePage = root.getAttribute("data-cov") || "all";
  const LOGO = "../images/operators-logos/";

  const OPS = {
    rtk: { name: "Ростелеком", logo: LOGO + "rtk.png", page: "provider_page.html", cov: 78, tech: "FTTB, GPON", speed: "до 1 Гбит/с", tar: 38, rate: "4,8" },
    mts: { name: "МТС", logo: LOGO + "mts.png", page: "provider_page.html", cov: 62, tech: "FTTB, GPON", speed: "до 1 Гбит/с", tar: 38, rate: "4,6" },
    beeline: { name: "билайн", logo: LOGO + "beeline.png", page: "provider_page.html", cov: 66, tech: "FTTB", speed: "до 500 Мбит/с", tar: 26, rate: "4,5" },
    megafon: { name: "МегаФон", logo: LOGO + "megafon.png", page: "provider_page.html", cov: 62, tech: "FTTB, GPON", speed: "до 1 Гбит/с", tar: 24, rate: "4,3" },
    domru: { name: "Дом.ру", logo: LOGO + "domru.png", page: "provider_page.html", cov: 58, tech: "FTTB", speed: "до 500 Мбит/с", tar: 19, rate: "4,4" },
  };

  const ZONES_MTS = [
    { id: "sov", name: "Советский район", lat: 52.6086, lon: 39.5992, r: 1800, cov: 74, tech: "GPON, FTTB", tag: "gpon", speed: "1 Гбит/с", tar: 18, term: "1–2 дня" },
    { id: "okt", name: "Октябрьский район", lat: 52.6255, lon: 39.568, r: 2000, cov: 68, tech: "GPON, FTTB", tag: "gpon", speed: "1 Гбит/с", tar: 16, term: "1–2 дня" },
    { id: "prav", name: "Правобережный район", lat: 52.598, lon: 39.645, r: 2200, cov: 54, tech: "FTTB", tag: "fttb", speed: "500 Мбит/с", tar: 12, term: "1–3 дня" },
    { id: "lev", name: "Левобережный район", lat: 52.595, lon: 39.53, r: 2200, cov: 48, tech: "FTTB", tag: "fttb", speed: "500 Мбит/с", tar: 11, term: "2–3 дня" },
  ];

  const ZONES_ALL = [
    { id: "sov", name: "Советский район", lat: 52.6086, lon: 39.5992, r: 1800, cov: 98, tech: "GPON, FTTB", speed: "1 Гбит/с", tar: 86, ops: { rtk: 88, mts: 74, beeline: 59, megafon: 47, domru: 34 } },
    { id: "okt", name: "Октябрьский район", lat: 52.6255, lon: 39.568, r: 2000, cov: 96, tech: "GPON, FTTB", speed: "1 Гбит/с", tar: 74, ops: { rtk: 76, mts: 68, beeline: 52, megafon: 38, domru: 31 } },
    { id: "prav", name: "Правобережный район", lat: 52.598, lon: 39.645, r: 2200, cov: 93, tech: "FTTB, GPON", speed: "1 Гбит/с", tar: 61, ops: { rtk: 70, mts: 54, beeline: 43, megafon: 27, domru: 26 } },
    { id: "lev", name: "Левобережный район", lat: 52.595, lon: 39.53, r: 2200, cov: 91, tech: "FTTB", speed: "500 Мбит/с", tar: 57, ops: { rtk: 68, mts: 48, beeline: 41, megafon: 22, domru: 24 } },
  ];

  const ADDR_MTS = [
    { label: "Липецк, ул. Гагарина, 12", lat: 52.6088, lon: 39.5992, zone: "sov", ok: true, tech: "GPON", speed: "до 1 Гбит/с", tar: 18 },
    { label: "Липецк, ул. Космонавтов, 45", lat: 52.625, lon: 39.57, zone: "okt", ok: true, tech: "GPON", speed: "до 1 Гбит/с", tar: 16 },
    { label: "Липецк, пр-т Победы, 29", lat: 52.598, lon: 39.64, zone: "prav", ok: true, tech: "FTTB", speed: "до 500 Мбит/с", tar: 12 },
    { label: "Липецк, ул. Неделина, 8", lat: 52.595, lon: 39.535, zone: "lev", ok: true, tech: "FTTB", speed: "до 500 Мбит/с", tar: 11 },
    { label: "Липецк, ул. Полевая, 3", lat: 52.58, lon: 39.52, zone: "lev", ok: false, tech: "—", speed: "—", tar: 0 },
  ];

  const ADDR_ALL = [
    { label: "Липецк, ул. Гагарина, 12", lat: 52.6088, lon: 39.5992, zone: "sov", ops: ["rtk", "mts", "beeline", "megafon", "domru"] },
    { label: "Липецк, ул. Космонавтов, 45", lat: 52.625, lon: 39.57, zone: "okt", ops: ["rtk", "mts", "beeline"] },
    { label: "Липецк, пр-т Победы, 29", lat: 52.598, lon: 39.64, zone: "prav", ops: ["rtk", "mts", "megafon"] },
    { label: "Липецк, ул. Неделина, 8", lat: 52.595, lon: 39.535, zone: "lev", ops: ["rtk", "beeline", "domru"] },
    { label: "Липецк, ул. Полевая, 3", lat: 52.58, lon: 39.52, zone: "lev", ops: [] },
  ];

  const COLOR = { gpon: "#2BBE48", fttb: "#FFA500", none: "#C3C7CD" };

  function bindChecker(addresses, onCheck) {
    const box = document.getElementById("chk-box");
    const input = document.getElementById("cov-addr");
    const sugg = document.getElementById("cov-sugg");
    const btn = document.getElementById("cov-find");
    if (!box || !input || !sugg || !btn) return;

    const renderSugg = () => {
      const q = input.value.trim().toLowerCase();
      const items = addresses.filter((a) => !q || a.label.toLowerCase().indexOf(q) !== -1).slice(0, 5);
      sugg.innerHTML = "";
      items.forEach((a) => {
        const li = document.createElement("li");
        li.innerHTML = '<img src="../icons/map-icon.svg" width="16" height="16" alt="" />' + a.label;
        li.addEventListener("mousedown", (e) => {
          e.preventDefault();
          onCheck(a);
          sugg.hidden = true;
        });
        sugg.appendChild(li);
      });
      sugg.hidden = items.length === 0;
    };

    input.addEventListener("input", renderSugg);
    input.addEventListener("focus", renderSugg);
    document.addEventListener("mousedown", (e) => {
      if (!box.contains(e.target)) sugg.hidden = true;
    });
    btn.addEventListener("click", () => {
      const q = input.value.trim().toLowerCase();
      const a = addresses.find((x) => x.label.toLowerCase().indexOf(q) !== -1) || addresses[0];
      onCheck(a);
      sugg.hidden = true;
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        btn.click();
      }
    });
  }

  const hexFill = (hex, opacity) => {
    const a = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0");
    return hex.replace("#", "") + a;
  };

  const circleOpts = (col, on) => ({
    fillColor: hexFill(col, on ? 0.34 : 0.22),
    fillOpacity: 1,
    strokeColor: col,
    strokeWidth: on ? 4 : 2,
    strokeOpacity: 0.9,
  });

  const opCount = (z) => Object.keys(z.ops).filter((k) => z.ops[k] > 0).length;
  const densColor = (z) => {
    const n = opCount(z);
    return n >= 4 ? "#1B8F33" : n === 3 ? "#2BBE48" : n === 2 ? "#FFA500" : "#C3C7CD";
  };
  const opColor = (v) => (v >= 60 ? "#1B8F33" : v >= 40 ? "#2BBE48" : v >= 20 ? "#FFA500" : "#C3C7CD");

  const plist = document.getElementById("cov-plist");
  if (plist) {
    Object.keys(OPS)
      .sort((a, b) => OPS[b].cov - OPS[a].cov)
      .forEach((k) => {
        const o = OPS[k];
        const el = document.createElement("article");
        el.className = "cov-pcard";
        el.innerHTML =
          '<div class="cov-pcard__logo"><img src="' +
          o.logo +
          '" alt="' +
          o.name +
          '"></div><div><h3><a href="' +
          o.page +
          '">' +
          o.name +
          " в Липецке</a></h3>" +
          '<div class="cov-pcard__cov"><span>Покрытие домов города</span><b>' +
          o.cov +
          "%</b></div>" +
          '<span class="cov-zbar"><i style="width:' +
          o.cov +
          "%;background:" +
          opColor(o.cov) +
          ';"></i></span>' +
          '<ul class="cov-pcard__rows"><li><span class="l">Технологии</span><span class="v">' +
          o.tech +
          '</span></li><li><span class="l">Скорость</span><span class="v">' +
          o.speed +
          '</span></li><li><span class="l">Тарифов</span><span class="v">' +
          o.tar +
          '</span></li><li><span class="l">Оценка</span><span class="v">' +
          o.rate +
          " / 5</span></li></ul>" +
          '<div class="cov-pcard__act"><a class="big-button" href="#checker">Проверить адрес</a><a class="city-hub-ghost" href="' +
          o.page +
          '">Тарифы и отзывы</a></div></div>';
        plist.appendChild(el);
      });
  }

  ymaps.ready(function () {
    const map = new ymaps.Map(
      mapEl,
      {
        center: [52.6088, 39.5992],
        zoom: 12,
        controls: ["zoomControl", "geolocationControl"],
      },
      { suppressMapOpenBlock: true }
    );
    map.behaviors.disable("scrollZoom");

    const layers = {};
    let pin = null;
    const list = document.getElementById("z-list");

    const flyTo = (lat, lon, zoom) => {
      map.setCenter([lat, lon], zoom, { duration: 400 });
    };

    const dropPin = (lat, lon, html) => {
      if (pin) map.geoObjects.remove(pin);
      pin = new ymaps.Placemark(
        [lat, lon],
        { balloonContent: html },
        { preset: "islands#greenCircleDotIcon" }
      );
      map.geoObjects.add(pin);
      pin.balloon.open();
    };

    const makeCircle = (z, col, hint, onClick) => {
      const c = new ymaps.Circle(
        [[z.lat, z.lon], z.r],
        { hintContent: hint },
        circleOpts(col, false)
      );
      c.events.add("click", onClick);
      map.geoObjects.add(c);
      return c;
    };

    if (modePage === "mts") {
      const ZONES = ZONES_MTS;
      const ADDRESSES = ADDR_MTS;
      let current = "sov";

      ZONES.forEach((z) => {
        layers[z.id] = makeCircle(z, COLOR[z.tag], z.name + " — " + z.cov + "% домов", () => select(z.id, true));
      });

      ZONES.forEach((z) => {
        const b = document.createElement("button");
        b.type = "button";
        b.dataset.z = z.id;
        b.innerHTML =
          '<span class="cov-zdot"><i style="background:' +
          COLOR[z.tag] +
          '"></i>' +
          z.name +
          "</span><span>" +
          z.cov +
          "%</span>";
        b.addEventListener("click", () => select(z.id, true));
        list.appendChild(b);
      });

      function select(id, fly) {
        const z = ZONES.find((x) => x.id === id);
        if (!z) return;
        current = id;
        document.getElementById("z-name").textContent = z.name;
        document.getElementById("z-cov").textContent = z.cov + "%";
        document.getElementById("z-bar").style.width = z.cov + "%";
        document.getElementById("z-bar").style.background = COLOR[z.tag];
        document.getElementById("z-tech").textContent = z.tech;
        document.getElementById("z-speed").textContent = z.speed;
        document.getElementById("z-tar").textContent = z.tar ? z.tar : "нет";
        document.getElementById("z-term").textContent = z.term;
        Array.prototype.forEach.call(list.children, (b) => b.classList.toggle("is-on", b.dataset.z === id));
        ZONES.forEach((x) => {
          layers[x.id].options.set(circleOpts(COLOR[x.tag], x.id === id));
        });
        if (fly) flyTo(z.lat, z.lon, 13);
      }

      function applyFilter(f) {
        ZONES.forEach((z) => {
          const on = f === "all" || z.tag === f;
          map.geoObjects.remove(layers[z.id]);
          if (on) map.geoObjects.add(layers[z.id]);
          const btn = list.querySelector('[data-z="' + z.id + '"]');
          if (btn) btn.style.display = on ? "" : "none";
        });
      }

      document.querySelectorAll("[data-cov-filter]").forEach((b) => {
        b.addEventListener("click", () => {
          document.querySelectorAll("[data-cov-filter]").forEach((x) => x.classList.remove("is-on"));
          b.classList.add("is-on");
          applyFilter(b.getAttribute("data-cov-filter"));
        });
      });

      select("sov", false);
      bindChecker(ADDRESSES, (a) => {
        select(a.zone, false);
        dropPin(
          a.lat,
          a.lon,
          "<b>" + a.label + "</b><br>" + (a.ok ? "МТС подключён · " + a.tech : "Сеть МТС в строительстве")
        );
        flyTo(a.lat, a.lon, 15);
        const res = document.getElementById("cov-res");
        res.hidden = false;
        res.className = "cov-res" + (a.ok ? "" : " is-no");
        res.innerHTML = a.ok
          ? '<div class="cov-res__hd">МТС доступен: ' +
            a.label +
            "<span>" +
            a.tech +
            " · " +
            a.speed +
            " · " +
            a.tar +
            ' тарифов</span><a class="big-button" href="provider_page.html#tariffs">Тарифы по адресу</a></div>'
          : '<div class="cov-res__hd">МТС пока не подключён: ' +
            a.label +
            '<span>Подберём других провайдеров дома</span><a class="big-button" href="search_address.html">Другие провайдеры</a></div>';
      });
      return;
    }

    const ZONES = ZONES_ALL;
    const ADDRESSES = ADDR_ALL;
    let mode = "all";
    let current = "sov";

    ZONES.forEach((z) => {
      layers[z.id] = makeCircle(z, densColor(z), z.name, () => select(z.id, true));
    });

    function paint() {
      ZONES.forEach((z) => {
        let col;
        let txt;
        if (mode === "all") {
          col = densColor(z);
          txt = z.name + " — " + opCount(z) + " операторов, " + z.cov + "% домов";
        } else {
          const v = z.ops[mode] || 0;
          col = opColor(v);
          txt = z.name + " — " + OPS[mode].name + ": " + (v ? v + "% домов" : "сети нет");
        }
        layers[z.id].options.set(circleOpts(col, z.id === current));
        layers[z.id].properties.set("hintContent", txt);
      });
      const lg = document.getElementById("cov-legend");
      if (lg) {
        lg.innerHTML =
          mode === "all"
            ? '<span><i style="background:#1B8F33;"></i>4–5 операторов</span><span><i style="background:#2BBE48;"></i>3 оператора</span><span><i style="background:#FFA500;"></i>2 оператора</span><span><i style="background:#C3C7CD;"></i>1 оператор</span>'
            : '<span><i style="background:#1B8F33;"></i>60% домов и выше</span><span><i style="background:#2BBE48;"></i>40–59%</span><span><i style="background:#FFA500;"></i>20–39%</span><span><i style="background:#C3C7CD;"></i>менее 20% или сети нет</span>';
      }
      renderList();
    }

    function renderList() {
      list.innerHTML = "";
      ZONES.slice()
        .sort((a, b) => (mode === "all" ? opCount(b) - opCount(a) : (b.ops[mode] || 0) - (a.ops[mode] || 0)))
        .forEach((z) => {
          const b = document.createElement("button");
          b.type = "button";
          b.dataset.z = z.id;
          if (z.id === current) b.className = "is-on";
          const col = mode === "all" ? densColor(z) : opColor(z.ops[mode] || 0);
          const val = mode === "all" ? opCount(z) + " опер." : z.ops[mode] ? z.ops[mode] + "%" : "нет";
          b.innerHTML =
            '<span class="cov-zdot"><i style="background:' + col + '"></i>' + z.name + "</span><span>" + val + "</span>";
          b.addEventListener("click", () => select(z.id, true));
          list.appendChild(b);
        });
    }

    function select(id, fly) {
      const z = ZONES.find((x) => x.id === id);
      if (!z) return;
      current = id;
      document.getElementById("z-name").textContent = z.name;
      document.getElementById("z-cov").textContent = z.cov + "%";
      document.getElementById("z-bar").style.width = z.cov + "%";
      document.getElementById("z-ops").textContent = opCount(z);
      document.getElementById("z-tech").textContent = z.tech;
      document.getElementById("z-speed").textContent = z.speed;
      document.getElementById("z-tar").textContent = z.tar;
      const box = document.getElementById("z-oplist");
      box.innerHTML = "";
      Object.keys(OPS)
        .sort((a, b) => (z.ops[b] || 0) - (z.ops[a] || 0))
        .forEach((k) => {
          const v = z.ops[k] || 0;
          const row = document.createElement("div");
          row.className = "cov-zop";
          row.innerHTML =
            '<img src="' +
            OPS[k].logo +
            '" alt="' +
            OPS[k].name +
            '"><span class="t">' +
            (v ? OPS[k].tech : "сеть в строительстве") +
            '</span><span class="c" style="color:' +
            (v ? "#0C0D0D" : "#A4A5A8") +
            ';">' +
            (v ? v + "%" : "—") +
            "</span>";
          box.appendChild(row);
        });
      paint();
      if (fly) flyTo(z.lat, z.lon, 13);
    }

    document.querySelectorAll("[data-cov-op]").forEach((b) => {
      b.addEventListener("click", () => {
        document.querySelectorAll("[data-cov-op]").forEach((x) => x.classList.remove("is-on"));
        b.classList.add("is-on");
        mode = b.getAttribute("data-cov-op");
        paint();
      });
    });

    select("sov", false);
    bindChecker(ADDRESSES, (a) => {
      select(a.zone, false);
      dropPin(
        a.lat,
        a.lon,
        "<b>" + a.label + "</b><br>" + (a.ops.length ? a.ops.length + " провайдеров в доме" : "Сети операторов в строительстве")
      );
      flyTo(a.lat, a.lon, 15);
      let tar = 0;
      a.ops.forEach((k) => {
        tar += OPS[k].tar;
      });
      const res = document.getElementById("cov-res");
      res.hidden = false;
      res.className = "cov-res" + (a.ops.length ? "" : " is-no");
      res.innerHTML = a.ops.length
        ? '<div class="cov-res__hd">В доме доступно ' +
          a.ops.length +
          " провайдеров: " +
          a.label +
          "<span>" +
          tar +
          ' тарифов · подключение за 1–3 дня</span><a class="big-button" href="search_address.html">Тарифы по адресу</a></div>' +
          '<div class="cov-res__ops">' +
          a.ops
            .map(
              (k) =>
                '<span class="cov-res__op"><img src="' +
                OPS[k].logo +
                '" alt="' +
                OPS[k].name +
                '">' +
                OPS[k].tech +
                " <span>· " +
                OPS[k].tar +
                " тарифов</span></span>"
            )
            .join("") +
          "</div>"
        : '<div class="cov-res__hd">Сети провайдеров пока нет: ' +
          a.label +
          '<span>Оставьте заявку — сообщим, когда появится покрытие</span><button class="big-button" type="button" data-sh="callback">Оставить заявку</button></div>';
    });
  });
})();
