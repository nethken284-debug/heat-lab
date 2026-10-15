/* ============ question bank — every item comes from Section 1 Heat (p.3–16) ============ */
const TOPIC_NAME = { w1: '溫度與溫標', w2: '溫度計', w3: '熱與功率', w4: '熱容量 C · 比熱容 c', w5: '水的高比熱容', w6: '能量守恆', w7: '溫度–時間圖' };
const ex = lines => `<div class="work">${lines.map(l => `<div class="ln">${l}</div>`).join('')}</div>`;

/* small line graph for questions: spec = {x:[0,20], y:[0,100], xt:[...], yt:[...], xl, yl, lines:[{p:[[x,y],[x,y]], label, at:[x,y]}], guides:[[[x,y],[x,y]]]} */
function lineGraph(s) {
  const W = 380, H = 250, L = 52, R = 70, T = 26, B = 40;
  const sx = x => L + (x - s.x[0]) / (s.x[1] - s.x[0]) * (W - L - R);
  const sy = y => H - B - (y - s.y[0]) / (s.y[1] - s.y[0]) * (H - T - B);
  const tk = t => Array.isArray(t) ? t : [t, String(t)];
  let g = `<svg class="svg-fit" viewBox="0 0 ${W} ${H}" role="img" aria-label="${s.yl} 對 ${s.xl} 的線圖">`;
  g += `<path d="M${L} ${T - 12} V${H - B} H${W - R + 26}" fill="none" style="stroke:var(--muted)" stroke-width="1.8"/>`;
  g += `<path d="M${L - 5} ${T - 4} L${L} ${T - 14} L${L + 5} ${T - 4}" fill="none" style="stroke:var(--muted)" stroke-width="1.8"/>`;
  g += `<path d="M${W - R + 18} ${H - B - 5} L${W - R + 28} ${H - B} L${W - R + 18} ${H - B + 5}" fill="none" style="stroke:var(--muted)" stroke-width="1.8"/>`;
  g += `<text x="${L - 8}" y="${T - 16}" font-size="12" text-anchor="start" style="fill:var(--muted)">${s.yl}</text>`;
  g += `<text x="${W - 8}" y="${H - B + 30}" font-size="12" text-anchor="end" style="fill:var(--muted)">${s.xl}</text>`;
  g += `<text x="${L - 8}" y="${H - B + 16}" font-size="12" text-anchor="end" style="fill:var(--muted)">0</text>`;
  for (const t of (s.xt || [])) { const [v, lab] = tk(t); g += `<path d="M${sx(v)} ${H - B} v5" style="stroke:var(--muted)"/><text x="${sx(v)}" y="${H - B + 18}" font-size="12" text-anchor="middle" style="fill:var(--muted)">${lab}</text>`; }
  for (const t of (s.yt || [])) { const [v, lab] = tk(t); g += `<path d="M${L} ${sy(v)} h-5" style="stroke:var(--muted)"/><text x="${L - 8}" y="${sy(v) + 4}" font-size="12" text-anchor="end" style="fill:var(--muted)">${lab}</text>`; }
  for (const gd of (s.guides || [])) g += `<path d="M${sx(gd[0][0])} ${sy(gd[0][1])} L${sx(gd[1][0])} ${sy(gd[1][1])}" style="stroke:var(--dim)" stroke-dasharray="4 4" stroke-width="1.3"/>`;
  const cols = ['var(--text)', 'var(--cool)', 'var(--warm)', 'var(--qc)'];
  (s.lines || []).forEach((ln, i) => {
    const c = s.mono ? 'var(--text)' : cols[i % cols.length];
    g += `<path d="M${ln.p.map(([x, y]) => `${sx(x)} ${sy(y)}`).join(' L')}" fill="none" style="stroke:${c}" stroke-width="2.6" stroke-linecap="round"/>`;
    if (ln.label) { const [ax, ay] = ln.at || ln.p[ln.p.length - 1]; g += `<text x="${sx(ax) + (ln.dx ?? 6)}" y="${sy(ay) + (ln.dy ?? -6)}" font-size="15" font-weight="700" font-style="italic" style="fill:${c};font-family:var(--font-math)">${ln.label}</text>`; }
  });
  return g + '</svg>';
}

/* random helpers for generators */
const pickN = (arr, n) => shuffle(arr).slice(0, n);
const gKg = () => pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2, 2.5, 3]);
const optsNum = (ans, wrongs, unit) => {
  const set = [ans, ...wrongs.filter(w => isFinite(w) && Math.abs(w - ans) > Math.abs(ans) * 0.01 + 1e-9)];
  const uniq = []; for (const v of set) if (!uniq.some(u => Math.abs(u - v) < 1e-9)) uniq.push(v);
  return { options: uniq.slice(0, 4).map(v => `${bigNum(v)} ${unit}`), answer: 0 };
};

const BANK = [
  /* ---------------- w1 · temperature & scales ---------------- */
  { id: 'w1-def', topic: 'w1', type: 'mc', q: 'Temperature is a measure of', zh: '溫度量度的是……', options: ['the degree of hotness or coldness of an object', 'the amount of heat stored in an object', 'the energy transferred between two objects', 'the rate of energy transfer'], answer: 0, explain: 'Temperature – a measure of the degree of hotness (or coldness) of an object. 溫度係「冷熱程度」，唔係熱（能量）。' },
  { id: 'w1-sense', topic: 'w1', type: 'mc', q: 'One finger is put in cool water and another in hot water. Then both are put into the same beaker of warm water. Which statement is correct?', zh: '手指實驗：之後兩隻手指放入同一杯暖水。', options: ['The two fingers feel different degrees of hotness, so human senses are unreliable.', 'Both fingers feel the same hotness.', 'The finger from the hot water feels the warm water hotter.', 'Human senses are reliable for comparing hotness.'], answer: 0, explain: '由熱水出嚟嗰隻覺得暖水凍、由冷水出嚟嗰隻覺得暖水熱 → <b>human senses are unreliable</b>，要用溫度計量溫度。' },
  { id: 'w1-lfp', topic: 'w1', type: 'mc', q: 'The lower fixed point of the Celsius scale is', zh: '攝氏溫標的下定點是……', options: ['the melting point of pure ice at normal atmospheric pressure', 'the boiling point of pure water at normal atmospheric pressure', 'absolute zero', 'the temperature of a living room'], answer: 0, explain: 'Lower fixed point = melting point of pure ice at normal atmospheric pressure = 0 °C（冰點）。' },
  { id: 'w1-ufp', topic: 'w1', type: 'mc', q: 'The upper fixed point of the Celsius scale is', zh: '攝氏溫標的上定點是……', options: ['the boiling point of pure water at normal atmospheric pressure', 'the melting point of pure ice at normal atmospheric pressure', '373 °C', 'the highest temperature a thermometer can read'], answer: 0, explain: 'Upper fixed point = boiling point of pure water at normal atmospheric pressure = 100 °C（汽點）。' },
  { id: 'w1-fixed', topic: 'w1', type: 'mc', q: 'The fixed points of a temperature scale are chosen because they are', zh: '揀定點的原因？', options: ['easily reproducible temperatures', 'the highest and lowest temperatures on Earth', 'measured by human senses', 'always at 0 K and 100 K'], answer: 0, explain: 'A temperature scale is defined in terms of <b>easily reproducible temperatures</b> called fixed points.' },
  { id: 'w1-int', topic: 'w1', type: 'mc', q: 'On the Celsius scale, the range between the two fixed points is divided into', zh: '兩個定點之間分成幾多等份？', options: ['100 equal intervals', '273 equal intervals', '10 equal intervals', '373 equal intervals'], answer: 0, explain: 'Divide the range into <b>100 equal intervals</b> called degrees.' },
  { id: 'w1-c2k', topic: 'w1', type: 'num', gen() { const c = pick([-200, -73, -40, -23, 0, 25, 27, 37, 77, 100, 127, 150, 227, 300, 327, randInt(-100, 250)]); return { q: `Convert ${nf(c)} °C to the Kelvin scale.`, zh: `把 ${nf(c)} °C 轉做開爾文。`, answer: c + 273, unit: 'K', abs: 0.6, rel: 0, explain: ex([`T<sub>K</sub> = T<sub>C</sub> + 273`, `= ${nf(c)} + 273 = <b>${nf(c + 273)} K</b>`]) }; } },
  { id: 'w1-k2c', topic: 'w1', type: 'num', gen() { const k = pick([0, 73, 200, 250, 273, 300, 310, 350, 373, 400, 500, randInt(1, 600)]); return { q: `A body is at ${nf(k)} K. What is its temperature in °C?`, zh: `${nf(k)} K 等於幾多 °C？`, answer: k - 273, unit: '°C', abs: 0.6, rel: 0, explain: ex([`T<sub>C</sub> = T<sub>K</sub> − 273`, `= ${nf(k)} − 273 = <b>${nf(k - 273)} °C</b>`]) }; } },
  { id: 'w1-neg', topic: 'w1', type: 'mc', q: 'Which of the following temperatures is impossible?', zh: '邊個溫度唔可能存在？', options: ['−23 K', '−23 °C', '23 K', '250 K'], answer: 0, explain: '最低可能溫度係 0 K（absolute zero），所以冇負數 K。−23 °C = 250 K，係可能的。' },
  { id: 'w1-abs0', topic: 'w1', type: 'mc', q: 'Absolute zero is', zh: '絕對零度是……', options: ['0 K, the lowest possible temperature', '0 °C, the melting point of ice', '−100 °C', '273 K'], answer: 0, explain: 'The lowest possible temperature is 0 K, called absolute zero（≈ −273 °C；更準確 −273.15 °C）。' },
  { id: 'w1-dT', topic: 'w1', type: 'mc', gen() { const a = pick([10, 15, 20, 25]), b = pick([40, 45, 50, 60, 70, 80, 90]); const d = b - a; return { q: `The temperature of some water rises from ${a} °C to ${b} °C. What is the rise in temperature in kelvin?`, zh: '溫度上升了幾多 K？', options: [`${d} K`, `${d + 273} K`, `${b + 273} K`, `${273 - d} K`], answer: 0, explain: `升 1 °C = 升 1 K，所以 ΔT = ${b} − ${a} = <b>${d} °C = ${d} K</b>。（${b + 273} K − ${a + 273} K 都係 ${d} K）` }; } },
  { id: 'w1-tf1', topic: 'w1', type: 'tf', q: 'An increase of 1 °C is equal to an increase of 1 K.', zh: '升 1 °C 等於升 1 K？', ans: true, explain: '正確。Celsius 同 Kelvin 每格一樣大，只係起點唔同。' },
  { id: 'w1-tf2', topic: 'w1', type: 'tf', q: 'The Celsius scale and the Kelvin scale have the same starting point.', zh: '攝氏同開爾文的起點一樣？', ans: false, explain: '錯。兩者 <b>only differ in their starting points</b>：Kelvin 由絕對零度（0 K）開始，Celsius 的 0 °C 係冰點。' },
  { id: 'w1-hot', topic: 'w1', type: 'mc', q: 'According to the textbook figure “Working temperatures of some appliances”, which has the highest working temperature?', zh: '課本圖：邊樣電器工作溫度最高？', options: ['light bulb', 'hot plate', 'oven', 'soldering iron'], answer: 0, explain: '次序：iron（≈150 °C）< soldering iron（≈250 °C）< oven（≈300 °C）< hot plate（≈500 °C）< light bulb（> 2000 °C）。' },
  { id: 'w1-cold', topic: 'w1', type: 'mc', q: 'According to the textbook figure “Temperature values in everyday life”, which is the coldest?', zh: '課本圖：邊個最凍？', options: ['freezer', 'snowing', 'living room', 'bath'], answer: 0, explain: 'freezer ≈ −25 °C < snowing ≈ −10 °C < living room ≈ 24 °C < bath ≈ 45 °C。' },

  /* ---------------- w2 · thermometers ---------------- */
  { id: 'w2-def', topic: 'w2', type: 'mc', q: 'A thermometer is an instrument using the ________ of matter to measure temperature.', zh: '溫度計利用物質的……來量度溫度。', options: ['thermometric properties', 'mass', 'chemical names', 'weight'], answer: 0, explain: 'Thermometer – an instrument using the <b>thermometric properties</b> of matter to measure temperature（客觀量度）。' },
  { id: 'w2-prop', topic: 'w2', type: 'mc', q: 'Which of the following is NOT a thermometric property mentioned in the textbook?', zh: '邊個唔係課本講的測溫性質？', options: ['mass of a liquid', 'length of a liquid column', 'pressure of a gas', 'colour of a liquid crystal'], answer: 0, explain: '課本例子：length（volume）、pressure of gas、resistance of metal、colour of liquid crystal——都會隨溫度改變。質量唔會。' },
  { id: 'w2-semi', topic: 'w2', type: 'mc', fixed: true, q: 'As temperature rises, the resistance of a metal ______, while the resistance of a semiconductor ______.', zh: '（課堂筆記）溫度上升時，金屬電阻……；半導體電阻……', options: ['increases; decreases', 'decreases; increases', 'increases; increases', 'decreases; decreases'], answer: 0, explain: '課堂筆記：metal：T↑ R↑；semiconductor：T↑ R↓。兩樣都可以做溫度計。' },
  { id: 'w2-eq', topic: 'w2', type: 'mc', q: 'Two bodies in contact are in thermal equilibrium when', zh: '熱平衡是指……', options: ['they have reached the same temperature', 'they have the same mass', 'heat is still flowing from the hotter one', 'they have the same specific heat capacity'], answer: 0, explain: 'Thermal equilibrium：two bodies in contact reach the <b>same temperature</b> when the time is long enough.' },
  { id: 'w2-read', topic: 'w2', type: 'mc', q: 'When should the reading of a thermometer be taken?', zh: '幾時先讀溫度計？', options: ['after thermal equilibrium is reached', 'as soon as it touches the object', 'when the reading is rising fastest', 'before putting it into the object'], answer: 0, explain: 'Temperature should be read when <b>thermal equilibrium</b> is reached（讀數唔再變）。' },
  { id: 'w2-assume', topic: 'w2', type: 'mc', q: 'To calibrate an uncalibrated thermometer, we assume that the thermometric property', zh: '校準溫度計時，我們假設測溫性質……', options: ['changes uniformly with temperature', 'does not change with temperature', 'changes only above 100 °C', 'doubles every 10 °C'], answer: 0, explain: 'Assume the thermometric property changes <b>uniformly</b> → 可以用比例法或直線圖。' },
  { id: 'w2-cal', topic: 'w2', type: 'num', gen() {
      const l0 = pick([2, 2.5, 3, 3.5, 4, 4.5, 5, 6]), span = pick([12, 15, 16, 18, 20, 24, 25]), l1 = l0 + span;
      const T = pick([10, 15, 20, 25, 30, 40, 45, 50, 60, 70, 75, 80, 90]); const l = round(l0 + span * T / 100, 1); const Tx = (l - l0) / span * 100;
      return { q: `The length of the liquid column of an unmarked thermometer is ${nf(l0)} cm in melting ice and ${nf(l1)} cm in boiling water. In a liquid, the length is ${nf(l)} cm. Find the temperature of the liquid.`, zh: '比例法：(T − 0)/(l − l₀) = (100 − 0)/(l₁₀₀ − l₀)', answer: Tx, unit: '°C', abs: 0.6, rel: 0,
        explain: ex([`${frac('100 − 0', `${nf(l1)} − ${nf(l0)}`)} = ${frac('T − 0', `${nf(l)} − ${nf(l0)}`)}`, `T = ${frac(`${nf(round(l - l0, 2))}`, `${nf(span)}`)} × 100 = <b>${nf(round(Tx, 1))} °C</b>`]) };
    } },
  { id: 'w2-cal2', topic: 'w2', type: 'num', gen() {
      const l0 = pick([3, 4, 5, 6]), span = pick([15, 18, 20, 24]), T = pick([20, 25, 40, 50, 60, 75]); const l = l0 + span * T / 100;
      return { q: `A thermometer reads ${l0}.0 cm at 0 °C and ${l0 + span}.0 cm at 100 °C. What is the length of the liquid column at ${T} °C?`, zh: '假設長度隨溫度均勻改變。', answer: l, unit: 'cm', abs: 0.06, rel: 0,
        explain: ex([`每 1 °C 長度增加 ${frac(`${l0 + span} − ${l0}`, '100')} = ${nf(span / 100)} cm`, `l = ${l0} + ${nf(span / 100)} × ${T} = <b>${nf(l)} cm</b>`]) };
    } },
  { id: 'w2-out', topic: 'w2', type: 'num', gen() {
      const l0 = pick([4, 5, 6]), span = 20, T = pick([-10, -20, 110, 120, 150]); const l = l0 + span * T / 100;
      return { q: `A thermometer has a liquid column of ${l0}.0 cm at 0 °C and ${l0 + span}.0 cm at 100 °C. Assuming the length changes uniformly, find the temperature when the length is ${nf(l)} cm.`, zh: '答案可以喺 0–100 °C 以外：把直線延長。', answer: T, unit: '°C', abs: 0.6, rel: 0,
        explain: ex([`T = ${frac(`${nf(l)} − ${l0}`, `${l0 + span} − ${l0}`)} × 100 = <b>${T} °C</b>`, `<span class="note">0–100 °C 以外：把原本的直線延長（below 0 °C or above 100 °C）。</span>`]) };
    } },
  { id: 'w2-bulb', topic: 'w2', type: 'mc', q: 'Which change makes a liquid-in-glass thermometer more sensitive?', zh: '點樣令液體溫度計更靈敏？', options: ['using a larger bulb', 'using a wider capillary tube', 'using a smaller bulb', 'using less liquid in the bulb'], answer: 0, explain: 'A larger bulb contains <b>more</b> liquid → <b>larger</b> increase of length for the same temperature rise → <b>more</b> sensitive.' },
  { id: 'w2-cap', topic: 'w2', type: 'mc', fixed: true, q: 'A narrower capillary tube results in a ______ increase of length of liquid for the same increase of temperature, so the thermometer becomes ______ sensitive.', zh: '幼啲的毛細管……', options: ['larger; more', 'smaller; less', 'larger; less', 'smaller; more'], answer: 0, explain: 'Narrower capillary tube → <b>larger</b> increase of length → <b>more</b> sensitive.' },
  { id: 'w2-ir', topic: 'w2', type: 'mc', q: 'The working principle of an infrared thermometer is that', zh: '紅外線溫度計的原理？', options: ['hotter objects emit more infrared radiation', 'a liquid column expands when heated', 'colder objects emit more infrared radiation', 'gas pressure falls when heated'], answer: 0, explain: 'Hotter objects emit more infrared radiation（溫度越高，紅外線越多）。' },
  { id: 'w2-r1', topic: 'w2', type: 'mc', fixed: true, gen() { const T = pick([-50, -60, -80, -100]); return { q: `Which liquid-in-glass thermometer can measure ${T} °C?`, zh: '水銀：−37 °C 至 356 °C；酒精：−115 °C 至 110 °C。', options: ['alcohol-in-glass thermometer only', 'mercury-in-glass thermometer only', 'both', 'neither'], answer: 0, explain: `${T} °C 低過水銀的下限 −37 °C，但喺酒精範圍（−115 °C 至 110 °C）之內。` }; } },
  { id: 'w2-r2', topic: 'w2', type: 'mc', fixed: true, gen() { const T = pick([150, 200, 250, 300]); return { q: `Which liquid-in-glass thermometer can measure ${T} °C?`, zh: '水銀：−37 °C 至 356 °C；酒精：−115 °C 至 110 °C。', options: ['mercury-in-glass thermometer only', 'alcohol-in-glass thermometer only', 'both', 'neither'], answer: 0, explain: `${T} °C 高過酒精的上限 110 °C，但喺水銀範圍（−37 °C 至 356 °C）之內。` }; } },
  { id: 'w2-hg', topic: 'w2', type: 'mc', q: 'An advantage of a mercury-in-glass thermometer over an alcohol-in-glass thermometer is that mercury', zh: '水銀溫度計比酒精溫度計好在……', options: ['expands more uniformly', 'can measure lower temperatures', 'emits more infrared radiation', 'needs no capillary tube'], answer: 0, explain: 'Classwork 3：mercury expands more uniformly；佢亦可以量較高溫（上限 356 °C）。量低溫就要用酒精（下限 −115 °C）。' },
  { id: 'w2-use', topic: 'w2', type: 'mc', q: 'According to the textbook, an infrared thermometer is used for', zh: '課本：紅外線溫度計的用途？', options: ['body temperature measuring', 'calibrating fixed points', 'measuring the length of a liquid column', 'measuring energy in joules'], answer: 0, explain: 'Infrared thermometer – uses: body temperature measuring. Liquid-in-glass – weather recording, laboratory uses.' },
  { id: 'w2-vac', topic: 'w2', type: 'tf', q: 'In a liquid-in-glass thermometer, the space above the liquid thread is a vacuum.', zh: '液柱上面係真空？', ans: true, explain: '課本圖：bulb → thread → vacuum。' },
  { id: 'w2-lig', topic: 'w2', type: 'tf', q: 'A liquid-in-glass thermometer works because the length (volume) of the liquid column increases with temperature.', zh: '液體溫度計的原理？', ans: true, explain: '正確：T↑ → L↑。' },

  /* ---------------- w3 · heat & power ---------------- */
  { id: 'w3-def', topic: 'w3', type: 'mc', q: 'Heat is', zh: '「熱」的定義是……', options: ['the energy transferred from one body to another due to the temperature difference', 'the temperature of a hot body', 'a form of energy stored in a hot body', 'the rate of energy transfer'], answer: 0, explain: 'Heat is the <b>energy transferred</b> from one body to another <b>due to the temperature difference</b>.' },
  { id: 'w3-store', topic: 'w3', type: 'tf', q: 'Heat is a form of energy that can be stored in a body.', zh: '熱可以儲存在物體入面？', ans: false, explain: 'Heat is the energy transferred. Heat is <b>NOT a form of energy</b> as it <b>cannot be stored</b> in a body.' },
  { id: 'w3-dir', topic: 'w3', type: 'mc', q: 'A block at 80 °C is placed in contact with a block at 50 °C. Which statement is correct?', zh: '80 °C 的方塊貼住 50 °C 的方塊。', options: ['Energy is transferred from the 80 °C block to the 50 °C block until they reach the same temperature.', 'Energy is transferred from the 50 °C block to the 80 °C block.', 'No energy is transferred.', 'Energy keeps flowing even after they reach the same temperature.'], answer: 0, explain: '熱由 <b>hot body → cold body</b>，直到兩者溫度相同（thermal equilibrium）就停。' },
  { id: 'w3-unit', topic: 'w3', type: 'mc', q: 'Heat is measured in', zh: '熱的單位？', options: ['joules (J)', 'watts (W)', 'kelvins (K)', 'degrees Celsius (°C)'], answer: 0, explain: 'The symbol of heat is Q or E；heat is measured in <b>joules (J)</b>。' },
  { id: 'w3-pdef', topic: 'w3', type: 'mc', q: 'Power is', zh: '功率是……', options: ['the rate of energy transferred', 'the total energy transferred', 'the energy needed to raise 1 kg by 1 °C', 'the temperature change per second'], answer: 0, explain: 'Power is the rate of energy transferred：P = E / t。' },
  { id: 'w3-W', topic: 'w3', type: 'mc', q: '1 W is equal to', zh: '1 W 等於……', options: ['1 J s⁻¹', '1 J s', '1 J kg⁻¹', '1 kJ s⁻¹'], answer: 0, explain: '1 W = 1 J s⁻¹（每秒 1 焦耳）。1 kW = 10³ W，1 MW = 10⁶ W。' },
  { id: 'w3-E', topic: 'w3', type: 'num', gen() {
      const P = pick([0.5, 1, 1.2, 1.5, 2, 2.5, 3]), m = pick([2, 3, 5, 10, 15, 20, 30]); const E = P * 1000 * m * 60;
      return { q: `A ${nf(P)}-kW heater is switched on for ${m} minutes. How much energy (in J) is transferred?`, zh: '記得 kW → W（×1000），分鐘 → 秒（×60）。', answer: E, unit: 'J', rel: 0.01,
        traps: [{ v: P * m * 60, msg: '忘記把 kW 轉做 W（×1000）！' }, { v: P * 1000 * m, msg: '忘記把分鐘轉做秒（×60）！' }],
        explain: ex([`E = P t = (${nf(P * 1000)} W) × (${m} × 60 s)`, `= <b>${bigNum(E)} J</b>`]) };
    } },
  { id: 'w3-P', topic: 'w3', type: 'num', gen() {
      const P = pick([400, 500, 600, 750, 800, 1000, 1200, 1500, 2000]), t = pick([30, 60, 90, 120, 150, 200, 300]); const E = P * t;
      return { q: `A heater transfers ${bigNum(E)} J of energy in ${t} s. Find its power.`, zh: 'P = E / t', answer: P, unit: 'W', rel: 0.01, explain: ex([`P = ${frac('E', 't')} = ${frac(bigNum(E), String(t))}`, `= <b>${nf(P)} W</b>`]) };
    } },
  { id: 'w3-kwh', topic: 'w3', type: 'num', gen() { const x = pick([0.5, 1, 1.5, 2, 3, 5, 10]); return { q: `How many joules are there in ${nf(x)} kWh?`, zh: '1 kWh = 3.6 × 10⁶ J', answer: x * 3.6e6, unit: 'J', rel: 0.01, traps: [{ v: x * 3600, msg: '1 kWh = 1000 W × 3600 s，唔好漏咗 ×1000。' }], explain: ex([`1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ J`, `${nf(x)} kWh = ${nf(x)} × 3.6 × 10⁶ = <b>${bigNum(x * 3.6e6)} J</b>`]) }; } },
  { id: 'w3-kwh2', topic: 'w3', type: 'mc', q: '1 kilowatt-hour (kWh) is the energy used by', zh: '1 kWh 是……用的能量', options: ['an appliance of power 1 kW in 1 hour', 'an appliance of power 1 W in 1 hour', 'an appliance of power 1 kW in 1 second', 'an appliance of power 1 kW in 1 minute'], answer: 0, explain: '1 kWh = 1 kW × 1 h = 1000 W × 3600 s = 3.6 × 10⁶ J。' },
  { id: 'w3-meter', topic: 'w3', type: 'mc', q: 'A kilowatt-hour meter measures', zh: '千瓦小時錶量度……', options: ['electrical energy, in kWh', 'power, in kW', 'time, in hours', 'temperature, in K'], answer: 0, explain: 'Kilowatt-hour meter measures <b>energy</b> in kWh；joulemeter measures energy in joules。（kWh 係能量單位，唔係功率！）' },
  { id: 'w3-jm', topic: 'w3', type: 'mc', q: 'A joulemeter measures energy in', zh: '焦耳計用乜單位？', options: ['joules', 'watts', 'kilowatt-hours', 'kelvins'], answer: 0, explain: 'Joulemeter measures energy in Joules.' },
  { id: 'w3-t', topic: 'w3', type: 'num', gen() { const P = pick([500, 800, 1000, 1500, 2000]), t = pick([60, 90, 120, 180, 240, 300]); const E = P * t; return { q: `How long does a ${nf(P)} W heater take to supply ${bigNum(E)} J of energy?`, zh: 't = E / P', answer: t, unit: 's', rel: 0.01, explain: ex([`t = ${frac('E', 'P')} = ${frac(bigNum(E), nf(P))} = <b>${t} s</b>`]) }; } },
  { id: 'w3-cw4', topic: 'w3', type: 'num', src: 'Classwork 4', q: 'A 2-kW electric kettle is used to heat some cold water. How much energy (in J) is transferred to the water if it is switched on for 1 hour?', zh: '2 kW 電熱水壺開 1 小時。', answer: 7.2e6, unit: 'J', rel: 0.01, traps: [{ v: 2 * 3600, msg: '2 kW = 2000 W！' }, { v: 2000, msg: '1 小時 = 3600 s！' }], explain: ex(['E = P t = 2000 W × 3600 s', '= <b>7.2 × 10⁶ J</b>']) },

  /* ---------------- w4 · heat capacity & specific heat capacity ---------------- */
  { id: 'w4-Cdef', topic: 'w4', type: 'mc', q: 'The heat capacity of a body is', zh: '熱容量 C 的定義？', options: ['the amount of energy required to raise its temperature by 1 °C', 'the energy required to raise the temperature of 1 kg of the substance by 1 °C', 'the total energy stored in the body', 'the rate of energy transfer to the body'], answer: 0, explain: 'Heat capacity（C）：energy required to raise <b>the body</b> by 1 °C。比熱容 c 先係講 <b>1 kg</b>。' },
  { id: 'w4-cdef', topic: 'w4', type: 'mc', q: 'The specific heat capacity of a substance is', zh: '比熱容 c 的定義？', options: ['the energy required to raise the temperature of 1 kg of the substance by 1 °C', 'the energy required to raise the temperature of the whole body by 1 °C', 'the temperature rise of 1 kg of the substance', 'the energy given to the substance per second'], answer: 0, explain: 'Specific heat capacity（c）：energy required to raise the temperature of <b>1 kg</b> of the substance by <b>1 °C</b>。' },
  { id: 'w4-Cu', topic: 'w4', type: 'mc', q: 'The unit of heat capacity is', zh: '熱容量 C 的單位？', options: ['J °C⁻¹ (or J K⁻¹)', 'J kg⁻¹ °C⁻¹', 'J', 'W'], answer: 0, explain: 'C = E / ΔT → J ÷ °C = <b>J °C⁻¹</b>（= J K⁻¹）。' },
  { id: 'w4-cu', topic: 'w4', type: 'mc', q: 'The unit of specific heat capacity is', zh: '比熱容 c 的單位？', options: ['J kg⁻¹ °C⁻¹ (or J kg⁻¹ K⁻¹)', 'J °C⁻¹', 'J kg⁻¹', 'J s⁻¹'], answer: 0, explain: 'c = E / (mΔT) → J ÷ kg ÷ °C = <b>J kg⁻¹ °C⁻¹</b>（= J kg⁻¹ K⁻¹）。' },
  { id: 'w4-dep', topic: 'w4', type: 'mc', fixed: true, q: 'The heat capacity of a body depends on', zh: '熱容量取決於……', options: ['both the mass and the substance of the body', 'the mass only', 'the substance only', 'neither the mass nor the substance'], answer: 0, explain: 'C = mc：質量（m）同物質（c）都有關。' },
  { id: 'w4-ind', topic: 'w4', type: 'mc', q: 'The specific heat capacity of a substance', zh: '比熱容……', options: ['is independent of its mass', 'doubles when the mass doubles', 'halves when the mass doubles', 'depends on the shape of the object'], answer: 0, explain: 'Specific heat capacity of a substance is <b>independent of its mass</b>（1 kg 水同 2 kg 水都係 4200）。' },
  { id: 'w4-Cmc', topic: 'w4', type: 'mc', q: 'For a body of mass m made of a substance of specific heat capacity c, its heat capacity C is', zh: 'C、m、c 的關係？', options: ['C = mc', 'C = m / c', 'C = c / m', 'C = m + c'], answer: 0, explain: 'For a given substance, heat capacity = mass × specific heat capacity：<b>C = mc</b>（或 c = C / m）。' },
  { id: 'w4-cw7a', topic: 'w4', type: 'mc', fixed: true, src: 'Classwork 7 Q1', q: 'Which of the following pairs of objects have different specific heat capacities?', zh: '邊一對的比熱容唔同？', options: ['1 kg of water and 2 kg of water', '1 kg of liquid naphthalene and 1 kg of solid naphthalene', 'a rectangular block of aluminium of mass 1 kg and a cylindrical block of aluminium of mass 1 kg', '1 kg of oil in a glass container and 1 kg of oil in a metal container', '1 kg of water at 15 °C and 1 kg of water at 30 °C'], answer: 1, explain: 'c 只取決於物質（同埋佢的狀態）：液態同固態 naphthalene 狀態唔同 → c 唔同（好似 ice 2100、water 4200）。質量、形狀、容器、溫度都唔改變 c。' },
  { id: 'w4-ECT', topic: 'w4', type: 'num', gen() { const C = pick([500, 800, 1200, 2000, 2500, 5000]), d = pick([5, 10, 15, 20, 25, 40]); return { q: `The heat capacity of a metal block is ${nf(C)} J °C⁻¹. Find the energy required to raise its temperature by ${d} °C.`, zh: 'E = CΔT', answer: C * d, unit: 'J', rel: 0.01, explain: ex([`E = C ΔT = ${nf(C)} × ${d}`, `= <b>${nf(C * d)} J</b>`]) }; } },
  { id: 'w4-cola', topic: 'w4', type: 'num', gen() { const C = pick([1000, 1200, 1500, 1800]), a = pick([25, 28, 30]), b = pick([2, 4, 5, 8]); return { q: `A can of drink (heat capacity ${nf(C)} J °C⁻¹) is cooled from ${a} °C to ${b} °C in a freezer. How much energy must be removed?`, zh: '降溫一樣用 E = CΔT，ΔT = 溫度變化。', answer: C * (a - b), unit: 'J', rel: 0.01, traps: [{ v: C * b, msg: 'ΔT 係「變化」：要用 初溫 − 終溫。' }, { v: C * a, msg: 'ΔT 係「變化」：要用 初溫 − 終溫。' }], explain: ex([`E = C ΔT = ${nf(C)} × (${a} − ${b})`, `= <b>${nf(C * (a - b))} J</b>`]) }; } },
  { id: 'w4-mcT', topic: 'w4', type: 'num', gen() {
      const s = pick(SUBSTANCES.filter(x => !['air', 'steam'].includes(x.id))), useG = Math.random() < 0.5;
      const m = useG ? pick([200, 250, 300, 400, 500, 800]) : pick([0.5, 1, 1.5, 2, 3]); const mk = useG ? m / 1000 : m;
      const a = s.id === 'ice' ? pick([-30, -20, -15, -10]) : pick([10, 15, 20, 25]);
      const b = s.id === 'ice' ? 0 : pick([40, 50, 60, 80, 100]); const E = mk * s.c * (b - a);
      return { q: `How much energy is needed to raise the temperature of ${nf(m)} ${useG ? 'g' : 'kg'} of ${s.en.replace(/ \(.*\)/, '')} from ${nf(a)} °C to ${b} °C? (specific heat capacity of ${s.en.replace(/ \(.*\)/, '')} = ${s.c} J kg⁻¹ °C⁻¹)`, zh: 'E = mcΔT；質量要用 kg。', answer: E, unit: 'J', rel: 0.01,
        traps: [{ v: m * s.c * (b - a), msg: '質量要轉做 kg！' }, { v: mk * s.c * b, msg: 'ΔT 係溫度「變化」，唔係終溫。' }],
        explain: ex([`E = m c ΔT = ${nf(mk)} × ${s.c} × (${b} − ${a < 0 ? `(${nf(a)})` : a})`, `= <b>${bigNum(round(E, 2))} J</b>`]) };
    } },
  { id: 'w4-final', topic: 'w4', type: 'num', gen() { const m = pick([1, 2, 3, 4, 5]), d = pick([5, 10, 15, 20, 25]), a = pick([15, 20, 25]); const E = m * 4200 * d; return { q: `${bigNum(E)} J of energy is transferred to ${m} kg of water at ${a} °C. What is the final temperature of the water? (c of water = 4200 J kg⁻¹ °C⁻¹)`, zh: '先計 ΔT = E/(mc)，再加返初溫。', answer: a + d, unit: '°C', abs: 0.2, rel: 0, traps: [{ v: d, msg: '呢個係 ΔT，仲要加返初溫！' }], explain: ex([`ΔT = ${frac('E', 'mc')} = ${frac(bigNum(E), `${m} × 4200`)} = ${d} °C`, `final temperature = ${a} + ${d} = <b>${a + d} °C</b>`]) }; } },
  { id: 'w4-c', topic: 'w4', type: 'num', gen() { const s = pick(SUBSTANCES.filter(x => ['copper', 'iron', 'aluminium', 'glass', 'lead', 'alcohol'].includes(x.id))), m = pick([0.5, 1, 2, 4]), d = pick([10, 20, 25, 40, 50]); const E = m * s.c * d; return { q: `${bigNum(E)} J of energy raises the temperature of ${nf(m)} kg of a substance by ${d} °C. Find the specific heat capacity of the substance.`, zh: 'c = E / (mΔT)', answer: s.c, unit: 'J kg⁻¹ °C⁻¹', rel: 0.01, explain: ex([`c = ${frac('E', 'm ΔT')} = ${frac(bigNum(E), `${nf(m)} × ${d}`)}`, `= <b>${s.c} J kg⁻¹ °C⁻¹</b>（查表：${s.en}）`]) }; } },
  { id: 'w4-C', topic: 'w4', type: 'num', gen() { const s = pick(SUBSTANCES.filter(x => ['copper', 'iron', 'aluminium', 'water', 'glass'].includes(x.id))), m = pick([0.5, 2, 3, 5, 10]); return { q: `Find the heat capacity of a ${nf(m)} kg block of ${s.en}. (c = ${s.c} J kg⁻¹ °C⁻¹)`, zh: 'C = mc', answer: m * s.c, unit: 'J °C⁻¹', rel: 0.01, explain: ex([`C = m c = ${nf(m)} × ${s.c}`, `= <b>${nf(m * s.c)} J °C⁻¹</b>`]) }; } },
  { id: 'w4-P', topic: 'w4', type: 'num', gen() { const m = pick([0.5, 1, 2]), d = pick([20, 30, 40, 50, 60]), min = pick([2, 3, 4, 5, 6, 8, 10]); const E = m * 4200 * d, P = E / (min * 60); return { q: `An immersion heater takes ${min} minutes to raise the temperature of ${nf(m)} kg of water by ${d} °C. Calculate the power of the heater. (c of water = 4200 J kg⁻¹ °C⁻¹; assume no energy loss)`, zh: '先 E = mcΔT，再 P = E/t（t 要用秒）。', answer: P, unit: 'W', rel: 0.01, traps: [{ v: E / min, msg: 't 要轉做秒（×60）！' }], explain: ex([`E = m c ΔT = ${nf(m)} × 4200 × ${d} = ${nf(E)} J`, `P = ${frac('E', 't')} = ${frac(nf(E), `${min} × 60`)} = <b>${nf(round(P, 1))} W</b>`]) }; } },
  { id: 'w4-t', topic: 'w4', type: 'num', gen() { const P = pick([1, 1.1, 1.2, 1.5, 2]), m = pick([0.5, 1, 1.5, 2]), a = pick([20, 25, 30]); const E = m * 4200 * (100 - a), t = E / (P * 1000); return { q: `An electric cooker of power ${nf(P)} kW contains ${nf(m)} kg of water. How long would it take to raise the temperature of the water from ${a} °C to 100 °C? (c of water = 4200 J kg⁻¹ °C⁻¹; assume no energy loss)`, zh: 't = E / P = mcΔT / P', answer: t, unit: 's', rel: 0.01, traps: [{ v: E / P, msg: 'kW 要轉做 W（×1000）！' }], explain: ex([`E = m c ΔT = ${nf(m)} × 4200 × (100 − ${a}) = ${nf(E)} J`, `t = ${frac('E', 'P')} = ${frac(nf(E), nf(P * 1000))} = <b>${nf(round(t, 1))} s</b>`, '<span class="note">實際會更耐：有能量散失到周圍、又俾容器吸收咗。</span>']) }; } },
  { id: 'w4-real', topic: 'w4', type: 'mc', q: 'In practice, a rice cooker takes longer than the calculated time to heat the water. Why?', zh: '點解實際時間比計出嚟長？', options: ['Energy is lost to the surroundings and absorbed by the container.', 'Water has a low specific heat capacity.', 'The power of the cooker increases with time.', 'Energy is created inside the water.'], answer: 0, explain: 'Energy supplied by cooker &gt; energy absorbed by water：部分能量去咗周圍空氣同容器。' },
  { id: 'w4-more', topic: 'w4', type: 'mc', q: 'Equal masses of copper and water absorb the same amount of energy. Which has the greater rise in temperature?', zh: '同質量的銅和水吸收同樣能量，邊個升溫多？', options: ['copper, because its specific heat capacity is smaller', 'water, because its specific heat capacity is larger', 'both rise by the same amount', 'it cannot be determined'], answer: 0, explain: 'ΔT = E/(mc)：c 細（銅 390）→ ΔT 大；水 4200 → ΔT 細。' },
  { id: 'w4-high', topic: 'w4', type: 'mc', q: 'For the same mass, a substance with a higher specific heat capacity will', zh: '同質量，比熱容高的物質會……', options: ['need more energy to increase its temperature by 1 °C', 'need less energy to increase its temperature by 1 °C', 'release less energy when its temperature drops by 1 °C', 'always have a higher temperature'], answer: 0, explain: 'Higher c → need <b>more</b> energy to increase its temperature by 1 °C；release <b>more</b> energy when its temperature drops by 1 °C。' },
  { id: 'w4-tf1', topic: 'w4', type: 'tf', q: '1 kg of water and 2 kg of water have the same specific heat capacity.', zh: '1 kg 水同 2 kg 水比熱容一樣？', ans: true, explain: '啱。c 同質量無關，兩者都係 4200 J kg⁻¹ °C⁻¹。' },
  { id: 'w4-tf2', topic: 'w4', type: 'tf', q: '1 kg of water and 2 kg of water have the same heat capacity.', zh: '1 kg 水同 2 kg 水熱容量一樣？', ans: false, explain: '錯。C = mc：1 kg 水 C = 4200 J °C⁻¹；2 kg 水 C = 8400 J °C⁻¹。' },
  { id: 'w4-tf3', topic: 'w4', type: 'tf', q: 'Ice (at 0 °C) and water have the same specific heat capacity.', zh: '冰同水比熱容一樣？', ans: false, explain: '錯。課本表：ice 2100、water 4200 J kg⁻¹ °C⁻¹——同一種物質，狀態唔同，c 都唔同。' },
  { id: 'w4-tf4', topic: 'w4', type: 'tf', q: 'J kg⁻¹ °C⁻¹ and J kg⁻¹ K⁻¹ are two ways of writing the same unit.', zh: '兩個單位一樣？', ans: true, explain: '啱。溫度「變化」1 °C = 1 K，所以 per °C 同 per K 一樣。' },
  { id: 'w4-cw5a', topic: 'w4', type: 'num', src: 'Classwork 5 Q1', q: 'The heat capacity of a 10 kg metal block is 5 000 J °C⁻¹. Find the energy required to raise the temperature of the block by 20 °C.', zh: '已經畀咗 C，唔使理 10 kg。', answer: 1e5, unit: 'J', rel: 0.01, traps: [{ v: 1e6, msg: '已經有 C，唔使再乘 10 kg！' }], explain: ex(['E = C ΔT = 5000 × 20', '= <b>100 000 J</b>（1 × 10⁵ J）']) },
  { id: 'w4-cw5b', topic: 'w4', type: 'num', src: 'Classwork 5 Q2', q: 'A can of cola is placed in a freezer. How much energy must be removed to cool it down from 25 °C to 5 °C? The heat capacity of a can of cola is 1200 J °C⁻¹.', zh: '降溫 ΔT = 25 − 5', answer: 24000, unit: 'J', rel: 0.01, traps: [{ v: 6000, msg: 'ΔT 係 25 − 5 = 20 °C。' }, { v: 30000, msg: 'ΔT 係 25 − 5 = 20 °C。' }], explain: ex(['E = C ΔT = 1200 × (25 − 5)', '= <b>24 000 J</b>']) },
  { id: 'w4-cw6', topic: 'w4', type: 'num', src: 'Classwork 6', gen() {
      const c = pick([
        { q: 'a 2 kg copper block from 20 °C to 100 °C', m: 2, c: 390, d: 80, tr: 2 * 390 * 100 },
        { q: '500 g of water from 25 °C to 80 °C', m: 0.5, c: 4200, d: 55, tr: 500 * 4200 * 55 },
        { q: '300 g of ice from −20 °C to 0 °C', m: 0.3, c: 2100, d: 20, tr: 300 * 2100 * 20 },
        { q: 'a 2 kg aluminium block from 15 °C to 200 °C', m: 2, c: 900, d: 185, tr: 2 * 900 * 200 }]);
      return { q: `How much energy is needed for increasing the temperature of ${c.q}? (Use the table: copper 390, water 4200, ice 2100, aluminium 900 J kg⁻¹ °C⁻¹)`, zh: 'E = mcΔT（g → kg）', answer: c.m * c.c * c.d, unit: 'J', rel: 0.01, traps: [{ v: c.tr, msg: '睇清楚：質量要 kg、ΔT 要用溫度變化。' }], explain: ex([`E = m c ΔT = ${nf(c.m)} × ${c.c} × ${c.d}`, `= <b>${nf(c.m * c.c * c.d)} J</b>`]) };
    } },
  { id: 'w4-cw7b', topic: 'w4', type: 'num', src: 'Classwork 7 Q2', q: 'If 180 000 J of energy is transferred to 3 kg of water whose original temperature is 20 °C, what is the final temperature of the water? (c of water = 4200 J kg⁻¹ °C⁻¹)', zh: 'ΔT = E/(mc)，再加 20 °C。', answer: 34.29, unit: '°C', abs: 0.15, rel: 0, traps: [{ v: 14.29, msg: '14.3 °C 係 ΔT，仲要加返 20 °C！' }], explain: ex(['ΔT = 180 000 ÷ (3 × 4200) = 14.3 °C', 'final temperature = 20 + 14.3 = <b>34.3 °C</b>']) },
  { id: 'w4-cw7c', topic: 'w4', type: 'num', src: 'Classwork 7 Q3', q: 'An immersion heater takes 4 minutes to raise the temperature of 0.5 kg of water by 50 °C. Calculate the power of the heater. (c of water = 4200 J kg⁻¹ °C⁻¹)', zh: 'E = mcΔT，t = 4 × 60 s', answer: 437.5, unit: 'W', rel: 0.005, traps: [{ v: 26250, msg: '4 分鐘 = 240 s！' }], explain: ex(['E = 0.5 × 4200 × 50 = 105 000 J', 'P = 105 000 ÷ 240 = <b>437.5 W</b>']) },
  { id: 'w4-cw7d', topic: 'w4', type: 'num', src: 'Classwork 7 Q4', q: 'An electric rice-cooker of power 1.1 kW contains 1 kg of water. How long would it take for the cooker to raise the temperature of the water from 25 °C to 100 °C? (c of water = 4200 J kg⁻¹ °C⁻¹)', zh: 't = mcΔT / P', answer: 286.4, unit: 's', rel: 0.01, traps: [{ v: 286363.6, msg: '1.1 kW = 1100 W！' }], explain: ex(['E = 1 × 4200 × (100 − 25) = 315 000 J', 't = 315 000 ÷ 1100 = <b>286 s</b>', '<span class="note">實際更耐：energy is lost to surrounding air and absorbed by the container.</span>']) },

  /* ---------------- w5 · water ---------------- */
  { id: 'w5-c', topic: 'w5', type: 'mc', q: 'The specific heat capacity of water is', zh: '水的比熱容？', options: ['4200 J kg⁻¹ °C⁻¹', '420 J kg⁻¹ °C⁻¹', '2100 J kg⁻¹ °C⁻¹', '1000 J kg⁻¹ °C⁻¹'], answer: 0, explain: 'Water：4200 J kg⁻¹ °C⁻¹（課本表中最高）。2100 係冰，1000 係空氣。' },
  { id: 'w5-mean', topic: 'w5', type: 'mc', q: 'Water has a high specific heat capacity. This means that water', zh: '水比熱容高，即係……', options: ['absorbs a large amount of energy to increase its temperature', 'heats up very quickly', 'releases little energy when it cools down', 'cannot be heated above 100 °C'], answer: 0, explain: 'Water absorbs a <b>large</b> amount of energy to increase its temperature, and releases a <b>large</b> amount when its temperature decreases → 水溫好難改變。' },
  { id: 'w5-cool', topic: 'w5', type: 'mc', q: 'Water is used as a coolant in car engines because', zh: '點解用水做引擎冷卻劑？', options: ['it can absorb a large amount of heat from the engine (high specific heat capacity)', 'it has a low specific heat capacity', 'it makes the engine produce less heat', 'it is a fuel'], answer: 0, explain: 'Engines generate a large amount of heat；water is circulated in pipes around the engine and absorbs a large amount of heat.' },
  { id: 'w5-day', topic: 'w5', type: 'mc', q: 'During daytime, compared with an inland area, a coastal area has', zh: '日間，海邊比內陸……', options: ['a lower temperature', 'a higher temperature', 'the same temperature', 'no change in temperature'], answer: 0, explain: '海水比熱容大，日間吸收咗大量能量都升溫唔多 → coastal area <b>lower</b> temperature。' },
  { id: 'w5-night', topic: 'w5', type: 'mc', q: 'At night, compared with an inland area, a coastal area has', zh: '夜晚，海邊比內陸……', options: ['a higher temperature', 'a lower temperature', 'the same temperature', 'no temperature at all'], answer: 0, explain: '海水放出大量能量但降溫唔多 → coastal area <b>higher</b> temperature at night。' },
  { id: 'w5-range', topic: 'w5', type: 'mc', q: 'Compared with an inland area, a coastal area has a ______ temperature range in a day.', zh: '海邊一日內的溫差……', options: ['smaller', 'larger', 'same', 'zero'], answer: 0, explain: '日間較涼、夜晚較暖 → <b>smaller</b> temperature range（maintain a steady temperature）。' },
  { id: 'w5-soil', topic: 'w5', type: 'mc', q: 'A certain mass of water needs about ____ times more heat than the same mass of soil for its temperature to rise by 1 °C.', zh: '水 vs 泥土', options: ['5', '2', '10', '100'], answer: 0, explain: '課本：water needs <b>5 times</b> more heat than the same mass of soil.' },
  { id: 'w5-body', topic: 'w5', type: 'mc', q: 'About what percentage of the human body is composed of water?', zh: '人體約有幾多 % 係水？', options: ['70 %', '30 %', '50 %', '90 %'], answer: 0, explain: '<b>70 %</b> of human body is composed of water.' },
  { id: 'w5-bodyT', topic: 'w5', type: 'tf', q: 'The human body can gain or lose a certain amount of energy without a large change in body temperature.', zh: '人體得到或失去一定能量，體溫都唔會大變？', ans: true, explain: '啱。因為人體約 70 % 係水，而水的比熱容高。' },
  { id: 'w5-rel', topic: 'w5', type: 'tf', q: 'Water releases only a small amount of energy when its temperature decreases.', zh: '水降溫時只會放出少量能量？', ans: false, explain: '錯。Water releases a <b>large</b> amount of energy when its temperature decreases.' },

  /* ---------------- w6 · conservation of energy ---------------- */
  { id: 'w6-law', topic: 'w6', type: 'mc', q: 'The law of conservation of energy states that', zh: '能量守恆定律？', options: ['energy cannot be created or destroyed; it only changes from one form to another', 'energy can be created by heaters', 'thermal energy always disappears after mixing', 'temperature is always conserved'], answer: 0, explain: 'Energy cannot be created or destroyed. Energy only changes from one form to another（e.g. electrical energy → thermal energy）。' },
  { id: 'w6-form', topic: 'w6', type: 'mc', q: 'An electric kettle heats water. The main energy change is', zh: '電熱水壺的能量轉換？', options: ['electrical energy → thermal energy', 'thermal energy → electrical energy', 'thermal energy → nothing', 'nothing → thermal energy'], answer: 0, explain: '課本例子：electrical energy → thermal energy。' },
  { id: 'w6-eq', topic: 'w6', type: 'mc', q: 'A hot object and a cold object are in thermal contact. Assuming no heat loss to the surroundings,', zh: '假設冇熱散失……', options: ['energy lost by the hotter object = energy gained by the colder object', 'energy lost by the hotter object > energy gained by the colder object', 'both objects gain energy', 'the final temperature is always the average of the two initial temperatures'], answer: 0, explain: 'energy lost by the hotter object = energy gained by the colder object：m<sub>h</sub>c<sub>h</sub>(T<sub>h</sub> − T<sub>f</sub>) = m<sub>c</sub>c<sub>c</sub>(T<sub>f</sub> − T<sub>c</sub>)。（只有 m c 一樣先會係平均值。）' },
  { id: 'w6-btw', topic: 'w6', type: 'mc', q: 'When hot water is mixed with cold water (no heat loss), the final temperature of the mixture is', zh: '混合後的溫度……', options: ['between the two initial temperatures', 'higher than both initial temperatures', 'lower than both initial temperatures', 'equal to the higher initial temperature'], answer: 0, explain: '熱水降溫、冷水升溫，最後喺中間某處達到 thermal equilibrium。' },
  { id: 'w6-Q', topic: 'w6', type: 'mc', q: 'In E = Q₁ + Q₂ + Q₃ + …, E is the total energy supplied (or heat lost by the hotter bodies). Q₁ can be', zh: 'E = Q₁ + Q₂ + Q₃ 中的 Q₁？', options: ['the heat gained by body 1 (or the surroundings)', 'the power of the heater', 'the temperature change of body 1', 'the specific heat capacity of body 1'], answer: 0, explain: 'Q₁ = heat gained by body 1 (or surroundings)；Q₂ = heat gained by body 2……' },
  { id: 'w6-mix', topic: 'w6', type: 'num', gen() {
      const mh = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1]), mc = pick([0.2, 0.3, 0.4, 0.5, 0.6, 1]), Th = pick([60, 70, 80, 85, 90, 95]), Tc = pick([5, 10, 15, 20, 25]);
      const Tf = (mh * Th + mc * Tc) / (mh + mc);
      return { q: `${nf(mh)} kg of water at ${Th} °C is added to ${nf(mc)} kg of water at ${Tc} °C. Find the final temperature of the mixture. (Assume no energy is lost to the surroundings.)`, zh: '熱水失去的能量 = 冷水得到的能量', answer: Tf, unit: '°C', abs: 0.15, rel: 0, traps: [{ v: (Th + Tc) / 2, msg: '唔可以直接取平均：兩杯水質量唔同！' }],
        explain: ex([`${nf(mh)} × 4200 × (${Th} − T) = ${nf(mc)} × 4200 × (T − ${Tc})`, `T = ${frac(`${nf(mh)} × ${Th} + ${nf(mc)} × ${Tc}`, `${nf(mh)} + ${nf(mc)}`)} = <b>${nf(round(Tf, 1))} °C</b>`]) };
    } },
  { id: 'w6-metal', topic: 'w6', type: 'num', gen() {
      const s = pick(SUBSTANCES.filter(x => ['copper', 'iron', 'aluminium', 'lead'].includes(x.id))), mm = pick([0.2, 0.5, 1]), Tm = pick([100, 150, 200]), mw = pick([0.5, 1, 2]), Tw = pick([15, 20, 25]);
      const Tf = (mm * s.c * Tm + mw * 4200 * Tw) / (mm * s.c + mw * 4200);
      return { q: `A ${nf(mm)} kg ${s.en} block at ${Tm} °C is put into ${nf(mw)} kg of water at ${Tw} °C. Find the final temperature. (c of ${s.en} = ${s.c} J kg⁻¹ °C⁻¹, c of water = 4200 J kg⁻¹ °C⁻¹; no energy loss)`, zh: 'm₁c₁(T₁ − T) = m₂c₂(T − T₂)', answer: Tf, unit: '°C', abs: 0.15, rel: 0,
        explain: ex([`${nf(mm)} × ${s.c} × (${Tm} − T) = ${nf(mw)} × 4200 × (T − ${Tw})`, `T = ${frac(`${nf(mm * s.c)} × ${Tm} + ${nf(mw * 4200)} × ${Tw}`, `${nf(mm * s.c)} + ${nf(mw * 4200)}`)} = <b>${nf(round(Tf, 1))} °C</b>`]) };
    } },
  { id: 'w6-cfind', topic: 'w6', type: 'num', gen() {
      const mo = pick([0.2, 0.4, 0.5]), To = pick([2, 5, 10]), mw = pick([0.5, 1]), Tw = pick([80, 90]), Tf = Tw - pick([10, 15, 20]);
      const c = mw * 4200 * (Tw - Tf) / (mo * (Tf - To));
      if (c < 800 || c > 4500) return this.gen();
      return { q: `${nf(mo)} kg of food at ${To} °C is put into ${nf(mw)} kg of water at ${Tw} °C. The final temperature is ${Tf} °C. Find the specific heat capacity of the food. (c of water = 4200 J kg⁻¹ °C⁻¹; no energy loss)`, zh: '水失去的能量 = 食物得到的能量，再解 c。', answer: c, unit: 'J kg⁻¹ °C⁻¹', rel: 0.01,
        explain: ex([`${nf(mw)} × 4200 × (${Tw} − ${Tf}) = ${nf(mo)} × c × (${Tf} − ${To})`, `${nf(mw * 4200 * (Tw - Tf))} = ${nf(round(mo * (Tf - To), 2))} c`, `c = <b>${nf(round(c, 0))} J kg⁻¹ °C⁻¹</b>`]) };
    } },
  { id: 'w6-cont', topic: 'w6', type: 'num', gen() {
      const mh = pick([1, 2]), Th = pick([60, 70, 80]), mc = pick([0.5, 1]), Tc = pick([10, 15, 20]), mk = pick([0.2, 0.5]), s = pick(SUBSTANCES.filter(x => ['iron', 'copper', 'aluminium'].includes(x.id)));
      const Tf = (mh * 4200 * Th + (mc * 4200 + mk * s.c) * Tc) / (mh * 4200 + mc * 4200 + mk * s.c);
      return { q: `${nf(mh)} kg of water at ${Th} °C is added to ${nf(mc)} kg of water at ${Tc} °C in a ${s.en} container of mass ${nf(mk)} kg. Find the final temperature. (c of water = 4200, c of ${s.en} = ${s.c} J kg⁻¹ °C⁻¹; no energy lost to the surroundings)`, zh: '容器同冷水一齊由 T_c 開始升溫：熱水失去 = 冷水得到 + 容器得到', answer: Tf, unit: '°C', abs: 0.15, rel: 0,
        explain: ex([`${nf(mh)}(4200)(${Th} − T) = ${nf(mc)}(4200)(T − ${Tc}) + ${nf(mk)}(${s.c})(T − ${Tc})`, `T = <b>${nf(round(Tf, 1))} °C</b>`]) };
    } },
  { id: 'w6-cw8a', topic: 'w6', type: 'num', src: 'Classwork 8 Q1', q: '0.5 kg of water at 90 °C is added to 0.2 kg of water at 15 °C. Find the final temperature of the “mixture”. (No energy lost to the surroundings.)', zh: '熱水失去 = 冷水得到', answer: 68.57, unit: '°C', abs: 0.15, rel: 0, traps: [{ v: 52.5, msg: '唔可以直接取平均，質量唔同！' }], explain: ex(['0.5 × 4200 × (90 − T) = 0.2 × 4200 × (T − 15)', '45 − 0.5T = 0.2T − 3 → T = <b>68.6 °C</b>']) },
  { id: 'w6-cw8b', topic: 'w6', type: 'num', src: 'Classwork 8 Q2', q: '0.5 kg of water at 80 °C is added to 0.3 kg of water at 10 °C in a polystyrene cup. What is the final temperature of the “mixture”?', zh: '發泡膠杯吸熱好少，當冇。', answer: 53.75, unit: '°C', abs: 0.15, rel: 0, traps: [{ v: 45, msg: '唔可以直接取平均，質量唔同！' }], explain: ex(['0.5 × 4200 × (80 − T) = 0.3 × 4200 × (T − 10)', '40 − 0.5T = 0.3T − 3 → T = <b>53.8 °C</b>']) },
  { id: 'w6-cw8c', topic: 'w6', type: 'num', src: 'Classwork 8 Q3', q: '0.5 kg of ham at 5 °C is put into 1 kg of water at 90 °C. If the final temperature of the “mixture” is 70 °C, find the specific heat capacity of the ham. (c of water = 4200 J kg⁻¹ °C⁻¹)', zh: '水失去 = 火腿得到', answer: 2584.6, unit: 'J kg⁻¹ °C⁻¹', rel: 0.01, explain: ex(['1 × 4200 × (90 − 70) = 0.5 × c × (70 − 5)', '84 000 = 32.5 c', 'c = <b>2585 J kg⁻¹ °C⁻¹</b>（≈ 2580）']) },
  { id: 'w6-cw8d', topic: 'w6', type: 'num', src: 'Classwork 8 Q4', q: '2 kg of water at 60 °C is added to 1 kg of water at 10 °C in an iron container of mass 0.5 kg. What is the final temperature of the “mixture”? (c of water = 4200 J kg⁻¹ °C⁻¹, c of iron = 480 J kg⁻¹ °C⁻¹)', zh: '熱水失去 = 冷水得到 + 鐵容器得到', answer: 42.71, unit: '°C', abs: 0.15, rel: 0, traps: [{ v: 43.33, msg: '漏咗鐵容器都要吸熱！' }], explain: ex(['2(4200)(60 − T) = 1(4200)(T − 10) + 0.5(480)(T − 10)', '504 000 − 8400T = 4440T − 44 400', 'T = 548 400 ÷ 12 840 = <b>42.7 °C</b>']) },

  /* ---------------- w7 · temperature–time graph ---------------- */
  { id: 'w7-slope', topic: 'w7', type: 'mc', q: 'With the same power supplied, a substance with a smaller heat capacity will have ______ on its temperature–time graph.', zh: '同一功率，熱容量細的物質……', options: ['a steeper slope', 'a gentler slope', 'a horizontal line', 'the same slope'], answer: 0, explain: 'Smaller heat capacity → <b>steeper</b> slope（takes <b>less</b> time to increase its temperature）。' },
  { id: 'w7-time', topic: 'w7', type: 'mc', q: 'With the same power supplied, a substance with a smaller heat capacity takes ______ time to increase its temperature by the same amount.', zh: '熱容量細 → 升溫需時？', options: ['less', 'more', 'the same', 'infinite'], answer: 0, explain: 'C 細 → 每升 1 °C 需要的能量少 → 用時少。' },
  { id: 'w7-cw9a', topic: 'w7', type: 'mc', fixed: true, src: 'Classwork 9 Q1', q: 'Four liquids P, Q, R and S with the same mass are heated at the same rate. The graph shows the variation of their temperatures with time. Which liquid has the highest specific heat capacity?', zh: '同質量、同加熱速率：線越平 → c 越大。',
    graph: lineGraph({ x: [0, 22], y: [0, 112], xt: [10, 20], yt: [50, 100], xl: 'Time / minute', yl: 'Temperature / °C', mono: true, lines: [{ p: [[0, 50], [10, 100]], label: 'P', at: [4, 70], dx: -16, dy: -6 }, { p: [[0, 0], [10, 100]], label: 'Q', at: [2.4, 24], dx: -18, dy: 0 }, { p: [[0, 50], [20, 100]], label: 'R', at: [15, 87.5], dx: -4, dy: -10 }, { p: [[0, 0], [20, 100]], label: 'S', at: [15, 75], dx: 8, dy: 14 }], guides: [[[0, 100], [20, 100]], [[10, 0], [10, 100]], [[20, 0], [20, 100]]] }),
    options: ['P', 'Q', 'R', 'S'], answer: 2, explain: '斜率：P = 50/10 = 5、Q = 100/10 = 10、R = 50/20 = 2.5、S = 100/20 = 5 °C/min。R 最平 → 每升 1 °C 要最多能量 → c 最大（答案 C）。' },
  { id: 'w7-cw9b', topic: 'w7', type: 'mc', fixed: true, src: 'Classwork 9 Q2', q: 'Energy is transferred to two copper blocks X and Y at the same rate. The graph shows how the temperatures of the blocks change with time. The ratio of the heat capacity of block X to that of block Y is',
    zh: '同時間 → 同能量 E。E = CΔT，ΔT 大 → C 細。',
    graph: lineGraph({ x: [0, 10], y: [0, 90], yt: [25, 50, 75], xl: 'time', yl: 'temperature / °C', mono: true, lines: [{ p: [[0, 25], [10, 75]], label: 'X' }, { p: [[0, 25], [10, 50]], label: 'Y' }], guides: [[[0, 75], [10, 75]], [[0, 50], [10, 50]]] }),
    options: ['4 : 1', '2 : 1', '1 : 2', '1 : 4'], answer: 2, explain: '同一段時間 E 一樣。ΔT<sub>X</sub> = 50 °C，ΔT<sub>Y</sub> = 25 °C。C = E/ΔT → C<sub>X</sub> : C<sub>Y</sub> = 1/50 : 1/25 = <b>1 : 2</b>（答案 C）。' },
  { id: 'w7-cw9c', topic: 'w7', type: 'mc', fixed: true, src: 'Classwork 9 Q3', q: 'Energy is transferred to two liquids A and B at the same rate. The two liquids have the same mass. The graph shows how their temperatures change with time. The ratio of the specific heat capacity of liquid A to that of liquid B is',
    zh: 'A 用 1 小時、B 用 2 小時升到同一個溫度 T。',
    graph: lineGraph({ x: [0, 2.3], y: [0, 100], xt: [1, 2], yt: [[90, 'T']], xl: 'time / hour', yl: 'temperature / K', mono: true, lines: [{ p: [[0, 40], [1, 90]], label: 'A', at: [0.6, 70], dx: -18 }, { p: [[0, 40], [2, 90]], label: 'B', at: [1.5, 77.5], dx: 4, dy: -10 }], guides: [[[0, 90], [2, 90]], [[0, 65], [2, 65]], [[1, 0], [1, 90]], [[2, 0], [2, 90]]] }),
    options: ['1 : 4', '1 : 2', '1 : 1', '2 : 1'], answer: 1, explain: '同樣 ΔT，A 用 1 h、B 用 2 h → B 吸收的能量係 A 的 2 倍。同質量 → c<sub>A</sub> : c<sub>B</sub> = <b>1 : 2</b>（答案 B）。' },
  { id: 'w7-ratio', topic: 'w7', type: 'mc', gen() {
      const [a, b] = pick([[20, 40], [15, 45], [10, 40], [30, 60], [20, 60]]); const T0 = 20;
      const g = lineGraph({ x: [0, 10], y: [0, 90], yt: [T0, T0 + a, T0 + b], xl: 'time', yl: 'temperature / °C', mono: true, lines: [{ p: [[0, T0], [10, T0 + b]], label: 'X' }, { p: [[0, T0], [10, T0 + a]], label: 'Y' }], guides: [[[0, T0 + b], [10, T0 + b]], [[0, T0 + a], [10, T0 + a]]] });
      const r = b / a; const gcd = (p, q) => q ? gcd(q, p % q) : p; const k = gcd(a, b);
      const right = `${a / k} : ${b / k}`, inv = `${b / k} : ${a / k}`;
      const opts = [right, inv, '1 : 1', `${(a / k) * (a / k)} : ${(b / k) * (b / k)}`].filter((v, i, s) => s.indexOf(v) === i);
      return { q: 'Two liquids X and Y of the same mass are heated at the same rate. The graph shows their temperatures. Find the ratio of the specific heat capacity of X to that of Y.', zh: '同時間 → 同能量；同質量 → c 同 ΔT 成反比。', graph: g, options: opts, answer: 0, explain: `同一段時間：ΔT<sub>X</sub> = ${b} °C，ΔT<sub>Y</sub> = ${a} °C。c ∝ 1/ΔT → c<sub>X</sub> : c<sub>Y</sub> = ${a} : ${b} = <b>${right}</b>。（r = ${nf(r)}）` };
    } },
  { id: 'w7-c', topic: 'w7', type: 'num', gen() {
      const P = pick([100, 200, 250, 400, 500]), m = pick([0.2, 0.4, 0.5, 1]), t = pick([100, 200, 300]), s = pick(SUBSTANCES.filter(x => ['aluminium', 'glass', 'air', 'iron', 'copper', 'alcohol', 'water'].includes(x.id)));
      const d = P * t / (m * s.c); if (d > 80 || d < 5) return this.gen();
      const T0 = 20, T1 = round(T0 + d, 1); const dd = T1 - T0; const c = P * t / (m * dd);
      return { q: `A ${P} W heater heats ${nf(m)} kg of a substance. The graph shows its temperature rises from ${T0} °C to ${nf(T1)} °C in ${t} s. Find the specific heat capacity of the substance. (Assume no energy loss.)`, zh: 'E = Pt；c = E / (mΔT)',
        graph: lineGraph({ x: [0, t * 1.1], y: [0, Math.max(100, T1 + 10)], xt: [t], yt: [T0, [T1, nf(T1)]], xl: 'time / s', yl: 'temperature / °C', mono: true, lines: [{ p: [[0, T0], [t, T1]] }], guides: [[[0, T1], [t, T1]], [[t, 0], [t, T1]]] }),
        answer: c, unit: 'J kg⁻¹ °C⁻¹', rel: 0.01, explain: ex([`E = P t = ${P} × ${t} = ${nf(P * t)} J`, `ΔT = ${nf(T1)} − ${T0} = ${nf(round(dd, 1))} °C`, `c = ${frac('E', 'm ΔT')} = ${frac(nf(P * t), `${nf(m)} × ${nf(round(dd, 1))}`)} = <b>${nf(round(c, 0))} J kg⁻¹ °C⁻¹</b>`]) };
    } },
  { id: 'w7-ex', topic: 'w7', type: 'num', src: '課堂例子', q: 'A 200 W heater heats 0.4 kg of substance X. Its temperature rises from 25 °C to 75 °C in 100 s (see the textbook graph). Find the specific heat capacity of X.', zh: 'E = Pt = 200 × 100；ΔT = 75 − 25',
    graph: lineGraph({ x: [0, 115], y: [0, 90], xt: [[100, '100 s']], yt: [25, 50, 75], xl: 'time', yl: 'temperature / °C', mono: true, lines: [{ p: [[0, 25], [100, 75]] }], guides: [[[0, 50], [50, 50]], [[100, 0], [100, 75]]] }),
    answer: 1000, unit: 'J kg⁻¹ °C⁻¹', rel: 0.01, traps: [{ v: 666.7, msg: 'ΔT 係 75 − 25 = 50 °C，唔係 75。' }], explain: ex(['E = P t = 200 × 100 = 20 000 J', 'c = E / (mΔT) = 20 000 ÷ (0.4 × 50)', '= <b>1000 J kg⁻¹ °C⁻¹</b>']) }
];

/* turn a bank item into a concrete question */
function instQ(item) {
  const body = item.gen ? item.gen() : item;
  const q = Object.assign({}, item, body);
  delete q.gen;
  if (q.type === 'tf') { q.options = ['True（啱）', 'False（錯）']; q.answer = q.ans ? 0 : 1; q.fixed = true; }
  if (q.type === 'mc' && !q.fixed) {
    const order = shuffle(q.options.map((_, i) => i));
    q.options = order.map(i => q.options[i]);
    q.answer = order.indexOf(q.answer);
  }
  return q;
}
function makeQuiz(topics, n) {
  const pool = shuffle(BANK.filter(b => topics.includes(b.topic)));
  return pool.slice(0, n).map(instQ);
}
function isCorrect(q, given) {
  if (given == null || given === '') return false;
  if (q.type === 'num') return approx(parseNum(given), q.answer, q.rel ?? 0.01, q.abs ?? 0);
  return Number(given) === q.answer;
}
function fmtAns(x) {
  if (Math.abs(x) >= 1e6) return bigNum(x);
  if (Number.isInteger(round(x, 6))) return nf(x);
  if (Math.abs(x) >= 1000) return nf(round(x, 0));
  if (Math.abs(x) >= 10) return nf(round(x, 1));
  return nf(round(x, 2));
}
function answerText(q) {
  if (q.type === 'num') return `${fmtAns(q.answer)} ${q.unit || ''}`;
  return q.options[q.answer];
}
function logMistake(q) {
  const m = Store.data.mistakes || (Store.data.mistakes = []);
  const snap = { id: q.id, topic: q.topic, type: q.type === 'tf' ? 'mc' : q.type, q: q.q, zh: q.zh, graph: q.graph, options: q.options, answer: q.answer, unit: q.unit, rel: q.rel, abs: q.abs, explain: q.explain, src: q.src, fixed: true, t: Date.now() };
  const i = m.findIndex(x => x.q === q.q); if (i >= 0) m.splice(i, 1);
  m.unshift(snap); if (m.length > 40) m.length = 40;
  Store.save();
}
