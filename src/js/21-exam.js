/* ============ question renderer: instant (practice) · exam (no feedback) · review ============ */
function renderQuestion(q, { mode = 'instant', number, onAnswer, given } = {}) {
  const el = html(`<div class="stack-sm qcard">
    <div class="row-between"><span class="small mono muted">${number ? `Q${number} · ` : ''}${TOPIC_NAME[q.topic] || ''}</span>${q.src ? `<span class="small mono dim">${q.src}</span>` : ''}</div>
    <div class="q-text">${q.q}</div>
    ${q.graph ? `<div class="graph-q">${q.graph}</div>` : ''}
    ${q.zh ? `<details class="q-hint"><summary>中文提示</summary><div class="q-zh">${q.zh}</div></details>` : ''}
    <div class="ans stack-sm"></div><div class="fbw"></div></div>`);
  const ans = $('.ans', el), fbw = $('.fbw', el);
  const showFb = (ok, blank) => {
    fbw.replaceChildren(html(`<div class="feedback ${ok ? 'ok' : 'no'} pop"><div class="fb-title">${ok ? '答啱！' : `${blank ? '未作答。' : '唔啱。'}正確答案：${answerText(q)}`}</div>${q.explain || ''}</div>`));
  };
  if (q.type === 'num') {
    const row = html(`<div class="row"><span class="input-unit"><input class="num" inputmode="decimal" autocomplete="off" placeholder="答案" aria-label="答案"><span class="u">${q.unit || ''}</span></span>${mode === 'instant' ? '<button type="button" class="btn sm cold">提交</button>' : ''}</div>`);
    ans.appendChild(row);
    if (mode !== 'review') ans.appendChild(html('<div class="tiny dim">大數可以打 7.2e6（= 7.2 × 10⁶）；唔使打單位。</div>'));
    const inp = $('input', row);
    if (mode === 'instant') {
      const btn = $('button', row);
      const submit = () => {
        const x = parseNum(inp.value);
        if (!isFinite(x)) { fbw.innerHTML = '<span class="bad small">請輸入數字。</span>'; SFX.bad(); return; }
        inp.readOnly = true; btn.disabled = true;
        const ok = isCorrect(q, inp.value);
        inp.classList.add(ok ? 'ok' : 'no');
        showFb(ok);
        if (!ok && q.traps) { const t = q.traps.find(t => approx(x, t.v, 0.004)); if (t) $('.feedback', fbw).insertAdjacentHTML('beforeend', `<div class="small" style="margin-top:6px"><b class="bad">中咗陷阱：</b>${t.msg}</div>`); }
        ok ? SFX.good() : SFX.bad();
        onAnswer && onAnswer(ok, inp.value);
      };
      btn.onclick = submit;
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    } else if (mode === 'exam') {
      if (given != null) inp.value = given;
      inp.addEventListener('input', () => onAnswer && onAnswer(inp.value));
    } else {
      inp.value = given ?? ''; inp.readOnly = true;
      const ok = isCorrect(q, given); inp.classList.add(ok ? 'ok' : 'no');
      showFb(ok, given == null || given === '');
    }
  } else {
    const short = q.options.every(o => o.replace(/<[^>]+>/g, '').length <= 16);
    const box = html(`<div class="opts ${short ? 'cols2' : ''}"></div>`);
    ans.appendChild(box);
    const btns = q.options.map((o, i) => { const b = html(`<button type="button" class="opt"><span class="k">${'ABCDE'[i]}</span><span class="t">${o}</span></button>`); box.appendChild(b); return b; });
    if (mode === 'instant') {
      btns.forEach((b, i) => b.onclick = () => {
        btns.forEach(x => x.disabled = true);
        const ok = i === q.answer;
        b.classList.add(ok ? 'ok' : 'no'); btns[q.answer].classList.add('ok');
        showFb(ok); ok ? SFX.good() : SFX.bad();
        onAnswer && onAnswer(ok, i);
      });
    } else if (mode === 'exam') {
      const mark = v => btns.forEach((b, i) => b.classList.toggle('pick', i === v));
      if (given != null) mark(Number(given));
      btns.forEach((b, i) => b.onclick = () => { SFX.tick(); mark(i); onAnswer && onAnswer(i); });
    } else {
      btns.forEach(b => b.disabled = true);
      const g = given == null ? -1 : Number(given);
      if (g >= 0 && g !== q.answer) btns[g].classList.add('no');
      btns[q.answer].classList.add('ok');
      showFb(g === q.answer, g < 0);
    }
  }
  return el;
}

/* ============ exam corner hub ============ */
const EXAM_MODES = [
  { id: 'mock', t: '模擬考', d: '10 或 20 題、限時、交卷先對答案——最似真考試。', ico: ICONS.exam },
  { id: 'boss', t: 'Boss 戰：冰霜魔王', d: '答啱一題＝向魔王射一發熱力。3 條命，打到佢溶為止！', ico: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" style="fill:var(--cool)"/><circle cx="19" cy="20" r="2.4" style="fill:var(--inset)"/><circle cx="29" cy="20" r="2.4" style="fill:var(--inset)"/><path d="M19 28h10" style="stroke:var(--inset)" stroke-width="2.5" stroke-linecap="round"/></svg>' },
  { id: 'practice', t: '專題練習', d: '揀範圍，無限出題，即時睇解釋。', ico: ICONS.w2 },
  { id: 'flash', t: '定義閃卡', d: '考試要默的英文定義，一張張翻。', ico: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="10" width="28" height="30" rx="4" style="fill:none;stroke:var(--muted)" stroke-width="2.5"/><rect x="14" y="6" width="28" height="30" rx="4" style="fill:var(--panel-3);stroke:var(--warm)" stroke-width="2.5"/><path d="M20 16h16M20 22h12M20 28h14" style="stroke:var(--warm)" stroke-width="2.2" stroke-linecap="round"/></svg>' },
  { id: 'mistakes', t: '錯題本', d: '答錯過的題目自動收集，再做一次直到啱。', ico: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 6h22l6 6v30H10z" style="fill:none;stroke:var(--muted)" stroke-width="2.5" stroke-linejoin="round"/><path d="M18 22l12 12M30 22L18 34" style="stroke:var(--bad)" stroke-width="3.5" stroke-linecap="round"/></svg>' }
];
Router.routes.exam = main => {
  main.appendChild(html(`<div class="world-hero"><div class="stack-sm"><div class="kicker">考試區 · Section 1 Heat 全部範圍</div><h1>考試區<span class="en-t">Exam corner</span></h1></div></div>`));
  main.appendChild(html(sir('考試題目用<b>英文</b>（同課本一樣），唔明可以撳「中文提示」。計數題記得：<b>g → kg、分鐘 → 秒、kW → W、ΔT 係變化</b>。', 'think')));
  const grid = html('<div class="map"></div>');
  for (const m of EXAM_MODES) {
    let meta = '';
    if (m.id === 'mock') meta = `最佳：${Store.data.best['exam.mock'] != null ? Store.data.best['exam.mock'] + '%' : '未考'}`;
    if (m.id === 'boss') meta = isDone('exam.boss') ? '已打敗魔王' : '未打敗';
    if (m.id === 'mistakes') meta = `${(Store.data.mistakes || []).length} 題`;
    if (m.id === 'flash') meta = `${FLASH.length} 張卡`;
    const c = html(`<button type="button" class="card-link" data-go="${m.id}"><span class="ico">${m.ico}</span><span class="stack-sm" style="gap:2px;min-width:0"><span class="card-title">${m.t}</span><span class="small muted">${m.d}</span><span class="meta"><span>${meta || '&nbsp;'}</span></span></span></button>`);
    c.onclick = () => { SFX.click(); go(m.id); };
    grid.appendChild(c);
  }
  main.appendChild(grid);
  main.appendChild(html('<div class="row"><button type="button" class="btn" data-home>← 返回地圖</button></div>'));
  $('[data-home]', main).onclick = () => { SFX.click(); go('home'); };
};
function examBack(main) {
  const b = html('<div class="row"><button type="button" class="btn sm ghost">← 返回考試區</button></div>');
  $('button', b).onclick = () => { SFX.click(); go('exam'); };
  main.appendChild(b);
}

/* ============ mock exam ============ */
const GRADES = [
  [100, '燈泡級 > 2000 °C', '滿分！熱到發光！'],
  [80, '沸水級 100 °C', '好勁，差少少就滿分。'],
  [60, '發燒級 38 °C', '合格有餘，溫吓錯題就更穩陣。'],
  [40, '室溫級 24 °C', '一半左右，返去玩返相關關卡再嚟。'],
  [0, '冰格級 −25 °C', '未熱身？先玩關卡同閃卡，再考過。']
];
Router.routes.mock = main => {
  examBack(main);
  main.appendChild(html('<div class="world-hero"><div class="stack-sm"><div class="kicker">考試區</div><h1>模擬考<span class="en-t">Mock test</span></h1></div></div>'));
  const slot = html('<div class="station"></div>');
  main.appendChild(slot);
  const setup = () => {
    slot.replaceChildren(html(`<div class="stack-sm">
      <p>題目會由 7 關平均抽出（包括課本 Classwork），計數題每次數字都唔同。考試期間<b>唔會</b>即時對答案，交卷先知。</p>
      <div class="row"><button type="button" class="btn hot lg" data-n="10">10 題 · 15 分鐘</button><button type="button" class="btn lg" data-n="20">20 題 · 30 分鐘</button></div></div>`));
    $$('[data-n]', slot).forEach(b => b.onclick = () => { SFX.click(); start(Number(b.dataset.n)); });
  };
  const start = n => {
    const plan = n === 20 ? { w1: 3, w2: 3, w3: 3, w4: 4, w5: 2, w6: 3, w7: 2 } : { w1: 1, w2: 2, w3: 1, w4: 2, w5: 1, w6: 2, w7: 1 };
    const qs = shuffle(Object.entries(plan).flatMap(([t, k]) => makeQuiz([t], k)));
    const given = qs.map(() => null);
    let cur = 0, left = n === 20 ? 1800 : 900, submitted = false;
    slot.replaceChildren(html(`<div class="stack-sm">
      <div class="row-between"><span class="score-pill">⏱ <b class="tm"></b></span><span class="score-pill">已答 <b class="an">0</b> / ${n}</span></div>
      <div class="timer-bar"><i style="width:100%"></i></div>
      <div class="palette" aria-label="題目導航"></div>
      <div class="qslot"></div>
      <div class="row-between"><span class="row"><button type="button" class="btn sm" data-prev>← 上一題</button><button type="button" class="btn sm" data-next>下一題 →</button></span><button type="button" class="btn hot" data-submit>交卷</button></div>
      <div class="small warn"></div></div>`));
    const pal = $('.palette', slot);
    const pbtns = qs.map((_, i) => { const b = html(`<button type="button">${i + 1}</button>`); b.onclick = () => { cur = i; show(); }; pal.appendChild(b); return b; });
    const paint = () => {
      pbtns.forEach((b, i) => { b.classList.toggle('cur', i === cur); b.classList.toggle('ans', given[i] != null && given[i] !== ''); });
      $('.an', slot).textContent = given.filter(g => g != null && g !== '').length;
    };
    const show = () => {
      $('.qslot', slot).replaceChildren(renderQuestion(qs[cur], { mode: 'exam', number: cur + 1, given: given[cur], onAnswer: v => { given[cur] = v; paint(); } }));
      $('[data-prev]', slot).disabled = cur === 0; $('[data-next]', slot).disabled = cur === n - 1;
      paint();
    };
    $('[data-prev]', slot).onclick = () => { SFX.click(); if (cur > 0) { cur--; show(); } };
    $('[data-next]', slot).onclick = () => { SFX.click(); if (cur < n - 1) { cur++; show(); } };
    const sb = $('[data-submit]', slot);
    sb.onclick = () => {
      const blank = given.filter(g => g == null || g === '').length;
      if (blank && !sb.dataset.arm) { sb.dataset.arm = '1'; sb.textContent = '確定交卷'; $('.warn', slot).innerHTML = `<span class="hl-warm">仲有 ${blank} 題未答。再撳一次「確定交卷」就會交。</span>`; return; }
      finish();
    };
    const tick = () => {
      const mm = String(Math.floor(left / 60)).padStart(2, '0'), ss = String(left % 60).padStart(2, '0');
      $('.tm', slot).textContent = `${mm}:${ss}`; $('.timer-bar i', slot).style.width = `${left / (n === 20 ? 1800 : 900) * 100}%`;
    };
    tick();
    const stop = every(1000, () => { if (submitted) return; left--; tick(); if (left <= 0) { toast('時間到！自動交卷', 'bad'); finish(); } });
    const finish = () => {
      if (submitted) return; submitted = true; stop();
      const res = qs.map((q, i) => isCorrect(q, given[i]));
      const score = res.filter(Boolean).length, pct = Math.round(score / n * 100);
      qs.forEach((q, i) => { if (!res[i]) logMistake(q); });
      const prevBest = Store.data.best['exam.mock'];
      if (prevBest == null || pct > prevBest) { Store.data.best['exam.mock'] = pct; Store.save(); }
      addJoules(score * 60);
      if (pct >= 60) markDone('exam.mock', 1500);
      const g = GRADES.find(([p]) => pct >= p);
      if (pct >= 80) { SFX.win(); Confetti.burst(180); } else if (pct >= 60) SFX.good(); else SFX.bad();
      const byTopic = Object.keys(TOPIC_NAME).map(t => { const idx = qs.map((q, i) => i).filter(i => qs[i].topic === t); return { t, n: idx.length, ok: idx.filter(i => res[i]).length }; }).filter(x => x.n);
      slot.replaceChildren(html(`<div class="stack">
        <div class="center stack-sm pop"><div class="result-big ${pct >= 60 ? 'good' : 'bad'}">${score} / ${n}</div><div class="hl-warm" style="font-size:1.2rem">${g[1]}</div><div class="muted">${g[2]}（${pct}%）</div></div>
        <div class="stack-sm">${byTopic.map(x => `<div class="bar-row"><span>${TOPIC_NAME[x.t]}</span><span class="track"><i style="width:${x.ok / x.n * 100}%"></i></span><span class="mono">${x.ok}/${x.n}</span></div>`).join('')}</div>
        <div class="row"><button type="button" class="btn hot" data-again>再考一份</button><button type="button" class="btn" data-mis>去錯題本</button></div>
        <h3>逐題對答案</h3><div class="stack review"></div></div>`));
      const rv = $('.review', slot);
      qs.forEach((q, i) => { const it = html('<div class="review-item"></div>'); it.appendChild(renderQuestion(q, { mode: 'review', number: i + 1, given: given[i] })); rv.appendChild(it); });
      $('[data-again]', slot).onclick = () => { SFX.click(); setup(); window.scrollTo(0, 0); };
      $('[data-mis]', slot).onclick = () => { SFX.click(); go('mistakes'); };
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    show();
  };
  setup();
};

/* ============ boss battle ============ */
function bossSVG(hp, max) {
  const k = hp / max;                       // 1 = frozen solid, 0 = melted
  const T = Math.round(-273 + (1 - k) * 373);
  const col = tempColor(T, -273, 100);
  const sy = 0.35 + 0.65 * k;
  return `<svg viewBox="0 0 200 200" class="svg-fit" style="max-width:260px;margin:auto" role="img" aria-label="冰霜魔王，溫度 ${T} °C">
    <ellipse cx="100" cy="184" rx="${70 - 30 * k}" ry="10" style="fill:${col}" opacity=".45"/>
    <g style="transform-origin:100px 184px;transform:scaleY(${sy});transition:transform .6s">
      <path d="M100 20 L128 60 L170 70 L140 104 L150 150 L100 130 L50 150 L60 104 L30 70 L72 60 Z" style="fill:${col};stroke:var(--white-hot)" stroke-width="3" stroke-linejoin="round"/>
      <path d="M100 20 L100 130 M30 70 L140 104 M170 70 L60 104" style="stroke:var(--white-hot)" stroke-width="1.5" opacity=".4"/>
      <path d="M76 78 l16 8 M124 78 l-16 8" style="stroke:var(--inset)" stroke-width="5" stroke-linecap="round"/>
      <circle cx="85" cy="92" r="6" style="fill:var(--inset)"/><circle cx="115" cy="92" r="6" style="fill:var(--inset)"/>
      <path d="M84 116 q16 ${k > 0.5 ? -8 : 10} 32 0" fill="none" style="stroke:var(--inset)" stroke-width="5" stroke-linecap="round"/>
    </g>
    <text x="100" y="16" text-anchor="middle" font-size="15" font-weight="800" style="fill:var(--white-hot)" class="mono">${T} °C</text>
  </svg>`;
}
Router.routes.boss = main => {
  examBack(main);
  main.appendChild(html('<div class="world-hero"><div class="stack-sm"><div class="kicker">考試區</div><h1>Boss 戰：冰霜魔王<span class="en-t">Defeat Frostbite at absolute zero</span></h1></div></div>'));
  const slot = html('<div class="station"></div>');
  main.appendChild(slot);
  const MAX = 10;
  const intro = () => {
    slot.replaceChildren(html(`<div class="stack-sm"><div class="boss-arena"><div>${bossSVG(MAX, MAX)}</div>
      <div class="stack-sm">${sir('冰霜魔王住喺 <b>0 K</b>！每答啱一題，就向佢射一發熱力；連續答啱 3 題有<b>雙倍傷害</b>。你有 3 條命，答錯會俾佢凍親。', 'cold')}
      <div class="row"><button type="button" class="btn hot lg" data-go>開打！</button></div></div></div></div>`));
    $('[data-go]', slot).onclick = () => { SFX.click(); fight(); };
  };
  const fight = () => {
    let hp = MAX, lives = 3, streak = 0, qi = 0;
    const qs = makeQuiz(Object.keys(TOPIC_NAME), BANK.length);
    slot.replaceChildren(html(`<div class="stack-sm">
      <div class="boss-arena"><div class="boss-fig"></div>
        <div class="stack-sm"><div class="lbl">魔王 HP</div><div class="hp"><i style="width:100%"></i></div>
        <div class="row-between"><span class="hearts" aria-label="生命"></span><span class="score-pill">連擊 <b class="st">0</b></span></div>
        <div class="small muted bmsg">準備……</div></div></div>
      <div class="qslot"></div></div>`));
    const fig = $('.boss-fig', slot), qslot = $('.qslot', slot);
    const paint = () => {
      fig.innerHTML = bossSVG(hp, MAX);
      $('.hp i', slot).style.width = `${hp / MAX * 100}%`;
      $('.hearts', slot).innerHTML = '♥'.repeat(lives) + `<span class="off">${'♥'.repeat(3 - lives)}</span>`;
      $('.st', slot).textContent = streak;
    };
    const ask = () => {
      const q = qs[qi++ % qs.length];
      qslot.replaceChildren(renderQuestion(q, { mode: 'instant', onAnswer: ok => {
        if (ok) {
          streak++; const dmg = streak >= 3 ? 2 : 1; hp = Math.max(0, hp - dmg); addJoules(100);
          $('.bmsg', slot).innerHTML = `<span class="good">熱力命中！−${dmg} HP${dmg > 1 ? '（連擊雙倍！）' : ''}</span>`; SFX.sizzle();
        } else {
          streak = 0; lives--; logMistake(q);
          $('.bmsg', slot).innerHTML = '<span class="bad">冰凍反擊！你冇咗一條命。</span>';
          fig.classList.remove('shake'); void fig.offsetWidth; fig.classList.add('shake');
        }
        paint();
        const nb = html(`<div class="row" style="margin-top:12px"><button type="button" class="btn hot">${hp <= 0 ? '睇結果' : lives <= 0 ? '睇結果' : '下一擊 →'}</button></div>`);
        $('button', nb).onclick = () => { SFX.click(); if (hp <= 0) win(); else if (lives <= 0) lose(); else ask(); };
        qslot.appendChild(nb);
      } }));
    };
    const win = () => {
      SFX.win(); Confetti.burst(220); markDone('exam.boss', 3000);
      slot.replaceChildren(html(`<div class="stack-sm center pop"><div>${bossSVG(0, MAX)}</div><div class="result-big good">魔王溶咗！</div><p>由 0 K 一路升到 100 °C——你嘅熱學知識足夠將佢煮滾。</p><div class="row" style="justify-content:center"><button type="button" class="btn hot" data-again>再打一次</button><button type="button" class="btn" data-ex>返考試區</button></div></div>`));
      $('[data-again]', slot).onclick = () => { SFX.click(); fight(); };
      $('[data-ex]', slot).onclick = () => { SFX.click(); go('exam'); };
    };
    const lose = () => {
      SFX.bad();
      slot.replaceChildren(html(`<div class="stack-sm center pop"><div>${bossSVG(hp, MAX)}</div><div class="result-big bad">俾魔王凍住咗！</div><p>魔王仲有 ${hp} HP。答錯的題目已經放咗入<b>錯題本</b>。</p><div class="row" style="justify-content:center"><button type="button" class="btn hot" data-again>再挑戰</button><button type="button" class="btn" data-mis>睇錯題本</button></div></div>`));
      $('[data-again]', slot).onclick = () => { SFX.click(); fight(); };
      $('[data-mis]', slot).onclick = () => { SFX.click(); go('mistakes'); };
    };
    paint(); ask();
  };
  intro();
};

/* ============ topic practice ============ */
Router.routes.practice = main => {
  examBack(main);
  main.appendChild(html('<div class="world-hero"><div class="stack-sm"><div class="kicker">考試區</div><h1>專題練習<span class="en-t">Practice by topic</span></h1></div></div>'));
  const slot = html('<div class="station"></div>');
  main.appendChild(slot);
  const sel = new Set(Object.keys(TOPIC_NAME));
  const chips = html('<div class="row"></div>');
  Object.entries(TOPIC_NAME).forEach(([t, name]) => {
    const c = html(`<button type="button" class="chip sel" aria-pressed="true">${worldById(t).no}. ${name}</button>`);
    c.onclick = () => { if (sel.has(t) && sel.size > 1) sel.delete(t); else sel.add(t); c.classList.toggle('sel', sel.has(t)); c.setAttribute('aria-pressed', String(sel.has(t))); SFX.tick(); };
    chips.appendChild(c);
  });
  const head = html('<div class="row-between"><span class="score-pill">答啱 <b class="ok">0</b> / <b class="tot">0</b></span><span class="score-pill">連續 <b class="st">0</b></span></div>');
  const qslot = html('<div></div>');
  slot.append(html('<div class="lbl">揀範圍（可以揀多個）</div>'), chips, head, qslot);
  let ok = 0, tot = 0, st = 0, queue = [];
  const next = () => {
    if (!queue.length) queue = makeQuiz([...sel], 999);
    const q = queue.shift();
    qslot.replaceChildren(renderQuestion(q, { mode: 'instant', onAnswer: good => {
      tot++; if (good) { ok++; st++; addJoules(50); } else { st = 0; logMistake(q); }
      $('.ok', head).textContent = ok; $('.tot', head).textContent = tot; $('.st', head).textContent = st;
      if (st && st % 5 === 0) { toast(`連續答啱 ${st} 題！`, 'good'); Confetti.burst(60); }
      const nb = html('<div class="row" style="margin-top:12px"><button type="button" class="btn hot">下一題 →</button></div>');
      $('button', nb).onclick = () => { SFX.click(); next(); };
      qslot.appendChild(nb);
    } }));
  };
  chips.addEventListener('click', () => { queue = []; });
  next();
};

/* ============ definition flashcards ============ */
const FLASH = [
  ['Temperature', '溫度', 'A measure of the degree of hotness (or coldness) of an object.'],
  ['Fixed points', '定點', 'Easily reproducible temperatures used to define a temperature scale: the lower fixed point and the upper fixed point.'],
  ['Lower fixed point (Celsius)', '下定點', 'The melting point of pure ice at normal atmospheric pressure, taken as 0 °C (ice point).'],
  ['Upper fixed point (Celsius)', '上定點', 'The boiling point of pure water at normal atmospheric pressure, taken as 100 °C (steam point).'],
  ['Degree (°C)', '度', 'The range between the two fixed points is divided into 100 equal intervals called degrees.'],
  ['Kelvin scale', '開爾文溫標', 'Absolute temperature scale: T<sub>K</sub> (K) = T<sub>C</sub> (°C) + 273. An increase of 1 °C is equal to an increase of 1 K.'],
  ['Absolute zero', '絕對零度', 'The lowest possible temperature: 0 K (≈ −273 °C).'],
  ['Thermometer', '溫度計', 'An instrument using the thermometric properties of matter to measure temperature (an objective measurement).'],
  ['Thermometric property', '測溫性質', 'A physical property that changes with temperature, e.g. length (volume) of a liquid column, pressure of gas, resistance of metal, colour of liquid crystal.'],
  ['Thermal equilibrium', '熱平衡', 'Two bodies in contact reach the same temperature when the time is long enough. Read the temperature when thermal equilibrium is reached.'],
  ['Calibration (proportional method)', '校準（比例法）', 'Assume the property changes uniformly: (T₁ − T₂)/(l₁ − l₂) = (T − T₂)/(l − l₂).'],
  ['Sensitivity of a liquid-in-glass thermometer', '靈敏度', 'A larger bulb (more liquid) or a narrower capillary tube gives a larger increase of length for the same increase of temperature → more sensitive.'],
  ['Infrared thermometer', '紅外線溫度計', 'Hotter objects emit more infrared radiation. Used for body temperature measuring.'],
  ['Heat', '熱', 'The energy transferred from one body to another due to the temperature difference. Heat is NOT a form of energy as it cannot be stored in a body. Symbol Q or E; unit J.'],
  ['Power', '功率', 'The rate of energy transferred: P = E / t. Unit: watt (W); 1 W = 1 J s⁻¹.'],
  ['Kilowatt-hour (kWh)', '千瓦小時', 'The energy used by an appliance of power 1 kW in 1 hour: 1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ J.'],
  ['Heat capacity (C)', '熱容量', 'The amount of energy required to raise the temperature of a body by 1 °C. C = E / ΔT; unit J °C⁻¹ (J K⁻¹). Depends on both the mass and the substance.'],
  ['Specific heat capacity (c)', '比熱容', 'The energy required to raise the temperature of 1 kg of the substance by 1 °C. c = E / (mΔT); unit J kg⁻¹ °C⁻¹ (J kg⁻¹ K⁻¹). Independent of mass.'],
  ['C and c', 'C 與 c 的關係', 'For a given substance, heat capacity = mass × specific heat capacity: C = mc (c = C / m).'],
  ['Law of conservation of energy', '能量守恆定律', 'Energy cannot be created or destroyed. Energy only changes from one form to another (e.g. electrical energy → thermal energy).'],
  ['Mixing (no heat loss)', '混合', 'Energy lost by the hotter object = energy gained by the colder object: m<sub>h</sub>c<sub>h</sub>(T<sub>h</sub> − T<sub>f</sub>) = m<sub>c</sub>c<sub>c</sub>(T<sub>f</sub> − T<sub>c</sub>).'],
  ['Temperature–time graph', '溫度–時間圖', 'With the same power supplied, a substance with a smaller heat capacity has a steeper slope (it takes less time to increase its temperature).'],
  ['High specific heat capacity of water', '水的高比熱容', 'Water (4200 J kg⁻¹ °C⁻¹) absorbs/releases a large amount of energy for a small temperature change: coolant in engines, smaller daily temperature range in coastal areas, steady body temperature (70 % water).']
];
Router.routes.flash = main => {
  examBack(main);
  main.appendChild(html('<div class="world-hero"><div class="stack-sm"><div class="kicker">考試區</div><h1>定義閃卡<span class="en-t">Definitions to memorise</span></h1></div></div>'));
  const slot = html('<div class="station"></div>');
  main.appendChild(slot);
  const st = Store.data.flash || (Store.data.flash = {});
  let onlyWeak = false, deck = [], i = 0;
  const build = () => { deck = FLASH.map((f, k) => k).filter(k => !onlyWeak || st[k] !== 'ok'); if (!deck.length) deck = FLASH.map((f, k) => k); i = 0; };
  const show = () => {
    const k = deck[i], f = FLASH[k];
    const known = Object.values(st).filter(v => v === 'ok').length;
    slot.replaceChildren(html(`<div class="stack-sm">
      <div class="row-between"><span class="score-pill">第 ${i + 1} / ${deck.length} 張</span><span class="score-pill">已記得 ${known} / ${FLASH.length}</span></div>
      <button type="button" class="flip" style="min-height:260px" aria-label="翻卡"><div class="flip-in" style="min-height:260px">
        <div class="flip-face" style="justify-content:center;align-items:center;text-align:center"><div class="small mono muted">${f[1]}</div><div style="font-family:var(--font-display);font-weight:800;font-size:clamp(1.6rem,5vw,2.4rem);line-height:1.15">${f[0]}</div><div class="flip-tap">撳一下翻卡，先喺心入面講出英文定義</div></div>
        <div class="flip-face flip-back" style="justify-content:center;font-size:1.05rem"><div class="lbl">${f[0]}</div><div>${f[2]}</div></div>
      </div></button>
      <div class="row" style="justify-content:center"><button type="button" class="btn" data-k="no">✗ 未記得</button><button type="button" class="btn cold" data-k="ok">✓ 記得</button></div>
      <div class="row" style="justify-content:center"><label class="small muted"><input type="checkbox" id="fl-weak" ${onlyWeak ? 'checked' : ''}> 只溫未記得的卡</label></div></div>`));
    const card = $('.flip', slot);
    card.onclick = () => { card.classList.toggle('on'); SFX.tick(); };
    $$('[data-k]', slot).forEach(b => b.onclick = () => {
      st[k] = b.dataset.k; Store.save(); b.dataset.k === 'ok' ? SFX.good() : SFX.click();
      i++; if (i >= deck.length) { build(); toast('一輪完成！', 'good'); } show();
    });
    $('#fl-weak', slot).onchange = e => { onlyWeak = e.target.checked; build(); show(); };
  };
  build(); show();
};

/* ============ mistake book ============ */
Router.routes.mistakes = main => {
  examBack(main);
  main.appendChild(html('<div class="world-hero"><div class="stack-sm"><div class="kicker">考試區</div><h1>錯題本<span class="en-t">Questions you got wrong</span></h1></div></div>'));
  const slot = html('<div class="station"></div>');
  main.appendChild(slot);
  const list = () => {
    const ms = Store.data.mistakes || [];
    if (!ms.length) {
      slot.replaceChildren(html(`<div class="stack-sm">${sir('錯題本係空的！要唔係你全部答啱，就係未開始做題。去 Boss 戰或者模擬考試吓？', 'happy')}<div class="row"><button type="button" class="btn hot" data-g="boss">去 Boss 戰</button><button type="button" class="btn" data-g="mock">去模擬考</button></div></div>`));
      $$('[data-g]', slot).forEach(b => b.onclick = () => { SFX.click(); go(b.dataset.g); });
      return;
    }
    slot.replaceChildren(html(`<div class="stack-sm"><p>共 <b>${ms.length}</b> 題。重做時答啱就會由錯題本移走。</p>
      <div class="row"><button type="button" class="btn hot" data-redo>重做錯題</button><button type="button" class="btn ghost sm" data-clear>清空錯題本</button></div>
      <div class="stack review"></div></div>`));
    const rv = $('.review', slot);
    ms.forEach((q, i) => { const it = html('<div class="review-item"></div>'); it.appendChild(renderQuestion(q, { mode: 'review', number: i + 1, given: null })); rv.appendChild(it); });
    $('[data-redo]', slot).onclick = () => { SFX.click(); redo(); };
    const cb = $('[data-clear]', slot);
    cb.onclick = () => { if (!cb.dataset.arm) { cb.dataset.arm = '1'; cb.textContent = '再撳一次確認清空'; return; } Store.data.mistakes = []; Store.save(); list(); };
  };
  const redo = () => {
    const qs = (Store.data.mistakes || []).slice();
    let i = 0, fixed = 0;
    const one = () => {
      if (i >= qs.length) { slot.replaceChildren(html(`<div class="stack-sm center pop"><div class="result-big ${fixed === qs.length ? 'good' : ''}">${fixed} / ${qs.length}</div><p>改正咗 ${fixed} 題。</p><div class="row" style="justify-content:center"><button type="button" class="btn" data-l>返錯題本</button></div></div>`)); $('[data-l]', slot).onclick = () => { SFX.click(); list(); }; if (fixed) Confetti.burst(80); return; }
      const q = qs[i];
      slot.replaceChildren(html(`<div class="row-between"><span class="score-pill">重做 ${i + 1} / ${qs.length}</span></div>`));
      slot.appendChild(renderQuestion(q, { mode: 'instant', onAnswer: ok => {
        if (ok) { fixed++; addJoules(80); Store.data.mistakes = (Store.data.mistakes || []).filter(x => x.q !== q.q); Store.save(); }
        const nb = html('<div class="row" style="margin-top:12px"><button type="button" class="btn hot">下一題 →</button></div>');
        $('button', nb).onclick = () => { SFX.click(); i++; one(); };
        slot.appendChild(nb);
      } }));
    };
    one();
  };
  list();
};
