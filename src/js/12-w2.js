/* ============ World 2 · Thermometers (p.5–8) ============ */

/* interactive axes inside an existing <svg>; returns scale functions */
function axes(svg, s) {
  const [L, T, W, H] = s.box;               // plot area in viewBox units
  const sx = x => L + (x - s.x[0]) / (s.x[1] - s.x[0]) * W;
  const sy = y => T + H - (y - s.y[0]) / (s.y[1] - s.y[0]) * H;
  const g = svgEl('g', {}, svg);
  if (s.grid) {
    for (const x of s.xt) svgEl('path', { d: `M${sx(x)} ${T} V${T + H}`, style: 'stroke:var(--line)', 'stroke-width': 1 }, g);
    for (const y of s.yt) svgEl('path', { d: `M${L} ${sy(y)} H${L + W}`, style: 'stroke:var(--line)', 'stroke-width': 1 }, g);
  }
  const ax0 = s.y[0] <= 0 && s.y[1] >= 0 ? sy(0) : T + H;
  const ay0 = s.x[0] <= 0 && s.x[1] >= 0 ? sx(0) : L;
  svgEl('path', { d: `M${ay0} ${T - 8} V${T + H} M${L} ${ax0} H${L + W + 10}`, fill: 'none', style: 'stroke:var(--muted)', 'stroke-width': 1.6 }, g);
  for (const x of s.xt) { svgEl('path', { d: `M${sx(x)} ${ax0} v5`, style: 'stroke:var(--muted)' }, g); const t = svgEl('text', { x: sx(x), y: ax0 + 18, 'text-anchor': 'middle', 'font-size': 12, style: 'fill:var(--muted)' }, g); t.textContent = s.xf ? s.xf(x) : x; }
  for (const y of s.yt) { svgEl('path', { d: `M${ay0} ${sy(y)} h-5`, style: 'stroke:var(--muted)' }, g); const t = svgEl('text', { x: ay0 - 8, y: sy(y) + 4, 'text-anchor': 'end', 'font-size': 12, style: 'fill:var(--muted)' }, g); t.textContent = s.yf ? s.yf(y) : y; }
  const xl = svgEl('text', { x: L + W + 10, y: ax0 + 34, 'text-anchor': 'end', 'font-size': 12, style: 'fill:var(--muted)' }, g); xl.textContent = s.xl || '';
  const yl = svgEl('text', { x: ay0 - 6, y: T - 14, 'text-anchor': 'start', 'font-size': 12, style: 'fill:var(--muted)' }, g); yl.textContent = s.yl || '';
  return { sx, sy, g };
}

Router.routes.w2 = main => worldPage(main, 'w2',
  sir('第 2 關：溫度計點樣「睇」到溫度？點樣幫一支冇刻度的溫度計校準？仲有：點樣整一支更<b>靈敏</b>的溫度計。', 'think'),
  add => {
    /* ---------- 1. thermometric properties ---------- */
    {
      const st = add(station({ world: 'w2', id: 'props', tag: '1.1C · p.5', title: '邊啲性質會跟住溫度變？', short: '測溫性質', goal: '將溫度由最低拉到最高，再答一條選擇題' }));
      st.add(enBox([
        { en: '<b>Thermometer</b> – an instrument using the [[thermometric properties]] of matter to measure [[temperature]] (it\'s an objective measurement).', zh: '溫度計：利用物質的測溫性質來量度溫度（客觀量度）。' },
        { en: 'Any substance with a physical property (e.g. length, volume, pressure of gas, resistance of metal, colour of liquid crystal, …) that [[changes with temperature]] can be used to make a thermometer.', zh: '任何會隨溫度改變的物理性質，都可以用來製造溫度計。' }
      ]));
      const grid = html(`<div class="prop-grid">
        <div class="prop"><div class="lbl">液柱長度／體積</div><svg viewBox="0 0 120 70" class="svg-fit"><rect x="8" y="28" width="104" height="14" rx="7" fill="#1d1640" stroke="#cfc7f5" stroke-width="2"/><circle cx="14" cy="35" r="11" style="fill:var(--hot)"/><rect class="p-len" x="14" y="31" width="20" height="8" style="fill:var(--hot)"/></svg><div class="small mono p-a">T↑ → L↑</div></div>
        <div class="prop"><div class="lbl">氣體壓強</div><svg viewBox="0 0 120 70" class="svg-fit"><path d="M20 60 A40 40 0 0 1 100 60" fill="none" stroke="#cfc7f5" stroke-width="3"/><line class="p-needle" x1="60" y1="60" x2="60" y2="26" style="stroke:var(--warm)" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="60" r="5" style="fill:var(--warm)"/></svg><div class="small mono">T↑ → p↑</div></div>
        <div class="prop"><div class="lbl">金屬電阻</div><svg viewBox="0 0 120 70" class="svg-fit"><rect x="20" y="10" width="80" height="50" rx="6" fill="none" stroke="#cfc7f5" stroke-width="2"/><rect class="p-rm" x="30" y="40" width="60" height="14" rx="3" style="fill:var(--qP)"/></svg><div class="small mono">T↑ → R↑</div></div>
        <div class="prop"><div class="lbl">半導體電阻 <span class="tiny dim">課堂筆記</span></div><svg viewBox="0 0 120 70" class="svg-fit"><rect x="20" y="10" width="80" height="50" rx="6" fill="none" stroke="#cfc7f5" stroke-width="2"/><rect class="p-rs" x="30" y="40" width="60" height="14" rx="3" style="fill:var(--qc)"/></svg><div class="small mono">T↑ → R↓</div></div>
        <div class="prop"><div class="lbl">液晶顏色</div><svg viewBox="0 0 120 70" class="svg-fit"><rect class="p-lc" x="16" y="16" width="88" height="38" rx="8"/></svg><div class="small mono">T 變 → 顏色變</div></div>
      </div>`);
      st.add(grid);
      let lo = false, hi = false, asked = false;
      const ask = html('<div></div>');
      const r = rangeField({ id: 'tp-t', label: '溫度', min: 0, max: 100, value: 30, fmt: v => `${v} °C`, onInput: v => paint(v) });
      st.add(r); st.add(ask);
      function paint(T) {
        const k = T / 100;
        $('.p-len', grid).setAttribute('width', 14 + k * 80);
        const th = Math.PI * (1 - k);
        const n = $('.p-needle', grid); n.setAttribute('x2', 60 + 34 * Math.cos(th)); n.setAttribute('y2', 60 - 34 * Math.sin(th));
        $('.p-rm', grid).setAttribute('height', 6 + k * 40); $('.p-rm', grid).setAttribute('y', 54 - k * 40);
        $('.p-rs', grid).setAttribute('height', 46 - k * 40); $('.p-rs', grid).setAttribute('y', 14 + k * 40);
        $('.p-lc', grid).style.fill = `hsl(${Math.round(10 + k * 220)}, 80%, 55%)`;
        if (T <= 10) lo = true; if (T >= 90) hi = true;
        if (lo && hi && !asked) {
          asked = true;
          ask.appendChild(mcq({ q: 'Which of the following is NOT a thermometric property mentioned in the textbook?', zh: '邊個唔係課本提到的測溫性質？', options: ['mass of a liquid', 'length of a liquid column', 'pressure of a gas', 'colour of a liquid crystal'], answer: 0, explain: '質量唔會跟住溫度變，所以唔可以用嚟做溫度計。', onDone: () => st.complete() }));
        }
      }
      paint(30);
    }

    /* ---------- 2. thermal equilibrium ---------- */
    {
      const st = add(station({ world: 'w2', id: 'equil', tag: '1.1C · p.5', title: '熱平衡：幾時先好讀溫度計？', short: '熱平衡', goal: '等讀數唔再變先撳「讀數！」' }));
      st.add(enBox([
        { en: '<b>Thermal equilibrium</b>: Two bodies in contact reach the same [[temperature]] when the time is long enough.', zh: '熱平衡：兩件接觸的物體，時間夠長就會去到同一個溫度。' },
        { en: 'Temperature should be read when [[thermal equilibrium]] is reached.', zh: '要等到熱平衡先讀溫度。' }
      ]));
      const box = html(`<div class="two"><div class="stack-sm">
          <svg class="svg-fit eq-svg" viewBox="0 0 300 220" style="max-width:340px">
            <rect x="70" y="110" width="160" height="96" rx="10" style="fill:#c43a4c" opacity=".55"/>
            <path d="M64 80 v116 q0 14 14 14 h144 q14 0 14 -14 v-116" fill="none" stroke="#cfc7f5" stroke-width="3"/>
            <g class="steam" style="stroke:#ffb4b4" stroke-width="3" fill="none" stroke-linecap="round"><path d="M110 96 q-8 -12 0 -24"/><path d="M190 96 q-8 -12 0 -24" style="animation-delay:.9s"/></g>
            <g class="eq-th" style="transition:transform .8s"><rect x="138" y="10" width="24" height="170" rx="12" fill="#1d1640" stroke="#cfc7f5" stroke-width="2.5"/><circle cx="150" cy="186" r="15" style="fill:var(--hot)"/><rect class="eq-col" x="145" y="120" width="10" height="66" style="fill:var(--hot)"/></g>
          </svg></div>
        <div class="stack-sm"><div class="readout"><div class="small muted">溫度計讀數</div><div class="big eq-read">24.0 °C</div></div>
          <svg class="svg-fit" viewBox="0 0 300 130"><g class="eq-axes"></g><path class="eq-line" fill="none" style="stroke:var(--warm)" stroke-width="2.5"/></svg>
          <div class="row"><button type="button" class="btn cold" data-a="in">放入熱水</button><button type="button" class="btn hot" data-a="read" disabled>讀數！</button><button type="button" class="btn ghost sm" data-a="again">換一杯</button></div>
          <div class="eq-fb"></div></div></div>`);
      st.add(box);
      const axSvg = $('.eq-axes', box).ownerSVGElement;
      const A = axes(axSvg, { box: [36, 14, 250, 90], x: [0, 10], y: [20, 100], xt: [0, 5, 10], yt: [20, 60, 100], xl: '時間 / s', yl: '讀數 / °C' });
      let Tw = 0, t0 = 0, running = false, pts = [], stopLoop = null;
      const read = $('.eq-read', box), col = $('.eq-col', box), line = $('.eq-line', box), fb = $('.eq-fb', box);
      const setCol = T => { const h = 20 + (T - 20) / 80 * 130; col.setAttribute('y', 186 - h); col.setAttribute('height', h); };
      const reset = () => {
        if (stopLoop) stopLoop(); running = false; pts = [];
        Tw = randInt(48, 88) + pick([0, 0.5]); read.textContent = '24.0 °C'; setCol(24); line.setAttribute('d', '');
        $('.eq-th', box).style.transform = 'translateY(-70px)'; fb.replaceChildren();
        $('[data-a="in"]', box).disabled = false; $('[data-a="read"]', box).disabled = true;
      };
      $('[data-a="in"]', box).onclick = () => {
        SFX.whoosh(); $('[data-a="in"]', box).disabled = true; $('[data-a="read"]', box).disabled = false;
        $('.eq-th', box).style.transform = 'translateY(0)';
        running = true; t0 = performance.now();
        stopLoop = loop((dt, now) => {
          if (!running) return false;
          const t = (now - t0) / 1000;
          const T = Tw - (Tw - 24) * Math.exp(-t / 1.1);
          read.textContent = `${T.toFixed(1)} °C`; setCol(T);
          if (t <= 10) { pts.push(`${A.sx(t)} ${A.sy(T)}`); line.setAttribute('d', 'M' + pts.join(' L')); }
          box._T = T;
        });
      };
      $('[data-a="read"]', box).onclick = () => {
        const T = box._T || 24;
        if (Math.abs(T - Tw) > 0.15) {
          SFX.bad();
          fb.replaceChildren(html(`<div class="feedback no pop"><div class="fb-title">太早！你讀到 ${T.toFixed(1)} °C</div>讀數仲喺度升緊——溫度計同熱水<b>未達到熱平衡</b>。等多陣，直到讀數唔再變。</div>`));
        } else {
          running = false; SFX.good();
          fb.replaceChildren(html(`<div class="feedback ok pop"><div class="fb-title">讀得啱時候！水溫 = ${Tw.toFixed(1)} °C</div>讀數已經唔再變：溫度計同熱水達到<b>熱平衡</b>（同一溫度）。</div>`));
          $('[data-a="read"]', box).disabled = true;
          st.complete();
        }
      };
      $('[data-a="again"]', box).onclick = () => { SFX.click(); reset(); };
      reset();
    }

    /* ---------- 3. calibration lab ---------- */
    {
      const st = add(station({ world: 'w2', id: 'calib', tag: '1.1C · p.5–7 · Example 1 · Classwork 2', title: '校準實驗室：幫冇刻度的溫度計計溫度', short: '校準實驗室', goal: '用比例法或圖解法解決 2 杯神秘液體' }));
      st.add(enBox([
        { en: 'To calibrate an uncalibrated thermometer, assume that the thermometric property changes [[uniformly]].', zh: '校準時假設測溫性質隨溫度均勻改變。' },
        { en: '<b>Proportional method</b>: (T₁ − T₂) / (l₁ − l₂) = (T − T₂) / (l − l₂), where l is a thermometric property used by the thermometer.', zh: '比例法。' },
        { en: '<b>Graphical method</b>: the line joining the lower fixed point and upper fixed point is a [[straight line]]. Temperatures outside 0 to 100 °C can be obtained by [[extending the straight line]] below 0 °C or above 100 °C.', zh: '圖解法：連接兩個定點成直線；0–100 °C 以外就延長直線。' }
      ]));
      const presets = [
        { name: 'Example 1', l0: 5.0, l1: 25.0, l: 13.0 },
        { name: 'Classwork 2', l0: 3.2, l1: 18.2, l: 7.7 }
      ];
      const lab = html(`<div class="stack-sm">
        <div class="row picker"></div>
        <div class="two">
          <div><svg class="svg-fit cal-svg" viewBox="0 0 300 380" style="max-width:320px;margin-inline:auto" role="img" aria-label="溫度計同尺">
            <g class="cal-bath"></g>
            <rect x="60" y="8" width="28" height="330" rx="14" fill="#1d1640" stroke="#cfc7f5" stroke-width="2.5"/>
            <circle cx="74" cy="346" r="18" style="fill:var(--cool)"/><rect class="cal-col" x="69" y="300" width="10" height="46" style="fill:var(--cool)"/>
            <g class="cal-ruler"></g><path class="cal-ptr" d="" style="stroke:var(--warm)" stroke-width="2"/><text class="cal-ptxt mono" x="104" y="0" font-size="13" style="fill:var(--warm)"></text>
          </svg></div>
          <div class="stack-sm">
            <div class="row"><button type="button" class="btn cold sm" data-s="ice">① 溶化中的冰</button><button type="button" class="btn hot sm" data-s="boil">② 沸水</button><button type="button" class="btn sm" data-s="x">③ 神秘液體</button></div>
            <table class="tbl"><tr><th>情況</th><th>液柱長度</th></tr><tr><td>0 °C（冰）</td><td class="num-cell c-l0">?</td></tr><tr><td>100 °C（沸水）</td><td class="num-cell c-l1">?</td></tr><tr><td>神秘液體 T = ?</td><td class="num-cell c-l">?</td></tr></table>
            <div class="cal-work" hidden></div>
          </div>
        </div></div>`);
      st.add(lab);
      const svg = $('.cal-svg', lab);
      const BOT = 346, cmPx = 10, yL = l => BOT - 24 - l * cmPx;    // 0 cm mark near the bulb top
      let ruler = '';
      for (let c = 0; c <= 30; c++) { const y = yL(c); ruler += `<path d="M92 ${y} H${c % 5 === 0 ? 108 : 100}" style="stroke:var(--dim)" stroke-width="${c % 5 === 0 ? 1.6 : 1}"/>`; if (c % 5 === 0) ruler += `<text x="112" y="${y + 4}" font-size="11" style="fill:var(--muted)" class="mono">${c} cm</text>`; }
      $('.cal-ruler', svg).innerHTML = ruler;
      const col = $('.cal-col', svg), bath = $('.cal-bath', svg), ptr = $('.cal-ptr', svg), ptxt = $('.cal-ptxt', svg);
      let cur = null, seen = {}, solved = new Set();
      const setLen = (l, ms = 1100) => {
        const top = yL(l);
        tweenAttr(col, { y: top, height: BOT - top }, ms, () => {
          ptr.setAttribute('d', `M84 ${top} H160`); ptxt.setAttribute('x', 164); ptxt.setAttribute('y', top + 4); ptxt.textContent = `${l.toFixed(1)} cm`;
        });
      };
      const bathHTML = kind => {
        const c = { ice: '#2f63c9', boil: '#c43a4c', x: '#7a4fd6' }[kind];
        return `<rect x="10" y="250" width="128" height="122" rx="10" style="fill:${c}" opacity=".45"/><path d="M6 236 v124 q0 16 16 16 h104 q16 0 16 -16 v-124" fill="none" stroke="#cfc7f5" stroke-width="2.5"/>
          ${kind === 'ice' ? '<rect x="18" y="242" width="22" height="20" rx="4" fill="#e4f3ff"/><rect x="104" y="244" width="20" height="18" rx="4" fill="#e4f3ff"/>' : ''}
          ${kind === 'boil' ? '<circle cx="28" cy="330" r="5" fill="#ffd0d0"/><circle cx="120" cy="300" r="4" fill="#ffd0d0"/><circle cx="110" cy="350" r="6" fill="#ffd0d0"/>' : ''}
          ${kind === 'x' ? '<text x="40" y="300" font-size="30" font-weight="800" style="fill:var(--white-hot)">?</text>' : ''}`;
      };
      const picker = $('.picker', lab);
      const load = (p, label) => {
        cur = p; seen = {}; SFX.click();
        $('.c-l0', lab).textContent = '?'; $('.c-l1', lab).textContent = '?'; $('.c-l', lab).textContent = '?';
        bath.innerHTML = ''; setLen(2, 400); ptxt.textContent = '';
        const w = $('.cal-work', lab); w.hidden = true; w.replaceChildren();
        $$('.chip', picker).forEach(c => c.classList.toggle('sel', c.dataset.n === label));
      };
      const randomP = () => {
        const l0 = round(rand(2.5, 6), 1), span = randInt(14, 20), T = pick([randInt(5, 95), randInt(5, 95), pick([-10, -15, 110, 115])]);
        const l = round(l0 + span * T / 100, 1);
        return { name: '隨機', l0, l1: round(l0 + span, 1), l };
      };
      [...presets, { name: '隨機挑戰' }].forEach(p => {
        const c = html(`<button type="button" class="chip" data-n="${p.name}">${p.name}</button>`);
        c.onclick = () => load(p.l0 ? p : randomP(), p.name);
        picker.appendChild(c);
      });
      const step = k => {
        if (!cur) return;
        if (k === 'x' && !(seen.ice && seen.boil)) { toast('先量兩個定點（冰同沸水）！', 'bad'); SFX.bad(); return; }
        bath.innerHTML = bathHTML(k); SFX.whoosh();
        const l = k === 'ice' ? cur.l0 : k === 'boil' ? cur.l1 : cur.l;
        setLen(l);
        later(1150, () => {
          seen[k] = true;
          $(k === 'ice' ? '.c-l0' : k === 'boil' ? '.c-l1' : '.c-l', lab).textContent = `${l.toFixed(1)} cm`;
          if (k === 'x') showWork();
        });
      };
      $$('[data-s]', lab).forEach(b => b.onclick = () => step(b.dataset.s));
      const showWork = () => {
        const { l0, l1, l } = cur; const T = (l - l0) / (l1 - l0) * 100;
        const w = $('.cal-work', lab); w.hidden = false;
        const methodSlot = html('<div class="stack-sm"></div>');
        const tabs = seg([{ v: 'p', label: '比例法' }, { v: 'g', label: '圖解法' }], 'p', v => draw(v));
        w.replaceChildren(tabs, methodSlot);
        const ansBox = numAnswer({ id: 'cal-ans', label: '神秘液體的溫度 T =', unit: '°C', answer: T, abs: 0.5, rel: 0,
          traps: [{ test: x => approx(x, l / l1 * 100, 0, 0.5) && Math.abs(l0) > 0.05, msg: '要減去 0 °C 時的長度 l₀ 先除！' }],
          hint: '(T − 0)/(l − l₀) = (100 − 0)/(l₁₀₀ − l₀)',
          reveal: `T = ${frac(`${l.toFixed(1)} − ${l0.toFixed(1)}`, `${l1.toFixed(1)} − ${l0.toFixed(1)}`)} × 100 = <b>${nf(round(T, 1))} °C</b>`,
          onOk: () => { solved.add(`${l0}-${l1}-${l}`); addJoules(150); if (solved.size >= 2) st.complete(); else toast('再解多一杯就完成！', 'good'); } });
        w.appendChild(ansBox);
        function draw(v) {
          methodSlot.replaceChildren();
          if (v === 'p') {
            methodSlot.appendChild(html(`<div class="work"><div class="ln">${frac('T₁ − T₂', 'l₁ − l₂')} = ${frac('T − T₂', 'l − l₂')}</div>
              <div class="ln">${frac('100 − 0', `${l1.toFixed(1)} − ${l0.toFixed(1)}`)} = ${frac('T − 0', `${l.toFixed(1)} − ${l0.toFixed(1)}`)}</div>
              <div class="note">用上面條式解 T（T₁ = 100 °C、T₂ = 0 °C）。</div></div>`));
          } else {
            const gsvg = html('<svg class="svg-fit" viewBox="0 0 340 250" style="max-width:420px"></svg>');
            methodSlot.appendChild(gsvg);
            const lmax = Math.ceil((Math.max(l1, l) + 2) / 5) * 5;
            const A = axes(gsvg, { box: [44, 20, 270, 186], x: [-20, 120], y: [0, lmax], xt: [-20, 0, 20, 40, 60, 80, 100, 120], yt: Array.from({ length: lmax / 5 + 1 }, (_, i) => i * 5), xl: 'T / °C', yl: 'L / cm', grid: true });
            const Lat = Tq => l0 + (l1 - l0) * Tq / 100;
            svgEl('path', { d: `M${A.sx(-20)} ${A.sy(Lat(-20))} L${A.sx(120)} ${A.sy(Lat(120))}`, style: 'stroke:var(--dim)', 'stroke-dasharray': '5 5', 'stroke-width': 2 }, gsvg);
            svgEl('path', { d: `M${A.sx(0)} ${A.sy(l0)} L${A.sx(100)} ${A.sy(l1)}`, style: 'stroke:var(--cool)', 'stroke-width': 3 }, gsvg);
            for (const [x, y] of [[0, l0], [100, l1]]) svgEl('circle', { cx: A.sx(x), cy: A.sy(y), r: 5, style: 'fill:var(--cool)' }, gsvg);
            svgEl('path', { d: `M${A.sx(-20)} ${A.sy(l)} H${A.sx(120)}`, style: 'stroke:var(--qc)', 'stroke-width': 1.5, 'stroke-dasharray': '3 4' }, gsvg);
            const vline = svgEl('path', { style: 'stroke:var(--warm)', 'stroke-width': 2 }, gsvg);
            const dot = svgEl('circle', { r: 6, style: 'fill:var(--warm)' }, gsvg);
            const info = html('<div class="small mono"></div>');
            const r = rangeField({ id: 'cal-g', label: '沿住條線行（拉動 T）', min: -20, max: 120, step: 0.5, value: 50, fmt: v => `${v} °C`, onInput: v => mv(v) });
            methodSlot.append(r, info, html('<p class="small muted">紫色虛線係神秘液體的長度 l。拉到橙點啱啱掂到紫線，就讀到 T。</p>'));
            function mv(v) {
              const Lv = Lat(v);
              vline.setAttribute('d', `M${A.sx(v)} ${A.sy(0)} V${A.sy(Lv)} H${A.sx(-20)}`); dot.setAttribute('cx', A.sx(v)); dot.setAttribute('cy', A.sy(Lv));
              const hit = Math.abs(Lv - l) < (l1 - l0) * 0.004 + 0.02;
              info.innerHTML = `T = ${v} °C → L = ${Lv.toFixed(2)} cm ${hit ? '<b class="good">← 掂到喇！</b>' : ''}`;
            }
            mv(50);
          }
        }
        draw('p');
      };
      load(presets[0], 'Example 1');
    }

    /* ---------- 4. types of thermometers ---------- */
    {
      const st = add(station({ world: 'w2', id: 'types', tag: '1.1D · p.8 · Classwork 3', title: '溫度計大比拼', short: '溫度計種類', goal: '「揀啱溫度計」6 題答啱 5 題' }));
      st.add(`<div class="two">
        <div class="panel-soft stack-sm"><b>Liquid-in-glass thermometer 液體玻璃溫度計</b><span class="small muted">（mercury or alcohol, including clinical thermometers）</span>
          <svg viewBox="0 0 320 70" class="svg-fit"><rect x="10" y="22" width="270" height="22" rx="11" fill="#1d1640" stroke="#cfc7f5" stroke-width="2"/><ellipse cx="282" cy="33" rx="26" ry="17" style="fill:var(--cool)"/><rect x="150" y="29" width="130" height="8" style="fill:var(--cool)"/>
            <path d="M60 33 v24 M200 33 v24 M296 40 l10 14" style="stroke:var(--muted)"/><text x="60" y="68" font-size="12" text-anchor="middle" style="fill:var(--muted)">vacuum</text><text x="200" y="68" font-size="12" text-anchor="middle" style="fill:var(--muted)">thread</text><text x="300" y="18" font-size="12" text-anchor="middle" style="fill:var(--muted)">bulb</text></svg>
          <div class="small"><b>原理：</b>Length (volume) of a liquid column increases with temperature.（T↑ → L↑）</div>
          <div class="small"><b>範圍：</b>mercury −37 °C 至 356 °C；alcohol −115 °C 至 110 °C</div>
          <div class="small"><b>用途：</b>weather recording, laboratory uses</div>
          <div class="tiny dim">課堂筆記：範圍數字唔使死背，但要知酒精量到較低溫、水銀量到較高溫。</div></div>
        <div class="panel-soft stack-sm"><b>Infrared thermometer 紅外線溫度計</b>
          <svg viewBox="0 0 320 70" class="svg-fit"><rect x="60" y="14" width="150" height="42" rx="20" fill="#e9e4fb"/><path d="M60 26 l-30 -6 v30 l30 -6z" fill="#e9e4fb"/><rect x="120" y="24" width="34" height="20" rx="3" fill="#2a2350"/><text x="137" y="39" font-size="11" text-anchor="middle" fill="#9effc0" class="mono">37.0</text>
            <path d="M24 35 q-8 -8 0 -16 M14 35 q-8 -8 0 -16" style="stroke:var(--hot)" stroke-width="2" fill="none"/></svg>
          <div class="small"><b>原理：</b>Hotter objects emit more infrared radiation.（T↑ → 紅外線量↑）</div>
          <div class="small"><b>用途：</b>body temperature measuring</div>
          <div class="tiny dim">課堂筆記：可以量好闊的溫度範圍。</div></div></div>`);
      /* range chart */
      const chart = html(`<div class="stack-sm"><svg class="svg-fit" viewBox="0 0 640 120" role="img" aria-label="水銀同酒精溫度計範圍">
          <g class="rg-axis"></g>
          <rect class="rg-hg" x="0" y="20" height="22" rx="6" style="fill:var(--qP)" opacity=".85"/><text class="rg-hgt" y="36" font-size="12" font-weight="700" fill="#06263a">水銀 mercury</text>
          <rect class="rg-al" x="0" y="52" height="22" rx="6" style="fill:var(--hot)" opacity=".85"/><text class="rg-alt" y="68" font-size="12" font-weight="700" fill="#3a0610">酒精 alcohol</text>
          <path class="rg-mark" style="stroke:var(--white-hot)" stroke-width="2.5"/><text class="rg-mt mono" y="14" font-size="12" text-anchor="middle" style="fill:var(--white-hot)"></text>
        </svg></div>`);
      st.add(chart);
      const csvg = $('svg', chart);
      const X = T => 30 + (T + 150) / 550 * 580;
      let ax = `<path d="M30 86 H610" style="stroke:var(--muted)"/>`;
      for (let T = -150; T <= 400; T += 50) ax += `<path d="M${X(T)} 86 v5" style="stroke:var(--muted)"/><text x="${X(T)}" y="106" font-size="11" text-anchor="middle" style="fill:var(--muted)">${T}</text>`;
      $('.rg-axis', csvg).innerHTML = ax + '<text x="610" y="118" font-size="11" text-anchor="end" style="fill:var(--muted)">°C</text>';
      const setBar = (sel, a, b) => { const r = $(sel, csvg); r.setAttribute('x', X(a)); r.setAttribute('width', X(b) - X(a)); };
      setBar('.rg-hg', -37, 356); setBar('.rg-al', -115, 110);
      $('.rg-hgt', csvg).setAttribute('x', X(-37) + 8); $('.rg-alt', csvg).setAttribute('x', X(-115) + 8);
      const tr = rangeField({ id: 'rg-t', label: '想量幾多度？', min: -150, max: 400, value: 25, fmt: v => `${v} °C`, onInput: v => mark(v) });
      const say = html('<div class="small"></div>');
      st.add(tr); st.add(say);
      function mark(T) {
        $('.rg-mark', csvg).setAttribute('d', `M${X(T)} 16 V86`); const t = $('.rg-mt', csvg); t.setAttribute('x', X(T)); t.textContent = `${T} °C`;
        const hg = T >= -37 && T <= 356, al = T >= -115 && T <= 110;
        say.innerHTML = hg && al ? '水銀同酒精溫度計<b class="good">都量到</b>。' : hg ? '只有<b class="hl-cold">水銀</b>溫度計量到（酒精上限 110 °C）。' : al ? '只有<b class="hl-hot">酒精</b>溫度計量到（水銀下限 −37 °C）。' : '兩種液體玻璃溫度計都<b class="bad">量唔到</b>。';
      }
      mark(25);
      /* game */
      const game = html('<div class="panel-inset stack-sm"></div>');
      st.add('<div class="lbl">遊戲：揀啱溫度計</div>'); st.add(game);
      const runGame = () => {
        const temps = shuffle([-100, -80, -60, -20, 0, 50, 100, 120, 200, 300]).slice(0, 6);
        let i = 0, right = 0;
        const one = () => {
          if (i >= temps.length) {
            const ok = right >= 5;
            game.replaceChildren(html(`<div class="stack-sm center"><div class="result-big ${ok ? 'good' : 'bad'}">${right} / 6</div><div>${ok ? '過關！' : '要 5 題或以上，再嚟！'}</div><div class="row" style="justify-content:center"><button type="button" class="btn sm" data-r>再玩</button></div></div>`));
            $('[data-r]', game).onclick = () => { SFX.click(); runGame(); };
            if (ok) st.complete();
            return;
          }
          const T = temps[i];
          const hg = T >= -37 && T <= 356, al = T >= -115 && T <= 110;
          const ans = hg && al ? 2 : hg ? 1 : 0;
          const card = html(`<div class="stack-sm"><div class="row-between"><span class="score-pill">第 ${i + 1} / 6 題</span><span class="score-pill">答啱 ${right}</span></div>
            <div class="q-text">要量 <b>${T} °C</b>，可以用邊種液體玻璃溫度計？</div><div class="opts"></div><div class="fbw" style="min-height:1.6em"></div></div>`);
          ['只可以用酒精 alcohol', '只可以用水銀 mercury', '兩種都得 both'].forEach((o, k) => {
            const b = html(`<button type="button" class="opt"><span class="k">${'ABC'[k]}</span><span class="t">${o}</span></button>`);
            b.onclick = () => {
              const all = $$('.opt', card); all.forEach(x => x.disabled = true);
              const ok = k === ans; if (ok) { right++; SFX.good(); } else SFX.bad();
              b.classList.add(ok ? 'ok' : 'no'); all[ans].classList.add('ok');
              $('.fbw', card).innerHTML = `<span class="small ${ok ? 'good' : 'bad'}">${ok ? '啱！' : '唔啱。'}</span> <span class="small muted">水銀 −37 至 356 °C；酒精 −115 至 110 °C。</span>`;
              later(1300, () => { i++; one(); });
            };
            $('.opts', card).appendChild(b);
          });
          game.replaceChildren(card);
        };
        one();
      };
      runGame();
      /* Classwork 3 */
      st.add(`<details class="panel-soft"><summary><b>Classwork 3 答案</b>（撳開）</summary><div class="stack-sm" style="margin-top:10px">
        <div><b>1. Advantages of liquid-in-glass thermometers over infrared thermometers:</b><ul class="small"><li>Accurate（課本已給）</li><li>Cheaper（參考答案）</li><li>Does not need a battery / electricity（參考答案）</li></ul></div>
        <div><b>2. Advantages of mercury-in-glass thermometers over alcohol-in-glass thermometers:</b><ul class="small"><li>Mercury expands more uniformly（課本已給）</li><li>Can measure higher temperatures (up to 356 °C)（由課本範圍得出）</li><li>Mercury is a good conductor of heat, so it responds quickly（參考答案）</li></ul></div>
        <div class="tiny dim">「參考答案」係常見答法，課本無印出；以老師上堂答案為準。</div></div></details>`);
    }

    /* ---------- 5. design features ---------- */
    {
      const st = add(station({ world: 'w2', id: 'design', tag: '1.1D · p.8', title: '設計師模式：點樣令溫度計更靈敏？', short: '設計靈敏度', goal: '試唔同設計，再完成兩段填充' }));
      const box = html(`<div class="stack-sm">
        <svg class="svg-fit ds-svg" viewBox="0 0 600 120" role="img" aria-label="可調校的溫度計">
          <rect class="ds-tube" x="40" y="50" width="540" height="20" rx="10" fill="#1d1640" stroke="#cfc7f5" stroke-width="2"/>
          <circle class="ds-bulb" cx="40" cy="60" r="20" style="fill:var(--hot)" stroke="#cfc7f5" stroke-width="2"/>
          <rect class="ds-th" x="40" y="57" width="60" height="6" style="fill:var(--hot)"/>
          <g class="ds-ticks"></g><text class="ds-txt mono" x="590" y="30" text-anchor="end" font-size="14" style="fill:var(--warm)"></text>
        </svg>
        <div class="two"><div class="stack-sm"><div class="lbl">液泡 bulb</div><div class="ds-b"></div><div class="lbl">毛細管 capillary tube</div><div class="ds-c"></div><div class="ds-T"></div></div>
          <div class="stack-sm"><svg class="svg-fit ds-g" viewBox="0 0 300 200" style="max-width:360px"></svg><div class="small muted">實線＝你的設計；虛線＝標準設計。線越斜＝每升 1 °C 液柱伸得越長＝越靈敏。</div></div></div>
        <div class="readout ds-sens"></div></div>`);
      st.add(box);
      let bulb = 1, tube = 1, T = 20;
      const BF = { 0: 0.6, 1: 1, 2: 1.5 }, TF = { 0: 1.6, 1: 1, 2: 0.6 };
      const g = $('.ds-g', box);
      const A = axes(g, { box: [40, 16, 240, 150], x: [0, 30], y: [0, 450], xt: [0, 10, 20, 30], yt: [0, 150, 300, 450], yf: () => '', xl: 'T / °C', yl: '液柱長度' });
      const ref = svgEl('path', { style: 'stroke:var(--dim)', 'stroke-dasharray': '5 5', 'stroke-width': 2 }, g);
      const mine = svgEl('path', { style: 'stroke:var(--warm)', 'stroke-width': 3 }, g);
      const dot = svgEl('circle', { r: 5, style: 'fill:var(--warm)' }, g);
      ref.setAttribute('d', `M${A.sx(0)} ${A.sy(0)} L${A.sx(30)} ${A.sy(6 * 30)}`);
      const paint = () => {
        const s = BF[bulb] * TF[tube];
        const r = [14, 20, 27][bulb], w = [6, 12, 20][tube];
        const bl = $('.ds-bulb', box); bl.setAttribute('r', r);
        const tb = $('.ds-tube', box); tb.setAttribute('y', 60 - w / 2 - 4); tb.setAttribute('height', w + 8);
        const len = 6 * s * T; const th = $('.ds-th', box);
        th.setAttribute('y', 60 - w / 2); th.setAttribute('height', w); th.setAttribute('width', Math.min(540, 10 + len));
        $('.ds-txt', box).textContent = `${T} °C`;
        mine.setAttribute('d', `M${A.sx(0)} ${A.sy(0)} L${A.sx(30)} ${A.sy(Math.min(450, 6 * s * 30))}`);
        dot.setAttribute('cx', A.sx(T)); dot.setAttribute('cy', A.sy(Math.min(450, 6 * s * T)));
        const stars = s >= 2 ? '非常靈敏' : s > 1.1 ? '較靈敏' : s >= 0.9 ? '標準' : '較唔靈敏';
        $('.ds-sens', box).innerHTML = `靈敏度：<b class="hl-warm">${stars}</b>　每升 1 °C，液柱伸長約 <b>${nf(round(s, 2))}</b> 倍標準長度`;
      };
      $('.ds-b', box).appendChild(seg([{ v: 0, label: '細' }, { v: 1, label: '中' }, { v: 2, label: '大' }], 1, v => { bulb = Number(v); paint(); }));
      $('.ds-c', box).appendChild(seg([{ v: 0, label: '幼' }, { v: 1, label: '中' }, { v: 2, label: '粗' }], 1, v => { tube = Number(v); paint(); }));
      $('.ds-T', box).appendChild(rangeField({ id: 'ds-t', label: '加熱', min: 0, max: 30, value: 20, fmt: v => `${v} °C`, onInput: v => { T = v; paint(); } }));
      paint();
      let a = false, b = false;
      st.add('<div class="lbl">Larger bulb</div>');
      st.add(fillIn({ text: 'A larger bulb contains {{more}} liquid so it results in a {{larger}} increase of length of liquid for the same increase of temperature, that is, the thermometer becomes {{more}} sensitive.', bank: ['more', 'less', 'larger', 'smaller'], onDone: () => { a = true; if (b) st.complete(); } }));
      st.add('<div class="lbl">Narrower capillary tube</div>');
      st.add(fillIn({ text: 'A narrower capillary tube results in a {{larger}} increase of length of liquid for the same increase of temperature, that is, the thermometer becomes {{more}} sensitive.', bank: ['more', 'less', 'larger', 'smaller'], onDone: () => { b = true; if (a) st.complete(); } }));
    }
  });
