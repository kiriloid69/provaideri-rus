(() => {
  const root = document.querySelector("[data-speedtest]");
  if (!root) return;

  const canvas = root.querySelector("[data-speedtest-canvas]");
  const hint = root.querySelector("[data-speedtest-hint]");
  const center = root.querySelector("[data-speedtest-center]");
  const phaseEl = root.querySelector("[data-speedtest-phase]");
  const numEl = root.querySelector("[data-speedtest-num]");
  const runBtn = root.querySelector("[data-speedtest-run]");
  const runLabel = root.querySelector("[data-speedtest-run-label]");
  const verdict = root.querySelector("[data-speedtest-verdict]");
  const verdictTitle = root.querySelector("[data-speedtest-verdict-title]");
  const verdictDesc = root.querySelector("[data-speedtest-verdict-desc]");
  const countdown = root.querySelector("[data-speedtest-countdown]");
  const ispEl = root.querySelector("[data-speedtest-isp]");

  const vals = {
    ping: root.querySelector('[data-speedtest-val="ping"]'),
    jitter: root.querySelector('[data-speedtest-val="jitter"]'),
    dl: root.querySelector('[data-speedtest-val="dl"]'),
    ul: root.querySelector('[data-speedtest-val="ul"]'),
  };
  const tiles = {
    ping: root.querySelector('[data-speedtest-tile="ping"]'),
    jitter: root.querySelector('[data-speedtest-tile="jitter"]'),
    dl: root.querySelector('[data-speedtest-tile="dl"]'),
    ul: root.querySelector('[data-speedtest-tile="ul"]'),
  };

  const TARGET = { ping: 14, jitter: 3, dl: 187, ul: 74 };
  const ISP = "Ростелеком";
  const LAUNCH = new Date(2026, 8, 1, 0, 0, 0); // 1 сентября 2026
  const PHASE_LABELS = {
    idle: "",
    ping: "Пинг",
    download: "Загрузка",
    upload: "Отдача",
    done: "Готово",
  };

  const state = {
    phase: "idle",
    displayNum: 0,
    fill: 0,
    live: { ping: "—", jitter: "—", dl: "—", ul: "—" },
  };

  let ctx = null;
  let W = 0;
  let H = 0;
  let bubbles = [];
  let waveT = 0;
  let loopId = 0;
  let phaseStart = 0;
  let phaseDur = 0;
  let phaseTarget = 0;
  let timers = [];

  if (ispEl) ispEl.textContent = ISP;

  function pad(n) {
    return String(n).padStart(2, "0");
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

  function clearTimers() {
    timers.forEach((id) => clearTimeout(id));
    timers = [];
  }

  function later(fn, ms) {
    const id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function setActiveTile(keys) {
    Object.entries(tiles).forEach(([key, el]) => {
      if (!el) return;
      el.classList.toggle("is-active", keys.includes(key));
    });
  }

  function syncLive() {
    Object.entries(vals).forEach(([key, el]) => {
      if (el) el.textContent = String(state.live[key]);
    });
  }

  function syncUI() {
    const running = state.phase !== "idle" && state.phase !== "done";
    if (hint) hint.hidden = state.phase !== "idle";
    if (center) center.hidden = state.phase === "idle";
    if (phaseEl) phaseEl.textContent = PHASE_LABELS[state.phase] || "";
    if (numEl) {
      numEl.textContent = String(
        state.phase === "done" ? TARGET.dl : state.displayNum
      );
    }
    if (runBtn) runBtn.classList.toggle("is-running", running);
    if (runLabel) {
      runLabel.textContent =
        state.phase === "idle"
          ? "Начать проверку"
          : running
            ? "Идёт проверка…"
            : "Проверить ещё раз";
    }
    if (runBtn) runBtn.disabled = running;

    if (state.phase === "ping") setActiveTile(["ping", "jitter"]);
    else if (state.phase === "download") setActiveTile(["dl"]);
    else if (state.phase === "upload") setActiveTile(["ul"]);
    else setActiveTile([]);

    syncLive();

    if (verdict) {
      if (state.phase === "done") {
        const dl = TARGET.dl;
        const good = dl >= 100;
        if (verdictTitle) {
          verdictTitle.textContent = good
            ? `Отличная скорость — ${dl} Мбит/с`
            : `Скорость ${dl} Мбит/с`;
        }
        if (verdictDesc) {
          verdictDesc.textContent = good
            ? "Такой канал тянет 4K-стриминг на нескольких устройствах и онлайн-игры без задержек. Хотите быстрее или дешевле? Сравните тарифы в вашем доме."
            : "Для комфортного стриминга и игр стоит рассмотреть тариф от 100 Мбит/с. Посмотрите, что доступно по вашему адресу.";
        }
        verdict.hidden = false;
      } else {
        verdict.hidden = true;
      }
    }
  }

  function resize() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(r.width * dpr));
    canvas.height = Math.max(1, Math.floor(r.height * dpr));
    ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    W = r.width;
    H = r.height;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function mix(c1, c2, t) {
    return [
      Math.round(lerp(c1[0], c2[0], t)),
      Math.round(lerp(c1[1], c2[1], t)),
      Math.round(lerp(c1[2], c2[2], t)),
    ];
  }

  function speedColor(v) {
    const stops = [
      { at: 0, c: [255, 59, 48] },
      { at: 30, c: [255, 149, 0] },
      { at: 80, c: [176, 229, 65] },
      { at: 150, c: [43, 190, 72] },
    ];
    let a = stops[0];
    let b = stops[stops.length - 1];
    for (let i = 0; i < stops.length - 1; i += 1) {
      if (v >= stops[i].at && v <= stops[i + 1].at) {
        a = stops[i];
        b = stops[i + 1];
        break;
      }
      if (v > stops[stops.length - 1].at) a = b = stops[stops.length - 1];
    }
    const t = a === b ? 0 : (v - a.at) / (b.at - a.at);
    const m = mix(a.c, b.c, Math.max(0, Math.min(1, t)));
    return { rgb: m, css: `rgb(${m[0]},${m[1]},${m[2]})` };
  }

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 2.2);
  }

  function draw(now) {
    if (!ctx || !W || !H) return;
    const cx = W / 2;
    const cy = H / 2;
    const R = Math.min(W, H) / 2 - 10;
    ctx.clearRect(0, 0, W, H);

    const active = state.phase === "download" || state.phase === "upload";
    const charging = active || state.phase === "ping";
    const spd = state.phase === "done" ? TARGET.dl : state.displayNum;
    const col = speedColor(spd);
    const [cr, cg, cb] = col.rgb;

    ctx.lineWidth = 12;
    ctx.strokeStyle = "rgba(12,13,13,0.06)";
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    const prog =
      state.phase === "done"
        ? 1
        : active
          ? state.fill
          : state.phase === "ping"
            ? 0.06
            : 0;
    if (prog > 0) {
      ctx.lineWidth = 12;
      ctx.strokeStyle = col.css;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + prog * Math.PI * 2);
      ctx.stroke();
      ctx.lineCap = "butt";
    }

    const innerR = R - 20;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.clip();

    const level = charging ? state.fill : state.phase === "done" ? 1 : 0;
    const surfaceY = cy + innerR - level * (innerR * 2);

    if (charging || state.phase === "done") {
      waveT += 0.05;
      const amp = active ? 7 : 3;
      const lg = ctx.createLinearGradient(0, surfaceY, 0, cy + innerR);
      lg.addColorStop(0, `rgba(${cr},${cg},${cb},0.6)`);
      lg.addColorStop(1, `rgba(${cr},${cg},${cb},0.32)`);
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.moveTo(cx - innerR, cy + innerR);
      for (let x = -innerR; x <= innerR; x += 6) {
        const y =
          surfaceY +
          Math.sin(x / 26 + waveT) * amp +
          Math.sin(x / 61 - waveT * 0.7) * amp * 0.5;
        ctx.lineTo(cx + x, y);
      }
      ctx.lineTo(cx + innerR, cy + innerR);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = `rgba(${Math.min(cr + 40, 255)},${Math.min(cg + 40, 255)},${Math.min(cb + 40, 255)},0.22)`;
      ctx.beginPath();
      ctx.moveTo(cx - innerR, cy + innerR);
      for (let x = -innerR; x <= innerR; x += 6) {
        const y = surfaceY + 4 + Math.sin(x / 22 - waveT * 1.3) * amp * 0.8;
        ctx.lineTo(cx + x, y);
      }
      ctx.lineTo(cx + innerR, cy + innerR);
      ctx.closePath();
      ctx.fill();
    }

    if (charging) {
      const rate = active ? 0.55 : 0.2;
      if (Math.random() < rate) {
        bubbles.push({
          x: cx + (Math.random() - 0.5) * innerR * 1.5,
          y: cy + innerR + 6,
          r: 1.5 + Math.random() * 4,
          vy: 0.6 + Math.random() * 1.7,
          sway: Math.random() * Math.PI * 2,
          swayAmp: 4 + Math.random() * 10,
          life: 0,
        });
      }
    }

    for (let i = bubbles.length - 1; i >= 0; i -= 1) {
      const b = bubbles[i];
      b.y -= b.vy;
      b.life += 1;
      const bx = b.x + Math.sin(b.life / 18 + b.sway) * b.swayAmp * 0.12;
      const alpha = Math.max(0, 0.6 - b.life / 260);
      ctx.beginPath();
      ctx.arc(bx, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bx - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
      ctx.fill();
      if (b.y < cy - innerR - 10 || alpha <= 0) bubbles.splice(i, 1);
    }
    ctx.restore();

    if (active) {
      const pulse = 0.5 + Math.sin(now / 260) * 0.12;
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerR);
      rg.addColorStop(0, `rgba(${cr},${cg},${cb},${0.12 * pulse})`);
      rg.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tick(now) {
    if ((state.phase === "download" || state.phase === "upload") && phaseStart) {
      const raw = Math.min((now - phaseStart) / phaseDur, 1);
      const e = easeOut(raw);
      const wobble =
        raw < 0.96 ? Math.sin(now / 90) * 0.04 + Math.sin(now / 210) * 0.03 : 0;
      const cur = Math.max(0, phaseTarget * (e + wobble));
      const key = state.phase === "download" ? "dl" : "ul";
      state.displayNum = Math.round(cur);
      state.fill = Math.min(e, 1);
      state.live[key] = Math.round(cur);
      if (numEl) numEl.textContent = String(state.displayNum);
      if (vals[key]) vals[key].textContent = String(state.live[key]);
    }
    draw(now);
    loopId = requestAnimationFrame(tick);
  }

  function startPhase(phase, target, dur, onEnd) {
    phaseStart = performance.now();
    phaseDur = dur;
    phaseTarget = target;
    state.phase = phase;
    syncUI();
    later(onEnd, dur);
  }

  function finish() {
    state.phase = "done";
    state.displayNum = TARGET.dl;
    state.fill = 1;
    state.live = {
      ping: TARGET.ping,
      jitter: TARGET.jitter,
      dl: TARGET.dl,
      ul: TARGET.ul,
    };
    syncUI();
  }

  function run() {
    if (state.phase !== "idle" && state.phase !== "done") return;
    clearTimers();
    bubbles = [];
    state.phase = "ping";
    state.displayNum = 0;
    state.fill = 0;
    state.live = { ping: "…", jitter: "…", dl: "—", ul: "—" };
    syncUI();

    later(() => {
      startPhase("download", TARGET.dl, 3200, () => {
        startPhase("upload", TARGET.ul, 2400, () => finish());
      });
    }, 900);

    later(() => {
      state.live.ping = TARGET.ping;
      state.live.jitter = TARGET.jitter;
      syncLive();
    }, 850);
  }

  runBtn?.addEventListener("click", run);
  window.addEventListener("resize", resize);

  updateCountdown();
  setInterval(updateCountdown, 1000);
  resize();
  syncUI();
  loopId = requestAnimationFrame(tick);
})();
