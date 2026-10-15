/* ============ World 5 · High specific heat capacity of water (p.13) ============ */

Router.routes.w5 = main => worldPage(main, 'w5',
  sir('第 5 關：水的比熱容係課本表入面最高（<b>4200</b>）。即係話：水要食好多能量先肯升溫，降溫時又會放出好多能量。呢個「超能力」日常生活周圍都用到。', 'happy'),
  add => {
    /* ---------- 1. hold the sun ---------- */
    {
      const st = add(station({ world: 'w5', id: 'water', tag: '1.3 · p.13', title: '撳住太陽：水 vs 泥土', short: '水 vs 泥土', goal: '撳住太陽加熱、放手降溫，再答一題' }));
      st.add(enBox([
        { en: 'Water has a high specific heat capacity ([[4200]] J kg⁻¹ °C⁻¹). This means that water absorbs a [[large]] amount of energy to increase its temperature.', zh: '' },
        { en: 'Also, water releases a [[large]] amount of energy when its temperature decreases.', zh: '課堂筆記：所以水的溫度好難改變。' },
        { en: 'A certain mass of water needs [[5 times]] more heat for its temperature to rise by 1 °C than that for the same mass of soil.', zh: '同質量：水升 1 °C 要的熱係泥土的 5 倍。' }
      ]));
      const box = html(`<div class="stack-sm">
        <svg class="svg-fit sun-svg" viewBox="0 0 560 250" style="max-width:600px;margin-inline:auto" role="img" aria-label="太陽照住水同泥土">
          <g class="sun-g" style="transition:opacity .3s"><circle cx="280" cy="46" r="30" style="fill:var(--warm)"/>${Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; return `<path d="M${280 + 38 * Math.cos(a)} ${46 + 38 * Math.sin(a)} L${280 + 50 * Math.cos(a)} ${46 + 50 * Math.sin(a)}" style="stroke:var(--warm)" stroke-width="4" stroke-linecap="round"/>`; }).join('')}</g>
          <g class="rays"></g>
          <rect x="40" y="150" width="200" height="70" rx="10" style="fill:#2f63c9"/><text x="140" y="240" text-anchor="middle" font-size="15" font-weight="700" style="fill:var(--muted)">水 water（1 kg）</text>
          <rect x="320" y="150" width="200" height="70" rx="10" style="fill:#8a5a32"/><text x="420" y="240" text-anchor="middle" font-size="15" font-weight="700" style="fill:var(--muted)">泥土 soil（1 kg）</text>
          <text class="tw mono" x="140" y="192" text-anchor="middle" font-size="24" font-weight="800" style="fill:#fff"></text>
          <text class="ts mono" x="420" y="192" text-anchor="middle" font-size="24" font-weight="800" style="fill:#fff"></text>
        </svg>
        <div class="row" style="justify-content:center"><button type="button" class="btn hot lg sun-btn">☀ 撳住加熱</button></div>
        <div class="center small muted sun-msg">撳住個掣＝太陽照射（兩邊吸收一樣多能量）；放手＝夜晚，兩邊降溫。</div>
        <div class="sun-q"></div></div>`);
      st.add(box);
      let Tw = 20, Ts = 20, on = false, heated = 0, cooled = 0, asked = false;
      const btn = $('.sun-btn', box);
      const set = v => { on = v; btn.classList.toggle('cold', !v); };
      btn.addEventListener('pointerdown', e => { e.preventDefault(); set(true); SFX.sizzle(); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, () => set(false)));
      btn.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); set(true); } });
      btn.addEventListener('keyup', () => set(false));
      const svg = $('.sun-svg', box);
      loop(dt => {
        const h = on ? 2.0 : 0, lam = 0.06;
        Tw += (h - lam * (Tw - 20)) * dt; Ts += (5 * h - 5 * lam * (Ts - 20)) * dt;
        if (on) heated += dt; else if (heated > 1.5 && Ts > 22) cooled += dt;
        $('.tw', svg).textContent = `${Tw.toFixed(1)} °C`; $('.ts', svg).textContent = `${Ts.toFixed(1)} °C`;
        $('.sun-g', svg).style.opacity = on ? 1 : 0.25;
        $('.rays', svg).innerHTML = on ? [100, 180, 380, 460].map(x => `<path d="M${280 + (x - 280) * 0.25} 90 L${x} 145" style="stroke:var(--warm)" stroke-width="2" stroke-dasharray="6 6" opacity=".7"/>`).join('') : '';
        const dw = Tw - 20, ds = Ts - 20;
        if (on && heated > 0.4) $('.sun-msg', box).innerHTML = `吸收同樣能量：水升咗 <b class="hl-cold">${dw.toFixed(1)} °C</b>，泥土升咗 <b class="hl-warm">${ds.toFixed(1)} °C</b>（大約 5 倍）。`;
        else if (!on && cooled > 0.3) $('.sun-msg', box).innerHTML = `降溫中：泥土凍得快，水<b>慢慢先降</b>——水放出大量能量，溫度先跌少少。`;
        if (!asked && heated > 1.5 && cooled > 1) {
          asked = true;
          $('.sun-q', box).appendChild(mcq({ q: 'Equal masses of water and soil absorb the same amount of energy. Which statement is correct?', zh: '同質量的水同泥土吸收同樣能量。', options: ['The temperature of the soil rises more, because water has a higher specific heat capacity.', 'The temperature of the water rises more, because water has a higher specific heat capacity.', 'Both rise by the same amount.', 'Neither temperature changes.'], answer: 0, explain: '水的 c 大：同樣能量下 ΔT 細。泥土升溫大約係水的 5 倍。', onDone: () => st.complete() }));
        }
      });
    }

    /* ---------- 2. engine coolant ---------- */
    {
      const st = add(station({ world: 'w5', id: 'coolant', tag: '1.3 · p.13', title: '水做冷卻劑：救救部引擎！', short: '冷卻劑', goal: '試吓開關冷卻水，再完成填充' }));
      const box = html(`<div class="stack-sm">
        <svg class="svg-fit eng-svg" viewBox="0 0 600 260" style="max-width:640px;margin-inline:auto" role="img" aria-label="引擎同冷卻水管">
          <path class="pipe" d="M150 70 H450 V200 H150 Z" fill="none" style="stroke:#3a5f9e" stroke-width="16" stroke-linejoin="round"/>
          <g class="flow"></g>
          <rect x="70" y="80" width="170" height="110" rx="14" style="fill:#5d5a72;stroke:#cfc7f5" stroke-width="3"/>
          <text x="155" y="215" text-anchor="middle" font-size="14" font-weight="700" style="fill:var(--muted)">引擎 engine</text>
          <g class="fire">${[100, 135, 170, 205].map((x, i) => `<path d="M${x} 170 q-10 -22 4 -40 q2 16 12 20 q4 -12 -2 -24 q16 14 10 44 z" style="fill:var(--hot)" opacity=".9" class="steam-anim" />`).join('')}</g>
          <rect x="400" y="60" width="110" height="150" rx="10" style="fill:none;stroke:#cfc7f5" stroke-width="3"/>
          ${Array.from({ length: 7 }, (_, i) => `<path d="M412 ${76 + i * 20} H498" style="stroke:#7c8bb8" stroke-width="3"/>`).join('')}
          <text x="455" y="230" text-anchor="middle" font-size="14" font-weight="700" style="fill:var(--muted)">散熱器 radiator</text>
          <g transform="translate(300 40)"><path d="M-50 40 A50 50 0 0 1 50 40" fill="none" style="stroke:#cfc7f5" stroke-width="4"/><text x="-50" y="56" text-anchor="middle" font-size="13" font-weight="800" style="fill:var(--cool)">C</text><text x="50" y="56" text-anchor="middle" font-size="13" font-weight="800" style="fill:var(--hot)">H</text>
            <line class="gauge" x1="0" y1="40" x2="0" y2="0" style="stroke:var(--white-hot)" stroke-width="4" stroke-linecap="round"/><circle cx="0" cy="40" r="6" style="fill:var(--white-hot)"/></g>
          <text class="eng-warn" x="300" y="140" text-anchor="middle" font-size="26" font-weight="800" style="fill:var(--hot)"></text>
        </svg>
        <div class="row" style="justify-content:center"><span class="eng-seg"></span></div>
        <div class="center small eng-msg"></div></div>`);
      st.add(box);
      let cool = true, Te = 0.35, phase = 0, tried = new Set();
      const svg = $('.eng-svg', box);
      $('.eng-seg', box).appendChild(seg([{ v: 'on', label: '冷卻水 ON' }, { v: 'off', label: '冷卻水 OFF' }], 'on', v => { cool = v === 'on'; tried.add(v); }));
      const path = [[150, 70], [450, 70], [450, 200], [150, 200]];
      const perim = 2 * (300 + 130);
      const at = d => { d = ((d % perim) + perim) % perim; let acc = 0; for (let i = 0; i < 4; i++) { const a = path[i], b = path[(i + 1) % 4]; const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (acc + L >= d) { const k = (d - acc) / L; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } acc += L; } return path[0]; };
      loop(dt => {
        const target = cool ? 0.38 : 1.05;
        Te += (target - Te) * (cool ? 0.8 : 0.18) * dt;
        const k = clamp(Te, 0, 1);
        const ang = Math.PI * (1 - k);
        const g = $('.gauge', svg); g.setAttribute('x2', 46 * Math.cos(ang)); g.setAttribute('y2', 40 - 46 * Math.sin(ang));
        if (cool) phase += dt * 160;
        const n = 18;
        $('.flow', svg).innerHTML = cool ? Array.from({ length: n }, (_, i) => { const [x, y] = at(phase + i * perim / n); const hot = x < 260 || (x > 240 && x < 400 && y < 100); return `<circle cx="${x}" cy="${y}" r="5" style="fill:${hot ? '#ff9a9a' : '#9cd2ff'}"/>`; }).join('') : '';
        $('.eng-warn', svg).textContent = Te > 0.92 ? '過熱！OVERHEAT' : '';
        $('.eng-msg', box).innerHTML = cool ? '水喺水管入面<b>循環</b>：流過引擎時<b>吸收大量熱</b>，去到散熱器再散走。溫度錶保持正常。' : '冇咗冷卻水，引擎產生的熱冇地方去，溫度一直升……';
      });
      st.add(fillIn({ text: 'Water as {{coolant}}: Most engines generate a large amount of {{heat}}. Water is {{circulated|pumped}} in the pipes around the engine and it {{absorbs|takes away}} a large amount of heat from the engine.', bank: ['coolant', 'heat', 'circulated', 'absorbs', 'releases', 'fuel'], onDone: () => st.complete() }));
    }

    /* ---------- 3. coastal vs inland ---------- */
    {
      const st = add(station({ world: 'w5', id: 'climate', tag: '1.3 · p.13 · Climate effect', title: '海邊 vs 內陸：邊度日夜溫差細啲？', short: '氣候', goal: '拉動時間睇一日，再完成填充' }));
      const box = html(`<div class="stack-sm">
        <svg class="svg-fit cl-svg" viewBox="0 0 600 200" style="max-width:640px;margin-inline:auto" role="img" aria-label="海邊同內陸">
          <rect class="sky" x="0" y="0" width="600" height="200" rx="14"/>
          <circle class="sunmoon" r="20"/>
          <path d="M0 150 Q80 140 160 152 T300 150 V200 H0 Z" style="fill:#2f63c9"/><text x="80" y="185" text-anchor="middle" font-size="13" font-weight="700" fill="#e6f0ff">海 sea</text>
          <path d="M150 150 Q300 120 600 135 V200 H150 Z" style="fill:#5b4a35"/>
          <g class="pin" transform="translate(225 138)"><circle r="6" style="fill:var(--white-hot)"/><text class="pt-c mono" x="0" y="-14" text-anchor="middle" font-size="14" font-weight="800" style="fill:var(--white-hot)">海邊</text></g>
          <g class="pin" transform="translate(500 128)"><circle r="6" style="fill:var(--white-hot)"/><text class="pt-i mono" x="0" y="-14" text-anchor="middle" font-size="14" font-weight="800" style="fill:var(--white-hot)">內陸</text></g>
        </svg>
        <div class="cl-r"></div>
        <div class="readout center cl-say"></div>
        <svg class="svg-fit cl-g" viewBox="0 0 440 200" style="max-width:600px;margin-inline:auto"></svg>
        <div class="small muted">曲線只係示意（顯示高低同溫差大細），唔係真實數據。</div></div>`);
      st.add(box);
      const g = $('.cl-g', box);
      const A = axes(g, { box: [40, 20, 370, 140], x: [0, 24], y: [-1.2, 1.2], xt: [0, 6, 12, 18, 24], yt: [], xf: v => `${v}:00`, xl: '時間', yl: '溫度（高 ↑）' });
      const Tin = h => Math.sin((h - 8) / 24 * 2 * Math.PI) * 1.0, Tco = h => Math.sin((h - 8) / 24 * 2 * Math.PI) * 0.32;
      const curve = f => 'M' + Array.from({ length: 97 }, (_, i) => { const h = i / 4; return `${A.sx(h)} ${A.sy(f(h))}`; }).join(' L');
      svgEl('path', { d: curve(Tin), fill: 'none', style: 'stroke:var(--warm)', 'stroke-width': 3 }, g);
      svgEl('path', { d: curve(Tco), fill: 'none', style: 'stroke:var(--cool)', 'stroke-width': 3 }, g);
      const lab = (x, y, t, c) => { const e = svgEl('text', { x, y, 'font-size': 13, 'font-weight': 700, style: `fill:${c}` }, g); e.textContent = t; };
      lab(A.sx(15.2), A.sy(1.08), '內陸：溫差大', 'var(--warm)'); lab(A.sx(15.2), A.sy(0.45), '海邊：溫差細', 'var(--cool)');
      const mk = svgEl('path', { style: 'stroke:var(--white-hot)', 'stroke-width': 2, 'stroke-dasharray': '4 4' }, g);
      const svg = $('.cl-svg', box);
      const show = h => {
        const day = h >= 6 && h <= 18;
        $('.sky', svg).style.fill = day ? '#3b6fb6' : '#0c1030';
        const a = (h - 6) / 12 * Math.PI; const sm = $('.sunmoon', svg);
        sm.setAttribute('cx', day ? 300 - 260 * Math.cos(a) : 300 - 260 * Math.cos((h < 6 ? h + 24 - 18 : h - 18) / 12 * Math.PI));
        sm.setAttribute('cy', day ? 110 - 80 * Math.sin(a) : 110 - 80 * Math.sin((h < 6 ? h + 24 - 18 : h - 18) / 12 * Math.PI));
        sm.style.fill = day ? 'var(--warm)' : '#e8e6ff';
        mk.setAttribute('d', `M${A.sx(h)} ${A.sy(-1.2)} V${A.sy(1.2)}`);
        const ti = Tin(h), tc = Tco(h);
        const say = Math.abs(ti - tc) < 0.08 ? '海邊同內陸差唔多' : ti > tc ? '<b class="hl-warm">內陸較熱</b>，<b class="hl-cold">海邊較涼</b>（海水吸收大量能量但升溫少）' : '<b class="hl-cold">內陸較凍</b>，<b class="hl-warm">海邊較暖</b>（海水放出大量能量但降溫少）';
        $('.cl-say', box).innerHTML = `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'} ${day ? '日間' : '夜晚'}：${say}`;
      };
      $('.cl-r', box).appendChild(rangeField({ id: 'cl-h', label: '時間', min: 0, max: 23.5, step: 0.5, value: 14, fmt: v => `${String(Math.floor(v)).padStart(2, '0')}:${v % 1 ? '30' : '00'}`, onInput: show }));
      show(14);
      st.add(fillIn({ text: 'During daytime, coastal area has a {{lower}} temperature than the inland area. At night, coastal area has a {{higher}} temperature than the inland area. So coastal area has a {{smaller}} temperature range in a day.', bank: ['lower', 'higher', 'smaller', 'larger'], onDone: () => st.complete() }));
      st.add('<p class="small muted">課堂筆記：海水幫海邊 maintain a steady temperature（保持穩定溫度）。</p>');
    }

    /* ---------- 4. the body ---------- */
    {
      const st = add(station({ world: 'w5', id: 'body', tag: '1.3 · p.13 · Maintaining body temperature', title: '人體 70% 係水', short: '人體', goal: '倒水入人體，再完成填充' }));
      const box = html(`<div class="two"><div class="center">
          <svg class="svg-fit body-svg" viewBox="0 0 200 320" style="max-width:220px;margin-inline:auto" role="img" aria-label="人體輪廓">
            <defs><clipPath id="bodyClip"><circle cx="100" cy="40" r="26"/><rect x="62" y="70" width="76" height="120" rx="26"/><rect x="34" y="78" width="22" height="104" rx="11"/><rect x="144" y="78" width="22" height="104" rx="11"/><rect x="66" y="176" width="30" height="128" rx="14"/><rect x="104" y="176" width="30" height="128" rx="14"/></clipPath></defs>
            <g clip-path="url(#bodyClip)"><rect x="0" y="0" width="200" height="320" style="fill:#2a2350"/><rect class="body-water" x="0" y="320" width="200" height="0" style="fill:#3b8cff" opacity=".85"/></g>
            <path class="mark70" d="M10 ${320 - 0.7 * 296} H190" style="stroke:var(--white-hot)" stroke-dasharray="5 5" stroke-width="1.5" opacity="0"/>
            <text class="t70 mono" x="190" y="${320 - 0.7 * 296 - 6}" text-anchor="end" font-size="16" font-weight="800" style="fill:var(--white-hot)" opacity="0">70 %</text>
          </svg></div>
        <div class="stack-sm"><button type="button" class="btn cold lg" data-pour>倒水入身體</button><div class="small body-say muted">人體大約有幾多係水？撳掣睇吓。</div><div class="body-fill"></div></div></div>`);
      st.add(box);
      let poured = false;
      $('[data-pour]', box).onclick = () => {
        if (poured) return; poured = true; SFX.whoosh();
        const w = $('.body-water', box); const H = 0.7 * 296;
        tweenAttr(w, { y: 320 - H, height: H }, 1600, () => {
          $('.mark70', box).setAttribute('opacity', 1); $('.t70', box).setAttribute('opacity', 1); SFX.good();
          $('.body-say', box).innerHTML = '大約 <b class="hl-cold">70 %</b> 係水！水的比熱容高，所以身體得到或者失去一定的能量，<b>體溫都唔會大變</b>。';
          $('.body-fill', box).appendChild(fillIn({ text: '{{70}} % of human body is composed of water. Human body can gain or lose a certain amount of energy without a {{large}} change in body temperature.', bank: ['70', '30', 'large', 'small'], onDone: () => st.complete() }));
        });
      };
    }
  });
