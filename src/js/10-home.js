/* ============ icons for the map ============ */
const ICONS = {
  w1: `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="19" y="4" width="10" height="30" rx="5" style="fill:none;stroke:var(--muted)" stroke-width="2.5"/><circle cx="24" cy="38" r="7" style="fill:var(--hot)"/><rect x="22" y="15" width="4" height="22" style="fill:var(--hot)"/><path d="M10 9h6M10 17h6M10 25h6M32 9h6M32 17h6M32 25h6" style="stroke:var(--qT)" stroke-width="2" stroke-linecap="round"/></svg>`,
  w2: `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="6" width="9" height="30" rx="4.5" style="fill:none;stroke:var(--muted)" stroke-width="2.5"/><circle cx="12.5" cy="38" r="6" style="fill:var(--cool)"/><rect x="10.5" y="20" width="4" height="16" style="fill:var(--cool)"/><rect x="25" y="4" width="14" height="40" rx="2" style="fill:none;stroke:var(--warm)" stroke-width="2.5"/><path d="M25 10h6M25 16h4M25 22h6M25 28h4M25 34h6M25 40h4" style="stroke:var(--warm)" stroke-width="2"/></svg>`,
  w3: `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="4" y="16" width="16" height="18" rx="3" style="fill:var(--hot)"/><rect x="28" y="16" width="16" height="18" rx="3" style="fill:var(--cold)"/><path d="M14 25h20m-5-5 5 5-5 5" style="fill:none;stroke:var(--white-hot)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  w4: `<svg viewBox="0 0 48 48" aria-hidden="true"><text x="3" y="30" style="fill:var(--qC);font-family:var(--font-math);font-style:italic;font-weight:700" font-size="24">C</text><text x="20" y="30" style="fill:var(--qc);font-family:var(--font-math);font-style:italic;font-weight:700" font-size="24">c</text><text x="6" y="45" style="fill:var(--qT);font-family:var(--font-math);font-weight:700" font-size="15">K</text><text x="24" y="45" style="fill:var(--qE);font-family:var(--font-math);font-weight:700" font-size="15">J</text><path d="M36 8v30" style="stroke:var(--line-2)" stroke-width="2"/></svg>`,
  w5: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5C18 15 12 21 12 29a12 12 0 0 0 24 0c0-8-6-14-12-24z" style="fill:var(--cool)"/><path d="M17 31c3 2 5 2 7 0s4-2 7 0" style="fill:none;stroke:var(--inset)" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  w6: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 10h12l-2 22H8z" style="fill:var(--hot)"/><path d="M30 10h12l-2 22h-8z" style="fill:var(--cold)"/><path d="M14 36h20v8H14z" style="fill:#b06cff"/><path d="M12 33l6 4M36 33l-6 4" style="stroke:var(--muted)" stroke-width="2" stroke-linecap="round"/></svg>`,
  w7: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 6v34h34" style="fill:none;stroke:var(--muted)" stroke-width="2.5" stroke-linecap="round"/><path d="M8 36 22 10" style="stroke:var(--hot)" stroke-width="3" stroke-linecap="round"/><path d="M8 36 40 18" style="stroke:var(--cool)" stroke-width="3" stroke-linecap="round"/></svg>`,
  exam: `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="9" y="4" width="30" height="40" rx="4" style="fill:none;stroke:var(--muted)" stroke-width="2.5"/><path d="M15 14h18M15 21h18M15 28h10" style="stroke:var(--line-2)" stroke-width="2.5" stroke-linecap="round"/><path d="M26 34l4 4 9-10" style="fill:none;stroke:var(--good)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

/* ============ the thermal-camera hero: drag to add heat, watch it spread ============ */
function thermalHero(host) {
  const cv = html('<canvas aria-hidden="true"></canvas>');
  host.prepend(cv);
  const W = 120, H = 54;
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  const img = ctx.createImageData(W, H);
  let T = new Float32Array(W * H), T2 = new Float32Array(W * H);
  const amb = 0.06;
  T.fill(amb);
  const lut = []; for (let i = 0; i < 256; i++) lut.push(ironbow(i / 255));
  /* stamp the character 熱 as a heat signature on the right */
  const off = document.createElement('canvas'); off.width = W; off.height = H;
  const o = off.getContext('2d');
  o.fillStyle = '#fff'; o.font = `bold ${Math.round(H * 0.82)}px "PingFang TC","Noto Sans TC","Microsoft JhengHei",sans-serif`;
  o.textAlign = 'center'; o.textBaseline = 'middle';
  o.fillText('熱', W * 0.78, H * 0.54);
  const a = o.getImageData(0, 0, W, H).data;
  const stamp = v => { for (let i = 0; i < W * H; i++) if (a[i * 4 + 3] > 80) T[i] = Math.max(T[i], v); };
  stamp(1.15);
  const heat = (gx, gy, amt, rad = 3.2) => {
    const r = Math.ceil(rad);
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
      const X = Math.round(gx + x), Y = Math.round(gy + y);
      if (X < 1 || Y < 1 || X >= W - 1 || Y >= H - 1) continue;
      const d = Math.hypot(x, y) / rad; if (d > 1) continue;
      const k = Y * W + X; T[k] = Math.min(1.25, T[k] + amt * (1 - d * d));
    }
  };
  const step = () => {
    const kd = 0.16, cool = 0.003;
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      T2[i] = T[i] + kd * (T[i - 1] + T[i + 1] + T[i - W] + T[i + W] - 4 * T[i]) - cool * (T[i] - amb);
    }
    for (let x = 0; x < W; x++) { T2[x] = T2[x + W]; T2[(H - 1) * W + x] = T2[(H - 2) * W + x]; }
    for (let y = 0; y < H; y++) { T2[y * W] = T2[y * W + 1]; T2[y * W + W - 1] = T2[y * W + W - 2]; }
    [T, T2] = [T2, T];
  };
  const paint = () => {
    const d = img.data;
    for (let i = 0; i < W * H; i++) {
      const c = lut[Math.max(0, Math.min(255, Math.round(T[i] / 1.15 * 255)))];
      d[i * 4] = c[0]; d[i * 4 + 1] = c[1]; d[i * 4 + 2] = c[2]; d[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  };
  let lastPointer = 0;
  const onMove = e => {
    const r = cv.getBoundingClientRect();
    const gx = (e.clientX - r.left) / r.width * W, gy = (e.clientY - r.top) / r.height * H;
    heat(gx, gy, 0.45);
    lastPointer = performance.now();
  };
  host.addEventListener('pointermove', onMove);
  host.addEventListener('pointerdown', onMove);
  if (reduceMotion) { for (let i = 0; i < 40; i++) step(); paint(); return; }
  for (let i = 0; i < 6; i++) step();
  paint();
  let tt = 0, sinceStamp = 0;
  loop((dt, now) => {
    tt += dt; sinceStamp += dt;
    if (sinceStamp > 11 && now - lastPointer > 4000) { stamp(1.1); sinceStamp = 0; }
    if (now - lastPointer > 2500) {
      /* idle: a little warm "cup" wanders so the picture never freezes */
      heat(W * (0.35 + 0.25 * Math.sin(tt * 0.5)), H * (0.55 + 0.3 * Math.sin(tt * 0.83)), 0.12, 3.5);
    }
    step();
    paint();
  });
}

Router.routes.home = main => {
  const hero = html(`<section class="hero">
    <div class="hero-shade"></div>
    <div class="hero-inner">
      <div class="hero-kicker">Section 1 · Heat · 課本 p.3–16</div>
      <h1>HEAT LAB<small>熱學實驗室</small></h1>
      <div class="hero-hint">用手指／滑鼠喺呢個熱像鏡頭上面掃吓：熱會由熱的地方流去冷的地方，直到溫度一樣。</div>
      ${sir('我係<b>溫Sir</b>！呢度冇悶嘢：7 關實驗同遊戲，最尾仲有 <b>Boss 戰</b>。由第 1 關開始，定係先去搞清楚 <b>C、c、K、J</b>？', 'happy')}
      <div class="row"><button type="button" class="btn hot lg" data-go="w1">開始第 1 關</button><button type="button" class="btn cold" data-go="w4">C · c · K · J 大解構</button><button type="button" class="btn" data-go="exam">考試區</button></div>
    </div></section>`);
  main.appendChild(hero);
  thermalHero(hero);

  main.appendChild(html(`<div class="section-title"><h2>關卡地圖</h2><span class="small muted">每關有實驗站＋過關小測；完成越多，上面嘅「腦溫」越高。</span></div>`));
  const map = html('<div class="map"></div>');
  for (const w of WORLDS) {
    const p = worldProgress(w);
    const special = w.id === 'w4';
    const card = html(`<button type="button" class="card-link ${special ? 'special' : ''}" data-go="${w.id}">
      <span class="ico">${ICONS[w.id]}</span>
      <span class="stack-sm" style="gap:2px;min-width:0">
        <span class="small mono muted">第 ${w.no} 關 · ${w.sec}${special ? '<span class="badge-new">必玩</span>' : ''}</span>
        <span class="card-title">${w.zh}</span>
        <span class="en-sub">${w.en}</span>
        ${special ? '<span class="tagline">熱容量 C、比熱容 c、開爾文 K、焦耳 J：用「能量方格」一格格睇清楚佢哋點連埋一齊。</span>' : ''}
        <span class="meta"><span>課本 ${w.pages}</span><span>${w.stations.length} 個站 + 小測</span>${starHTML(starsFor(w))}</span>
        <span class="heat"><i style="width:${(1 - p) * 100}%"></i></span>
      </span></button>`);
    map.appendChild(card);
  }
  const ex = html(`<button type="button" class="card-link" data-go="exam" style="grid-column:1/-1">
      <span class="ico">${ICONS.exam}</span>
      <span class="stack-sm" style="gap:2px;min-width:0">
        <span class="small mono muted">考試區 · 全部範圍</span>
        <span class="card-title">模擬考 · Boss 戰 · 專題練習 · 定義閃卡 · 錯題本</span>
        <span class="en-sub">Exam corner — questions in English, hints in Chinese</span>
        <span class="meta"><span>模擬考最佳：${Store.data.best['exam.mock'] != null ? Store.data.best['exam.mock'] + '%' : '未考'}</span><span>Boss：${isDone('exam.boss') ? '已打敗' : '未挑戰'}</span></span>
      </span></button>`);
  map.appendChild(ex);
  main.appendChild(map);
  $$('[data-go]', main).forEach(b => b.addEventListener('click', () => { SFX.click(); go(b.dataset.go); }));

  /* reset progress, confirmed inside the page */
  const foot = html(`<div class="row-between small muted" style="border-top:1px solid var(--line);padding-top:16px">
    <span>內容只取自課本 Section 1 Heat（p.3–16）。進度只儲存在呢部機嘅瀏覽器。</span>
    <span class="row"><button type="button" class="btn sm ghost" data-reset>重設進度</button></span></div>`);
  const rs = $('[data-reset]', foot);
  rs.onclick = () => {
    if (rs.dataset.arm) { Store.reset(); updateHUD(); toast('進度已清除'); route('home'); return; }
    rs.dataset.arm = '1'; rs.textContent = '再撳一次確認清除'; rs.classList.add('hot');
    later(3500, () => { if (rs.isConnected) { delete rs.dataset.arm; rs.textContent = '重設進度'; rs.classList.remove('hot'); } });
  };
  main.appendChild(foot);
};
