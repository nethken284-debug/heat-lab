/* ============ World 7 · Temperature–time graph (p.16) ============ */

Router.routes.w7 = main => worldPage(main, 'w7',
  sir('最後一關：溫度–時間圖。記住一句：<b>同一功率，熱容量越細，條線越斜</b>。之後就可以去打 Boss！', 'hot'),
  add => {
    /* ---------- 1. heating race ---------- */
    {
      const st = add(station({ world: 'w7', id: 'race', tag: '1.4 · p.16', title: '加熱賽跑：邊個最快去到 100 °C？', short: '加熱賽跑', goal: '估一次、跑一次，再完成填充' }));
      st.add(enBox([
        { en: 'The temperature–time graph shows the variation of temperature of a substance with time.', zh: '' },
        { en: 'With the same power supplied, a substance with a smaller heat capacity will have a [[steeper]] slope. (It takes [[less]] time to increase its temperature.)', zh: '同一功率：C 細 → 線斜 → 升溫快。' }
      ]));
      const lanes = [{ s: 'water', m: 1, col: 'var(--cool)' }, { s: 'aluminium', m: 1, col: 'var(--warm)' }, { s: 'water', m: 0.5, col: 'var(--qc)' }];
      const box = html(`<div class="stack-sm">
        <div class="race-lanes stack-sm"></div>
        <div class="race-p"></div>
        <svg class="svg-fit race-g" viewBox="0 0 430 250" style="max-width:600px;margin-inline:auto"></svg>
        <div class="row"><button type="button" class="btn hot lg" data-go>開跑！</button><span class="small race-msg muted">先撳一條跑道「估佢贏」。</span></div>
        <div class="race-out"></div></div>`);
      st.add(box);
      let P = 1000, guess = -1, running = false, raced = false, filled = false;
      const lanesEl = $('.race-lanes', box);
      const draw = () => {
        lanesEl.innerHTML = '';
        lanes.forEach((ln, i) => {
          const s = subById(ln.s);
          const row = html(`<div class="race-lane ${guess === i ? 'pick' : ''}"><span class="dot" style="background:${ln.col}"></span>
            <select aria-label="跑道 ${i + 1} 物質">${SUBSTANCES.filter(x => !['air', 'steam', 'ice'].includes(x.id)).map(x => `<option value="${x.id}" ${x.id === ln.s ? 'selected' : ''}>${x.zh}（c = ${x.c}）</option>`).join('')}</select>
            <span class="lane-m"></span><span class="small mono">C = ${nf(ln.m * s.c)} J °C⁻¹</span><button type="button" class="btn sm ${guess === i ? 'hot' : ''}" data-g="${i}">${guess === i ? '我估佢贏 ✓' : '估佢贏'}</button></div>`);
          $('select', row).onchange = e => { ln.s = e.target.value; SFX.click(); draw(); plotEmpty(); };
          $('.lane-m', row).appendChild(seg([{ v: 0.5, label: '0.5 kg' }, { v: 1, label: '1 kg' }, { v: 2, label: '2 kg' }], ln.m, v => { ln.m = Number(v); draw(); plotEmpty(); }));
          $('[data-g]', row).onclick = () => { if (running) return; guess = i; SFX.click(); draw(); $('.race-msg', box).textContent = '撳「開跑！」'; };
          lanesEl.appendChild(row);
        });
      };
      $('.race-p', box).appendChild(rangeField({ id: 'race-p', label: '每條跑道的加熱器功率（一樣）', min: 200, max: 2000, step: 100, value: P, fmt: v => `${nf(v)} W`, onInput: v => { P = v; plotEmpty(); } }));
      const g = $('.race-g', box);
      let A, paths;
      const tEnd = () => Math.max(...lanes.map(ln => ln.m * subById(ln.s).c * 80 / P));
      const plotEmpty = () => {
        if (running) return;
        g.innerHTML = '';
        const tm = tEnd();
        const step = tm > 600 ? 200 : tm > 300 ? 100 : tm > 120 ? 50 : tm > 40 ? 10 : 5;
        const xt = []; for (let x = 0; x <= tm * 1.05; x += step) xt.push(x);
        A = axes(g, { box: [46, 20, 360, 190], x: [0, tm * 1.05], y: [0, 110], xt, yt: [20, 40, 60, 80, 100], xl: 'time / s', yl: 'temperature / °C', grid: true });
        svgEl('path', { d: `M${A.sx(0)} ${A.sy(100)} H${A.sx(tm * 1.05)}`, style: 'stroke:var(--white-hot)', 'stroke-dasharray': '6 4', 'stroke-width': 1.5 }, g);
        paths = lanes.map(ln => svgEl('path', { fill: 'none', style: `stroke:${ln.col}`, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g));
      };
      draw(); plotEmpty();
      $('[data-go]', box).onclick = () => {
        if (running) return;
        if (guess < 0) { toast('先估邊個贏！', 'bad'); SFX.bad(); return; }
        plotEmpty(); running = true; SFX.whoosh();
        const tm = tEnd(), dur = 5, t0 = performance.now();
        const Cs = lanes.map(ln => ln.m * subById(ln.s).c);
        loop((dt, now) => {
          const t = Math.min(tm, (now - t0) / 1000 / dur * tm);
          lanes.forEach((ln, i) => {
            const tf = Math.min(t, Cs[i] * 80 / P);
            paths[i].setAttribute('d', `M${A.sx(0)} ${A.sy(20)} L${A.sx(tf)} ${A.sy(20 + P * tf / Cs[i])}`);
          });
          if (t >= tm) { running = false; finish(Cs); return false; }
        });
      };
      const finish = Cs => {
        raced = true;
        const order = Cs.map((c, i) => i).sort((a, b) => Cs[a] - Cs[b]);
        const win = order[0], tie = Cs.filter(c => Math.abs(c - Cs[win]) < 1e-9).length > 1;
        const ok = Math.abs(Cs[guess] - Cs[win]) < 1e-9;
        ok ? (SFX.win(), Confetti.burst(70)) : SFX.bad();
        $('.race-out', box).replaceChildren(html(`<div class="feedback ${ok ? 'ok' : 'no'} pop"><div class="fb-title">${ok ? '估中！' : '估錯咗'}${tie ? '（有打和）' : ''}</div>
          名次：${order.map((i, k) => `${k + 1}. ${subById(lanes[i].s).zh} ${nf(lanes[i].m)} kg（C = ${nf(Cs[i])} J °C⁻¹，${nf(round(Cs[i] * 80 / P, 1))} s）`).join('<br>')}
          <div class="small" style="margin-top:6px">斜率 = P ÷ C：<b>C 最細</b>的最斜、最快。留意同一種物質，<b>質量細</b>啲 C 都細，一樣會快啲。</div></div>`));
        if (filled) st.complete();
      };
      st.add(fillIn({ text: 'With the same power supplied, a substance with a smaller heat capacity will have a {{steeper}} slope. (It takes {{less}} time to increase its temperature.)', bank: ['steeper', 'gentler', 'less', 'more'], onDone: () => { filled = true; if (raced) st.complete(); else toast('仲要跑一次賽跑！', 'good'); } }));
    }

    /* ---------- 2. read the graph ---------- */
    {
      const st = add(station({ world: 'w7', id: 'read', tag: '1.4 · p.16 · 課堂例子', title: '讀圖計比熱容', short: '讀圖計 c', goal: '用教練計出 X 的比熱容' }));
      st.add('<p>課本 p.16 的圖（課堂例子）：一個 <b>200 W</b> 加熱器加熱 <b>0.4 kg</b> 物質 X，<b>100 s</b> 內溫度由 25 °C 升到 75 °C。拉動時間讀圖：</p>');
      const g = html('<svg class="svg-fit" viewBox="0 0 420 250" style="max-width:480px"></svg>');
      st.add(g);
      const A = axes(g, { box: [50, 20, 320, 190], x: [0, 110], y: [0, 90], xt: [0, 20, 40, 60, 80, 100], yt: [25, 50, 75], xl: 'time / s', yl: 'temperature / °C', grid: true });
      svgEl('path', { d: `M${A.sx(0)} ${A.sy(25)} L${A.sx(100)} ${A.sy(75)}`, style: 'stroke:var(--text)', 'stroke-width': 3 }, g);
      const guide = svgEl('path', { style: 'stroke:var(--warm)', 'stroke-width': 2, 'stroke-dasharray': '4 4', fill: 'none' }, g);
      const dot = svgEl('circle', { r: 6, style: 'fill:var(--warm)' }, g);
      const info = html('<div class="readout small"></div>');
      st.add(rangeField({ id: 'rd-t', label: '時間 t', min: 0, max: 100, step: 5, value: 50, fmt: v => `${v} s`, onInput: v => mv(v) }));
      st.add(info);
      function mv(t) { const T = 25 + t / 2; guide.setAttribute('d', `M${A.sx(t)} ${A.sy(0)} V${A.sy(T)} H${A.sx(0)}`); dot.setAttribute('cx', A.sx(t)); dot.setAttribute('cy', A.sy(T)); info.innerHTML = `t = ${t} s → T = ${nf(T)} °C　|　已供應能量 E = P t = 200 × ${t} = <b style="color:var(--qE)">${nf(200 * t)} J</b>`; }
      mv(50);
      st.add(coach({ id: 'w7read', q: 'Power = 200 W, mass of X = 0.4 kg. From the graph, the temperature rises from 25 °C to 75 °C in 100 s. Find the specific heat capacity of X.', zh: '兩步：E = Pt，再 c = E ÷ (mΔT)。',
        steps: [{ kind: 'knowns', label: '① 由圖讀出', items: [{ sym: V.t, val: 100, unit: 's' }, { sym: V.dT, val: 50, unit: '°C', traps: [{ v: 75, msg: 'ΔT 係 75 − 25 = 50！' }] }] },
          { kind: 'calc', label: '② E = P t', unit: 'J', val: 20000 },
          { kind: 'calc', label: '③ c = E ÷ (m ΔT)', unit: 'J kg⁻¹ °C⁻¹', val: 1000, traps: [{ v: 666.67, msg: 'ΔT 要用 50 °C。' }, { v: 400, msg: '再睇清楚：c = 20 000 ÷ (0.4 × 50)。' }] }],
        work: ['E = P t = 200 × 100 = 20 000 J', 'c = E ÷ (m ΔT) = 20 000 ÷ (0.4 × 50)', '= 1000 J kg⁻¹ °C⁻¹'] }, () => st.complete()));
    }

    /* ---------- 3. Classwork 9 ---------- */
    {
      const st = add(station({ world: 'w7', id: 'cw9', tag: '1.4 · p.16 · Classwork 9', title: 'Classwork 9：睇圖揀答案', short: 'Classwork 9', goal: '三題全部答啱' }));
      let n = 0; const one = () => { n++; if (n >= 3) st.complete(); };
      /* Q1 with a slope tool */
      const q1 = BANK.find(b => b.id === 'w7-cw9a');
      const lines = { P: [[0, 50], [10, 100]], Q: [[0, 0], [10, 100]], R: [[0, 50], [20, 100]], S: [[0, 0], [20, 100]] };
      const gslot = html('<div class="graph-q"></div>');
      const sinfo = html('<div class="small readout">撳下面字母睇條線的斜率。</div>');
      const drawQ1 = hl => {
        gslot.innerHTML = lineGraph({ x: [0, 22], y: [0, 112], xt: [10, 20], yt: [50, 100], xl: 'Time / minute', yl: 'Temperature / °C', mono: true,
          lines: Object.entries(lines).map(([k, p]) => ({ p, label: k, at: { P: [4, 70], Q: [2.4, 24], R: [15, 87.5], S: [15, 75] }[k], dx: { P: -16, Q: -18, R: -4, S: 8 }[k], dy: { P: -6, Q: 0, R: -10, S: 14 }[k] })),
          guides: [[[0, 100], [20, 100]], [[10, 0], [10, 100]], [[20, 0], [20, 100]]] });
        if (hl) { $$('path', gslot).filter(p => p.getAttribute('stroke-width') === '2.6').forEach((p, i) => { if (Object.keys(lines)[i] === hl) { p.style.stroke = 'var(--warm)'; p.setAttribute('stroke-width', '5'); } }); }
      };
      drawQ1();
      const tool = html('<div class="row"></div>');
      Object.entries(lines).forEach(([k, [[x0, y0], [x1, y1]]]) => {
        const b = html(`<button type="button" class="chip">${k}</button>`);
        b.onclick = () => { SFX.tick(); drawQ1(k); const s = (y1 - y0) / (x1 - x0); sinfo.innerHTML = `${k}：斜率 = ${y1 - y0} °C ÷ ${x1 - x0} min = <b>${nf(s)} °C/min</b>${k === 'R' ? '（最平！）' : ''}`; };
        tool.appendChild(b);
      });
      st.add(`<div class="lbl">Q1</div>`);
      st.add(`<div class="q-text">${q1.q}</div>`); st.add(gslot); st.add(tool); st.add(sinfo);
      st.add(mcq({ options: ['P', 'Q', 'R', 'S'], answer: 2, cols2: true, explain: q1.explain, onDone: one }));
      for (const id of ['w7-cw9b', 'w7-cw9c']) {
        const q = BANK.find(b => b.id === id);
        st.add(`<div class="lbl">${id === 'w7-cw9b' ? 'Q2' : 'Q3'}</div>`);
        st.add(`<div class="q-text">${q.q}</div>`); st.add(`<div class="graph-q">${q.graph}</div>`);
        st.add(mcq({ options: q.options, answer: q.answer, cols2: true, explain: q.explain, onDone: one }));
      }
    }
  });
