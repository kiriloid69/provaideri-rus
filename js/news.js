(function () {
    "use strict";

    const root = document.querySelector("[data-news]");
    if (!root) return;

    const CATS = [
        { key: "all", label: "Все", count: 631 },
        { key: "prov", label: "Провайдеры", count: 248 },
        { key: "net", label: "Интернет", count: 176 },
        { key: "promo", label: "Акции", count: 132 },
        { key: "tech", label: "Технологии", count: 75 },
    ];

    const CAT_NAME = {
        prov: "Провайдеры",
        net: "Интернет",
        promo: "Акции",
        tech: "Технологии",
    };

    const COVER = root.getAttribute("data-news-cover") || "../images/news-cover.jpg";
    const PAGE_SIZE = 9;

    const POSTS = [
        {
            cat: "promo",
            provider: "МТС",
            date: "29 июля 2026",
            read: "3 мин чтения",
            title: "МТС продлил бесплатное подключение в Москве до конца лета",
            text: "Акция распространяется на пакеты «интернет + ТВ» от 500 ₽/мес: монтаж 0 ₽, роутер в аренду первые три месяца бесплатно.",
            feature: true,
        },
        {
            cat: "tech",
            provider: "Ростелеком",
            date: "28 июля 2026",
            read: "5 мин чтения",
            title: "GPON против FTTB: какая технология быстрее в московских домах",
            text: "Разобрали на замерах абонентов, где разница в скорости и отклике действительно заметна, а где переплата.",
        },
        {
            cat: "prov",
            provider: "Билайн",
            date: "27 июля 2026",
            read: "4 мин чтения",
            title: "Билайн поднял скорость базовых тарифов до 300 Мбит/с",
            text: "Абонентам старых тарифов скорость повысили без изменения цены — переоформление договора не требуется.",
        },
        {
            cat: "net",
            provider: "Все",
            date: "26 июля 2026",
            read: "6 мин чтения",
            title: "Сколько Мбит/с реально нужно квартире в 2026 году",
            text: "Считаем по устройствам и сценариям: 4K-стрим, облачный гейминг, созвоны и умный дом — с запасом и без переплаты.",
        },
        {
            cat: "promo",
            provider: "Дом.ру",
            date: "25 июля 2026",
            read: "2 мин чтения",
            title: "Дом.ру дарит два месяца ТВ при оплате интернета за год",
            text: "Предложение действует в 58 % домов Москвы, где у оператора заведена сеть. Приставка выдаётся бесплатно.",
        },
        {
            cat: "prov",
            provider: "МегаФон",
            date: "24 июля 2026",
            read: "4 мин чтения",
            title: "МегаФон объединил домашний интернет и мобильную связь в один счёт",
            text: "Конвергентный тариф даёт скидку до 30 % и общий баланс. Разбираем, кому это выгодно, а кому нет.",
        },
        {
            cat: "net",
            provider: "Все",
            date: "23 июля 2026",
            read: "7 мин чтения",
            title: "Как проверить, за что провайдер берёт деньги: разбор квитанции",
            text: "Аренда роутера, статический IP, «сервис заботы» — где искать скрытые платежи и как их отключить.",
        },
        {
            cat: "tech",
            provider: "Все",
            date: "22 июля 2026",
            read: "5 мин чтения",
            title: "Wi-Fi 7 в квартире: есть ли смысл менять роутер",
            text: "Считаем прирост скорости на реальных тарифах Москвы и объясняем, когда апгрейд не даст ничего.",
        },
        {
            cat: "prov",
            provider: "Онлайм",
            date: "21 июля 2026",
            read: "3 мин чтения",
            title: "Онлайм расширил сеть в трёх районах на западе Москвы",
            text: "Подключение стало доступно ещё в 214 домах ЗАО. Цены — от 430 ₽/мес, монтаж бесплатный.",
        },
        {
            cat: "promo",
            provider: "Ростелеком",
            date: "20 июля 2026",
            read: "3 мин чтения",
            title: "Ростелеком снизил цену гигабита для новых абонентов",
            text: "Тариф на 1 Гбит/с в Москве стоит 560 ₽/мес первый год вместо 790 ₽ — с бесплатным подключением.",
        },
        {
            cat: "net",
            provider: "Все",
            date: "19 июля 2026",
            read: "4 мин чтения",
            title: "Что делать, если скорость ниже заявленной: инструкция на пять шагов",
            text: "От замера по кабелю до претензии оператору — как зафиксировать проблему и добиться перерасчёта.",
        },
        {
            cat: "tech",
            provider: "Все",
            date: "18 июля 2026",
            read: "6 мин чтения",
            title: "Интернет в новостройке: почему провайдер приходит не сразу",
            text: "Как устроено подключение сети в новом корпусе и что можно сделать, пока оператор не завёл кабель.",
        },
    ];

    const state = {
        cat: "all",
        page: 1,
    };

    const els = {
        chips: root.querySelector("[data-news-chips]"),
        feature: root.querySelector("[data-news-feature]"),
        featureCat: root.querySelector("[data-news-feature-cat]"),
        featureTitle: root.querySelector("[data-news-feature-title]"),
        featureText: root.querySelector("[data-news-feature-text]"),
        featureMeta: root.querySelector("[data-news-feature-meta]"),
        listTitle: root.querySelector("[data-news-list-title]"),
        listSub: root.querySelector("[data-news-list-sub]"),
        grid: root.querySelector("[data-news-grid]"),
        pager: root.querySelector("[data-news-pager]"),
    };

    function plural(n, one, few, many) {
        const m10 = n % 10;
        const m100 = n % 100;
        if (m10 === 1 && m100 !== 11) return one;
        if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
        return many;
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function providerLabel(p) {
        return p.provider === "Все" ? "Рынок Москвы" : p.provider;
    }

    function filteredPosts() {
        return POSTS.filter((p) => state.cat === "all" || p.cat === state.cat);
    }

    function renderChips() {
        if (!els.chips) return;
        els.chips.innerHTML = CATS.map(
            (c) =>
                `<button type="button" class="news-chips__btn${state.cat === c.key ? " is-active" : ""}" data-news-cat="${c.key}">` +
                `${escapeHtml(c.label)}<span class="news-chips__count">${c.count}</span></button>`
        ).join("");
    }

    function renderFeature(feature, isDefault) {
        if (!els.feature) return;
        const show = isDefault && !!feature;
        els.feature.hidden = !show;
        if (!show || !feature) return;

        if (els.featureCat) els.featureCat.textContent = CAT_NAME[feature.cat];
        if (els.featureTitle) els.featureTitle.textContent = feature.title;
        if (els.featureText) els.featureText.textContent = feature.text;
        if (els.featureMeta) {
            els.featureMeta.innerHTML =
                `${escapeHtml(feature.date)}<span class="news-meta__dot" aria-hidden="true"></span>${escapeHtml(feature.read)}`;
        }
    }

    function postCard(p) {
        const cat = CAT_NAME[p.cat];
        return (
            `<article class="news-post">` +
            `<div class="news-post__media">` +
            `<span class="news-post__badge"><span class="news-badge news-badge--cat">${escapeHtml(cat)}</span></span>` +
            `<img class="news-post__img" src="${escapeHtml(COVER)}" alt="" width="640" height="360" loading="lazy" decoding="async" />` +
            `</div>` +
            `<div class="news-post__body">` +
            `<h3 class="news-post__ttl"><a href="article.html">${escapeHtml(p.title)}</a></h3>` +
            `<p class="news-post__tx">${escapeHtml(p.text)}</p>` +
            `<div class="news-post__foot"><div class="news-meta">` +
            `${escapeHtml(p.date)}<span class="news-meta__dot" aria-hidden="true"></span>${escapeHtml(p.read)}` +
            `<span class="news-meta__dot" aria-hidden="true"></span>${escapeHtml(providerLabel(p))}` +
            `</div></div></div></article>`
        );
    }

    function renderPager(totalPages) {
        if (!els.pager) return;
        if (totalPages <= 1) {
            els.pager.hidden = true;
            els.pager.innerHTML = "";
            return;
        }

        els.pager.hidden = false;
        const buttons = [];
        for (let n = 1; n <= totalPages; n += 1) {
            buttons.push(
                `<button type="button" class="${state.page === n ? "is-active" : ""}" data-news-page="${n}" aria-label="Страница ${n}"${state.page === n ? ' aria-current="page"' : ""}>${n}</button>`
            );
        }
        const nextDisabled = state.page >= totalPages ? " disabled" : "";
        buttons.push(`<button type="button" data-news-next${nextDisabled}>Дальше →</button>`);
        els.pager.innerHTML = buttons.join("");
    }

    function render() {
        const filtered = filteredPosts();
        const isDefault = state.cat === "all";
        const feature = filtered.find((p) => p.feature) || filtered[0];
        const rest = isDefault && feature ? filtered.filter((p) => p !== feature) : filtered;

        const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
        if (state.page > totalPages) state.page = totalPages;
        const start = (state.page - 1) * PAGE_SIZE;
        const pagePosts = rest.slice(start, start + PAGE_SIZE);

        renderChips();
        renderFeature(feature, isDefault);

        if (els.listTitle) {
            els.listTitle.textContent = isDefault
                ? "Все новости"
                : "Найдено " + filtered.length + " " + plural(filtered.length, "материал", "материала", "материалов");
        }
        if (els.listSub) {
            const catLabel = (CATS.find((c) => c.key === state.cat) || CATS[0]).label.toLowerCase();
            els.listSub.textContent = isDefault ? "обновлено 29 июля 2026" : "категория: " + catLabel;
        }

        if (els.grid) {
            els.grid.innerHTML = pagePosts.map(postCard).join("");
        }

        renderPager(rest.length === 0 ? 1 : totalPages);
    }

    root.addEventListener("click", (e) => {
        const catBtn = e.target.closest("[data-news-cat]");
        if (catBtn) {
            state.cat = catBtn.getAttribute("data-news-cat");
            state.page = 1;
            render();
            return;
        }

        const pageBtn = e.target.closest("[data-news-page]");
        if (pageBtn) {
            state.page = Number(pageBtn.getAttribute("data-news-page")) || 1;
            render();
            els.grid && els.grid.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }

        if (e.target.closest("[data-news-next]")) {
            state.page += 1;
            render();
            els.grid && els.grid.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    render();
})();
