(function () {
  const DATA = [
    {
      name: "Ростелеком",
      logo: "../images/operators-logos/rtk.png",
      score: 87,
      rating: 4.8,
      reviews: 412,
      net: 4.9,
      tv: 4.6,
      sup: 4.2,
      mob: 4.4,
      minPrice: 550,
      perMbit: 1.1,
      factSpeed: 94,
      coverage: 78,
      tariffs: 42,
      tech: "Оптика GPON",
      badges: ["Широкое покрытие", "Выбор по отзывам", "Высокая скорость"],
      prosText:
        "Самое широкое покрытие в городе (78 % домов) и стабильная скорость — 94 % от заявленной, быстрее 86 % провайдеров Липецка.",
      consText: "Цена за Мбит выше средней по городу на 0,2 ₽, поддержку ругают в 18 % отзывов.",
      pros: [
        "Оптика GPON в 78 % домов Липецка — подключение возможно там, где остальных нет",
        "Фактическая скорость 94 % от заявленной по замерам абонентов",
        "Стабильность хвалят в 41 % отзывов — самая частая положительная тема",
        "42 тарифа, включая конвергентные пакеты с мобильной связью",
      ],
      cons: [
        "Дороже среднего по городу: 1,1 ₽ за Мбит против 0,9 ₽ по Липецку",
        "Долгое ожидание поддержки — 18 % отзывов, чаще всего вечером",
        "Оценка ТВ-приставки ниже, чем у МТС (4,6 против 4,8)",
      ],
      themes: [
        ["Стабильность", 41],
        ["Скорость", 33],
        ["Поддержка", -18],
        ["Цена", -12],
      ],
      note: "Балл 87 из 100: топ-1 по покрытию и ассортименту, 2-е место по фактической скорости, 6-е — по цене за Мбит.",
    },
    {
      name: "МТС",
      logo: "../images/operators-logos/mts.png",
      score: 84,
      rating: 4.6,
      reviews: 348,
      net: 4.7,
      tv: 4.8,
      sup: 4.0,
      mob: 4.6,
      minPrice: 500,
      perMbit: 0.9,
      factSpeed: 92,
      coverage: 62,
      tariffs: 38,
      tech: "Оптика + FTTB",
      badges: ["Выбор по отзывам", "Лучшее ТВ"],
      prosText:
        "Лучшее ТВ в городе (4,8) и конвергентные пакеты с мобильной связью — цена за Мбит на уровне медианы Липецка.",
      consText: "Поддержку ругают в 21 % отзывов, покрытие уступает Ростелекому.",
      pros: [
        "Оценка ТВ 4,8 — первое место по городу",
        "Пакеты «интернет + мобильная связь» дают скидку до 30 %",
        "Цена за Мбит 0,9 ₽ — ровно медиана Липецка",
      ],
      cons: [
        "Поддержка — 21 % отзывов с жалобами на переключение между операторами",
        "Покрытие 62 % — в новостройках подключение не всегда доступно",
      ],
      themes: [
        ["ТВ и приставка", 37],
        ["Пакеты услуг", 24],
        ["Поддержка", -21],
        ["Рост цены", -15],
      ],
      note: "Балл 84: топ-1 по ассортименту ТВ и акциям, 3-е место по покрытию.",
    },
    {
      name: "Билайн",
      logo: "../images/operators-logos/beeline.png",
      score: 79,
      rating: 4.5,
      reviews: 256,
      net: 4.6,
      tv: 4.2,
      sup: 3.9,
      mob: 4.5,
      minPrice: 450,
      perMbit: 0.8,
      factSpeed: 90,
      coverage: 66,
      tariffs: 31,
      tech: "FTTB",
      badges: ["Бесплатное подключение", "Высокая скорость"],
      prosText: "Дешевле среднего по Липецку: 0,8 ₽ за Мбит и тариф от 450 ₽, подключение бесплатное.",
      consText: "ТВ оценивают в 4,2, а поддержку — в 3,9: время ответа плавает в вечерние часы.",
      pros: [
        "Тариф от 450 ₽ — дешевле среднего по городу на 60 ₽",
        "Бесплатное подключение и роутер в аренду за 0 ₽ в первый год",
        "Фактическая скорость 90 % от заявленной",
      ],
      cons: [
        "ТВ-платформа слабее конкурентов — 4,2 против 4,8 у МТС",
        "Поддержка 3,9 — 24 % отзывов о времени ожидания",
      ],
      themes: [
        ["Цена", 39],
        ["Скорость", 28],
        ["Поддержка", -24],
        ["ТВ", -17],
      ],
      note: "Балл 79: топ-2 по цене за Мбит, 5-е место по покрытию.",
    },
    {
      name: "Дом.ру",
      logo: "../images/operators-logos/domru.png",
      score: 76,
      rating: 4.4,
      reviews: 224,
      net: 4.6,
      tv: 4.4,
      sup: 3.8,
      mob: 3.9,
      minPrice: 490,
      perMbit: 0.85,
      factSpeed: 91,
      coverage: 58,
      tariffs: 27,
      tech: "FTTB",
      badges: ["Бесплатное подключение"],
      prosText: "Ровный интернет (4,6) по цене ниже медианы города и бесплатное подключение при годовой оплате.",
      consText: "Покрытие 58 % — заметно уже, чем у федеральных игроков; поддержка 3,8.",
      pros: [
        "Оценка интернета 4,6 при цене 0,85 ₽ за Мбит",
        "Бесплатное подключение при оплате за год",
      ],
      cons: [
        "Покрытие 58 % домов — в части районов услуги нет",
        "Мобильная связь как отдельная опция — оценка 3,9",
      ],
      themes: [
        ["Цена", 31],
        ["Стабильность", 26],
        ["Поддержка", -22],
        ["Покрытие", -19],
      ],
      note: "Балл 76: сильные цена и скорость, слабое покрытие тянет вниз.",
    },
    {
      name: "МегаФон",
      logo: "../images/operators-logos/megafon.png",
      score: 74,
      rating: 4.3,
      reviews: 198,
      net: 4.4,
      tv: 4.0,
      sup: 3.9,
      mob: 4.7,
      minPrice: 520,
      perMbit: 0.95,
      factSpeed: 88,
      coverage: 62,
      tariffs: 24,
      tech: "FTTB + 5G",
      badges: ["Лучшая мобильная связь"],
      prosText: "Лучшая мобильная связь в рейтинге (4,7) и удобные конвергентные пакеты.",
      consText: "ТВ 4,0 и фактическая скорость 88 % — ниже средней по городу.",
      pros: [
        "Мобильная связь 4,7 — первое место по городу",
        "Скидка на домашний интернет при действующем мобильном номере",
      ],
      cons: [
        "ТВ-пакет беднее конкурентов — оценка 4,0",
        "Фактическая скорость 88 % от заявленной, медленнее 60 % провайдеров",
      ],
      themes: [
        ["Мобильная связь", 34],
        ["Пакеты услуг", 21],
        ["Скорость", -20],
        ["ТВ", -18],
      ],
      note: "Балл 74: топ-1 по мобильной оси, 7-е место по фактической скорости.",
    },
    {
      name: "Онлайм",
      logo: "",
      score: 68,
      rating: 4.1,
      reviews: 112,
      net: 4.3,
      tv: 4.1,
      sup: 3.7,
      mob: 3.5,
      minPrice: 430,
      perMbit: 0.75,
      factSpeed: 87,
      coverage: 41,
      tariffs: 16,
      tech: "FTTB",
      badges: ["Самый выгодный в Липецке"],
      prosText: "Самая низкая цена за Мбит в городе — 0,75 ₽, тариф от 430 ₽.",
      consText: "Покрытие 41 % и всего 16 тарифов; мобильной связи нет.",
      pros: [
        "Топ-1 по цене за Мбит среди провайдеров Липецка",
        "Оценка интернета 4,3 при самом дешёвом тарифе",
      ],
      cons: [
        "Покрытие 41 % — проверять адрес обязательно",
        "Нет мобильной связи и конвергентных пакетов",
      ],
      themes: [
        ["Цена", 44],
        ["Стабильность", 19],
        ["Поддержка", -26],
        ["Покрытие", -23],
      ],
      note: "Балл 68: топ-1 по цене, но узкое покрытие и ассортимент.",
    },
    {
      name: "ТТК",
      logo: "",
      score: 61,
      rating: 3.9,
      reviews: 74,
      net: 4.1,
      tv: 3.8,
      sup: 3.5,
      mob: 3.4,
      minPrice: 460,
      perMbit: 0.9,
      factSpeed: 84,
      coverage: 34,
      tariffs: 12,
      tech: "FTTB",
      badges: [],
      prosText: "Работает там, где нет федеральных операторов, — 34 % домов, часто в старом фонде.",
      consText: "Поддержка 3,5 и фактическая скорость 84 % — оба показателя ниже средних по городу.",
      pros: [
        "Подключение в домах, куда не заходят крупные провайдеры",
        "Тариф от 460 ₽ без обязательного ТВ-пакета",
      ],
      cons: [
        "Поддержка 3,5 — 31 % отзывов с жалобами на сроки ремонта",
        "Фактическая скорость 84 % от заявленной",
      ],
      themes: [
        ["Доступность адреса", 27],
        ["Цена", 18],
        ["Поддержка", -31],
        ["Скорость", -24],
      ],
      note: "Балл 61: средняя цена при слабых осях скорости и отзывов.",
    },
    {
      name: "НетБайНет",
      logo: "",
      score: 55,
      rating: 3.7,
      reviews: 52,
      net: 3.9,
      tv: 3.6,
      sup: 3.3,
      mob: 3.2,
      minPrice: 440,
      perMbit: 0.88,
      factSpeed: 82,
      coverage: 29,
      tariffs: 9,
      tech: "FTTB",
      badges: [],
      prosText: "Недорогие тарифы от 440 ₽ и простое подключение без пакетов услуг.",
      consText: "Самая слабая поддержка в рейтинге (3,3), покрытие 29 % и всего 9 тарифов.",
      pros: ["Тариф от 440 ₽ без навязанных опций", "Подключение за 1–2 дня в подключённых домах"],
      cons: [
        "Поддержка 3,3 — худший результат в рейтинге",
        "Покрытие 29 % и 9 тарифов — выбор минимальный",
      ],
      themes: [
        ["Цена", 22],
        ["Сроки подключения", 16],
        ["Поддержка", -35],
        ["Скорость", -27],
      ],
      note: "Балл 55: держится за счёт цены, все остальные оси ниже медианы города.",
    },
  ];

  const TABS = [
    { key: "score", label: "Общий балл" },
    { key: "rating", label: "Оценка по отзывам" },
    { key: "factSpeed", label: "Фактическая скорость" },
    { key: "perMbit", label: "Цена за Мбит", asc: true },
    { key: "coverage", label: "Покрытие" },
  ];

  const list = document.querySelector("[data-rt-list]");
  const tabsEl = document.querySelector("[data-rt-tabs]");
  if (!list || !tabsEl) return;

  let sort = "score";
  let openName = DATA[0].name;

  const fmt = (v) => v.toFixed(1).replace(".", ",");
  const num = (n) => n.toLocaleString("ru-RU");
  const plural = (n, one, few, many) => {
    const m10 = n % 10;
    const m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  };
  const pct = (key, value, invert) => {
    const worse = DATA.filter((x) => (invert ? x[key] > value : x[key] < value)).length;
    return Math.round((worse / Math.max(1, DATA.length - 1)) * 100);
  };
  const escapeHtml = (str) =>
    String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const star =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="#FFA500" aria-hidden="true"><path d="M12 2.4 14.6 8l6.2.7-4.6 4.1 1.3 6.1L12 16.2 6.5 18.9l1.3-6.1L3.2 8.7 9.4 8z"/></svg>';

  const render = () => {
    const tab = TABS.find((item) => item.key === sort) || TABS[0];
    const sorted = DATA.slice().sort((a, b) => (tab.asc ? a[tab.key] - b[tab.key] : b[tab.key] - a[tab.key]));

    tabsEl.querySelectorAll("[data-rt-sort]").forEach((btn) => {
      btn.classList.toggle("is-on", btn.getAttribute("data-rt-sort") === sort);
    });

    list.innerHTML = sorted
      .map((p, i) => {
        const open = p.name === openName;
        const rankClass = i === 0 ? "is-1" : i < 3 ? "is-top" : "";
        const identity = p.logo
          ? `<img class="rt-row__logo" src="${escapeHtml(p.logo)}" alt="${escapeHtml(p.name)}" width="118" height="26" />`
          : `<span class="rt-row__name">${escapeHtml(p.name)}</span>`;
        const badges = p.badges
          .map((label) => `<span class="reviews-chip reviews-chip--pos">${escapeHtml(label)}</span>`)
          .join("");
        const listItems = (items) => items.map((text) => `<li>${escapeHtml(text)}</li>`).join("");
        const axes = [
          { label: "Оценка по отзывам · вес 30 %", key: "rating" },
          { label: "Фактическая скорость · вес 20 %", key: "factSpeed" },
          { label: "Цена за Мбит · вес 20 %", key: "perMbit", invert: true },
          { label: "Покрытие · вес 15 %", key: "coverage" },
          { label: "Ассортимент · вес 10 %", key: "tariffs" },
        ]
          .map((ax) => {
            const v = pct(ax.key, p[ax.key], ax.invert);
            return `<div>
              <div class="rt-bar__lab"><span>${escapeHtml(ax.label)}</span><span>${escapeHtml("выше " + v + " % города")}</span></div>
              <span class="rt-bar rt-bar--thin"><span style="width:${Math.max(4, v)}%"></span></span>
            </div>`;
          })
          .join("");
        const themes = p.themes
          .map(([label, val]) => {
            const cls = val > 0 ? "reviews-chip--pos" : "reviews-chip--neg";
            const sign = val > 0 ? "+" : "−";
            return `<span class="reviews-chip ${cls}">${escapeHtml(label + " " + sign + Math.abs(val) + " %")}</span>`;
          })
          .join("");

        return `<article class="rt-row${open ? " is-open" : ""}" data-rt-name="${escapeHtml(p.name)}">
          <div class="rt-head">
            <span class="rt-rank ${rankClass}">${i + 1}</span>
            <div class="rt-id">
              ${identity}
              <span class="rt-id__meta">${p.tariffs} ${plural(p.tariffs, "тариф", "тарифа", "тарифов")} · ${escapeHtml(p.tech)}</span>
            </div>
            <div class="rt-score">
              <div class="rt-score__top"><b>${p.score}</b><span>балл из 100</span></div>
              <span class="rt-bar rt-bar--wide"><span style="width:${p.score}%"></span></span>
              <div class="rt-score__badges">${badges}</div>
            </div>
            <div class="rt-rating">
              <div class="rt-rating__val">${star}<b>${fmt(p.rating)}</b></div>
              <span>${num(p.reviews)} ${plural(p.reviews, "отзыв", "отзыва", "отзывов")}</span>
            </div>
            <div class="rt-head-cta">
              <button class="big-button rt-head-cta__go" type="button" data-sh="callback">Подключить</button>
              <button class="rt-more" type="button" data-rt-toggle>${open ? "Свернуть" : "Подробнее"}</button>
            </div>
          </div>
          <div class="rt-summary">
            <div class="rt-side rt-side--plus">
              <div class="rt-side__h"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>За</div>
              <p>${escapeHtml(p.prosText)}</p>
              <ul ${open ? "" : "hidden"}>${listItems(p.pros)}</ul>
            </div>
            <div class="rt-side rt-side--minus">
              <div class="rt-side__h"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>Против</div>
              <p>${escapeHtml(p.consText)}</p>
              <ul ${open ? "" : "hidden"}>${listItems(p.cons)}</ul>
            </div>
          </div>
          <div class="rt-extra" ${open ? "" : "hidden"}>
            <div class="rt-nums">
              <div class="rt-nums__hi"><b>от ${num(p.minPrice)} ₽/мес</b><span>минимальный тариф</span></div>
              <div><b>${fmt(p.perMbit)} ₽</b><span>цена за Мбит</span></div>
              <div><b>${p.factSpeed} %</b><span>факт от заявленной</span></div>
              <div><b>${p.coverage} %</b><span>покрытие домов Липецка</span></div>
              <div><b>${escapeHtml(p.tech)}</b><span>технология подключения</span></div>
            </div>
            <div class="rt-detail">
              <div class="rt-axes">
                <div class="rt-kicker">Позиция по осям балла</div>
                ${axes}
              </div>
              <div class="rt-subs-wrap">
                <div class="rt-kicker">Подрейтинги абонентов</div>
                <div class="rt-subs">
                  <span><small>Интернет</small><b>${fmt(p.net)}</b></span>
                  <span><small>ТВ</small><b>${fmt(p.tv)}</b></span>
                  <span><small>Поддержка</small><b>${fmt(p.sup)}</b></span>
                  <span><small>Моб.</small><b>${fmt(p.mob)}</b></span>
                </div>
                <div class="rt-kicker">Темы отзывов</div>
                <div class="rt-themes">${themes}</div>
                <p class="rt-note">${escapeHtml(p.note)}</p>
              </div>
            </div>
          </div>
        </article>`;
      })
      .join("");
  };

  tabsEl.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-rt-sort]");
    if (!btn) return;
    sort = btn.getAttribute("data-rt-sort") || "score";
    render();
  });

  list.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-rt-toggle]");
    if (!toggle) return;
    const row = toggle.closest("[data-rt-name]");
    const name = row && row.getAttribute("data-rt-name");
    openName = openName === name ? "" : name;
    render();
  });

  render();
})();
