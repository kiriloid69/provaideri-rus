/**
 * Маска телефона РФ: +7 (XXX) XXX-XX-XX
 */
(function () {
  const PHONE_PREFIX = "+7 (";
  const ALLOWED_KEYS = new Set([
    "Backspace",
    "Delete",
    "Tab",
    "Escape",
    "Enter",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
  ]);

  function getDigits(str) {
    let digits = String(str).replace(/\D/g, "");
    if (digits.startsWith("7")) digits = digits.slice(1);
    else if (digits.startsWith("8")) digits = digits.slice(1);
    return digits.slice(0, 10);
  }

  function hasUserDigits(value) {
    return getDigits(value).length > 0;
  }

  function formatPhone(digits) {
    if (!digits.length) return PHONE_PREFIX;

    let formatted = PHONE_PREFIX + digits.slice(0, 3);

    if (digits.length >= 3) formatted += ")";

    if (digits.length >= 4) formatted += " " + digits.slice(3, 6);

    if (digits.length >= 7) formatted += "-" + digits.slice(6, 8);

    if (digits.length >= 9) formatted += "-" + digits.slice(8, 10);

    return formatted;
  }

  function isControlKey(e) {
    if (ALLOWED_KEYS.has(e.key)) return true;
    if (e.ctrlKey || e.metaKey) return true;
    return false;
  }

  function isDigitKey(e) {
    return /^\d$/.test(e.key);
  }

  function setCursor(input, position) {
    const pos = Math.max(PHONE_PREFIX.length, Math.min(position, input.value.length));
    try {
      input.setSelectionRange(pos, pos);
    } catch (_) {
      /* input может быть ещё не в фокусе */
    }
  }

  function applyMask(input, previousValue, cursorPosition) {
    const currentRaw = input.value;

    if (currentRaw.length < PHONE_PREFIX.length || !currentRaw.startsWith(PHONE_PREFIX)) {
      input.value = PHONE_PREFIX;
      input.dataset.phoneMaskPrev = PHONE_PREFIX;
      setCursor(input, PHONE_PREFIX.length);
      return;
    }

    let digits = getDigits(currentRaw);
    const oldDigits = getDigits(previousValue);

    if (currentRaw.length < previousValue.length && digits.length === oldDigits.length) {
      digits = digits.slice(0, -1);
    }

    const formatted = formatPhone(digits);
    const oldLength = currentRaw.length;
    const newLength = formatted.length;

    input.value = formatted;
    input.dataset.phoneMaskPrev = formatted;

    let newCursor;
    if (currentRaw.length < previousValue.length && digits.length < oldDigits.length) {
      newCursor = newLength;
    } else if (oldLength < newLength) {
      newCursor = cursorPosition + (newLength - oldLength);
    } else if (oldLength > newLength) {
      newCursor = Math.max(PHONE_PREFIX.length, cursorPosition - (oldLength - newLength));
    } else {
      newCursor = cursorPosition;
    }

    setCursor(input, newCursor);
  }

  function showPrefix(input) {
    input.value = PHONE_PREFIX;
    input.dataset.phoneMaskPrev = PHONE_PREFIX;
    requestAnimationFrame(() => setCursor(input, PHONE_PREFIX.length));
  }

  function activateMask(input) {
    if (!hasUserDigits(input.value)) {
      showPrefix(input);
      return;
    }
    input.dataset.phoneMaskPrev = input.value;
  }

  function deactivateMask(input) {
    if (!hasUserDigits(input.value)) {
      const placeholder =
        input.getAttribute("data-phone-placeholder") || input.getAttribute("placeholder") || "Номер телефона";
      input.value = "";
      input.placeholder = placeholder;
      input.dataset.phoneMaskPrev = PHONE_PREFIX;
    } else {
      input.dataset.phoneMaskPrev = input.value;
    }
  }

  function initPhoneMask(input) {
    if (!input || input.dataset.phoneMaskInit === "true") return;
    input.dataset.phoneMaskInit = "true";

    const savedPlaceholder = input.getAttribute("placeholder") || "Номер телефона";
    input.setAttribute("data-phone-placeholder", savedPlaceholder);
    input.setAttribute("inputmode", "numeric");
    input.setAttribute("autocomplete", input.getAttribute("autocomplete") || "tel");
    input.dataset.phoneMaskPrev = PHONE_PREFIX;

    const onActivate = () => activateMask(input);
    const onDeactivate = () => deactivateMask(input);

    input.addEventListener("pointerdown", onActivate);
    input.addEventListener("mousedown", onActivate);
    input.addEventListener("focus", onActivate);
    input.addEventListener("click", onActivate);
    input.addEventListener("blur", onDeactivate);

    input.addEventListener("keydown", (e) => {
      if (isControlKey(e)) {
        if (e.key === "Backspace" || e.key === "Delete") {
          const end = input.selectionEnd;
          if (end <= PHONE_PREFIX.length) {
            e.preventDefault();
            setCursor(input, PHONE_PREFIX.length);
          }
        }
        return;
      }

      if (!isDigitKey(e)) {
        e.preventDefault();
      }
    });

    input.addEventListener("input", () => {
      const previousValue = input.dataset.phoneMaskPrev || PHONE_PREFIX;
      applyMask(input, previousValue, input.selectionStart);
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData("text");
      const digits = getDigits((input.dataset.phoneMaskPrev || PHONE_PREFIX) + pasted);
      const formatted = formatPhone(digits);
      input.value = formatted;
      input.dataset.phoneMaskPrev = formatted;
      setCursor(input, formatted.length);
    });
  }

  function initPhoneMasks(selector) {
    document.querySelectorAll(selector).forEach(initPhoneMask);
  }

  function boot() {
    initPhoneMasks("[data-phone-mask]");
  }

  window.initPhoneMask = initPhoneMask;
  window.initPhoneMasks = initPhoneMasks;

  document.addEventListener("focusin", (e) => {
    const input = e.target;
    if (!(input instanceof HTMLInputElement) || !input.matches("[data-phone-mask]")) return;
    if (input.dataset.phoneMaskInit !== "true") initPhoneMask(input);
    activateMask(input);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
