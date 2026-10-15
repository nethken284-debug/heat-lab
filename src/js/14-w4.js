/* ============ World 4 · C · c · K · J — heat capacity & specific heat capacity (p.10–12) ============ */

Router.routes.w4 = main => worldPage(main, 'w4',
  sir('C、c、K、J 好似四兄弟：名似、樣似，但做嘢完全唔同。呢關用<b>格仔</b>同<b>遊戲</b>一次過拆穿佢哋，唔使死背公式。', 'wow'),
  add => {
    /* ---------- 1. identity cards ---------- */
    {
      const st = add(station({ world: 'w4', id: 'cards', tag: '1.2C · p.10–11', title: '四兄弟身份證', short: '身份證', goal: '翻晒 4 張卡' }));
      st.add('<p class="muted small">撳卡翻轉。顏色會跟住你成關：<b style="color:var(--qC)">C 粉紅</b>、<b style="color:var(--qc)">c 紫</b>、<b style="color:var(--qT)">K／ΔT 橙</b>、<b style="color:var(--qE)">J／E 金</b>、<b style="color:var(--qm)">m（kg）綠</b>。</p>');
      const cards = [
        { s: 'C', cls: 'vC', name: '熱容量 heat capacity', who: '講「一件物體」', back: `成件物體升 <b>1 °C</b> 要幾多 J。<br>${fx(`${V.C} = ${frac(V.E, V.dT)}`)}<br>單位：<b>J °C⁻¹</b>（= J K⁻¹）<br>取決於：<b>質量 + 物質</b><br><span class="dim">例：10 kg 金屬塊 C = 5000 J °C⁻¹</span>` },
        { s: 'c', cls: 'vc', name: '比熱容 specific heat capacity', who: '講「一種物質」', back: `<b>1 kg</b> 物質升 <b>1 °C</b> 要幾多 J。<br>${fx(`${V.c} = ${frac(V.E, `${V.m}${V.dT}`)}`)}<br>單位：<b>J kg⁻¹ °C⁻¹</b><br>同質量<b>無關</b>，只睇物質（同狀態）<br><span class="dim">例：水 4200、冰 2100</span>` },
        { s: 'K', cls: 'vT up', name: '開爾文 kelvin', who: '溫度的單位', back: `絕對溫標：<b>T<sub>K</sub> = T<sub>C</sub> + 273</b><br>0 K = 絕對零度<br>溫度<b>變化</b> 1 K = 1 °C<br>→ ΔT 用 K 或 °C 數字一樣<br>→ <b>J °C⁻¹ = J K⁻¹</b>` },
        { s: 'J', cls: 'vE up', name: '焦耳 joule', who: '能量的單位', back: `熱（Q 或 E）都係能量，用 <b>J</b> 量度。<br>E = mcΔT 計出嚟就係 J。<br>1 kJ = 1000 J<br>1 kWh = 3.6 × 10⁶ J<br>功率 1 W = 1 J s⁻¹` }
      ];
      const grid = html('<div class="flip-grid"></div>');
      const seen = new Set();
      cards.forEach((c, i) => {
        const b = html(`<button type="button" class="flip" aria-label="${c.name}"><div class="flip-in">
          <div class="flip-face"><div class="flip-sym ${c.cls.includes('up') ? 'up' : ''}" style="color:var(--q${c.s === 'C' ? 'C' : c.s === 'c' ? 'c' : c.s === 'K' ? 'T' : 'E'})">${c.s}</div><div class="flip-name">${c.name}</div><div class="small muted">${c.who}</div><div class="flip-tap">撳我翻轉 ↻</div></div>
          <div class="flip-face flip-back">${c.back}</div></div></button>`);
        b.onclick = () => { b.classList.toggle('on'); SFX.tick(); seen.add(i); if (seen.size === 4) st.complete(); };
        grid.appendChild(b);
      });
      st.add(grid);
      st.add(`<div class="panel-soft stack-sm"><b>大細楷陷阱</b>
        <div class="small"><b style="color:var(--qC)">大 C</b> 係成件物體的熱容量；<b style="color:var(--qc)">細 c</b> 係每 1 kg 物質的比熱容。寫錯大細楷，意思就錯晒。</div>
        <div class="small"><b style="color:var(--qT)">大 K</b> 係 kelvin（溫度單位）；<b>細 k</b> 係 kilo（× 1000）：k<b>g</b>、k<b>J</b>、k<b>W</b>、k<b>Wh</b>。</div></div>`);
      st.add(`<div class="panel-inset stack-sm"><b>一句過記住四兄弟的關係</b>
        <div class="fx-line">${fx(`${V.E} = ${V.C} ${V.dT}`)}<span class="muted">而</span>${fx(`${V.C} = ${V.m} ${V.c}`)}<span class="muted">所以</span>${fx(`${V.E} = ${V.m} ${V.c} ${V.dT}`)}</div>
        <div class="small muted">E 用 J；m 用 kg；ΔT 用 °C 或 K（數字一樣）；c 用 J kg⁻¹ °C⁻¹；C 用 J °C⁻¹。下一站用格仔睇點解。</div></div>`);
    }

    /* ---------- 2. the energy grid ---------- */
    {
      const st = add(station({ world: 'w4', id: 'grid', tag: '1.2C · p.10–11', title: '能量方格機：一格、一行、全部', short: '能量方格', goal: '試晒「一格 c」「一行 C」「全部 E」同加熱動畫，再答一題' }));
      st.add(enBox([
        { en: 'The <b>heat capacity</b> of a body is the amount of energy required to raise [[its temperature]] by 1 °C.', zh: 'C：成件物體升 1 °C 要的能量。' },
        { en: 'The <b>specific heat capacity</b> of a substance is the energy required to raise the temperature of [[1 kg]] of the substance by 1 °C.', zh: 'c：1 kg 物質升 1 °C 要的能量。' },
        { en: 'For a given substance, its heat capacity is the product of its mass m and its specific heat capacity c: [[C = mc]].', zh: 'C = m × c' }
      ]));
      st.add(`<div class="panel-soft small">想像能量係錢：<b style="color:var(--qc)">c</b> 就係「每 1 kg、每升 1 °C」的<b>單價</b>；<b style="color:var(--qC)">C</b> 係「呢件嘢成件升 1 °C」的價錢；<b style="color:var(--qE)">E</b> 就係最後張單總共幾多 <b>J</b>。</div>`);
      const box = html(`<div class="stack-sm">
        <div class="row eg-ctrl"><select id="eg-sub" aria-label="物質"></select><span class="lbl">m</span><span class="eg-m"></span><span class="lbl">ΔT</span><span class="eg-t"></span><span class="eg-u"></span></div>
        <div class="eg-wrap"><div class="eg-thermo"><svg viewBox="0 0 60 300" width="56" height="280" aria-hidden="true">
            <rect x="20" y="10" width="20" height="250" rx="10" fill="#1d1640" stroke="#cfc7f5" stroke-width="2"/><circle cx="30" cy="272" r="18" style="fill:var(--hot)"/>
            <rect class="eg-col" x="25" y="230" width="10" height="42" style="fill:var(--hot)"/>
            <text class="eg-t1 mono" x="30" y="8" text-anchor="middle" font-size="11" style="fill:var(--qT)"></text></svg>
            <div class="mono tiny center eg-t0"></div></div>
          <div class="eg-grid"></div></div>
        <div class="row eg-modes"><button type="button" class="btn sm" data-m="c" style="border-color:var(--qc)">一格 = c</button><button type="button" class="btn sm" data-m="C" style="border-color:var(--qC)">一行 = C</button><button type="button" class="btn sm" data-m="E" style="border-color:var(--qE)">全部 = E</button><button type="button" class="btn hot sm" data-m="heat">▶ 加熱動畫</button></div>
        <div class="panel-inset eg-explain"></div>
        <div class="work eg-formula"></div>
        <div class="eg-quiz"></div></div>`);
      st.add(box);
      const sel = $('#eg-sub', box);
      SUBSTANCES.filter(s => s.id !== 'steam').forEach(s => sel.appendChild(html(`<option value="${s.id}">${s.zh} ${s.en}（c = ${s.c}）</option>`)));
      sel.value = 'water';
      let sub = subById('water'), m = 3, dT = 4, unitK = false, mode = null, heating = false;
      const tried = new Set();
      const tU = () => unitK ? 'K' : '°C';
      const mS = stepper({ min: 1, max: 6, value: m, fmt: v => `${v} kg`, label: '質量', onChange: v => { m = v; build(); } });
      const tS = stepper({ min: 1, max: 8, value: dT, fmt: v => `${v} ${tU()}`, label: '溫度變化', onChange: v => { dT = v; build(); } });
      $('.eg-m', box).appendChild(mS); $('.eg-t', box).appendChild(tS);
      $('.eg-u', box).appendChild(seg([{ v: 'C', label: '°C' }, { v: 'K', label: 'K' }], 'C', v => { unitK = v === 'K'; tS.set(dT); build(); if (unitK) toast('格仔數目冇變！升 1 °C = 升 1 K', 'good'); }));
      sel.onchange = () => { sub = subById(sel.value); SFX.click(); build(); };
      const gridEl = $('.eg-grid', box), ex = $('.eg-explain', box), fm = $('.eg-formula', box);
      const T0 = 20;
      const thermo = rowsLit => {
        const k = rowsLit / 8; const h = 42 + k * 200;
        const col = $('.eg-col', box); col.setAttribute('y', 272 - h); col.setAttribute('height', h);
        const T = T0 + rowsLit;
        $('.eg-t1', box).textContent = unitK ? `${T + 273} K` : `${T} °C`;
        $('.eg-t0', box).textContent = unitK ? `開始 ${T0 + 273} K` : `開始 ${T0} °C`;
      };
      function build() {
        heating = false;
        gridEl.style.gridTemplateColumns = `3.6em repeat(${m}, minmax(0, 1fr))`;
        gridEl.innerHTML = '';
        for (let r = dT; r >= 1; r--) {
          gridEl.appendChild(html(`<div class="eg-rowlab">+1 ${tU()}</div>`));
          for (let k = 1; k <= m; k++) gridEl.appendChild(html(`<div class="eg-cell" data-r="${r}" data-k="${k}">${sub.c}</div>`));
        }
        gridEl.appendChild(html('<div></div>'));
        for (let k = 1; k <= m; k++) gridEl.appendChild(html(`<div class="eg-collab">1 kg</div>`));
        thermo(0);
        formula();
        applyMode();
      }
      function formula() {
        const C = m * sub.c, E = C * dT, u = tU();
        fm.innerHTML = `<div class="ln">${V.c} = ${sub.c} J kg⁻¹ ${u}⁻¹ <span class="note">（${sub.zh}，一格）</span></div>
          <div class="ln">${V.C} = ${V.m} × ${V.c} = ${m} × ${sub.c} = <b>${nf(C)} J ${u}⁻¹</b> <span class="note">（一行）</span></div>
          <div class="ln">${V.E} = ${V.C} × ${V.dT} = ${nf(C)} × ${dT} = <b style="color:var(--qE)">${nf(E)} J</b> <span class="note">（全部 ${m * dT} 格）</span></div>
          <div class="ln note">單位：<span class="cancel">kg</span> × J <span class="cancel">kg⁻¹</span> <span class="cancel">${u}⁻¹</span> × <span class="cancel">${u}</span> = J（kg 同 kg⁻¹ 抵銷、${u} 同 ${u}⁻¹ 抵銷，淨低 J）</div>`;
      }
      function applyMode() {
        const cells = $$('.eg-cell', gridEl);
        cells.forEach(c => c.classList.remove('focus-c', 'focus-C', 'focus-E', 'faded', 'lit'));
        const C = m * sub.c, E = C * dT, u = tU();
        if (mode === 'c') {
          cells.forEach(c => (c.dataset.r === '1' && c.dataset.k === '1') ? c.classList.add('focus-c') : c.classList.add('faded'));
          ex.innerHTML = `<b style="color:var(--qc)">一格 = c = ${sub.c} J</b>：<b>1 kg</b> 的${sub.zh}升 <b>1 ${u}</b> 要的能量。<br>單位 J kg⁻¹ ${u}⁻¹ 讀做「每 kg、每 ${u} 幾多 J」。<br>試吓改 m：格仔多咗，但<b>每一格的數字唔變</b> → c 同質量無關，只同物質有關。`;
        } else if (mode === 'C') {
          cells.forEach(c => c.dataset.r === '1' ? c.classList.add('focus-C') : c.classList.add('faded'));
          ex.innerHTML = `<b style="color:var(--qC)">一行 = C = m × c = ${m} × ${sub.c} = ${nf(C)} J ${u}⁻¹</b>：成件 ${m} kg 的${sub.zh}升 <b>1 ${u}</b> 要的能量。<br>m 越大，行越長 → <b>C 越大</b>；換物質，每格數字變 → C 都變。所以 C 取決於<b>質量同物質</b>。`;
        } else if (mode === 'E') {
          cells.forEach(c => c.classList.add('focus-E'));
          ex.innerHTML = `<b style="color:var(--qE)">全部 = E = C × ΔT = ${nf(C)} × ${dT} = ${nf(E)} J</b>：成件物體升 ${dT} ${u}（${dT} 行）要的總能量。<br>所以 ${fx(`${V.E} = ${V.C}${V.dT} = ${V.m}${V.c}${V.dT}`)}`;
        } else {
          ex.innerHTML = '撳上面四個掣：<b>一格</b>、<b>一行</b>、<b>全部</b>，再睇<b>加熱動畫</b>。';
        }
      }
      $$('[data-m]', box).forEach(b => b.onclick = () => {
        SFX.click();
        const v = b.dataset.m;
        if (v === 'heat') { heat(); return; }
        mode = v; tried.add(v); applyMode(); checkDone();
      });
      const heat = () => {
        build(); mode = null; applyMode(); heating = true;
        const cells = $$('.eg-cell', gridEl).sort((a, b) => (a.dataset.r - b.dataset.r) || (a.dataset.k - b.dataset.k));
        const step = Math.max(45, Math.min(140, 3200 / cells.length));
        let i = 0, E = 0;
        const u = tU();
        const tickOne = () => {
          if (!heating) return;
          if (i >= cells.length) {
            heating = false; tried.add('heat'); SFX.good();
            ex.innerHTML = `加熱完成：${m * dT} 格 × ${sub.c} J = <b style="color:var(--qE)">${nf(E)} J</b>。溫度由 ${unitK ? T0 + 273 + ' K' : T0 + ' °C'} 升到 ${unitK ? T0 + dT + 273 + ' K' : T0 + dT + ' °C'}（ΔT = ${dT} ${u}）。`;
            checkDone(); return;
          }
          const c = cells[i++]; c.classList.add('lit'); E += sub.c; SFX.tick();
          const rowsDone = Math.floor(i / m);
          thermo(rowsDone);
          ex.innerHTML = `加熱中……已用 <b style="color:var(--qE)">${nf(E)} J</b>（${i} 格）　溫度升咗 ${rowsDone} ${u}`;
          later(step, tickOne);
        };
        tickOne();
      };
      const checkDone = () => {
        if (!(tried.has('c') && tried.has('C') && tried.has('E') && tried.has('heat'))) return;
        const qz = $('.eg-quiz', box);
        if (qz.childElementCount) return;
        qz.appendChild(mcq({ q: 'If the mass of the body is doubled (same substance), what happens to C and c?', zh: '同一種物質，質量變兩倍，C 同 c 會點？', options: ['C doubles; c stays the same', 'C stays the same; c doubles', 'both double', 'both stay the same'], answer: 0,
          explain: '格仔多咗一倍 → 一行（C）長咗一倍；但每一格（c）數字唔變。', onDone: () => st.complete() }));
      };
      build();
    }

    /* ---------- 3. unit decoder & builder ---------- */
    {
      const st = add(station({ world: 'w4', id: 'units', tag: '1.2C · p.10–11', title: '單位解碼器', short: '單位解碼', goal: '砌啱 E、C、c、P 四個單位' }));
      st.add(enBox([
        { en: 'The unit of heat capacity is [[J °C⁻¹]] or J K⁻¹.', zh: '' },
        { en: 'The unit of specific heat capacity is [[J kg⁻¹ °C⁻¹]] or J kg⁻¹ K⁻¹.', zh: '' }
      ]));
      const dec = html(`<div class="panel-inset stack-sm"><div class="lbl">撳每一塊睇佢講乜</div>
        <div class="row unit-tiles"><button type="button" class="unit-t" data-u="J" style="border-color:var(--qE)">J</button><button type="button" class="unit-t" data-u="kg" style="border-color:var(--qm)">kg⁻¹</button><button type="button" class="unit-t" data-u="C" style="border-color:var(--qT)">°C⁻¹</button><span class="muted">→</span><b style="color:var(--qc)">c 的單位</b></div>
        <div class="small unit-say" style="min-height:3em">⁻¹ 即係「除」或者「每」。</div></div>`);
      const say = $('.unit-say', dec);
      const meaning = { J: '<b style="color:var(--qE)">J</b>：能量（焦耳）。', kg: '<b style="color:var(--qm)">kg⁻¹</b>：「每 1 kg」＝除以質量 m。', C: '<b style="color:var(--qT)">°C⁻¹</b>：「每升 1 °C」＝除以溫度變化 ΔT（寫 K⁻¹ 都一樣）。' };
      const got = new Set();
      $$('.unit-t', dec).forEach(b => b.onclick = () => {
        SFX.tick(); got.add(b.dataset.u); b.classList.add('on');
        say.innerHTML = meaning[b.dataset.u] + (got.size === 3 ? `<br>合埋：<b>J kg⁻¹ °C⁻¹ = J ÷ kg ÷ °C</b> ＝「每 kg、每 °C 要幾多 J」＝ ${fx(`${V.c} = ${frac(V.E, `${V.m}${V.dT}`)}`)} 的意思！` : '');
      });
      st.add(dec);
      /* builder */
      const targets = [
        { q: '能量 E（熱 Q）', top: ['J'], bot: [], show: 'J' },
        { q: '熱容量 C', top: ['J'], bot: ['T'], show: 'J °C⁻¹' },
        { q: '比熱容 c', top: ['J'], bot: ['kg', 'T'], show: 'J kg⁻¹ °C⁻¹' },
        { q: '功率 P', top: ['J'], bot: ['s'], show: 'J s⁻¹（= W）' }
      ];
      const tokens = [{ id: 'J', t: 'J' }, { id: 'kg', t: 'kg' }, { id: 'C', t: '°C' }, { id: 'K', t: 'K' }, { id: 's', t: 's' }];
      const bl = html(`<div class="panel-soft stack-sm"><div class="row-between"><b class="ub-q"></b><span class="score-pill ub-n"></span></div>
        <div class="small muted">撳單位：第一下放「上面（乘）」，第二下放「下面（除）」，第三下拎走。</div>
        <div class="row ub-tok"></div>
        <div class="ub-frac"><div class="ub-top"></div><div class="ub-bar"></div><div class="ub-bot"></div></div>
        <div class="row"><span class="small">寫出嚟：<b class="mono ub-str">—</b></span></div>
        <div class="row"><button type="button" class="btn sm cold" data-chk>檢查</button><span class="small ub-fb"></span></div></div>`);
      st.add(bl);
      let ti = 0, place = {};
      const unitStr = () => {
        const top = tokens.filter(t => place[t.id] === 'top').map(t => t.t), bot = tokens.filter(t => place[t.id] === 'bot').map(t => t.t + '⁻¹');
        return top.concat(bot).join(' ') || '—';
      };
      const draw = () => {
        const tg = targets[ti];
        $('.ub-q', bl).textContent = `砌出：${tg.q} 的單位`; $('.ub-n', bl).textContent = `${ti + 1} / ${targets.length}`;
        const tk = $('.ub-tok', bl); tk.innerHTML = '';
        tokens.forEach(t => { const b = html(`<button type="button" class="chip ${place[t.id] ? 'sel' : ''}">${t.t}${place[t.id] === 'top' ? ' ↑' : place[t.id] === 'bot' ? ' ↓' : ''}</button>`); b.onclick = () => { place[t.id] = !place[t.id] ? 'top' : place[t.id] === 'top' ? 'bot' : undefined; SFX.tick(); draw(); }; tk.appendChild(b); });
        $('.ub-top', bl).textContent = tokens.filter(t => place[t.id] === 'top').map(t => t.t).join(' × ') || '?';
        $('.ub-bot', bl).textContent = tokens.filter(t => place[t.id] === 'bot').map(t => t.t).join(' × ') || '1';
        $('.ub-str', bl).textContent = unitStr();
      };
      $('[data-chk]', bl).onclick = () => {
        const tg = targets[ti];
        const top = tokens.filter(t => place[t.id] === 'top').map(t => t.id).sort().join(), bot = tokens.filter(t => place[t.id] === 'bot').map(t => t.id === 'K' || t.id === 'C' ? 'T' : t.id).sort().join();
        const both = place.K && place.C;
        const ok = !both && top === tg.top.slice().sort().join() && bot === tg.bot.slice().sort().join();
        const fb = $('.ub-fb', bl);
        if (ok) {
          SFX.good(); fb.innerHTML = `<span class="good">啱！${tg.q}：${tg.show}</span>`;
          later(900, () => { ti++; place = {}; fb.innerHTML = ''; if (ti >= targets.length) { bl.replaceChildren(html('<div class="feedback ok pop"><div class="fb-title">四個單位全部砌啱！</div>E：J　C：J °C⁻¹　c：J kg⁻¹ °C⁻¹　P：J s⁻¹ = W</div>')); st.complete(); } else draw(); });
        } else {
          SFX.bad();
          fb.innerHTML = both ? '<span class="bad">°C 同 K 揀一個就夠（佢哋代表同一樣嘢）。</span>' : `<span class="bad">唔啱。</span><span class="muted"> 提示：${tg.q} = ${tg.q.includes('c') && tg.q.includes('比') ? 'E ÷ (m ΔT)' : tg.q.includes('C') ? 'E ÷ ΔT' : tg.q.includes('P') ? 'E ÷ t' : '能量本身'}</span>`;
        }
      };
      draw();
    }

    /* ---------- 4. same energy, different substances ---------- */
    {
      const st = add(station({ world: 'w4', id: 'same', tag: '1.2C · p.11 · 比熱容表', title: '同一份能量：邊個升溫最多？', short: '同一份能量', goal: '玩吓能量滑桿，再完成填充' }));
      st.add(enBox([{ en: 'Specific heat capacity of a substance is [[independent of its mass]].', zh: '比熱容同質量無關。' }]));
      const box = html(`<div class="stack-sm">
        <div class="two"><div class="se-e"></div><div class="se-m"></div></div>
        <div class="row"><span class="se-mode"></span></div>
        <div class="se-bars stack-sm"></div>
        <div class="small muted">每條 bar 係 ΔT = E ÷ (m c)。課本比熱容表（J kg⁻¹ °C⁻¹）：c 越大，bar 越短。</div></div>`);
      st.add(box);
      let E = 4200, m = 1, cool = false;
      const bars = $('.se-bars', box);
      const list = SUBSTANCES.slice().sort((a, b) => a.c - b.c);
      list.forEach(s => bars.appendChild(html(`<div class="se-row" data-id="${s.id}"><span class="se-name">${s.zh} <span class="dim">${s.en}</span></span><span class="se-c mono">${s.c}</span><span class="se-track"><i></i></span><b class="se-v mono"></b></div>`)));
      const paint = () => {
        list.forEach(s => {
          const d = E / (m * s.c);
          const row = $(`[data-id="${s.id}"]`, bars);
          $('i', row).style.width = `${Math.min(100, d / 40 * 100)}%`;
          $('i', row).style.background = cool ? 'linear-gradient(90deg, var(--cool), var(--cold))' : 'linear-gradient(90deg, var(--warm), var(--hot))';
          $('.se-v', row).textContent = `${cool ? '−' : '+'}${nf(round(d, d < 10 ? 2 : 1))} °C${d > 40 ? ' ⟶' : ''}`;
          row.classList.toggle('hl', s.id === 'water');
        });
      };
      $('.se-e', box).appendChild(rangeField({ id: 'se-e', label: '能量 E（每樣物質一樣多）', min: 0, max: 20000, step: 200, value: 4200, fmt: v => `${nf(v)} J`, onInput: v => { E = v; paint(); } }));
      $('.se-m', box).appendChild(rangeField({ id: 'se-m', label: '每樣物質的質量 m', min: 0.5, max: 2, step: 0.5, value: 1, fmt: v => `${nf(v)} kg`, onInput: v => { m = v; paint(); }, cls: 'cold' }));
      $('.se-mode', box).appendChild(seg([{ v: 'h', label: '吸收能量（升溫）' }, { v: 'c', label: '放出能量（降溫）' }], 'h', v => { cool = v === 'c'; paint(); }));
      paint();
      st.add(sir('E = 4200 J、m = 1 kg 時：水只係升 <b>1 °C</b>，銅升 <b>10.8 °C</b>，鉛升成 <b>32 °C</b>！水「好難熱」，因為 c 最大。', 'think'));
      st.add(fillIn({ text: 'A substance with higher specific heat capacity will need {{more}} energy to increase its temperature by 1 °C, and release {{more}} energy when its temperature drops by 1 °C (for the same mass).', bank: ['more', 'less'], onDone: () => st.complete() }));
    }

    /* ---------- 5. C or c? ---------- */
    {
      const st = add(station({ world: 'w4', id: 'sort', tag: '1.2C · 分類遊戲', title: 'C 定 c？快速分類', short: 'C 定 c', goal: '12 句答啱 10 句' }));
      const items = [
        ['Depends on the mass of the body', 'C', '加質量 → C 變大。'],
        ['Independent of mass', 'c', 'c 只睇物質。'],
        ['Unit: J °C⁻¹', 'C', 'C = E ÷ ΔT。'],
        ['Unit: J kg⁻¹ K⁻¹', 'c', 'c = E ÷ (mΔT)。'],
        ['Energy to raise 1 kg of the substance by 1 °C', 'c', '有「1 kg」就係 c。'],
        ['Energy to raise the whole body by 1 °C', 'C', '成件物體 → C。'],
        ['A 10 kg metal block: 5 000 J °C⁻¹', 'C', 'Classwork 5：講一件物體。'],
        ['Water: 4200 J kg⁻¹ °C⁻¹', 'c', '水的比熱容。'],
        ['Same value for 1 kg and 2 kg of water', 'c', '同質量無關。'],
        ['A can of cola: 1200 J °C⁻¹', 'C', 'Classwork 5：一罐可樂（一件物體）。'],
        ['= m × c', 'C', 'C = mc。'],
        ['= C ÷ m', 'c', 'c = C / m。']
      ];
      const el = html('<div class="panel-inset stack-sm"></div>');
      st.add(el);
      const run = () => {
        const list = shuffle(items); let i = 0, right = 0;
        const one = () => {
          if (i >= list.length) {
            const ok = right >= 10;
            el.replaceChildren(html(`<div class="stack-sm center"><div class="result-big ${ok ? 'good' : 'bad'}">${right} / 12</div><div>${ok ? '分得好清楚！' : '要 10 句或以上，再嚟！'}</div><div class="row" style="justify-content:center"><button type="button" class="btn sm" data-r>再玩</button></div></div>`));
            $('[data-r]', el).onclick = () => { SFX.click(); run(); };
            if (ok) st.complete();
            return;
          }
          const [txt, ans, why] = list[i];
          const card = html(`<div class="stack-sm"><div class="row-between"><span class="score-pill">${i + 1} / 12</span><span class="score-pill">答啱 ${right}</span></div>
            <div class="sort-card pop">${txt}</div>
            <div class="row" style="justify-content:center"><button type="button" class="btn lg sort-b" data-v="C" style="border-color:var(--qC)"><span class="v vC" style="font-size:1.6rem">C</span> 熱容量</button><button type="button" class="btn lg sort-b" data-v="c" style="border-color:var(--qc)"><span class="v vc" style="font-size:1.6rem">c</span> 比熱容</button></div>
            <div class="center small fbw" style="min-height:1.6em"></div></div>`);
          $$('[data-v]', card).forEach(b => b.onclick = () => {
            $$('[data-v]', card).forEach(x => x.disabled = true);
            const ok = b.dataset.v === ans; if (ok) { right++; SFX.good(); } else SFX.bad();
            $('.fbw', card).innerHTML = `<span class="${ok ? 'good' : 'bad'}">${ok ? '啱！' : `唔啱，係 ${ans}。`}</span> <span class="muted">${why}</span>`;
            later(ok ? 700 : 1500, () => { i++; one(); });
          });
          el.replaceChildren(card);
        };
        one();
      };
      run();
    }

    /* ---------- 6. solver coach ---------- */
    {
      const st = add(station({ world: 'w4', id: 'coach', tag: '1.2C · p.10–12 · Classwork 5–7', title: '解題教練：一步一步計', short: '解題教練', goal: '用教練解決 4 題課本題目' }));
      st.add(sir('計數三步曲：<b>① 抄已知數（轉好單位）→ ② 揀公式 → ③ 代入計</b>。教練會捉你常犯的陷阱：g 唔轉 kg、ΔT 用錯、分鐘唔轉秒。', 'think'));
      const fE = [fx(`${V.E} = ${V.C}${V.dT}`), fx(`${V.E} = ${V.m}${V.c}${V.dT}`), fx(`${V.P} = ${frac(V.E, V.t)}`), fx(`${V.C} = ${V.m}${V.c}`)];
      const K = (sym, val, unit, extra = {}) => Object.assign({ sym, val, unit }, extra);
      const dTtrap = (a, b) => [{ v: a, msg: 'ΔT 係溫度「變化」：終溫 − 初溫。' }, { v: b, msg: 'ΔT 係溫度「變化」：終溫 − 初溫。' }];
      const probs = [
        { id: 'cw5a', title: 'CW5 Q1', q: 'The heat capacity of a 10 kg metal block is 5 000 J °C⁻¹. Find the energy required to raise the temperature of the block by 20 °C.', zh: '已經畀咗 C（成件物體），10 kg 呢個資料用唔著。',
          steps: [{ kind: 'knowns', label: '① 已知數', items: [K(V.C, 5000, 'J °C⁻¹', { traps: [{ v: 500, msg: '唔使除 10 kg，題目畀嘅已經係成件的 C。' }] }), K(V.dT, 20, '°C')] },
            { kind: 'formula', label: '② 揀公式', options: fE, answer: 0 }, { kind: 'calc', label: '③ 計 E', unit: 'J', val: 100000, traps: [{ v: 1e6, msg: '唔使再乘 10 kg！' }] }],
          work: ['E = C ΔT', '= 5000 × 20', '= 100 000 J（1 × 10⁵ J）'] },
        { id: 'cw5b', title: 'CW5 Q2', q: 'A can of cola is placed in a freezer. How much energy must be removed to cool it down from 25 °C to 5 °C? The heat capacity of a can of cola is 1200 J °C⁻¹.', zh: '降溫一樣用 E = CΔT。',
          steps: [{ kind: 'knowns', label: '① 已知數', items: [K(V.C, 1200, 'J °C⁻¹'), K(V.dT, 20, '°C', { traps: dTtrap(5, 25), hint: '25 − 5' })] },
            { kind: 'formula', label: '② 揀公式', options: fE, answer: 0 }, { kind: 'calc', label: '③ 計 E', unit: 'J', val: 24000 }],
          work: ['E = C ΔT', '= 1200 × (25 − 5)', '= 24 000 J'] },
        { id: 'cw6a', title: 'CW6 銅', q: 'Increasing the temperature of a 2 kg copper block from 20 °C to 100 °C. How much energy is needed? (c of copper = 390 J kg⁻¹ °C⁻¹)', zh: '',
          steps: [{ kind: 'knowns', label: '① 已知數', items: [K(V.m, 2, 'kg'), K(V.c, 390, 'J kg⁻¹ °C⁻¹', { hint: '查表 copper' }), K(V.dT, 80, '°C', { traps: dTtrap(100, 20) })] },
            { kind: 'formula', label: '② 揀公式', options: fE, answer: 1 }, { kind: 'calc', label: '③ 計 E', unit: 'J', val: 62400 }],
          work: ['E = m c ΔT', '= 2 × 390 × (100 − 20)', '= 62 400 J'] },
        { id: 'cw6b', title: 'CW6 水', q: 'Increasing the temperature of 500 g of water from 25 °C to 80 °C. How much energy is needed? (c of water = 4200 J kg⁻¹ °C⁻¹)', zh: '小心：500 g 要轉做 kg。',
          steps: [{ kind: 'knowns', label: '① 已知數', items: [K(V.m, 0.5, 'kg', { traps: [{ v: 500, msg: '500 g = 0.5 kg！' }] }), K(V.c, 4200, 'J kg⁻¹ °C⁻¹'), K(V.dT, 55, '°C', { traps: dTtrap(80, 25) })] },
            { kind: 'formula', label: '② 揀公式', options: fE, answer: 1 }, { kind: 'calc', label: '③ 計 E', unit: 'J', val: 115500, traps: [{ v: 115500000, msg: '質量要用 kg！' }] }],
          work: ['E = m c ΔT', '= 0.5 × 4200 × (80 − 25)', '= 115 500 J'] },
        { id: 'cw6c', title: 'CW6 冰', q: 'Increasing the temperature of 300 g of ice from −20 °C to 0 °C. How much energy is needed? (c of ice = 2100 J kg⁻¹ °C⁻¹)', zh: 'ΔT = 0 − (−20)。',
          steps: [{ kind: 'knowns', label: '① 已知數', items: [K(V.m, 0.3, 'kg', { traps: [{ v: 300, msg: '300 g = 0.3 kg！' }] }), K(V.c, 2100, 'J kg⁻¹ °C⁻¹', { traps: [{ v: 4200, msg: '係冰唔係水！冰 = 2100。' }] }), K(V.dT, 20, '°C', { traps: [{ v: -20, msg: 'ΔT = 0 − (−20) = 20。' }, { v: 0, msg: 'ΔT = 0 − (−20) = 20。' }] })] },
            { kind: 'formula', label: '② 揀公式', options: fE, answer: 1 }, { kind: 'calc', label: '③ 計 E', unit: 'J', val: 12600 }],
          work: ['E = m c ΔT', '= 0.3 × 2100 × (0 − (−20))', '= 12 600 J'] },
        { id: 'cw6d', title: 'CW6 鋁', q: 'Increasing the temperature of a 2 kg aluminium block from 15 °C to 200 °C. How much energy is needed? (c of aluminium = 900 J kg⁻¹ °C⁻¹)', zh: '',
          steps: [{ kind: 'knowns', label: '① 已知數', items: [K(V.m, 2, 'kg'), K(V.c, 900, 'J kg⁻¹ °C⁻¹'), K(V.dT, 185, '°C', { traps: dTtrap(200, 15) })] },
            { kind: 'formula', label: '② 揀公式', options: fE, answer: 1 }, { kind: 'calc', label: '③ 計 E', unit: 'J', val: 333000 }],
          work: ['E = m c ΔT', '= 2 × 900 × (200 − 15)', '= 333 000 J'] },
        { id: 'cw7b', title: 'CW7 Q2', q: 'If 180 000 J of energy is transferred to 3 kg of water whose original temperature is 20 °C, what is the final temperature of the water? (c of water = 4200 J kg⁻¹ °C⁻¹)', zh: '先計 ΔT，再加返初溫。',
          steps: [{ kind: 'knowns', label: '① 已知數', items: [K(V.E, 180000, 'J'), K(V.m, 3, 'kg'), K(V.c, 4200, 'J kg⁻¹ °C⁻¹')] },
            { kind: 'formula', label: '② 揀公式', options: fE, answer: 1 },
            { kind: 'calc', label: '③ 計 ΔT = E ÷ (mc)', unit: '°C', val: 14.2857, rel: 0, abs: 0.06 },
            { kind: 'calc', label: '④ 終溫 = 初溫 + ΔT', unit: '°C', val: 34.2857, rel: 0, abs: 0.06, traps: [{ v: 14.29, msg: '要加返初溫 20 °C！' }] }],
          work: ['ΔT = E ÷ (mc) = 180 000 ÷ (3 × 4200) = 14.3 °C', 'final temperature = 20 + 14.3 = 34.3 °C'] },
        { id: 'cw7c', title: 'CW7 Q3', q: 'An immersion heater takes 4 minutes to raise the temperature of 0.5 kg of water by 50 °C. Calculate the power of the heater. (c of water = 4200 J kg⁻¹ °C⁻¹)', zh: '兩步：先 E，再 P。',
          steps: [{ kind: 'knowns', label: '① 已知數', items: [K(V.m, 0.5, 'kg'), K(V.c, 4200, 'J kg⁻¹ °C⁻¹'), K(V.dT, 50, '°C'), K(V.t, 240, 's', { traps: [{ v: 4, msg: '4 分鐘 = 240 s！' }] })] },
            { kind: 'calc', label: '② 先計 E = mcΔT', unit: 'J', val: 105000 },
            { kind: 'formula', label: '③ 再揀公式計功率', options: fE, answer: 2 },
            { kind: 'calc', label: '④ 計 P', unit: 'W', val: 437.5, traps: [{ v: 26250, msg: 't 要用秒（240 s）！' }] }],
          work: ['E = m c ΔT = 0.5 × 4200 × 50 = 105 000 J', 'P = E ÷ t = 105 000 ÷ 240 = 437.5 W'] },
        { id: 'cw7d', title: 'CW7 Q4', q: 'An electric rice-cooker of power 1.1 kW contains 1 kg of water. How long would it take for the cooker to raise the temperature of the water from 25 °C to 100 °C? (c of water = 4200 J kg⁻¹ °C⁻¹)', zh: 't = E ÷ P',
          steps: [{ kind: 'knowns', label: '① 已知數', items: [K(V.P, 1100, 'W', { traps: [{ v: 1.1, msg: '1.1 kW = 1100 W！' }] }), K(V.m, 1, 'kg'), K(V.dT, 75, '°C', { traps: dTtrap(100, 25) })] },
            { kind: 'calc', label: '② 計 E = mcΔT', unit: 'J', val: 315000 },
            { kind: 'calc', label: '③ 計 t = E ÷ P', unit: 's', val: 286.36, rel: 0.004, traps: [{ v: 286363.6, msg: 'P 要用 W（1100 W）！' }] }],
          work: ['E = 1 × 4200 × (100 − 25) = 315 000 J', 't = E ÷ P = 315 000 ÷ 1100 ≈ 286 s', '實際時間會更長：energy is lost to the surrounding air and absorbed by the container（energy supplied by cooker > energy absorbed by water）。'] }
      ];
      st.add(coachSet(probs, 4, () => st.complete(), 'w4'));
      st.add('<div class="lbl">Classwork 7 Q1（概念題）</div>');
      st.add(mcq({ q: 'Which of the following pairs of objects have different specific heat capacities?', options: ['1 kg of water and 2 kg of water', '1 kg of liquid naphthalene and 1 kg of solid naphthalene', 'a rectangular block of aluminium of mass 1 kg and a cylindrical block of aluminium of mass 1 kg', '1 kg of oil in a glass container and 1 kg of oil in a metal container', '1 kg of water at 15 °C and 1 kg of water at 30 °C'], answer: 1,
        explain: 'c 只取決於物質同佢的<b>狀態</b>（好似 ice 2100、water 4200）。質量、形狀、容器、溫度都唔會改變 c。' }));
    }
  });
