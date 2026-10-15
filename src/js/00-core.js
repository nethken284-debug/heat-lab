'use strict';
/* ============ tiny helpers ============ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
function html(str) { const t = document.createElement('template'); t.innerHTML = String(str).trim(); return t.content.firstElementChild; }
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const randInt = (a, b) => Math.floor(rand(a, b + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const round = (x, dp = 0) => { const k = 10 ** dp; return Math.round(x * k) / k; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs = {}, parent) {
  const el = document.createElementNS(NS, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(el);
  return el;
}

/* number formatting — textbook style: 62 400, 7.2 × 10⁶, true minus sign */
const SUPMAP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const sup = n => String(n).split('').map(ch => SUPMAP[ch] || ch).join('');
function nf(x, dp) {
  if (!isFinite(x)) return '—';
  if (dp === undefined) dp = Number.isInteger(round(x, 6)) ? 0 : (Math.abs(x) < 10 ? 2 : 1);
  let s = Math.abs(x).toFixed(dp);
  if (dp > 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
  let [i, f] = s.split('.');
  if (i.length > 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const neg = x < 0 && Number(s) !== 0;
  return (neg ? '−' : '') + i + (f ? '.' + f : '');
}
function sci(x, sf = 2) {
  if (x === 0) return '0';
  let e = Math.floor(Math.log10(Math.abs(x)));
  let m = round(x / 10 ** e, sf - 1);
  if (Math.abs(m) >= 10) { m = round(m / 10, sf - 1); e += 1; }
  return `${nf(m)} × 10${sup(e)}`;
}
/* show big numbers both ways when useful */
const bigNum = x => Math.abs(x) >= 1e6 ? `${sci(x, 3).replace(/\.?0+ ×/, ' ×')}` : nf(x);

/* parse what a student types: "7.2e6", "7.2x10^6", "7.2 × 10⁶", "62 400", "-23", "437.5W" */
function parseNum(s) {
  if (s == null) return NaN;
  let t = String(s).trim().toLowerCase().replace(/[−–—]/g, '-').replace(/[\s, ]/g, '');
  const supd = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };
  t = t.replace(/(×|x|\*)10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (m, op, ex) => 'e' + ex.split('').map(c => supd[c]).join(''));
  t = t.replace(/(×|x|\*)10\^?\(?([-+]?\d+)\)?/g, 'e$2');
  t = t.replace(/[^0-9e.+\-]/g, '');
  if (!t || (t.match(/e/g) || []).length > 1) return NaN;
  if (/^e/.test(t)) return NaN;
  const n = Number(t);
  return isFinite(n) ? n : NaN;
}
function approx(x, ans, rel = 0.01, abs = 0) {
  if (!isFinite(x)) return false;
  return Math.abs(x - ans) <= Math.max(abs, Math.abs(ans) * rel) + 1e-9;
}

/* ============ storage (per-viewer convenience only) ============ */
const Store = {
  key: 'heatlab.v1',
  data: { done: {}, best: {}, joules: 0, sound: true, mistakes: [], flash: {} },
  load() {
    try { const raw = localStorage.getItem(this.key); if (raw) { const d = JSON.parse(raw); if (d && typeof d === 'object') Object.assign(this.data, d); } } catch (e) { /* storage blocked */ }
  },
  save() { try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (e) { /* storage blocked */ } },
  reset() { this.data = { done: {}, best: {}, joules: 0, sound: this.data.sound, mistakes: [], flash: {} }; this.save(); }
};
Store.load();

/* ============ sound (WebAudio, generated) ============ */
const SFX = (() => {
  let ctx = null;
  function ac() {
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; } }
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }
  function tone(freq, dur, type = 'sine', vol = 0.07, when = 0, slideTo) {
    if (!Store.data.sound) return;
    const c = ac(); if (!c) return;
    const t0 = c.currentTime + when;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(c.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  return {
    click() { tone(720, 0.05, 'square', 0.025); },
    tick() { tone(1200, 0.03, 'square', 0.02); },
    good() { tone(784, 0.09, 'triangle', 0.08); tone(1175, 0.16, 'triangle', 0.08, 0.08); },
    bad() { tone(220, 0.22, 'sawtooth', 0.045, 0, 140); },
    win() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.16, 'triangle', 0.08, i * 0.09)); },
    sizzle() { tone(320, 0.35, 'sawtooth', 0.02, 0, 900); },
    whoosh() { tone(200, 0.3, 'sine', 0.05, 0, 600); },
    toggle() { Store.data.sound = !Store.data.sound; Store.save(); renderSoundBtn(); if (Store.data.sound) this.good(); }
  };
})();
function renderSoundBtn() {
  const b = $('#hud-sound'); if (!b) return;
  b.innerHTML = Store.data.sound
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9l6 6M22 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  b.setAttribute('aria-pressed', String(Store.data.sound));
  b.title = Store.data.sound ? '音效：開' : '音效：關';
}

/* ============ toast & confetti ============ */
function toast(msg, kind = '') {
  const host = $('#toast-host'); if (!host) return;
  const t = html(`<div class="toast ${kind}">${msg}</div>`);
  host.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}
const Confetti = (() => {
  let parts = [], raf = 0;
  const colors = ['#ff5363', '#ffb02e', '#fff2bf', '#38d1ff', '#b892ff', '#52e3a0', '#ff7cc8'];
  function burst(n = 120) {
    if (reduceMotion) return;
    const cv = $('#confetti'); if (!cv) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (let i = 0; i < n; i++) {
      parts.push({ x: innerWidth / 2 + rand(-80, 80), y: innerHeight * 0.55, vx: rand(-7, 7), vy: rand(-15, -6), r: rand(3, 7), c: pick(colors), a: rand(0, 6.28), va: rand(-.2, .2), life: rand(70, 120) });
    }
    if (!raf) {
      const step = () => {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        parts = parts.filter(p => p.life > 0);
        for (const p of parts) {
          p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va; p.life--;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.globalAlpha = Math.min(1, p.life / 30);
          ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore();
        }
        if (parts.length) raf = requestAnimationFrame(step); else { raf = 0; ctx.clearRect(0, 0, innerWidth, innerHeight); }
      };
      raf = requestAnimationFrame(step);
    }
  }
  return { burst };
})();

/* ============ worlds & progress ============ */
const WORLDS = [
  { id: 'w1', no: 1, zh: '溫度與溫標', en: 'Temperature & Temperature Scales', sec: '1.1 A–B', pages: 'p.3–5', stations: ['finger', 'define', 'ladder', 'celsius', 'kelvin', 'rush'] },
  { id: 'w2', no: 2, zh: '溫度計', en: 'Thermometers', sec: '1.1 C–D', pages: 'p.5–8', stations: ['props', 'equil', 'calib', 'types', 'design'] },
  { id: 'w3', no: 3, zh: '熱與功率', en: 'Heat & Power', sec: '1.2 A–B', pages: 'p.9–10', stations: ['heat', 'power', 'meter'] },
  { id: 'w4', no: 4, zh: 'C · c · K · J 大解構', en: 'Heat Capacity & Specific Heat Capacity', sec: '1.2 C', pages: 'p.10–12', stations: ['cards', 'grid', 'units', 'same', 'sort', 'coach'] },
  { id: 'w5', no: 5, zh: '水的超能力', en: 'High Specific Heat Capacity of Water', sec: '1.3', pages: 'p.13', stations: ['water', 'coolant', 'climate', 'body'] },
  { id: 'w6', no: 6, zh: '能量守恆與混合', en: 'Principle of Conservation of Energy', sec: '1.4', pages: 'p.14–15', stations: ['law', 'mix', 'coach'] },
  { id: 'w7', no: 7, zh: '溫度–時間圖', en: 'Temperature–Time Graph', sec: '1.4', pages: 'p.16', stations: ['race', 'read', 'cw9'] }
];
const worldById = id => WORLDS.find(w => w.id === id);
const isDone = key => !!Store.data.done[key];
function worldKeys(w) { return w.stations.map(s => `${w.id}.${s}`).concat([`${w.id}.quiz`]); }
function worldProgress(w) { const k = worldKeys(w); return k.filter(isDone).length / k.length; }
function allKeys() { return WORLDS.flatMap(worldKeys).concat(['exam.mock', 'exam.boss']); }
function overallProgress() { const k = allKeys(); return k.filter(isDone).length / k.length; }
function starsFor(w) {
  const st = w.stations.filter(s => isDone(`${w.id}.${s}`)).length;
  let n = 0;
  if (st >= Math.ceil(w.stations.length / 2)) n++;
  if (st === w.stations.length) n++;
  if (isDone(`${w.id}.quiz`)) n++;
  return n;
}
const starHTML = n => `<span class="stars" aria-label="${n} 粒星">${'★'.repeat(n)}<span class="off">${'★'.repeat(3 - n)}</span></span>`;

function addJoules(n, silent) {
  Store.data.joules = Math.max(0, (Store.data.joules || 0) + n);
  Store.save();
  updateHUD();
  const j = $('#hud-joules');
  if (j && !silent) { j.classList.remove('bump'); void j.offsetWidth; j.classList.add('bump'); }
}
function markDone(key, joules = 500) {
  if (isDone(key)) return false;
  Store.data.done[key] = Date.now();
  Store.save();
  addJoules(joules, true);
  toast(`<svg viewBox="0 0 24 24" width="14" height="14" style="vertical-align:-2px"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor"/></svg> +${nf(joules)} J 能量`, 'energy');
  updateHUD();
  const w = WORLDS.find(w => key.startsWith(w.id + '.'));
  if (w && worldProgress(w) === 1) { setTimeout(() => { SFX.win(); Confetti.burst(160); toast(`第 ${w.no} 關全部完成！`, 'good'); }, 400); }
  return true;
}
function updateHUD() {
  const p = overallProgress();
  const cover = $('#brain-cover'); if (cover) cover.style.width = `${(1 - p) * 100}%`;
  const lab = $('#brain-label');
  if (lab) lab.textContent = p >= 1 ? '腦溫 100 °C 沸騰！' : `腦溫 ${Math.round(p * 100)} °C`;
  const j = $('#hud-j'); if (j) j.textContent = `${nf(Store.data.joules || 0)} J`;
}

/* ============ router ============ */
const Router = { routes: {}, cleanups: [], pending: false };
function onCleanup(fn) { Router.cleanups.push(fn); }
function go(id) {
  const h = '#' + id;
  if (location.hash === h) { route(); return; }
  Router.pending = true;
  try { location.hash = h; } catch (e) { /* hash blocked */ }
  setTimeout(() => { if (Router.pending) route(id); }, 80);
}
function route(forced) {
  Router.pending = false;
  Router.cleanups.splice(0).forEach(fn => { try { fn(); } catch (e) { /* ignore */ } });
  let id = forced || (location.hash || '#home').slice(1);
  if (!Router.routes[id]) id = 'home';
  Router.current = id;
  const main = $('#main');
  main.innerHTML = '';
  const inner = html('<div class="wrap stack"></div>');
  main.appendChild(inner);
  Router.routes[id](inner);
  window.scrollTo(0, 0);
  updateHUD();
}
/* animation loop that stops itself when the page changes */
function loop(fn) {
  let raf = 0, last = performance.now(), alive = true;
  const step = now => { if (!alive) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; if (fn(dt, now) === false) { alive = false; return; } raf = requestAnimationFrame(step); };
  raf = requestAnimationFrame(step);
  const stop = () => { alive = false; cancelAnimationFrame(raf); };
  onCleanup(stop);
  return stop;
}
/* tween numeric SVG attributes, e.g. tweenAttr(rect, {y: 40, height: 260}, 1200) */
function tweenAttr(el, to, ms = 800, done) {
  const from = {};
  for (const k in to) from[k] = parseFloat(el.getAttribute(k)) || 0;
  if (el._tw) el._tw();
  if (reduceMotion || ms <= 0) { for (const k in to) el.setAttribute(k, to[k]); done && done(); return; }
  const t0 = performance.now();
  const stop = loop((dt, now) => {
    const p = clamp((now - t0) / ms, 0, 1), e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
    for (const k in to) el.setAttribute(k, lerp(from[k], to[k], e));
    if (p >= 1) { el._tw = null; done && done(); return false; }
  });
  el._tw = stop;
}
function every(ms, fn) { const id = setInterval(fn, ms); onCleanup(() => clearInterval(id)); return () => clearInterval(id); }
function later(ms, fn) { const id = setTimeout(fn, ms); onCleanup(() => clearTimeout(id)); return id; }

/* colour along the thermal (ironbow) ramp, t in 0..1 */
const IRONBOW = [[0, [24, 10, 60]], [0.18, [70, 22, 140]], [0.38, [181, 25, 122]], [0.58, [240, 71, 58]], [0.78, [255, 157, 31]], [1, [255, 246, 190]]];
function ironbow(t) {
  t = clamp(t, 0, 1);
  for (let i = 1; i < IRONBOW.length; i++) {
    const [t1, c1] = IRONBOW[i]; const [t0, c0] = IRONBOW[i - 1];
    if (t <= t1) { const k = (t - t0) / (t1 - t0); return c0.map((v, j) => Math.round(lerp(v, c1[j], k))); }
  }
  return IRONBOW[IRONBOW.length - 1][1];
}
/* blue → white → red ramp for liquids/objects by temperature (°C) */
function tempColor(T, lo = 0, hi = 100) {
  const t = clamp((T - lo) / (hi - lo), 0, 1);
  const stops = [[0, [79, 140, 255]], [0.45, [150, 200, 255]], [0.6, [255, 196, 120]], [1, [255, 70, 80]]];
  for (let i = 1; i < stops.length; i++) {
    const [t1, c1] = stops[i]; const [t0, c0] = stops[i - 1];
    if (t <= t1) { const k = (t - t0) / (t1 - t0); const c = c0.map((v, j) => Math.round(lerp(v, c1[j], k))); return `rgb(${c[0]},${c[1]},${c[2]})`; }
  }
  return 'rgb(255,70,80)';
}
