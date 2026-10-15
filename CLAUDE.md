# Heat Lab 熱學實驗室

給用戶表弟的互動物理學習網頁，內容只取自課本 **Section 1 Heat（p.3–16）**：
1.1 Temperature & Thermometer、1.2 Heat & Heat Capacity、1.3 High c of Water、1.4 Conservation of Energy、Temperature–Time Graph、Classwork 1–9。

## 用戶要求（不可違反）
1. 表弟極度討厭無聊 → 每個知識點都要有可以玩的互動，唔好大段文字。
2. 要講清楚 **C（熱容量）、c（比熱容）、K（開爾文）、J（焦耳）** 之間的關係，唔可以淨係丟公式 → 第 4 關「能量方格機」等。
3. 只放書入面的內容，要全面；書本以外的知識唔好加。加考試環節。
4. 唔好參考以前其他網頁項目的內容／設計。

## 語言
- 解釋用繁體中文書面語；吉祥物「溫Sir」對白用廣東話口語。
- 定義、必背句、考試題目用英文（課本係英文），中文做提示。

## 結構
- `src/head.html` 標題與字體；`src/style.css`；`src/body.html` 外殼；`src/js/*.js` 依檔名順序合併。
- `python3 build.py` → `dist/index.html`（完整 HTML，可離線開）＋ `dist/artifact.html`（給 Artifact 發布，無 doctype/head/body）。
- 每關 = `Router.routes.wN`；站點完成用 `station.complete()`；進度存 localStorage（`heatlab.v1`）。
- 題庫在 `src/js/20-bank.js`，每題標 `topic`（w1–w7），計算題用 `gen()` 隨機出數。

## 課本答案（核對用）
CW1 −273 °C / 273 K / 100 °C / 350 K / −23 K 不可能；Ex1 40 °C；CW2 30 °C；CW4 7.2×10⁶ J；
CW5 1×10⁵ J、24 000 J；CW6 62 400 / 115 500 / 12 600 / 333 000 J；CW7 B、34.3 °C、437.5 W、286 s（實際更長）；
CW8 68.6 °C、53.8 °C、≈2580 J kg⁻¹ °C⁻¹、42.7 °C（鐵 c=480）；CW9 C(R)、C(1:2)、B(1:2)；
溫度-時間圖課堂例：200 W、0.4 kg、100 s、25→75 °C → c = 1000 J kg⁻¹ °C⁻¹。
