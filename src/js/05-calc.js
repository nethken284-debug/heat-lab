/* ============ pocket calculator: a floating button on every page summons it from the side ============ */
const Calc = (() => {
  const KEY = 'heatlab.calc';
  let st = { open: false, ans: 0, hist: [] };
  try { Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* storage blocked */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* storage blocked */ } };

  let toks = [];        // expression as tokens: digits, '.', 'E', '+', '-', '*', '/', '(', ')', '√', '²', 'Ans'
  let result = null;    // last evaluated value (null = nothing yet)
  let justEval = false; // after '=', typing a digit starts a new sum
  let lastInput = null; // last answer box the student clicked on the page

  /* ---- parser (no eval) ---- */
  function evaluate(t) {
    let i = 0;
    const peek = () => t[i];
    const isDigit = k => k !== undefined && /^[0-9.]$/.test(k);
    const fail = () => { throw new Error('syntax'); };
    function number() {
      let s = '';
      while (isDigit(peek())) s += t[i++];
      if (peek() === 'E') {
        i++; s += 'e';
        if (peek() === '-' || peek() === '+') s += t[i++];
        if (!/^[0-9]$/.test(peek() || '')) fail();
        while (/^[0-9]$/.test(peek() || '')) s += t[i++];
      }
      if ((s.match(/\./g) || []).length > 1 || s === '.') fail();
      return Number(s);
    }
    function primary() {
      const k = peek();
      if (isDigit(k)) return number();
      if (k === 'Ans') { i++; return st.ans; }
      if (k === '(') { i++; const v = expr(); if (peek() === ')') i++; else if (i < t.length) fail(); return v; }
      fail();
    }
    function postfix() { let v = primary(); while (peek() === '²') { i++; v = v * v; } return v; }
    function unary() {
      if (peek() === '-') { i++; return -unary(); }
      if (peek() === '+') { i++; return unary(); }
      if (peek() === '√') { i++; const v = unary(); if (v < 0) throw new Error('math'); return Math.sqrt(v); }
      return postfix();
    }
    function term() {
      let v = unary();
      for (;;) {
        const k = peek();
        if (k === '*') { i++; v *= unary(); }
        else if (k === '/') { i++; const d = unary(); if (d === 0) throw new Error('math'); v /= d; }
        else if (k === '(' || k === '√' || k === 'Ans' || (isDigit(k) && t[i - 1] === ')')) v *= unary(); // 2(3), 2√9
        else return v;
      }
    }
    function expr() {
      let v = term();
      while (peek() === '+' || peek() === '-') { const op = t[i++]; const w = term(); v = op === '+' ? v + w : v - w; }
      return v;
    }
    if (!t.length) fail();
    const v = expr();
    if (i < t.length) fail();
    if (!isFinite(v)) throw new Error('math');
    return Number(v.toPrecision(12));
  }

  /* ---- display ---- */
  const SHOW = { '*': '×', '/': '÷', '-': '−', '+': '+', 'Ans': 'Ans' };
  function exprHTML(t) {
    let out = '', inExp = false;
    t.forEach((k, j) => {
      if (k === 'E') { out += '×10<sup>'; inExp = true; return; }
      if (inExp && !(/^[0-9]$/.test(k) || (k === '-' && t[j - 1] === 'E'))) { out += '</sup>'; inExp = false; }
      out += k === '-' && inExp ? '−' : (SHOW[k] || k);
    });
    if (inExp) out += '</sup>';
    return out || '<span class="dim">0</span>';
  }
  function resultHTML(x) {
    const a = Math.abs(x);
    if (a !== 0 && (a >= 1e7 || a < 1e-3)) {
      let e = Math.floor(Math.log10(a)), m = Number((x / 10 ** e).toPrecision(6));
      if (Math.abs(m) >= 10) { m /= 10; e += 1; }
      return `${nf(m, 5)} × 10<sup>${e}</sup>`;
    }
    return nf(x, 6);
  }
  /* plain text the page's answer boxes understand (parseNum) */
  const plain = x => String(x).replace('e+', 'e');
  const toTokens = x => plain(x).replace('e', 'E').split('');

  /* ---- DOM ---- */
  const fab = html(`<button type="button" class="calc-fab" id="calc-fab" aria-label="計數機" aria-expanded="false" title="計數機">
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="2.5" width="15" height="19" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="7.5" y="5.5" width="9" height="4" rx="1" fill="currentColor"/><g fill="currentColor"><circle cx="8.6" cy="13.2" r="1.2"/><circle cx="12" cy="13.2" r="1.2"/><circle cx="15.4" cy="13.2" r="1.2"/><circle cx="8.6" cy="17.4" r="1.2"/><circle cx="12" cy="17.4" r="1.2"/><circle cx="15.4" cy="17.4" r="1.2"/></g></svg>
    <span class="calc-fab-lbl">計數機</span></button>`);
  const KEYS = [
    ['AC', 'ac', 'fn'], ['DEL', 'del', 'fn'], ['(', '(', ''], [')', ')', ''], ['÷', '/', 'op'],
    ['7', '7', 'n'], ['8', '8', 'n'], ['9', '9', 'n'], ['x²', '²', ''], ['×', '*', 'op'],
    ['4', '4', 'n'], ['5', '5', 'n'], ['6', '6', 'n'], ['√', '√', ''], ['−', '-', 'op'],
    ['1', '1', 'n'], ['2', '2', 'n'], ['3', '3', 'n'], ['×10<sup>x</sup>', 'E', ''], ['+', '+', 'op'],
    ['0', '0', 'n'], ['.', '.', 'n'], ['Ans', 'Ans', ''], ['=', 'eq', 'eq']
  ];
  const panel = html(`<section class="calc" id="calc" role="dialog" aria-label="計數機" hidden>
    <div class="calc-head">
      <span class="calc-title">計數機</span>
      <button type="button" class="calc-x" data-close aria-label="收起計數機">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="calc-screen">
      <div class="calc-expr mono" aria-live="off"></div>
      <div class="calc-res mono" aria-live="polite"></div>
    </div>
    <div class="calc-hist"></div>
    <div class="calc-keys">${KEYS.map(([lbl, k, cls]) => `<button type="button" class="ck ${cls}" data-k="${k}">${lbl}</button>`).join('')}</div>
    <button type="button" class="btn sm cold calc-fill" data-fill hidden>填入答案格</button>
  </section>`);
  document.body.append(panel, fab);
  const exprEl = $('.calc-expr', panel), resEl = $('.calc-res', panel), histEl = $('.calc-hist', panel), fillBtn = $('[data-fill]', panel);

  function render() {
    exprEl.innerHTML = exprHTML(toks);
    exprEl.scrollLeft = exprEl.scrollWidth;
    if (typeof result === 'string') resEl.innerHTML = `<span class="bad">${result}</span>`;
    else resEl.innerHTML = result === null ? '' : '= ' + resultHTML(result);
    histEl.innerHTML = st.hist.map((x, j) => `<button type="button" class="calc-chip mono" data-h="${j}" title="放入算式">${resultHTML(x)}</button>`).join('');
    const canFill = typeof result === 'number' && lastInput && lastInput.isConnected && !lastInput.readOnly;
    fillBtn.hidden = !canFill;
  }

  function press(k) {
    if (k === 'ac') { toks = []; result = null; justEval = false; }
    else if (k === 'del') { if (justEval) { result = null; justEval = false; } toks.pop(); }
    else if (k === 'eq') {
      if (!toks.length) return;
      try {
        const v = evaluate(toks);
        result = v; st.ans = v; justEval = true;
        if (st.hist[0] !== v) st.hist = [v].concat(st.hist).slice(0, 4);
        save(); SFX.click();
      } catch (e) { result = e.message === 'math' ? '計唔到（Math error）' : '算式唔完整（Syntax error）'; justEval = false; }
    } else {
      if (justEval) {
        // continue from the answer with an operator; start fresh with a number
        toks = /^[+\-*/²]$/.test(k) ? ['Ans'] : [];
        result = null; justEval = false;
      }
      toks.push(k);
    }
    render();
  }

  function setOpen(on) {
    st.open = on; save();
    panel.hidden = !on;
    fab.setAttribute('aria-expanded', String(on));
    fab.classList.toggle('on', on);
    if (on) { panel.classList.remove('in'); void panel.offsetWidth; panel.classList.add('in'); render(); }
  }

  fab.addEventListener('click', () => { SFX.click(); setOpen(panel.hidden); });
  panel.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.k) press(b.dataset.k);
    else if (b.hasAttribute('data-close')) setOpen(false);
    else if (b.dataset.h !== undefined) {
      const x = st.hist[+b.dataset.h];
      if (justEval) { toks = []; result = null; justEval = false; }
      toks.push(...toTokens(x)); render();
    } else if (b.hasAttribute('data-fill') && typeof result === 'number' && lastInput) {
      lastInput.value = plain(result);
      lastInput.dispatchEvent(new Event('input', { bubbles: true }));
      lastInput.focus();
      toast('已填入，記得撳「檢查」', 'good');
    }
  });

  /* remember which answer box to fill */
  document.addEventListener('focusin', e => {
    const el = e.target;
    if (el.matches && el.matches('#main input.num, #main input[inputmode="decimal"]')) { lastInput = el; if (!panel.hidden) render(); }
  });

  /* keyboard: works while the calculator is open and you are not typing in a box on the page */
  const KB = { '*': '*', 'x': '*', 'X': '*', '/': '/', '+': '+', '-': '-', '(': '(', ')': ')', '.': '.', 'e': 'E', 'E': 'E', '^': '²', 'Enter': 'eq', '=': 'eq', 'Backspace': 'del', 'Delete': 'ac' };
  document.addEventListener('keydown', e => {
    if (panel.hidden || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Escape') { setOpen(false); fab.focus(); return; }
    const tgt = e.target;
    if (tgt.closest && (tgt.closest('input, textarea, select, [contenteditable]') || (tgt.closest('button') && !panel.contains(tgt) && (e.key === 'Enter' || e.key === ' ')))) return;
    const k = /^[0-9]$/.test(e.key) ? e.key : KB[e.key];
    if (!k) return;
    e.preventDefault();
    press(k);
  });

  if (st.open) setOpen(true);
  return { open: () => setOpen(true), close: () => setOpen(false) };
})();
