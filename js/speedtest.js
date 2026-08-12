(() => {
  const root = document.querySelector("[data-speedtest]");
  if (!root) return;

  const ARC = 298;
  const MAX_DOWN = 600;
  const MAX_UP = 150;
  const DURATION = 5200;
  const TARGET = { down: 487.4, up: 96.2, ping: 8, jitter: 2.1 };
  const LAUNCH = new Date(2026, 8, 1, 0, 0, 0);

  const countdown = root.querySelector("[data-speedtest-countdown]");
  const runBtn = root.querySelector("[data-speedtest-run]");
  const runLabel = root.querySelector("[data-speedtest-run-label]");
  const phaseEl = root.querySelector("[data-st-phase]");
  const mainEl = root.querySelector("[data-st-main]");
  const noteEl = root.querySelector("[data-st-note]");
  const progressEl = root.querySelector("[data-st-progress]");
  const downEl = root.querySelector("[data-st-down]");
  const upEl = root.querySelector("[data-st-up]");
  const downArc = root.querySelector('[data-st-arc="down"]');
  const upArc = root.querySelector('[data-st-arc="up"]');
  const verdict = root.querySelector("[data-speedtest-verdict]");
  const verdictTitle = root.querySelector("[data-speedtest-verdict-title]");
  const verdictDesc = root.querySelector("[data-speedtest-verdict-desc]");
  const techPing = root.querySelector('[data-st-tech="ping"]');
  const techJitter = root.querySelector('[data-st-tech="jitter"]');

  const LABELS = {
    idle: "готов к замеру",
    ping: "измеряем пинг",
    down: "входящая скорость",
    up: "исходящая скорость",
    done: "замер завершён",
  };

  const NOTES = {
    idle: "Нажмите «Начать замер» — 25 секунд",
    ping: "Проверяем отклик до сервера M9",
    down: "Загрузка в 8 потоков",
    up: "Отдача в 8 потоков",
    done: "Быстрее, чем у 78 % абонентов Москвы",
  };

  let started = 0;
  let raf = 0;
  let running = false;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function fmt(v, digits) {
    const d = digits === undefined ? (v >= 100 ? 0 : 1) : digits;
    return v.toFixed(d).replace(".", ",");
  }

  function ease(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  function updateCountdown() {
    if (!countdown) return;
    const diffMs = LAUNCH - Date.now();
    if (diffMs <= 0) {
      countdown.hidden = true;
      return;
    }
    countdown.hidden = false;
    let diff = diffMs;
    const d = Math.floor(diff / 86400000);
    diff -= d * 86400000;
    const h = Math.floor(diff / 3600000);
    diff -= h * 3600000;
    const m = Math.floor(diff / 60000);
    diff -= m * 60000;
    const s = Math.floor(diff / 1000);
    const map = { d: pad(d), h: pad(h), m: pad(m), s: pad(s) };
    Object.entries(map).forEach(([key, value]) => {
      const el = countdown.querySelector(`[data-cd="${key}"]`);
      if (el && el.textContent !== value) el.textContent = value;
    });
  }

  function setArc(el, ratio) {
    if (!el) return;
    const r = Math.max(0, Math.min(1, ratio));
    el.style.strokeDasharray = "298 597";
    el.style.strokeDashoffset = String(ARC * (1 - r));
  }

  function render(t) {
    let phase = "idle";
    let ping = 0;
    let down = 0;
    let up = 0;

    if (started) {
      if (t >= 0.999) {
        phase = "done";
        ping = TARGET.ping;
        down = TARGET.down;
        up = TARGET.up;
      } else if (t < 0.18) {
        phase = "ping";
        ping = TARGET.ping * ease(t / 0.18);
      } else if (t < 0.62) {
        phase = "down";
        ping = TARGET.ping;
        down = TARGET.down * ease((t - 0.18) / 0.44);
      } else {
        phase = "up";
        ping = TARGET.ping;
        down = TARGET.down;
        up = TARGET.up * ease((t - 0.62) / 0.38);
      }
    }

    const idle = phase === "idle";
    const main = phase === "up" ? up : phase === "ping" ? ping : down;
    const mainText = idle
      ? "0"
      : phase === "ping"
        ? String(Math.round(ping))
        : fmt(main, main >= 100 ? 0 : 1);

    if (phaseEl) phaseEl.textContent = LABELS[phase];
    if (noteEl) noteEl.textContent = NOTES[phase];
    if (mainEl) mainEl.textContent = mainText;
    if (downEl) downEl.textContent = idle ? "0" : fmt(down, down >= 100 ? 0 : 1);
    if (upEl) upEl.textContent = idle ? "0" : fmt(up, up >= 100 ? 0 : 1);
    if (progressEl) progressEl.style.width = `${Math.round(t * 100)}%`;

    setArc(downArc, idle ? 0 : down / MAX_DOWN);
    setArc(upArc, idle ? 0 : up / MAX_UP);

    if (techPing) techPing.textContent = idle ? "0 мс" : `${Math.round(ping)} мс`;
    if (techJitter) {
      techJitter.textContent = idle ? "0 мс" : `${fmt(TARGET.jitter)} мс`;
    }

    const isBusy = phase !== "idle" && phase !== "done";
    if (runBtn) {
      runBtn.disabled = isBusy;
      runBtn.classList.toggle("is-running", isBusy);
    }
    if (runLabel) {
      runLabel.textContent =
        phase === "idle" ? "Начать замер" : phase === "done" ? "Повторить замер" : "Идёт замер…";
    }

    if (verdict) {
      if (phase === "done") {
        const dl = Math.round(TARGET.down);
        if (verdictTitle) verdictTitle.textContent = `Отличная скорость — ${dl} Мбит/с`;
        if (verdictDesc) {
          verdictDesc.textContent =
            "Такой канал тянет 4K-стриминг на нескольких устройствах и онлайн-игры без задержек. Хотите быстрее или дешевле? Сравните тарифы в вашем доме.";
        }
        verdict.hidden = false;
      } else {
        verdict.hidden = true;
      }
    }

    return phase === "done";
  }

  function tick() {
    if (!started) return;
    const t = Math.min(1, (Date.now() - started) / DURATION);
    const done = render(t);
    if (done) {
      running = false;
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  function run() {
    if (running) return;
    running = true;
    started = Date.now();
    if (raf) cancelAnimationFrame(raf);
    render(0);
    raf = requestAnimationFrame(tick);
  }

  setArc(downArc, 0);
  setArc(upArc, 0);
  render(0);
  updateCountdown();
  setInterval(updateCountdown, 1000);
  runBtn?.addEventListener("click", run);
})();
