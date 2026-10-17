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
<title>SaveEdit &amp; Database Studio PRO MAX - Universal RPG Maker Tool</title>
<style>
  :root {
    --bg-main: #121622;
    --bg-card: #1b2130;
    --bg-card-hover: #22293c;
    --bg-input: #0f131d;
    --border-color: #2b3449;
    --border-focus: #388bfd;
    --text-primary: #e6edf3;
    --text-secondary: #8b949e;
    --text-muted: #586069;
    --accent-green: #2ea043;
    --accent-green-hover: #3fb950;
    --accent-blue: #388bfd;
    --accent-blue-hover: #58a6ff;
    --accent-gold: #e3b341;
    --accent-warn: #d29922;
    --accent-danger: #f85149;
    --accent-purple: #bc8cff;
    --card-shadow: 0 4px 14px rgba(0,0,0,0.4);
    --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
    background: #171c2b;
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
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #388bfd, #2ea043);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 18px; color: #fff;
    box-shadow: 0 2px 10px rgba(56, 139, 253, 0.4);
  }
  .mode-switch-bar {
    display: flex; background: #10141f; border: 1px solid var(--border-color);
    border-radius: 8px; padding: 3px; gap: 4px;
  }
  .mode-btn {
    padding: 6px 14px; border-radius: 6px; border: none; background: transparent;
    color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; cursor: pointer;
    transition: all 0.15s ease; display: flex; align-items: center; gap: 6px;
  }
  .mode-btn:hover { color: #fff; }
  .mode-btn.active {
    background: #232a3d; color: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  }
  .mode-btn.active-db {
    background: #2e1d42; color: var(--accent-purple); box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  }

  .container {
    max-width: 1560px; width: 100%; margin: 0 auto;
    padding: 16px 20px; flex: 1; display: flex; flex-direction: column;
  }

  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 6px; font-size: 0.85rem;
    font-weight: 600; cursor: pointer; border: 1px solid transparent;
    transition: all 0.15s ease; user-select: none;
  }
  .btn-primary { background: var(--accent-green); color: #fff; }
  .btn-primary:hover { background: var(--accent-green-hover); }
  .btn-blue { background: var(--accent-blue); color: #fff; }
  .btn-blue:hover { background: var(--accent-blue-hover); }
  .btn-secondary { background: #23293a; color: var(--text-primary); border-color: var(--border-color); }
  .btn-secondary:hover { background: #2e364c; border-color: #8b949e; }
  .btn-gold { background: #3d3113; color: var(--accent-gold); border-color: #795d17; }
  .btn-gold:hover { background: #574519; }
  .btn-purple { background: #2e1d42; color: var(--accent-purple); border-color: #613b8b; }
  .btn-purple:hover { background: #40285d; }
  .btn-danger { background: #381a1d; color: var(--accent-danger); border-color: #6e252a; }
  .btn-danger:hover { background: #4f2227; }
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
    background: rgba(56, 139, 253, 0.08);
    border-radius: 8px 8px 0 0;
  }
  .tab-badge {
    background: #252c3d; color: var(--text-secondary); padding: 1px 7px;
    border-radius: 10px; font-size: 0.72rem; font-family: var(--font-mono);
  }
  .tab-btn.active .tab-badge { background: #1f3a60; color: #79c0ff; }

  /* Info Green Notice Bar */
  .info-notice {
    background: #143522; border: 1px solid #2ea043; border-radius: 8px;
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
      <input type="file" id="file-input" style="display:none;">
      <div style="display:flex; gap:10px; margin-top:10px;">
        <button class="btn btn-blue" onclick="document.getElementById('file-input').click()">Browse File</button>
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

      <!-- Quick Gold Edit -->
      <div style="background:#191c28; border:1px solid #c69026; border-radius:8px; padding:6px 14px; display:flex; align-items:center; gap:8px;">
        <span style="font-weight:700; color:var(--accent-gold); font-size:0.95rem;">💰 Gold:</span>
        <input type="number" style="background:var(--bg-input); border:1px solid var(--border-color); border-radius:6px; color:#fff; font-family:var(--font-mono); font-size:1rem; font-weight:bold; width:120px; padding:4px 8px;" id="quick-gold-input" value="0">
        <button class="revert-btn" id="gold-revert-btn" title="Revert Gold">↺</button>
        <button class="btn btn-secondary btn-sm" id="btn-gold-add-10k">+10K</button>
        <button class="btn btn-secondary btn-sm" id="btn-gold-add-100k">+100K</button>
        <button class="btn btn-gold btn-sm" id="btn-gold-max">MAX 9.9M</button>
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
    <!-- DB Meta Toolbar -->
    <div class="db-toolbar">
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:1.2rem; font-weight:800; color:#bc8cff;" id="db-label-type">⚔️ WEAPONS DATABASE</span>
        <span style="background:#141722; border:1px solid var(--border-color); padding:3px 10px; border-radius:6px; font-size:0.78rem; color:#7ee787;" id="db-label-filename">Weapons.json</span>
        <span style="background:#141722; border:1px solid var(--border-color); padding:3px 10px; border-radius:6px; font-size:0.78rem; color:var(--text-secondary);" id="db-label-count">0 ITEMS</span>
      </div>

      <!-- Category Quick Switcher -->
      <div style="display:flex; gap:6px;">
        <button class="btn btn-secondary btn-sm db-cat-btn active" data-cat="weapons">⚔️ Weapons</button>
        <button class="btn btn-secondary btn-sm db-cat-btn" data-cat="armors">🛡️ Armors</button>
        <button class="btn btn-secondary btn-sm db-cat-btn" data-cat="items">🎒 Items</button>
        <button class="btn btn-secondary btn-sm db-cat-btn" data-cat="skills">⚡ Skills</button>
      </div>
    </div>

    <!-- Master - Detail Layout -->
    <div class="db-layout">
      <!-- Left List Panel -->
      <div class="db-list-panel">
        <div class="db-search-box">
          <input type="text" class="db-search-input" id="db-search-input" placeholder="Search name, ID, or description...">
        </div>
        <div class="db-items-scroll" id="db-items-list-container">
          <!-- Dynamically populated list rows -->
        </div>
      </div>

      <!-- Right Detail Panel -->
      <div class="db-detail-panel" id="db-detail-container">
        <div style="text-align:center; padding:60px 20px; color:var(--text-muted);">
          <div style="font-size:3rem; margin-bottom:10px;">👈</div>
          <div style="font-size:1.1rem; font-weight:600; color:#fff;">Select an item from the list to edit</div>
          <div style="font-size:0.85rem; margin-top:4px;">You can customize stats, damage formulas, costs, and effects.</div>
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

  // Active Database State
  let currentDb = {
    category: 'weapons', // 'weapons', 'armors', 'items', 'skills'
    fileName: 'Weapons.json',
    fileHandle: null,    // File System Access API handle
    items: [],
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
      if (currentDb.items.length === 0) {
        // Auto-prompt to load a database file
        showToast('Please open or drop a data JSON file (Weapons, Armors, Items, Skills)', 'info');
      }
    }
  }

  btnModeSave.onclick = () => switchAppMode('save');
  btnModeDb.onclick = () => switchAppMode('database');
  document.getElementById('btn-quick-open-db').onclick = () => {
    switchAppMode('database');
    document.getElementById('btn-open-db-file').click();
  };

  // -------------------------------------------------------------
  // UNIVERSAL SAVE & DB DISPATCHER ON FILE DROP
  // -------------------------------------------------------------
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');

  dropzone.onclick = (e) => { if (e.target.tagName !== 'BUTTON') fileInput.click(); };
  dropzone.ondragover = (e) => { e.preventDefault(); dropzone.style.borderColor = '#388bfd'; };
  dropzone.ondragleave = () => { dropzone.style.borderColor = 'var(--border-color)'; };
  dropzone.ondrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files[0]) handleIncomingFile(e.dataTransfer.files[0]);
  };
  fileInput.onchange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleIncomingFile(e.target.files[0]);
      fileInput.value = '';
    }
  };
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleIncomingFile(e.dataTransfer.files[0]);
    }
  });

  function handleIncomingFile(file) {
    const name = file.name.toLowerCase();
    // Check if it is a database file
    if (name === 'weapons.json' || name === 'armors.json' || name === 'items.json' || name === 'skills.json' || name === 'enemies.json') {
      loadDatabaseFile(file);
    } else {
      loadSaveFile(file);
    }
  }

  // -------------------------------------------------------------
  // DATABASE MODDER LOGIC
  // -------------------------------------------------------------
  function loadDatabaseFile(file, handle = null) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result);
        if (!Array.isArray(json)) throw new Error('Database file must contain a JSON array.');

        const baseName = file.name.replace(/\.json$/i, '').toLowerCase();
        let cat = 'weapons';
        if (baseName.includes('armor')) cat = 'armors';
        else if (baseName.includes('item')) cat = 'items';
        else if (baseName.includes('skill')) cat = 'skills';

        currentDb.category = cat;
        currentDb.fileName = file.name;
        currentDb.fileHandle = handle;
        currentDb.items = json;
        currentDb.modifiedIds.clear();

        // Update UI
        switchAppMode('database');
        updateDbCategoryButtons(cat);
        renderDbMasterList();
        showToast(\`Loaded \${file.name} successfully!\`, 'success');
      } catch(e) {
        alert('Error parsing database JSON:\\n' + e.message);
      }
    };
    reader.readAsText(file);
  }

  function updateDbCategoryButtons(cat) {
    document.querySelectorAll('.db-cat-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cat') === cat);
    });
    document.getElementById('db-label-filename').textContent = currentDb.fileName;
    const catTitles = { weapons: '⚔️ WEAPONS DATABASE', armors: '🛡️ ARMORS DATABASE', items: '🎒 ITEMS DATABASE', skills: '⚡ SKILLS DATABASE' };
    document.getElementById('db-label-type').textContent = catTitles[cat] || 'DATABASE MODDER';
  }

  document.querySelectorAll('.db-cat-btn').forEach(btn => {
    btn.onclick = () => {
      const cat = btn.getAttribute('data-cat');
      currentDb.category = cat;
      currentDb.fileName = cat.charAt(0).toUpperCase() + cat.slice(1) + '.json';
      updateDbCategoryButtons(cat);
      showToast(\`Switched to \${cat}. Please open or drop \${currentDb.fileName} if not loaded.\`, 'info');
    };
  });

  // Render Master List (Left Pane)
  function renderDbMasterList() {
    const container = document.getElementById('db-items-list-container');
    container.innerHTML = '';

    const q = document.getElementById('db-search-input').value.trim().toLowerCase();
    const validItems = currentDb.items.filter(x => x && x.id);
    document.getElementById('db-label-count').textContent = \`\${validItems.length} ITEMS\`;

    validItems.forEach(item => {
      const name = item.name || '(Unnamed)';
      const idStr = String(item.id);
      const desc = item.description || '';
      if (q && !idStr.includes(q) && !name.toLowerCase().includes(q) && !desc.toLowerCase().includes(q)) return;

      const row = document.createElement('div');
      row.className = \`db-list-row \${currentDb.selectedId === item.id ? 'active' : ''} \${currentDb.modifiedIds.has(item.id) ? 'is-modified' : ''}\`;
      row.innerHTML = \`
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="db-row-id">#\${item.id}</span>
          <span class="db-row-name" title="\${name}">\${name}</span>
        </div>
        <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">\${getQuickPreviewBadge(item)}</span>
      \`;

      row.onclick = () => {
        currentDb.selectedId = item.id;
        document.querySelectorAll('.db-list-row').forEach(r => r.classList.remove('active'));
        row.classList.add('active');
        renderDbDetail(item);
      };

      container.appendChild(row);
    });

    if (!currentDb.selectedId && validItems.length > 0) {
      currentDb.selectedId = validItems[0].id;
      renderDbDetail(validItems[0]);
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
      return item.price !== undefined ? \`\${item.price} G\` : '';
    }
    return '';
  }

  document.getElementById('db-search-input').oninput = renderDbMasterList;

  // Render Detail Editor (Right Pane)
  function renderDbDetail(item) {
    const container = document.getElementById('db-detail-container');
    if (!item) return;

    const cat = currentDb.category;
    let specificHtml = '';

    if (cat === 'weapons' || cat === 'armors') {
      const paramNames = ['MHP', 'MMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI', 'LUK'];
      const p = item.params || [0,0,0,0,0,0,0,0];
      let paramInputs = '';
      paramNames.forEach((name, i) => {
        paramInputs += \`
          <div class="db-field-box">
            <span class="db-field-label">\${name} \${i===2?'(Attack)':(i===3?'(Defense)':'')}</span>
            <input type="number" class="stat-input db-stat-input" data-idx="\${i}" value="\${p[i]||0}">
          </div>
        \`;
      });

      specificHtml = \`
        <div class="preset-bar">
          <span style="font-weight:700; color:var(--text-secondary); font-size:0.85rem;">⚡ Quick Presets:</span>
          <button class="btn btn-gold btn-sm" id="btn-db-god-weapon">\${cat==='weapons'?'⚔️ God Weapon (ATK 9999)':'🛡️ Invincible Armor (DEF 9999)'}</button>
          <button class="btn btn-secondary btn-sm" id="btn-db-free-price">🪙 Set Price 0</button>
        </div>

        <div style="font-size:0.85rem; font-weight:700; color:#fff; margin-top:6px;">Combat Attributes &amp; Stats:</div>
        <div class="db-field-grid">\${paramInputs}</div>
      \`;
    } else if (cat === 'items') {
      const dmg = item.damage || {};
      specificHtml = \`
        <div class="preset-bar">
          <span style="font-weight:700; color:var(--text-secondary); font-size:0.85rem;">⚡ Quick Presets:</span>
          <button class="btn btn-blue btn-sm" id="btn-db-make-infinite">♾️ Make Infinite (Never Consumed)</button>
          <button class="btn btn-secondary btn-sm" id="btn-db-free-price">🪙 Set Price 0</button>
        </div>

        <div class="db-field-grid">
          <div class="db-field-box">
            <span class="db-field-label">Consumable on Use</span>
            <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
              <label class="toggle-switch">
                <input type="checkbox" id="item-consumable" \${item.consumable?'checked':''}>
                <span class="slider"></span>
              </label>
              <span style="font-size:0.82rem; color:var(--text-muted);">Turn OFF for Infinite Item!</span>
            </div>
          </div>

          <div class="db-field-box">
            <span class="db-field-label">Target Scope</span>
            <select id="item-scope" class="stat-input" style="font-size:0.85rem; padding:6px;">
              <option value="1" \${item.scope===1?'selected':''}>One Enemy</option>
              <option value="2" \${item.scope===2?'selected':''}>All Enemies</option>
              <option value="7" \${item.scope===7?'selected':''}>One Ally</option>
              <option value="8" \${item.scope===8?'selected':''}>All Allies</option>
              <option value="11" \${item.scope===11?'selected':''}>The User</option>
              <option value="0" \${item.scope===0?'selected':''}>None</option>
            </select>
          </div>

          <div class="db-field-box" style="grid-column: 1 / -1;">
            <span class="db-field-label">Damage / Healing Formula</span>
            <input type="text" class="stat-input" id="item-formula" value="\${dmg.formula || '0'}" placeholder="e.g. 200 + b.mhp * 0.2">
          </div>
        </div>
      \`;
    } else if (cat === 'skills') {
      const dmg = item.damage || {};
      specificHtml = \`
        <div class="preset-bar">
          <span style="font-weight:700; color:var(--text-secondary); font-size:0.85rem;">⚡ Quick Presets:</span>
          <button class="btn btn-blue btn-sm" id="btn-db-free-mp">⚡ 0 MP / 0 TP Cost</button>
          <button class="btn btn-danger btn-sm" id="btn-db-instakill">💥 99,999 Damage (Instant Kill)</button>
        </div>

        <div class="db-field-grid">
          <div class="db-field-box">
            <span class="db-field-label">MP Cost</span>
            <input type="number" class="stat-input" id="skill-mp-cost" value="\${item.mpCost || 0}">
          </div>
          <div class="db-field-box">
            <span class="db-field-label">TP Cost</span>
            <input type="number" class="stat-input" id="skill-tp-cost" value="\${item.tpCost || 0}">
          </div>
          <div class="db-field-box">
            <span class="db-field-label">Can Critical Hit?</span>
            <label class="toggle-switch" style="margin-top:4px;">
              <input type="checkbox" id="skill-critical" \${dmg.critical?'checked':''}>
              <span class="slider"></span>
            </label>
          </div>
          <div class="db-field-box">
            <span class="db-field-label">Hit Type</span>
            <select id="skill-hit-type" class="stat-input" style="font-size:0.85rem; padding:6px;">
              <option value="0" \${item.hitType===0?'selected':''}>Certain Hit</option>
              <option value="1" \${item.hitType===1?'selected':''}>Physical Attack</option>
              <option value="2" \${item.hitType===2?'selected':''}>Magical Attack</option>
            </select>
          </div>
          <div class="db-field-box" style="grid-column: 1 / -1;">
            <span class="db-field-label">Damage Formula (JavaScript)</span>
            <input type="text" class="stat-input" id="skill-formula" value="\${dmg.formula || ''}" placeholder="e.g. a.atk * 4 - b.def * 2">
          </div>
        </div>
      \`;
    }

    container.innerHTML = \`
      <div class="db-item-header">
        <div class="db-item-title-group">
          <div class="db-icon-box">\${getCategoryIcon(cat)}</div>
          <input type="text" class="db-name-input" id="detail-name" value="\${item.name || ''}">
          <span style="background:#20283c; border:1px solid var(--border-color); padding:3px 10px; border-radius:6px; font-size:0.8rem; font-family:var(--font-mono); color:#79c0ff;">ID #\${item.id}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          \${item.price !== undefined ? \`
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:0.85rem; color:var(--accent-gold); font-weight:700;">Price:</span>
              <input type="number" class="stat-input" id="detail-price" value="\${item.price}" style="width:100px; padding:4px 8px;">
            </div>
          \` : ''}
        </div>
      </div>

      <div class="db-field-box">
        <span class="db-field-label">Description</span>
        <textarea class="db-textarea" id="detail-desc">\${item.description || ''}</textarea>
      </div>

      \${specificHtml}

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:16px; border-top:1px solid var(--border-color);">
        <button class="btn btn-secondary btn-sm" id="btn-db-revert-item">↺ Revert Item</button>
        <button class="btn btn-primary btn-sm" id="btn-detail-download">📥 Download \${currentDb.fileName}</button>
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
  }

  function bindDetailEvents(item) {
    // Name & Desc
    const nameEl = document.getElementById('detail-name');
    nameEl.onchange = () => { item.name = nameEl.value; markModified(item); };
    const descEl = document.getElementById('detail-desc');
    descEl.onchange = () => { item.description = descEl.value; markModified(item); };
    const priceEl = document.getElementById('detail-price');
    if (priceEl) priceEl.onchange = () => { item.price = parseInt(priceEl.value) || 0; markModified(item); };

    // Stats for weapons & armors
    document.querySelectorAll('.db-stat-input').forEach(inp => {
      inp.onchange = () => {
        const idx = parseInt(inp.getAttribute('data-idx'));
        if (!item.params) item.params = [0,0,0,0,0,0,0,0];
        item.params[idx] = parseInt(inp.value) || 0;
        markModified(item);
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
        renderDbDetail(item);
        showToast('God stats applied!', 'success');
      };
    }

    const btnFree = document.getElementById('btn-db-free-price');
    if (btnFree) {
      btnFree.onclick = () => {
        item.price = 0;
        markModified(item);
        renderDbDetail(item);
        showToast('Price set to 0 G!', 'success');
      };
    }

    // Items events
    const chkCons = document.getElementById('item-consumable');
    if (chkCons) chkCons.onchange = () => { item.consumable = chkCons.checked; markModified(item); };
    const selScope = document.getElementById('item-scope');
    if (selScope) selScope.onchange = () => { item.scope = parseInt(selScope.value); markModified(item); };
    const txtFormula = document.getElementById('item-formula');
    if (txtFormula) txtFormula.onchange = () => {
      if (!item.damage) item.damage = { type: 1, formula: '0' };
      item.damage.formula = txtFormula.value;
      markModified(item);
    };

    const btnInf = document.getElementById('btn-db-make-infinite');
    if (btnInf) {
      btnInf.onclick = () => {
        item.consumable = false;
        markModified(item);
        renderDbDetail(item);
        showToast('Item is now INFINITE (not consumed on use)!', 'success');
      };
    }

    // Skills events
    const mpCost = document.getElementById('skill-mp-cost');
    if (mpCost) mpCost.onchange = () => { item.mpCost = parseInt(mpCost.value) || 0; markModified(item); };
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
        renderDbDetail(item);
        showToast('MP & TP costs set to 0!', 'success');
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
        showToast('Formula set to 99,999 Damage!', 'success');
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
        showToast(\`Saved directly to \${currentDb.fileName}!\`, 'success');
        return;
      }
    } catch(e) {
      if (e.name !== 'AbortError') console.warn(e);
    }
    // Fallback to regular download
    downloadDatabaseFile();
  }

  function downloadDatabaseFile() {
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
    showToast(\`Downloaded \${currentDb.fileName}\`, 'success');
  }

  const btnDbDl = document.getElementById('btn-db-download');
  if (btnDbDl) btnDbDl.onclick = downloadDatabaseFile;

  // Open DB file directly via Picker
  document.getElementById('btn-open-db-file').onclick = async () => {
    try {
      if (window.showOpenFilePicker) {
        const [handle] = await window.showOpenFilePicker({
          types: [{ description: 'RPG Maker Database JSON', accept: { 'application/json': ['.json'] } }]
        });
        const file = await handle.getFile();
        loadDatabaseFile(file, handle);
        return;
      }
    } catch(e) {}
    fileInput.click();
  };

  // -------------------------------------------------------------
  // SAVE EDITOR LOGIC (PRESERVED & INTEGRATED)
  // -------------------------------------------------------------
  async function loadSaveFile(file) {
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
          <i>*แม้แต่เว็บ SaveEditOnline.com ดั้งเดิม เมื่อพยายามกดบันทึกไฟล์นี้กลับ ก็จะเกิดข้อผิดพลาด 500 (An error occurred while saving the file) เพราะตัวเซฟถูกป้องกันด้วย Checksum ของเอนจิ้น</i>
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
          <span style="font-weight:600; font-size:0.88rem; color:#fff;" title="\${name}">\${name}</span>
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
        <div style="display:flex; justify-content:space-between;"><span style="color:#fff; font-weight:600;">\${name}</span><span style="font-size:0.75rem; color:var(--text-secondary);">#\${id}</span></div>
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
        <div style="display:flex; justify-content:space-between;"><span style="color:#fff; font-weight:600;">\${name}</span><span style="font-size:0.75rem; color:var(--text-secondary);">#\${id}</span></div>
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
        <span style="color:#fff; font-weight:600;">\${name}</span>
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
