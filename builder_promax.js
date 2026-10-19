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
<title>Universal RPG Maker Save Editor</title>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2064%2064'%3E%3Cdefs%3E%3ClinearGradient%20id='bg'%20x1='0%25'%20y1='0%25'%20x2='100%25'%20y2='100%25'%3E%3Cstop%20offset='0%25'%20stop-color='%23242933'/%3E%3Cstop%20offset='100%25'%20stop-color='%2314161B'/%3E%3C/linearGradient%3E%3ClinearGradient%20id='gold'%20x1='0%25'%20y1='0%25'%20x2='100%25'%20y2='100%25'%3E%3Cstop%20offset='0%25'%20stop-color='%23FFF2D6'/%3E%3Cstop%20offset='40%25'%20stop-color='%23E2B86B'/%3E%3Cstop%20offset='100%25'%20stop-color='%23B88028'/%3E%3C/linearGradient%3E%3ClinearGradient%20id='crystal'%20x1='0%25'%20y1='0%25'%20x2='100%25'%20y2='100%25'%3E%3Cstop%20offset='0%25'%20stop-color='%23C2F0BC'/%3E%3Cstop%20offset='60%25'%20stop-color='%2373A86E'/%3E%3Cstop%20offset='100%25'%20stop-color='%233B6338'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20x='2'%20y='2'%20width='60'%20height='60'%20rx='14'%20fill='url(%23bg)'%20stroke='url(%23gold)'%20stroke-width='2.5'/%3E%3Cpath%20d='M16%2013h24l9%209v27a2%202%200%200%201-2%202H18a2%202%200%200%201-2-2V13z'%20fill='%231C2028'%20stroke='%23444B57'%20stroke-width='1.8'%20stroke-linejoin='round'/%3E%3Cpath%20d='M22%2013h18v12a1%201%200%200%201-1%201H23a1%201%200%200%201-1-1V13z'%20fill='url(%23gold)'/%3E%3Crect%20x='26'%20y='16'%20width='3.5'%20height='6'%20rx='1'%20fill='%2314161B'/%3E%3Cpolygon%20points='32,29%2042,39%2032,49%2022,39'%20fill='url(%23crystal)'%20stroke='%23A2C79D'%20stroke-width='1.5'%20stroke-linejoin='round'/%3E%3Cpolygon%20points='32,32%2039,39%2032,46%2025,39'%20fill='%23E8FCE4'%20opacity='0.35'/%3E%3Ccircle%20cx='32'%20cy='39'%20r='2.2'%20fill='%23FFFFFF'/%3E%3C/svg%3E">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<meta name="theme-color" content="#16181D">
<style>
  /* Color Hunt Palette Adaptation (High Contrast Tactile Studio):
     Primary Curated Palette: Crisp Parchment, Warm Sand & Deep Charcoal
     Secondary Earth Accents: Sage Green, Ochre Amber & Terracotta */
  :root {
    --bg-main: #16181D;
    --bg-header: #1C1F26;
    --bg-card: #22262E;
    --bg-card-hover: #2C323D;
    --bg-elevated: #303744;
    --bg-input: #121418;
    --border-color: #444B57;
    --border-subtle: #333944;
    --border-focus: #F0E6D2;
    --text-primary: #F7F3EB;
    --text-secondary: #C8BFB2;
    --text-muted: #9C9588;
    --accent-sand: #E6D8C3;
    --accent-sand-hover: #F7EDE1;
    --accent-sand-text: #181B20;
    --accent-sage: #607D5B;
    --accent-sage-bright: #A2C79D;
    --accent-sage-bg: #1F2E1E;
    --accent-amber: #D9A85B;
    --accent-amber-bg: #302617;
    --accent-terra: #C9674D;
    --accent-terra-bg: #331E18;
    --font-mono: ui-monospace, "JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    --font-sans: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --radius-sm: 4px;
    --radius-md: 6px;
    --radius-lg: 8px;
  }

  ::placeholder {
    color: var(--text-muted);
    opacity: 0.85;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background-color: var(--bg-main);
    color: var(--text-primary);
    font-family: var(--font-sans);
    font-size: 14px;
    line-height: 1.5;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    -webkit-font-smoothing: antialiased;
  }

  /* SVG Icons */
  .ico {
    width: 15px;
    height: 15px;
    stroke: currentColor;
    stroke-width: 1.75;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    flex-shrink: 0;
  }
  .ico-lg { width: 22px; height: 22px; stroke-width: 1.5; }
  .ico-xl { width: 32px; height: 32px; stroke-width: 1.4; }

  /* Header */
  header {
    background: var(--bg-header);
    border-bottom: 1px solid var(--border-color);
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    position: sticky;
    top: 0;
    z-index: 100;
    flex-wrap: wrap;
  }
  .logo-wrap { display: flex; align-items: center; gap: 12px; }
  .logo-icon {
    width: 34px; height: 34px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    display: flex; align-items: center; justify-content: center;
    color: var(--accent-sand);
  }
  .brand-title {
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
  }
  .badge-promax, .badge-offline {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    padding: 2px 7px;
    border-radius: var(--radius-sm);
    margin-left: 8px;
    text-transform: uppercase;
  }
  .badge-promax {
    background: var(--bg-elevated);
    color: var(--accent-sand);
    border: 1px solid var(--border-color);
  }
  .badge-offline {
    background: var(--accent-sage-bg);
    color: var(--accent-sage-bright);
    border: 1px solid var(--accent-sage);
  }

  /* Mode Switcher */
  .mode-switch-bar {
    display: flex;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 3px;
    gap: 3px;
  }
  .mode-btn {
    padding: 6px 14px;
    border-radius: var(--radius-sm);
    border: 1px solid transparent;
    background: transparent;
    color: var(--text-secondary);
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .mode-btn:hover { color: var(--text-primary); }
  .mode-btn.active, .mode-btn.active-db {
    background: var(--bg-card);
    color: var(--accent-sand);
    border-color: var(--border-color);
  }

  .container {
    max-width: 1480px;
    width: 100%;
    margin: 0 auto;
    padding: 20px 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 7px 14px;
    border-radius: var(--radius-md);
    font-size: 0.82rem;
    font-weight: 600;
    font-family: var(--font-sans);
    cursor: pointer;
    border: 1px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-primary);
    transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease;
    user-select: none;
    white-space: nowrap;
  }
  .btn:hover {
    background: var(--bg-card-hover);
    border-color: var(--text-secondary);
  }
  .btn:focus-visible {
    outline: 2px solid var(--border-focus);
    outline-offset: 1px;
  }
  /* Warm Sand Primary CTA */
  .btn-primary, .btn-blue {
    background: var(--accent-sand);
    color: var(--accent-sand-text);
    border-color: var(--accent-sand);
    font-weight: 700;
  }
  .btn-primary:hover, .btn-blue:hover {
    background: var(--accent-sand-hover);
    border-color: var(--accent-sand-hover);
    color: var(--accent-sand-text);
  }
  /* Secondary Neutral */
  .btn-secondary, .btn-purple {
    background: var(--bg-elevated);
    color: var(--text-primary);
    border-color: var(--border-color);
  }
  .btn-secondary:hover, .btn-purple:hover {
    background: #363D49;
    border-color: var(--text-secondary);
  }
  /* Warm Ochre / Gold */
  .btn-gold, .btn-secret {
    background: var(--accent-amber-bg);
    color: #E2B86B;
    border-color: #6B532B;
  }
  .btn-gold:hover, .btn-secret:hover {
    background: #382E1E;
    border-color: var(--accent-amber);
    color: #F2CE8A;
  }
  /* Terracotta Danger */
  .btn-danger {
    background: var(--accent-terra-bg);
    color: #E08268;
    border-color: #6E3829;
  }
  .btn-danger:hover {
    background: #3B241F;
    border-color: var(--accent-terra);
  }
  .btn-sm { padding: 5px 11px; font-size: 0.78rem; border-radius: var(--radius-sm); }

  /* Navigation Tabs */
  .nav-tabs {
    display: flex;
    gap: 4px;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0;
    overflow-x: auto;
  }
  .tab-btn {
    padding: 10px 16px;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    font-size: 0.84rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 2px solid transparent;
    transition: color 0.12s ease, border-color 0.12s ease, background 0.12s ease;
    white-space: nowrap;
  }
  .tab-btn:hover {
    color: var(--text-primary);
    background: rgba(223, 208, 184, 0.03);
  }
  .tab-btn.active {
    color: var(--accent-sand);
    border-bottom-color: var(--accent-sand);
    background: rgba(223, 208, 184, 0.05);
  }
  .tab-badge {
    background: var(--bg-input);
    color: var(--text-secondary);
    padding: 1px 6px;
    border-radius: var(--radius-sm);
    font-size: 0.7rem;
    font-family: var(--font-mono);
    border: 1px solid var(--border-subtle);
  }
  .tab-btn.active .tab-badge {
    background: var(--bg-elevated);
    color: var(--accent-sand);
    border-color: var(--border-color);
  }

  /* Section Panels */
  .section-panel { display: none; flex-direction: column; gap: 16px; }
  .section-panel.active { display: flex; }

  /* Card and Stat Inputs */
  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: border-color 0.12s ease;
  }
  .stat-card:hover { border-color: var(--text-secondary); }
  .stat-title {
    font-weight: 700;
    font-size: 0.82rem;
    color: var(--accent-sand);
    font-family: var(--font-mono);
    letter-spacing: 0.02em;
  }
  .stat-desc { font-size: 0.74rem; color: var(--text-secondary); }
  .stat-input {
    flex: 1;
    padding: 7px 10px;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 0.88rem;
    font-weight: 500;
  }
  .stat-input:focus {
    outline: none;
    border-color: var(--border-focus);
  }

  /* Item / Weapon / Armor Grid */
  .items-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
  }
  .item-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: border-color 0.12s ease;
  }
  .item-card:hover { border-color: var(--text-secondary); }
  .item-card.is-modified {
    border-color: var(--accent-sage);
    background: var(--accent-sage-bg);
  }

  /* Switch Toggle */
  .toggle-switch {
    position: relative;
    width: 40px;
    height: 22px;
    display: inline-block;
    flex-shrink: 0;
  }
  .toggle-switch input { opacity: 0; width: 0; height: 0; }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: var(--bg-input);
    border: 1px solid var(--border-color);
    transition: 0.15s;
    border-radius: 22px;
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
    background-color: var(--text-secondary);
    transition: 0.15s;
    border-radius: 50%;
  }
  input:checked + .slider {
    background-color: var(--accent-sage-bg);
    border-color: var(--accent-sage-bright);
  }
  input:checked + .slider:before {
    transform: translateX(18px);
    background-color: var(--accent-sand);
  }

  /* Revert Icon Button */
  .revert-btn {
    background: transparent;
    border: 1px solid transparent;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 0.85rem;
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    display: none;
  }
  .revert-btn.show {
    display: inline-block;
    color: var(--accent-amber);
    border-color: var(--border-color);
  }
  .revert-btn:hover {
    color: var(--text-primary);
    background: var(--bg-elevated);
  }

  /* ============================================================== */
  /* DATABASE MODDER STUDIO (MASTER - DETAIL 2-COLUMN LAYOUT)       */
  /* ============================================================== */
  #db-modder-screen {
    display: none;
    flex-direction: column;
    gap: 14px;
    width: 100%;
  }
  .db-toolbar {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 12px 18px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }
  .db-layout {
    display: grid;
    grid-template-columns: 330px 1fr;
    gap: 16px;
    min-height: 680px;
  }
  @media (max-width: 920px) {
    .db-layout { grid-template-columns: 1fr; }
  }

  /* Left Master List */
  .db-list-panel {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .db-search-box {
    padding: 12px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-header);
  }
  .db-search-input {
    width: 100%;
    padding: 7px 11px;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-size: 0.84rem;
    font-family: var(--font-sans);
  }
  .db-search-input:focus {
    outline: none;
    border-color: var(--border-focus);
  }

  .db-items-scroll {
    overflow-y: auto;
    flex: 1;
    max-height: calc(100vh - 280px);
  }
  .db-list-row {
    padding: 9px 14px;
    border-bottom: 1px solid var(--border-subtle);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    transition: background 0.1s ease;
  }
  .db-list-row:hover { background: var(--bg-card-hover); }
  .db-list-row.active {
    background: var(--bg-elevated);
    border-left: 3px solid var(--accent-sand);
    padding-left: 11px;
  }
  .db-list-row.is-modified .db-row-name {
    color: var(--accent-sage-bright);
    font-weight: 700;
  }
  .db-row-id {
    font-size: 0.74rem;
    color: var(--text-secondary);
    font-family: var(--font-mono);
    min-width: 30px;
  }
  .db-row-name {
    font-size: 0.84rem;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 185px;
  }

  /* Right Detail Editor */
  .db-detail-panel {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .db-item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
    gap: 14px;
    flex-wrap: wrap;
  }
  .db-item-title-group { display: flex; align-items: center; gap: 12px; flex: 1; }
  .db-icon-box {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-sand);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
  }
  .db-name-input {
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-primary);
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 7px 12px;
    flex: 1;
    min-width: 200px;
  }
  .db-name-input:focus {
    outline: none;
    border-color: var(--border-focus);
  }

  .db-field-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 12px;
  }
  .db-field-box {
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: var(--bg-header);
    padding: 12px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-subtle);
  }
  .db-field-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .db-textarea {
    width: 100%;
    height: 68px;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-size: 0.84rem;
    font-family: var(--font-sans);
    padding: 8px 10px;
    resize: vertical;
  }
  .db-textarea:focus {
    outline: none;
    border-color: var(--border-focus);
  }

  /* Preset Bar */
  .preset-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    background: var(--bg-header);
    padding: 10px 14px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
  }

  /* DB Drop Banner & Category Slots */
  .db-drop-banner {
    background: var(--bg-card);
    border: 1px dashed var(--text-secondary);
    border-radius: var(--radius-lg);
    padding: 14px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
    transition: border-color 0.15s ease, background 0.15s ease;
    cursor: pointer;
  }
  .db-drop-banner:hover, .db-drop-banner.drag-over {
    border-color: var(--accent-sand);
    background: var(--bg-card-hover);
  }
  .db-slot-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    width: 100%;
  }
  @media (max-width: 900px) {
    .db-slot-grid { grid-template-columns: repeat(2, 1fr); }
  }
  .db-cat-btn {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    cursor: pointer;
    transition: background 0.12s ease, border-color 0.12s ease;
    text-align: left;
    color: var(--text-primary);
  }
  .db-cat-btn:hover {
    background: var(--bg-card-hover);
    border-color: var(--text-secondary);
  }
  .db-cat-btn.active {
    background: var(--bg-elevated);
    border-color: var(--accent-sand);
  }
  .db-cat-btn.loaded {
    border-left: 3px solid var(--accent-sage-bright);
  }
  .db-slot-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    font-weight: 600;
    font-size: 0.86rem;
  }
  .db-slot-sub {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    font-size: 0.74rem;
    color: var(--text-secondary);
  }

  .meta-pill {
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    padding: 3px 9px;
    border-radius: var(--radius-sm);
    font-size: 0.74rem;
    font-family: var(--font-mono);
    color: var(--text-secondary);
  }

  /* Toast */
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--bg-elevated);
    color: var(--text-primary);
    border: 1px solid var(--accent-sand);
    padding: 10px 16px;
    border-radius: var(--radius-md);
    font-size: 0.84rem;
    font-weight: 500;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.2s ease, transform 0.2s ease;
    z-index: 1100;
    pointer-events: none;
  }
  .toast.show { opacity: 1; transform: translateY(0); }
  .toast.success { border-color: var(--accent-sage-bright); background: var(--accent-sage-bg); color: var(--text-primary); }
  .toast.warn { border-color: var(--accent-amber); background: var(--accent-amber-bg); }
  .toast.error, .toast.danger { border-color: var(--accent-terra); background: var(--accent-terra-bg); }
</style>
</head>
<body>

<header>
  <div class="logo-wrap">
    <div class="logo-icon" aria-hidden="true" style="padding:2px; background:transparent; border:none;">
      <svg viewBox="0 0 64 64" style="width:100%; height:100%; display:block;">
        <defs>
          <linearGradient id="header-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#242933"/>
            <stop offset="100%" stop-color="#14161B"/>
          </linearGradient>
          <linearGradient id="header-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFF2D6"/>
            <stop offset="40%" stop-color="#E2B86B"/>
            <stop offset="100%" stop-color="#B88028"/>
          </linearGradient>
          <linearGradient id="header-crystal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#C2F0BC"/>
            <stop offset="60%" stop-color="#73A86E"/>
            <stop offset="100%" stop-color="#3B6338"/>
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#header-bg)" stroke="url(#header-gold)" stroke-width="2.5"/>
        <path d="M16 13h24l9 9v27a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V13z" fill="#1C2028" stroke="#444B57" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M22 13h18v12a1 1 0 0 1-1 1H23a1 1 0 0 1-1-1V13z" fill="url(#header-gold)"/>
        <rect x="26" y="16" width="3.5" height="6" rx="1" fill="#14161B"/>
        <polygon points="32,29 42,39 32,49 22,39" fill="url(#header-crystal)" stroke="#A2C79D" stroke-width="1.5" stroke-linejoin="round"/>
        <polygon points="32,32 39,39 32,46 25,39" fill="#E8FCE4" opacity="0.35"/>
        <circle cx="32" cy="39" r="2.2" fill="#FFFFFF"/>
      </svg>
    </div>
    <div>
      <div style="display:flex; align-items:center;">
        <h1 class="brand-title">Save &amp; DB Studio</h1>
        <span class="badge-promax" id="app-badge-mode">SAVE EDITOR</span>
        <span class="badge-offline">CLIENT-SIDE / 100% PRIVATE</span>
      </div>
      <div style="font-size:0.74rem; color:var(--text-secondary);">
        Universal RPG Maker Save Editor &amp; JSON Database Inspector
      </div>
    </div>
  </div>

  <!-- Primary Mode Switcher -->
  <div class="mode-switch-bar" role="tablist" aria-label="Workspace Mode">
    <button class="mode-btn active" id="btn-mode-save" type="button">
      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
      Save Editor
    </button>
    <button class="mode-btn" id="btn-mode-db" type="button">
      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
      Database Modder
    </button>
  </div>

  <!-- Save Editor Header Actions -->
  <div style="display:flex; align-items:center; gap:8px;" id="header-save-actions">
    <button class="btn btn-secondary btn-sm" id="btn-change-file" type="button">
      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
      Open Save
    </button>
    <button class="btn btn-secondary btn-sm" id="btn-clear-save" type="button" title="Close and clear current save file">
      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      Clear File
    </button>
    <button class="btn btn-secondary btn-sm" id="btn-export-json" type="button">Export JSON</button>
    <button class="btn btn-primary btn-sm" id="btn-review-download" type="button">
      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Download Save
    </button>
  </div>

  <!-- Database Modder Header Actions -->
  <div style="display:none; align-items:center; gap:8px;" id="header-db-actions">
    <button class="btn btn-secondary btn-sm" id="btn-open-db-file" type="button">
      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
      Open JSON File(s)
    </button>
    <button class="btn btn-secondary btn-sm" id="btn-clear-db-header" type="button" title="Clear all loaded database files">
      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      Clear Files
    </button>
    <button class="btn btn-primary btn-sm" id="btn-db-download" type="button">
      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Download .json
    </button>
  </div>
</header>

<div class="container">

  <!-- ========================================================= -->
  <!-- 1. WELCOME / DROPZONE SCREEN                             -->
  <!-- ========================================================= -->
  <div id="upload-section" style="display:flex; flex-direction:column; align-items:center; margin:32px auto; max-width:860px; width:100%; text-align:center;">
    <div style="width:100%; border:1px dashed var(--text-secondary); border-radius:var(--radius-lg); background:var(--bg-card); padding:48px 32px; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:14px; transition:border-color 0.15s ease;" id="dropzone">
      <div style="color:var(--accent-sand);" aria-hidden="true">
        <svg class="ico ico-xl" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      </div>
      <div style="font-size:1.2rem; font-weight:600; color:var(--text-primary); letter-spacing:-0.01em;">
        Drop a Save File or Database JSON to begin
      </div>
      <div style="color:var(--text-secondary); font-size:0.85rem; max-width:620px; line-height:1.6;">
        Supports <b>Save Files</b> (<code>.rmmzsave</code>, <code>.rpgsave</code>, <code>.rvdata2</code>, <code>.rvdata</code>, <code>.rxdata</code>, <code>.sav</code>) and <b>Database JSON</b> (<code>Weapons.json</code>, <code>Armors.json</code>, <code>Items.json</code>, <code>Skills.json</code>)
      </div>
      <input type="file" id="file-input" multiple style="display:none;">
      <div style="display:flex; gap:10px; margin-top:8px; flex-wrap:wrap; justify-content:center;">
        <button class="btn btn-primary" type="button" onclick="document.getElementById('file-input').click()">Select Save File</button>
        <button class="btn btn-secondary" type="button" id="btn-quick-open-db">Open Database JSON (data/*.json)</button>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:14px; width:100%; margin-top:24px; text-align:left;">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:16px; border-radius:var(--radius-md);">
        <div style="font-weight:600; color:var(--accent-sand); margin-bottom:6px; font-size:0.88rem;">Multi-Engine Save Support</div>
        <p style="color:var(--text-secondary); font-size:0.8rem; line-height:1.5;">Read and write RPG Maker MZ, MV, VX Ace, VX, and XP files directly in your browser without uploading data.</p>
      </div>
      <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:16px; border-radius:var(--radius-md);">
        <div style="font-weight:600; color:var(--accent-sand); margin-bottom:6px; font-size:0.88rem;">Database Batch Modding</div>
        <p style="color:var(--text-secondary); font-size:0.8rem; line-height:1.5;">Load multiple JSON tables at once. Edit parameters, recovery rates, skill costs, and item consumption rules.</p>
      </div>
      <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:16px; border-radius:var(--radius-md);">
        <div style="font-weight:600; color:var(--accent-sand); margin-bottom:6px; font-size:0.88rem;">Non-Destructive Workflow</div>
        <p style="color:var(--text-secondary); font-size:0.8rem; line-height:1.5;">Revert individual records or entire tables to their original state at any time before exporting.</p>
      </div>
    </div>
  </div>

  <!-- ========================================================= -->
  <!-- 2. GAME SAVE EDITOR SCREEN                                -->
  <!-- ========================================================= -->
  <div id="save-editor-screen" style="display:none; flex-direction:column; gap:16px; width:100%;">
    <!-- Top Quick Bar -->
    <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:12px 18px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px;">
      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
        <span style="font-weight:600; font-size:0.98rem; color:var(--text-primary); font-family:var(--font-mono);" id="label-filename">savegame.rpgsave</span>
        <span class="meta-pill" id="label-format">FORMAT</span>
        <span class="meta-pill" id="label-size">0 KB</span>
        <span class="meta-pill" style="color:var(--accent-sage-bright); border-color:var(--accent-sage);" id="label-changes">0 CHANGES</span>
      </div>

      <!-- Quick Gold Edit & Max Preset -->
      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <div style="background:var(--bg-header); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:5px 12px; display:flex; align-items:center; gap:8px;">
          <span style="font-weight:600; color:var(--accent-sand); font-size:0.82rem; text-transform:uppercase; letter-spacing:0.03em;">Gold</span>
          <input type="number" style="background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-family:var(--font-mono); font-size:0.9rem; font-weight:600; width:115px; padding:4px 8px;" id="quick-gold-input" value="0" aria-label="Party Gold">
          <button class="revert-btn" id="gold-revert-btn" title="Revert Gold to original value" type="button">Revert</button>
          <button class="btn btn-secondary btn-sm" id="btn-gold-add-10k" type="button">+10K</button>
          <button class="btn btn-secondary btn-sm" id="btn-gold-add-100k" type="button">+100K</button>
          <button class="btn btn-gold btn-sm" id="btn-gold-max" type="button">Max 9.9M</button>
        </div>
        <button class="btn btn-secret btn-sm" id="btn-secret-godmode" type="button" title="Max Gold (9.9M), Full HP/MP, All Stats 9999, and 99x Owned Items (Shortcut: Ctrl+Shift+G)">
          Max All Party &amp; Inventory
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="nav-tabs" id="main-nav-tabs" role="tablist">
      <button class="tab-btn active" data-tab="tab-characters" type="button">Characters <span class="tab-badge" id="badge-char-count">0</span></button>
      <button class="tab-btn" data-tab="tab-inventory" type="button">Inventory <span class="tab-badge" id="badge-item-count">0</span></button>
      <button class="tab-btn" data-tab="tab-weapons" type="button">Weapons <span class="tab-badge" id="badge-weapon-count">0</span></button>
      <button class="tab-btn" data-tab="tab-armors" type="button">Armors <span class="tab-badge" id="badge-armor-count">0</span></button>
      <button class="tab-btn" data-tab="tab-variables" type="button">Variables <span class="tab-badge" id="badge-var-count">0</span></button>
      <button class="tab-btn" data-tab="tab-switches" type="button">Switches <span class="tab-badge" id="badge-switch-count">0</span></button>
      <button class="tab-btn" data-tab="tab-datafiles" type="button">Data Files (.json)</button>
      <button class="tab-btn" data-tab="tab-raw" type="button">Raw Tree</button>
    </div>

    <!-- TAB 1: CHARACTERS -->
    <div class="section-panel active" id="tab-characters">
      <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap; background:var(--bg-card); padding:12px 16px; border-radius:var(--radius-md); border:1px solid var(--border-color);">
        <label for="char-dropdown" style="font-weight:600; color:var(--text-secondary); font-size:0.82rem; text-transform:uppercase; letter-spacing:0.03em;">Character</label>
        <select class="char-select" id="char-dropdown" style="padding:6px 12px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.88rem; font-weight:500; min-width:250px;"></select>
        <div style="display:flex; gap:8px; margin-left:auto;">
          <button class="btn btn-secondary btn-sm" id="btn-char-full-heal" type="button">Full Restore (HP/MP)</button>
          <button class="btn btn-gold btn-sm" id="btn-char-max-stats" type="button">Max All Stats (9999)</button>
        </div>
      </div>
      <div class="stats-grid" id="char-stats-container" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px;"></div>
    </div>

    <!-- TAB 2: INVENTORY -->
    <div class="section-panel" id="tab-inventory">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:12px 16px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px;">
        <div style="flex:1; min-width:240px;">
          <input type="text" id="inventory-search" placeholder="Filter by item ID or name..." style="width:100%; padding:7px 11px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.84rem;">
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <label style="font-size:0.82rem; color:var(--text-secondary); cursor:pointer; display:flex; align-items:center; gap:6px;">
            <input type="checkbox" id="inventory-owned-only" checked> Owned only (&gt;0)
          </label>
          <button class="btn btn-secondary btn-sm" id="btn-items-set-all-99" type="button">Set All Owned to 99</button>
          <button class="btn btn-primary btn-sm" id="btn-add-item-dialog" type="button">+ Add Item ID</button>
        </div>
      </div>
      <div class="items-card-grid" id="inventory-cards-container"></div>
    </div>

    <!-- TAB 3: WEAPONS -->
    <div class="section-panel" id="tab-weapons">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:12px 16px; display:flex; justify-content:space-between; gap:12px;">
        <input type="text" id="weapons-search" placeholder="Filter by weapon ID or name..." style="flex:1; padding:7px 11px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.84rem;">
        <button class="btn btn-primary btn-sm" id="btn-add-weapon-dialog" type="button">+ Add Weapon ID</button>
      </div>
      <div class="items-card-grid" id="weapons-cards-container"></div>
    </div>

    <!-- TAB 4: ARMORS -->
    <div class="section-panel" id="tab-armors">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:12px 16px; display:flex; justify-content:space-between; gap:12px;">
        <input type="text" id="armors-search" placeholder="Filter by armor ID or name..." style="flex:1; padding:7px 11px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.84rem;">
        <button class="btn btn-primary btn-sm" id="btn-add-armor-dialog" type="button">+ Add Armor ID</button>
      </div>
      <div class="items-card-grid" id="armors-cards-container"></div>
    </div>

    <!-- TAB 5: VARIABLES -->
    <div class="section-panel" id="tab-variables">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:12px 16px; display:flex; justify-content:space-between; align-items:center; gap:12px;">
        <input type="text" id="variables-search" placeholder="Filter by variable ID, name, or value..." style="flex:1; padding:7px 11px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.84rem;">
        <label style="font-size:0.82rem; color:var(--text-secondary); cursor:pointer; display:flex; align-items:center; gap:6px;">
          <input type="checkbox" id="vars-nonzero-only" checked> Non-zero only
        </label>
      </div>
      <div class="items-card-grid" id="variables-cards-container"></div>
    </div>

    <!-- TAB 6: SWITCHES -->
    <div class="section-panel" id="tab-switches">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:12px 16px; display:flex; justify-content:space-between; gap:12px;">
        <input type="text" id="switches-search" placeholder="Filter by switch ID or name..." style="flex:1; padding:7px 11px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.84rem;">
        <select id="switches-filter" style="padding:6px 12px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.84rem;">
          <option value="all">All Switches</option>
          <option value="on">ON Only</option>
          <option value="off">OFF Only</option>
        </select>
      </div>
      <div class="items-card-grid" id="switches-cards-container"></div>
    </div>

    <!-- TAB 7: DATA FILES -->
    <div class="section-panel" id="tab-datafiles">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:24px;">
        <h3 style="font-size:1rem; color:var(--text-primary); margin-bottom:6px; font-weight:600;">Load Game Reference Data (Optional)</h3>
        <p style="color:var(--text-secondary); font-size:0.84rem; margin-bottom:16px;">
          Drop <code>Items.json</code>, <code>Weapons.json</code>, <code>Armors.json</code>, or <code>System.json</code> to resolve raw IDs into readable names across all tabs.
        </p>
        <div style="border:1px dashed var(--text-secondary); border-radius:var(--radius-md); padding:32px; text-align:center; cursor:pointer; background:var(--bg-header);" id="data-dropzone">
          <div style="color:var(--accent-sand); margin-bottom:8px;" aria-hidden="true">
            <svg class="ico ico-lg" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div style="font-weight:600; color:var(--text-primary); font-size:0.88rem;">Drop JSON reference files here or click to browse</div>
          <input type="file" id="data-file-input" multiple accept=".json" style="display:none;">
        </div>
      </div>
    </div>

    <!-- TAB 8: RAW TREE -->
    <div class="section-panel" id="tab-raw">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); overflow:hidden;">
        <table style="width:100%; border-collapse:collapse; font-size:0.82rem;">
          <thead>
            <tr style="background:var(--bg-header); text-align:left; color:var(--text-secondary); border-bottom:1px solid var(--border-color);">
              <th style="padding:10px 14px; width:35%;">Property Path</th>
              <th style="padding:10px 14px; width:10%;">Type</th>
              <th style="padding:10px 14px; width:25%;">Original</th>
              <th style="padding:10px 14px; width:25%;">Current Value</th>
              <th style="padding:10px 14px; width:5%;">Reset</th>
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
    <!-- Top Multi-File Drop Guide -->
    <div class="db-drop-banner" id="db-drop-banner">
      <div style="display:flex; align-items:center; gap:14px;">
        <div style="color:var(--accent-sand); display:flex; align-items:center;" aria-hidden="true">
          <svg class="ico ico-lg" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div>
          <div style="font-weight:600; font-size:0.92rem; color:var(--text-primary);">Drop Database JSON files here (Multi-file supported)</div>
          <div style="font-size:0.78rem; color:var(--text-secondary);">
            Locate files in your game's <code>data/</code> or <code>www/data/</code> folder (<code>Weapons.json</code>, <code>Armors.json</code>, <code>Items.json</code>, <code>Skills.json</code>) and drop them together.
          </div>
        </div>
      </div>
      <input type="file" id="db-multi-file-input" multiple accept=".json" style="display:none;">
      <div style="display:flex; gap:8px;">
        <button class="btn btn-secondary btn-sm" id="btn-db-browse-multi" type="button">Select JSON Files</button>
        <button class="btn btn-secondary btn-sm" id="btn-db-clear-all" type="button" title="Clear all loaded database files">Clear All Files</button>
      </div>
    </div>

    <!-- 4 Category Status Cards -->
    <div class="db-slot-grid">
      <button class="db-cat-btn active" data-cat="weapons" id="slot-btn-weapons" type="button">
        <div class="db-slot-top">
          <span>Weapons</span>
          <span style="font-size:0.72rem; font-family:var(--font-mono); color:var(--text-secondary);">Weapons.json</span>
        </div>
        <div class="db-slot-sub">
          <span id="db-slot-status-weapons">Not loaded</span>
          <span id="db-slot-mod-weapons" style="color:var(--accent-sage-bright); font-weight:600; font-family:var(--font-mono);"></span>
        </div>
      </button>

      <button class="db-cat-btn" data-cat="armors" id="slot-btn-armors" type="button">
        <div class="db-slot-top">
          <span>Armors</span>
          <span style="font-size:0.72rem; font-family:var(--font-mono); color:var(--text-secondary);">Armors.json</span>
        </div>
        <div class="db-slot-sub">
          <span id="db-slot-status-armors">Not loaded</span>
          <span id="db-slot-mod-armors" style="color:var(--accent-sage-bright); font-weight:600; font-family:var(--font-mono);"></span>
        </div>
      </button>

      <button class="db-cat-btn" data-cat="items" id="slot-btn-items" type="button">
        <div class="db-slot-top">
          <span>Items</span>
          <span style="font-size:0.72rem; font-family:var(--font-mono); color:var(--text-secondary);">Items.json</span>
        </div>
        <div class="db-slot-sub">
          <span id="db-slot-status-items">Not loaded</span>
          <span id="db-slot-mod-items" style="color:var(--accent-sage-bright); font-weight:600; font-family:var(--font-mono);"></span>
        </div>
      </button>

      <button class="db-cat-btn" data-cat="skills" id="slot-btn-skills" type="button">
        <div class="db-slot-top">
          <span>Skills</span>
          <span style="font-size:0.72rem; font-family:var(--font-mono); color:var(--text-secondary);">Skills.json</span>
        </div>
        <div class="db-slot-sub">
          <span id="db-slot-status-skills">Not loaded</span>
          <span id="db-slot-mod-skills" style="color:var(--accent-sage-bright); font-weight:600; font-family:var(--font-mono);"></span>
        </div>
      </button>
    </div>

    <!-- Active Category Toolbar & Bulk Actions -->
    <div class="db-toolbar">
      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <span style="font-size:0.92rem; font-weight:700; color:var(--accent-sand); letter-spacing:0.03em; text-transform:uppercase;" id="db-label-type">WEAPONS DATABASE</span>
        <span class="meta-pill" style="color:var(--text-primary);" id="db-label-filename">Weapons.json</span>
        <span class="meta-pill" id="db-label-count">0 ITEMS</span>
        <span class="meta-pill" style="color:var(--accent-sage-bright); border-color:var(--accent-sage); display:none;" id="db-label-modified">0 MODIFIED</span>
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
          <input type="text" class="db-search-input" id="db-search-input" placeholder="Search by ID, name, or description...">
          <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.75rem; color:var(--text-secondary);">
            <label style="cursor:pointer; display:flex; align-items:center; gap:6px;">
              <input type="checkbox" id="db-filter-modified"> Modified only
            </label>
            <span id="db-list-showing-label" style="font-family:var(--font-mono);">0 entries</span>
          </div>
        </div>
        <div class="db-items-scroll" id="db-items-list-container">
          <!-- Dynamically populated list rows -->
        </div>
      </div>

      <!-- Right Detail Panel -->
      <div class="db-detail-panel" id="db-detail-container">
        <div style="text-align:center; padding:64px 20px; color:var(--text-secondary);">
          <div style="font-size:1rem; font-weight:600; color:var(--text-primary);">No Database Loaded</div>
          <div style="font-size:0.82rem; margin-top:6px;">Drop <code>Weapons.json</code>, <code>Armors.json</code>, <code>Items.json</code>, or <code>Skills.json</code> from your game's <code>data/</code> directory.</div>
        </div>
      </div>
    </div>
  </div>

</div>

<!-- DIFF MODAL -->
<div class="modal-overlay" id="diff-modal" style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(15,17,21,0.8); display:none; align-items:center; justify-content:center; z-index:1000;">
  <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg); max-width:860px; width:90%; max-height:85vh; display:flex; flex-direction:column; overflow:hidden;">
    <div style="padding:14px 20px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
      <span style="font-weight:600; color:var(--text-primary);">Review Changes Before Saving</span>
      <button class="btn btn-secondary btn-sm" id="btn-close-modal" type="button">&times;</button>
    </div>
    <div style="padding:18px 20px; overflow-y:auto; flex:1;" id="diff-content"></div>
    <div style="padding:12px 20px; border-top:1px solid var(--border-color); display:flex; justify-content:space-between; background:var(--bg-header);">
      <button class="btn btn-secondary" id="btn-modal-bak" type="button">Download Backup (.bak)</button>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-secondary" id="btn-modal-cancel" type="button">Keep Editing</button>
        <button class="btn btn-primary" id="btn-modal-download" type="button">Download Edited File</button>
      </div>
    </div>
  </div>
</div>

<div class="toast" id="toast" role="status" aria-live="polite">Notification</div>

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
    category: 'weapons',
    fileName: 'Weapons.json',
    fileHandle: null,
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
  dropzone.ondragover = (e) => { e.preventDefault(); dropzone.style.borderColor = 'var(--accent-sand)'; };
  dropzone.ondragleave = () => { dropzone.style.borderColor = 'var(--text-secondary)'; };
  dropzone.ondrop = (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--text-secondary)';
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

    const jsonFiles = files.filter(f => f.name.toLowerCase().endsWith('.json') && (isDatabaseJsonFilename(f.name) || currentAppMode === 'database' || files.length > 1));
    if (jsonFiles.length > 0) {
      jsonFiles.forEach((f, idx) => loadDatabaseFile(f, null, idx === 0));
      return;
    }

    loadSaveFile(files[0]);
  }

  // -------------------------------------------------------------
  // DATABASE MODDER LOGIC
  // -------------------------------------------------------------
  function detectDbCategory(fileName, jsonArr) {
    const baseName = fileName.replace(/\\.json$/i, '').toLowerCase();
    if (baseName.includes('weapon')) return 'weapons';
    if (baseName.includes('armor')) return 'armors';
    if (baseName.includes('item')) return 'items';
    if (baseName.includes('skill')) return 'skills';
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
      showToast('File exceeds the 50MB safety limit.', 'danger');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result);

        if (!Array.isArray(json) && json && typeof json === 'object') {
          if (Array.isArray(json.variables)) json.variables.forEach((n, i) => { if (n) gameData.variables[i] = n; });
          if (Array.isArray(json.switches)) json.switches.forEach((n, i) => { if (n) gameData.switches[i] = n; });
          showToast(\`Loaded Variable/Switch names from \${file.name}\`, 'success');
          return;
        }

        if (!Array.isArray(json)) throw new Error('Database file (.json) must be a valid RPG Maker JSON array.');

        const cat = detectDbCategory(file.name, json);
        const validItems = json.filter(x => x && x.id);

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
        showToast(\`Loaded \${file.name} (\${validItems.length} entries)\`, 'success');
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

  function clearDatabaseCategory(cat) {
    if (!cat) cat = currentDb.category;
    if (!dbStore[cat] && (!currentDb.items || currentDb.items.length === 0)) return;
    dbStore[cat] = null;
    if (gameData && gameData[cat]) gameData[cat] = {};
    syncCurrentDbFromStore(cat);
    updateDbCategoryButtons(cat);
    updateDbSlotBadges();
    renderDbBulkActions();
    renderDbMasterList();
    if (dbMultiFileInput) dbMultiFileInput.value = '';
    showToast(\`Cleared \${cat.charAt(0).toUpperCase() + cat.slice(1)} database file.\`, 'info');
  }

  function clearAllDatabaseFiles() {
    const loaded = ['weapons', 'armors', 'items', 'skills'].some(c => dbStore[c] && dbStore[c].items && dbStore[c].items.length > 0);
    if (!loaded) {
      showToast('No database files are currently loaded.', 'info');
      return;
    }
    ['weapons', 'armors', 'items', 'skills'].forEach(c => {
      dbStore[c] = null;
      if (gameData && gameData[c]) gameData[c] = {};
    });
    syncCurrentDbFromStore(currentDb.category);
    updateDbCategoryButtons(currentDb.category);
    updateDbSlotBadges();
    renderDbBulkActions();
    renderDbMasterList();
    if (dbMultiFileInput) dbMultiFileInput.value = '';
    showToast('All database files cleared.', 'info');
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
        statusEl.innerHTML = \`Loaded: <b>\${count}</b> entries\`;
        statusEl.style.color = 'var(--accent-sage-bright)';
        modEl.textContent = store.modifiedIds.size > 0 ? \`\${store.modifiedIds.size} edited\` : '';
      } else {
        slotBtn.classList.remove('loaded');
        statusEl.textContent = 'Not loaded (click or drop)';
        statusEl.style.color = 'var(--text-secondary)';
        modEl.textContent = '';
      }
    });

    const modBadge = document.getElementById('db-label-modified');
    if (modBadge) {
      const modCount = currentDb.modifiedIds ? currentDb.modifiedIds.size : 0;
      modBadge.style.display = modCount > 0 ? 'inline-block' : 'none';
      modBadge.textContent = \`\${modCount} MODIFIED\`;
    }
  }

  function updateDbCategoryButtons(cat) {
    document.querySelectorAll('.db-cat-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cat') === cat);
    });
    document.getElementById('db-label-filename').textContent = currentDb.fileName;
    const catTitles = {
      weapons: 'WEAPONS DATABASE',
      armors: 'ARMORS DATABASE',
      items: 'ITEMS DATABASE',
      skills: 'SKILLS DATABASE'
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
    let buttonsHtml = \`<span style="font-size:0.75rem; color:var(--text-secondary); font-weight:600; text-transform:uppercase; letter-spacing:0.03em;">Batch Actions:</span>\`;
    if (cat === 'weapons' || cat === 'armors') {
      buttonsHtml += \`
        <button class="btn btn-gold btn-sm" id="btn-bulk-god-all" type="button">\${cat==='weapons'?'All ATK/MAT 9999':'All DEF/MDF 9999'}</button>
        <button class="btn btn-secondary btn-sm" id="btn-bulk-free-all" type="button">All Price 0</button>
      \`;
    } else if (cat === 'items') {
      buttonsHtml += \`
        <button class="btn btn-primary btn-sm" id="btn-bulk-infinite-all" type="button">All Non-Consumable</button>
        <button class="btn btn-secondary btn-sm" id="btn-bulk-free-all" type="button">All Price 0</button>
        <button class="btn btn-secondary btn-sm" id="btn-bulk-zero-weight-all" type="button">All Zero Weight [0W]</button>
      \`;
    } else if (cat === 'skills') {
      buttonsHtml += \`
        <button class="btn btn-primary btn-sm" id="btn-bulk-free-mp-all" type="button">All 0 MP/TP Cost</button>
      \`;
    }
    buttonsHtml += \`
      <button class="btn btn-secret btn-sm" id="btn-secret-db-god" type="button" title="Apply max parameters and zero cost across this entire table">Max Table Preset</button>
      <button class="btn btn-secondary btn-sm" id="btn-bulk-revert-all" type="button" title="Restore all entries in this file to original values">Revert File</button>
      <button class="btn btn-secondary btn-sm" id="btn-bulk-clear-file" type="button" title="Clear this database file">Clear File</button>
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
        finishBulkAction('Applied Max Table Preset to all entries.');
      };
    }

    const btnBulkFree = document.getElementById('btn-bulk-free-all');
    if (btnBulkFree) {
      btnBulkFree.onclick = () => {
        currentDb.items.filter(x => x && x.id).forEach(it => { if (it.price !== undefined) { it.price = 0; currentDb.modifiedIds.add(it.id); } });
        finishBulkAction('Set price to 0 for all entries.');
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
        finishBulkAction('Set primary combat stats to 9999 for all entries.');
      };
    }
    const btnBulkInf = document.getElementById('btn-bulk-infinite-all');
    if (btnBulkInf) {
      btnBulkInf.onclick = () => {
        currentDb.items.filter(x => x && x.id).forEach(it => {
          if (it.consumable) { it.consumable = false; currentDb.modifiedIds.add(it.id); }
        });
        finishBulkAction('Set all items to non-consumable (infinite use).');
      };
    }
    const btnBulkWeight = document.getElementById('btn-bulk-zero-weight-all');
    if (btnBulkWeight) {
      btnBulkWeight.onclick = () => {
        currentDb.items.filter(x => x && x.id).forEach(it => {
          if (zeroItemWeight(it)) currentDb.modifiedIds.add(it.id);
        });
        finishBulkAction('Set weight tags to 0W across all items.');
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
        finishBulkAction('Set MP and TP cost to 0 for all skills.');
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
        showToast('Reverted all entries in file to original state.', 'info');
      };
    }
    const btnBulkClear = document.getElementById('btn-bulk-clear-file');
    if (btnBulkClear) {
      btnBulkClear.onclick = () => clearDatabaseCategory(cat);
    }
  }

  function zeroItemWeight(item) {
    let changed = false;
    if (typeof item.description === 'string' && /weight\\s*:\\s*\\d+/i.test(item.description)) {
      item.description = item.description.replace(/(weight\\s*:\\s*)\\d+(\\s*w?)/gi, '$10$2');
      changed = true;
    }
    if (typeof item.note === 'string' && /weight\\s*:\\s*\\d+/i.test(item.note)) {
      item.note = item.note.replace(/(weight\\s*:\\s*)\\d+(\\s*w?)/gi, '$10$2');
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

    if (validItems.length === 0) {
      if (showingLabel) showingLabel.textContent = 'Not loaded';
      container.innerHTML = \`
        <div style="padding:36px 20px; text-align:center; color:var(--text-secondary);">
          <div style="font-weight:600; color:var(--text-primary); margin-bottom:6px; font-size:0.88rem;">\${currentDb.fileName} is not loaded</div>
          <div style="font-size:0.78rem; margin-bottom:14px; line-height:1.5;">Drop <b>\${currentDb.fileName}</b> from your game's <code>data/</code> folder or select it below.</div>
          <button class="btn btn-secondary btn-sm" id="btn-empty-load-cat" type="button">Select \${currentDb.fileName}</button>
        </div>
      \`;
      if (detailContainer) {
        detailContainer.innerHTML = \`
          <div style="text-align:center; padding:64px 24px; color:var(--text-secondary); border:1px dashed var(--border-color); border-radius:var(--radius-md); margin:auto 0;">
            <div style="font-size:1.05rem; font-weight:600; color:var(--text-primary);">No \${currentDb.fileName} File Loaded</div>
            <div style="font-size:0.84rem; margin-top:6px; color:var(--text-secondary); line-height:1.6;">
              Drop <code>Weapons.json</code>, <code>Armors.json</code>, <code>Items.json</code>, and <code>Skills.json</code><br>
              from your game's <code>data/</code> folder all at once.
            </div>
            <button class="btn btn-primary" style="margin-top:16px;" id="btn-detail-empty-browse" type="button">Browse JSON File(s)</button>
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
      const name = item.name || '(Unnamed)';
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
        <span style="font-size:0.74rem; color:var(--text-secondary); font-family:var(--font-mono); white-space:nowrap;">\${getQuickPreviewBadge(item)}</span>
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

    if (showingLabel) showingLabel.textContent = \`Showing \${shownCount} / \${validItems.length}\`;

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
      const inf = item.consumable === false ? 'INF · ' : '';
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
        'MHP (Max HP)', 'MMP (Max MP)', 'ATK (Attack)', 'DEF (Defense)',
        'MAT (Magic Attack)', 'MDF (Magic Defense)', 'AGI (Agility)', 'LUK (Luck)'
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
          <span style="font-weight:600; color:var(--text-secondary); font-size:0.76rem; text-transform:uppercase; letter-spacing:0.03em;">Quick Presets:</span>
          <button class="btn btn-gold btn-sm" id="btn-db-god-weapon" type="button">\${cat==='weapons'?'Max Weapon (ATK/MAT 9999)':'Max Armor (DEF 9999 / MHP 99999)'}</button>
          <button class="btn btn-secondary btn-sm" id="btn-db-free-price" type="button">Price 0 G</button>
          <button class="btn btn-secondary btn-sm" id="btn-db-zero-weight" type="button">Zero Weight [0W]</button>
        </div>

        <div style="font-size:0.78rem; font-weight:600; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.04em; margin-top:4px;">Equipment Parameters</div>
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
          <span style="font-weight:600; color:var(--text-secondary); font-size:0.76rem; text-transform:uppercase; letter-spacing:0.03em;">Quick Presets:</span>
          <button class="btn btn-primary btn-sm" id="btn-db-make-infinite" type="button">Non-Consumable (Infinite)</button>
          <button class="btn btn-secondary btn-sm" id="btn-db-free-price" type="button">Price 0 G</button>
          <button class="btn btn-gold btn-sm" id="btn-db-full-heal-item" type="button">Full HP/MP Recovery (100%)</button>
          <button class="btn btn-secondary btn-sm" id="btn-db-max-tp-item" type="button">+100 TP/AP Gain</button>
          <button class="btn btn-secondary btn-sm" id="btn-db-zero-weight" type="button">Zero Weight [0W]</button>
        </div>

        <div class="db-field-grid">
          <div class="db-field-box">
            <span class="db-field-label">Consumable</span>
            <div style="display:flex; align-items:center; gap:10px; margin-top:4px;">
              <label class="toggle-switch">
                <input type="checkbox" id="item-consumable" \${item.consumable?'checked':''}>
                <span class="slider"></span>
              </label>
              <span style="font-size:0.8rem; color:\${item.consumable ? 'var(--text-secondary)' : 'var(--accent-sage-bright); font-weight:600'};">
                \${item.consumable ? 'Yes (Depletes on use)' : 'No (Infinite use)'}
              </span>
            </div>
          </div>

          <div class="db-field-box">
            <span class="db-field-label">Target Scope</span>
            <select id="item-scope" class="stat-input" style="font-size:0.84rem; padding:6px;">
              <option value="1" \${item.scope===1?'selected':''}>One Enemy</option>
              <option value="2" \${item.scope===2?'selected':''}>All Enemies</option>
              <option value="7" \${item.scope===7?'selected':''}>One Ally</option>
              <option value="8" \${item.scope===8?'selected':''}>All Allies (Party)</option>
              <option value="9" \${item.scope===9?'selected':''}>One Dead Ally (Revive)</option>
              <option value="11" \${item.scope===11?'selected':''}>The User</option>
              <option value="0" \${item.scope===0?'selected':''}>None</option>
            </select>
          </div>

          <div class="db-field-box">
            <span class="db-field-label">Repeats</span>
            <input type="number" class="stat-input" id="item-repeats" value="\${item.repeats || 1}" min="1" max="99">
          </div>

          <div class="db-field-box">
            <span class="db-field-label">TP Gain on Use</span>
            <input type="number" class="stat-input" id="item-tp-gain" value="\${item.tpGain || 0}">
          </div>
        </div>

        <div style="font-size:0.78rem; font-weight:600; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.04em; margin-top:4px;">Recovery &amp; Formula Effects</div>
        <div class="db-field-grid">
          <div class="db-field-box">
            <span class="db-field-label">HP Recovery (%) + Flat</span>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="number" class="stat-input" id="item-eff-hp-pct" value="\${hpPct}" placeholder="%" title="HP Recovery Percentage" style="width:50%;">
              <span style="color:var(--text-secondary); font-size:0.78rem;">% +</span>
              <input type="number" class="stat-input" id="item-eff-hp-flat" value="\${hpFlat}" placeholder="Flat" title="Flat HP Recovery" style="width:50%;">
            </div>
          </div>

          <div class="db-field-box">
            <span class="db-field-label">MP Recovery (%) + Flat</span>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="number" class="stat-input" id="item-eff-mp-pct" value="\${mpPct}" placeholder="%" title="MP Recovery Percentage" style="width:50%;">
              <span style="color:var(--text-secondary); font-size:0.78rem;">% +</span>
              <input type="number" class="stat-input" id="item-eff-mp-flat" value="\${mpFlat}" placeholder="Flat" title="Flat MP Recovery" style="width:50%;">
            </div>
          </div>

          <div class="db-field-box">
            <span class="db-field-label">Effect TP Gain</span>
            <input type="number" class="stat-input" id="item-eff-tp" value="\${tpEff}">
          </div>

          <div class="db-field-box">
            <span class="db-field-label">Damage / Recovery Formula</span>
            <input type="text" class="stat-input" id="item-formula" value="\${dmg.formula || '0'}" placeholder="e.g. 200 + b.mhp * 0.2">
          </div>
        </div>
      \`;
    } else if (cat === 'skills') {
      const dmg = item.damage || {};
      specificHtml = \`
        <div class="preset-bar">
          <span style="font-weight:600; color:var(--text-secondary); font-size:0.76rem; text-transform:uppercase; letter-spacing:0.03em;">Quick Presets:</span>
          <button class="btn btn-primary btn-sm" id="btn-db-free-mp" type="button">0 MP / 0 TP Cost</button>
          <button class="btn btn-gold btn-sm" id="btn-db-instakill" type="button">99,999 Damage Formula</button>
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
            <span class="db-field-label">Allow Critical Hits</span>
            <label class="toggle-switch" style="margin-top:4px;">
              <input type="checkbox" id="skill-critical" \${dmg.critical?'checked':''}>
              <span class="slider"></span>
            </label>
          </div>
          <div class="db-field-box">
            <span class="db-field-label">Hit Type</span>
            <select id="skill-hit-type" class="stat-input" style="font-size:0.84rem; padding:6px;">
              <option value="0" \${item.hitType===0?'selected':''}>Certain Hit (100%)</option>
              <option value="1" \${item.hitType===1?'selected':''}>Physical Attack</option>
              <option value="2" \${item.hitType===2?'selected':''}>Magical Attack</option>
            </select>
          </div>
          <div class="db-field-box">
            <span class="db-field-label">Repeats</span>
            <input type="number" class="stat-input" id="skill-repeats" value="\${item.repeats || 1}" min="1" max="99">
          </div>
          <div class="db-field-box">
            <span class="db-field-label">TP Gain</span>
            <input type="number" class="stat-input" id="skill-tp-gain" value="\${item.tpGain || 0}">
          </div>
          <div class="db-field-box" style="grid-column: 1 / -1;">
            <span class="db-field-label">Damage Formula</span>
            <input type="text" class="stat-input" id="skill-formula" value="\${escapeHtml(dmg.formula || '')}" placeholder="e.g. a.atk * 4 - b.def * 2">
          </div>
        </div>
      \`;
    }

    container.innerHTML = \`
      <div class="db-item-header">
        <div class="db-item-title-group">
          <div class="db-icon-box">\${getCategoryIcon(cat)}</div>
          <input type="text" class="db-name-input" id="detail-name" value="\${escapeHtml(item.name || '')}" placeholder="Entry Name">
          <span class="meta-pill" style="color:var(--accent-sand);">ID #\${item.id}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          \${item.price !== undefined ? \`
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:0.78rem; color:var(--text-secondary); font-weight:600; text-transform:uppercase;">Price</span>
              <input type="number" class="stat-input" id="detail-price" value="\${item.price}" style="width:110px; padding:5px 8px;">
            </div>
          \` : ''}
        </div>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:12px;">
        <div class="db-field-box">
          <span class="db-field-label">Description</span>
          <textarea class="db-textarea" id="detail-desc">\${escapeHtml(item.description || '')}</textarea>
        </div>
        <div class="db-field-box">
          <span class="db-field-label">Note Tags (e.g. &lt;Weight: 0&gt;)</span>
          <textarea class="db-textarea" id="detail-note" style="font-family:var(--font-mono);" placeholder="RPG Maker Note tags...">\${escapeHtml(item.note || '')}</textarea>
        </div>
      </div>

      \${specificHtml}

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:16px; border-top:1px solid var(--border-color); flex-wrap:wrap; gap:10px;">
        <button class="btn btn-secondary btn-sm" id="btn-db-revert-item" type="button">Revert Entry (#\${item.id})</button>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary btn-sm" id="btn-detail-save-disk" type="button">Save to Disk</button>
          <button class="btn btn-primary btn-sm" id="btn-detail-download" type="button">Download \${currentDb.fileName}</button>
        </div>
      </div>
    \`;

    bindDetailEvents(item);
  }

  function getCategoryIcon(cat) {
    if (cat === 'weapons') return 'WPN';
    if (cat === 'armors') return 'ARM';
    if (cat === 'items') return 'ITM';
    if (cat === 'skills') return 'SKL';
    return 'DB';
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
    const nameEl = document.getElementById('detail-name');
    if (nameEl) nameEl.onchange = () => { item.name = nameEl.value; markModified(item); renderDbMasterList(); };
    const descEl = document.getElementById('detail-desc');
    if (descEl) descEl.onchange = () => { item.description = descEl.value; markModified(item); };
    const noteEl = document.getElementById('detail-note');
    if (noteEl) noteEl.onchange = () => { item.note = noteEl.value; markModified(item); };
    const priceEl = document.getElementById('detail-price');
    if (priceEl) priceEl.onchange = () => { item.price = parseInt(priceEl.value) || 0; markModified(item); renderDbMasterList(); };

    document.querySelectorAll('.db-stat-input').forEach(inp => {
      inp.onchange = () => {
        const idx = parseInt(inp.getAttribute('data-idx'));
        if (!item.params) item.params = [0,0,0,0,0,0,0,0];
        item.params[idx] = parseInt(inp.value) || 0;
        markModified(item);
        renderDbMasterList();
      };
    });

    const btnGod = document.getElementById('btn-db-god-weapon');
    if (btnGod) {
      btnGod.onclick = () => {
        if (!item.params) item.params = [0,0,0,0,0,0,0,0];
        if (currentDb.category === 'weapons') {
          item.params[2] = 9999;
          item.params[4] = 9999;
        } else {
          item.params[3] = 9999;
          item.params[0] = 99999;
        }
        markModified(item);
        renderDbMasterList();
        renderDbDetail(item);
        showToast('Parameters set to 9999.', 'success');
      };
    }

    const btnFree = document.getElementById('btn-db-free-price');
    if (btnFree) {
      btnFree.onclick = () => {
        item.price = 0;
        markModified(item);
        renderDbMasterList();
        renderDbDetail(item);
        showToast('Price set to 0 G.', 'success');
      };
    }

    const btnZeroWeight = document.getElementById('btn-db-zero-weight');
    if (btnZeroWeight) {
      btnZeroWeight.onclick = () => {
        zeroItemWeight(item);
        markModified(item);
        renderDbDetail(item);
        showToast('Weight set to 0W.', 'success');
      };
    }

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
        showToast('Item set to non-consumable (infinite).', 'success');
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
        showToast('Added 100% HP/MP recovery effect.', 'success');
      };
    }

    const btnMaxTpItem = document.getElementById('btn-db-max-tp-item');
    if (btnMaxTpItem) {
      btnMaxTpItem.onclick = () => {
        item.tpGain = 100;
        setEffectValue(item, 13, 100, 0);
        markModified(item);
        renderDbDetail(item);
        showToast('TP/AP gain set to +100.', 'success');
      };
    }

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
        showToast('Skill cost set to 0 MP / 0 TP.', 'success');
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
        showToast('Damage formula set to 99,999.', 'success');
      };
    }

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
          showToast(\`Reverted entry #\${item.id} to original values.\`, 'info');
        }
      };
    }

    const btnDetDl = document.getElementById('btn-detail-download');
    if (btnDetDl) btnDetDl.onclick = downloadDatabaseFile;
    const btnDetSave = document.getElementById('btn-detail-save-disk');
    if (btnDetSave) btnDetSave.onclick = saveDatabaseToDisk;
  }

  async function saveDatabaseToDisk() {
    if (!currentDb.items || currentDb.items.length === 0) {
      showToast('No database loaded to save.', 'warn');
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
        showToast(\`Saved \${currentDb.fileName} to disk.\`, 'success');
        return;
      }
    } catch(e) {
      if (e.name !== 'AbortError') console.warn(e);
    }
    downloadDatabaseFile();
  }

  function downloadDatabaseFile() {
    if (!currentDb.items || currentDb.items.length === 0) {
      showToast('No database file loaded.', 'warn');
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
    showToast(\`Downloaded \${currentDb.fileName}.\`, 'success');
  }

  const btnDbDl = document.getElementById('btn-db-download');
  if (btnDbDl) btnDbDl.onclick = downloadDatabaseFile;

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
  // SAVE EDITOR LOGIC
  // -------------------------------------------------------------
  async function loadSaveFile(file) {
    if (file && file.size > 50 * 1024 * 1024) {
      showToast('File exceeds the 50MB safety limit.', 'danger');
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
        showToast(\`Loaded \${file.name}\`, 'success');
      } catch(err) {
        alert('Error parsing save file:\\n' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  async function parseSaveData(rawBytes, fileName) {
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    const text = textDecoder.decode(rawBytes).trim();

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

    if (fileName.endsWith('.rpgsave') || /^[A-Za-z0-9+/=]+$/.test(text)) {
      try {
        const decompressed = LZString.decompressFromBase64(text);
        if (decompressed && (decompressed.startsWith('{') || decompressed.startsWith('['))) {
          return { format: 'rpgmaker_lz', formatLabel: 'RPG Maker MV (.rpgsave)', root: JSON.parse(decompressed), engine: 'mv' };
        }
      } catch (e) {}
    }

    if ((text.startsWith('{') && text.endsWith('}')) || (text.startsWith('[') && text.endsWith(']'))) {
      return { format: 'json', formatLabel: 'JSON File', root: JSON.parse(text), engine: 'generic' };
    }

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

    throw new Error('Unrecognized save file format. Supported: RPG Maker (MZ, MV, VX Ace, VX, XP), WOLF RPG (.sav), JSON.');
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
      showToast('+10,000 Gold added.', 'success');
    };
    document.getElementById('btn-gold-add-100k').onclick = () => {
      applyGold((parseInt(goldInput.value, 10) || 0) + 100000, true);
      showToast('+100,000 Gold added.', 'success');
    };
    document.getElementById('btn-gold-max').onclick = () => {
      applyGold(9999999, true);
      showToast('Gold set to 9,999,999.', 'success');
    };
    if (revBtn) {
      revBtn.onclick = () => {
        applyGold(originalGold, true);
        showToast('Gold reverted to ' + originalGold, 'info');
      };
    }

    function triggerSuperGodMode() {
      applyGold(9999999, true);

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

      if (adapt.party) {
        const items = adapt.party['@items'] || adapt.party._items || adapt.party.items || {};
        const weapons = adapt.party['@weapons'] || adapt.party._weapons || adapt.party.weapons || {};
        const armors = adapt.party['@armors'] || adapt.party._armors || adapt.party.armors || {};
        Object.keys(items).forEach(k => { if (items[k] > 0) items[k] = 99; });
        Object.keys(weapons).forEach(k => { if (weapons[k] > 0) weapons[k] = 99; });
        Object.keys(armors).forEach(k => { if (armors[k] > 0) armors[k] = 99; });
      }

      setupVisualEditor();
      markSaveModified('MAX ALL');
      showToast('Applied Max Party & Inventory preset (9.9M Gold, 9999 Stats, 99x Items).', 'success');
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
      <div style="grid-column: 1 / -1; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h3 style="color:var(--accent-sand); margin:0 0 4px 0;">WOLF RPG Editor Save Detected</h3>
          <div style="color:var(--text-secondary); font-size:0.84rem;">File: <b>\${currentFile.name}</b> (\${formatBytes(currentFile.size)}) | Engine: WOLF RPG Editor Pro 3.50+</div>
        </div>

        <div style="background:var(--accent-amber-bg); border-left: 3px solid var(--accent-amber); padding: 14px 18px; border-radius: var(--radius-sm); font-size: 0.86rem; line-height: 1.5; color: var(--text-primary);">
          <b>Important Notice:</b><br>
          WOLF RPG Editor Pro uses proprietary 128-byte block encryption with strict binary checksums. Direct file modification without the game's internal key will corrupt the save file.
        </div>

        <div style="background:var(--bg-header); border: 1px solid var(--border-color); padding: 18px; border-radius: var(--radius-md);">
          <h4 style="color:var(--accent-sand); margin:0 0 10px 0;">Recommended Memory Editing Procedure:</h4>
          <ol style="margin:0; padding-left:20px; color:var(--text-primary); font-size:0.86rem; display:flex; flex-direction:column; gap:6px;">
            <li>Launch <b>GamePro.exe</b> normally.</li>
            <li>Attach <b>Cheat Engine</b> to the <code>GamePro.exe</code> process.</li>
            <li>Set Value Type to <b>4 Bytes</b>, enter your current Gold or HP value, and click <i>First Scan</i>.</li>
            <li>Change the value in-game (spend gold or take damage), enter the updated number, and click <i>Next Scan</i>.</li>
            <li>Modify the matched address to <b>999,999</b> and save inside the game normally.</li>
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
      const name = item.actor._name || item.actor['@name'] || \`Actor #\${item.index}\`;
      const lvl = item.actor._level || item.actor['@level'] || 1;
      opt.textContent = \`#\${item.index} — \${name} (Lv. \${lvl})\`;
      charDropdown.appendChild(opt);
    });

    activeCharacterIndex = validActors[0].index;
    charDropdown.value = activeCharacterIndex;
    charDropdown.onchange = () => {
      activeCharacterIndex = parseInt(charDropdown.value);
      renderCharacterStats(actorsData[activeCharacterIndex]);
    };
    renderCharacterStats(actorsData[activeCharacterIndex]);

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
      showToast('Full HP/MP restore applied.', 'success');
    };

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
      showToast('All character stats and bonuses set to 9999.', 'success');
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
    makeCard('LEVEL', 'Character Level', actor[lvlKey] || 1, (v) => actor[lvlKey] = v);

    const hpKey = actor['@hp'] !== undefined ? '@hp' : '_hp';
    makeCard('HP', 'Current HP', actor[hpKey] || 100, (v) => actor[hpKey] = v);

    const mpKey = actor['@mp'] !== undefined ? '@mp' : (actor['@sp'] !== undefined ? '@sp' : '_mp');
    makeCard('MP / SP', 'Current MP / SP', actor[mpKey] || 50, (v) => actor[mpKey] = v);

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
      showToast('Set ' + count + ' owned items to 99.', 'success');
    };

    document.getElementById('btn-add-item-dialog').onclick = () => {
      const id = prompt('Enter Item ID to add:');
      if (!id || isNaN(id)) return;
      const qty = prompt('Enter quantity (1-99):', '99');
      const val = parseInt(qty, 10) || 99;
      itemsObj[id] = val;
      renderInventoryTab(partyObj);
      markSaveModified('Add Item #' + id);
      showToast('Added Item #' + id + ' (x' + val + ').', 'success');
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
          <span style="font-weight:600; font-size:0.86rem; color:var(--text-primary);" title="\${escapeHtml(name)}">\${escapeHtml(name)}</span>
          <span style="font-size:0.74rem; color:var(--text-secondary); font-family:var(--font-mono);">#\${id}</span>
        </div>
        <div style="display:flex; align-items:center; gap:4px;">
          <button class="btn btn-secondary btn-sm btn-sub" type="button">-</button>
          <input type="number" class="stat-input" value="\${count}" style="text-align:center; padding:4px;">
          <button class="btn btn-secondary btn-sm btn-add" type="button">+</button>
          <button class="btn btn-secondary btn-sm btn-99" type="button">99</button>
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
      showToast('Added Weapon #' + id + '.', 'success');
    };

    const q = document.getElementById('weapons-search').value.trim().toLowerCase();
    ids.forEach(id => {
      const count = weaponsObj[id];
      const name = (gameData && gameData.weapons && gameData.weapons[id]) || \`Weapon #\${id}\`;
      if (q && !id.includes(q) && !name.toLowerCase().includes(q)) return;

      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = \`
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-primary); font-weight:600;" title="\${escapeHtml(name)}">\${escapeHtml(name)}</span><span style="font-size:0.74rem; color:var(--text-secondary); font-family:var(--font-mono);">#\${id}</span></div>
        <input type="number" class="stat-input" value="\${count}" style="padding:5px 8px;">
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
      showToast('Added Armor #' + id + '.', 'success');
    };

    const q = document.getElementById('armors-search').value.trim().toLowerCase();
    ids.forEach(id => {
      const count = armorsObj[id];
      const name = (gameData && gameData.armors && gameData.armors[id]) || \`Armor #\${id}\`;
      if (q && !id.includes(q) && !name.toLowerCase().includes(q)) return;

      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = \`
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-primary); font-weight:600;" title="\${escapeHtml(name)}">\${escapeHtml(name)}</span><span style="font-size:0.74rem; color:var(--text-secondary); font-family:var(--font-mono);">#\${id}</span></div>
        <input type="number" class="stat-input" value="\${count}" style="padding:5px 8px;">
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
      const vName = (gameData && gameData.variables && gameData.variables[id]) || \`Variable #\${id}\`;
      if (q && !String(id).includes(q) && !String(val).toLowerCase().includes(q) && !vName.toLowerCase().includes(q)) continue;
      count++;

      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = \`
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-primary); font-weight:600;" title="\${escapeHtml(vName)}">\${escapeHtml(vName)}</span><span style="font-size:0.74rem; color:var(--text-secondary); font-family:var(--font-mono);">#\${id}</span></div>
        <input type="text" class="stat-input" value="\${val}" style="padding:5px 8px;">
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
      card.style.cssText = 'background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:10px 14px; display:flex; justify-content:space-between; align-items:center;';
      card.innerHTML = \`
        <span style="color:var(--text-primary); font-weight:500; font-size:0.84rem;" title="\${escapeHtml(name)}">\${escapeHtml(name)}</span>
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
      tr.style.borderBottom = '1px solid var(--border-subtle)';
      tr.innerHTML = \`
        <td style="padding:8px 14px; font-family:var(--font-mono); color:var(--accent-sand);">\${entry.path}</td>
        <td style="padding:8px 14px;"><span class="meta-pill">\${entry.type}</span></td>
        <td style="padding:8px 14px; color:var(--text-secondary); font-family:var(--font-mono);">\${String(entry.origVal)}</td>
        <td style="padding:8px 14px;"><input type="text" class="stat-input raw-val-input" value="\${entry.currentVal}" style="padding:4px 8px;"></td>
        <td style="padding:8px 14px;"><button class="btn btn-secondary btn-sm raw-rev-btn" type="button">Reset</button></td>
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
      showToast('WOLF RPG Pro uses proprietary encryption — please use Cheat Engine as described.', 'warn');
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
    showToast('Download started.', 'success');
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
    showToast('Original backup (.bak) downloaded.', 'success');
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
      a.download = (currentFile.name ? currentFile.name.replace(/\\.[^/.]+$/, '') : 'save') + '_decrypted.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Decrypted JSON exported.', 'success');
    };
  }

  function clearSaveFile() {
    if (!currentFile || (!currentFile.name && !currentFile.parsedRoot)) {
      showToast('No save file currently open.', 'info');
      return;
    }
    currentFile = {
      name: null, size: 0, rawBytes: null,
      format: null, formatLabel: null,
      parsedRoot: null, engine: null
    };
    flatEntries = [];
    resetSaveModified();
    if (fileInput) fileInput.value = '';
    labelFilename.textContent = 'None';
    labelFormat.textContent = 'None';
    labelSize.textContent = '0 B';
    uploadSection.style.display = 'flex';
    saveEditorScreen.style.display = 'none';
    showToast('Save file cleared.', 'info');
  }

  const btnChangeFile = document.getElementById('btn-change-file');
  if (btnChangeFile) {
    btnChangeFile.onclick = () => {
      fileInput.click();
    };
  }

  const btnClearSave = document.getElementById('btn-clear-save');
  if (btnClearSave) {
    btnClearSave.onclick = clearSaveFile;
  }

  const btnDbClearAll = document.getElementById('btn-db-clear-all');
  if (btnDbClearAll) {
    btnDbClearAll.onclick = clearAllDatabaseFiles;
  }

  const btnClearDbHeader = document.getElementById('btn-clear-db-header');
  if (btnClearDbHeader) {
    btnClearDbHeader.onclick = clearAllDatabaseFiles;
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
console.log('Save & DB Studio built successfully!');
