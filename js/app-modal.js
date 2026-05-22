/**
 * Универсальные модальные окна: data-app-modal на триггере → data-app-modal-id на контейнере.
 */
(function () {
  const OPEN_CLASS = "is-open";
  const BODY_CLASS = "app-modal-open";

  function splitTariffLines(text) {
    const trimmed = String(text).trim();
    if (!trimmed) return ["", ""];

    const paren = trimmed.indexOf("(");
    if (paren !== -1) {
      return [trimmed.slice(0, paren).trim(), trimmed.slice(paren).trim()];
    }

    return [trimmed, ""];
  }

  function splitAddressLines(text) {
    const trimmed = String(text).trim();
    if (!trimmed) return ["", ""];

    const comma = trimmed.indexOf(",");
    if (comma !== -1) {
      return [trimmed.slice(0, comma).trim(), trimmed.slice(comma + 1).trim()];
    }

    return [trimmed, ""];
  }

  function setLines(container, lines) {
    if (!container) return;

    container.replaceChildren();
    lines.filter(Boolean).forEach((line) => {
      const span = document.createElement("span");
      span.textContent = line;
      container.appendChild(span);
    });
  }

  function getAddressValue() {
    const inputs = document.querySelectorAll(
      "#address-input-1, #address-input-2, .providers-check__block__input"
    );
    for (const input of inputs) {
      const value = input.value.trim();
      if (value) return value;
    }
    return "Москва, ул. Сущевский Вал, д. 18, кв 47";
  }

  function fillReviewDetail(modal, trigger) {
    const card = trigger.closest(".reviews__card");
    if (!card) return;

    const rating = card.querySelector(".reviews__rating");
    const ratingSlot = modal.querySelector("[data-app-modal-review-rating]");
    if (ratingSlot && rating) {
      ratingSlot.innerHTML = rating.innerHTML;
      const label = rating.getAttribute("aria-label");
      if (label) {
        ratingSlot.setAttribute("role", "img");
        ratingSlot.setAttribute("aria-label", label);
      } else {
        ratingSlot.removeAttribute("role");
        ratingSlot.removeAttribute("aria-label");
      }
    }

    const textSlot = modal.querySelector("[data-app-modal-review-text]");
    if (textSlot) {
      textSlot.textContent = card.querySelector(".reviews__text")?.textContent.trim() ?? "";
    }

    const avatar = card.querySelector(".reviews__avatar");
    const avatarSlot = modal.querySelector("[data-app-modal-review-avatar]");
    if (avatarSlot && avatar) {
      avatarSlot.src = avatar.src;
    }

    const nameSlot = modal.querySelector("[data-app-modal-review-name]");
    if (nameSlot) {
      nameSlot.textContent = card.querySelector(".reviews__author-name")?.textContent.trim() ?? "";
    }

    const citySlot = modal.querySelector("[data-app-modal-review-city]");
    if (citySlot) {
      citySlot.textContent = card.querySelector(".reviews__author-city")?.textContent.trim() ?? "";
    }

    const dateSlot = modal.querySelector("[data-app-modal-review-date]");
    if (dateSlot) {
      dateSlot.textContent = card.querySelector(".reviews__author-date")?.textContent.trim() ?? "";
    }

    const allLink = modal.querySelector("[data-app-modal-review-all]");
    const pageAllLink = document.querySelector(".reviews__all-link");
    if (allLink && pageAllLink) {
      allLink.href = pageAllLink.getAttribute("href") || "#";
    }
  }

  const modalFillers = {
    "connect-request"(modal, trigger) {
      const block = trigger.closest(".tariff-block");
      const tariffTitle = block?.querySelector(".tariff-block__title h2")?.textContent.trim() ?? "";

      setLines(modal.querySelector("[data-app-modal-tariff]"), splitTariffLines(tariffTitle));
      setLines(modal.querySelector("[data-app-modal-address]"), splitAddressLines(getAddressValue()));
    },
    "review-detail"(modal, trigger) {
      fillReviewDetail(modal, trigger);
    },
  };

  let activeModal = null;
  let previousFocus = null;

  function initModalPhoneMask(modal) {
    if (typeof window.initPhoneMask !== "function") return;
    modal.querySelectorAll("[data-phone-mask]").forEach((input) => {
      window.initPhoneMask(input);
    });
  }

  function resetModalForm(modal) {
    const form = modal.querySelector(".app-modal__form");
    if (!form) return;

    form.reset();
    form.querySelectorAll("[data-phone-mask]").forEach((phone) => {
      phone.value = "";
      phone.placeholder = phone.getAttribute("data-phone-placeholder") || "Номер телефона";
      phone.dataset.phoneMaskPrev = "+7 (";
      phone.blur();
    });
  }

  function openModal(modal, trigger) {
    if (!modal || modal.classList.contains(OPEN_CLASS)) return;

    const id = modal.dataset.appModalId;
    if (id && modalFillers[id]) modalFillers[id](modal, trigger);

    initModalPhoneMask(modal);

    previousFocus = document.activeElement;
    modal.classList.add(OPEN_CLASS);
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add(BODY_CLASS);
    activeModal = modal;

    const closeBtn = modal.querySelector(".app-modal__close");
    closeBtn?.focus();
  }

  function closeModal(modal) {
    if (!modal || !modal.classList.contains(OPEN_CLASS)) return;

    modal.classList.remove(OPEN_CLASS);
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove(BODY_CLASS);
    resetModalForm(modal);

    if (activeModal === modal) activeModal = null;

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
    previousFocus = null;
  }

  function closeActiveModal() {
    if (activeModal) closeModal(activeModal);
  }

  function boot() {
    document.addEventListener("click", (e) => {
      const openBtn = e.target.closest(".js-app-modal-open");
      if (openBtn) {
        e.preventDefault();
        const id = openBtn.dataset.appModal;
        if (!id) return;
        const modal = document.querySelector(`[data-app-modal-id="${id}"]`);
        openModal(modal, openBtn);
        return;
      }

      const closeEl = e.target.closest("[data-app-modal-close]");
      if (closeEl) {
        const modal = closeEl.closest(".app-modal");
        closeModal(modal);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && activeModal) {
        e.preventDefault();
        closeActiveModal();
      }
    });
  }

  window.appModal = {
    open: openModal,
    close: closeModal,
    closeActive: closeActiveModal,
    setLines,
    splitTariffLines,
    splitAddressLines,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
