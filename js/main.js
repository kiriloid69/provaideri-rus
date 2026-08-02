(function restoreSearchAddressScroll() {
  if (!window.location.pathname.includes("search_address")) return;

  const saved = sessionStorage.getItem("searchAddressScrollY");
  if (saved === null) return;

  sessionStorage.removeItem("searchAddressScrollY");
  const scrollY = Number.parseInt(saved, 10);
  if (!Number.isFinite(scrollY)) return;

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.addEventListener(
    "load",
    () => {
      window.scrollTo(0, scrollY);
    },
    { once: true }
  );
})();

document.addEventListener("DOMContentLoaded", () => {
  // Хедер: при скролле > 100px — уменьшаем вертикальный отступ (не при открытом мобильном меню)
  const header = document.querySelector(".header");
  const mobileMenu = document.getElementById("mobile-menu");
  const SCROLL_DOWN_THRESHOLD = 100;
  const SCROLL_UP_THRESHOLD = 60;
  let headerIsScrolled = false;
  let headerScrollTicking = false;

  const updateHeaderScrollState = () => {
    headerScrollTicking = false;
    if (!header || mobileMenu?.classList.contains("is-open")) return;

    const scrollY = window.scrollY;
    const shouldBeScrolled = headerIsScrolled
      ? scrollY > SCROLL_UP_THRESHOLD
      : scrollY > SCROLL_DOWN_THRESHOLD;

    if (shouldBeScrolled === headerIsScrolled) return;

    headerIsScrolled = shouldBeScrolled;
    header.classList.toggle("header--scrolled", headerIsScrolled);
  };

  const scheduleHeaderScrollUpdate = () => {
    if (headerScrollTicking) return;
    headerScrollTicking = true;
    requestAnimationFrame(updateHeaderScrollState);
  };

  if (header) {
    header.classList.add("header--no-transition");
    headerIsScrolled = window.scrollY > SCROLL_DOWN_THRESHOLD;
    header.classList.toggle("header--scrolled", headerIsScrolled);

    requestAnimationFrame(() => {
      header.classList.remove("header--no-transition");
    });

    window.addEventListener("scroll", scheduleHeaderScrollUpdate, { passive: true });
    window.addEventListener("load", updateHeaderScrollState);
    window.addEventListener("pageshow", updateHeaderScrollState);
  }

  // Мобильное меню (≤1280px): открытие/закрытие по кнопке (гамбургер ↔ крестик), закрытие по оверлею
  const mobileMenuToggleBtn = document.querySelector(".header__menu-mobile-btn");
  const mobileMenuBackdrop = document.querySelector(".mobile-menu__backdrop");
  const mobileMenuCity = document.querySelector(".mobile-menu__city");
  const cityNameEl = document.querySelector(".city-name");

  function openMobileMenu() {
    if (!mobileMenu || !mobileMenuToggleBtn) return;
    headerIsScrolled = false;
    header?.classList.remove("header--scrolled");
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    mobileMenuToggleBtn.classList.add("is-open");
    mobileMenuToggleBtn.setAttribute("aria-label", "Закрыть меню");
    mobileMenuToggleBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    if (!mobileMenu || !mobileMenuToggleBtn) return;
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenuToggleBtn.classList.remove("is-open");
    mobileMenuToggleBtn.setAttribute("aria-label", "Меню");
    mobileMenuToggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    updateHeaderScrollState();
  }

  function toggleMobileMenu() {
    if (mobileMenu?.classList.contains("is-open")) closeMobileMenu();
    else openMobileMenu();
  }

  if (mobileMenuToggleBtn) {
    mobileMenuToggleBtn.addEventListener("click", toggleMobileMenu);
  }
  if (mobileMenuBackdrop) {
    mobileMenuBackdrop.addEventListener("click", closeMobileMenu);
  }

  document.querySelectorAll(".mobile-menu__link").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu?.classList.contains("is-open")) {
      closeMobileMenu();
    }
  });

  // Город в меню синхронизируется с .city-name на странице (Москве → Москва)
  if (mobileMenuCity && cityNameEl) {
    const cityText = (cityNameEl.textContent || "").trim();
    if (cityText) {
      const nominative = cityText.replace(/е$/, "а"); // Москве → Москва
      mobileMenuCity.textContent = nominative;
    }
  }

  // Выбор города в мобильном меню
  const locationCard = document.getElementById("mobile-menu-location-card");
  const locationInputWrapper = document.getElementById("mobile-menu-location-input-wrapper");
  const locationInput = document.getElementById("mobile-menu-location-input");
  const citySuggestions = document.getElementById("mobile-menu-city-suggestions");

  // Список городов для поиска
  const cities = [
    { name: "Пермь", type: "г." },
    { name: "Пенза", type: "г." },
    { name: "Петрозаводск", type: "г." },
    { name: "Петропавловск-Камчатский", type: "г." },
    { name: "Печенга", type: "г." },
    { name: "Песь", type: "с." },
    { name: "Москва", type: "г." },
    { name: "Санкт-Петербург", type: "г." },
    { name: "Новосибирск", type: "г." },
    { name: "Екатеринбург", type: "г." },
    { name: "Казань", type: "г." },
    { name: "Нижний Новгород", type: "г." },
    { name: "Челябинск", type: "г." },
    { name: "Самара", type: "г." },
    { name: "Омск", type: "г." },
    { name: "Ростов-на-Дону", type: "г." },
    { name: "Уфа", type: "г." },
    { name: "Красноярск", type: "г." },
    { name: "Воронеж", type: "г." },
    { name: "Пермь", type: "г." },
  ];

  function renderCitySuggestions(query = "") {
    if (!citySuggestions) return;
    
    const filtered = cities.filter((city) =>
      city.name.toLowerCase().startsWith(query.toLowerCase())
    );

    if (filtered.length === 0) {
      citySuggestions.innerHTML = '<li class="mobile-menu__city-suggestions-empty" role="status">Ничего не найдено</li>';
      return;
    }

    citySuggestions.innerHTML = filtered
      .map(
        (city) => `
      <li role="option" data-city="${city.name}" data-type="${city.type}">
        <span class="city-prefix">${city.type}</span> <span class="city-name">${city.name}</span>
      </li>
    `
      )
      .join("");

    const handleCitySelect = (e) => {
      e.preventDefault();
      const cityName = e.currentTarget.getAttribute("data-city");
      const cityType = e.currentTarget.getAttribute("data-type");
      selectCity(cityName, cityType);
    };
    citySuggestions.querySelectorAll("li[data-city]").forEach((li) => {
      li.addEventListener("touchstart", handleCitySelect, { passive: false });
      li.addEventListener("mousedown", handleCitySelect);
    });
  }

  let cityInputIgnoreOpensUntil = 0;

  function selectCity(cityName, cityType) {
    if (mobileMenuCity) {
      mobileMenuCity.textContent = cityName;
    }
    if (cityNameEl) {
      const genitive = cityName.replace(/а$/, "е").replace(/ь$/, "и"); // Москва → Москве
      cityNameEl.textContent = genitive;
    }
    if (locationInput) {
      locationInput.value = "";
      locationInput.blur();
    }
    closeCityInput();
    cityInputIgnoreOpensUntil = Date.now() + 300;
  }

  function openCityInput(e) {
    if (Date.now() < cityInputIgnoreOpensUntil) return;
    if (locationCard) locationCard.style.display = "none";
    if (locationInputWrapper) locationInputWrapper.style.display = "block";
    if (locationInput) {
      locationInput.focus();
    }
  }

  function closeCityInput() {
    if (locationInputWrapper) {
      locationInputWrapper.classList.remove("is-open");
      locationInputWrapper.style.display = "none";
    }
    if (locationCard) locationCard.style.display = "flex";
    if (locationInput) {
      locationInput.value = "";
      locationInput.setAttribute("aria-expanded", "false");
    }
  }

  if (locationCard) {
    locationCard.addEventListener("mousedown", (e) => {
      e.preventDefault();
      openCityInput();
    });
    locationCard.addEventListener("touchstart", (e) => {
      e.preventDefault();
      openCityInput();
    }, { passive: false });
  }

  if (locationInput && locationInputWrapper && citySuggestions) {
    locationInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      if (query) {
        locationInputWrapper.classList.add("is-open");
        locationInput.setAttribute("aria-expanded", "true");
        renderCitySuggestions(query);
      } else {
        locationInputWrapper.classList.remove("is-open");
        locationInput.setAttribute("aria-expanded", "false");
        citySuggestions.innerHTML = "";
      }
    });

    document.addEventListener("click", (e) => {
      if (
        locationInputWrapper &&
        !locationInputWrapper.contains(e.target) &&
        !locationCard?.contains(e.target)
      ) {
        closeCityInput();
      }
    });

    citySuggestions.addEventListener("mousedown", (e) => e.preventDefault());
    citySuggestions.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });

    locationInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeCityInput();
      }
    });
  }

  // Табы тарифов
  const tabButtons = document.querySelectorAll(".main-tariffs__tab");
  const tabPanels = document.querySelectorAll(".main-tariffs__panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      if (!tabId) return;

      tabButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      tabPanels.forEach((panel) => {
        const isActive = panel.id === tabId;
        panel.classList.toggle("active", isActive);
        panel.setAttribute("aria-hidden", !isActive);
      });
    });
  });

  document.querySelectorAll(".main-tariffs__tabs-scroll").forEach((wrap) => {
    const scroller = wrap.querySelector(".main-tariffs__tabs");
    if (!scroller) return;

    const updateTabsScrollFade = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scroller;
      const hasOverflow = scrollWidth > clientWidth + 1;
      const atStart = scrollLeft <= 1;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;

      wrap.classList.toggle("is-overflow-right", hasOverflow && !atEnd);
      wrap.classList.toggle("is-overflow-left", hasOverflow && !atStart);
    };

    scroller.addEventListener("scroll", updateTabsScrollFade, { passive: true });
    window.addEventListener("resize", updateTabsScrollFade);

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(updateTabsScrollFade).observe(scroller);
    }

    updateTabsScrollFade();
  });

  document.querySelectorAll(".reviews__carousel").forEach((carousel) => {
    const scroll = carousel.querySelector(".reviews__scroll");
    const prevBtn = carousel.querySelector(".reviews__nav--prev");
    const nextBtn = carousel.querySelector(".reviews__nav--next");
    if (!scroll) return;

    const getStep = () => {
      const card = scroll.querySelector(".reviews__card");
      if (!card) return scroll.clientWidth;
      const list = scroll.querySelector(".reviews__list");
      const gap = list ? parseFloat(getComputedStyle(list).gap) || 24 : 24;
      return card.offsetWidth + gap;
    };

    const updateReviewsCarousel = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scroll;
      const hasOverflow = scrollWidth > clientWidth + 1;
      const atStart = scrollLeft <= 1;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;

      if (prevBtn) prevBtn.disabled = !hasOverflow || atStart;
      if (nextBtn) nextBtn.disabled = !hasOverflow || atEnd;
    };

    prevBtn?.addEventListener("click", () => {
      scroll.scrollBy({ left: -getStep(), behavior: "smooth" });
    });

    nextBtn?.addEventListener("click", () => {
      scroll.scrollBy({ left: getStep(), behavior: "smooth" });
    });

    scroll.addEventListener("scroll", updateReviewsCarousel, { passive: true });
    window.addEventListener("resize", updateReviewsCarousel);

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(updateReviewsCarousel).observe(scroll);
    }

    updateReviewsCarousel();
  });

  // Алфавит улиц на странице города (city-seo)
  document.querySelectorAll(".city-seo").forEach((block) => {
    const tabs = block.querySelectorAll(".city-seo__alpha-btn");
    const panels = block.querySelectorAll(".city-seo__streets-panel");
    tabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const letter = btn.getAttribute("data-letter");
        if (!letter) return;
        tabs.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");
        panels.forEach((panel) => {
          const isActive = panel.getAttribute("data-letter") === letter;
          panel.classList.toggle("is-active", isActive);
          panel.setAttribute("aria-hidden", String(!isActive));
        });
      });
    });
  });

  // Табы по буквам (адреса)
  document.querySelectorAll(".addresses-block").forEach((block) => {
    const tabs = block.querySelectorAll(".addresses-block__tab");
    const panels = block.querySelectorAll(".addresses-block__panel");
    tabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const letter = btn.getAttribute("data-letter");
        if (!letter) return;
        tabs.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        panels.forEach((panel) => {
          const isActive = panel.getAttribute("data-letter") === letter;
          panel.classList.toggle("active", isActive);
          panel.setAttribute("aria-hidden", !isActive);
        });
        const showAllWrap = block.querySelector(".addresses-block__show-all");
        if (showAllWrap) showAllWrap.classList.toggle("is-visible", letter === "Б");
      });
    });

    const showAllWrap = block.querySelector(".addresses-block__show-all");
    const activePanel = block.querySelector(".addresses-block__panel.active");
    if (showAllWrap && activePanel?.getAttribute("data-letter") === "Б") showAllWrap.classList.add("is-visible");

    // «Показать все адреса» — плавное раскрытие/сворачивание дополнительных адресов
    const showAllBtn = block.querySelector(".addresses-block__show-all-btn");
    const listMore = block.querySelector(".addresses-block__list-more");
    const showAllText = block.querySelector(".addresses-block__show-all-text");
    if (showAllBtn && listMore && showAllText) {
      showAllBtn.addEventListener("click", () => {
        const isExpanded = listMore.classList.toggle("is-expanded");
        showAllBtn.classList.toggle("is-expanded", isExpanded);
        showAllBtn.setAttribute("aria-expanded", isExpanded);
        showAllText.textContent = isExpanded ? "Скрыть" : "Показать все адреса";
      });
    }
  });

  // «Показать ещё» — показываем кнопку, если в панели больше 4 тарифов; по клику плавно раскрываем остальные
  document.querySelectorAll(".main-tariffs__panel").forEach((panel) => {
    const panelMore = panel.querySelector(".main-tariffs__panel-more");
    const showMoreBtn = panel.querySelector(".main-tariffs__show-more");
    if (!panelMore || !showMoreBtn) return;
    const extraCount = panelMore.querySelectorAll(".tariff-block").length;
    if (extraCount > 0) {
      showMoreBtn.classList.add("is-visible");
    }
  });

  document.addEventListener("click", (e) => {
    const showMoreBtn = e.target.closest(".main-tariffs__show-more");
    if (!showMoreBtn) return;
    const panel = showMoreBtn.closest(".main-tariffs__panel");
    const panelMore = panel?.querySelector(".main-tariffs__panel-more");
    if (panelMore) {
      panelMore.classList.add("is-expanded");
      showMoreBtn.classList.remove("is-visible");
      showMoreBtn.setAttribute("aria-expanded", "true");
    }
  });

  // Кнопка «Сравнить» — переключение зелёного состояния, toast «Тариф добавлен в сравнение»
  document.querySelectorAll(".tariff-block").forEach((block) => {
    let toast = block.querySelector(".tariff-block__compare-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "tariff-block__compare-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      const compareHref = window.location.pathname.includes("/pages/")
        ? "compare_tariffs.html"
        : "pages/compare_tariffs.html";
      toast.innerHTML = `<span>Тариф добавлен в сравнение</span><a href="${compareHref}" class="tariff-block__compare-toast-link">Перейти</a>`;
      block.appendChild(toast);
    }
  });

  document.addEventListener("click", (e) => {
    const compareBtn = e.target.closest(".compare-btn");
    if (compareBtn) {
      compareBtn.classList.toggle("active");
      const block = compareBtn.closest(".tariff-block");
      const toast = block?.querySelector(".tariff-block__compare-toast");
      if (toast && compareBtn.classList.contains("active")) {
        clearTimeout(toast._hideTimer);
        toast.classList.add("is-visible");
        toast._hideTimer = setTimeout(() => {
          toast.classList.remove("is-visible");
        }, 3500);
      }
    }
  });

  function getSearchAddressPageUrl() {
    const inPagesDir = window.location.pathname.includes("/pages/");
    return inPagesDir ? "search_address.html" : "pages/search_address.html";
  }

  function isSearchAddressPage() {
    return window.location.pathname.includes("search_address");
  }

  function navigateToSearchAddress() {
    if (isSearchAddressPage()) {
      sessionStorage.setItem("searchAddressScrollY", String(window.scrollY));
      window.location.reload();
      return;
    }
    window.location.href = getSearchAddressPageUrl();
  }

  document.querySelectorAll(".addresses-block__item").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateToSearchAddress();
    });
  });

  document.querySelectorAll(".providers-check__block").forEach((block) => {
    const searchBtn = block.querySelector(".providers-check__block__search-btn");
    const searchInput = block.querySelector(".providers-check__block__input");
    const inputWrapper = block.querySelector(".providers-check__block__input-wrapper");
    const suggestions = block.querySelector(".providers-check__block__suggestions");

    if (!searchInput || !inputWrapper) return;

    const updateBtnState = () => {
      inputWrapper.classList.toggle("is-empty", !searchInput.value.trim());
    };

    const closeDropdown = () => {
      inputWrapper.classList.remove("is-open");
      searchInput?.setAttribute("aria-expanded", "false");
    };

    const submitAddressSearch = () => {
      if (!searchInput.value.trim()) return;
      navigateToSearchAddress();
    };

    updateBtnState();
    searchInput.addEventListener("input", () => {
      updateBtnState();
      if (searchInput.value.trim()) {
        inputWrapper.classList.add("is-open");
        searchInput?.setAttribute("aria-expanded", "true");
      } else {
        closeDropdown();
      }
    });
    searchInput.addEventListener("change", updateBtnState);
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitAddressSearch();
      }
    });
    searchInput.addEventListener("blur", () => {
      setTimeout(closeDropdown, 150);
    });

    if (suggestions) {
      suggestions.querySelectorAll("li").forEach((li) => {
        li.addEventListener("mousedown", (e) => {
          e.preventDefault();
          navigateToSearchAddress();
        });
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", (e) => {
        if (!searchInput.value.trim()) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        submitAddressSearch();
      });
    }
  });

  // FAQ — аккордеон: при открытии одного остальные закрываются
  document.querySelectorAll(".faq__question").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const scrollY = window.scrollY;
      const item = btn.closest(".faq__item");
      const wrap = item?.querySelector(".faq__answer-wrap");
      if (!wrap) return;
      const isOpen = btn.classList.contains("faq__question--open");
      document.querySelectorAll(".faq__question").forEach((b) => {
        b.classList.remove("faq__question--open");
        b.setAttribute("aria-expanded", "false");
      });
      document.querySelectorAll(".faq__answer-wrap--open").forEach((w) => w.classList.remove("faq__answer-wrap--open"));
      if (!isOpen) {
        btn.classList.add("faq__question--open");
        wrap.classList.add("faq__answer-wrap--open");
        btn.setAttribute("aria-expanded", "true");
      }
      requestAnimationFrame(() => {
        if (window.location.hash) {
          history.replaceState(null, "", window.location.pathname + window.location.search);
        }
        window.scrollTo(0, scrollY);
      });
    });
  });

  // Сортировка: dropdown под кнопкой
  const sortDropdown = document.getElementById("sort-dropdown");
  const sortBtns = document.querySelectorAll(".main-tariffs__sort-btn");
  const sortOptions = document.querySelectorAll(".main-tariffs__sort-option");
  const sortBtnTexts = document.querySelectorAll(".main-tariffs__sort-btn-text");
  const sortDropdownClose = document.querySelector(".main-tariffs__sort-dropdown-close");

  function openSortDropdown() {
    if (!sortDropdown) return;
    if (filterCol?.classList.contains("is-open")) {
      filterCol.classList.remove("is-open");
      document.body.classList.remove("filter-open-mobile");
      filterTrigger?.setAttribute("aria-expanded", "false");
      filterOpenBtn?.setAttribute("aria-expanded", "false");
    }
    sortDropdown.removeAttribute("hidden");
    sortDropdown.setAttribute("aria-hidden", "false");
    sortBtns.forEach((b) => b.setAttribute("aria-expanded", "true"));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        sortDropdown.classList.add("is-open");
      });
    });
  }

  function closeSortDropdown() {
    if (!sortDropdown) return;
    sortDropdown.classList.remove("is-open");
    sortDropdown.setAttribute("aria-hidden", "true");
    sortBtns.forEach((b) => b.setAttribute("aria-expanded", "false"));
    sortDropdown.addEventListener("transitionend", function onEnd() {
      sortDropdown.removeEventListener("transitionend", onEnd);
      sortDropdown.setAttribute("hidden", "");
    }, { once: true });
  }

  function selectSortOption(option) {
    sortOptions.forEach((o) => o.classList.remove("is-selected"));
    option.classList.add("is-selected");
    const text = option.textContent.trim();
    sortBtnTexts.forEach((el) => { el.textContent = text; });
    closeSortDropdown();
  }

  sortBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!sortDropdown.classList.contains("is-open")) {
        openSortDropdown();
      } else {
        closeSortDropdown();
      }
    });
  });

  sortOptions.forEach((opt) => {
    opt.addEventListener("click", () => selectSortOption(opt));
  });

  if (sortDropdownClose) {
    sortDropdownClose.addEventListener("click", closeSortDropdown);
  }

  document.addEventListener("click", (e) => {
    if (sortDropdown && sortDropdown.classList.contains("is-open") &&
        !sortDropdown.contains(e.target) && !e.target.closest(".main-tariffs__sort-btn")) {
      closeSortDropdown();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sortDropdown && sortDropdown.classList.contains("is-open")) {
      closeSortDropdown();
    }
  });

  // Фильтры: открытие по клику на «Все фильтры»
  const filterCol = document.getElementById("filter-col");
  const filterTrigger = document.querySelector(".main-tariffs__filter-trigger");
  const filterOpenBtn = document.querySelector(".main-tariffs__filter-open-btn");
  const filterCloseBtn = document.querySelector(".main-tariffs__filter-close");

  function closeFilterPanel() {
    if (!filterCol || !filterCol.classList.contains("is-open")) return;
    filterCol.classList.remove("is-open");
    document.body.classList.remove("filter-open-mobile");
    filterTrigger?.setAttribute("aria-expanded", "false");
    filterOpenBtn?.setAttribute("aria-expanded", "false");
  }

  function toggleFilterPanel() {
    if (!filterCol) return;
    if (sortDropdown?.classList.contains("is-open")) {
      closeSortDropdown();
    }
    const isOpen = filterCol.classList.toggle("is-open");
    filterTrigger?.setAttribute("aria-expanded", isOpen);
    filterOpenBtn?.setAttribute("aria-expanded", isOpen);
    if (window.innerWidth <= 480) {
      document.body.classList.toggle("filter-open-mobile", isOpen);
    }
  }

  if (filterCol) {
    if (filterTrigger) {
      filterTrigger.addEventListener("click", toggleFilterPanel);
    }
    if (filterOpenBtn) {
      filterOpenBtn.addEventListener("click", toggleFilterPanel);
    }
    if (filterCloseBtn) {
      filterCloseBtn.addEventListener("click", toggleFilterPanel);
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeFilterPanel();
      }
    });
    document.addEventListener("click", (e) => {
      if (filterCol.classList.contains("is-open") &&
          !filterCol.contains(e.target) &&
          !filterOpenBtn?.contains(e.target)) {
        closeFilterPanel();
      }
    });
  }

  // Подсказка к цене тарифа (иконка «i»)
  const priceInfoPopovers = document.querySelectorAll(".tariff-block__price-info-popover");

  const PRICE_INFO_TRANSITION_MS = 380;
  let activeFixedPopover = null;

  function clearFixedPopoverStyles(popover) {
    if (!popover) return;
    popover.classList.remove("is-fixed-layer");
    ["position", "top", "left", "right", "bottom", "width", "maxWidth", "transform", "zIndex"].forEach((prop) => {
      popover.style[prop] = "";
    });
  }

  function restoreComparePopoverHome(popover) {
    if (!popover?._compareHome || popover.parentElement === popover._compareHome) return;
    popover._compareHome.appendChild(popover);
  }

  function placeComparePricePopover(popover, infoBtn) {
    if (!popover || !infoBtn) return;
    const home = popover._compareHome || popover.parentElement;
    popover._compareHome = home;
    if (popover.parentElement !== document.body) {
      document.body.appendChild(popover);
    }

    const rect = infoBtn.getBoundingClientRect();
    const gap = 8;
    const maxWidth = Math.min(520, window.innerWidth - 32);
    let left = rect.right - maxWidth;
    left = Math.max(16, Math.min(left, window.innerWidth - maxWidth - 16));
    let top = rect.bottom + gap;
    const estimatedHeight = 88;
    if (top + estimatedHeight > window.innerHeight - 16) {
      top = Math.max(16, rect.top - gap - estimatedHeight);
    }

    popover.classList.add("is-fixed-layer");
    popover.hidden = false;
    popover.style.position = "fixed";
    popover.style.top = `${Math.round(top)}px`;
    popover.style.left = `${Math.round(left)}px`;
    popover.style.right = "auto";
    popover.style.bottom = "auto";
    popover.style.width = `${maxWidth}px`;
    popover.style.maxWidth = `${maxWidth}px`;
    popover.style.transform = "none";
    popover.style.zIndex = "10050";
    activeFixedPopover = { popover, infoBtn };
  }

  function closePriceInfoPopover(popover) {
    if (!popover || !popover.classList.contains("is-open")) return;
    popover.classList.remove("is-open");
    popover.setAttribute("aria-hidden", "true");
    const infoBtn =
      activeFixedPopover?.popover === popover
        ? activeFixedPopover.infoBtn
        : popover
            .closest(".tariff-block__body-price-info-wrap, .tariff-block__body-price-banner")
            ?.querySelector(".tariff-block__body-price-info");
    infoBtn?.setAttribute("aria-expanded", "false");
    if (activeFixedPopover?.popover === popover) {
      activeFixedPopover = null;
    }
    window.setTimeout(() => {
      if (!popover.classList.contains("is-open")) {
        clearFixedPopoverStyles(popover);
        restoreComparePopoverHome(popover);
        popover.hidden = true;
      }
    }, PRICE_INFO_TRANSITION_MS);
  }

  function closeAllPriceInfoPopovers(except) {
    priceInfoPopovers.forEach((popover) => {
      if (popover !== except) {
        closePriceInfoPopover(popover);
      }
    });
  }

  function openPriceInfoPopover(popover, infoBtn) {
    if (!popover) return;
    closeAllPriceInfoPopovers(popover);
    popover.hidden = false;
    popover.setAttribute("aria-hidden", "false");
    const btn =
      infoBtn ||
      popover
        .closest(".tariff-block__body-price-info-wrap, .tariff-block__body-price-banner")
        ?.querySelector(".tariff-block__body-price-info");
    btn?.setAttribute("aria-expanded", "true");

    // на странице сравнения overflow/sticky обрезают absolute-попап — выносим в body + fixed
    if (btn && (popover.closest("[data-compare]") || btn.closest("[data-compare]"))) {
      placeComparePricePopover(popover, btn);
    } else {
      clearFixedPopoverStyles(popover);
      restoreComparePopoverHome(popover);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => popover.classList.add("is-open"));
    });
  }

  function syncActiveFixedPopover() {
    if (!activeFixedPopover) return;
    const { popover, infoBtn } = activeFixedPopover;
    if (!popover.classList.contains("is-open")) {
      activeFixedPopover = null;
      return;
    }
    placeComparePricePopover(popover, infoBtn);
  }

  window.addEventListener("resize", syncActiveFixedPopover);
  document.querySelector("[data-compare-scroll]")?.addEventListener("scroll", syncActiveFixedPopover, {
    passive: true,
  });

  document.querySelectorAll(".tariff-block__body-price-info").forEach((btn) => {
    const banner = btn.closest(".tariff-block__body-price-banner");
    const popover = banner?.querySelector(".tariff-block__price-info-popover");
    if (!popover) return;

    btn.setAttribute("aria-expanded", "false");

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = popover.classList.contains("is-open");
      if (isOpen) {
        closePriceInfoPopover(popover);
      } else {
        openPriceInfoPopover(popover, btn);
      }
    });

    popover.querySelector(".tariff-block__price-info-popover-btn")?.addEventListener("click", () => {
      closePriceInfoPopover(popover);
    });
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest(".tariff-block__body-price-info-wrap, .tariff-block__body-price-banner")) return;
    if (e.target.closest(".tariff-block__price-info-popover")) return;
    closeAllPriceInfoPopovers();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllPriceInfoPopovers();
    }
  });

  // Куки: при нажатии «Хорошо» — анимация исчезновения и сохранение согласия на 30 дней
  const COOKIES_KEY = "cookiesConsentExpiry";
  const COOKIES_DAYS = 30;

  const cookiesBlock = document.querySelector(".cookies-block");
  const cookiesBtn = document.querySelector(".cookies-block__btn");

  function cookiesExpiry() {
    return Date.now() + COOKIES_DAYS * 24 * 60 * 60 * 1000;
  }

  function isCookiesAccepted() {
    const expiry = localStorage.getItem(COOKIES_KEY);
    return expiry && parseInt(expiry, 10) > Date.now();
  }

  if (cookiesBlock) {
    if (isCookiesAccepted()) {
      cookiesBlock.classList.add("cookies-block--hidden", "cookies-block--removed");
    }
  }

  if (cookiesBtn && cookiesBlock) {
    cookiesBtn.addEventListener("click", () => {
      localStorage.setItem(COOKIES_KEY, String(cookiesExpiry()));
      cookiesBlock.classList.add("cookies-block--hidden");
      cookiesBlock.addEventListener(
        "transitionend",
        () => {
          cookiesBlock.classList.add("cookies-block--removed");
        },
        { once: true }
      );
    });
  }

  // Секции провайдера: плавный скролл с учётом sticky-хедера
  const providerNavLinks = document.querySelectorAll('.providers-info__tabs a[href^="#"]');
  if (providerNavLinks.length) {
    const SCROLL_GAP = 16;

    const getHeaderOffset = () => (header?.offsetHeight ?? 0) + SCROLL_GAP;

    const setActiveProviderTab = (id) => {
      providerNavLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", isActive);
        link.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    };

    const scrollToProviderSection = (id, { updateHash = true, behavior = "smooth" } = {}) => {
      const target = document.getElementById(id);
      if (!target) return;

      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - getHeaderOffset());
      window.scrollTo({ top, behavior });
      if (updateHash) {
        history.pushState(null, "", `#${id}`);
      }
      setActiveProviderTab(id);
    };

    providerNavLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href?.startsWith("#")) return;
        const id = href.slice(1);
        if (!document.getElementById(id)) return;
        e.preventDefault();
        scrollToProviderSection(id);
      });
    });

    const scrollFromHash = (behavior = "smooth") => {
      const hash = window.location.hash;
      if (!hash.startsWith("#")) return;
      const id = hash.slice(1);
      if (!document.getElementById(id)) return;
      scrollToProviderSection(id, { updateHash: false, behavior });
    };

    if (window.location.hash) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollFromHash("auto"));
      });
    }

    window.addEventListener("hashchange", () => scrollFromHash());
  }

  // Reviews page: sort tabs
  document.querySelectorAll(".reviews-sort").forEach((bar) => {
    bar.querySelectorAll(".reviews-sort__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        bar.querySelectorAll(".reviews-sort__btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
      });
    });
  });

  // Reviews page: star pickers
  document.querySelectorAll("[data-star-group]").forEach((group) => {
    const buttons = [...group.querySelectorAll("[data-star-pick]")];
    let value = 0;

    const paint = (n) => {
      buttons.forEach((btn, i) => {
        const img = btn.querySelector("img");
        if (!img) return;
        const full = img.dataset.full;
        const empty = img.dataset.empty;
        if (full && empty) img.src = i < n ? full : empty;
      });
    };

    buttons.forEach((btn) => {
      const n = Number(btn.dataset.value) || 0;
      btn.addEventListener("mouseenter", () => paint(n));
      btn.addEventListener("click", () => {
        value = n;
        paint(value);
      });
    });
    group.addEventListener("mouseleave", () => paint(value));
  });

  // Reviews page: service multi-select chips
  document.querySelectorAll("[data-svc-chip]").forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("is-on");
      chip.setAttribute("aria-pressed", chip.classList.contains("is-on") ? "true" : "false");
    });
  });

  // Reviews pages: «Показать ещё» — догружаем дубликаты карточек
  document.querySelectorAll(".js-reviews-more").forEach((btn) => {
    const feed = btn.closest(".reviews-board__main")?.querySelector(".reviews-feed")
      || btn.closest("section")?.querySelector(".reviews-feed");
    if (!feed) return;

    const BATCH = 2;
    const MAX_LOADS = 2;
    let loads = 0;

    btn.addEventListener("click", () => {
      const cards = [...feed.querySelectorAll(":scope > .reviews-card")];
      if (!cards.length) return;

      const source = cards.slice(0, Math.min(BATCH, cards.length));
      const fragment = document.createDocumentFragment();

      source.forEach((card, i) => {
        const clone = card.cloneNode(true);
        clone.removeAttribute("id");
        clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
        // лёгкая вариация даты, чтобы дубликаты не выглядели копией 1:1
        const meta = clone.querySelector(".reviews-card__meta");
        if (meta) {
          const extras = ["8 июня 2026", "5 июня 2026", "2 июня 2026", "28 мая 2026"];
          meta.textContent = extras[(loads * BATCH + i) % extras.length];
        }
        fragment.appendChild(clone);
      });

      feed.appendChild(fragment);
      loads += 1;

      if (loads >= MAX_LOADS) {
        const wrap = btn.closest(".reviews-feed__more");
        if (wrap) wrap.hidden = true;
        else btn.hidden = true;
      }
    });
  });

  // Страница сравнения тарифов: скролл, различия, удаление колонок
  document.querySelectorAll("[data-compare]").forEach((root) => {
    const scroller = root.querySelector("[data-compare-scroll]");
    const fixedHead = root.querySelector(".compare__fixed-head");
    const head = root.querySelector(".compare__head");
    const btnPrev = root.querySelector('[data-compare-arrow="prev"]');
    const btnNext = root.querySelector('[data-compare-arrow="next"]');
    const toggle = root.querySelector("[data-compare-toggle]");
    const empty = root.querySelector("[data-compare-empty]");
    const countEl = document.querySelector("[data-compare-count]");
    if (!scroller) return;

    const colWidth = 268;

    const visibleCols = () =>
      [...root.querySelectorAll(".compare__col")].filter((col) => !col.hidden);

    const updateCount = () => {
      if (!countEl) return;
      const n = visibleCols().length;
      countEl.textContent = String(n);
      const label = countEl.parentElement;
      if (label) {
        const word =
          n % 10 === 1 && n % 100 !== 11
            ? "тариф"
            : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
              ? "тарифа"
              : "тарифов";
        label.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) node.textContent = ` ${word}`;
        });
      }
    };

    const syncRowHeights = () => {
      const labelRows = [...root.querySelectorAll("[data-compare-label-row]")];
      const dataRows = [...root.querySelectorAll("[data-compare-row]")];
      labelRows.forEach((row) => {
        row.style.minHeight = "";
      });
      dataRows.forEach((row) => {
        row.style.minHeight = "";
      });
      if (fixedHead) fixedHead.style.minHeight = "";
      if (head) head.style.minHeight = "";

      requestAnimationFrame(() => {
        if (fixedHead && head) {
          const h = Math.max(fixedHead.offsetHeight, head.offsetHeight);
          fixedHead.style.minHeight = `${h}px`;
          head.style.minHeight = `${h}px`;
        }
        const len = Math.min(labelRows.length, dataRows.length);
        for (let i = 0; i < len; i += 1) {
          const h = Math.max(labelRows[i].offsetHeight, dataRows[i].offsetHeight);
          labelRows[i].style.minHeight = `${h}px`;
          dataRows[i].style.minHeight = `${h}px`;
        }
      });
    };

    const equalize = () => {
      const titles = [...root.querySelectorAll(".compare__col:not([hidden]) .compare__plan-title")];
      const banners = [...root.querySelectorAll(".compare__col:not([hidden]) .compare__price")];
      titles.forEach((t) => {
        t.style.minHeight = "";
      });
      banners.forEach((b) => {
        b.style.minHeight = "";
      });
      requestAnimationFrame(() => {
        if (titles.length) {
          const max = Math.max(55, ...titles.map((t) => t.scrollHeight));
          titles.forEach((t) => {
            t.style.minHeight = `${max}px`;
          });
        }
        requestAnimationFrame(() => {
          if (banners.length) {
            const maxB = Math.max(...banners.map((b) => b.offsetHeight));
            banners.forEach((b) => {
              b.style.minHeight = `${maxB}px`;
            });
          }
          syncRowHeights();
        });
      });
    };

    const refreshDiffFlags = () => {
      const ids = visibleCols().map((col) => col.dataset.planId);
      root.querySelectorAll("[data-compare-row]").forEach((row, index) => {
        const values = ids.map((id) => {
          const cell = row.querySelector(`.compare__cell[data-plan-id="${id}"]`);
          return cell?.querySelector(".compare__value")?.textContent.trim() ?? "";
        });
        const allSame = values.length > 1 && values.every((v) => v === values[0]);
        const labelRow = root.querySelectorAll("[data-compare-label-row]")[index];
        if (allSame) {
          row.setAttribute("data-all-same", "");
          labelRow?.setAttribute("data-all-same", "");
        } else {
          row.removeAttribute("data-all-same");
          labelRow?.removeAttribute("data-all-same");
        }
      });
    };

    const applyDiffFilter = () => {
      const showDiffs = toggle?.getAttribute("aria-pressed") === "true";
      let visibleRows = 0;
      root.querySelectorAll("[data-compare-row]").forEach((row, index) => {
        const hide = showDiffs && row.hasAttribute("data-all-same");
        row.hidden = hide;
        const labelRow = root.querySelectorAll("[data-compare-label-row]")[index];
        if (labelRow) labelRow.hidden = hide;
        if (!hide) visibleRows += 1;
      });
      if (empty) empty.hidden = !(showDiffs && visibleRows === 0);
      syncRowHeights();
    };

    const updateArrows = () => {
      if (!btnPrev || !btnNext) return;
      const max = scroller.scrollWidth - scroller.clientWidth;
      const atStart = scroller.scrollLeft <= 2;
      const atEnd = scroller.scrollLeft >= max - 2;
      btnPrev.hidden = atStart || max <= 0;
      btnNext.hidden = atEnd || max <= 0;
    };

    scroller.addEventListener("scroll", updateArrows, { passive: true });

    btnPrev?.addEventListener("click", () => {
      scroller.scrollBy({ left: -colWidth, behavior: "smooth" });
      setTimeout(updateArrows, 320);
    });
    btnNext?.addEventListener("click", () => {
      scroller.scrollBy({ left: colWidth, behavior: "smooth" });
      setTimeout(updateArrows, 320);
    });

    toggle?.addEventListener("click", () => {
      const next = toggle.getAttribute("aria-pressed") !== "true";
      toggle.setAttribute("aria-pressed", String(next));
      applyDiffFilter();
    });

    root.addEventListener("click", (e) => {
      const removeBtn = e.target.closest("[data-compare-remove]");
      if (!removeBtn) return;
      const col = removeBtn.closest(".compare__col");
      const id = col?.dataset.planId;
      if (!id) return;
      if (visibleCols().length <= 1) return;
      col.hidden = true;
      root.querySelectorAll(`.compare__cell[data-plan-id="${id}"]`).forEach((cell) => {
        cell.hidden = true;
      });
      refreshDiffFlags();
      applyDiffFilter();
      updateCount();
      equalize();
      updateArrows();
    });

    refreshDiffFlags();
    applyDiffFilter();
    updateCount();
    equalize();
    updateArrows();
    window.addEventListener("resize", () => {
      equalize();
      updateArrows();
    });
    setTimeout(equalize, 300);
  });
});
