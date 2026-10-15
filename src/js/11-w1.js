/* ============ World 1 · Temperature & temperature scales (p.3–5) ============ */

/* true/false card run, reused by several worlds */
function tfCards(list, onDone) {
  const el = html('<div class="stack-sm"><div class="row-between"><span class="score-pill tf-n"></span></div><div class="tf-slot"></div></div>');
  let i = 0, right = 0;
  const slot = $('.tf-slot', el), n = $('.tf-n', el);
  const show = () => {
    n.textContent = `第 ${i + 1} / ${list.length} 句`;
    const it = list[i];
    const card = html(`<div class="panel-soft stack-sm pop">
      <div class="q-text">${it.en}</div>${it.zh ? `<div class="q-zh">${it.zh}</div>` : ''}
      <div class="row"><button type="button" class="btn cold" data-v="1">✓ 啱 True</button><button type="button" class="btn hot" data-v="0">✗ 錯 False</button></div>
      <div class="fbw"></div></div>`);
    $$('[data-v]', card).forEach(b => b.onclick = () => {
      const ok = (b.dataset.v === '1') === it.ans;
      $$('[data-v]', card).forEach(x => x.disabled = true);
      if (ok) { right++; SFX.good(); } else SFX.bad();
      $('.fbw', card).replaceChildren(html(`<div class="feedback ${ok ? 'ok' : 'no'}"><div class="fb-title">${ok ? '答啱！' : '唔啱'}（答案：${it.ans ? 'True' : 'False'}）</div>${it.why || ''}</div>`));
      const nb = html(`<div class="row"><button type="button" class="btn sm">${i < list.length - 1 ? '下一句 →' : '完成'}</button></div>`);
      $('button', nb).onclick = () => { SFX.click(); i++; if (i < list.length) show(); else { slot.replaceChildren(html(`<div class="feedback ok pop"><div class="fb-title">完成！答啱 ${right} / ${list.length}</div>${right < list.length ? '答錯嘅可以再撳「再玩」重溫。' : '全部正確，好嘢！'}<div class="row" style="margin-top:8px"><button type="button" class="btn sm ghost" data-again>再玩</button></div></div>`)); $('[data-again]', slot).onclick = () => { i = 0; right = 0; show(); }; onDone && onDone(right, list.length); } };
      card.appendChild(nb);
    });
    slot.replaceChildren(card);
  };
  show();
  return el;
}

/* icons for everyday temperatures (textbook figure p.3) */
const TICON = {
  freezer: '<rect x="6" y="18" width="36" height="22" rx="3"/><path d="M6 24h36"/><path d="M24 28v10M19.5 30.5l9 5M28.5 30.5l-9 5"/>',
  snow: '<path d="M12 26a8 8 0 0 1 3-15 10 10 0 0 1 19 3 6 6 0 0 1 1 12z"/><path d="M15 33v2M24 35v2M33 33v2M19 40v2M29 40v2"/>',
  room: '<path d="M8 22v14h32V22"/><path d="M12 22v-6h24v6"/><path d="M8 26h32M11 36v4M37 36v4"/>',
  fever: '<circle cx="22" cy="24" r="13"/><path d="M17 21h.1M27 21h.1"/><path d="M24 30l18-4"/><circle cx="42" cy="26" r="2.5"/>',
  bath: '<path d="M6 24h36v6a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8z"/><path d="M12 24V12a4 4 0 0 1 8 0"/><circle cx="28" cy="16" r="2.5"/><circle cx="34" cy="12" r="2"/>',
  desert: '<circle cx="35" cy="12" r="5"/><path d="M18 40V18a3 3 0 0 1 6 0v22M18 28h-4v-6M24 26h4v-5"/><path d="M6 40h36"/>',
  boil: '<path d="M10 22h28v12a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6z"/><path d="M6 22h36"/><path d="M18 16q-2-3 0-6M24 16q-2-3 0-6M30 16q-2-3 0-6"/>',
  iron: '<path d="M8 34h32a0 0 0 0 0 0 0c0-8-6-14-16-14H14z"/><path d="M18 20v-5h14"/><path d="M8 38h32"/>',
  solder: '<path d="M8 40l14-14"/><rect x="20" y="13" width="18" height="9" rx="3" transform="rotate(-45 29 17.5)"/><path d="M36 10c4-2 6 2 6 6"/>',
  oven: '<rect x="6" y="10" width="36" height="30" rx="3"/><rect x="11" y="18" width="20" height="16" rx="2"/><path d="M36 18v.1M36 25v.1M6 15h36"/>',
  hotplate: '<rect x="6" y="30" width="36" height="10" rx="3"/><circle cx="24" cy="24" r="10"/><path d="M24 24a3 3 0 1 1 3 3 6 6 0 1 1-6-6"/>',
  bulb: '<path d="M17 30a11 11 0 1 1 14 0v4H17z"/><path d="M18 38h12M20 42h8"/><path d="M21 26l3-5 3 5"/>'
};
const LADDER = [
  { id: 'freezer', zh: '雪糕冷凍櫃', en: 'freezer', T: -25 },
  { id: 'snow', zh: '下雪天', en: 'snowing', T: -10 },
  { id: 'room', zh: '客廳', en: 'living room', T: 24 },
  { id: 'fever', zh: '發燒', en: 'fever', T: 38 },
  { id: 'bath', zh: '浸浴熱水', en: 'bath', T: 45 },
  { id: 'desert', zh: '日間沙漠', en: 'desert (daytime)', T: 56 },
  { id: 'boil', zh: '沸水', en: 'boiling water', T: 100 },
  { id: 'iron', zh: '熨斗', en: 'iron', T: 150 },
  { id: 'solder', zh: '焊鐵', en: 'soldering iron', T: 250 },
  { id: 'oven', zh: '焗爐', en: 'oven', T: 300 },
  { id: 'hotplate', zh: '電熱板', en: 'hot plate', T: 500 },
  { id: 'bulb', zh: '燈泡', en: 'light bulb', T: 2000 }
];
const ticon = (id, color = 'var(--text)') => `<svg viewBox="0 0 48 48" aria-hidden="true" style="fill:none;stroke:${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${TICON[id]}</svg>`;
const tLabel = T => T >= 2000 ? '> 2000 °C' : `約 ${nf(T)} °C`;

Router.routes.w1 = main => worldPage(main, 'w1',
  sir('第 1 關：先搞清楚<b>溫度</b>係乜、點樣定<b>溫標</b>。第一個實驗好簡單——你隻手指，原來會呃你。', 'wow'),
  add => {
    /* ---------- 1. finger experiment ---------- */
    {
      const st = add(station({ world: 'w1', id: 'finger', tag: '1.1A · p.3 · Activity', title: '手指實驗：你隻手指會呃人？', short: '手指實驗', goal: '做完實驗，再完成結論填充' }));
      const finger = (id, label) => `<g id="${id}" style="transition:transform 1s cubic-bezier(.45,.05,.2,1)">
        <rect x="-17" y="-160" width="34" height="160" rx="17" fill="#f5c9a3" stroke="#c98d68" stroke-width="2"/>
        <rect class="tint" x="-17" y="-160" width="34" height="160" rx="17" style="fill:rgba(0,0,0,0);transition:fill 2s"/>
        <path d="M-8 -16 q8 9 16 0" fill="none" stroke="#c98d68" stroke-width="2"/>
        <text x="0" y="-62" text-anchor="middle" font-size="17" font-weight="800" fill="#5a3a26">${label}</text></g>`;
      const water = (cx, fill, op) => `<rect x="${cx - 57}" y="178" width="114" height="72" rx="6" style="fill:${fill}" opacity="${op}"/>`;
      const glass = (cx, label) => `<path d="M${cx - 62} 140 v106 q0 10 10 10 h104 q10 0 10 -10 v-106" fill="none" stroke="#cfc7f5" stroke-width="3"/>
        <text x="${cx}" y="288" text-anchor="middle" font-size="18" font-weight="700" style="fill:var(--muted)">${label}</text>`;
      const W3 = [[110, '#3f72d9', '冷 cool'], [300, '#d9903a', '暖 warm'], [490, '#d43d4f', '熱 hot']];
      const svg = html(`<svg class="svg-fit" viewBox="0 0 600 300" style="max-width:600px;margin-inline:auto" role="img" aria-label="三杯水與兩隻手指">
        ${W3.map(([x, c]) => water(x, c, 0.95)).join('')}
        <g class="steam" style="stroke:#ffb4b4" stroke-width="3" fill="none" stroke-linecap="round"><path d="M470 130 q-8 -12 0 -24"/><path d="M492 128 q-8 -12 0 -24" style="animation-delay:.7s"/><path d="M514 130 q-8 -12 0 -24" style="animation-delay:1.3s"/></g>
        <g id="fz">${finger('fl', 'L')}${finger('fr', 'R')}</g>
        ${W3.map(([x, c]) => water(x, c, 0.5)).join('')}
        <rect x="70" y="170" width="22" height="20" rx="4" fill="#e4f3ff" opacity=".9"/><rect x="104" y="166" width="20" height="20" rx="4" fill="#e4f3ff" opacity=".9" transform="rotate(12 114 176)"/>
        ${W3.map(([x, , l]) => glass(x, l)).join('')}
      </svg>`);
      const feel = html(`<div class="stack-sm">
        <div class="feel-row"><span class="lbl">左手指 L 感覺</span><div class="feel-bar"><i data-f="l"></i></div><b class="feel-txt" data-t="l">—</b></div>
        <div class="feel-row"><span class="lbl">右手指 R 感覺</span><div class="feel-bar"><i data-f="r"></i></div><b class="feel-txt" data-t="r">—</b></div></div>`);
      const ctrl = html(`<div class="row"><button type="button" class="btn hot" data-s="1">① L 浸冷水、R 浸熱水</button><button type="button" class="btn" data-s="2" disabled>② 兩隻一齊放入暖水</button><button type="button" class="btn ghost sm" data-s="0">重來</button></div>`);
      const soak = html('<div class="timer-bar" hidden><i style="width:0%"></i></div>');
      const after = html('<div class="stack-sm"></div>');
      st.add(svg); st.add(ctrl); st.add(soak); st.add(feel); st.add(after);
      const fl = $('#fl', svg), fr = $('#fr', svg);
      const place = (g, x, y) => { g.style.transform = `translate(${x}px, ${y}px)`; };
      const tint = (g, c) => { $('.tint', g).style.fill = c; };
      const setFeel = (k, pos, txt, cls) => { $(`[data-f="${k}"]`, feel).style.left = `${pos}%`; const t = $(`[data-t="${k}"]`, feel); t.textContent = txt; t.className = `feel-txt ${cls || ''}`; };
      let gen = 0;
      const later_ = (ms, fn) => { const g = gen; later(ms, () => { if (g === gen) fn(); }); };
      const reset = () => {
        gen++;
        place(fl, 230, 105); place(fr, 370, 105); tint(fl, 'rgba(0,0,0,0)'); tint(fr, 'rgba(0,0,0,0)');
        setFeel('l', 50, '—'); setFeel('r', 50, '—');
        $('[data-s="1"]', ctrl).disabled = false; $('[data-s="2"]', ctrl).disabled = true; soak.hidden = true; after.replaceChildren();
      };
      reset();
      $('[data-s="0"]', ctrl).onclick = () => { SFX.click(); reset(); };
      $('[data-s="1"]', ctrl).onclick = () => {
        SFX.whoosh(); $('[data-s="1"]', ctrl).disabled = true;
        place(fl, 110, 222); place(fr, 490, 222);
        setFeel('l', 8, '好凍！', 'hl-cold'); setFeel('r', 92, '好熱！', 'hl-hot');
        later_(700, () => { tint(fl, 'rgba(70,130,255,.45)'); tint(fr, 'rgba(255,70,80,.45)'); });
        soak.hidden = false; const bar = $('i', soak); bar.style.transition = 'none'; bar.style.width = '0%';
        void bar.offsetWidth; bar.style.transition = 'width 3s linear'; bar.style.width = '100%';
        later_(3000, () => { $('[data-s="2"]', ctrl).disabled = false; SFX.tick(); });
      };
      $('[data-s="2"]', ctrl).onclick = () => {
        SFX.whoosh(); $('[data-s="2"]', ctrl).disabled = true; soak.hidden = true;
        place(fl, 284, 222); place(fr, 316, 222);
        later_(900, () => {
          setFeel('l', 78, '好暖呀！', 'hl-hot'); setFeel('r', 25, '好涼呀！', 'hl-cold');
          after.replaceChildren(html(sir('咦？<b>同一杯暖水</b>，L 話熱、R 話凍。邊個講大話？', 'wow')));
          after.appendChild(mcq({
            q: 'The two fingers are in the same beaker of warm water. They feel ____ degrees of hotness.',
            zh: '兩隻手指浸喺同一杯暖水，感覺到的冷熱程度……',
            options: ['the same（一樣）', 'different（唔一樣）'], answer: 1,
            explain: 'L 之前浸過冷水，所以覺得暖水「熱」；R 之前浸過熱水，所以覺得暖水「凍」。',
            onDone: () => {
              after.appendChild(html('<div class="lbl">完成結論（撳空格，再揀字）：</div>'));
              after.appendChild(fillIn({
                text: '∴ Human senses are {{unreliable}}. To compare the degrees of hotness of objects, we need to measure their {{temperature}} with an appropriate instrument.',
                bank: ['reliable', 'unreliable', 'temperature', 'heat', 'thermometer'],
                onDone: () => st.complete()
              }));
            }
          }));
        });
      };
    }

    /* ---------- 2. definition ---------- */
    {
      const st = add(station({ world: 'w1', id: 'define', tag: '1.1A · p.3', title: '溫度到底係乜？', short: '溫度定義', goal: '讀熟定義，再答 3 句啱定錯' }));
      st.add(enBox([{ en: '<b>Temperature</b> – a measure of the degree of [[hotness]] (or coldness) of an object.', zh: '溫度：量度物體有幾熱（或幾凍）的程度。' }]));
      st.add('<p class="small muted">撳「遮住重點考自己」，再逐個撳返開，睇吓自己記唔記得。</p>');
      st.add(tfCards([
        { en: 'Temperature tells us how hot or cold an object is.', zh: '溫度話俾我哋知物體有幾熱或幾凍。', ans: true, why: '正正就係定義：a measure of the degree of hotness (or coldness).' },
        { en: 'Human senses are reliable for comparing the hotness of objects.', zh: '人的感覺可以準確比較冷熱。', ans: false, why: '手指實驗證明咗：human senses are <b>unreliable</b>。' },
        { en: 'To compare hotness objectively, we measure temperature with an instrument (a thermometer).', zh: '要客觀比較，就用儀器（溫度計）量度溫度。', ans: true, why: '溫度計做的係 objective measurement（客觀量度）。' }
      ], () => st.complete()));
    }

    /* ---------- 3. temperature ladder ---------- */
    {
      const st = add(station({ world: 'w1', id: 'ladder', tag: '1.1A · p.3 · 課本圖', title: '溫度排排坐', short: '溫度排序', goal: '由最凍撳到最熱，答啱 2 輪' }));
      st.add(sir('課本 p.3 有兩幅圖：日常生活的溫度，同電器的工作溫度。考吓你：由<b>最凍</b>開始，順序撳！', 'happy'));
      const head = html('<div class="row-between"><span class="score-pill">第 <b class="rd">1</b> 輪 · 啱咗 <b class="wins">0</b> 輪</span><button type="button" class="btn sm ghost" data-new>換一組</button></div>');
      const grid = html('<div class="tile-grid"></div>');
      const fb = html('<div></div>');
      st.add(head); st.add(grid); st.add(fb);
      let round_ = 1, wins = 0, order = [], items = [];
      const newRound = () => {
        order = []; fb.replaceChildren(); grid.replaceChildren();
        let pool = shuffle(LADDER);
        items = [];
        for (const it of pool) { if (items.every(x => Math.abs(x.T - it.T) >= 6)) items.push(it); if (items.length === 5) break; }
        items = shuffle(items);
        $('.rd', head).textContent = round_;
        items.forEach(it => {
          const t = html(`<button type="button" class="tile" data-id="${it.id}"><span class="order"></span>${ticon(it.id)}<span>${it.zh}</span><span class="tiny muted">${it.en}</span><span class="tval" hidden>${tLabel(it.T)}</span></button>`);
          t.onclick = () => {
            if (order.length >= items.length) return;
            if (order.includes(it)) { order = order.filter(x => x !== it); }
            else order.push(it);
            SFX.tick(); paint();
            if (order.length === items.length) check();
          };
          grid.appendChild(t);
        });
      };
      const paint = () => $$('.tile', grid).forEach(t => {
        const k = order.findIndex(x => x.id === t.dataset.id);
        $('.order', t).textContent = k >= 0 ? k + 1 : '';
        t.classList.toggle('picked', k >= 0);
      });
      const check = () => {
        const sorted = items.slice().sort((a, b) => a.T - b.T);
        let ok = true;
        $$('.tile', grid).forEach(t => {
          const k = order.findIndex(x => x.id === t.dataset.id);
          const good = sorted[k] && sorted[k].id === t.dataset.id;
          if (!good) ok = false;
          t.classList.add(good ? 'ok' : 'no'); $('.tval', t).hidden = false;
        });
        if (ok) { wins++; SFX.good(); addJoules(100); } else SFX.bad();
        $('.wins', head).textContent = wins;
        fb.replaceChildren(html(`<div class="feedback ${ok ? 'ok' : 'no'} pop"><div class="fb-title">${ok ? '全部排啱！' : '有啲排錯咗'}</div>
          正確次序：${sorted.map(x => `<b>${x.zh}</b> <span class="mono small">(${tLabel(x.T)})</span>`).join(' → ')}
          <div class="row" style="margin-top:10px"><button type="button" class="btn sm hot" data-next>下一輪 →</button></div></div>`));
        $('[data-next]', fb).onclick = () => { SFX.click(); round_++; newRound(); };
        if (wins >= 2) st.complete();
      };
      $('[data-new]', head).onclick = () => { SFX.click(); newRound(); };
      newRound();
      st.add(`<p class="small muted">課本圖的溫度係大約數（由圖讀出）。最低可能的溫度係 <b class="hl-cold">−273.15 °C</b>（第 5 站再講）。</p>`);
    }

    /* ---------- 4. make a Celsius scale ---------- */
    {
      const st = add(station({ world: 'w1', id: 'celsius', tag: '1.1B · p.4', title: '自製攝氏溫標：兩個定點 + 100 等份', short: '攝氏溫標', goal: '標記兩個定點，再分成 100 等份' }));
      st.add(enBox([
        { en: 'A temperature scale is defined by easily reproducible temperatures called [[fixed points]]: the lower fixed point and the upper fixed point.', zh: '溫標要用一啲容易重現的溫度做基準，叫「定點」。' },
        { en: '<b>Lower fixed point</b>: the [[melting point of pure ice]] at normal atmospheric pressure, taken as [[0 °C]] (ice point).', zh: '下定點：標準大氣壓下純冰的熔點 = 0 °C（冰點）。' },
        { en: '<b>Upper fixed point</b>: the [[boiling point of pure water]] at normal atmospheric pressure, taken as [[100 °C]] (steam point).', zh: '上定點：標準大氣壓下純水的沸點 = 100 °C（汽點）。' },
        { en: 'Divide the range between the two fixed points into [[100]] equal intervals called [[degrees]].', zh: '兩個定點之間分成 100 等份，每份叫 1 度。' }
      ]));
      const Y0 = 236, Y100 = 76, TOP = 30;
      const svg = html(`<svg class="svg-fit" viewBox="0 0 520 330" style="max-width:560px" role="img" aria-label="未有刻度的溫度計">
        <g id="cs-bath"></g>
        <rect x="132" y="${TOP - 8}" width="36" height="${300 - TOP}" rx="18" fill="#1d1640" stroke="#cfc7f5" stroke-width="3"/>
        <circle cx="150" cy="300" r="24" fill="#1d1640" stroke="#cfc7f5" stroke-width="3"/>
        <circle cx="150" cy="300" r="19" style="fill:var(--hot)"/>
        <rect id="cs-col" x="144" y="${Y0}" width="12" height="${300 - Y0}" style="fill:var(--hot)"/>
        <g id="cs-ticks"></g><g id="cs-marks"></g>
        <text id="cs-read" x="330" y="40" text-anchor="middle" font-size="22" font-weight="700" style="fill:var(--white-hot)"></text>
      </svg>`);
      const ctrl = html(`<div class="row"><button type="button" class="btn cold" data-a="ice">① 放入溶化中的純冰</button><button type="button" class="btn" data-a="mark0" disabled>標記 0 °C</button>
        <button type="button" class="btn hot" data-a="boil" disabled>② 放入沸騰中的純水</button><button type="button" class="btn" data-a="mark100" disabled>標記 100 °C</button>
        <button type="button" class="btn" data-a="split" disabled>③ 分成 100 等份</button></div>`);
      const play = html('<div hidden></div>');
      st.add(svg); st.add(ctrl); st.add(play);
      const col = $('#cs-col', svg), bath = $('#cs-bath', svg), marks = $('#cs-marks', svg), ticks = $('#cs-ticks', svg), read = $('#cs-read', svg);
      const setLevel = (y, ms = 1300) => tweenAttr(col, { y, height: 300 - y }, ms);
      const showBath = kind => {
        const ice = kind === 'ice';
        bath.innerHTML = `<rect x="80" y="210" width="140" height="110" rx="10" style="fill:${ice ? '#2f63c9' : '#c43a4c'}" opacity=".55"/>
          <path d="M74 190 v120 q0 12 12 12 h128 q12 0 12 -12 v-120" fill="none" stroke="#cfc7f5" stroke-width="3"/>
          ${ice ? '<rect x="90" y="200" width="26" height="22" rx="4" fill="#e4f3ff"/><rect x="186" y="198" width="24" height="24" rx="4" fill="#e4f3ff" transform="rotate(10 198 210)"/><rect x="120" y="226" width="20" height="18" rx="4" fill="#e4f3ff" opacity=".8"/>'
            : '<circle cx="100" cy="280" r="5" fill="#ffd0d0"/><circle cx="196" cy="262" r="4" fill="#ffd0d0"/><circle cx="118" cy="240" r="3.5" fill="#ffd0d0"/><circle cx="180" cy="296" r="6" fill="#ffd0d0"/><g class="steam" style="stroke:#ffb4b4" stroke-width="3" fill="none" stroke-linecap="round"><path d="M100 190 q-8 -12 0 -24"/><path d="M205 190 q-8 -12 0 -24" style="animation-delay:.8s"/></g>'}
          <text x="150" y="${ice ? 190 : 186}" text-anchor="middle" font-size="15" font-weight="700" style="fill:var(--muted)">${ice ? 'melting ice 溶化中的冰' : 'boiling water 沸水'}</text>`;
      };
      const mark = (y, label, sub) => {
        marks.insertAdjacentHTML('beforeend', `<g class="pop"><path d="M168 ${y} H236" style="stroke:var(--warm)" stroke-width="3"/><text x="244" y="${y + 6}" font-size="18" font-weight="800" style="fill:var(--warm)">${label}</text><text x="244" y="${y + 26}" font-size="13" style="fill:var(--muted)">${sub}</text></g>`);
      };
      const btn = a => $(`[data-a="${a}"]`, ctrl);
      btn('ice').onclick = () => { SFX.whoosh(); showBath('ice'); setLevel(Y0); btn('ice').disabled = true; later(1000, () => btn('mark0').disabled = false); read.textContent = '液柱縮到最短 → 冇再變'; };
      btn('mark0').onclick = () => { SFX.good(); mark(Y0, '0 °C', 'lower fixed point · ice point'); btn('mark0').disabled = true; btn('boil').disabled = false; read.textContent = ''; };
      btn('boil').onclick = () => { SFX.sizzle(); showBath('boil'); setLevel(Y100); btn('boil').disabled = true; later(1500, () => btn('mark100').disabled = false); read.textContent = '液柱升到最高 → 冇再變'; };
      btn('mark100').onclick = () => { SFX.good(); mark(Y100, '100 °C', 'upper fixed point · steam point'); btn('mark100').disabled = true; btn('split').disabled = false; read.textContent = ''; bath.innerHTML = ''; };
      btn('split').onclick = () => {
        btn('split').disabled = true; SFX.win();
        for (let k = 1; k < 100; k++) {
          const y = Y0 - (Y0 - Y100) * k / 100;
          const long = k % 10 === 0;
          later(k * 18, () => {
            ticks.insertAdjacentHTML('beforeend', `<path d="M${long ? 112 : 120} ${y} H132" style="stroke:${long ? 'var(--text)' : 'var(--dim)'}" stroke-width="${long ? 2 : 1}"/>${long ? `<text x="106" y="${y + 4}" text-anchor="end" font-size="12" style="fill:var(--muted)">${k}</text>` : ''}`);
            if (k % 10 === 0) SFX.tick();
          });
        }
        later(1900, () => {
          read.textContent = '100 等份 = 100 度';
          play.hidden = false;
          play.replaceChildren(rangeField({ id: 'cs-try', label: '試吓用你嘅溫度計量度（拉動）', min: 0, max: 100, value: 40, fmt: v => `${v} °C`,
            onInput: v => { setLevel(Y0 - (Y0 - Y100) * v / 100, 0); read.textContent = `讀數：${v} °C`; } }));
          setLevel(Y0 - (Y0 - Y100) * 0.4); read.textContent = '讀數：40 °C';
          st.complete();
        });
      };
    }

    /* ---------- 5. dual-scale thermometer ---------- */
    {
      const st = add(station({ world: 'w1', id: 'kelvin', tag: '1.1B · p.4', title: '攝氏 °C ⇄ 開爾文 K', short: '°C ⇄ K', goal: '完成下面 3 個小任務' }));
      st.add(enBox([
        { en: '<b>Kelvin scale</b> (absolute temperature scale): [[T<sub>K</sub> (K) = T<sub>C</sub> (°C) + 273]]', zh: '開爾文溫標（絕對溫標）：K 數 = °C 數 + 273' },
        { en: 'An increase of 1 °C is equal to an increase of [[1 K]]. The Celsius scale and Kelvin scale only differ in their [[starting points]].', zh: '升 1 °C 等於升 1 K；兩個溫標只係起點唔同。' },
        { en: 'The lowest possible temperature is [[0 K]]. It\'s called [[absolute zero]].', zh: '最低可能溫度係 0 K，叫絕對零度（≈ −273 °C，更準確係 −273.15 °C）。' }
      ]));
      const KMAX = 400, TOP = 20, BOT = 320, pxK = (BOT - TOP) / KMAX; // 0 K at BOT
      const yK = K => BOT - K * pxK;
      let tick = '';
      for (let K = 0; K <= KMAX; K += 10) {
        const y = yK(K), major = K % 100 === 0;
        tick += `<path d="M196 ${y} H${major ? 214 : 206}" style="stroke:var(--dim)" stroke-width="${major ? 2 : 1}"/><path d="M${major ? 266 : 274} ${y} H284" style="stroke:var(--dim)" stroke-width="${major ? 2 : 1}"/>`;
        if (major) tick += `<text x="292" y="${y + 5}" font-size="14" style="fill:var(--qT)" class="mono">${K} K</text><text x="188" y="${y + 5}" text-anchor="end" font-size="14" style="fill:var(--cool)">${K - 273} °C</text>`;
      }
      const land = [[0, '絕對零度 absolute zero'], [273, '冰點 ice point'], [373, '汽點 steam point']].map(([K, n]) =>
        `<path d="M300 ${yK(K)} H330" style="stroke:var(--warm)" stroke-dasharray="3 3"/><text x="334" y="${yK(K) + (K === 373 ? -6 : 5)}" font-size="12" style="fill:var(--warm)">${n}</text>`).join('');
      const svg = html(`<svg class="svg-fit" viewBox="0 0 470 350" style="max-width:520px" role="img" aria-label="攝氏與開爾文雙刻度溫度計">
        <text x="150" y="14" text-anchor="middle" font-size="13" style="fill:var(--cool)">攝氏 °C</text><text x="330" y="14" text-anchor="middle" font-size="13" style="fill:var(--qT)">開爾文 K</text>
        <rect x="222" y="${TOP - 10}" width="36" height="${BOT - TOP + 22}" rx="18" fill="#1d1640" stroke="#cfc7f5" stroke-width="3"/>
        ${tick}${land}
        <rect id="dk-col" x="234" y="${yK(298)}" width="12" height="${BOT + 8 - yK(298)}" rx="6" style="fill:var(--hot)"/>
        <g id="dk-br"></g>
      </svg>`);
      const out = html(`<div class="readout stack-sm"><div class="fx-line"><span class="big" style="color:var(--cool)" id="dk-c">25 °C</span><span class="muted">⇄</span><span class="big" style="color:var(--qT)" id="dk-k">298 K</span></div><div class="small" id="dk-eq"></div></div>`);
      const left = html('<div class="stack-sm"></div>');
      const right = html('<div class="stack-sm"></div>');
      const lay = html('<div class="two"></div>'); lay.append(left, right);
      left.appendChild(svg);
      st.add(lay);
      const tasks = [
        { id: 'zero', t: '拉到最低：絕對零度係幾多 °C？' },
        { id: 'boil', t: '搵出 100 °C 等於幾多 K' },
        { id: 'dt', t: '轉去「溫度變化 ΔT」模式，比較 °C 同 K' }
      ];
      const got = new Set();
      const list = html(`<ul class="small stack-sm" style="padding-left:1.2em;margin:0">${tasks.map(t => `<li data-t="${t.id}">${t.t}</li>`).join('')}</ul>`);
      const tick_ = id => { if (got.has(id)) return; got.add(id); const li = $(`[data-t="${id}"]`, list); li.classList.add('good'); li.innerHTML = '✓ ' + li.innerHTML; SFX.good(); if (got.size === tasks.length) st.complete(); };
      const col = $('#dk-col', svg), br = $('#dk-br', svg);
      const msg = html('<div></div>');
      let mode = 'read';
      const r1 = rangeField({ id: 'dk-t', label: '溫度', min: -273, max: 127, value: 25, fmt: v => `${v} °C`, onInput: v => upd() });
      const r2 = rangeField({ id: 'dk-a', label: '開始溫度', min: -273, max: 127, value: 20, fmt: v => `${v} °C = ${v + 273} K`, onInput: () => upd(), cls: 'cold' });
      const r3 = rangeField({ id: 'dk-b', label: '最後溫度', min: -273, max: 127, value: 50, fmt: v => `${v} °C = ${v + 273} K`, onInput: () => upd() });
      const modeSeg = seg([{ v: 'read', label: '讀溫度' }, { v: 'dt', label: '溫度變化 ΔT' }], 'read', v => { mode = v; upd(); if (v === 'dt') tick_('dt'); });
      right.append(modeSeg, out, r1, r2, r3, msg, html('<div class="lbl">小任務</div>'), list);
      function upd() {
        const isRead = mode === 'read';
        r1.hidden = !isRead; r2.hidden = isRead; r3.hidden = isRead;
        if (isRead) {
          const C = Number(r1.input.value), K = C + 273;
          col.setAttribute('y', yK(K)); col.setAttribute('height', BOT + 8 - yK(K)); br.innerHTML = '';
          $('#dk-c', out).textContent = `${nf(C)} °C`; $('#dk-k', out).textContent = `${nf(K)} K`;
          $('#dk-eq', out).innerHTML = `T<sub>K</sub> = T<sub>C</sub> + 273 → <b>${nf(K)}</b> = ${nf(C)} + 273`;
          if (C <= -273) { msg.innerHTML = sir('到底啦！<b>0 K = −273 °C</b>，絕對零度，冇可能再低。所以「−23 K」呢類答案係<b>不可能</b>。', 'cold'); tick_('zero'); }
          else if (C === 100) { msg.innerHTML = sir('100 °C = <b>373 K</b>（上定點）。', 'hot'); tick_('boil'); }
          else if (C === 0) msg.innerHTML = sir('0 °C = <b>273 K</b>（下定點）。', 'happy');
          else msg.innerHTML = '';
        } else {
          const a = Number(r2.input.value), b = Number(r3.input.value);
          const ya = yK(a + 273), yb = yK(b + 273);
          col.setAttribute('y', yb); col.setAttribute('height', BOT + 8 - yb);
          br.innerHTML = `<path d="M150 ${ya} H200 M150 ${yb} H200 M160 ${ya} V${yb}" style="stroke:var(--cool)" stroke-width="2.5"/><path d="M280 ${ya} H322 M280 ${yb} H322 M312 ${ya} V${yb}" style="stroke:var(--qT)" stroke-width="2.5"/>`;
          const d = b - a;
          $('#dk-c', out).textContent = `ΔT = ${nf(d)} °C`; $('#dk-k', out).textContent = `ΔT = ${nf(d)} K`;
          $('#dk-eq', out).innerHTML = `(${nf(b + 273)} − ${nf(a + 273)}) K = (${nf(b)} − ${nf(a)}) °C = <b>${nf(d)}</b>`;
          msg.innerHTML = sir('兩邊嘅「高度差」一樣！<b>溫度變化 ΔT 用 °C 定 K，數字一樣</b>。所以單位 J °C⁻¹ 同 J K⁻¹ 其實係同一樣嘢（第 4 關會用到）。', 'happy');
        }
      }
      upd();
    }

    /* ---------- 6. conversion rush + Classwork 1 ---------- */
    {
      const st = add(station({ world: 'w1', id: 'rush', tag: '1.1B · p.5 · Classwork 1', title: '°C ⇄ K 轉換快打 + Classwork 1', short: '轉換快打', goal: '完成 Classwork 1 表格（快打係加分遊戲）' }));
      const game = html('<div class="panel-inset stack-sm"></div>');
      st.add(game);
      const best = () => Store.data.best['w1.rush'] || 0;
      const intro = () => {
        game.replaceChildren(html(`<div class="stack-sm"><div class="row-between"><b>45 秒快打</b><span class="score-pill">最佳：${best()} 分</span></div>
          <p class="small muted">每題揀答案，連續答啱有 Combo。小心陷阱：開爾文冇負數！</p>
          <div class="row"><button type="button" class="btn hot" data-go>開始！</button></div></div>`));
        $('[data-go]', game).onclick = () => { SFX.click(); run(); };
      };
      const makeQ = () => {
        const r = Math.random();
        if (r < 0.12) { const k = pick([-23, -50, -10, -100]); return { q: `${k} K = ? °C`, opts: shuffle([`${k - 273} °C`, `${k + 273} °C`, '不可能 impossible']), ans: '不可能 impossible', why: '開爾文最低係 0 K，冇負數。' }; }
        if (r < 0.24) { const d = pick([10, 20, 25, 30, 40, 50, 80]); return { q: `溫度上升 ${d} °C = 上升幾多 K？`, opts: shuffle([`${d} K`, `${d + 273} K`, `${273 - d} K`]), ans: `${d} K`, why: '升 1 °C = 升 1 K。' }; }
        if (r < 0.62) { const c = pick([randInt(-273, 300), pick([-273, 0, 100, 27, 77, 37, -73, 127, 227])]); const ans = c + 273; return { q: `${nf(c)} °C = ? K`, opts: shuffle([`${nf(ans)} K`, `${nf(c - 273)} K`, `${nf(ans + pick([10, -10, 100]))} K`]), ans: `${nf(ans)} K`, why: `${nf(c)} + 273 = ${nf(ans)}` }; }
        const k = pick([randInt(0, 600), pick([0, 273, 373, 300, 350, 400, 200])]); const ans = k - 273;
        return { q: `${nf(k)} K = ? °C`, opts: shuffle([`${nf(ans)} °C`, `${nf(k + 273)} °C`, `${nf(ans + pick([10, -10, 100]))} °C`]), ans: `${nf(ans)} °C`, why: `${nf(k)} − 273 = ${nf(ans)}` };
      };
      const run = () => {
        let score = 0, combo = 0, left = 45, q = null, alive = true;
        game.replaceChildren(html(`<div class="stack-sm">
          <div class="row-between"><span class="score-pill">分數 <b class="sc">0</b></span><span class="score-pill">Combo <b class="cb">0</b></span><span class="score-pill"><b class="tl">45</b> 秒</span></div>
          <div class="timer-bar"><i style="width:100%"></i></div>
          <div class="center" style="padding:10px 0"><div class="fx big rq" style="justify-content:center"></div></div>
          <div class="opts cols2 ro"></div><div class="small rw" style="min-height:1.6em"></div></div>`));
        const next = () => {
          q = makeQ(); $('.rq', game).textContent = q.q;
          const box = $('.ro', game); box.replaceChildren();
          q.opts.forEach((o, i) => {
            const b = html(`<button type="button" class="opt"><span class="k">${'ABC'[i]}</span><span class="t mono">${o}</span></button>`);
            b.onclick = () => {
              if (!alive) return;
              if (o === q.ans) { combo++; score += combo >= 3 ? 2 : 1; SFX.good(); $('.rw', game).innerHTML = `<span class="good">✓ ${q.why}${combo >= 3 ? ' Combo ×2！' : ''}</span>`; }
              else { combo = 0; SFX.bad(); $('.rw', game).innerHTML = `<span class="bad">✗ 答案係 ${q.ans}（${q.why}）</span>`; }
              $('.sc', game).textContent = score; $('.cb', game).textContent = combo;
              next();
            };
            box.appendChild(b);
          });
        };
        next();
        const stop = every(1000, () => {
          left--; $('.tl', game).textContent = left; $('.timer-bar i', game).style.width = `${left / 45 * 100}%`;
          if (left <= 0) {
            alive = false; stop();
            const nb = score > best();
            if (nb) { Store.data.best['w1.rush'] = score; Store.save(); }
            addJoules(score * 20);
            SFX.win(); if (score >= 10) Confetti.burst(80);
            game.replaceChildren(html(`<div class="stack-sm center pop"><div class="result-big">${score} 分</div><div>${nb ? '新紀錄！' : `最佳：${best()} 分`}</div>
              <div class="row" style="justify-content:center"><button type="button" class="btn hot" data-go>再玩</button></div></div>`));
            $('[data-go]', game).onclick = () => { SFX.click(); run(); };
          }
        });
      };
      intro();

      /* Classwork 1 — interactive table */
      st.add('<div class="lbl">Classwork 1 (a)　填表（「不可能」可以打 impossible）</div>');
      const cw = html(`<div class="tbl-wrap"><table class="tbl">
        <tr><th>Kelvin temperature T<sub>K</sub> / K</th><td class="num-cell">0</td><td><input class="num sm" data-a="273" aria-label="K 空格 1"></td><td class="num-cell">373</td><td><input class="num sm" data-a="350" aria-label="K 空格 2"></td><td class="num-cell">−23</td></tr>
        <tr><th>Celsius temperature T<sub>C</sub> / °C</th><td><input class="num sm" data-a="-273" aria-label="°C 空格 1"></td><td class="num-cell">0</td><td><input class="num sm" data-a="100" aria-label="°C 空格 2"></td><td class="num-cell">77</td><td><input class="num sm" data-a="x" aria-label="°C 空格 3" placeholder="?"></td></tr>
      </table></div>`);
      const cw2 = html(`<div class="tbl-wrap"><table class="tbl">
        <tr><th>Temperature scale</th><th>Absolute Zero</th><th>Lower Fixed Point</th><th>Upper Fixed Point</th></tr>
        <tr><th>Celsius</th><td class="num-cell">−273 °C</td><td class="num-cell">0 °C</td><td class="num-cell">100 °C</td></tr>
        <tr><th>Kelvin</th><td><input class="num sm" data-a="0" aria-label="絕對零度 K"></td><td><input class="num sm" data-a="273" aria-label="下定點 K"></td><td><input class="num sm" data-a="373" aria-label="上定點 K"></td></tr>
      </table></div>`);
      const cfb = html('<div class="small"></div>');
      const cbtn = html('<div class="row"><button type="button" class="btn cold">檢查 Classwork 1</button></div>');
      st.add(cw); st.add('<div class="lbl">Classwork 1 (b)</div>'); st.add(cw2); st.add(cbtn); st.add(cfb);
      $('button', cbtn).onclick = () => {
        let wrong = 0;
        $$('input', st.el).filter(i => i.dataset.a != null).forEach(i => {
          let ok;
          if (i.dataset.a === 'x') ok = /imposs|不可能|^x$|n\/?a/i.test(i.value.trim());
          else ok = approx(parseNum(i.value), Number(i.dataset.a), 0, 0.01);
          i.classList.toggle('ok', ok); i.classList.toggle('no', !ok);
          if (!ok) wrong++;
        });
        if (wrong) { SFX.bad(); cfb.innerHTML = `<span class="bad">仲有 ${wrong} 格唔啱。</span><span class="muted"> 記住：T<sub>K</sub> = T<sub>C</sub> + 273；−23 K 冇可能存在。</span>`; }
        else { SFX.good(); cfb.innerHTML = '<span class="good">Classwork 1 全對！</span>'; st.complete(); }
      };
    }
  });
