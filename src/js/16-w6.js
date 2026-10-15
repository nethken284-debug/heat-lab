/* ============ World 6 · Principle of conservation of energy (p.14–15) ============ */

Router.routes.w6 = main => worldPage(main, 'w6',
  sir('第 6 關：能量唔會無端端出現，亦唔會消失。熱水撈凍水，熱水<b>失去</b>幾多能量，凍水就<b>得到</b>幾多——用呢條數就計到最後溫度。', 'think'),
  add => {
    /* ---------- 1. where did the energy go? ---------- */
    {
      const st = add(station({ world: 'w6', id: 'law', tag: '1.4 · p.14', title: '能量去咗邊？', short: '能量守恆', goal: '玩吓能量分配，再答一題' }));
      st.add(enBox([
        { en: 'When two bodies of different temperatures are in contact, energy is transferred from the hotter body to the colder body until they reach the same temperature (i.e. [[thermal equilibrium]]).', zh: '' },
        { en: 'According to the <b>law of conservation of energy</b>, energy cannot be [[created or destroyed]]. Energy only [[changes from one form to another]] (e.g. electrical energy → thermal energy).', zh: '能量守恆：能量不會被創造或消滅，只會轉換形式。' },
        { en: 'To solve problems about mixing of bodies involving heat transfer: [[E = Q₁ + Q₂ + Q₃ …]] where E = total energy supply or heat loss by hotter bodies, Q₁ = heat gained by body 1 (or surroundings), Q₂ = heat gained by body 2, …', zh: '總能量 = 每樣嘢得到的熱加埋。' }
      ]));
      const box = html(`<div class="stack-sm">
        <div class="panel-inset stack-sm"><div class="lbl">電熱水壺：電能 E = 100 kJ 變成熱能，分俾……</div>
          <div class="sankey"><div class="sk-in">E = 100 kJ</div><div class="sk-out"><i class="sk-w"></i><i class="sk-c"></i><i class="sk-s"></i></div></div>
          <div class="fx-line small"><span><b style="color:var(--cool)">■</b> Q₁ 水得到 <b class="mono q1"></b></span><span><b style="color:var(--qc)">■</b> Q₂ 容器得到 <b class="mono q2"></b></span><span><b style="color:var(--warm)">■</b> Q₃ 散失到周圍 <b class="mono q3"></b></span></div>
          <div class="work small eq"></div></div>
        <div class="two"><div class="lw-c"></div><div class="lw-s"></div></div>
        <div class="lw-q"></div></div>`);
      st.add(box);
      let q2 = 10, q3 = 15, moved = new Set();
      const paint = () => {
        const q1 = 100 - q2 - q3;
        $('.sk-w', box).style.flexGrow = q1; $('.sk-c', box).style.flexGrow = q2; $('.sk-s', box).style.flexGrow = q3;
        $('.q1', box).textContent = `${q1} kJ`; $('.q2', box).textContent = `${q2} kJ`; $('.q3', box).textContent = `${q3} kJ`;
        $('.eq', box).innerHTML = `E = Q₁ + Q₂ + Q₃ → 100 = ${q1} + ${q2} + ${q3} ✓　${q2 + q3 === 0 ? '<b class="good">冇熱散失：全部能量都去咗水！（計數題通常假設呢個情況）</b>' : '總數永遠係 100 kJ：能量冇消失，只係分咗去唔同地方。'}`;
        if (moved.size >= 2 && !$('.lw-q', box).childElementCount) {
          $('.lw-q', box).appendChild(mcq({ q: 'According to the law of conservation of energy,', options: ['energy cannot be created or destroyed; it only changes from one form to another', 'the energy lost to the surroundings is destroyed', 'a heater creates energy', 'thermal energy disappears after mixing'], answer: 0, explain: '散失到周圍的能量冇消失，只係去咗空氣度。', onDone: () => st.complete() }));
        }
      };
      $('.lw-c', box).appendChild(rangeField({ id: 'lw-c', label: 'Q₂ 容器吸收', min: 0, max: 40, value: q2, fmt: v => `${v} kJ`, onInput: v => { q2 = v; moved.add('c'); paint(); }, cls: 'cold' }));
      $('.lw-s', box).appendChild(rangeField({ id: 'lw-s', label: 'Q₃ 散失到周圍', min: 0, max: 40, value: q3, fmt: v => `${v} kJ`, onInput: v => { q3 = v; moved.add('s'); paint(); } }));
      paint();
    }

    /* ---------- 2. mixing lab ---------- */
    {
      const st = add(station({ world: 'w6', id: 'mix', tag: '1.4 · p.14–15 · Classwork 8', title: '混合實驗室：估最後溫度', short: '混合實驗室', goal: '估中 2 次（相差 3 °C 以內）' }));
      st.add(enBox([
        { en: 'For two bodies in thermal contact, assuming [[no heat loss]] to the surroundings: energy lost by the hotter object = [[energy gained by the colder object]]', zh: '' },
        { en: 'm<sub>h</sub> c<sub>h</sub> (T<sub>h</sub> − T<sub>f</sub>) = m<sub>c</sub> c<sub>c</sub> (T<sub>f</sub> − T<sub>c</sub>), where T<sub>f</sub> is the final temperature, T<sub>h</sub> the initial temperature of the hot object, T<sub>c</sub> the initial temperature of the cold object.', zh: '' }
      ]));
      const box = html(`<div class="stack-sm">
        <div class="row mx-pre"></div>
        <svg class="svg-fit mx-svg" viewBox="0 0 600 240" style="max-width:640px;margin-inline:auto" role="img" aria-label="熱水同凍水">
          <g class="mx-hot"><rect class="mx-hw" x="60" y="120" width="140" height="90" rx="8"/><path d="M52 70 v140 q0 14 14 14 h128 q14 0 14 -14 v-140" fill="none" stroke="#cfc7f5" stroke-width="3"/><text class="mx-ht mono" x="130" y="58" text-anchor="middle" font-size="17" font-weight="800" style="fill:var(--white-hot)"></text></g>
          <g><rect class="mx-cw" x="380" y="150" width="160" height="60" rx="8"/><rect class="mx-box" x="368" y="64" width="184" height="164" rx="14" fill="none" stroke-width="7" opacity="0"/><path d="M372 70 v140 q0 14 14 14 h148 q14 0 14 -14 v-140" fill="none" stroke="#cfc7f5" stroke-width="3"/><text class="mx-ct mono" x="460" y="58" text-anchor="middle" font-size="17" font-weight="800" style="fill:var(--white-hot)"></text></g>
          <path class="mx-stream" d="" style="stroke:#ff9a7a" stroke-width="10" stroke-linecap="round" fill="none"/>
          <text class="mx-tf mono" x="300" y="34" text-anchor="middle" font-size="22" font-weight="800" style="fill:var(--qE)"></text>
        </svg>
        <div class="two"><div class="stack-sm mx-hc"></div><div class="stack-sm mx-cc"></div></div>
        <div class="row"><span class="lbl">容器</span><span class="mx-k"></span></div>
        <div class="panel-soft stack-sm"><div class="mx-g"></div><div class="row"><button type="button" class="btn hot lg" data-pour>倒！</button><button type="button" class="btn ghost sm" data-reset>重設</button><span class="score-pill">估中 <b class="mx-hits">0</b> / 2</span></div></div>
        <div class="mx-out"></div></div>`);
      st.add(box);
      const S = { mh: 0.5, Th: 90, mc: 0.2, Tc: 15, k: 'none', guess: 50 };
      const KS = { none: { m: 0, c: 0, n: '冇' }, foam: { m: 0, c: 0, n: '發泡膠杯（吸熱可以忽略）' }, iron: { m: 0.5, c: 480, n: '鐵容器 0.5 kg（c = 480）' } };
      let hits = 0, busy = false;
      const svg = $('.mx-svg', box);
      const fields = {};
      const mkField = (host, key, label, min, max, step, fmt, cls) => { const f = rangeField({ id: `mx-${key}`, label, min, max, step, value: S[key], fmt, cls, onInput: v => { S[key] = v; paint(); } }); fields[key] = f; $(host, box).appendChild(f); };
      mkField('.mx-hc', 'mh', '熱水質量', 0.1, 2, 0.1, v => `${nf(v)} kg`);
      mkField('.mx-hc', 'Th', '熱水溫度', 40, 100, 1, v => `${v} °C`);
      mkField('.mx-cc', 'mc', '凍水質量', 0.1, 2, 0.1, v => `${nf(v)} kg`, 'cold');
      mkField('.mx-cc', 'Tc', '凍水溫度', 0, 35, 1, v => `${v} °C`, 'cold');
      const kSeg = seg([{ v: 'none', label: '冇' }, { v: 'foam', label: '發泡膠杯' }, { v: 'iron', label: '鐵容器 0.5 kg' }], 'none', v => { S.k = v; paint(); });
      $('.mx-k', box).appendChild(kSeg);
      const gf = rangeField({ id: 'mx-guess', label: '你估最後溫度係', min: 0, max: 100, step: 0.5, value: 50, fmt: v => `${nf(v)} °C`, onInput: v => { S.guess = v; } });
      $('.mx-g', box).appendChild(gf);
      const Tf = () => { const K = KS[S.k]; const a = S.mh * 4200, b = S.mc * 4200, c = K.m * K.c; return (a * S.Th + (b + c) * S.Tc) / (a + b + c); };
      const setLevels = (hl, cl) => {
        const hw = $('.mx-hw', svg), cw = $('.mx-cw', svg);
        hw.setAttribute('y', 210 - hl); hw.setAttribute('height', hl); cw.setAttribute('y', 210 - cl); cw.setAttribute('height', cl);
      };
      function paint() {
        if (busy) return;
        $('.mx-hw', svg).style.fill = tempColor(S.Th); $('.mx-cw', svg).style.fill = tempColor(S.Tc);
        setLevels(18 + S.mh * 60, 18 + S.mc * 60);
        $('.mx-ht', svg).textContent = `${nf(S.mh)} kg · ${S.Th} °C`; $('.mx-ct', svg).textContent = `${nf(S.mc)} kg · ${S.Tc} °C`;
        const bx = $('.mx-box', svg); bx.setAttribute('opacity', S.k === 'none' ? 0 : 0.9); bx.style.stroke = S.k === 'iron' ? '#8b93a8' : '#f2f2f2';
        $('.mx-tf', svg).textContent = ''; $('.mx-stream', svg).setAttribute('d', '');
      }
      const presets = [
        { n: 'CW8 Q1', mh: 0.5, Th: 90, mc: 0.2, Tc: 15, k: 'none' },
        { n: 'CW8 Q2', mh: 0.5, Th: 80, mc: 0.3, Tc: 10, k: 'foam' },
        { n: 'CW8 Q4', mh: 2, Th: 60, mc: 1, Tc: 10, k: 'iron' },
        { n: '隨機', rnd: true }
      ];
      presets.forEach(p => {
        const c = html(`<button type="button" class="chip">${p.n}</button>`);
        c.onclick = () => {
          if (busy) return; SFX.click();
          const q = p.rnd ? { mh: round(rand(0.1, 2), 1), Th: randInt(50, 100), mc: round(rand(0.1, 2), 1), Tc: randInt(0, 30), k: pick(['none', 'none', 'iron']) } : p;
          Object.assign(S, { mh: q.mh, Th: q.Th, mc: q.mc, Tc: q.Tc, k: q.k });
          for (const key of ['mh', 'Th', 'mc', 'Tc']) { fields[key].input.value = S[key]; fields[key].refresh(); }
          kSeg.set(S.k); paint(); $('.mx-out', box).replaceChildren();
        };
        $('.mx-pre', box).appendChild(c);
      });
      $('[data-reset]', box).onclick = () => { if (busy) return; SFX.click(); paint(); $('.mx-out', box).replaceChildren(); };
      $('[data-pour]', box).onclick = () => {
        if (busy) return; busy = true; SFX.whoosh();
        const T = Tf(), K = KS[S.k];
        const hl0 = 18 + S.mh * 60, cl0 = 18 + S.mc * 60, t0 = performance.now();
        loop((dt, now) => {
          const p = clamp((now - t0) / 1800, 0, 1);
          setLevels(hl0 * (1 - p), Math.min(150, cl0 + hl0 * p));
          $('.mx-stream', svg).setAttribute('d', p < 1 ? `M205 ${210 - hl0 * (1 - p) - 4} Q300 30 ${410} ${210 - Math.min(150, cl0 + hl0 * p) - 2}` : '');
          const Tmix = lerp(S.Tc, T, Math.min(1, p * 1.3));
          $('.mx-cw', svg).style.fill = tempColor(Tmix);
          $('.mx-tf', svg).textContent = `${Tmix.toFixed(1)} °C`;
          if (p >= 1) { busy = false; done(T, K); return false; }
        });
      };
      const done = (T, K) => {
        const err = Math.abs(S.guess - T);
        const lost = S.mh * 4200 * (S.Th - T), gc = S.mc * 4200 * (T - S.Tc), gk = K.m * K.c * (T - S.Tc);
        const good = err <= 3;
        if (good) { hits++; $('.mx-hits', box).textContent = Math.min(2, hits); SFX.good(); addJoules(150); } else SFX.bad();
        const kTerm = K.m ? ` + ${nf(K.m)}(${K.c})(T − ${S.Tc})` : '';
        $('.mx-out', box).replaceChildren(html(`<div class="feedback ${good ? 'ok' : 'no'} pop"><div class="fb-title">最後溫度 T<sub>f</sub> = ${nf(round(T, 1))} °C　你估 ${nf(S.guess)} °C（${err <= 1 ? '神準！' : good ? '估得好近！' : `差 ${nf(round(err, 1))} °C`}）</div>
          <div class="work"><div class="ln">${nf(S.mh)}(4200)(${S.Th} − T) = ${nf(S.mc)}(4200)(T − ${S.Tc})${kTerm}</div><div class="ln">T = <b>${nf(round(T, 1))} °C</b></div></div>
          <div class="stack-sm" style="margin-top:8px">
            <div class="bar-row"><span>熱水失去</span><span class="track"><i style="width:100%;background:var(--hot)"></i></span><span class="mono">${nf(round(lost / 1000, 1))} kJ</span></div>
            <div class="bar-row"><span>凍水得到</span><span class="track"><i style="width:${lost ? gc / lost * 100 : 0}%;background:var(--cool)"></i></span><span class="mono">${nf(round(gc / 1000, 1))} kJ</span></div>
            ${K.m ? `<div class="bar-row"><span>容器得到</span><span class="track"><i style="width:${gk / lost * 100}%;background:var(--qc)"></i></span><span class="mono">${nf(round(gk / 1000, 1))} kJ</span></div>` : ''}
            <div class="small muted">失去 = 得到${K.m ? '（凍水＋容器）' : ''}：能量守恆！${S.k === 'foam' ? '發泡膠杯吸熱好少，當冇。' : ''}${S.mh === S.mc && !K.m ? '兩杯質量一樣，所以啱啱喺中間。' : ''}</div></div></div>`));
        if (hits >= 2) st.complete();
      };
      paint();
    }

    /* ---------- 3. solver coach ---------- */
    {
      const st = add(station({ world: 'w6', id: 'coach', tag: '1.4 · p.14–15 · Classwork 8', title: '解題教練：混合問題', short: '解題教練', goal: '用教練解決 Classwork 8 其中 2 題' }));
      st.add(sir('混合題萬能句：<b>energy lost by the hotter object = energy gained by the colder object</b>。寫低呢句先，再代數。', 'think'));
      const lawOpts = ['energy lost by hot = energy gained by cold', 'energy lost by hot > energy gained by cold', 'final temperature = average of the two temperatures', 'E = Pt'];
      const K = (sym, val, unit, extra = {}) => Object.assign({ sym, val, unit }, extra);
      const sb = (s, b) => sub(s, b);
      const probs = [
        { id: 'cw8a', title: 'CW8 Q1', q: '0.5 kg of water at 90 °C is added to 0.2 kg of water at 15 °C. Find the final temperature of the “mixture”. (No energy lost to the surroundings.)', zh: '',
          steps: [{ kind: 'knowns', label: '① 已知數', items: [K(sb(V.m, 'h'), 0.5, 'kg'), K(sb(V.T, 'h'), 90, '°C'), K(sb(V.m, 'c'), 0.2, 'kg'), K(sb(V.T, 'c'), 15, '°C')] },
            { kind: 'formula', label: '② 用邊個原理？', options: lawOpts, answer: 0 },
            { kind: 'calc', label: '③ 0.5(4200)(90 − T) = 0.2(4200)(T − 15)，解 T', unit: '°C', val: 68.571, rel: 0, abs: 0.1, traps: [{ v: 52.5, msg: '唔可以直接取平均，質量唔同！' }] }],
          work: ['0.5 × 4200 × (90 − T) = 0.2 × 4200 × (T − 15)', '45 − 0.5T = 0.2T − 3', 'T = 48 ÷ 0.7 = 68.6 °C'] },
        { id: 'cw8b', title: 'CW8 Q2', q: '0.5 kg of water at 80 °C is added to 0.3 kg of water at 10 °C in a polystyrene cup. What is the final temperature of the “mixture”?', zh: '發泡膠杯吸熱好少，可以唔計。',
          steps: [{ kind: 'knowns', label: '① 已知數', items: [K(sb(V.m, 'h'), 0.5, 'kg'), K(sb(V.T, 'h'), 80, '°C'), K(sb(V.m, 'c'), 0.3, 'kg'), K(sb(V.T, 'c'), 10, '°C')] },
            { kind: 'formula', label: '② 用邊個原理？', options: lawOpts, answer: 0 },
            { kind: 'calc', label: '③ 解 T', unit: '°C', val: 53.75, rel: 0, abs: 0.1, traps: [{ v: 45, msg: '唔可以直接取平均，質量唔同！' }] }],
          work: ['0.5 × 4200 × (80 − T) = 0.3 × 4200 × (T − 10)', '40 − 0.5T = 0.3T − 3', 'T = 43 ÷ 0.8 = 53.8 °C'] },
        { id: 'cw8c', title: 'CW8 Q3', q: '0.5 kg of ham at 5 °C is put into 1 kg of water at 90 °C. If the final temperature of the “mixture” is 70 °C, find the specific heat capacity of the ham. (c of water = 4200 J kg⁻¹ °C⁻¹)', zh: '水係熱的一方，火腿係凍的一方。',
          steps: [{ kind: 'calc', label: '① 水失去的能量 = 1 × 4200 × (90 − 70) =', unit: 'J', val: 84000, traps: [{ v: 378000, msg: 'ΔT 係 90 − 70 = 20 °C。' }] },
            { kind: 'formula', label: '② 用邊個原理？', options: lawOpts, answer: 0 },
            { kind: 'calc', label: '③ 84 000 = 0.5 × c × (70 − 5)，解 c', unit: 'J kg⁻¹ °C⁻¹', val: 2584.6, rel: 0.01 }],
          work: ['1 × 4200 × (90 − 70) = 0.5 × c × (70 − 5)', '84 000 = 32.5 c', 'c ≈ 2585 J kg⁻¹ °C⁻¹'] },
        { id: 'cw8d', title: 'CW8 Q4', q: '2 kg of water at 60 °C is added to 1 kg of water at 10 °C in an iron container of mass 0.5 kg. What is the final temperature of the “mixture”? (c of water = 4200, c of iron = 480 J kg⁻¹ °C⁻¹)', zh: '鐵容器同凍水一齊由 10 °C 開始升溫。',
          steps: [{ kind: 'formula', label: '① 邊條式啱？', options: ['2(4200)(60 − T) = 1(4200)(T − 10) + 0.5(480)(T − 10)', '2(4200)(60 − T) = 1(4200)(T − 10)', '2(4200)(T − 60) = 1(4200)(T − 10)', '2(4200)(60 − T) + 0.5(480)(60 − T) = 1(4200)(T − 10)'], answer: 0 },
            { kind: 'calc', label: '② 解 T', unit: '°C', val: 42.71, rel: 0, abs: 0.1, traps: [{ v: 43.33, msg: '漏咗鐵容器都要吸熱！' }] }],
          work: ['2(4200)(60 − T) = 1(4200)(T − 10) + 0.5(480)(T − 10)', '504 000 − 8400T = 4440T − 44 400', 'T = 548 400 ÷ 12 840 = 42.7 °C'] }
      ];
      st.add(coachSet(probs, 2, () => st.complete(), 'w6'));
    }
  });
