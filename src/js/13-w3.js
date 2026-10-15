/* ============ World 3 · Heat & power (p.9–10) ============ */

/* one-try multiple-choice run: items = [{q, opts, ans, why}] — passes when right >= need */
function quickRun(items, need, onPass, label = '題') {
  const el = html('<div class="panel-inset stack-sm"></div>');
  const run = () => {
    const list = shuffle(items).slice(0, Math.min(items.length, 6));
    let i = 0, right = 0;
    const one = () => {
      if (i >= list.length) {
        const ok = right >= need;
        el.replaceChildren(html(`<div class="stack-sm center"><div class="result-big ${ok ? 'good' : 'bad'}">${right} / ${list.length}</div><div>${ok ? '過關！' : `要 ${need} ${label}或以上，再嚟！`}</div><div class="row" style="justify-content:center"><button type="button" class="btn sm" data-r>再玩</button></div></div>`));
        $('[data-r]', el).onclick = () => { SFX.click(); run(); };
        if (ok) { onPass && onPass(); }
        return;
      }
      const it = list[i];
      const order = shuffle(it.opts.map((_, k) => k));
      const card = html(`<div class="stack-sm"><div class="row-between"><span class="score-pill">第 ${i + 1} / ${list.length} ${label}</span><span class="score-pill">答啱 ${right}</span></div>
        <div class="q-text">${it.q}</div><div class="opts ${it.opts.every(o => o.length < 22) ? 'cols2' : ''}"></div><div class="fbw" style="min-height:1.6em"></div></div>`);
      order.forEach((k, pos) => {
        const b = html(`<button type="button" class="opt"><span class="k">${'ABCD'[pos]}</span><span class="t">${it.opts[k]}</span></button>`);
        b.onclick = () => {
          const all = $$('.opt', card); all.forEach(x => x.disabled = true);
          const ok = k === it.ans; if (ok) { right++; SFX.good(); } else SFX.bad();
          b.classList.add(ok ? 'ok' : 'no'); all[order.indexOf(it.ans)].classList.add('ok');
          $('.fbw', card).innerHTML = `<span class="small ${ok ? 'good' : 'bad'}">${ok ? '啱！' : '唔啱。'}</span> <span class="small muted">${it.why || ''}</span>`;
          const nb = html(`<div class="row"><button type="button" class="btn sm hot">${i < list.length - 1 ? '下一題 →' : '睇結果'}</button></div>`);
          $('button', nb).onclick = () => { SFX.click(); i++; one(); };
          card.appendChild(nb);
        };
        $('.opts', card).appendChild(b);
      });
      el.replaceChildren(card);
    };
    one();
  };
  run();
  return el;
}

Router.routes.w3 = main => worldPage(main, 'w3',
  sir('第 3 關：「熱」同「溫度」唔係同一樣嘢！熱係<b>傳緊的能量</b>，用 <b>J</b> 量度；功率就係能量傳得幾快。', 'hot'),
  add => {
    /* ---------- 1. heat flow ---------- */
    {
      const st = add(station({ world: 'w3', id: 'heat', tag: '1.2A · p.9', title: '熱的定義：能量由熱流去冷', short: '熱的定義', goal: '試一次「接觸」，再完成 4 句啱定錯' }));
      st.add(enBox([
        { en: 'When two bodies of different temperatures touch one another, [[energy]] is transferred from the [[hot]] body to the [[cold]] body until they reach the same temperature.', zh: '兩件唔同溫度的物體接觸，能量由熱的一方傳去冷的一方，直到溫度相同。' },
        { en: '<b>Heat</b> is the [[energy transferred]] from one body to another due to the [[temperature difference]].', zh: '熱：因為溫度差而由一件物體傳去另一件的能量。（課堂筆記：一種因溫度差而轉移能量的方式）' },
        { en: 'Heat is the energy transferred. Heat is [[NOT a form of energy]] as it [[cannot be stored]] in a body.', zh: '熱係「傳緊」的能量，唔可以儲存喺物體入面。' },
        { en: 'The symbol of heat is [[Q or E]] (in general). Heat is measured in [[joules (J)]].', zh: '符號 Q 或 E；單位焦耳 J。' }
      ]));
      const box = html(`<div class="stack-sm">
        <svg class="svg-fit hf-svg" viewBox="0 0 480 210" style="max-width:560px;margin-inline:auto" role="img" aria-label="兩件一樣的方塊接觸，熱由熱的流向冷的">
          <rect class="hf-a" x="40" y="50" width="200" height="140" rx="12"/><rect class="hf-b" x="240" y="50" width="200" height="140" rx="12"/>
          <path d="M240 50 V190" style="stroke:var(--inset)" stroke-width="3"/>
          <text class="hf-ta mono" x="140" y="130" text-anchor="middle" font-size="30" font-weight="800"></text>
          <text class="hf-tb mono" x="340" y="130" text-anchor="middle" font-size="30" font-weight="800"></text>
          <g class="hf-dots"></g>
          <text class="hf-arrow" x="240" y="34" text-anchor="middle" font-size="16" font-weight="800" style="fill:var(--qE)"></text>
        </svg>
        <div class="two"><div class="hf-ra"></div><div class="hf-rb"></div></div>
        <div class="row"><button type="button" class="btn hot" data-go>接觸！</button><button type="button" class="btn ghost sm" data-reset>重設</button><span class="small hf-msg"></span></div></div>`);
      st.add(box);
      let Ta = 80, Tb = 50, running = false, contacted = false, tfDone = false;
      const svg = $('.hf-svg', box), dots = $('.hf-dots', svg), msg = $('.hf-msg', box);
      const paint = () => {
        $('.hf-a', svg).style.fill = tempColor(Ta); $('.hf-b', svg).style.fill = tempColor(Tb);
        $('.hf-ta', svg).textContent = `${Ta.toFixed(0)}°C`; $('.hf-tb', svg).textContent = `${Tb.toFixed(0)}°C`;
        $('.hf-ta', svg).style.fill = '#1a1030'; $('.hf-tb', svg).style.fill = '#1a1030';
        const d = Ta - Tb;
        $('.hf-arrow', svg).textContent = Math.abs(d) < 0.5 ? '溫度相同 → 冇熱流動' : d > 0 ? 'Heat flow →' : '← Heat flow';
      };
      const ra = rangeField({ id: 'hf-a', label: '左邊方塊', min: 0, max: 100, value: 80, fmt: v => `${v} °C`, onInput: v => { if (running) return; Ta = v; paint(); } });
      const rb = rangeField({ id: 'hf-b', label: '右邊方塊', min: 0, max: 100, value: 50, fmt: v => `${v} °C`, onInput: v => { if (running) return; Tb = v; paint(); }, cls: 'cold' });
      $('.hf-ra', box).appendChild(ra); $('.hf-rb', box).appendChild(rb);
      let parts = [];
      $('[data-go]', box).onclick = () => {
        if (running) return;
        if (Math.abs(Ta - Tb) < 0.5) { msg.innerHTML = '兩邊溫度一樣 → <b>冇溫度差，就冇熱傳遞</b>。試吓將兩邊調到唔同溫度。'; SFX.bad(); return; }
        running = true; SFX.whoosh(); msg.textContent = '';
        const Tf = (Ta + Tb) / 2;
        loop(dt => {
          const d = Ta - Tb;
          if (Math.abs(d) < 0.4) {
            Ta = Tb = Tf; paint(); running = false; dots.innerHTML = ''; parts = [];
            msg.innerHTML = `<b class="good">熱平衡！</b>兩邊都係 ${Tf.toFixed(1)} °C，熱就停止流動。（兩件方塊一模一樣，所以最後溫度喺正中間。）`;
            if (!contacted) { contacted = true; if (tfDone) st.complete(); }
            return false;
          }
          const k = 1 - Math.exp(-dt * 0.9);
          Ta -= d / 2 * k; Tb += d / 2 * k;
          if (Math.random() < Math.min(0.9, Math.abs(d) / 30)) parts.push({ x: d > 0 ? 190 : 290, y: rand(70, 170), v: d > 0 ? 1 : -1 });
          parts = parts.filter(p => (p.x += p.v * 140 * dt) > 60 && p.x < 420);
          dots.innerHTML = parts.map(p => `<circle cx="${p.x}" cy="${p.y}" r="5" style="fill:var(--qE)" opacity=".9"/>`).join('');
          paint();
        });
      };
      $('[data-reset]', box).onclick = () => { if (running) return; SFX.click(); Ta = Number(ra.input.value); Tb = Number(rb.input.value); paint(); msg.textContent = ''; };
      paint();
      st.add('<div class="lbl">啱定錯？</div>');
      st.add(tfCards([
        { en: 'Heat is a form of energy that can be stored in a hot body.', zh: '熱係一種可以儲存喺熱物體入面的能量。', ans: false, why: 'Heat is NOT a form of energy as it cannot be stored in a body. 熱係「傳緊」的能量。' },
        { en: 'Energy is transferred from the colder body to the hotter body.', zh: '能量由冷的傳去熱的。', ans: false, why: '方向永遠係由 hot body → cold body。' },
        { en: 'Heat transfer stops when the two bodies reach the same temperature.', zh: '兩件物體同溫之後，熱就停止傳遞。', ans: true, why: '冇溫度差 = 冇熱傳遞（thermal equilibrium）。' },
        { en: 'Heat is measured in joules (J).', zh: '熱的單位係焦耳。', ans: true, why: '熱係能量，所以用 J。溫度先用 °C 或 K。' }
      ], () => { tfDone = true; if (contacted) st.complete(); }));
    }

    /* ---------- 2. power: the energy tap ---------- */
    {
      const st = add(station({ world: 'w3', id: 'power', tag: '1.2B · p.9 · Classwork 4', title: '功率 = 能量「流」得幾快', short: '功率', goal: '玩吓能量水喉，再答 Classwork 4' }));
      st.add(enBox([
        { en: '<b>Power</b> is the [[rate of energy transferred]]: power = energy transfer ÷ time, [[P = E / t]].', zh: '功率：能量傳遞的速率。' },
        { en: 'The unit of power is [[watt]] (W), i.e. 1 W = [[1 J s⁻¹]]. 1 kW = 10³ W, 1 MW = 10⁶ W.', zh: '1 W 即係每秒 1 J。' },
        { en: 'Power released by a hot body = rate of energy released by the hot body. Power absorbed by a cold body = rate of energy absorbed by the cold body.', zh: '' }
      ]));
      st.add(fx(`${V.P} = ${frac(V.E, V.t)}　⇔　${V.E} = ${V.P} ${V.t}`, 'big'));
      const box = html(`<div class="two">
        <svg class="svg-fit tap-svg" viewBox="0 0 300 300" style="max-width:340px;margin-inline:auto" role="img" aria-label="能量水喉">
          <path d="M20 40 H150 V70" fill="none" stroke="#cfc7f5" stroke-width="16" stroke-linecap="round"/><rect x="132" y="66" width="36" height="16" rx="4" fill="#cfc7f5"/>
          <rect x="70" y="150" width="160" height="140" rx="14" fill="none" stroke="#cfc7f5" stroke-width="3"/>
          <rect class="tap-fill" x="73" y="287" width="154" height="0" rx="10" style="fill:var(--qE)" opacity=".75"/>
          <g class="tap-drops"></g>
          <text class="tap-lab" x="150" y="226" text-anchor="middle" font-size="13" font-weight="700" style="fill:var(--white-hot)">1 小時的能量</text>
        </svg>
        <div class="stack-sm">
          <div class="lbl">電器功率 P</div><div class="tap-p"></div>
          <div class="lbl">時間快轉</div><div class="tap-s"></div>
          <div class="readout stack-sm"><div>t = <b class="tap-t">0 s</b></div><div>E = P t = <b class="tap-e">0 J</b></div><div class="small muted tap-k"></div></div>
          <div class="row"><button type="button" class="btn hot" data-run>▶ 開機</button><button type="button" class="btn ghost sm" data-reset>重設</button></div></div></div>`);
      st.add(box);
      let P = 2000, speed = 60, t = 0, on = false, drops = [];
      $('.tap-p', box).appendChild(seg([{ v: 100, label: '100 W' }, { v: 1000, label: '1 kW' }, { v: 2000, label: '2 kW 電熱水壺' }], 2000, v => { P = Number(v); reset(); }));
      $('.tap-s', box).appendChild(seg([{ v: 1, label: '×1' }, { v: 60, label: '×60（1 秒 = 1 分鐘）' }, { v: 600, label: '×600' }], 60, v => { speed = Number(v); }));
      const show = () => {
        const E = P * t;
        $('.tap-t', box).textContent = t >= 60 ? `${nf(round(t, 0))} s（${nf(round(t / 60, 1))} min）` : `${nf(round(t, 1))} s`;
        $('.tap-e', box).textContent = `${bigNum(round(E, 0))} J`;
        $('.tap-k', box).innerHTML = `每秒流入 ${nf(P)} J（${nf(P)} W = ${nf(P)} J s⁻¹）　|　= ${nf(round(E / 3.6e6, 3))} kWh`;
        const f = Math.min(1, t / 3600);
        const r = $('.tap-fill', box); r.setAttribute('height', 134 * f); r.setAttribute('y', 287 - 134 * f);
      };
      const reset = () => { on = false; t = 0; drops = []; $('.tap-drops', box).innerHTML = ''; $('[data-run]', box).textContent = '▶ 開機'; show(); };
      $('[data-run]', box).onclick = () => { on = !on; SFX.click(); $('[data-run]', box).textContent = on ? '❚❚ 暫停' : '▶ 開機'; };
      $('[data-reset]', box).onclick = () => { SFX.click(); reset(); };
      loop(dt => {
        if (on) {
          t = Math.min(3600, t + dt * speed);
          if (t >= 3600) { on = false; $('[data-run]', box).textContent = '▶ 開機'; SFX.good(); toast(`1 小時：E = ${bigNum(P * 3600)} J`, 'energy'); }
          const rate = Math.min(14, 1 + Math.log10(P) * 2.5);
          if (Math.random() < rate * dt) drops.push({ y: 84, x: 150 + rand(-6, 6) });
          show();
        }
        drops = drops.filter(d => (d.y += 260 * dt) < 280 - 134 * Math.min(1, t / 3600));
        $('.tap-drops', box).innerHTML = drops.map(d => `<circle cx="${d.x}" cy="${d.y}" r="6" style="fill:var(--qE)"/>`).join('');
      });
      show();
      st.add('<div class="lbl">Classwork 4</div>');
      st.add(numAnswer({ id: 'cw4', label: 'A 2-kW electric kettle is used to heat some cold water. How much energy (in J) is transferred to the water if it is switched on for 1 hour?', unit: 'J', answer: 7.2e6, rel: 0.01,
        traps: [{ test: x => approx(x, 7200, 0.01), msg: '2 kW = 2000 W，唔係 2！' }, { test: x => approx(x, 2000, 0.01) || approx(x, 120000, 0.01), msg: '1 小時 = 3600 s！' }],
        hint: 'E = P t，P 用 W、t 用 s。', reveal: 'E = P t = 2000 W × 3600 s = <b>7.2 × 10⁶ J</b>', onOk: () => st.complete() }));
    }

    /* ---------- 3. joulemeter & kWh meter ---------- */
    {
      const st = add(station({ world: 'w3', id: 'meter', tag: '1.2B · p.10', title: '焦耳計 vs 千瓦小時錶', short: '電錶', goal: '單位換算 6 題答啱 5 題' }));
      st.add(enBox([
        { en: 'To measure the electrical energy transferred, we can use a [[joulemeter]] or a [[kilowatt-hour meter]].', zh: '量電能：焦耳計或千瓦小時錶（電錶）。' },
        { en: 'Joulemeter measures energy in [[Joules]]. Kilowatt-hour meter measures energy in [[kWh]].', zh: '' },
        { en: '1 kWh is equal to the energy used by an electrical appliance with power 1 kW in 1 hour: 1 kWh = 1 kW × 1 h = 1000 W × 3600 s = [[3.6 × 10⁶ J]]', zh: '1 度電（1 kWh）= 3.6 × 10⁶ J。' }
      ]));
      const box = html(`<div class="stack-sm"><div class="two">
          <div class="panel-soft stack-sm center"><div class="lbl">Joulemeter 焦耳計</div><div class="lcd jm" style="font-size:1.4rem">0 J</div></div>
          <div class="panel-soft stack-sm center"><div class="lbl">Kilowatt-hour meter 千瓦小時錶</div><div class="kwh-dials"></div><div class="small muted">kWh</div></div></div>
        <div class="km-r"></div><div class="readout small km-eq"></div></div>`);
      st.add(box);
      const dials = $('.kwh-dials', box);
      const setK = x => {
        const s = x.toFixed(1).padStart(6, '0');
        dials.innerHTML = s.split('').map(ch => ch === '.' ? '<span class="kd-dot">.</span>' : `<span class="kd">${ch}</span>`).join('');
        $('.jm', box).textContent = `${nf(round(x * 3.6e6, 0))} J`;
        $('.km-eq', box).innerHTML = `${nf(x)} kWh = ${nf(x)} × 3.6 × 10⁶ J = <b>${bigNum(round(x * 3.6e6, 0))} J</b>`;
      };
      $('.km-r', box).appendChild(rangeField({ id: 'km', label: '用咗幾多電能', min: 0, max: 5, step: 0.1, value: 1, fmt: v => `${nf(v)} kWh`, onInput: setK }));
      setK(1);
      st.add('<div class="lbl">單位換算挑戰</div>');
      st.add(quickRun([
        { q: '2 kWh = ? J', opts: ['7.2 × 10⁶ J', '7200 J', '2000 J', '3.6 × 10⁶ J'], ans: 0, why: '2 × 3.6 × 10⁶ = 7.2 × 10⁶ J' },
        { q: '3.6 × 10⁶ J = ? kWh', opts: ['1 kWh', '3.6 kWh', '1000 kWh', '0.001 kWh'], ans: 0, why: '1 kWh = 3.6 × 10⁶ J' },
        { q: '1.5 kW = ? W', opts: ['1500 W', '150 W', '15 W', '1.5 × 10⁶ W'], ans: 0, why: '1 kW = 10³ W' },
        { q: '2 MW = ? W', opts: ['2 × 10⁶ W', '2000 W', '2 × 10³ W', '2 × 10⁹ W'], ans: 0, why: '1 MW = 10⁶ W' },
        { q: '4 min = ? s', opts: ['240 s', '400 s', '4 s', '60 s'], ans: 0, why: '4 × 60 = 240 s' },
        { q: '0.5 kWh = ? J', opts: ['1.8 × 10⁶ J', '500 J', '1800 J', '3.6 × 10⁶ J'], ans: 0, why: '0.5 × 3.6 × 10⁶ = 1.8 × 10⁶ J' },
        { q: '1 h = ? s', opts: ['3600 s', '60 s', '1000 s', '360 s'], ans: 0, why: '60 × 60 = 3600 s' },
        { q: 'A kWh meter measures…', opts: ['energy', 'power', 'temperature', 'time'], ans: 0, why: 'kWh 係能量單位（kW × h），唔係功率！' }
      ], 5, () => st.complete()));
    }
  });
