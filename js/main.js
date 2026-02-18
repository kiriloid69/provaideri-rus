document.addEventListener("DOMContentLoaded", () => {
  // Хедер: при скролле > 100px — уменьшаем вертикальный отступ (не при открытом мобильном меню)
  const header = document.querySelector(".header");
  const mobileMenu = document.getElementById("mobile-menu");
  const SCROLL_THRESHOLD = 100;
  if (header) {
    const onScroll = () => {
      if (mobileMenu?.classList.contains("is-open")) return;
      header.classList.toggle("header--scrolled", window.scrollY > SCROLL_THRESHOLD);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Мобильное меню (≤1280px): открытие/закрытие по кнопке (гамбургер ↔ крестик), закрытие по оверлею
  const mobileMenuToggleBtn = document.querySelector(".header__menu-mobile-btn");
  const mobileMenuBackdrop = document.querySelector(".mobile-menu__backdrop");
  const mobileMenuCity = document.querySelector(".mobile-menu__city");
  const cityNameEl = document.querySelector(".city-name");

  function openMobileMenu() {
    if (!mobileMenu || !mobileMenuToggleBtn) return;
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
    if (header) {
      header.classList.toggle("header--scrolled", window.scrollY > SCROLL_THRESHOLD);
    }
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
      toast.innerHTML = '<span>Тариф добавлен в сравнение</span><a href="#" class="tariff-block__compare-toast-link">Перейти</a>';
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

  document.querySelectorAll(".providers-check__block").forEach((block) => {
    const searchBtn = block.querySelector(".providers-check__block__search-btn");
    const searchInput = block.querySelector(".providers-check__block__input");
    const inputWrapper = block.querySelector(".providers-check__block__input-wrapper");
    const suggestions = block.querySelector(".providers-check__block__suggestions");

    if (!searchInput || !inputWrapper) return;

    const updateBtnState = () => {
      inputWrapper.classList.toggle("is-empty", !searchInput.value.trim());
    };

    const openDropdown = () => {
      if (searchInput.value.trim()) {
        inputWrapper.classList.add("is-open");
        searchInput?.setAttribute("aria-expanded", "true");
      }
    };

    const closeDropdown = () => {
      inputWrapper.classList.remove("is-open");
      searchInput?.setAttribute("aria-expanded", "false");
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
    searchInput.addEventListener("blur", () => {
      setTimeout(closeDropdown, 150);
    });

    if (suggestions) {
      suggestions.querySelectorAll("li").forEach((li) => {
        li.addEventListener("mousedown", (e) => {
          e.preventDefault();
          searchInput.value = li.textContent;
          updateBtnState();
          closeDropdown();
          searchInput.blur();
        });
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", (e) => {
        if (!searchInput.value.trim()) {
          e.preventDefault();
          return;
        }
        console.log(searchInput.value);
      });
    }
  });

  // FAQ — аккордеон: при открытии одного остальные закрываются
  document.querySelectorAll(".faq__question").forEach((btn) => {
    btn.addEventListener("click", () => {
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
});
