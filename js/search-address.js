(function () {
  const PROVIDERS = [
    { name: "МТС", logo: "../images/operators-logos/mts.png", price: 260, rating: "4,8", reviews: "13 567" },
    { name: "Искра город телеком", logo: "../images/operators-logos/beeline.png", price: 329, rating: "4,8", reviews: "13 567" },
    { name: "Ростелеком", logo: "../images/operators-logos/big-rtk.png", price: 590, rating: "4,8", reviews: "13 567" },
    { name: "Мегафон", logo: "../images/operators-logos/megafon.png", price: 499, rating: "4,8", reviews: "13 567" },
    { name: "билайн", logo: "../images/operators-logos/beeline.png", price: 350, rating: "4,7", reviews: "9 842" },
    { name: "Дом.ру", logo: "../images/operators-logos/domru.png", price: 420, rating: "4,6", reviews: "7 215" },
    { name: "Теле2", logo: "../images/operators-logos/rtk.png", price: 380, rating: "4,5", reviews: "5 903" },
    { name: "Акадо", logo: "../images/operators-logos/megafon.png", price: 450, rating: "4,7", reviews: "4 128" },
    { name: "Нетбайнет", logo: "../images/operators-logos/mts.png", price: 310, rating: "4,4", reviews: "3 876" },
    { name: "Инетком", logo: "../images/operators-logos/domru.png", price: 520, rating: "4,6", reviews: "2 945" },
    { name: "Связь-Сервис", logo: "../images/operators-logos/rtk.png", price: 400, rating: "4,5", reviews: "2 103" },
    { name: "Онлайн", logo: "../images/operators-logos/big-rtk.png", price: 480, rating: "4,8", reviews: "1 567" },
  ];

  const INITIAL_VISIBLE = 4;
  const LOAD_BATCH = 10;

  const section = document.querySelector(".search-providers");
  if (!section) return;

  const list = section.querySelector(".search-providers__list");
  const showMoreBtn = section.querySelector(".search-providers__show-more");
  const titleEl = section.querySelector(".search-providers__title");

  if (!list) return;

  if (titleEl) {
    titleEl.textContent = `Найдено ${PROVIDERS.length} провайдеров`;
  }

  const reviewIcon = `<svg class="search-providers__meta-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3C7.03 3 3 6.36 3 10.5c0 2.03 1.05 3.86 2.74 5.2L5 21l4.58-2.29c.77.15 1.57.23 2.42.23 4.97 0 9-3.36 9-7.5S16.97 3 12 3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  const popoverCloseIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`;

  function createMetaPopover(type, provider) {
    if (type === "rating") {
      return `
        <div class="search-providers__meta-popover" role="dialog" aria-label="Рейтинг оператора" aria-hidden="true" hidden>
          <button type="button" class="search-providers__meta-popover-close" aria-label="Закрыть">${popoverCloseIcon}</button>
          <div class="search-providers__meta-popover-inner">
            <p class="search-providers__meta-popover-text search-providers__meta-popover-text--rating">
              <span>Рейтинг оператора</span>
              <span><strong>${provider.rating}</strong> из 10</span>
            </p>
            <button type="button" class="search-providers__meta-popover-action">Оценить</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="search-providers__meta-popover" role="dialog" aria-label="Отзывы и оценки" aria-hidden="true" hidden>
        <button type="button" class="search-providers__meta-popover-close" aria-label="Закрыть">${popoverCloseIcon}</button>
        <div class="search-providers__meta-popover-inner">
          <p class="search-providers__meta-popover-text search-providers__meta-popover-text--reviews">
            <span>${provider.reviews} отзывов</span>
            <span>и оценок</span>
          </p>
          <button type="button" class="search-providers__meta-popover-action">Оставить отзыв</button>
        </div>
      </div>
    `;
  }

  function createProviderRow(provider, index) {
    const item = document.createElement("article");
    item.className = "search-providers__item";
    if (index >= INITIAL_VISIBLE) {
      item.classList.add("is-hidden");
    }
    item.innerHTML = `
      <div class="search-providers__item-main">
        <div class="search-providers__logo">
          <img src="${provider.logo}" alt="${provider.name}" width="112" height="63" loading="lazy" />
        </div>
        <div class="search-providers__item-info">
          <h3 class="search-providers__name">${provider.name}</h3>
          <div class="search-providers__meta-row">
            <div class="search-providers__meta search-providers__meta--rating">
              <button type="button" class="search-providers__meta-trigger" aria-expanded="false" aria-haspopup="dialog" aria-label="Рейтинг ${provider.rating}">
                <img class="search-providers__meta-icon" src="../icons/star-icon.svg" alt="" width="24" height="24" aria-hidden="true" />
                <span>${provider.rating}</span>
              </button>
              ${createMetaPopover("rating", provider)}
            </div>
            <div class="search-providers__meta search-providers__meta--reviews">
              <button type="button" class="search-providers__meta-trigger" aria-expanded="false" aria-haspopup="dialog" aria-label="${provider.reviews} отзывов">
                ${reviewIcon}
                <span>${provider.reviews}</span>
              </button>
              ${createMetaPopover("reviews", provider)}
            </div>
          </div>
        </div>
      </div>
      <div class="search-providers__item-aside">
        <p class="search-providers__price">от ${provider.price} ₽/мес</p>
        <button type="button" class="search-providers__connect js-app-modal-open" data-app-modal="connect-request">Подключить</button>
      </div>
    `;
    return item;
  }

  PROVIDERS.forEach((provider, index) => {
    list.appendChild(createProviderRow(provider, index));
  });

  const items = [...list.querySelectorAll(".search-providers__item")];
  let visibleCount = INITIAL_VISIBLE;

  function updateShowMore() {
    if (!showMoreBtn) return;
    const hasMore = visibleCount < items.length;
    showMoreBtn.hidden = !hasMore;
    showMoreBtn.classList.toggle("is-visible", hasMore);
    showMoreBtn.setAttribute("aria-expanded", hasMore ? "false" : "true");
  }

  updateShowMore();

  showMoreBtn?.addEventListener("click", () => {
    const remaining = items.length - visibleCount;
    const toShow = Math.min(LOAD_BATCH, remaining);

    for (let i = visibleCount; i < visibleCount + toShow; i++) {
      items[i].classList.remove("is-hidden");
    }

    visibleCount += toShow;
    updateShowMore();
  });

  const sortDropdown = section.querySelector(".search-providers__sort-dropdown");
  const sortBtn = section.querySelector(".search-providers__sort-btn");
  const sortBtnText = section.querySelector(".search-providers__sort-btn-text");
  const sortOptions = section.querySelectorAll(".search-providers__sort-option");
  const sortDropdownClose = section.querySelector(".search-providers__sort-dropdown-close");

  function openSortDropdown() {
    if (!sortDropdown || !sortBtn) return;
    sortDropdown.removeAttribute("hidden");
    sortDropdown.setAttribute("aria-hidden", "false");
    sortBtn.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        sortDropdown.classList.add("is-open");
      });
    });
  }

  function closeSortDropdown() {
    if (!sortDropdown || !sortBtn) return;
    sortDropdown.classList.remove("is-open");
    sortDropdown.setAttribute("aria-hidden", "true");
    sortBtn.setAttribute("aria-expanded", "false");
    sortDropdown.addEventListener(
      "transitionend",
      function onEnd() {
        sortDropdown.removeEventListener("transitionend", onEnd);
        sortDropdown.setAttribute("hidden", "");
      },
      { once: true }
    );
  }

  function selectSortOption(option) {
    sortOptions.forEach((o) => o.classList.remove("is-selected"));
    option.classList.add("is-selected");
    sortBtn?.classList.add("is-active");
    if (sortBtnText) {
      sortBtnText.textContent = option.textContent.trim();
    }
    closeSortDropdown();
  }

  sortBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!sortDropdown?.classList.contains("is-open")) {
      openSortDropdown();
    } else {
      closeSortDropdown();
    }
  });

  sortOptions.forEach((opt) => {
    opt.addEventListener("click", () => selectSortOption(opt));
  });

  sortDropdownClose?.addEventListener("click", closeSortDropdown);

  document.addEventListener("click", (e) => {
    if (
      sortDropdown?.classList.contains("is-open") &&
      !sortDropdown.contains(e.target) &&
      !sortBtn?.contains(e.target)
    ) {
      closeSortDropdown();
    }

    if (!e.target.closest(".search-providers__meta")) {
      closeAllMetaPopovers();
    }
  });

  const META_POPOVER_TRANSITION_MS = 350;
  const metaPopovers = section.querySelectorAll(".search-providers__meta-popover");

  function closeMetaPopover(popover) {
    if (!popover || !popover.classList.contains("is-open")) return;
    const trigger = popover.previousElementSibling;
    const meta = popover.closest(".search-providers__meta");

    popover.classList.remove("is-open");
    popover.setAttribute("aria-hidden", "true");
    trigger?.setAttribute("aria-expanded", "false");
    meta?.classList.remove("is-popover-open");

    window.setTimeout(() => {
      if (!popover.classList.contains("is-open")) {
        popover.hidden = true;
      }
    }, META_POPOVER_TRANSITION_MS);
  }

  function closeAllMetaPopovers(except) {
    metaPopovers.forEach((popover) => {
      if (popover !== except) {
        closeMetaPopover(popover);
      }
    });
  }

  function openMetaPopover(popover) {
    if (!popover) return;
    const trigger = popover.previousElementSibling;
    const meta = popover.closest(".search-providers__meta");

    closeAllMetaPopovers(popover);
    popover.hidden = false;
    popover.setAttribute("aria-hidden", "false");
    trigger?.setAttribute("aria-expanded", "true");
    meta?.classList.add("is-popover-open");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => popover.classList.add("is-open"));
    });
  }

  section.querySelectorAll(".search-providers__meta-trigger").forEach((trigger) => {
    const popover = trigger.nextElementSibling;
    if (!popover?.classList.contains("search-providers__meta-popover")) return;

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = popover.classList.contains("is-open");
      if (isOpen) {
        closeMetaPopover(popover);
      } else {
        openMetaPopover(popover);
      }
    });

    popover.querySelector(".search-providers__meta-popover-close")?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMetaPopover(popover);
    });

    popover.querySelector(".search-providers__meta-popover-action")?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMetaPopover(popover);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (sortDropdown?.classList.contains("is-open")) {
      closeSortDropdown();
    }
    closeAllMetaPopovers();
  });
})();
