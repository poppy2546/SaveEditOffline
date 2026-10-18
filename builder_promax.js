const fs = require('fs');
const path = require('path');

const pakoCode = fs.readFileSync(path.join(__dirname, 'pako.min.js'), 'utf8');
const lzCode = fs.readFileSync(path.join(__dirname, 'node_modules/lz-string/libs/lz-string.min.js'), 'utf8');
const rubyMarshalCode = fs.readFileSync(path.join(__dirname, 'ruby_marshal.js'), 'utf8');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data: blob:; connect-src 'none'; object-src 'none'; base-uri 'none';">
<title>SaveEdit &amp; Database Studio PRO MAX - Universal RPG Maker Tool</title>
<style>
  :root {
    --bg-main: #0b0e14;
    --bg-card: #131720;
    --bg-card-hover: #19202c;
    --bg-input: #080b10;
    --border-color: #262d3d;
    --border-subtle: #1c2230;
    --border-focus: #58a6ff;
    --text-primary: #e6edf3;
    --text-secondary: #8b949e;
    --text-muted: #656d76;
    --accent-green: #238636;
    --accent-green-hover: #2ea043;
    --accent-blue: #1f6feb;
    --accent-blue-hover: #388bfd;
    --accent-gold: #d29922;
    --accent-warn: #d29922;
    --accent-danger: #da3633;
    --accent-purple: #8957e5;
    --card-shadow: 0 4px 16px rgba(0,0,0,0.4);
    --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background-color: var(--bg-main);
    color: var(--text-primary);
    font-family: var(--font-sans);
    line-height: 1.5;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Header */
  header {
    background: #0f131a;
    border-bottom: 1px solid var(--border-color);
    padding: 10px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .logo-wrap { display: flex; align-items: center; gap: 12px; }
  .logo-icon {
    width: 32px; height: 32px;
    background: #18202e;
    border: 1px solid #323d52;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 15px; color: #58a6ff;
    font-family: var(--font-mono);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
  }
  .mode-switch-bar {
    display: flex; background: #080b10; border: 1px solid var(--border-color);
    border-radius: 6px; padding: 3px; gap: 3px;
  }
  .mode-btn {
    padding: 6px 14px; border-radius: 4px; border: none; background: transparent;
    color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; cursor: pointer;
    transition: all 0.12s ease; display: flex; align-items: center; gap: 6px;
  }
  .mode-btn:hover { color: #fff; }
  .mode-btn.active {
    background: #1f2736; color: #fff; border: 1px solid #36445d;
  }
  .mode-btn.active-db {
    background: #241a34; color: #d2a8ff; border: 1px solid #5c3b88;
  }

  .container {
    max-width: 1560px; width: 100%; margin: 0 auto;
    padding: 16px 20px; flex: 1; display: flex; flex-direction: column;
  }

  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 13px; border-radius: 6px; font-size: 0.84rem;
    font-weight: 600; cursor: pointer; border: 1px solid transparent;
    transition: all 0.12s ease; user-select: none;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
  }
  .btn:active { transform: translateY(1px); }
  .btn-primary { background: var(--accent-green); color: #fff; border-color: #2da44e; }
  .btn-primary:hover { background: var(--accent-green-hover); }
  .btn-blue { background: var(--accent-blue); color: #fff; border-color: #388bfd; }
  .btn-blue:hover { background: var(--accent-blue-hover); }
  .btn-secondary { background: #19202c; color: var(--text-primary); border-color: var(--border-color); }
  .btn-secondary:hover { background: #232d3e; border-color: #4b5873; }
  .btn-gold { background: #2a200a; color: var(--accent-gold); border-color: #6e5012; }
  .btn-gold:hover { background: #3d2f0e; border-color: #9e751b; }
  .btn-purple { background: #231633; color: var(--accent-purple); border-color: #583380; }
  .btn-purple:hover { background: #321f4a; }
  .btn-danger { background: #2d1316; color: var(--accent-danger); border-color: #5c2025; }
  .btn-danger:hover { background: #40191e; }
  .btn-secret {
    background: #241d08; color: #f2cc60; border: 1px solid #856114;
    font-family: var(--font-mono); letter-spacing: 0.02em;
  }
  .btn-secret:hover {
    background: #382c0a; border-color: #d29922; color: #fff;
    box-shadow: 0 0 10px rgba(210, 153, 34, 0.35);
  }
  .btn-sm { padding: 4px 10px; font-size: 0.78rem; border-radius: 5px; }

  /* Tabs */
  .nav-tabs {
    display: flex; gap: 8px; border-bottom: 2px solid var(--border-color);
    padding-bottom: 0; overflow-x: auto;
  }
  .tab-btn {
    padding: 10px 18px; border: none; background: transparent;
    color: var(--text-secondary); font-size: 0.92rem; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 8px;
    border-bottom: 3px solid transparent; transition: all 0.15s ease;
    white-space: nowrap;
  }
  .tab-btn:hover { color: var(--text-primary); background: rgba(255,255,255,0.02); }
  .tab-btn.active {
    color: var(--accent-blue-hover);
    border-bottom-color: var(--accent-blue);
    background: rgba(31, 111, 235, 0.08);
    border-radius: 6px 6px 0 0;
  }
  .tab-badge {
    background: #19202c; color: var(--text-secondary); padding: 1px 7px;
    border-radius: 8px; font-size: 0.72rem; font-family: var(--font-mono);
    border: 1px solid var(--border-color);
  }
  .tab-btn.active .tab-badge { background: #162638; color: #79c0ff; border-color: #1f6feb; }

  /* Info Green Notice Bar */
  .info-notice {
    background: #0d2215; border: 1px solid #238636; border-radius: 8px;
    padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;
    gap: 12px; font-size: 0.85rem; color: #7ee787;
  }

  /* Section Panels */
  .section-panel { display: none; flex-direction: column; gap: 16px; }
  .section-panel.active { display: flex; }

  /* Card and Stat Inputs */
  .stat-card {
    background: var(--bg-card); border: 1px solid var(--border-color);
    border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 6px;
    transition: border-color 0.15s ease;
  }
  .stat-card:hover { border-color: #388bfd; }
  .stat-card.custom-mod { border-color: #613b8b; background: rgba(188, 140, 255, 0.04); }
  .stat-title { font-weight: 700; font-size: 0.88rem; color: #79c0ff; font-family: var(--font-mono); }
  .stat-desc { font-size: 0.75rem; color: var(--text-muted); }
  .stat-input {
    flex: 1; padding: 8px 10px; background: var(--bg-input);
    border: 1px solid var(--border-color); border-radius: 6px;
    color: #fff; font-family: var(--font-mono); font-size: 0.95rem; font-weight: 600;
  }
  .stat-input:focus { outline: none; border-color: var(--border-focus); }

  /* Item / Weapon / Armor Grid */
  .items-card-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 12px;
  }
  .item-card {
    background: var(--bg-card); border: 1px solid var(--border-color);
    border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px;
  }
  .item-card:hover { background: var(--bg-card-hover); border-color: #388bfd; }
  .item-card.is-modified { border-color: var(--accent-green); background: rgba(46, 160, 67, 0.05); }

  /* Switch Toggle */
  .toggle-switch {
    position: relative; width: 44px; height: 24px; display: inline-block;
  }
  .toggle-switch input { opacity: 0; width: 0; height: 0; }
  .slider {
    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
    background-color: #2b3347; transition: .2s; border-radius: 24px;
  }
  .slider:before {
    position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
    background-color: white; transition: .2s; border-radius: 50%;
  }
  input:checked + .slider { background-color: var(--accent-green); }
  input:checked + .slider:before { transform: translateX(20px); }

  /* Revert Icon Button */
  .revert-btn {
    background: transparent; border: none; color: var(--text-secondary);
    cursor: pointer; font-size: 0.95rem; padding: 2px 4px; border-radius: 4px;
    display: none;
  }
  .revert-btn.show { display: inline-block; color: var(--accent-green); }
  .revert-btn:hover { color: var(--accent-danger); }

  /* ============================================================== */
  /* DATABASE MODDER STUDIO (MASTER - DETAIL 2-COLUMN LAYOUT)       */
  /* ============================================================== */
  #db-modder-screen {
    display: none; flex-direction: column; gap: 14px; width: 100%;
  }
  .db-toolbar {
    background: var(--bg-card); border: 1px solid var(--border-color);
    border-radius: 12px; padding: 12px 18px; display: flex; flex-wrap: wrap;
    align-items: center; justify-content: space-between; gap: 14px;
    box-shadow: var(--card-shadow);
  }
  .db-layout {
    display: grid; grid-template-columns: 340px 1fr; gap: 16px; min-height: 700px;
  }
  @media (max-width: 900px) {
    .db-layout { grid-template-columns: 1fr; }
  }

  /* Left Master List */
  .db-list-panel {
    background: var(--bg-card); border: 1px solid var(--border-color);
    border-radius: 12px; display: flex; flex-direction: column; overflow: hidden;
  }
  .db-search-box {
    padding: 12px; border-bottom: 1px solid var(--border-color); background: #161b27;
  }
  .db-search-input {
    width: 100%; padding: 8px 12px; background: var(--bg-input);
    border: 1px solid var(--border-color); border-radius: 6px;
    color: #fff; font-size: 0.88rem;
  }
  .db-search-input:focus { outline: none; border-color: var(--accent-blue); }

  .db-items-scroll {
    overflow-y: auto; flex: 1; max-height: calc(100vh - 260px);
  }
  .db-list-row {
    padding: 10px 14px; border-bottom: 1px solid #23293a; cursor: pointer;
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    transition: background 0.15s ease;
  }
  .db-list-row:hover { background: var(--bg-card-hover); }
  .db-list-row.active {
    background: #23344e; border-left: 4px solid var(--accent-blue);
  }
  .db-list-row.is-modified .db-row-name { color: #7ee787; font-weight: 700; }
  .db-row-id { font-size: 0.75rem; color: var(--text-secondary); font-family: var(--font-mono); }
  .db-row-name {
    font-size: 0.88rem; font-weight: 600; color: #fff;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;
  }

  /* Right Detail Editor */
  .db-detail-panel {
    background: var(--bg-card); border: 1px solid var(--border-color);
    border-radius: 12px; padding: 22px; display: flex; flex-direction: column;
    gap: 20px; box-shadow: var(--card-shadow);
  }
  .db-item-header {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 16px; border-bottom: 1px solid var(--border-color); gap: 14px;
    flex-wrap: wrap;
  }
  .db-item-title-group { display: flex; align-items: center; gap: 12px; flex: 1; }
  .db-icon-box {
    width: 48px; height: 48px; border-radius: 10px; background: #262e42;
    border: 1px solid var(--border-color); display: flex; align-items: center;
    justify-content: center; font-size: 1.6rem;
  }
  .db-name-input {
    font-size: 1.25rem; font-weight: 700; color: #fff; background: var(--bg-input);
    border: 1px solid var(--border-color); border-radius: 8px; padding: 6px 12px;
    flex: 1; min-width: 200px;
  }
  .db-name-input:focus { outline: none; border-color: var(--accent-blue); }

  .db-field-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 14px;
  }
  .db-field-box {
    display: flex; flex-direction: column; gap: 6px;
    background: #151a26; padding: 12px; border-radius: 8px;
    border: 1px solid var(--border-color);
  }
  .db-field-label {
    font-size: 0.8rem; font-weight: 700; color: #79c0ff;
    display: flex; justify-content: space-between; align-items: center;
  }
  .db-textarea {
    width: 100%; height: 75px; background: var(--bg-input);
    border: 1px solid var(--border-color); border-radius: 6px;
    color: #fff; font-size: 0.85rem; padding: 8px; resize: vertical;
  }

  /* Preset Pills */
  .preset-bar {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    background: #171d2c; padding: 10px 14px; border-radius: 8px;
    border: 1px dashed var(--border-color);
  }

  /* DB Drop Banner & Category Slots */
  .db-drop-banner {
    background: linear-gradient(135deg, rgba(110, 64, 201, 0.14), rgba(31, 111, 235, 0.1));
    border: 2px dashed #6e40c9; border-radius: 12px; padding: 14px 18px;
    display: flex; align-items: center; justify-content: space-between; gap: 14px;
    flex-wrap: wrap; transition: all 0.2s ease; cursor: pointer;
  }
  .db-drop-banner:hover, .db-drop-banner.drag-over {
    border-color: #bc8cff; background: rgba(163, 113, 247, 0.18);
  }
  .db-slot-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 100%;
  }
  @media (max-width: 900px) {
    .db-slot-grid { grid-template-columns: repeat(2, 1fr); }
  }
  .db-cat-btn {
    background: #151924; border: 1px solid var(--border-color); border-radius: 10px;
    padding: 10px 14px; display: flex; flex-direction: column; align-items: flex-start;
    gap: 6px; cursor: pointer; transition: all 0.15s ease; text-align: left; color: #fff;
  }
  .db-cat-btn:hover { background: #1e2436; border-color: #58a6ff; }
  .db-cat-btn.active {
    background: #201a35; border: 2px solid #a371f7;
    box-shadow: 0 0 14px rgba(163, 113, 247, 0.25);
  }
  .db-cat-btn.loaded { border-left: 4px solid #2ea043; }
  .db-slot-top {
    display: flex; align-items: center; justify-content: space-between; width: 100%;
    font-weight: 700; font-size: 0.9rem;
  }
  .db-slot-sub {
    display: flex; align-items: center; justify-content: space-between; width: 100%;
    font-size: 0.75rem; color: var(--text-secondary);
  }
  .db-bulk-bar {
    background: #141824; border: 1px solid var(--border-color); border-radius: 10px;
    padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;
    gap: 10px; flex-wrap: wrap;
  }
  .effect-tag {
    display: inline-flex; align-items: center; gap: 6px; background: #1e2638;
    border: 1px solid #35415f; border-radius: 6px; padding: 4px 10px;
    font-size: 0.78rem; color: #79c0ff;
  }

  /* Toast & Modals */
  .toast {
    position: fixed; bottom: 24px; right: 24px;
    background: #1f6feb; color: #fff; padding: 12px 20px;
    border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    font-size: 0.9rem; font-weight: 600; opacity: 0;
    transform: translateY(10px); transition: all 0.25s ease;
    z-index: 1100; pointer-events: none;
  }
  .toast.show { opacity: 1; transform: translateY(0); }
  .toast.success { background: #238636; }
  .toast.warn { background: #9e6a03; }
  .toast.error { background: #da3633; }
</style>
</head>
<body>

<header>
  <div class="logo-wrap">
    <div class="logo-icon">✎</div>
    <div>
      <div style="display:flex; align-items:center;">
        <h1 style="font-size:1.15rem; font-weight:800;">Save &amp; DB Studio</h1>
        <span class="badge-promax" id="app-badge-mode">SAVE EDITOR</span>
        <span class="badge-offline">100% OFFLINE</span>
      </div>
      <div style="font-size:0.75rem; color:var(--text-secondary);">
        All RPG Maker Saves + Database Modder (Weapons, Armors, Items, Skills)
      </div>
    </div>
  </div>

  <!-- Primary Mode Switcher -->
  <div class="mode-switch-bar">
    <button class="mode-btn active" id="btn-mode-save">💾 Game Save Editor</button>
    <button class="mode-btn" id="btn-mode-db">🛠️ Game Database Modder</button>
  </div>

  <!-- Save Editor Header Actions -->
  <div style="display:flex; align-items:center; gap:8px;" id="header-save-actions">
    <button class="btn btn-secondary btn-sm" id="btn-change-file">📁 Open Save</button>
    <button class="btn btn-blue btn-sm" id="btn-export-json">Export JSON</button>
    <button class="btn btn-primary btn-sm" id="btn-review-download">📥 Download Edited Save</button>
  </div>

  <!-- Database Modder Header Actions -->
  <div style="display:none; align-items:center; gap:8px;" id="header-db-actions">
    <button class="btn btn-secondary btn-sm" id="btn-open-db-file">📂 Open DB File (.json)</button>
    <button class="btn btn-primary btn-sm" id="btn-db-download">📥 Download Edited .json</button>
  </div>
</header>

<div class="container">

  <!-- ========================================================= -->
  <!-- 1. WELCOME / DROPZONE SCREEN                             -->
  <!-- ========================================================= -->
  <div id="upload-section" style="display:flex; flex-direction:column; align-items:center; margin:36px auto; max-width:880px; width:100%; text-align:center;">
    <div style="width:100%; border:2px dashed var(--accent-blue); border-radius:16px; background:var(--bg-card); padding:50px 30px; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:16px;" id="dropzone">
      <div style="font-size:3.5rem;">🎮</div>
      <div style="font-size:1.4rem; font-weight:700;">Drop any Save File or Database JSON here</div>
      <div style="color:var(--text-secondary); font-size:0.9rem; max-width:680px;">
        Auto-detects: <b>Save Files</b> (<code>.rmmzsave</code>, <code>.rpgsave</code>, <code>.rvdata2</code>, <code>.rxdata</code>, <code>.lsd</code>) or <b>Database Files</b> (<code>Weapons.json</code>, <code>Armors.json</code>, <code>Items.json</code>, <code>Skills.json</code>)
      </div>
      <input type="file" id="file-input" multiple style="display:none;">
      <div style="display:flex; gap:10px; margin-top:10px;">
        <button class="btn btn-blue" onclick="document.getElementById('file-input').click()">Browse File(s)</button>
        <button class="btn btn-purple" id="btn-quick-open-db">🛠️ Open Game Database (data/*.json)</button>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px; width:100%; margin-top:32px; text-align:left;">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:16px; border-radius:10px;">
        <h4 style="color:#79c0ff; margin-bottom:6px;">🛠️ Database Modder</h4>
        <p style="color:var(--text-secondary); font-size:0.8rem;">Mod Weapons, Armors, Items, and Skills. Edit damage formulas, 0 MP cost, infinite items, and 9999 stats.</p>
      </div>
      <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:16px; border-radius:10px;">
        <h4 style="color:#7ee787; margin-bottom:6px;">💾 All RPG Maker Saves</h4>
        <p style="color:var(--text-secondary); font-size:0.8rem;">Native support for MZ, MV, VX Ace, VX, XP, 2000/2003, and Wolf RPG with custom mod variable rendering.</p>
      </div>
      <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:16px; border-radius:10px;">
        <h4 style="color:var(--accent-gold); margin-bottom:6px;">⚡ Direct In-Place Save</h4>
        <p style="color:var(--text-secondary); font-size:0.8rem;">Save directly to game folder via File System API with automatic .bak backup preservation.</p>
      </div>
    </div>
  </div>

  <!-- ========================================================= -->
  <!-- 2. GAME SAVE EDITOR SCREEN                                -->
  <!-- ========================================================= -->
  <div id="save-editor-screen" style="display:none; flex-direction:column; gap:16px; width:100%;">
    <!-- Top Quick Bar -->
    <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px; padding:12px 18px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px;">
      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <span style="font-weight:700; font-size:1.1rem; color:#fff;" id="label-filename">savegame.rpgsave</span>
        <span style="background:#141722; border:1px solid var(--border-color); padding:3px 10px; border-radius:6px; font-size:0.78rem; color:#388bfd; font-weight:700;" id="label-format">FORMAT</span>
        <span style="background:#141722; border:1px solid var(--border-color); padding:3px 10px; border-radius:6px; font-size:0.78rem; color:var(--text-secondary);" id="label-size">0 KB</span>
        <span style="background:#141722; border:1px solid var(--border-color); padding:3px 10px; border-radius:6px; font-size:0.78rem; color:var(--accent-green-hover);" id="label-changes">0 CHANGES</span>
      </div>

      <!-- Quick Gold Edit & Secret God Mode -->
      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <div style="background:#141a24; border:1px solid #6e5012; border-radius:8px; padding:6px 14px; display:flex; align-items:center; gap:8px;">
          <span style="font-weight:700; color:var(--accent-gold); font-size:0.95rem;">💰 Gold:</span>
          <input type="number" style="background:var(--bg-input); border:1px solid var(--border-color); border-radius:6px; color:#fff; font-family:var(--font-mono); font-size:1rem; font-weight:bold; width:120px; padding:4px 8px;" id="quick-gold-input" value="0">
          <button class="revert-btn" id="gold-revert-btn" title="Revert Gold">↺</button>
          <button class="btn btn-secondary btn-sm" id="btn-gold-add-10k">+10K</button>
          <button class="btn btn-secondary btn-sm" id="btn-gold-add-100k">+100K</button>
          <button class="btn btn-gold btn-sm" id="btn-gold-max">MAX 9.9M</button>
        </div>
        <button class="btn btn-secret btn-sm" id="btn-secret-godmode" title="ปุ่มลับ: ปลดล็อกเงินเต็ม 9.9M + เลือดมานาเต็ม + สเตตัส 9999 + ไอเทม/อาวุธ/เกราะ 99 ทุกชิ้น (คีย์ลัด Ctrl+Shift+G)">🗝️ ปุ่มลับ: SUPER GOD MODE</button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="nav-tabs" id="main-nav-tabs">
      <button class="tab-btn active" data-tab="tab-characters">👤 Characters <span class="tab-badge" id="badge-char-count">0</span></button>
      <button class="tab-btn" data-tab="tab-inventory">🎒 Inventory <span class="tab-badge" id="badge-item-count">0</span></button>
      <button class="tab-btn" data-tab="tab-weapons">⚔️ Weapons <span class="tab-badge" id="badge-weapon-count">0</span></button>
      <button class="tab-btn" data-tab="tab-armors">🛡️ Armors <span class="tab-badge" id="badge-armor-count">0</span></button>
      <button class="tab-btn" data-tab="tab-variables">🔢 Variables <span class="tab-badge" id="badge-var-count">0</span></button>
      <button class="tab-btn" data-tab="tab-switches">🔘 Switches <span class="tab-badge" id="badge-switch-count">0</span></button>
      <button class="tab-btn" data-tab="tab-datafiles">📁 Data Files (.json)</button>
      <button class="tab-btn" data-tab="tab-raw">🌲 Raw Variable Tree</button>
    </div>

    <!-- TAB 1: CHARACTERS -->
    <div class="section-panel active" id="tab-characters">
      <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap; background:var(--bg-card); padding:14px 18px; border-radius:10px; border:1px solid var(--border-color);">
        <label style="font-weight:700; color:var(--text-secondary);">Select Character:</label>
        <select class="char-select" id="char-dropdown" style="padding:8px 14px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:6px; color:#fff; font-size:0.95rem; font-weight:600; min-width:260px;"></select>
        <div style="display:flex; gap:8px; margin-left:auto;">
          <button class="btn btn-secondary btn-sm" id="btn-char-full-heal">💖 Full Restore (HP/MP)</button>
          <button class="btn btn-gold btn-sm" id="btn-char-max-stats">⚡ Max All Stats (9999)</button>
        </div>
      </div>
      <div class="stats-grid" id="char-stats-container" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:14px;"></div>
    </div>

    <!-- TAB 2: INVENTORY -->
    <div class="section-panel" id="tab-inventory">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:10px; padding:12px 18px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px;">
        <div style="flex:1; min-width:240px;"><input type="text" id="inventory-search" placeholder="Search Item ID, name or value..." style="width:100%; padding:7px 12px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:6px; color:#fff;"></div>
        <div style="display:flex; align-items:center; gap:10px;">
          <label style="font-size:0.85rem; color:var(--text-secondary); cursor:pointer;"><input type="checkbox" id="inventory-owned-only" checked> Owned only (>0)</label>
          <button class="btn btn-blue btn-sm" id="btn-items-set-all-99">Set All Owned to 99</button>
          <button class="btn btn-secondary btn-sm" id="btn-add-item-dialog">+ Add Item ID</button>
        </div>
      </div>
      <div class="items-card-grid" id="inventory-cards-container"></div>
    </div>

    <!-- TAB 3: WEAPONS -->
    <div class="section-panel" id="tab-weapons">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:10px; padding:12px 18px; display:flex; justify-content:space-between; gap:12px;">
        <input type="text" id="weapons-search" placeholder="Search Weapon ID, name or value..." style="flex:1; padding:7px 12px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:6px; color:#fff;">
        <button class="btn btn-secondary btn-sm" id="btn-add-weapon-dialog">+ Add Weapon ID</button>
      </div>
      <div class="items-card-grid" id="weapons-cards-container"></div>
    </div>

    <!-- TAB 4: ARMORS -->
    <div class="section-panel" id="tab-armors">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:10px; padding:12px 18px; display:flex; justify-content:space-between; gap:12px;">
        <input type="text" id="armors-search" placeholder="Search Armor ID, name or value..." style="flex:1; padding:7px 12px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:6px; color:#fff;">
        <button class="btn btn-secondary btn-sm" id="btn-add-armor-dialog">+ Add Armor ID</button>
      </div>
      <div class="items-card-grid" id="armors-cards-container"></div>
    </div>

    <!-- TAB 5: VARIABLES -->
    <div class="section-panel" id="tab-variables">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:10px; padding:12px 18px; display:flex; justify-content:space-between; gap:12px;">
        <input type="text" id="variables-search" placeholder="Search Variable ID, name or value..." style="flex:1; padding:7px 12px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:6px; color:#fff;">
        <label style="font-size:0.85rem; color:var(--text-secondary); cursor:pointer;"><input type="checkbox" id="vars-nonzero-only" checked> Non-zero only</label>
      </div>
      <div class="items-card-grid" id="variables-cards-container"></div>
    </div>

    <!-- TAB 6: SWITCHES -->
    <div class="section-panel" id="tab-switches">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:10px; padding:12px 18px; display:flex; justify-content:space-between; gap:12px;">
        <input type="text" id="switches-search" placeholder="Search Switch ID or name..." style="flex:1; padding:7px 12px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:6px; color:#fff;">
        <select id="switches-filter" style="padding:6px 12px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:6px; color:#fff;">
          <option value="all">All Switches</option><option value="on">ON only</option><option value="off">OFF only</option>
        </select>
      </div>
      <div class="items-card-grid" id="switches-cards-container"></div>
    </div>

    <!-- TAB 7: DATA FILES -->
    <div class="section-panel" id="tab-datafiles">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px; padding:24px;">
        <h3 style="font-size:1.1rem; color:#fff; margin-bottom:8px;">Load Game Data Files (Optional)</h3>
        <p style="color:var(--text-secondary); font-size:0.88rem; margin-bottom:16px;">
          Upload <code>Items.json</code>, <code>Weapons.json</code>, <code>Armors.json</code>, or <code>System.json</code> to replace raw IDs with actual names.
        </p>
        <div style="border:2px dashed var(--border-color); border-radius:10px; padding:30px; text-align:center; cursor:pointer;" id="data-dropzone">
          <div style="font-size:2rem; margin-bottom:8px;">📂</div>
          <div style="font-weight:600; color:#fff;">Drop data JSON files here or click to browse</div>
          <input type="file" id="data-file-input" multiple accept=".json" style="display:none;">
        </div>
      </div>
    </div>

    <!-- TAB 8: RAW TREE -->
    <div class="section-panel" id="tab-raw">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:10px; overflow:hidden;">
        <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
          <thead>
            <tr style="background:#151926; text-align:left; color:var(--text-secondary);">
              <th style="padding:10px 14px; width:35%;">Variable / Path</th>
              <th style="padding:10px 14px; width:10%;">Type</th>
              <th style="padding:10px 14px; width:25%;">Original</th>
              <th style="padding:10px 14px; width:25%;">Value</th>
              <th style="padding:10px 14px; width:5%;">Revert</th>
            </tr>
          </thead>
          <tbody id="raw-tbody"></tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ========================================================= -->
  <!-- 3. GAME DATABASE MODDER STUDIO                            -->
  <!-- ========================================================= -->
  <div id="db-modder-screen">
    <!-- Top Multi-File Drop Guide & 4 Category Slots -->
    <div class="db-drop-banner" id="db-drop-banner">
      <div style="display:flex; align-items:center; gap:12px;">
        <div style="font-size:2rem;">📂</div>
        <div>
          <div style="font-weight:800; font-size:0.98rem; color:#fff;">ลากไฟล์ Database (.json) มาวางที่นี่ได้พร้อมกันหลายไฟล์!</div>
          <div style="font-size:0.8rem; color:var(--text-secondary);">
            หาไฟล์ได้จากโฟลเดอร์เกม <code>data/</code> หรือ <code>www/data/</code> (เช่น <code>Weapons.json</code>, <code>Armors.json</code>, <code>Items.json</code>, <code>Skills.json</code>) ลากมาวางรวดเดียวได้เลย
          </div>
        </div>
      </div>
      <input type="file" id="db-multi-file-input" multiple accept=".json" style="display:none;">
      <div style="display:flex; gap:8px;">
        <button class="btn btn-purple btn-sm" id="btn-db-browse-multi">📂 เลือกไฟล์ .json (เลือกหลายไฟล์ได้)</button>
      </div>
    </div>

    <!-- 4 Category Status Cards -->
    <div class="db-slot-grid">
      <button class="db-cat-btn active" data-cat="weapons" id="slot-btn-weapons">
        <div class="db-slot-top">
          <span>⚔️ อาวุธ (Weapons)</span>
          <span style="font-size:0.75rem; font-family:var(--font-mono); color:#8b949e;">Weapons.json</span>
        </div>
        <div class="db-slot-sub">
          <span id="db-slot-status-weapons" style="color:#8b949e;">⚪ ยังไม่โหลด (คลิก/ลากไฟล์)</span>
          <span id="db-slot-mod-weapons" style="color:#7ee787; font-weight:700;"></span>
        </div>
      </button>

      <button class="db-cat-btn" data-cat="armors" id="slot-btn-armors">
        <div class="db-slot-top">
          <span>🛡️ เครื่องป้องกัน (Armors)</span>
          <span style="font-size:0.75rem; font-family:var(--font-mono); color:#8b949e;">Armors.json</span>
        </div>
        <div class="db-slot-sub">
          <span id="db-slot-status-armors" style="color:#8b949e;">⚪ ยังไม่โหลด (คลิก/ลากไฟล์)</span>
          <span id="db-slot-mod-armors" style="color:#7ee787; font-weight:700;"></span>
        </div>
      </button>

      <button class="db-cat-btn" data-cat="items" id="slot-btn-items">
        <div class="db-slot-top">
          <span>🎒 ไอเทม (Items)</span>
          <span style="font-size:0.75rem; font-family:var(--font-mono); color:#8b949e;">Items.json</span>
        </div>
        <div class="db-slot-sub">
          <span id="db-slot-status-items" style="color:#8b949e;">⚪ ยังไม่โหลด (คลิก/ลากไฟล์)</span>
          <span id="db-slot-mod-items" style="color:#7ee787; font-weight:700;"></span>
        </div>
      </button>

      <button class="db-cat-btn" data-cat="skills" id="slot-btn-skills">
        <div class="db-slot-top">
          <span>⚡ สกิล (Skills)</span>
          <span style="font-size:0.75rem; font-family:var(--font-mono); color:#8b949e;">Skills.json</span>
        </div>
        <div class="db-slot-sub">
          <span id="db-slot-status-skills" style="color:#8b949e;">⚪ ยังไม่โหลด (คลิก/ลากไฟล์)</span>
          <span id="db-slot-mod-skills" style="color:#7ee787; font-weight:700;"></span>
        </div>
      </button>
    </div>

    <!-- Active Category Toolbar & Bulk Actions -->
    <div class="db-toolbar">
      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <span style="font-size:1.1rem; font-weight:800; color:#bc8cff;" id="db-label-type">⚔️ WEAPONS DATABASE</span>
        <span style="background:#141722; border:1px solid var(--border-color); padding:3px 10px; border-radius:6px; font-size:0.78rem; color:#7ee787;" id="db-label-filename">Weapons.json</span>
        <span style="background:#141722; border:1px solid var(--border-color); padding:3px 10px; border-radius:6px; font-size:0.78rem; color:var(--text-secondary);" id="db-label-count">0 ITEMS</span>
        <span style="background:#141722; border:1px solid var(--border-color); padding:3px 10px; border-radius:6px; font-size:0.78rem; color:#7ee787; display:none;" id="db-label-modified">0 MODIFIED</span>
      </div>

      <!-- Bulk Quick-Mod Actions for Current File -->
      <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;" id="db-bulk-actions">
        <!-- Populated dynamically per category -->
      </div>
    </div>

    <!-- Master - Detail Layout -->
    <div class="db-layout">
      <!-- Left List Panel -->
      <div class="db-list-panel">
        <div class="db-search-box" style="display:flex; flex-direction:column; gap:8px;">
          <input type="text" class="db-search-input" id="db-search-input" placeholder="🔍 ค้นหาชื่อ, ID (เช่น 2), หรือคำอธิบาย...">
          <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.78rem; color:var(--text-secondary);">
            <label style="cursor:pointer; display:flex; align-items:center; gap:6px;">
              <input type="checkbox" id="db-filter-modified"> ✏️ แสดงเฉพาะที่แก้ไขแล้ว
            </label>
            <span id="db-list-showing-label">แสดง 0 รายการ</span>
          </div>
        </div>
        <div class="db-items-scroll" id="db-items-list-container">
          <!-- Dynamically populated list rows -->
        </div>
      </div>

      <!-- Right Detail Panel -->
      <div class="db-detail-panel" id="db-detail-container">
        <div style="text-align:center; padding:60px 20px; color:var(--text-muted);">
          <div style="font-size:3rem; margin-bottom:10px;">📂</div>
          <div style="font-size:1.1rem; font-weight:600; color:#fff;">ลากไฟล์ .json จากโฟลเดอร์ data/ มาวางเพื่อเริ่มแก้ไข</div>
          <div style="font-size:0.85rem; margin-top:6px;">รองรับการลากวางหลายไฟล์พร้อมกัน (Weapons.json, Armors.json, Items.json, Skills.json)</div>
        </div>
      </div>
    </div>
  </div>

</div>

<!-- DIFF MODAL -->
<div class="modal-overlay" id="diff-modal" style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.75); display:none; align-items:center; justify-content:center; z-index:1000;">
  <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px; max-width:900px; width:90%; max-height:85vh; display:flex; flex-direction:column; overflow:hidden;">
    <div style="padding:16px 20px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
      <span style="font-weight:700; color:#fff;">🔍 Review Changes Before Saving</span>
      <button class="btn btn-secondary btn-sm" id="btn-close-modal">&times;</button>
    </div>
    <div style="padding:18px 20px; overflow-y:auto; flex:1;" id="diff-content"></div>
    <div style="padding:14px 20px; border-top:1px solid var(--border-color); display:flex; justify-content:space-between; background:#141824;">
      <button class="btn btn-secondary" id="btn-modal-bak">🛡️ Download Backup (.bak)</button>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-secondary" id="btn-modal-cancel">Keep Editing</button>
        <button class="btn btn-primary" id="btn-modal-download">💾 Download Edited File</button>
      </div>
    </div>
  </div>
</div>

<div class="toast" id="toast">Notification</div>

<!-- Embedded Libraries -->
<script>${pakoCode}</script>
<script>${lzCode}</script>
<script>${rubyMarshalCode}</script>

<!-- Application Engine -->
<script>
(function() {
  // App Mode State: 'save' or 'database'
  let currentAppMode = 'save';

  // Active Save State
  let currentFile = {
    name: '', size: 0, rawBytes: null, format: '', formatLabel: '', parsedRoot: null, engine: ''
  };

  // Multi-file Database Store (keeps Weapons, Armors, Items, Skills in memory simultaneously)
  const dbStore = {
    weapons: null,
    armors: null,
    items: null,
    skills: null
  };

  // Active Database State
  let currentDb = {
    category: 'weapons', // 'weapons', 'armors', 'items', 'skills'
    fileName: 'Weapons.json',
    fileHandle: null,    // File System Access API handle
    items: [],
    origItemsJson: '[]',
    selectedId: null,
    modifiedIds: new Set()
  };

  const gameData = { items: {}, weapons: {}, armors: {}, variables: {}, switches: {} };
  let flatEntries = [];
  let activeCharacterIndex = 1;
  let originalGold = 0;

  // DOM Elements
  const btnModeSave = document.getElementById('btn-mode-save');
  const btnModeDb = document.getElementById('btn-mode-db');
  const headerSaveActions = document.getElementById('header-save-actions');
  const headerDbActions = document.getElementById('header-db-actions');
  const appBadgeMode = document.getElementById('app-badge-mode');

  const uploadSection = document.getElementById('upload-section');
  const saveEditorScreen = document.getElementById('save-editor-screen');
  const dbModderScreen = document.getElementById('db-modder-screen');

  const labelFilename = document.getElementById('label-filename');
  const labelFormat = document.getElementById('label-format');
  const labelSize = document.getElementById('label-size');
  const labelChanges = document.getElementById('label-changes');

  function showToast(msg, type = 'info') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show ' + type;
    setTimeout(() => { t.className = 'toast'; }, 2600);
  }

  function formatBytes(b) {
    if (!b) return '0 B';
    const k = 1024, s = ['B','KB','MB'];
    const i = Math.floor(Math.log(b)/Math.log(k));
    return parseFloat((b/Math.pow(k,i)).toFixed(1)) + ' ' + s[i];
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getJsonExArray(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'object' && Array.isArray(val['@a'])) return val['@a'];
    if (typeof val === 'object' && Array.isArray(val['@data'])) return val['@data'];
    if (typeof val === 'object') {
      return Object.keys(val).filter(k => !k.startsWith('@')).map(k => val[k]);
    }
    return [];
  }

  // Switch App Modes
  function switchAppMode(mode) {
    currentAppMode = mode;
    if (mode === 'save') {
      btnModeSave.className = 'mode-btn active';
      btnModeDb.className = 'mode-btn';
      appBadgeMode.textContent = 'SAVE EDITOR';
      appBadgeMode.className = 'badge-promax';
      headerSaveActions.style.display = 'flex';
      headerDbActions.style.display = 'none';
      if (currentFile.parsedRoot) {
        uploadSection.style.display = 'none';
        saveEditorScreen.style.display = 'flex';
        dbModderScreen.style.display = 'none';
      } else {
        uploadSection.style.display = 'flex';
        saveEditorScreen.style.display = 'none';
        dbModderScreen.style.display = 'none';
      }
    } else {
      btnModeSave.className = 'mode-btn';
      btnModeDb.className = 'mode-btn active-db';
      appBadgeMode.textContent = 'DB MODDER';
      appBadgeMode.className = 'badge-promax';
      headerSaveActions.style.display = 'none';
      headerDbActions.style.display = 'flex';
      uploadSection.style.display = 'none';
      saveEditorScreen.style.display = 'none';
      dbModderScreen.style.display = 'flex';
      updateDbSlotBadges();
      renderDbBulkActions();
      renderDbMasterList();
    }
  }

  btnModeSave.onclick = () => switchAppMode('save');
  btnModeDb.onclick = () => switchAppMode('database');
  document.getElementById('btn-quick-open-db').onclick = () => {
    switchAppMode('database');
    document.getElementById('btn-open-db-file').click();
  };

  // -------------------------------------------------------------
  // UNIVERSAL SAVE & DB DISPATCHER ON FILE DROP (MULTI-FILE READY)
  // -------------------------------------------------------------
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const dbDropBanner = document.getElementById('db-drop-banner');
  const dbMultiFileInput = document.getElementById('db-multi-file-input');
  const btnDbBrowseMulti = document.getElementById('btn-db-browse-multi');

  dropzone.onclick = (e) => { if (e.target.tagName !== 'BUTTON') fileInput.click(); };
  dropzone.ondragover = (e) => { e.preventDefault(); dropzone.style.borderColor = '#388bfd'; };
  dropzone.ondragleave = () => { dropzone.style.borderColor = 'var(--border-color)'; };
  dropzone.ondrop = (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--border-color)';
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleIncomingFiles(e.dataTransfer.files);
    }
  };
  fileInput.onchange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleIncomingFiles(e.target.files);
      fileInput.value = '';
    }
  };

  if (btnDbBrowseMulti && dbMultiFileInput) {
    btnDbBrowseMulti.onclick = (e) => {
      e.stopPropagation();
      dbMultiFileInput.click();
    };
    dbDropBanner.onclick = (e) => {
      if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') dbMultiFileInput.click();
    };
    dbMultiFileInput.onchange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleIncomingFiles(e.target.files);
        dbMultiFileInput.value = '';
      }
    };
  }

  window.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (dbDropBanner) dbDropBanner.classList.add('drag-over');
  });
  window.addEventListener('dragleave', (e) => {
    if (dbDropBanner && (!e.relatedTarget || e.relatedTarget.nodeName === 'HTML')) {
      dbDropBanner.classList.remove('drag-over');
    }
  });
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    if (dbDropBanner) dbDropBanner.classList.remove('drag-over');
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleIncomingFiles(e.dataTransfer.files);
    }
  });

  function isDatabaseJsonFilename(name) {
    const n = name.toLowerCase();
    return n === 'weapons.json' || n === 'armors.json' || n === 'items.json' || n === 'skills.json' || n === 'enemies.json' || n === 'system.json' || n === 'actors.json';
  }

  function handleIncomingFile(file) {
    handleIncomingFiles([file]);
  }

  function handleIncomingFiles(fileList) {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    // Separate database JSON files from save files
    const jsonFiles = files.filter(f => f.name.toLowerCase().endsWith('.json') && (isDatabaseJsonFilename(f.name) || currentAppMode === 'database' || files.length > 1));
    if (jsonFiles.length > 0) {
      jsonFiles.forEach((f, idx) => loadDatabaseFile(f, null, idx === 0));
      return;
    }

    // Otherwise load first file as save file
    loadSaveFile(files[0]);
  }

  // -------------------------------------------------------------
  // DATABASE MODDER LOGIC
  // -------------------------------------------------------------
  function detectDbCategory(fileName, jsonArr) {
    const baseName = fileName.replace(/\.json$/i, '').toLowerCase();
    if (baseName.includes('weapon')) return 'weapons';
    if (baseName.includes('armor')) return 'armors';
    if (baseName.includes('item')) return 'items';
    if (baseName.includes('skill')) return 'skills';
    // Fallback heuristic based on RPG Maker object keys
    const sample = (jsonArr || []).find(x => x && typeof x === 'object' && x.id);
    if (sample) {
      if ('wtypeId' in sample) return 'weapons';
      if ('atypeId' in sample || 'etypeId' in sample) return 'armors';
      if ('stypeId' in sample || 'mpCost' in sample) return 'skills';
      if ('itypeId' in sample || 'consumable' in sample) return 'items';
    }
    return currentDb.category || 'items';
  }

  function loadDatabaseFile(file, handle = null, autoSwitch = true) {
    if (file && file.size > 50 * 1024 * 1024) {
      showToast('ไฟล์มีขนาดเกิน 50MB เพื่อความปลอดภัยระบบจำกัดขนาดไฟล์ไม่เกิน 50MB', 'danger');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result);
        const lower = file.name.toLowerCase();

        // Support System.json for variable/switch names if dropped together
        if (!Array.isArray(json) && json && typeof json === 'object') {
          if (Array.isArray(json.variables)) json.variables.forEach((n, i) => { if (n) gameData.variables[i] = n; });
          if (Array.isArray(json.switches)) json.switches.forEach((n, i) => { if (n) gameData.switches[i] = n; });
          showToast(\`โหลดชื่อ Variables/Switches จาก \${file.name} แล้ว!\`, 'success');
          return;
        }

        if (!Array.isArray(json)) throw new Error('ไฟล์ Database (.json) ต้องเป็น JSON Array ของ RPG Maker');

        const cat = detectDbCategory(file.name, json);
        const validItems = json.filter(x => x && x.id);

        // Also sync names into Save Editor's gameData dictionary
        if (gameData[cat]) {
          validItems.forEach(x => { if (x.id && x.name) gameData[cat][x.id] = x.name; });
        }

        dbStore[cat] = {
          category: cat,
          fileName: file.name,
          fileHandle: handle,
          items: json,
          origItemsJson: JSON.stringify(json),
          selectedId: validItems.length > 0 ? validItems[0].id : null,
          modifiedIds: new Set()
        };

        if (autoSwitch || !dbStore[currentDb.category]) {
          syncCurrentDbFromStore(cat);
        }
        switchAppMode('database');
        updateDbCategoryButtons(currentDb.category);
        updateDbSlotBadges();
        renderDbBulkActions();
        renderDbMasterList();
        showToast(\`โหลด \${file.name} (\${validItems.length} รายการ) สำเร็จ!\`, 'success');
      } catch(e) {
        alert('Error parsing database JSON:\\n' + e.message);
      }
    };
    reader.readAsText(file);
  }

  function syncCurrentDbFromStore(cat) {
    const defaultNames = { weapons: 'Weapons.json', armors: 'Armors.json', items: 'Items.json', skills: 'Skills.json' };
    if (dbStore[cat]) {
      currentDb.category = cat;
      currentDb.fileName = dbStore[cat].fileName;
      currentDb.fileHandle = dbStore[cat].fileHandle;
      currentDb.items = dbStore[cat].items;
      currentDb.origItemsJson = dbStore[cat].origItemsJson;
      currentDb.selectedId = dbStore[cat].selectedId;
      currentDb.modifiedIds = dbStore[cat].modifiedIds;
    } else {
      currentDb.category = cat;
      currentDb.fileName = defaultNames[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1) + '.json');
      currentDb.fileHandle = null;
      currentDb.items = [];
      currentDb.origItemsJson = '[]';
      currentDb.selectedId = null;
      currentDb.modifiedIds = new Set();
    }
  }

  function updateDbSlotBadges() {
    ['weapons', 'armors', 'items', 'skills'].forEach(cat => {
      const slotBtn = document.getElementById('slot-btn-' + cat);
      const statusEl = document.getElementById('db-slot-status-' + cat);
      const modEl = document.getElementById('db-slot-mod-' + cat);
      const store = dbStore[cat];
      if (!slotBtn || !statusEl || !modEl) return;

      if (store && store.items && store.items.length > 0) {
        const count = store.items.filter(x => x && x.id).length;
        slotBtn.classList.add('loaded');
        statusEl.innerHTML = \`🟢 โหลดแล้ว <b>\${count}</b> ชิ้น\`;
        statusEl.style.color = '#7ee787';
        modEl.textContent = store.modifiedIds.size > 0 ? \`✏️ แก้ \${store.modifiedIds.size}\` : '';
      } else {
        slotBtn.classList.remove('loaded');
        statusEl.textContent = '⚪ ยังไม่โหลด (คลิก/ลากวาง)';
        statusEl.style.color = '#8b949e';
        modEl.textContent = '';
      }
    });

    const modBadge = document.getElementById('db-label-modified');
    if (modBadge) {
      const modCount = currentDb.modifiedIds ? currentDb.modifiedIds.size : 0;
      modBadge.style.display = modCount > 0 ? 'inline-block' : 'none';
      modBadge.textContent = \`✏️ แก้ไขแล้ว \${modCount} รายการ\`;
    }
  }

  function updateDbCategoryButtons(cat) {
    document.querySelectorAll('.db-cat-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cat') === cat);
    });
    document.getElementById('db-label-filename').textContent = currentDb.fileName;
    const catTitles = {
      weapons: '⚔️ WEAPONS DATABASE (คลังอาวุธ)',
      armors: '🛡️ ARMORS DATABASE (คลังเครื่องป้องกัน)',
      items: '🎒 ITEMS DATABASE (คลังไอเทม)',
      skills: '⚡ SKILLS DATABASE (คลังสกิล)'
    };
    document.getElementById('db-label-type').textContent = catTitles[cat] || 'DATABASE MODDER';
  }

  document.querySelectorAll('.db-cat-btn').forEach(btn => {
    btn.onclick = () => {
      const cat = btn.getAttribute('data-cat');
      syncCurrentDbFromStore(cat);
      updateDbCategoryButtons(cat);
      updateDbSlotBadges();
      renderDbBulkActions();
      renderDbMasterList();
    };
  });

  function renderDbBulkActions() {
    const bulkContainer = document.getElementById('db-bulk-actions');
    if (!bulkContainer) return;
    const validItems = currentDb.items.filter(x => x && x.id);
    if (validItems.length === 0) {
      bulkContainer.innerHTML = '';
      return;
    }

    const cat = currentDb.category;
    let buttonsHtml = \`<span style="font-size:0.78rem; color:var(--text-secondary); font-weight:700;">⚡ แก้ทั้งไฟล์:</span>\`;
    if (cat === 'weapons' || cat === 'armors') {
      buttonsHtml += \`
        <button class="btn btn-gold btn-sm" id="btn-bulk-god-all">\${cat==='weapons'?'⚔️ อาวุธทุกชิ้น ATK+9999':'🛡️ เกราะทุกชิ้น DEF+9999'}</button>
        <button class="btn btn-secondary btn-sm" id="btn-bulk-free-all">🪙 ราคา 0 ทั้งไฟล์</button>
      \`;
    } else if (cat === 'items') {
      buttonsHtml += \`
        <button class="btn btn-blue btn-sm" id="btn-bulk-infinite-all">♾️ ใช้ไม่หมดทั้งไฟล์</button>
        <button class="btn btn-secondary btn-sm" id="btn-bulk-free-all">🪙 ราคา 0 ทั้งไฟล์</button>
        <button class="btn btn-secondary btn-sm" id="btn-bulk-zero-weight-all">⚖️ ลบน้ำหนัก [0W] ทั้งไฟล์</button>
      \`;
    } else if (cat === 'skills') {
      buttonsHtml += \`
        <button class="btn btn-blue btn-sm" id="btn-bulk-free-mp-all">⚡ สกิล 0 MP/TP ทั้งไฟล์</button>
      \`;
    }
    buttonsHtml += \`
      <button class="btn btn-secret btn-sm" id="btn-secret-db-god" title="ปุ่มลับ: ปรับสเตตัสเทพและราคา 0 ทั้งหมวด">🗝️ ปุ่มลับ: Turbo God Mod</button>
      <button class="btn btn-secondary btn-sm" id="btn-bulk-revert-all" title="คืนค่าเดิมทั้งไฟล์">↺ คืนค่าทั้งไฟล์</button>
    \`;
    bulkContainer.innerHTML = buttonsHtml;

    const btnSecretDb = document.getElementById('btn-secret-db-god');
    if (btnSecretDb) {
      btnSecretDb.onclick = () => {
        validItems.forEach(it => {
          if (cat === 'weapons') {
            if (!it.params) it.params = [0,0,0,0,0,0,0,0];
            it.params[2] = 9999; it.params[4] = 9999;
            if (it.price !== undefined) it.price = 0;
          } else if (cat === 'armors') {
            if (!it.params) it.params = [0,0,0,0,0,0,0,0];
            it.params[3] = 9999; it.params[5] = 9999;
            if (it.price !== undefined) it.price = 0;
          } else if (cat === 'items') {
            if (it.consumable !== undefined) it.consumable = false;
            if (it.price !== undefined) it.price = 0;
            if (it.description && !it.description.includes('[0W]')) it.description += ' [0W]';
            if (it.note && !it.note.includes('<Weight: 0>')) it.note += '\\n<Weight: 0>';
          } else if (cat === 'skills') {
            if (it.mpCost !== undefined) it.mpCost = 0;
            if (it.tpCost !== undefined) it.tpCost = 0;
          }
          currentDb.modifiedIds.add(it.id);
        });
        finishBulkAction('🗝️ [SECRET ACTIVATED] Turbo God Mod ปรับสเตตัสเทพและราคา 0 ทั้งหมวดแล้ว!');
      };
    }

    const btnBulkFree = document.getElementById('btn-bulk-free-all');
    if (btnBulkFree) {
      btnBulkFree.onclick = () => {
        currentDb.items.filter(x => x && x.id).forEach(it => { if (it.price !== undefined) { it.price = 0; currentDb.modifiedIds.add(it.id); } });
        finishBulkAction('ปรับราคาทุกชิ้นในไฟล์เป็น 0 G แล้ว!');
      };
    }
    const btnBulkGod = document.getElementById('btn-bulk-god-all');
    if (btnBulkGod) {
      btnBulkGod.onclick = () => {
        currentDb.items.filter(x => x && x.id).forEach(it => {
          if (!it.params) it.params = [0,0,0,0,0,0,0,0];
          if (cat === 'weapons') { it.params[2] = 9999; it.params[4] = 9999; }
          else { it.params[3] = 9999; it.params[5] = 9999; }
          currentDb.modifiedIds.add(it.id);
        });
        finishBulkAction('ปรับสเตตัส 9999 ทั้งไฟล์แล้ว!');
      };
    }
    const btnBulkInf = document.getElementById('btn-bulk-infinite-all');
    if (btnBulkInf) {
      btnBulkInf.onclick = () => {
        currentDb.items.filter(x => x && x.id).forEach(it => {
          if (it.consumable) { it.consumable = false; currentDb.modifiedIds.add(it.id); }
        });
        finishBulkAction('ปรับไอเทมทุกชิ้นให้ใช้ไม่หมด (Infinite) แล้ว!');
      };
    }
    const btnBulkWeight = document.getElementById('btn-bulk-zero-weight-all');
    if (btnBulkWeight) {
      btnBulkWeight.onclick = () => {
        currentDb.items.filter(x => x && x.id).forEach(it => {
          if (zeroItemWeight(it)) currentDb.modifiedIds.add(it.id);
        });
        finishBulkAction('ปรับน้ำหนัก [Weight: 0W] ทุกชิ้นแล้ว!');
      };
    }
    const btnBulkMp = document.getElementById('btn-bulk-free-mp-all');
    if (btnBulkMp) {
      btnBulkMp.onclick = () => {
        currentDb.items.filter(x => x && x.id).forEach(it => {
          it.mpCost = 0;
          it.tpCost = 0;
          currentDb.modifiedIds.add(it.id);
        });
        finishBulkAction('ปรับสกิลทุกอันให้ใช้ 0 MP / 0 TP แล้ว!');
      };
    }
    const btnBulkRev = document.getElementById('btn-bulk-revert-all');
    if (btnBulkRev) {
      btnBulkRev.onclick = () => {
        if (!currentDb.origItemsJson) return;
        currentDb.items = JSON.parse(currentDb.origItemsJson);
        currentDb.modifiedIds.clear();
        if (dbStore[cat]) {
          dbStore[cat].items = currentDb.items;
        }
        updateDbSlotBadges();
        renderDbBulkActions();
        renderDbMasterList();
        showToast('คืนค่าเดิมทั้งไฟล์เรียบร้อย!', 'info');
      };
    }
  }

  function zeroItemWeight(item) {
    let changed = false;
    if (typeof item.description === 'string' && /weight\s*:\s*\d+/i.test(item.description)) {
      item.description = item.description.replace(/(weight\s*:\s*)\d+(\s*w?)/gi, '$10$2');
      changed = true;
    }
    if (typeof item.note === 'string' && /weight\s*:\s*\d+/i.test(item.note)) {
      item.note = item.note.replace(/(weight\s*:\s*)\d+(\s*w?)/gi, '$10$2');
      changed = true;
    }
    return changed;
  }

  function finishBulkAction(msg) {
    updateDbSlotBadges();
    renderDbMasterList();
    const cur = currentDb.items.find(x => x && x.id === currentDb.selectedId);
    if (cur) renderDbDetail(cur);
    showToast(msg, 'success');
  }

  // Render Master List (Left Pane)
  function renderDbMasterList() {
    const container = document.getElementById('db-items-list-container');
    const detailContainer = document.getElementById('db-detail-container');
    const showingLabel = document.getElementById('db-list-showing-label');
    if (!container) return;
    container.innerHTML = '';

    const validItems = currentDb.items.filter(x => x && x.id);
    document.getElementById('db-label-count').textContent = \`\${validItems.length} ITEMS\`;

    // If current category file is not loaded yet, show a clear, friendly drop prompt
    if (validItems.length === 0) {
      if (showingLabel) showingLabel.textContent = 'ยังไม่ได้โหลดไฟล์';
      container.innerHTML = \`
        <div style="padding:36px 20px; text-align:center; color:var(--text-secondary);">
          <div style="font-size:2.4rem; margin-bottom:8px;">📥</div>
          <div style="font-weight:700; color:#fff; margin-bottom:6px;">ยังไม่ได้โหลดไฟล์ \${currentDb.fileName}</div>
          <div style="font-size:0.8rem; margin-bottom:14px;">ลากไฟล์ <b>\${currentDb.fileName}</b> จากโฟลเดอร์ <code>data/</code> มาวาง หรือกดปุ่มด้านล่าง</div>
          <button class="btn btn-purple btn-sm" id="btn-empty-load-cat">📂 เลือกไฟล์ \${currentDb.fileName}</button>
        </div>
      \`;
      if (detailContainer) {
        detailContainer.innerHTML = \`
          <div style="text-align:center; padding:60px 20px; color:var(--text-muted); border:2px dashed #353f58; border-radius:12px; margin:auto 0;">
            <div style="font-size:3.2rem; margin-bottom:12px;">📂</div>
            <div style="font-size:1.15rem; font-weight:700; color:#fff;">หมวด \${currentDb.fileName} ยังไม่ได้โหลดไฟล์</div>
            <div style="font-size:0.88rem; margin-top:6px; color:var(--text-secondary);">
              คุณสามารถลากไฟล์ <code>Weapons.json</code>, <code>Armors.json</code>, <code>Items.json</code>, <code>Skills.json</code><br>
              จากโฟลเดอร์ <code>data/</code> ของเกมมาวางพร้อมกันทีเดียวได้เลย!
            </div>
            <button class="btn btn-purple" style="margin-top:16px;" id="btn-detail-empty-browse">📂 เลือกไฟล์ .json จากเครื่อง</button>
          </div>
        \`;
        const b2 = document.getElementById('btn-detail-empty-browse');
        if (b2) b2.onclick = () => dbMultiFileInput ? dbMultiFileInput.click() : fileInput.click();
      }
      const b1 = document.getElementById('btn-empty-load-cat');
      if (b1) b1.onclick = () => dbMultiFileInput ? dbMultiFileInput.click() : fileInput.click();
      return;
    }

    const q = (document.getElementById('db-search-input').value || '').trim().toLowerCase();
    const onlyModEl = document.getElementById('db-filter-modified');
    const onlyMod = onlyModEl && onlyModEl.checked;

    let shownCount = 0;
    validItems.forEach(item => {
      const name = item.name || '(ไม่มีชื่อ / Unnamed)';
      const idStr = String(item.id);
      const desc = item.description || '';
      if (onlyMod && !currentDb.modifiedIds.has(item.id)) return;
      if (q && !idStr.includes(q.replace(/^#/, '')) && !name.toLowerCase().includes(q) && !desc.toLowerCase().includes(q)) return;

      shownCount++;
      const row = document.createElement('div');
      row.className = \`db-list-row \${currentDb.selectedId === item.id ? 'active' : ''} \${currentDb.modifiedIds.has(item.id) ? 'is-modified' : ''}\`;
      row.innerHTML = \`
        <div style="display:flex; align-items:center; gap:8px; min-width:0;">
          <span class="db-row-id">#\${item.id}</span>
          <span class="db-row-name" title="\${escapeHtml(name)}">\${escapeHtml(name)}</span>
        </div>
        <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono); white-space:nowrap;">\${getQuickPreviewBadge(item)}</span>
      \`;

      row.onclick = () => {
        currentDb.selectedId = item.id;
        if (dbStore[currentDb.category]) dbStore[currentDb.category].selectedId = item.id;
        document.querySelectorAll('.db-list-row').forEach(r => r.classList.remove('active'));
        row.classList.add('active');
        renderDbDetail(item);
      };

      container.appendChild(row);
    });

    if (showingLabel) showingLabel.textContent = \`แสดง \${shownCount} / \${validItems.length} รายการ\`;

    const selectedObj = validItems.find(x => x.id === currentDb.selectedId) || validItems[0];
    if (selectedObj) {
      currentDb.selectedId = selectedObj.id;
      renderDbDetail(selectedObj);
    }
  }

  function getQuickPreviewBadge(item) {
    if (currentDb.category === 'weapons' || currentDb.category === 'armors') {
      const params = item.params || [];
      const atk = params[2] || 0;
      const def = params[3] || 0;
      return currentDb.category === 'weapons' ? \`ATK \${atk}\` : \`DEF \${def}\`;
    }
    if (currentDb.category === 'skills') {
      return \`\${item.mpCost || 0} MP\`;
    }
    if (currentDb.category === 'items') {
      const inf = item.consumable === false ? '♾️ ' : '';
      return inf + (item.price !== undefined ? \`\${item.price} G\` : '');
    }
    return '';
  }

  document.getElementById('db-search-input').oninput = renderDbMasterList;
  const dbFilterMod = document.getElementById('db-filter-modified');
  if (dbFilterMod) dbFilterMod.onchange = renderDbMasterList;

  function getEffectValue(item, code, field) {
    if (!Array.isArray(item.effects)) return 0;
    const eff = item.effects.find(e => e && e.code === code && (!e.dataId || e.dataId === 0));
    if (!eff) return 0;
    if (field === 'pct') return Math.round((eff.value1 || 0) * 100);
    return eff.value2 || eff.value1 || 0;
  }

  function setEffectValue(item, code, pctVal, flatVal) {
    if (!Array.isArray(item.effects)) item.effects = [];
    let eff = item.effects.find(e => e && e.code === code && (!e.dataId || e.dataId === 0));
    if (!eff) {
      eff = { code: code, dataId: 0, value1: 0, value2: 0 };
      item.effects.push(eff);
    }
    if (code === 13) {
      eff.value1 = Number(pctVal) || 0;
      eff.value2 = 0;
    } else {
      eff.value1 = (Number(pctVal) || 0) / 100;
      eff.value2 = Number(flatVal) || 0;
    }
  }

  // Render Detail Editor (Right Pane)
  function renderDbDetail(item) {
    const container = document.getElementById('db-detail-container');
    if (!item) return;

    const cat = currentDb.category;
    let specificHtml = '';

    if (cat === 'weapons' || cat === 'armors') {
      const paramLabels = [
        'MHP (เลือดสูงสุด)', 'MMP (มานาสูงสุด)', 'ATK (พลังโจมตี)', 'DEF (พลังป้องกัน)',
        'MAT (โจมตีเวท)', 'MDF (ป้องกันเวท)', 'AGI (ความเร็ว)', 'LUK (โชค)'
      ];
      const p = item.params || [0,0,0,0,0,0,0,0];
      let paramInputs = '';
      paramLabels.forEach((label, i) => {
        paramInputs += \`
          <div class="db-field-box">
            <span class="db-field-label">\${label}</span>
            <input type="number" class="stat-input db-stat-input" data-idx="\${i}" value="\${p[i]||0}">
          </div>
        \`;
      });

      specificHtml = \`
        <div class="preset-bar">
          <span style="font-weight:700; color:var(--text-secondary); font-size:0.85rem;">⚡ ปุ่มลัดชิ้นนี้:</span>
          <button class="btn btn-gold btn-sm" id="btn-db-god-weapon">\${cat==='weapons'?'⚔️ อาวุธเทพ (ATK/MAT 9999)':'🛡️ เกราะอมตะ (DEF 9999 / MHP 99999)'}</button>
          <button class="btn btn-secondary btn-sm" id="btn-db-free-price">🪙 ราคา 0 G</button>
          <button class="btn btn-secondary btn-sm" id="btn-db-zero-weight">⚖️ ลบน้ำหนัก [0W]</button>
        </div>

        <div style="font-size:0.85rem; font-weight:700; color:#fff; margin-top:4px;">ค่าพลังสเตตัส (Combat Stats):</div>
        <div class="db-field-grid">\${paramInputs}</div>
      \`;
    } else if (cat === 'items') {
      const dmg = item.damage || {};
      const hpPct = getEffectValue(item, 11, 'pct');
      const hpFlat = getEffectValue(item, 11, 'flat');
      const mpPct = getEffectValue(item, 12, 'pct');
      const mpFlat = getEffectValue(item, 12, 'flat');
      const tpEff = getEffectValue(item, 13, 'flat');

      specificHtml = \`
        <div class="preset-bar">
          <span style="font-weight:700; color:var(--text-secondary); font-size:0.85rem;">⚡ ปุ่มลัดชิ้นนี้:</span>
          <button class="btn btn-blue btn-sm" id="btn-db-make-infinite">♾️ ใช้ไม่หมด (Infinite)</button>
          <button class="btn btn-secondary btn-sm" id="btn-db-free-price">🪙 ราคา 0 G</button>
          <button class="btn btn-gold btn-sm" id="btn-db-full-heal-item">💖 ฟื้นฟู HP/MP 100%</button>
          <button class="btn btn-purple btn-sm" id="btn-db-max-tp-item">🔥 เพิ่ม TP/AP +100</button>
          <button class="btn btn-secondary btn-sm" id="btn-db-zero-weight">⚖️ ลบน้ำหนัก [0W]</button>
        </div>

        <div class="db-field-grid">
          <div class="db-field-box">
            <span class="db-field-label">ใช้แล้วหมดไป (Consumable)</span>
            <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
              <label class="toggle-switch">
                <input type="checkbox" id="item-consumable" \${item.consumable?'checked':''}>
                <span class="slider"></span>
              </label>
              <span style="font-size:0.8rem; color:\${item.consumable ? 'var(--text-muted)' : '#7ee787; font-weight:700'};">
                \${item.consumable ? 'เปิดอยู่ (ใช้แล้วลดลง)' : '♾️ ปิดอยู่ (ใช้ได้ไม่จำกัด!)'}
              </span>
            </div>
          </div>

          <div class="db-field-box">
            <span class="db-field-label">เป้าหมาย (Target Scope)</span>
            <select id="item-scope" class="stat-input" style="font-size:0.85rem; padding:6px;">
              <option value="1" \${item.scope===1?'selected':''}>ศัตรู 1 ตัว (One Enemy)</option>
              <option value="2" \${item.scope===2?'selected':''}>ศัตรูทั้งหมด (All Enemies)</option>
              <option value="7" \${item.scope===7?'selected':''}>เพื่อนร่วมทีม 1 คน (One Ally)</option>
              <option value="8" \${item.scope===8?'selected':''}>ทั้งปาร์ตี้ (All Allies)</option>
              <option value="9" \${item.scope===9?'selected':''}>ชุบชีวิตเพื่อน 1 คน (Dead Ally)</option>
              <option value="11" \${item.scope===11?'selected':''}>ตัวเอง (The User)</option>
              <option value="0" \${item.scope===0?'selected':''}>ไม่ระบุ (None)</option>
            </select>
          </div>

          <div class="db-field-box">
            <span class="db-field-label">จำนวนครั้งที่ออกผล (Repeats)</span>
            <input type="number" class="stat-input" id="item-repeats" value="\${item.repeats || 1}" min="1" max="99">
          </div>

          <div class="db-field-box">
            <span class="db-field-label">ได้รับ TP/AP ทันที (TP Gain)</span>
            <input type="number" class="stat-input" id="item-tp-gain" value="\${item.tpGain || 0}">
          </div>
        </div>

        <div style="font-size:0.85rem; font-weight:700; color:#fff; margin-top:4px;">💖 ผลลัพธ์การฟื้นฟู (Item Recovery Effects):</div>
        <div class="db-field-grid">
          <div class="db-field-box">
            <span class="db-field-label">ฟื้นฟู HP (%) + ค่าคงที่</span>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="number" class="stat-input" id="item-eff-hp-pct" value="\${hpPct}" placeholder="%" title="เปอร์เซ็นต์ HP" style="width:50%;">
              <span style="color:var(--text-secondary); font-size:0.8rem;">% +</span>
              <input type="number" class="stat-input" id="item-eff-hp-flat" value="\${hpFlat}" placeholder="หน่วย" title="ค่าคงที่ HP" style="width:50%;">
            </div>
          </div>

          <div class="db-field-box">
            <span class="db-field-label">ฟื้นฟู MP (%) + ค่าคงที่</span>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="number" class="stat-input" id="item-eff-mp-pct" value="\${mpPct}" placeholder="%" title="เปอร์เซ็นต์ MP" style="width:50%;">
              <span style="color:var(--text-secondary); font-size:0.8rem;">% +</span>
              <input type="number" class="stat-input" id="item-eff-mp-flat" value="\${mpFlat}" placeholder="หน่วย" title="ค่าคงที่ MP" style="width:50%;">
            </div>
          </div>

          <div class="db-field-box">
            <span class="db-field-label">เพิ่มค่า TP/AP จากเอฟเฟกต์</span>
            <input type="number" class="stat-input" id="item-eff-tp" value="\${tpEff}">
          </div>

          <div class="db-field-box">
            <span class="db-field-label">สูตรดาเมจ / ฟื้นฟู (Damage Formula)</span>
            <input type="text" class="stat-input" id="item-formula" value="\${dmg.formula || '0'}" placeholder="เช่น 200 + b.mhp * 0.2">
          </div>
        </div>
      \`;
    } else if (cat === 'skills') {
      const dmg = item.damage || {};
      specificHtml = \`
        <div class="preset-bar">
          <span style="font-weight:700; color:var(--text-secondary); font-size:0.85rem;">⚡ ปุ่มลัดสกิลนี้:</span>
          <button class="btn btn-blue btn-sm" id="btn-db-free-mp">⚡ ใช้ 0 MP / 0 TP</button>
          <button class="btn btn-danger btn-sm" id="btn-db-instakill">💥 ดาเมจ 99,999 (วันฮิตคิล)</button>
        </div>

        <div class="db-field-grid">
          <div class="db-field-box">
            <span class="db-field-label">ใช้ MP (MP Cost)</span>
            <input type="number" class="stat-input" id="skill-mp-cost" value="\${item.mpCost || 0}">
          </div>
          <div class="db-field-box">
            <span class="db-field-label">ใช้ TP/AP (TP Cost)</span>
            <input type="number" class="stat-input" id="skill-tp-cost" value="\${item.tpCost || 0}">
          </div>
          <div class="db-field-box">
            <span class="db-field-label">ติดคริติคอลได้? (Critical)</span>
            <label class="toggle-switch" style="margin-top:4px;">
              <input type="checkbox" id="skill-critical" \${dmg.critical?'checked':''}>
              <span class="slider"></span>
            </label>
          </div>
          <div class="db-field-box">
            <span class="db-field-label">ประเภทการโจมตี (Hit Type)</span>
            <select id="skill-hit-type" class="stat-input" style="font-size:0.85rem; padding:6px;">
              <option value="0" \${item.hitType===0?'selected':''}>โดนแน่นอน 100% (Certain Hit)</option>
              <option value="1" \${item.hitType===1?'selected':''}>กายภาพ (Physical Attack)</option>
              <option value="2" \${item.hitType===2?'selected':''}>เวทมนตร์ (Magical Attack)</option>
            </select>
          </div>
          <div class="db-field-box">
            <span class="db-field-label">จำนวนครั้งที่โจมตี (Repeats)</span>
            <input type="number" class="stat-input" id="skill-repeats" value="\${item.repeats || 1}" min="1" max="99">
          </div>
          <div class="db-field-box">
            <span class="db-field-label">ได้รับ TP เมื่อใช้ (TP Gain)</span>
            <input type="number" class="stat-input" id="skill-tp-gain" value="\${item.tpGain || 0}">
          </div>
          <div class="db-field-box" style="grid-column: 1 / -1;">
            <span class="db-field-label">สูตรคำนวณดาเมจ (Damage Formula)</span>
            <input type="text" class="stat-input" id="skill-formula" value="\${escapeHtml(dmg.formula || '')}" placeholder="เช่น a.atk * 4 - b.def * 2">
          </div>
        </div>
      \`;
    }

    container.innerHTML = \`
      <div class="db-item-header">
        <div class="db-item-title-group">
          <div class="db-icon-box">\${getCategoryIcon(cat)}</div>
          <input type="text" class="db-name-input" id="detail-name" value="\${escapeHtml(item.name || '')}" placeholder="ชื่อไอเทม / สกิล">
          <span style="background:#20283c; border:1px solid var(--border-color); padding:3px 10px; border-radius:6px; font-size:0.8rem; font-family:var(--font-mono); color:#79c0ff;">ID #\${item.id}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          \${item.price !== undefined ? \`
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:0.85rem; color:var(--accent-gold); font-weight:700;">💰 ราคา (Price):</span>
              <input type="number" class="stat-input" id="detail-price" value="\${item.price}" style="width:110px; padding:4px 8px;">
            </div>
          \` : ''}
        </div>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:12px;">
        <div class="db-field-box">
          <span class="db-field-label">คำอธิบายในเกม (Description)</span>
          <textarea class="db-textarea" id="detail-desc" style="height:64px;">\${escapeHtml(item.description || '')}</textarea>
        </div>
        <div class="db-field-box">
          <span class="db-field-label">แท็กพิเศษ / Note (เช่น &lt;Weight: 0&gt; หรือ Plugin)</span>
          <textarea class="db-textarea" id="detail-note" style="height:64px; font-family:var(--font-mono);" placeholder="แท็ก Note ของ RPG Maker...">\${escapeHtml(item.note || '')}</textarea>
        </div>
      </div>

      \${specificHtml}

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:16px; border-top:1px solid var(--border-color); flex-wrap:wrap; gap:10px;">
        <button class="btn btn-secondary btn-sm" id="btn-db-revert-item">↺ คืนค่าเดิมชิ้นนี้ (Revert #\${item.id})</button>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-blue btn-sm" id="btn-detail-save-disk">💾 บันทึกทับไฟล์เดิม (Save to Disk)</button>
          <button class="btn btn-primary btn-sm" id="btn-detail-download">📥 ดาวน์โหลด \${currentDb.fileName}</button>
        </div>
      </div>
    \`;

    bindDetailEvents(item);
  }

  function getCategoryIcon(cat) {
    if (cat === 'weapons') return '⚔️';
    if (cat === 'armors') return '🛡️';
    if (cat === 'items') return '🎒';
    if (cat === 'skills') return '⚡';
    return '📦';
  }

  function markModified(item) {
    currentDb.modifiedIds.add(item.id);
    document.querySelectorAll('.db-list-row').forEach(row => {
      if (row.querySelector('.db-row-id') && row.querySelector('.db-row-id').textContent === \`#\${item.id}\`) {
        row.classList.add('is-modified');
      }
    });
    updateDbSlotBadges();
  }

  function bindDetailEvents(item) {
    // Name, Desc, Note, Price
    const nameEl = document.getElementById('detail-name');
    if (nameEl) nameEl.onchange = () => { item.name = nameEl.value; markModified(item); renderDbMasterList(); };
    const descEl = document.getElementById('detail-desc');
    if (descEl) descEl.onchange = () => { item.description = descEl.value; markModified(item); };
    const noteEl = document.getElementById('detail-note');
    if (noteEl) noteEl.onchange = () => { item.note = noteEl.value; markModified(item); };
    const priceEl = document.getElementById('detail-price');
    if (priceEl) priceEl.onchange = () => { item.price = parseInt(priceEl.value) || 0; markModified(item); renderDbMasterList(); };

    // Stats for weapons & armors
    document.querySelectorAll('.db-stat-input').forEach(inp => {
      inp.onchange = () => {
        const idx = parseInt(inp.getAttribute('data-idx'));
        if (!item.params) item.params = [0,0,0,0,0,0,0,0];
        item.params[idx] = parseInt(inp.value) || 0;
        markModified(item);
        renderDbMasterList();
      };
    });

    // Preset buttons
    const btnGod = document.getElementById('btn-db-god-weapon');
    if (btnGod) {
      btnGod.onclick = () => {
        if (!item.params) item.params = [0,0,0,0,0,0,0,0];
        if (currentDb.category === 'weapons') {
          item.params[2] = 9999; // ATK
          item.params[4] = 9999; // MAT
        } else {
          item.params[3] = 9999; // DEF
          item.params[0] = 99999; // MHP
        }
        markModified(item);
        renderDbMasterList();
        renderDbDetail(item);
        showToast('ปรับค่าพลัง 9999 เรียบร้อย!', 'success');
      };
    }

    const btnFree = document.getElementById('btn-db-free-price');
    if (btnFree) {
      btnFree.onclick = () => {
        item.price = 0;
        markModified(item);
        renderDbMasterList();
        renderDbDetail(item);
        showToast('ปรับราคาเป็น 0 G แล้ว!', 'success');
      };
    }

    const btnZeroWeight = document.getElementById('btn-db-zero-weight');
    if (btnZeroWeight) {
      btnZeroWeight.onclick = () => {
        zeroItemWeight(item);
        markModified(item);
        renderDbDetail(item);
        showToast('ปรับน้ำหนักเป็น 0W แล้ว!', 'success');
      };
    }

    // Items events
    const chkCons = document.getElementById('item-consumable');
    if (chkCons) chkCons.onchange = () => { item.consumable = chkCons.checked; markModified(item); renderDbMasterList(); renderDbDetail(item); };
    const selScope = document.getElementById('item-scope');
    if (selScope) selScope.onchange = () => { item.scope = parseInt(selScope.value); markModified(item); };
    const inpRepeats = document.getElementById('item-repeats');
    if (inpRepeats) inpRepeats.onchange = () => { item.repeats = parseInt(inpRepeats.value) || 1; markModified(item); };
    const inpTpGain = document.getElementById('item-tp-gain');
    if (inpTpGain) inpTpGain.onchange = () => { item.tpGain = parseInt(inpTpGain.value) || 0; markModified(item); };
    const txtFormula = document.getElementById('item-formula');
    if (txtFormula) txtFormula.onchange = () => {
      if (!item.damage) item.damage = { type: 1, formula: '0' };
      item.damage.formula = txtFormula.value;
      markModified(item);
    };

    // Item Recovery Effects inputs
    const effHpPct = document.getElementById('item-eff-hp-pct');
    const effHpFlat = document.getElementById('item-eff-hp-flat');
    if (effHpPct || effHpFlat) {
      const updateHpEff = () => {
        setEffectValue(item, 11, effHpPct ? effHpPct.value : 0, effHpFlat ? effHpFlat.value : 0);
        markModified(item);
      };
      if (effHpPct) effHpPct.onchange = updateHpEff;
      if (effHpFlat) effHpFlat.onchange = updateHpEff;
    }
    const effMpPct = document.getElementById('item-eff-mp-pct');
    const effMpFlat = document.getElementById('item-eff-mp-flat');
    if (effMpPct || effMpFlat) {
      const updateMpEff = () => {
        setEffectValue(item, 12, effMpPct ? effMpPct.value : 0, effMpFlat ? effMpFlat.value : 0);
        markModified(item);
      };
      if (effMpPct) effMpPct.onchange = updateMpEff;
      if (effMpFlat) effMpFlat.onchange = updateMpEff;
    }
    const effTp = document.getElementById('item-eff-tp');
    if (effTp) {
      effTp.onchange = () => {
        setEffectValue(item, 13, effTp.value, 0);
        markModified(item);
      };
    }

    const btnInf = document.getElementById('btn-db-make-infinite');
    if (btnInf) {
      btnInf.onclick = () => {
        item.consumable = false;
        markModified(item);
        renderDbMasterList();
        renderDbDetail(item);
        showToast('ปรับเป็นไอเทมใช้ไม่หมด (Infinite) แล้ว!', 'success');
      };
    }

    const btnFullHealItem = document.getElementById('btn-db-full-heal-item');
    if (btnFullHealItem) {
      btnFullHealItem.onclick = () => {
        setEffectValue(item, 11, 100, 9999);
        setEffectValue(item, 12, 100, 9999);
        if (!item.scope || item.scope === 0) item.scope = 7;
        markModified(item);
        renderDbDetail(item);
        showToast('เพิ่มเอฟเฟกต์ฟื้นฟู HP/MP 100% แล้ว!', 'success');
      };
    }

    const btnMaxTpItem = document.getElementById('btn-db-max-tp-item');
    if (btnMaxTpItem) {
      btnMaxTpItem.onclick = () => {
        item.tpGain = 100;
        setEffectValue(item, 13, 100, 0);
        markModified(item);
        renderDbDetail(item);
        showToast('ปรับเพิ่ม TP/AP +100 แล้ว!', 'success');
      };
    }

    // Skills events
    const mpCost = document.getElementById('skill-mp-cost');
    if (mpCost) mpCost.onchange = () => { item.mpCost = parseInt(mpCost.value) || 0; markModified(item); renderDbMasterList(); };
    const tpCost = document.getElementById('skill-tp-cost');
    if (tpCost) tpCost.onchange = () => { item.tpCost = parseInt(tpCost.value) || 0; markModified(item); };
    const chkCrit = document.getElementById('skill-critical');
    if (chkCrit) chkCrit.onchange = () => {
      if (!item.damage) item.damage = {};
      item.damage.critical = chkCrit.checked;
      markModified(item);
    };
    const selHit = document.getElementById('skill-hit-type');
    if (selHit) selHit.onchange = () => { item.hitType = parseInt(selHit.value); markModified(item); };
    const skillRepeats = document.getElementById('skill-repeats');
    if (skillRepeats) skillRepeats.onchange = () => { item.repeats = parseInt(skillRepeats.value) || 1; markModified(item); };
    const skillTpGain = document.getElementById('skill-tp-gain');
    if (skillTpGain) skillTpGain.onchange = () => { item.tpGain = parseInt(skillTpGain.value) || 0; markModified(item); };
    const skillFormula = document.getElementById('skill-formula');
    if (skillFormula) skillFormula.onchange = () => {
      if (!item.damage) item.damage = { type: 1 };
      item.damage.formula = skillFormula.value;
      markModified(item);
    };

    const btnFreeMp = document.getElementById('btn-db-free-mp');
    if (btnFreeMp) {
      btnFreeMp.onclick = () => {
        item.mpCost = 0;
        item.tpCost = 0;
        markModified(item);
        renderDbMasterList();
        renderDbDetail(item);
        showToast('ปรับใช้ 0 MP & 0 TP แล้ว!', 'success');
      };
    }

    const btnInsta = document.getElementById('btn-db-instakill');
    if (btnInsta) {
      btnInsta.onclick = () => {
        if (!item.damage) item.damage = { type: 1 };
        item.damage.formula = '99999';
        item.damage.type = 1;
        item.damage.critical = true;
        markModified(item);
        renderDbDetail(item);
        showToast('ปรับสูตรดาเมจ 99,999 แล้ว!', 'success');
      };
    }

    // Revert Single Item button
    const btnRevertItem = document.getElementById('btn-db-revert-item');
    if (btnRevertItem) {
      btnRevertItem.onclick = () => {
        if (!currentDb.origItemsJson) return;
        const origArr = JSON.parse(currentDb.origItemsJson);
        const origItem = origArr.find(x => x && x.id === item.id);
        const idx = currentDb.items.findIndex(x => x && x.id === item.id);
        if (origItem && idx !== -1) {
          currentDb.items[idx] = JSON.parse(JSON.stringify(origItem));
          currentDb.modifiedIds.delete(item.id);
          updateDbSlotBadges();
          renderDbMasterList();
          renderDbDetail(currentDb.items[idx]);
          showToast(\`คืนค่าเดิมของ #\${item.id} เรียบร้อย!\`, 'info');
        }
      };
    }

    // Save buttons
    const btnDetDl = document.getElementById('btn-detail-download');
    if (btnDetDl) btnDetDl.onclick = downloadDatabaseFile;
    const btnDetSave = document.getElementById('btn-detail-save-disk');
    if (btnDetSave) btnDetSave.onclick = saveDatabaseToDisk;
  }

  // File System Access API & Download
  async function saveDatabaseToDisk() {
    if (!currentDb.items || currentDb.items.length === 0) {
      showToast('ยังไม่มีข้อมูลไฟล์ให้บันทึก', 'warn');
      return;
    }
    const jsonStr = JSON.stringify(currentDb.items, null, 2);
    try {
      if (window.showSaveFilePicker) {
        const handle = await window.showSaveFilePicker({
          suggestedName: currentDb.fileName,
          types: [{ description: 'JSON Database File', accept: { 'application/json': ['.json'] } }]
        });
        const writable = await handle.createWritable();
        await writable.write(jsonStr);
        await writable.close();
        showToast(\`บันทึกทับไฟล์ \${currentDb.fileName} สำเร็จ!\`, 'success');
        return;
      }
    } catch(e) {
      if (e.name !== 'AbortError') console.warn(e);
    }
    // Fallback to regular download
    downloadDatabaseFile();
  }

  function downloadDatabaseFile() {
    if (!currentDb.items || currentDb.items.length === 0) {
      showToast('ยังไม่ได้โหลดไฟล์ Database (.json)', 'warn');
      return;
    }
    const jsonStr = JSON.stringify(currentDb.items, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentDb.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(\`ดาวน์โหลด \${currentDb.fileName} แล้ว!\`, 'success');
  }

  const btnDbDl = document.getElementById('btn-db-download');
  if (btnDbDl) btnDbDl.onclick = downloadDatabaseFile;

  // Open DB file(s) directly via Picker (supports selecting multiple .json files at once!)
  document.getElementById('btn-open-db-file').onclick = async () => {
    try {
      if (window.showOpenFilePicker) {
        const handles = await window.showOpenFilePicker({
          multiple: true,
          types: [{ description: 'RPG Maker Database JSON', accept: { 'application/json': ['.json'] } }]
        });
        for (let i = 0; i < handles.length; i++) {
          const file = await handles[i].getFile();
          loadDatabaseFile(file, handles[i], i === 0);
        }
        return;
      }
    } catch(e) {
      if (e && e.name === 'AbortError') return;
    }
    if (dbMultiFileInput) dbMultiFileInput.click();
    else fileInput.click();
  };

  // -------------------------------------------------------------
  // SAVE EDITOR LOGIC (PRESERVED & INTEGRATED)
  // -------------------------------------------------------------
  async function loadSaveFile(file) {
    if (file && file.size > 50 * 1024 * 1024) {
      showToast('ไฟล์มีขนาดเกิน 50MB เพื่อความปลอดภัยระบบจำกัดขนาดไฟล์ไม่เกิน 50MB', 'danger');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const rawBytes = new Uint8Array(reader.result);
      try {
        const parsed = await parseSaveData(rawBytes, file.name);
        currentFile = {
          name: file.name, size: rawBytes.byteLength, rawBytes: rawBytes,
          format: parsed.format, formatLabel: parsed.formatLabel,
          parsedRoot: parsed.root, engine: parsed.engine
        };

        flatEntries = flattenObject(currentFile.parsedRoot).map((item, idx) => ({ ...item, id: idx }));

        labelFilename.textContent = file.name;
        labelFormat.textContent = parsed.formatLabel;
        labelSize.textContent = formatBytes(rawBytes.byteLength);

        switchAppMode('save');
        resetSaveModified();
        setupVisualEditor();
        renderRawTable();
        showToast(\`Loaded \${file.name} successfully!\`, 'success');
      } catch(err) {
        alert('Error parsing save file:\\n' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // Universal Save Parser Pipeline
  async function parseSaveData(rawBytes, fileName) {
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    const text = textDecoder.decode(rawBytes).trim();

    // Ruby Marshal 4.8
    if (rawBytes.length >= 2 && rawBytes[0] === 0x04 && rawBytes[1] === 0x08) {
      try {
        const decoded = RubyMarshal.decode(rawBytes);
        let lbl = 'Ruby Marshal 4.8';
        if (fileName.endsWith('.rvdata2')) lbl = 'RPG Maker VX Ace (.rvdata2)';
        else if (fileName.endsWith('.rvdata')) lbl = 'RPG Maker VX (.rvdata)';
        else if (fileName.endsWith('.rxdata')) lbl = 'RPG Maker XP (.rxdata)';
        return { format: 'ruby_marshal', formatLabel: lbl, root: decoded, engine: 'ruby' };
      } catch(e) {}
    }

    // RPG Maker MZ
    if (typeof pako !== 'undefined') {
      try {
        const unzipped = pako.inflate(text, { to: 'string' });
        if (unzipped && (unzipped.startsWith('{') || unzipped.startsWith('['))) {
          return { format: 'rmmzsave', formatLabel: 'RPG Maker MZ (.rmmzsave)', root: JSON.parse(unzipped), engine: 'mz' };
        }
      } catch (e) {}
      try {
        const unzipped = pako.inflate(rawBytes, { to: 'string' });
        if (unzipped && (unzipped.startsWith('{') || unzipped.startsWith('['))) {
          return { format: 'rmmzsave_bin', formatLabel: 'RPG Maker MZ / Zlib', root: JSON.parse(unzipped), engine: 'mz' };
        }
      } catch (e) {}
    }

    // RPG Maker MV
    if (fileName.endsWith('.rpgsave') || /^[A-Za-z0-9+/=]+$/.test(text)) {
      try {
        const decompressed = LZString.decompressFromBase64(text);
        if (decompressed && (decompressed.startsWith('{') || decompressed.startsWith('['))) {
          return { format: 'rpgmaker_lz', formatLabel: 'RPG Maker MV (.rpgsave)', root: JSON.parse(decompressed), engine: 'mv' };
        }
      } catch (e) {}
    }

    // JSON / Gzip / Deflate
    if ((text.startsWith('{') && text.endsWith('}')) || (text.startsWith('[') && text.endsWith(']'))) {
      return { format: 'json', formatLabel: 'JSON File', root: JSON.parse(text), engine: 'generic' };
    }

    // WOLF RPG Editor (.sav)
    if (fileName.toLowerCase().endsWith('.sav') || fileName.toLowerCase().includes('savedata') || fileName.toLowerCase() === 'system.sav') {
      return {
        format: 'wolf_rpg',
        formatLabel: 'WOLF RPG Editor (.sav)',
        root: {
          __wolf_rpg__: true,
          fileName: fileName,
          fileSizeBytes: rawBytes.byteLength,
          engine: 'WOLF RPG Editor Pro (Woditor)'
        },
        engine: 'wolf'
      };
    }

    throw new Error('Unrecognized save file format. Supported: RPG Maker (MZ, MV, VX Ace, VX, XP, 2000/2003), WOLF RPG (.sav), JSON, XML, INI.');
  }

  function getGameAdapters(root, engine) {
    let partyObj = null, actorsObj = null, varsObj = null, swObj = null;
    if (Array.isArray(root)) {
      for (const item of root) {
        if (!item || typeof item !== 'object') continue;
        const cls = item.__ruby_class__ || '';
        if (cls.includes('Party') || item['@gold'] !== undefined) partyObj = item;
        else if (cls.includes('Actors') || (item['@data'] && Array.isArray(item['@data']) && item['@data'][1] && item['@data'][1]['@name'])) actorsObj = item;
        else if (cls.includes('Variables') || (cls.includes('System') && item['@variables'])) varsObj = item;
        else if (cls.includes('Switches') || (cls.includes('System') && item['@switches'])) swObj = item;
      }
      if (!partyObj && root[4] && root[4]['@gold'] !== undefined) partyObj = root[4];
      if (!actorsObj && root[10] && root[10]['@data']) actorsObj = root[10];
      if (!varsObj && root[8] && root[8]['@data']) varsObj = root[8];
      if (!swObj && root[9] && root[9]['@data']) swObj = root[9];
    } else if (typeof root === 'object') {
      partyObj = root.party || {};
      actorsObj = root.actors || {};
      varsObj = root.variables || {};
      swObj = root.switches || {};
    }
    return { party: partyObj, actors: actorsObj, variables: varsObj, switches: swObj };
  }

  let saveChanges = new Set();

  function markSaveModified(field) {
    if (field) saveChanges.add(field);
    const badge = document.getElementById('label-changes');
    if (badge) badge.textContent = saveChanges.size + ' CHANGES';
  }

  function resetSaveModified() {
    saveChanges.clear();
    const badge = document.getElementById('label-changes');
    if (badge) badge.textContent = '0 CHANGES';
  }

  function setupVisualEditor() {
    const root = currentFile.parsedRoot;
    if (!root) return;

    if (currentFile.engine === 'wolf') {
      renderWolfRpgTab();
      return;
    }

    const adapt = getGameAdapters(root, currentFile.engine);

    // Gold setup & event bindings
    let goldParty = adapt.party;
    let goldKey = null;
    if (goldParty) {
      if (goldParty['@gold'] !== undefined) goldKey = '@gold';
      else if (goldParty._gold !== undefined) goldKey = '_gold';
      else if (goldParty.gold !== undefined) goldKey = 'gold';
      else {
        goldKey = (currentFile.engine === 'ruby') ? '@gold' : '_gold';
        goldParty[goldKey] = 0;
      }
    }
    let goldVal = (goldParty && goldKey) ? goldParty[goldKey] : 0;
    originalGold = goldVal;

    const goldInput = document.getElementById('quick-gold-input');
    goldInput.value = goldVal;
    const revBtn = document.getElementById('gold-revert-btn');
    if (revBtn) revBtn.classList.remove('show');

    function applyGold(newVal, syncInput = true) {
      const cleaned = String(newVal).replace(/[^0-9-]/g, '');
      const num = Math.max(0, parseInt(cleaned, 10) || 0);
      if (goldParty && goldKey) {
        goldParty[goldKey] = num;
      }
      if (syncInput) {
        goldInput.value = num;
      }
      if (revBtn) revBtn.classList.toggle('show', num !== originalGold);
      markSaveModified('Gold');
    }

    goldInput.oninput = () => applyGold(goldInput.value, false);
    goldInput.onchange = () => applyGold(goldInput.value, true);
    document.getElementById('btn-gold-add-10k').onclick = () => {
      applyGold((parseInt(goldInput.value, 10) || 0) + 10000, true);
      showToast('💰 +10,000 Gold added!', 'success');
    };
    document.getElementById('btn-gold-add-100k').onclick = () => {
      applyGold((parseInt(goldInput.value, 10) || 0) + 100000, true);
      showToast('💰 +100,000 Gold added!', 'success');
    };
    document.getElementById('btn-gold-max').onclick = () => {
      applyGold(9999999, true);
      showToast('💰 Gold maxed to 9,999,999!', 'success');
    };
    if (revBtn) {
      revBtn.onclick = () => {
        applyGold(originalGold, true);
        showToast('↺ Gold reverted to ' + originalGold, 'info');
      };
    }

    function triggerSuperGodMode() {
      applyGold(9999999, true);

      // Max all actors
      const actorsObj = adapt.actors;
      const actorsData = getJsonExArray(actorsObj ? (actorsObj._data || actorsObj['@data'] || actorsObj) : []);
      actorsData.forEach(actor => {
        if (!actor) return;
        if (actor._level !== undefined) actor._level = 99;
        if (actor['@level'] !== undefined) actor['@level'] = 99;
        if (actor._hp !== undefined) actor._hp = 9999;
        if (actor['@hp'] !== undefined) actor['@hp'] = 9999;
        if (actor._mp !== undefined) actor._mp = 9999;
        if (actor['@mp'] !== undefined) actor['@mp'] = 9999;
        if (actor['@sp'] !== undefined) actor['@sp'] = 9999;
        const paramPlus = actor._paramPlus || actor['@param_plus'];
        if (paramPlus) {
          const p = getJsonExArray(paramPlus);
          for (let i = 0; i < 8; i++) p[i] = 9999;
        }
      });

      // Max items, weapons, armors to 99
      if (adapt.party) {
        const items = adapt.party['@items'] || adapt.party._items || adapt.party.items || {};
        const weapons = adapt.party['@weapons'] || adapt.party._weapons || adapt.party.weapons || {};
        const armors = adapt.party['@armors'] || adapt.party._armors || adapt.party.armors || {};
        Object.keys(items).forEach(k => { if (items[k] > 0) items[k] = 99; });
        Object.keys(weapons).forEach(k => { if (weapons[k] > 0) weapons[k] = 99; });
        Object.keys(armors).forEach(k => { if (armors[k] > 0) armors[k] = 99; });
      }

      setupVisualEditor();
      markSaveModified('SUPER GOD MODE');
      showToast('🗝️ [SECRET UNLOCKED] Super God Mode: เงินเต็ม / เลือดมานาเต็ม / สเตตัส 9999 / ไอเทม 99 ชิ้น ครบชุด!', 'success');
    }

    const btnSecretGod = document.getElementById('btn-secret-godmode');
    if (btnSecretGod) {
      btnSecretGod.onclick = triggerSuperGodMode;
    }
    window.onkeydown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'G' || e.key === 'g')) {
        e.preventDefault();
        triggerSuperGodMode();
      }
    };

    // Search and filter inputs bindings
    document.getElementById('inventory-search').oninput = () => renderInventoryTab(adapt.party);
    document.getElementById('inventory-owned-only').onchange = () => renderInventoryTab(adapt.party);
    document.getElementById('weapons-search').oninput = () => renderWeaponsTab(adapt.party);
    document.getElementById('armors-search').oninput = () => renderArmorsTab(adapt.party);
    document.getElementById('variables-search').oninput = () => renderVariablesTab(adapt.variables);
    document.getElementById('vars-nonzero-only').onchange = () => renderVariablesTab(adapt.variables);
    const swSearch = document.getElementById('switches-search');
    if (swSearch) swSearch.oninput = () => renderSwitchesTab(adapt.switches);
    const swFilter = document.getElementById('switches-filter');
    if (swFilter) swFilter.onchange = () => renderSwitchesTab(adapt.switches);

    renderCharactersTab(adapt.actors);
    renderInventoryTab(adapt.party);
    renderWeaponsTab(adapt.party);
    renderArmorsTab(adapt.party);
    renderVariablesTab(adapt.variables);
    renderSwitchesTab(adapt.switches);
  }

  function renderWolfRpgTab() {
    const charDropdown = document.getElementById('char-dropdown');
    charDropdown.innerHTML = '<option>WOLF RPG Editor: ' + (currentFile.name || 'SaveData.sav') + '</option>';
    document.getElementById('badge-char-count').textContent = 'WOLF';
    document.getElementById('badge-item-count').textContent = '0';
    document.getElementById('badge-weapon-count').textContent = '0';
    document.getElementById('badge-armor-count').textContent = '0';
    document.getElementById('badge-var-count').textContent = '0';
    document.getElementById('badge-switch-count').textContent = '0';

    const container = document.getElementById('char-stats-container');
    container.innerHTML = \`
      <div style="grid-column: 1 / -1; background: #161b27; border: 1px solid #388bfd; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 16px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:2.2rem;">🐺</span>
          <div>
            <h3 style="color:#79c0ff; margin:0 0 4px 0;">ตรวจพบไฟล์เซฟ WOLF RPG Editor (Woditor)</h3>
            <div style="color:var(--text-secondary); font-size:0.85rem;">ไฟล์: <b>\${currentFile.name}</b> (\${formatBytes(currentFile.size)}) | เอนจิ้น: WOLF RPG Editor Pro 3.50+</div>
          </div>
        </div>

        <div style="background:#1f2430; border-left: 4px solid #f2cc60; padding: 14px 18px; border-radius: 6px; font-size: 0.9rem; line-height: 1.5; color: #e6edf3;">
          <b>⚠️ ข้อมูลสำคัญเกี่ยวกับระบบเซฟเกมนี้:</b><br>
          เกมนี้คอมไพล์ด้วย <b>WOLF RPG Editor Pro</b> ซึ่งใช้ระบบเข้ารหัสเซฟระดับไบนารี (128-byte block encryption) และตัวแปรเก็บเป็นตัวเลขอินเด็กซ์ดิบ (ไม่มีชื่อกำกับในไฟล์)<br>
          <i>*แม้แต่โปรแกรมแก้ไขเซฟทั่วไป เมื่อพยายามบันทึกไฟล์นี้กลับ ก็จะล้มเหลวเพราะตัวเซฟถูกป้องกันด้วย Checksum เฉพาะของเอนจิ้น</i>
        </div>

        <div style="background:#13233a; border: 1px solid #1f6feb; padding: 18px; border-radius: 10px;">
          <h4 style="color:#58a6ff; margin:0 0 10px 0;">🎮 วิธีโกงเงินและสเตตัสสำหรับเกมนี้ที่ได้ผล 100% (ง่ายและปลอดภัยที่สุด):</h4>
          <ol style="margin:0; padding-left:22px; color:#c9d1d9; font-size:0.9rem; display:flex; flex-direction:column; gap:8px;">
            <li>เปิดเกม <b>GamePro.exe</b> ตามปกติ</li>
            <li>เปิดโปรแกรม <b>Cheat Engine</b> แล้วกดปุ่มไอคอนคอมพิวเตอร์ เลือก Process <code>GamePro.exe</code></li>
            <li>เนื่องจากตัวเกมเป็น <b>32-bit x86</b> ให้ตั้ง Value Type เป็น <b>4 Bytes</b> กรอกจำนวนเงิน หรือค่า HP ในเกม แล้วกด <i>First Scan</i></li>
            <li>กลับเข้าไปในเกม ใช้เงินหรือโดนดาเมจ 1 ครั้ง แล้วกรอกเลขใหม่ใน Cheat Engine กด <i>Next Scan</i></li>
            <li>ดับเบิ้ลคลิกแอดเดรสที่เหลือลงมา แล้วเปลี่ยนค่าเป็น <b>999,999</b> ได้ทันที เซฟไม่พัง 100%!</li>
          </ol>
        </div>
      </div>
    \`;
  }

  function renderCharactersTab(actorsObj) {
    const charDropdown = document.getElementById('char-dropdown');
    charDropdown.innerHTML = '';
    const container = document.getElementById('char-stats-container');
    container.innerHTML = '';
    if (!actorsObj) return;

    const actorsData = getJsonExArray(actorsObj._data || actorsObj['@data'] || actorsObj);
    const validActors = [];
    actorsData.forEach((act, idx) => {
      if (act && (act._name || act['@name'] || act._actorId || act['@actor_id'] || act._level || act['@level'])) {
        validActors.push({ actor: act, index: idx });
      }
    });

    document.getElementById('badge-char-count').textContent = validActors.length;
    if (validActors.length === 0) return;

    validActors.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.index;
      const name = item.actor._name || item.actor['@name'] || \`Hero #\${item.index}\`;
      const lvl = item.actor._level || item.actor['@level'] || 1;
      opt.textContent = \`Character #\${item.index} — \${name} (Lv.\${lvl})\`;
      charDropdown.appendChild(opt);
    });

    activeCharacterIndex = validActors[0].index;
    charDropdown.value = activeCharacterIndex;
    charDropdown.onchange = () => {
      activeCharacterIndex = parseInt(charDropdown.value);
      renderCharacterStats(actorsData[activeCharacterIndex]);
    };
    renderCharacterStats(actorsData[activeCharacterIndex]);

    // Quick Action: Full Restore (HP/MP)
    document.getElementById('btn-char-full-heal').onclick = () => {
      const actor = actorsData[activeCharacterIndex];
      if (!actor) return;
      if (actor._hp !== undefined) actor._hp = 9999;
      if (actor['@hp'] !== undefined) actor['@hp'] = 9999;
      if (actor._mp !== undefined) actor._mp = 9999;
      if (actor['@mp'] !== undefined) actor['@mp'] = 9999;
      if (actor['@sp'] !== undefined) actor['@sp'] = 9999;
      renderCharacterStats(actor);
      markSaveModified('Full Heal');
      showToast('💖 Full restore applied (HP & MP maxed)!', 'success');
    };

    // Quick Action: Max All Stats (9999)
    document.getElementById('btn-char-max-stats').onclick = () => {
      const actor = actorsData[activeCharacterIndex];
      if (!actor) return;
      if (actor._level !== undefined) actor._level = 99;
      if (actor['@level'] !== undefined) actor['@level'] = 99;
      if (actor._hp !== undefined) actor._hp = 9999;
      if (actor['@hp'] !== undefined) actor['@hp'] = 9999;
      if (actor._mp !== undefined) actor._mp = 9999;
      if (actor['@mp'] !== undefined) actor['@mp'] = 9999;
      if (actor['@sp'] !== undefined) actor['@sp'] = 9999;
      const paramPlus = actor._paramPlus || actor['@param_plus'];
      if (paramPlus) {
        const p = getJsonExArray(paramPlus);
        for (let i = 0; i < 8; i++) p[i] = 9999;
      }
      renderCharacterStats(actor);
      markSaveModified('Max Stats');
      showToast('⚡ All stats & bonuses maxed to 9999!', 'success');
    };
  }

  function renderCharacterStats(actor) {
    const container = document.getElementById('char-stats-container');
    container.innerHTML = '';
    if (!actor) return;

    function makeCard(title, label, val, onCommit) {
      const card = document.createElement('div');
      card.className = 'stat-card';
      card.innerHTML = \`
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="stat-title">\${title}</span>
          <span class="stat-desc">\${label}</span>
        </div>
        <input type="text" class="stat-input" value="\${val}">
      \`;
      const input = card.querySelector('input');
      input.onchange = () => {
        let v = input.value;
        if (/^-?\\d+$/.test(v)) v = parseInt(v, 10);
        else if (/^-?\\d+\\.\\d+$/.test(v)) v = parseFloat(v);
        onCommit(v);
        markSaveModified('Stat ' + title);
      };
      container.appendChild(card);
    }

    const lvlKey = actor['@level'] !== undefined ? '@level' : '_level';
    makeCard('LEVEL', 'Level', actor[lvlKey] || 1, (v) => actor[lvlKey] = v);

    const hpKey = actor['@hp'] !== undefined ? '@hp' : '_hp';
    makeCard('MyHP', 'Current HP', actor[hpKey] || 100, (v) => actor[hpKey] = v);

    const mpKey = actor['@mp'] !== undefined ? '@mp' : (actor['@sp'] !== undefined ? '@sp' : '_mp');
    makeCard('MyMP', 'Current MP / SP', actor[mpKey] || 50, (v) => actor[mpKey] = v);

    const paramPlus = actor._paramPlus || actor['@param_plus'];
    if (paramPlus) {
      const pPlus = getJsonExArray(paramPlus);
      const names = ['MHP', 'MMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI', 'LUK'];
      names.forEach((name, i) => makeCard(name, \`\${name} Bonus\`, pPlus[i] || 0, (v) => pPlus[i] = v));
    }
  }

  function renderInventoryTab(partyObj) {
    const container = document.getElementById('inventory-cards-container');
    container.innerHTML = '';
    if (!partyObj) return;
    const itemsObj = partyObj['@items'] || partyObj._items || partyObj.items || {};
    const itemIds = Object.keys(itemsObj).filter(k => !k.startsWith('@'));
    document.getElementById('badge-item-count').textContent = itemIds.length;

    // Quick Action: Set All Owned to 99
    document.getElementById('btn-items-set-all-99').onclick = () => {
      let count = 0;
      itemIds.forEach(id => {
        if (itemsObj[id] > 0) {
          itemsObj[id] = 99;
          count++;
        }
      });
      renderInventoryTab(partyObj);
      markSaveModified('Items 99');
      showToast('Set ' + count + ' owned items to 99!', 'success');
    };

    // Quick Action: Add Item ID
    document.getElementById('btn-add-item-dialog').onclick = () => {
      const id = prompt('Enter Item ID to add:');
      if (!id || isNaN(id)) return;
      const qty = prompt('Enter quantity (1-99):', '99');
      const val = parseInt(qty, 10) || 99;
      itemsObj[id] = val;
      renderInventoryTab(partyObj);
      markSaveModified('Add Item #' + id);
      showToast('Added Item #' + id + ' (x' + val + ')', 'success');
    };

    const q = document.getElementById('inventory-search').value.trim().toLowerCase();
    const ownedOnly = document.getElementById('inventory-owned-only').checked;

    itemIds.forEach(id => {
      const count = itemsObj[id];
      if (ownedOnly && count <= 0) return;
      const name = (gameData && gameData.items && gameData.items[id]) || \`Item #\${id}\`;
      if (q && !id.includes(q) && !name.toLowerCase().includes(q)) return;

      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = \`
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:600; font-size:0.88rem; color:#fff;" title="\${escapeHtml(name)}">\${escapeHtml(name)}</span>
          <span style="font-size:0.75rem; color:var(--text-secondary); font-family:var(--font-mono);">#\${id}</span>
        </div>
        <div style="display:flex; align-items:center; gap:4px;">
          <button class="btn btn-secondary btn-sm btn-sub">-</button>
          <input type="number" class="stat-input" value="\${count}" style="text-align:center; padding:4px;">
          <button class="btn btn-secondary btn-sm btn-add">+</button>
          <button class="btn btn-secondary btn-sm btn-99">99</button>
        </div>
      \`;

      const input = card.querySelector('input');
      const commit = (v) => {
        itemsObj[id] = v;
        input.value = v;
        markSaveModified('Item #' + id);
      };
      input.onchange = () => commit(parseInt(input.value) || 0);
      card.querySelector('.btn-sub').onclick = () => commit(Math.max(0, (parseInt(input.value)||0)-1));
      card.querySelector('.btn-add').onclick = () => commit((parseInt(input.value)||0)+1);
      card.querySelector('.btn-99').onclick = () => commit(99);

      container.appendChild(card);
    });
  }

  function renderWeaponsTab(partyObj) {
    const container = document.getElementById('weapons-cards-container');
    container.innerHTML = '';
    if (!partyObj) return;
    const weaponsObj = partyObj['@weapons'] || partyObj._weapons || partyObj.weapons || {};
    const ids = Object.keys(weaponsObj).filter(k => !k.startsWith('@'));
    document.getElementById('badge-weapon-count').textContent = ids.length;

    document.getElementById('btn-add-weapon-dialog').onclick = () => {
      const id = prompt('Enter Weapon ID to add:');
      if (!id || isNaN(id)) return;
      weaponsObj[id] = 1;
      renderWeaponsTab(partyObj);
      markSaveModified('Add Weapon #' + id);
      showToast('Added Weapon #' + id, 'success');
    };

    const q = document.getElementById('weapons-search').value.trim().toLowerCase();
    ids.forEach(id => {
      const count = weaponsObj[id];
      const name = (gameData && gameData.weapons && gameData.weapons[id]) || \`Weapon #\${id}\`;
      if (q && !id.includes(q) && !name.toLowerCase().includes(q)) return;

      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = \`
        <div style="display:flex; justify-content:space-between;"><span style="color:#fff; font-weight:600;" title="\${escapeHtml(name)}">\${escapeHtml(name)}</span><span style="font-size:0.75rem; color:var(--text-secondary);">#\${id}</span></div>
        <input type="number" class="stat-input" value="\${count}" style="padding:4px;">
      \`;
      card.querySelector('input').onchange = (e) => {
        weaponsObj[id] = parseInt(e.target.value) || 0;
        markSaveModified('Weapon #' + id);
      };
      container.appendChild(card);
    });
  }

  function renderArmorsTab(partyObj) {
    const container = document.getElementById('armors-cards-container');
    container.innerHTML = '';
    if (!partyObj) return;
    const armorsObj = partyObj['@armors'] || partyObj._armors || partyObj.armors || {};
    const ids = Object.keys(armorsObj).filter(k => !k.startsWith('@'));
    document.getElementById('badge-armor-count').textContent = ids.length;

    document.getElementById('btn-add-armor-dialog').onclick = () => {
      const id = prompt('Enter Armor ID to add:');
      if (!id || isNaN(id)) return;
      armorsObj[id] = 1;
      renderArmorsTab(partyObj);
      markSaveModified('Add Armor #' + id);
      showToast('Added Armor #' + id, 'success');
    };

    const q = document.getElementById('armors-search').value.trim().toLowerCase();
    ids.forEach(id => {
      const count = armorsObj[id];
      const name = (gameData && gameData.armors && gameData.armors[id]) || \`Armor #\${id}\`;
      if (q && !id.includes(q) && !name.toLowerCase().includes(q)) return;

      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = \`
        <div style="display:flex; justify-content:space-between;"><span style="color:#fff; font-weight:600;" title="\${escapeHtml(name)}">\${escapeHtml(name)}</span><span style="font-size:0.75rem; color:var(--text-secondary);">#\${id}</span></div>
        <input type="number" class="stat-input" value="\${count}" style="padding:4px;">
      \`;
      card.querySelector('input').onchange = (e) => {
        armorsObj[id] = parseInt(e.target.value) || 0;
        markSaveModified('Armor #' + id);
      };
      container.appendChild(card);
    });
  }

  function renderVariablesTab(varsObj) {
    const container = document.getElementById('variables-cards-container');
    container.innerHTML = '';
    if (!varsObj) return;
    const varsArr = getJsonExArray(varsObj['@data'] || varsObj._data || varsObj);
    const nonZeroOnly = document.getElementById('vars-nonzero-only').checked;
    const q = document.getElementById('variables-search').value.trim().toLowerCase();

    let count = 0;
    for (let id = 1; id < Math.min(varsArr.length, 500); id++) {
      const val = varsArr[id];
      if (val === undefined || val === null) continue;
      if (nonZeroOnly && (val === 0 || val === '0')) continue;
      if (q && !String(id).includes(q) && !String(val).toLowerCase().includes(q)) continue;
      count++;

      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = \`
        <div style="display:flex; justify-content:space-between;"><span style="color:#fff; font-weight:600;">Variable #\${id}</span></div>
        <input type="text" class="stat-input" value="\${val}" style="padding:4px;">
      \`;
      card.querySelector('input').onchange = (e) => {
        let n = e.target.value;
        if (/^-?\\d+$/.test(n)) n = parseInt(n, 10);
        varsArr[id] = n;
        markSaveModified('Var #' + id);
      };
      container.appendChild(card);
    }
    document.getElementById('badge-var-count').textContent = count;
  }

  function renderSwitchesTab(swObj) {
    const container = document.getElementById('switches-cards-container');
    container.innerHTML = '';
    if (!swObj) return;
    const swArr = getJsonExArray(swObj['@data'] || swObj._data || swObj);
    const qEl = document.getElementById('switches-search');
    const q = qEl ? qEl.value.trim().toLowerCase() : '';
    const fEl = document.getElementById('switches-filter');
    const filter = fEl ? fEl.value : 'all';

    let trueCount = 0;
    for (let id = 1; id < Math.min(swArr.length, 500); id++) {
      const val = Boolean(swArr[id]);
      if (val) trueCount++;
      if (filter === 'on' && !val) continue;
      if (filter === 'off' && val) continue;
      const name = (gameData && gameData.switches && gameData.switches[id]) || \`Switch #\${id}\`;
      if (q && !String(id).includes(q) && !name.toLowerCase().includes(q)) continue;

      const card = document.createElement('div');
      card.style.cssText = 'background:var(--bg-card); border:1px solid var(--border-color); border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;';
      card.innerHTML = \`
        <span style="color:#fff; font-weight:600;" title="\${escapeHtml(name)}">\${escapeHtml(name)}</span>
        <label class="toggle-switch"><input type="checkbox" \${val?'checked':''}><span class="slider"></span></label>
      \`;
      card.querySelector('input').onchange = (e) => {
        swArr[id] = e.target.checked;
        markSaveModified('Switch #' + id);
      };
      container.appendChild(card);
    }
    document.getElementById('badge-switch-count').textContent = trueCount;
  }

  function setByTokens(obj, tokens, val) {
    let cur = obj;
    for (let i = 0; i < tokens.length - 1; i++) {
      if (!cur) return;
      cur = cur[tokens[i]];
    }
    if (cur && tokens.length > 0) {
      cur[tokens[tokens.length - 1]] = val;
    }
  }

  function renderRawTable() {
    const tbody = document.getElementById('raw-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    flatEntries.slice(0, 50).forEach(entry => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid #232a3d';
      tr.innerHTML = \`
        <td style="padding:8px 14px; font-family:var(--font-mono); color:#79c0ff;">\${entry.path}</td>
        <td style="padding:8px 14px;"><span class="meta-tag">\${entry.type}</span></td>
        <td style="padding:8px 14px; color:var(--text-secondary); font-family:var(--font-mono);">\${String(entry.origVal)}</td>
        <td style="padding:8px 14px;"><input type="text" class="stat-input raw-val-input" value="\${entry.currentVal}" style="padding:4px 8px;"></td>
        <td style="padding:8px 14px;"><button class="btn btn-secondary btn-sm raw-rev-btn">↺</button></td>
      \`;
      const inp = tr.querySelector('.raw-val-input');
      const rev = tr.querySelector('.raw-rev-btn');
      inp.onchange = () => {
        let v = inp.value;
        if (entry.type === 'number') v = Number(v) || 0;
        else if (entry.type === 'boolean') v = (v === 'true' || v === '1');
        entry.currentVal = v;
        setByTokens(currentFile.parsedRoot, entry.pathTokens, v);
        markSaveModified('Raw: ' + entry.path);
      };
      rev.onclick = () => {
        entry.currentVal = entry.origVal;
        inp.value = entry.origVal;
        setByTokens(currentFile.parsedRoot, entry.pathTokens, entry.origVal);
      };
      tbody.appendChild(tr);
    });
  }

  function flattenObject(obj, prefix = '', tokens = []) {
    let result = [];
    if (!obj || typeof obj !== 'object') return result;
    for (const [key, val] of Object.entries(obj)) {
      const curTokens = [...tokens, key];
      const curPath = prefix ? (Array.isArray(obj) ? \`\${prefix}[\${key}]\` : \`\${prefix}.\${key}\`) : key;
      if (val !== null && typeof val === 'object' && !(val instanceof Uint8Array)) {
        result = result.concat(flattenObject(val, curPath, curTokens));
      } else {
        result.push({ path: curPath, pathTokens: curTokens, type: typeof val, origVal: val, currentVal: val, isModified: false });
      }
    }
    return result;
  }

  // Optional Game Data Files Loader (Tab 7)
  const dataDropzone = document.getElementById('data-dropzone');
  const dataFileInput = document.getElementById('data-file-input');
  function handleDataFiles(files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result);
          const lower = file.name.toLowerCase();
          if (Array.isArray(json)) {
            const target = lower.includes('item') ? gameData.items : (lower.includes('weapon') ? gameData.weapons : (lower.includes('armor') ? gameData.armors : null));
            if (target) {
              json.forEach(x => { if (x && x.id && x.name) target[x.id] = x.name; });
            }
          } else if (json && typeof json === 'object') {
            if (Array.isArray(json.variables)) json.variables.forEach((n, i) => { if (n) gameData.variables[i] = n; });
            if (Array.isArray(json.switches)) json.switches.forEach((n, i) => { if (n) gameData.switches[i] = n; });
          }
          setupVisualEditor();
          showToast(\`Loaded names from \${file.name}\`, 'success');
        } catch(e) {}
      };
      reader.readAsText(file);
    });
  }
  if (dataDropzone && dataFileInput) {
    dataDropzone.onclick = () => dataFileInput.click();
    dataDropzone.ondragover = (e) => e.preventDefault();
    dataDropzone.ondrop = (e) => { e.preventDefault(); if (e.dataTransfer && e.dataTransfer.files) handleDataFiles(e.dataTransfer.files); };
    dataFileInput.onchange = (e) => { if (e.target.files) handleDataFiles(e.target.files); };
  }

  // Save Export
  async function downloadEditedSave() {
    if (currentFile.engine === 'wolf') {
      showToast('WOLF RPG Pro มีระบบเข้ารหัสเฉพาะของเอนจิ้น — โปรดแก้ไขผ่าน Cheat Engine ตามคู่มือบนหน้าจอ', 'warn');
      return;
    }
    let blob;
    if (currentFile.format === 'ruby_marshal') {
      const bytes = RubyMarshal.encode(currentFile.parsedRoot);
      blob = new Blob([bytes], { type: 'application/octet-stream' });
    } else if (currentFile.format === 'rmmzsave' || currentFile.format === 'rmmzsave_bin') {
      const zipped = pako.deflate(JSON.stringify(currentFile.parsedRoot), { to: 'string', level: 1 });
      blob = new Blob([zipped], { type: 'text/plain;charset=utf-8' });
    } else if (currentFile.format === 'rpgmaker_lz') {
      const comp = LZString.compressToBase64(JSON.stringify(currentFile.parsedRoot));
      blob = new Blob([comp], { type: 'text/plain;charset=utf-8' });
    } else {
      blob = new Blob([JSON.stringify(currentFile.parsedRoot, null, 2)], { type: 'application/json' });
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.name || 'savegame.rpgsave';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Download started!', 'success');
  }

  function downloadBackupRaw() {
    if (!currentFile || !currentFile.rawBytes) return;
    const blob = new Blob([currentFile.rawBytes], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (currentFile.name || 'save') + '.bak';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Original backup (.bak) downloaded!', 'success');
  }

  const btnRevDl = document.getElementById('btn-review-download');
  if (btnRevDl) btnRevDl.onclick = downloadEditedSave;
  const btnBakRaw = document.getElementById('btn-backup-raw');
  if (btnBakRaw) btnBakRaw.onclick = downloadBackupRaw;
  const btnModalBak = document.getElementById('btn-modal-bak');
  if (btnModalBak) btnModalBak.onclick = downloadBackupRaw;
  const btnModalDl = document.getElementById('btn-modal-download');
  if (btnModalDl) btnModalDl.onclick = downloadEditedSave;
  const diffModal = document.getElementById('diff-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  if (btnCloseModal && diffModal) btnCloseModal.onclick = () => { diffModal.style.display = 'none'; };
  const btnCancelModal = document.getElementById('btn-modal-cancel');
  if (btnCancelModal && diffModal) btnCancelModal.onclick = () => { diffModal.style.display = 'none'; };

  const btnExpJson = document.getElementById('btn-export-json');
  if (btnExpJson) {
    btnExpJson.onclick = () => {
      if (!currentFile || !currentFile.parsedRoot) return;
      const blob = new Blob([JSON.stringify(currentFile.parsedRoot, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (currentFile.name ? currentFile.name.replace(/\.[^/.]+$/, '') : 'save') + '_decrypted.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Decrypted JSON exported!', 'success');
    };
  }

  const btnChangeFile = document.getElementById('btn-change-file');
  if (btnChangeFile) {
    btnChangeFile.onclick = () => {
      fileInput.click();
    };
  }

  // Tab switching in Save Editor
  window.switchTab = (tabId) => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tabId));
    document.querySelectorAll('.section-panel').forEach(p => p.classList.toggle('active', p.id === tabId));
  };
  document.querySelectorAll('.tab-btn').forEach(b => b.onclick = () => switchTab(b.getAttribute('data-tab')));

})();
</script>

</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent);
console.log('Save & DB Studio PRO MAX built successfully!');
