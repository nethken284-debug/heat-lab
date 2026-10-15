/* ============ shared data from the textbook ============ */
const SUBSTANCES = [
  { id: 'lead', en: 'lead', zh: '鉛', c: 130 },
  { id: 'mercury', en: 'mercury', zh: '水銀', c: 140 },
  { id: 'copper', en: 'copper', zh: '銅', c: 390 },
  { id: 'iron', en: 'iron', zh: '鐵', c: 460 },
  { id: 'glass', en: 'glass', zh: '玻璃', c: 840 },
  { id: 'aluminium', en: 'aluminium', zh: '鋁', c: 900 },
  { id: 'air', en: 'air', zh: '空氣', c: 1000 },
  { id: 'ice', en: 'ice (0 °C)', zh: '冰', c: 2100 },
  { id: 'steam', en: 'steam (100 °C)', zh: '蒸氣', c: 2100 },
  { id: 'alcohol', en: 'alcohol', zh: '酒精', c: 2500 },
  { id: 'water', en: 'water', zh: '水', c: 4200 }
];
const subById = id => SUBSTANCES.find(s => s.id === id);
const UNIT = { c: 'J kg⁻¹ °C⁻¹', cK: 'J kg⁻¹ K⁻¹', C: 'J °C⁻¹', CK: 'J K⁻¹', E: 'J', P: 'W' };

/* ============ formula atoms (one colour per quantity) ============ */
const V = {
  E: '<i class="v vE">E</i>', Q: '<i class="v vE">Q</i>', m: '<i class="v vm">m</i>', c: '<i class="v vc">c</i>',
  C: '<i class="v vC">C</i>', dT: '<span class="vT">Δ<i class="v vT">T</i></span>', T: '<i class="v vT">T</i>',
  P: '<i class="v vP">P</i>', t: '<i class="v vt">t</i>', l: '<i class="v vl">l</i>'
};
const sub = (sym, s) => `${sym}<sub style="font-size:.6em">${s}</sub>`;
const frac = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
const fx = (s, cls = '') => `<span class="fx ${cls}">${s}</span>`;
const uI = u => `<span class="u-inline">${u}</span>`;

/* fragments */
function nodes(str) { const t = document.createElement('template'); t.innerHTML = String(str).trim(); return t.content; }

/* ============ mascot: 溫Sir ============ */
function sirSVG(mood = 'happy') {
  const cold = mood === 'cold';
  const liquid = cold ? 'var(--cold)' : 'var(--hot)';
  const level = { cold: 58, think: 48, happy: 42, wow: 38, hot: 12 }[mood] ?? 42;
  const ink = '#241d4a';
  const mouths = {
    happy: `<path d="M25.5 32 Q30 37 34.5 32" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`,
    wow: `<ellipse cx="30" cy="33.5" rx="2.6" ry="3.4" fill="${ink}"/>`,
    cold: `<path d="M25 33 l2.5 -2 2.5 2 2.5 -2 2.5 2" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
    think: `<path d="M26 33 H34" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`,
    hot: `<path d="M25 31 Q30 39 35 31 Z" fill="${ink}"/>`
  };
  const steam = mood === 'hot' ? `<g class="steam" style="stroke:var(--warm)" stroke-width="2" fill="none" stroke-linecap="round"><path d="M22 4 q-3 -4 0 -8"/><path d="M38 4 q3 -4 0 -8" style="animation-delay:.6s"/></g>` : '';
  const frost = cold ? `<g style="stroke:var(--cool)" stroke-width="1.5" stroke-linecap="round"><path d="M10 14 h6 M13 11 v6 M11 12 l4 4 M15 12 l-4 4"/><path d="M48 60 h5 M50.5 57.5 v5"/></g>` : '';
  return `<svg viewBox="0 -10 60 106" aria-hidden="true">${steam}${frost}
    <path d="M17 50 L8 ${mood === 'wow' ? 40 : 58}" stroke="#7a6cc4" stroke-width="3" stroke-linecap="round"/>
    <path d="M43 50 L52 ${mood === 'happy' || mood === 'hot' ? 38 : 58}" stroke="#7a6cc4" stroke-width="3" stroke-linecap="round"/>
    <rect x="17" y="2" width="26" height="74" rx="13" fill="#ece7ff" stroke="#7a6cc4" stroke-width="2"/>
    <rect x="26" y="${level}" width="8" height="${78 - level}" rx="4" style="fill:${liquid}"/>
    <circle cx="30" cy="80" r="14" style="fill:${liquid}" stroke="#7a6cc4" stroke-width="2"/>
    <circle cx="26" cy="76" r="3.5" fill="#fff" opacity=".35"/>
    <circle cx="24.5" cy="22" r="5" fill="#fff" stroke="${ink}" stroke-width="1.8"/>
    <circle cx="35.5" cy="22" r="5" fill="#fff" stroke="${ink}" stroke-width="1.8"/>
    <path d="M29.5 22 h1" stroke="${ink}" stroke-width="1.8"/>
    <circle cx="25" cy="22.5" r="1.7" fill="${ink}"/><circle cx="36" cy="22.5" r="1.7" fill="${ink}"/>
    ${mouths[mood] || mouths.happy}
  </svg>`;
}
function sir(text, mood = 'happy') {
  return `<div class="sir"><div class="sir-fig ${reduceMotion ? '' : 'floaty'}">${sirSVG(mood)}</div><div class="bubble">${text}</div></div>`;
}

/* ============ station shell ============ */
let currentToc = null;
function station({ world, id, tag, title, goal, short }) {
  const key = `${world}.${id}`;
  const el = html(`<section class="station" id="st-${world}-${id}" data-key="${key}" data-short="${short || title}">
    <header class="st-head"><span class="st-tag">${tag}</span><h2>${title}</h2><span class="st-done"${isDone(key) ? '' : ' hidden'}>✓ 完成</span></header>
    ${goal ? `<div class="st-goal">${goal}</div>` : ''}
  </section>`);
  if (isDone(key)) el.classList.add('is-done');
  const api = {
    el, key,
    add(x) { if (typeof x === 'string') { const f = nodes(x); const first = f.firstElementChild; el.appendChild(f); return first; } el.appendChild(x); return x; },
    complete(j = 500) {
      const fresh = markDone(key, j);
      if (fresh) SFX.win();
      el.classList.add('is-done');
      const d = $('.st-done', el); if (d) d.hidden = false;
      refreshToc();
      return fresh;
    },
    get done() { return isDone(key); }
  };
  return api;
}
function refreshToc() {
  if (!currentToc) return;
  $$('button[data-key]', currentToc).forEach(b => b.classList.toggle('done', isDone(b.dataset.key)));
  const st = $('#world-stars'); const w = worldById(Router.current);
  if (st && w) st.innerHTML = starHTML(starsFor(w));
}

/* world page scaffold: hero, table of contents, stations, quick check, navigation */
function worldPage(main, wid, intro, build) {
  const w = worldById(wid);
  const i = WORLDS.indexOf(w);
  main.appendChild(html(`<div class="world-hero">
    <div class="stack-sm">
      <div class="kicker">第 ${w.no} 關 · SECTION ${w.sec} · 課本 ${w.pages}</div>
      <h1>${w.zh}<span class="en-t">${w.en}</span></h1>
    </div>
    <div id="world-stars">${starHTML(starsFor(w))}</div>
  </div>`));
  if (intro) main.appendChild(html(intro));
  const toc = html('<nav class="toc" aria-label="本關站點"></nav>');
  main.appendChild(toc);
  currentToc = toc;
  const stations = [];
  build(st => { main.appendChild(st.el); stations.push(st); return st; });
  /* quick check */
  const q = station({ world: wid, id: 'quiz', tag: '小測 · 5 題', title: '過關小測', goal: '5 題答啱 4 題或以上 → 收集第 3 粒星', short: '過關小測' });
  q.add(quizBlock(wid, () => q.complete(800)));
  main.appendChild(q.el);
  stations.push(q);
  for (const st of stations) {
    const b = html(`<button type="button" data-key="${st.key}">${st.el.dataset.short}</button>`);
    b.onclick = () => { SFX.click(); st.el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); };
    toc.appendChild(b);
  }
  refreshToc();
  const prev = WORLDS[i - 1], next = WORLDS[i + 1];
  const nav = html(`<div class="world-nav">
    ${prev ? `<button class="btn" data-go="${prev.id}">← 第 ${prev.no} 關 ${prev.zh}</button>` : '<button class="btn" data-go="home">← 返回地圖</button>'}
    ${next ? `<button class="btn hot" data-go="${next.id}">第 ${next.no} 關 ${next.zh} →</button>` : '<button class="btn hot" data-go="exam">去考試 →</button>'}
  </div>`);
  $$('[data-go]', nav).forEach(b => b.onclick = () => { SFX.click(); go(b.dataset.go); });
  main.appendChild(nav);
}

/* ============ must-memorise English box ============ */
function enBox(lines, label = '考試要識寫 · English') {
  const el = html(`<div class="en"><div class="en-head"><span class="en-label">${label}</span>
    <span class="row en-tools"><button type="button" class="btn sm ghost" data-act="hide">遮住重點考自己</button><button type="button" class="btn sm ghost" data-act="show">全部顯示</button></span></div></div>`);
  let masks = 0;
  for (const l of lines) {
    const t = l.en.replace(/\[\[(.+?)\]\]/g, (m, a) => { masks++; return `<span class="mask" tabindex="0" role="button" aria-label="關鍵字">${a}</span>`; });
    el.appendChild(html(`<div class="en-text">${t}${l.zh ? `<div class="en-zh">${l.zh}</div>` : ''}</div>`));
  }
  if (!masks) $('.en-tools', el).remove();
  el.addEventListener('click', e => {
    const a = e.target.closest('[data-act]');
    if (a) { SFX.click(); $$('.mask', el).forEach(m => m.classList.toggle('hid', a.dataset.act === 'hide')); return; }
    const m = e.target.closest('.mask');
    if (m) { m.classList.toggle('hid'); SFX.tick(); }
  });
  el.addEventListener('keydown', e => { const m = e.target.closest('.mask'); if (m && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); m.classList.toggle('hid'); } });
  return el;
}

/* ============ fill in the blanks with word chips ============ */
function fillIn({ text, bank, onDone }) {
  const answers = [];
  const t = text.replace(/\{\{(.+?)\}\}/g, (m, a) => {
    answers.push(a.split('|').map(s => s.trim().toLowerCase()));
    return `<button type="button" class="blank" data-i="${answers.length - 1}" aria-label="空格 ${answers.length}">?</button>`;
  });
  const el = html(`<div class="stack-sm">
    <div class="fill-text">${t}</div>
    <div class="bank" aria-label="詞語"></div>
    <div class="row"><button type="button" class="btn sm cold" data-act="check">檢查答案</button><button type="button" class="btn sm ghost" data-act="clear">清除</button><span class="small fb" aria-live="polite"></span></div>
  </div>`);
  const blanks = $$('.blank', el);
  const vals = blanks.map(() => null);
  let active = 0, solved = false;
  const setActive = i => { active = i; blanks.forEach((b, j) => b.classList.toggle('active', j === i && !solved)); };
  const render = () => blanks.forEach((b, j) => { b.textContent = vals[j] ?? '?'; });
  const bankEl = $('.bank', el);
  shuffle(bank).forEach(word => {
    const c = html(`<button type="button" class="chip">${word}</button>`);
    c.onclick = () => {
      if (solved) return;
      SFX.click();
      if (active < 0) active = vals.findIndex(v => v == null);
      if (active < 0) return;
      vals[active] = word; blanks[active].classList.remove('ok', 'no');
      render();
      const nextEmpty = vals.findIndex(v => v == null);
      setActive(nextEmpty);
    };
    bankEl.appendChild(c);
  });
  blanks.forEach((b, j) => b.onclick = () => { if (solved) return; SFX.tick(); vals[j] = null; b.classList.remove('ok', 'no'); render(); setActive(j); });
  const fb = $('.fb', el);
  $('[data-act="check"]', el).onclick = () => {
    if (solved) return;
    if (vals.some(v => v == null)) { fb.textContent = '仲有空格未填呀！'; fb.className = 'small fb bad'; SFX.bad(); return; }
    let wrong = 0;
    blanks.forEach((b, j) => {
      const ok = answers[j].includes(String(vals[j]).toLowerCase());
      b.classList.toggle('ok', ok); b.classList.toggle('no', !ok);
      if (!ok) { wrong++; b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); }
    });
    if (wrong) { fb.textContent = `有 ${wrong} 格唔啱，撳紅色格清除再試。`; fb.className = 'small fb bad'; SFX.bad(); }
    else { solved = true; setActive(-1); fb.textContent = '全部正確！'; fb.className = 'small fb good'; SFX.good(); onDone && onDone(); }
  };
  $('[data-act="clear"]', el).onclick = () => { if (solved) return; vals.fill(null); blanks.forEach(b => b.classList.remove('ok', 'no')); render(); setActive(0); fb.textContent = ''; };
  render(); setActive(0);
  return el;
}

/* ============ single multiple-choice inside a station (retry allowed) ============ */
function mcq({ q, zh, options, answer, explain, onDone, cols2 }) {
  const el = html(`<div class="stack-sm">
    ${q ? `<div class="q-text">${q}</div>` : ''}${zh ? `<div class="q-zh">${zh}</div>` : ''}
    <div class="opts ${cols2 ? 'cols2' : ''}"></div><div class="fbw"></div></div>`);
  const box = $('.opts', el); let done = false;
  options.forEach((o, i) => {
    const b = html(`<button type="button" class="opt"><span class="k">${'ABCDEF'[i]}</span><span class="t">${o}</span></button>`);
    b.onclick = () => {
      if (done) return;
      if (i === answer) {
        done = true; b.classList.add('ok'); SFX.good();
        $$('.opt', box).forEach(x => x.disabled = true);
        if (explain) $('.fbw', el).replaceChildren(html(`<div class="feedback ok pop"><div class="fb-title">答啱！</div>${explain}</div>`));
        onDone && onDone();
      } else {
        b.classList.add('no'); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); SFX.bad();
      }
    };
    box.appendChild(b);
  });
  return el;
}

/* ============ small controls ============ */
function seg(options, value, onChange) {
  const el = html('<div class="seg" role="group"></div>');
  const set = v => $$('button', el).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === String(v))));
  options.forEach(o => {
    const b = html(`<button type="button" data-v="${o.v}">${o.label}</button>`);
    b.onclick = () => { set(o.v); SFX.click(); onChange(o.v); };
    el.appendChild(b);
  });
  set(value); el.set = set;
  return el;
}
function stepper({ min, max, step = 1, value, fmt = v => v, onChange, label }) {
  const el = html(`<div class="stepper" role="group" aria-label="${label || ''}"><button type="button" aria-label="減少">−</button><output></output><button type="button" aria-label="增加">+</button></div>`);
  const [dn, up] = $$('button', el); const out = $('output', el);
  let v = value;
  const show = () => { out.innerHTML = fmt(v); dn.disabled = v <= min; up.disabled = v >= max; };
  dn.onclick = () => { v = round(Math.max(min, v - step), 4); SFX.tick(); show(); onChange(v); };
  up.onclick = () => { v = round(Math.min(max, v + step), 4); SFX.tick(); show(); onChange(v); };
  el.set = nv => { v = nv; show(); };
  el.get = () => v;
  show();
  return el;
}
function rangeField({ id, label, min, max, step = 1, value, fmt = v => v, onInput, cls = '' }) {
  const el = html(`<div class="field"><label for="${id}">${label}：<b class="mono rv"></b></label><input id="${id}" class="${cls}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></div>`);
  const inp = $('input', el), rv = $('.rv', el);
  const upd = () => { const v = Number(inp.value); rv.innerHTML = fmt(v); onInput && onInput(v); };
  inp.addEventListener('input', upd);
  el.input = inp; el.refresh = () => { rv.innerHTML = fmt(Number(inp.value)); };
  el.refresh();
  return el;
}

/* numeric answer box with trap detection */
function numAnswer({ id, label, unit, answer, rel = 0.01, abs = 0, traps = [], hint, reveal, onOk, placeholder = '輸入答案' }) {
  const el = html(`<div class="stack-sm">
    ${label ? `<div class="lbl">${label}</div>` : ''}
    <div class="row"><span class="input-unit"><input id="${id}" class="num" inputmode="decimal" autocomplete="off" placeholder="${placeholder}">${unit ? `<span class="u">${unit}</span>` : ''}</span>
    <button type="button" class="btn sm cold">檢查</button></div>
    <div class="fbw small" aria-live="polite"></div></div>`);
  const inp = $('input', el), btn = $('button', el), fbw = $('.fbw', el);
  let tries = 0, solved = false;
  const check = () => {
    if (solved) return;
    const x = parseNum(inp.value);
    if (!isFinite(x)) { fbw.innerHTML = '<span class="bad">請輸入數字（例如 62400 或 7.2e6）。</span>'; SFX.bad(); return; }
    if (approx(x, answer, rel, abs)) {
      solved = true; inp.classList.add('ok'); inp.classList.remove('no'); inp.readOnly = true; btn.disabled = true; SFX.good();
      fbw.innerHTML = `<span class="good">正確！</span>${reveal ? `<div class="work" style="margin-top:8px">${reveal}</div>` : ''}`;
      onOk && onOk(x);
      return;
    }
    tries++;
    inp.classList.add('no'); inp.classList.remove('shake'); void inp.offsetWidth; inp.classList.add('shake'); SFX.bad();
    const trap = traps.find(t => t.test(x));
    let msg = trap ? `<span class="bad">陷阱！</span>${trap.msg}` : '<span class="bad">唔啱，再試一次。</span>';
    if (!trap && hint && tries >= 1) msg += ` <span class="muted">提示：${hint}</span>`;
    if (tries >= 3 && reveal) msg += `<div class="row" style="margin-top:6px"><button type="button" class="btn sm ghost" data-reveal>睇埋答案</button></div>`;
    fbw.innerHTML = msg;
    const rb = $('[data-reveal]', fbw);
    if (rb) rb.onclick = () => { fbw.innerHTML += `<div class="work" style="margin-top:8px">${reveal}</div>`; rb.remove(); };
  };
  btn.onclick = check;
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
  inp.addEventListener('input', () => inp.classList.remove('no'));
  return el;
}

/* ============ solver coach: knowns → formula → answer ============ */
/* problem = { title, q, zh, steps:[{kind:'knowns', items:[{sym,val,unit,traps:[{v,msg}],hint}]}, {kind:'formula', options, answer}, {kind:'calc', sym, val, unit, rel, abs, traps}], work:[lines] } */
function coach(problem, onDone) {
  const el = html(`<div class="stack-sm">
    <div class="panel-soft stack-sm"><div class="q-text">${problem.q}</div>${problem.zh ? `<div class="q-zh">${problem.zh}</div>` : ''}</div>
    <div class="steps stack-sm"></div></div>`);
  const stepsEl = $('.steps', el);
  let idx = 0;
  const finish = () => {
    stepsEl.appendChild(html(`<div class="feedback ok pop"><div class="fb-title">搞掂！完整寫法：</div><div class="work">${problem.work.map(l => `<div class="ln">${l}</div>`).join('')}</div></div>`));
    onDone && onDone();
  };
  const next = () => {
    if (idx >= problem.steps.length) { finish(); return; }
    const s = problem.steps[idx++];
    const box = html(`<div class="panel-inset stack-sm pop"><div class="lbl">${s.label || ''}</div></div>`);
    stepsEl.appendChild(box);
    if (s.kind === 'knowns') {
      const grid = html('<div class="stack-sm"></div>'); box.appendChild(grid);
      const rows = s.items.map((it, k) => {
        const r = html(`<div class="row"><span class="fx" style="min-width:3.2em">${it.sym} =</span><span class="input-unit"><input class="num sm" inputmode="decimal" autocomplete="off" id="${problem.id}-k${idx}-${k}" aria-label="${it.name || 'value'}"><span class="u">${it.unit}</span></span><span class="small msg"></span></div>`);
        grid.appendChild(r); return r;
      });
      const b = html('<div class="row"><button type="button" class="btn sm cold">檢查已知數</button></div>'); box.appendChild(b);
      $('button', b).onclick = () => {
        let allOk = true;
        rows.forEach((r, k) => {
          const it = s.items[k]; const inp = $('input', r); const msg = $('.msg', r);
          if (inp.readOnly) return;
          const x = parseNum(inp.value);
          if (approx(x, it.val, it.rel ?? 0.001, it.abs ?? 0)) { inp.classList.add('ok'); inp.classList.remove('no'); inp.readOnly = true; msg.innerHTML = '<span class="good">✓</span>'; return; }
          allOk = false; inp.classList.add('no');
          const trap = (it.traps || []).find(t => isFinite(x) && approx(x, t.v, 0.001));
          msg.innerHTML = !isFinite(x) ? '<span class="bad">要填數字</span>' : trap ? `<span class="bad">${trap.msg}</span>` : `<span class="bad">唔啱。</span>${it.hint ? `<span class="muted"> ${it.hint}</span>` : ''}`;
        });
        if (allOk) { SFX.good(); $('button', b).disabled = true; next(); } else SFX.bad();
      };
    } else if (s.kind === 'formula') {
      box.appendChild(mcq({ options: s.options, answer: s.answer, onDone: () => later(350, next), cols2: true }));
    } else if (s.kind === 'calc') {
      box.appendChild(numAnswer({ id: `${problem.id}-calc${idx}`, label: s.prompt || '', unit: s.unit, answer: s.val, rel: s.rel ?? 0.005, abs: s.abs ?? 0,
        traps: (s.traps || []).map(t => ({ test: x => approx(x, t.v, 0.003), msg: t.msg })), hint: s.hint, onOk: () => later(300, next) }));
    }
  };
  next();
  return el;
}
/* a set of coach problems with a picker; completes after `need` solved */
function coachSet(problems, need, onEnough, keyPrefix) {
  const solvedKey = `coach.${keyPrefix}`;
  const solved = new Set(Store.data.best[solvedKey] || []);
  const el = html('<div class="stack-sm"><div class="row picker"></div><div class="slot"></div><div class="small muted prog"></div></div>');
  const picker = $('.picker', el), slot = $('.slot', el), prog = $('.prog', el);
  const showProg = () => { prog.textContent = `已解決 ${solved.size} / ${problems.length} 題（解決 ${need} 題就完成呢個站）`; };
  const btns = problems.map((p, i) => {
    const b = html(`<button type="button" class="chip">${p.title}</button>`);
    b.onclick = () => open(i);
    picker.appendChild(b); return b;
  });
  const mark = () => btns.forEach((b, i) => b.classList.toggle('ok', solved.has(problems[i].id)));
  function open(i) {
    SFX.click();
    btns.forEach((b, j) => b.classList.toggle('sel', j === i));
    slot.replaceChildren(coach(problems[i], () => {
      solved.add(problems[i].id);
      Store.data.best[solvedKey] = Array.from(solved); Store.save();
      mark(); showProg(); addJoules(150);
      if (solved.size >= need) onEnough && onEnough();
    }));
  }
  mark(); showProg(); open(0);
  return el;
}

/* ============ quick check (5 questions, instant feedback) ============ */
function quizBlock(topic, onPass) {
  const el = html('<div class="stack-sm"></div>');
  const start = () => {
    el.replaceChildren();
    const qs = makeQuiz([topic], 5);
    let i = 0, score = 0;
    const head = html('<div class="row-between"><span class="score-pill">第 <b class="qi">1</b> / 5 題</span><span class="score-pill">得分 <b class="qs">0</b></span></div>');
    const slot = html('<div></div>');
    el.append(head, slot);
    const show = () => {
      $('.qi', head).textContent = i + 1;
      slot.replaceChildren(renderQuestion(qs[i], { mode: 'instant', number: i + 1, onAnswer: ok => {
        if (ok) { score++; addJoules(100); }
        else logMistake(qs[i]);
        $('.qs', head).textContent = score;
        const nb = html(`<div class="row" style="margin-top:12px"><button type="button" class="btn hot">${i < qs.length - 1 ? '下一題 →' : '睇結果'}</button></div>`);
        $('button', nb).onclick = () => { SFX.click(); i++; if (i < qs.length) show(); else end(); };
        slot.appendChild(nb);
      } }));
    };
    const end = () => {
      const pass = score >= 4;
      slot.replaceChildren(html(`<div class="stack-sm center pop">
        <div class="result-big ${pass ? 'good' : 'bad'}">${score} / 5</div>
        <div>${pass ? '過關！第 3 粒星到手。' : '差少少！要 4 題或以上先過關，再嚟過？'}</div>
        <div class="row" style="justify-content:center"><button type="button" class="btn ${pass ? '' : 'hot'}" data-again>${pass ? '再玩一次（題目會變）' : '再挑戰'}</button></div></div>`));
      $('[data-again]', slot).onclick = () => { SFX.click(); start(); };
      if (pass) { SFX.win(); Confetti.burst(); onPass && onPass(); } else SFX.bad();
    };
    show();
  };
  start();
  return el;
}
