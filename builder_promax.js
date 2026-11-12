const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const pakoCode = fs.readFileSync(path.join(__dirname, 'pako.min.js'), 'utf8');
const lzCode = fs.readFileSync(path.join(__dirname, 'node_modules/lz-string/libs/lz-string.min.js'), 'utf8');
const rubyMarshalCode = fs.readFileSync(path.join(__dirname, 'ruby_marshal.js'), 'utf8');

let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' __CSP_SCRIPT_HASHES__; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none';">
<title>Universal RPG Maker Save Editor</title>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2064%2064'%3E%3Cdefs%3E%3ClinearGradient%20id='bg'%20x1='0%25'%20y1='0%25'%20x2='100%25'%20y2='100%25'%3E%3Cstop%20offset='0%25'%20stop-color='%23242933'/%3E%3Cstop%20offset='100%25'%20stop-color='%2314161B'/%3E%3C/linearGradient%3E%3ClinearGradient%20id='gold'%20x1='0%25'%20y1='0%25'%20x2='100%25'%20y2='100%25'%3E%3Cstop%20offset='0%25'%20stop-color='%23FFF2D6'/%3E%3Cstop%20offset='40%25'%20stop-color='%23E2B86B'/%3E%3Cstop%20offset='100%25'%20stop-color='%23B88028'/%3E%3C/linearGradient%3E%3ClinearGradient%20id='crystal'%20x1='0%25'%20y1='0%25'%20x2='100%25'%20y2='100%25'%3E%3Cstop%20offset='0%25'%20stop-color='%23C2F0BC'/%3E%3Cstop%20offset='60%25'%20stop-color='%2373A86E'/%3E%3Cstop%20offset='100%25'%20stop-color='%233B6338'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20x='2'%20y='2'%20width='60'%20height='60'%20rx='14'%20fill='url(%23bg)'%20stroke='url(%23gold)'%20stroke-width='2.5'/%3E%3Cpath%20d='M16%2013h24l9%209v27a2%202%200%200%201-2%202H18a2%202%200%200%201-2-2V13z'%20fill='%231C2028'%20stroke='%23444B57'%20stroke-width='1.8'%20stroke-linejoin='round'/%3E%3Cpath%20d='M22%2013h18v12a1%201%200%200%201-1%201H23a1%201%200%200%201-1-1V13z'%20fill='url(%23gold)'/%3E%3Crect%20x='26'%20y='16'%20width='3.5'%20height='6'%20rx='1'%20fill='%2314161B'/%3E%3Cpolygon%20points='32,29%2042,39%2032,49%2022,39'%20fill='url(%23crystal)'%20stroke='%23A2C79D'%20stroke-width='1.5'%20stroke-linejoin='round'/%3E%3Cpolygon%20points='32,32%2039,39%2032,46%2025,39'%20fill='%23E8FCE4'%20opacity='0.35'/%3E%3Ccircle%20cx='32'%20cy='39'%20r='2.2'%20fill='%23FFFFFF'/%3E%3C/svg%3E">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<meta name="theme-color" content="#16181D">
<meta name="description" content="Universal RPG Maker Save Editor &amp; Database Modder — Free, 100% private, client-side web utility for RPG Maker MZ, MV, VX Ace, XP, and WOLF RPG save files and JSON databases.">
<meta name="keywords" content="RPG Maker save editor, rmmzsave editor, rpgsave editor, rvdata2 editor, RPG Maker database modder, RPG save editor online">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://universal-rpg-save-editor.pages.dev/">
<meta property="og:title" content="Universal RPG Maker Save Editor">
<meta property="og:description" content="Universal RPG Maker Save Editor &amp; Database Modder — 100% Client-side and private.">
<meta property="og:url" content="https://universal-rpg-save-editor.pages.dev/">
<meta property="og:type" content="website">
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
    <button class="btn btn-secondary btn-sm" id="btn-backup-raw" type="button" title="Download original unmodified save file (.bak)">Backup (.bak)</button>
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
        <button class="btn btn-primary" type="button" id="btn-select-save-file">Select Save File</button>
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
        <div style="display:flex; gap:8px; margin-left:auto; flex-wrap:wrap;">
          <button class="btn btn-secondary btn-sm" id="btn-char-cure-states" type="button" title="Clear poison, death, and negative status effects">Cure States</button>
          <button class="btn btn-secondary btn-sm" id="btn-char-full-heal" type="button">Full Restore (HP/MP)</button>
          <button class="btn btn-gold btn-sm" id="btn-char-max-stats" type="button">Max All Stats (9999)</button>
        </div>
      </div>
      <div id="qol-system-bar" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(190px, 1fr)); gap:10px;"></div>
      <div class="stats-grid" id="char-stats-container" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px;"></div>
      <div id="char-skills-panel" style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px 16px;"></div>
    </div>

    <!-- TAB 2: INVENTORY -->
    <div class="section-panel" id="tab-inventory">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:12px 16px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px;">
        <div style="flex:1; min-width:220px;">
          <input type="text" id="inventory-search" placeholder="Filter by item ID or name..." style="width:100%; padding:7px 11px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.84rem;">
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <label style="font-size:0.82rem; color:var(--text-secondary); cursor:pointer; display:flex; align-items:center; gap:6px;">
            <input type="checkbox" id="inventory-owned-only" checked> Owned only (&gt;0)
          </label>
          <select id="inventory-picker-select" style="display:none; max-width:220px; padding:6px 10px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.82rem;"></select>
          <button class="btn btn-secondary btn-sm" id="btn-items-set-all-99" type="button">Set All Owned to 99</button>
          <button class="btn btn-gold btn-sm" id="btn-items-unlock-safe" type="button" title="Unlock all regular items from Items.json while skipping Key Items (itypeId=2) to protect story quests">Safe Unlock All (No Key Items)</button>
          <button class="btn btn-primary btn-sm" id="btn-add-item-dialog" type="button">+ Add Item</button>
        </div>
      </div>
      <div class="items-card-grid" id="inventory-cards-container"></div>
    </div>

    <!-- TAB 3: WEAPONS -->
    <div class="section-panel" id="tab-weapons">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:12px 16px; display:flex; flex-wrap:wrap; justify-content:space-between; gap:12px;">
        <input type="text" id="weapons-search" placeholder="Filter by weapon ID or name..." style="flex:1; min-width:220px; padding:7px 11px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.84rem;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <select id="weapons-picker-select" style="display:none; max-width:220px; padding:6px 10px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.82rem;"></select>
          <button class="btn btn-secondary btn-sm" id="btn-weapons-set-all-99" type="button">Set Owned to 99</button>
          <button class="btn btn-gold btn-sm" id="btn-weapons-unlock-all" type="button">Unlock All DB Weapons</button>
          <button class="btn btn-primary btn-sm" id="btn-add-weapon-dialog" type="button">+ Add Weapon</button>
        </div>
      </div>
      <div class="items-card-grid" id="weapons-cards-container"></div>
    </div>

    <!-- TAB 4: ARMORS -->
    <div class="section-panel" id="tab-armors">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:12px 16px; display:flex; flex-wrap:wrap; justify-content:space-between; gap:12px;">
        <input type="text" id="armors-search" placeholder="Filter by armor ID or name..." style="flex:1; min-width:220px; padding:7px 11px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.84rem;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <select id="armors-picker-select" style="display:none; max-width:220px; padding:6px 10px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.82rem;"></select>
          <button class="btn btn-secondary btn-sm" id="btn-armors-set-all-99" type="button">Set Owned to 99</button>
          <button class="btn btn-gold btn-sm" id="btn-armors-unlock-all" type="button">Unlock All DB Armors</button>
          <button class="btn btn-primary btn-sm" id="btn-add-armor-dialog" type="button">+ Add Armor</button>
        </div>
      </div>
      <div class="items-card-grid" id="armors-cards-container"></div>
    </div>

    <!-- TAB 5: VARIABLES -->
    <div class="section-panel" id="tab-variables">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:12px 16px; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px;">
        <input type="text" id="variables-search" placeholder="Filter by variable ID (#1-9999), name, or value..." style="flex:1; min-width:220px; padding:7px 11px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.84rem;">
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <label style="font-size:0.82rem; color:var(--text-secondary); cursor:pointer; display:flex; align-items:center; gap:6px;">
            <input type="checkbox" id="vars-nonzero-only" checked> Non-zero only
          </label>
          <input type="file" id="compare-save-input" style="display:none;">
          <button class="btn btn-secondary btn-sm" id="btn-compare-save-vars" type="button" title="Compare with another save file to find which variables changed">Compare Save (Diff Finder)</button>
          <button class="btn btn-secondary btn-sm" id="btn-clear-compare-vars" type="button" style="display:none;">Clear Diff</button>
        </div>
      </div>
      <div id="vars-diff-banner" style="display:none; background:var(--bg-header); border:1px solid var(--accent-sand); border-radius:var(--radius-sm); padding:8px 14px; font-size:0.8rem; color:var(--accent-sand);"></div>
      <div class="items-card-grid" id="variables-cards-container"></div>
    </div>

    <!-- TAB 6: SWITCHES -->
    <div class="section-panel" id="tab-switches">
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:12px 16px; display:flex; flex-wrap:wrap; justify-content:space-between; gap:12px;">
        <input type="text" id="switches-search" placeholder="Filter by switch ID (#1-9999) or name..." style="flex:1; min-width:220px; padding:7px 11px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.84rem;">
        <select id="switches-filter" style="padding:6px 12px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.84rem;">
          <option value="all">All Switches</option>
          <option value="on">ON Only</option>
          <option value="off">OFF Only</option>
          <option value="diff">Changed in Diff Only</option>
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
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:10px 14px; display:flex; gap:10px; align-items:center;">
        <input type="text" id="raw-search-input" placeholder="Search property path or value..." style="flex:1; padding:7px 11px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.84rem;">
        <span id="raw-showing-label" class="meta-pill">0 entries</span>
      </div>
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
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button class="btn btn-secondary btn-sm" id="btn-db-browse-multi" type="button">Select JSON Files</button>
        <button class="btn btn-primary btn-sm" id="btn-db-download-all" type="button" title="Download all modified database JSON files at once">Download All Modified</button>
        <button class="btn btn-secondary btn-sm" id="btn-db-clear-all" type="button" title="Clear all loaded database files">Clear All Files</button>
      </div>
    </div>

    <!-- Category Status Cards -->
    <div class="db-slot-grid">
      <button class="db-cat-btn active" data-cat="weapons" id="slot-btn-weapons" type="button">
        <div class="db-slot-top">
          <span>Weapons</span>
          <span id="db-slot-file-weapons" style="font-size:0.72rem; font-family:var(--font-mono); color:var(--text-secondary);">Weapons.json</span>
        </div>
        <div class="db-slot-sub">
          <span id="db-slot-status-weapons">Not loaded</span>
          <span id="db-slot-mod-weapons" style="color:var(--accent-sage-bright); font-weight:600; font-family:var(--font-mono);"></span>
        </div>
      </button>

      <button class="db-cat-btn" data-cat="armors" id="slot-btn-armors" type="button">
        <div class="db-slot-top">
          <span>Armors</span>
          <span id="db-slot-file-armors" style="font-size:0.72rem; font-family:var(--font-mono); color:var(--text-secondary);">Armors.json</span>
        </div>
        <div class="db-slot-sub">
          <span id="db-slot-status-armors">Not loaded</span>
          <span id="db-slot-mod-armors" style="color:var(--accent-sage-bright); font-weight:600; font-family:var(--font-mono);"></span>
        </div>
      </button>

      <button class="db-cat-btn" data-cat="items" id="slot-btn-items" type="button">
        <div class="db-slot-top">
          <span>Items</span>
          <span id="db-slot-file-items" style="font-size:0.72rem; font-family:var(--font-mono); color:var(--text-secondary);">Items.json</span>
        </div>
        <div class="db-slot-sub">
          <span id="db-slot-status-items">Not loaded</span>
          <span id="db-slot-mod-items" style="color:var(--accent-sage-bright); font-weight:600; font-family:var(--font-mono);"></span>
        </div>
      </button>

      <button class="db-cat-btn" data-cat="skills" id="slot-btn-skills" type="button">
        <div class="db-slot-top">
          <span>Skills</span>
          <span id="db-slot-file-skills" style="font-size:0.72rem; font-family:var(--font-mono); color:var(--text-secondary);">Skills.json</span>
        </div>
        <div class="db-slot-sub">
          <span id="db-slot-status-skills">Not loaded</span>
          <span id="db-slot-mod-skills" style="color:var(--accent-sage-bright); font-weight:600; font-family:var(--font-mono);"></span>
        </div>
      </button>

      <button class="db-cat-btn" data-cat="enemies" id="slot-btn-enemies" type="button">
        <div class="db-slot-top">
          <span>Enemies</span>
          <span id="db-slot-file-enemies" style="font-size:0.72rem; font-family:var(--font-mono); color:var(--text-secondary);">Enemies.json</span>
        </div>
        <div class="db-slot-sub">
          <span id="db-slot-status-enemies">Not loaded</span>
          <span id="db-slot-mod-enemies" style="color:var(--accent-sage-bright); font-weight:600; font-family:var(--font-mono);"></span>
        </div>
      </button>

      <button class="db-cat-btn" data-cat="classes" id="slot-btn-classes" type="button">
        <div class="db-slot-top">
          <span>Classes</span>
          <span id="db-slot-file-classes" style="font-size:0.72rem; font-family:var(--font-mono); color:var(--text-secondary);">Classes.json</span>
        </div>
        <div class="db-slot-sub">
          <span id="db-slot-status-classes">Not loaded</span>
          <span id="db-slot-mod-classes" style="color:var(--accent-sage-bright); font-weight:600; font-family:var(--font-mono);"></span>
        </div>
      </button>

      <button class="db-cat-btn" data-cat="actors" id="slot-btn-actors" type="button">
        <div class="db-slot-top">
          <span>Actors</span>
          <span id="db-slot-file-actors" style="font-size:0.72rem; font-family:var(--font-mono); color:var(--text-secondary);">Actors.json</span>
        </div>
        <div class="db-slot-sub">
          <span id="db-slot-status-actors">Not loaded</span>
          <span id="db-slot-mod-actors" style="color:var(--accent-sage-bright); font-weight:600; font-family:var(--font-mono);"></span>
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

  // Multi-file Database Store (keeps Weapons, Armors, Items, Skills, Enemies, Classes, Actors in memory simultaneously)
  const dbStore = {
    weapons: null,
    armors: null,
    items: null,
    skills: null,
    enemies: null,
    classes: null,
    actors: null
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

  const gameData = { items: {}, itemTypes: {}, weapons: {}, armors: {}, skills: {}, variables: {}, switches: {} };
  let compareBaseline = null;
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
      .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '')
      .replace(/[\u{E0000}-\u{E007F}]/gu, '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function isSafeKey(k) {
    const s = String(k);
    return s !== '__proto__' && s !== 'constructor' && s !== 'prototype';
  }

  function sanitizeDownloadName(name, fallback) {
    const cleaned = String(name || '')
      .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '')
      .replace(/[\u{E0000}-\u{E007F}]/gu, '')
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
      .replace(/^[.\s]+|[.\s]+$/g, '');
    return cleaned || fallback;
  }

  function triggerBlobDownload(blob, fileName, fallback) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = sanitizeDownloadName(fileName, fallback);
    document.body.appendChild(a);
    a.click();
    if (typeof document.body.removeChild === 'function') document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function isDangerousFormula(formula) {
    if (typeof formula !== 'string' || !formula) return false;
    return /\b(require|child_process|process|globalThis|window|document|Function|eval|fetch|XMLHttpRequest|WebSocket|localStorage)\b/i.test(formula);
  }

  function safeJsonStringify(root, space = 2, maxNodes = 250000) {
    const ancestors = [];
    let count = 0;
    return JSON.stringify(root, function(key, val) {
      if (++count > maxNodes) {
        throw new Error('Object graph exceeds safe serialization limit (possible reference amplification attack)');
      }
      if (typeof val === 'object' && val !== null) {
        while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
          ancestors.pop();
        }
        if (ancestors.includes(val)) return '[Circular]';
        ancestors.push(val);
      }
      return val;
    }, space);
  }

  function getJsonExArray(val, depth = 0) {
    if (!val || depth > 8) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'object') {
      if (Array.isArray(val.__table_data__)) return val.__table_data__;
      if (Array.isArray(val['@a'])) return val['@a'];
      if (val['@data'] && typeof val['@data'] === 'object') return getJsonExArray(val['@data'], depth + 1);
      if (val._data && typeof val._data === 'object') return getJsonExArray(val._data, depth + 1);
    }
    return [];
  }

  function ensurePartyBag(partyObj, baseName) {
    if (!partyObj || typeof partyObj !== 'object') return {};
    const rubyKey = '@' + baseName;
    const mzKey = '_' + baseName;
    if (partyObj[rubyKey] && typeof partyObj[rubyKey] === 'object') return partyObj[rubyKey];
    if (partyObj[mzKey] && typeof partyObj[mzKey] === 'object') return partyObj[mzKey];
    if (partyObj[baseName] && typeof partyObj[baseName] === 'object') return partyObj[baseName];
    const isRuby = currentFile.engine === 'ruby' || partyObj.__ruby_class__ || partyObj['@gold'] !== undefined;
    const targetKey = isRuby ? rubyKey : mzKey;
    partyObj[targetKey] = {};
    return partyObj[targetKey];
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
  const btnSelectSave = document.getElementById('btn-select-save-file');
  if (btnSelectSave) btnSelectSave.onclick = () => fileInput.click();
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
    e.stopPropagation();
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
    dbDropBanner.ondrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dbDropBanner.classList.remove('drag-over');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleIncomingFiles(e.dataTransfer.files);
      }
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
    return n === 'weapons.json' || n === 'armors.json' || n === 'items.json' || n === 'skills.json' || n === 'enemies.json' || n === 'classes.json' || n === 'actors.json' || n === 'system.json';
  }

  function handleIncomingFile(file) {
    handleIncomingFiles([file]);
  }

  function handleIncomingFiles(fileList) {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    const saveFile = files.find(f => !f.name.toLowerCase().endsWith('.json'));
    const jsonFiles = files.filter(f => f.name.toLowerCase().endsWith('.json'));
    if (saveFile) loadSaveFile(saveFile);
    if (jsonFiles.length > 0) {
      jsonFiles.forEach((f, idx) => loadDatabaseFile(f, null, !saveFile && idx === 0));
    }
  }

  // -------------------------------------------------------------
  // DATABASE MODDER LOGIC
  // -------------------------------------------------------------
  function detectDbCategory(fileName, jsonArr) {
    if (!Array.isArray(jsonArr)) return null;
    const sample = jsonArr.find(x => x && typeof x === 'object' && x.id);
    if (sample) {
      // Reject unsupported RPG Maker tables (States, Troops, Tilesets, MapInfos, CommonEvents, Animations)
      if ('restriction' in sample || 'autoRemovalTiming' in sample || 'members' in sample || 'pages' in sample ||
          'tilesetNames' in sample || 'parentId' in sample || 'list' in sample || 'frames' in sample ||
          'timings' in sample || 'effectName' in sample) {
        return null;
      }
      if ((Array.isArray(sample.params) && Array.isArray(sample.params[0])) || 'expParams' in sample || 'learnings' in sample) {
        return 'classes';
      }
      if ('classId' in sample || 'initialLevel' in sample || 'maxLevel' in sample || 'equips' in sample) {
        return 'actors';
      }
      if ('dropItems' in sample || 'actions' in sample || 'battlerName' in sample) {
        return 'enemies';
      }
      if ('wtypeId' in sample) return 'weapons';
      if ('atypeId' in sample || 'etypeId' in sample) return 'armors';
      if ('stypeId' in sample || 'mpCost' in sample || 'tpCost' in sample) return 'skills';
      if ('itypeId' in sample || 'consumable' in sample) return 'items';
    }
    const baseName = String(fileName || '').replace(/\\.json$/i, '').toLowerCase();
    if (baseName.includes('weapon')) return 'weapons';
    if (baseName.includes('armor')) return 'armors';
    if (baseName.includes('item')) return 'items';
    if (baseName.includes('skill')) return 'skills';
    if (baseName.includes('enem')) return 'enemies';
    if (baseName.includes('class')) return 'classes';
    if (baseName.includes('actor')) return 'actors';
    return null;
  }

  function applyDatabaseJson(fileName, json, handle = null, autoSwitch = true) {
    if (!Array.isArray(json) && json && typeof json === 'object') {
      if (Array.isArray(json.variables) || Array.isArray(json.switches)) {
        if (Array.isArray(json.variables)) {
          gameData.variables = {};
          json.variables.forEach((n, i) => { if (n) gameData.variables[i] = n; });
        }
        if (Array.isArray(json.switches)) {
          gameData.switches = {};
          json.switches.forEach((n, i) => { if (n) gameData.switches[i] = n; });
        }
        if (currentFile.parsedRoot) setupVisualEditor();
        showToast(\`Loaded Variable/Switch names from \${fileName}\`, 'success');
        return true;
      }
      showToast(\`Skipped \${fileName}: Only Weapons, Armors, Items, Skills, Enemies, Classes, Actors, or System.json are supported.\`, 'warn');
      return false;
    }

    if (!Array.isArray(json)) throw new Error('Database file (.json) must be a valid RPG Maker JSON array.');

    const cat = detectDbCategory(fileName, json);
    if (!cat) {
      showToast(\`Skipped \${fileName}: Unsupported database file.\`, 'warn');
      return false;
    }
    const validItems = json.filter(x => x && x.id && isSafeKey(x.id));
    const hasRiskyFormula = validItems.some(x => x.damage && isDangerousFormula(x.damage.formula));

    if (gameData[cat]) {
      gameData[cat] = {};
      if (cat === 'items') gameData.itemTypes = {};
      validItems.forEach(x => {
        if (x.id && x.name && isSafeKey(x.id)) {
          gameData[cat][x.id] = x.name;
          if (cat === 'items') gameData.itemTypes[x.id] = x.itypeId || 1;
        }
      });
    }
    if (currentFile.parsedRoot) setupVisualEditor();

    dbStore[cat] = {
      category: cat,
      fileName: fileName,
      fileHandle: handle,
      items: json,
      origItemsJson: JSON.stringify(json),
      selectedId: validItems.length > 0 ? validItems[0].id : null,
      modifiedIds: new Set()
    };

    if (autoSwitch || !dbStore[currentDb.category] || currentDb.category === cat) {
      syncCurrentDbFromStore(cat);
    }
    switchAppMode('database');
    updateDbCategoryButtons(currentDb.category);
    updateDbSlotBadges();
    renderDbBulkActions();
    renderDbMasterList();
    if (hasRiskyFormula) {
      showToast(\`Warning: \${fileName} contains suspicious script calls in damage.formula!\`, 'danger');
    } else {
      showToast(\`Loaded \${fileName} (\${validItems.length} entries)\`, 'success');
    }
    return true;
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
        const isSaveJson = json && typeof json === 'object' && (
          (!Array.isArray(json) && (json.party || json.actors)) ||
          (Array.isArray(json) && json.some(x => x && (x.__ruby_class__ || x['@gold'] !== undefined || x['@data'] !== undefined)))
        );
        if (isSaveJson && currentAppMode === 'save' && !handle) {
          loadSaveFile(file);
          return;
        }
        applyDatabaseJson(file.name, json, handle, autoSwitch);
      } catch(e) {
        alert('Error parsing database JSON:\\n' + e.message);
      }
    };
    reader.readAsText(file);
  }

  function syncCurrentDbFromStore(cat) {
    const defaultNames = {
      weapons: 'Weapons.json', armors: 'Armors.json', items: 'Items.json', skills: 'Skills.json',
      enemies: 'Enemies.json', classes: 'Classes.json', actors: 'Actors.json'
    };
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
    const allCats = ['weapons', 'armors', 'items', 'skills', 'enemies', 'classes', 'actors'];
    const loaded = allCats.some(c => dbStore[c] && dbStore[c].items && dbStore[c].items.length > 0);
    if (!loaded) {
      showToast('No database files are currently loaded.', 'info');
      return;
    }
    allCats.forEach(c => {
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
    const defaultNames = {
      weapons: 'Weapons.json', armors: 'Armors.json', items: 'Items.json', skills: 'Skills.json',
      enemies: 'Enemies.json', classes: 'Classes.json', actors: 'Actors.json'
    };
    Object.keys(defaultNames).forEach(cat => {
      const slotBtn = document.getElementById('slot-btn-' + cat);
      const statusEl = document.getElementById('db-slot-status-' + cat);
      const modEl = document.getElementById('db-slot-mod-' + cat);
      const fileEl = document.getElementById('db-slot-file-' + cat);
      const store = dbStore[cat];
      if (!slotBtn || !statusEl || !modEl) return;

      if (store && store.items && store.items.length > 0) {
        const count = store.items.filter(x => x && x.id).length;
        slotBtn.classList.add('loaded');
        statusEl.innerHTML = \`Loaded: <b>\${count}</b> entries\`;
        statusEl.style.color = 'var(--accent-sage-bright)';
        modEl.textContent = store.modifiedIds.size > 0 ? \`\${store.modifiedIds.size} edited\` : '';
        if (fileEl) fileEl.textContent = store.fileName || defaultNames[cat];
      } else {
        slotBtn.classList.remove('loaded');
        statusEl.textContent = 'Not loaded (click or drop)';
        statusEl.style.color = 'var(--text-secondary)';
        modEl.textContent = '';
        if (fileEl) fileEl.textContent = defaultNames[cat];
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
      skills: 'SKILLS DATABASE',
      enemies: 'ENEMIES DATABASE',
      classes: 'CLASSES DATABASE',
      actors: 'ACTORS DATABASE'
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
    } else if (cat === 'enemies') {
      buttonsHtml += \`
        <button class="btn btn-gold btn-sm" id="btn-bulk-enemy-drops" type="button">All 100% Drop Rate</button>
        <button class="btn btn-primary btn-sm" id="btn-bulk-enemy-rewards" type="button">All EXP/Gold x5</button>
        <button class="btn btn-secondary btn-sm" id="btn-bulk-enemy-1hp" type="button">All 1 HP (Easy Win)</button>
      \`;
    } else if (cat === 'classes') {
      buttonsHtml += \`
        <button class="btn btn-gold btn-sm" id="btn-bulk-class-fast-exp" type="button">All Fast EXP Curve</button>
        <button class="btn btn-primary btn-sm" id="btn-bulk-class-lv1-skills" type="button">All Skills at Lv 1</button>
      \`;
    } else if (cat === 'actors') {
      buttonsHtml += \`
        <button class="btn btn-gold btn-sm" id="btn-bulk-actor-maxlv" type="button">All Max Level 999</button>
        <button class="btn btn-primary btn-sm" id="btn-bulk-actor-initlv" type="button">All Initial Level 99</button>
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
            zeroItemWeight(it);
          } else if (cat === 'skills') {
            if (it.mpCost !== undefined) it.mpCost = 0;
            if (it.tpCost !== undefined) it.tpCost = 0;
          } else if (cat === 'enemies') {
            if (Array.isArray(it.dropItems)) it.dropItems.forEach(d => { if (d && d.kind > 0) d.denominator = 1; });
            if (typeof it.exp === 'number') it.exp = Math.max(100, it.exp * 10);
            if (typeof it.gold === 'number') it.gold = Math.max(100, it.gold * 10);
          } else if (cat === 'classes') {
            it.expParams = [10, 0, 0, 0];
            if (Array.isArray(it.learnings)) it.learnings.forEach(l => { if (l) l.level = 1; });
          } else if (cat === 'actors') {
            it.maxLevel = 999;
            it.initialLevel = 99;
          }
          currentDb.modifiedIds.add(it.id);
        });
        finishBulkAction('Applied Max Table Preset to all entries.');
      };
    }

    const btnEnemyDrops = document.getElementById('btn-bulk-enemy-drops');
    if (btnEnemyDrops) {
      btnEnemyDrops.onclick = () => {
        validItems.forEach(it => {
          if (Array.isArray(it.dropItems)) {
            it.dropItems.forEach(d => { if (d && d.kind > 0) d.denominator = 1; });
            currentDb.modifiedIds.add(it.id);
          }
        });
        finishBulkAction('Set all enemy drop rates to 100% (1/1).');
      };
    }
    const btnEnemyRewards = document.getElementById('btn-bulk-enemy-rewards');
    if (btnEnemyRewards) {
      btnEnemyRewards.onclick = () => {
        validItems.forEach(it => {
          if (typeof it.exp === 'number') it.exp *= 5;
          if (typeof it.gold === 'number') it.gold *= 5;
          currentDb.modifiedIds.add(it.id);
        });
        finishBulkAction('Multiplied all enemy EXP and Gold rewards by 5x.');
      };
    }
    const btnEnemy1Hp = document.getElementById('btn-bulk-enemy-1hp');
    if (btnEnemy1Hp) {
      btnEnemy1Hp.onclick = () => {
        validItems.forEach(it => {
          if (Array.isArray(it.params) && !Array.isArray(it.params[0])) {
            it.params[0] = 1;
            currentDb.modifiedIds.add(it.id);
          }
        });
        finishBulkAction('Set all enemy Max HP to 1.');
      };
    }
    const btnClassFastExp = document.getElementById('btn-bulk-class-fast-exp');
    if (btnClassFastExp) {
      btnClassFastExp.onclick = () => {
        validItems.forEach(it => {
          it.expParams = [10, 0, 0, 0];
          currentDb.modifiedIds.add(it.id);
        });
        finishBulkAction('Set fast leveling EXP curve on all classes.');
      };
    }
    const btnClassLv1Skills = document.getElementById('btn-bulk-class-lv1-skills');
    if (btnClassLv1Skills) {
      btnClassLv1Skills.onclick = () => {
        validItems.forEach(it => {
          if (Array.isArray(it.learnings)) {
            it.learnings.forEach(l => { if (l) l.level = 1; });
            currentDb.modifiedIds.add(it.id);
          }
        });
        finishBulkAction('Set all class skills to unlock at Level 1.');
      };
    }
    const btnActorMaxLv = document.getElementById('btn-bulk-actor-maxlv');
    if (btnActorMaxLv) {
      btnActorMaxLv.onclick = () => {
        validItems.forEach(it => {
          it.maxLevel = 999;
          currentDb.modifiedIds.add(it.id);
        });
        finishBulkAction('Set Max Level cap to 999 for all actors.');
      };
    }
    const btnActorInitLv = document.getElementById('btn-bulk-actor-initlv');
    if (btnActorInitLv) {
      btnActorInitLv.onclick = () => {
        validItems.forEach(it => {
          it.initialLevel = 99;
          currentDb.modifiedIds.add(it.id);
        });
        finishBulkAction('Set Initial Level to 99 for all actors.');
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
        if (gameData[cat]) {
          gameData[cat] = {};
          currentDb.items.forEach(x => {
            if (x && x.id && x.name && isSafeKey(x.id)) {
              gameData[cat][x.id] = x.name;
              if (cat === 'items') gameData.itemTypes[x.id] = x.itypeId || 1;
            }
          });
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
    if (!item || typeof item !== 'object') return false;
    let changed = false;
    if (typeof item.description === 'string') {
      if (/weight\\s*:\\s*\\d+/i.test(item.description)) {
        item.description = item.description.replace(/(weight\\s*:\\s*)\\d+(\\s*w?)/gi, '$10$2');
        changed = true;
      } else if (!item.description.includes('[0W]')) {
        item.description = (item.description ? item.description + ' ' : '') + '[0W]';
        changed = true;
      }
    }
    if (typeof item.note === 'string') {
      if (/weight\\s*:\\s*\\d+/i.test(item.note)) {
        item.note = item.note.replace(/(weight\\s*:\\s*)\\d+(\\s*w?)/gi, '$10$2');
        changed = true;
      } else if (!item.note.includes('<Weight: 0>')) {
        item.note = (item.note ? item.note + '\\n' : '') + '<Weight: 0>';
        changed = true;
      }
    } else if (item.note === undefined) {
      item.note = '<Weight: 0>';
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
  function renderDbMasterList(skipDetailRender = false) {
    const container = document.getElementById('db-items-list-container');
    const detailContainer = document.getElementById('db-detail-container');
    const showingLabel = document.getElementById('db-list-showing-label');
    if (!container) return;
    container.innerHTML = '';

    const validItems = currentDb.items.filter(x => x && x.id);
    document.getElementById('db-label-count').textContent = \`\${validItems.length} ITEMS\`;

    if (validItems.length === 0) {
      if (showingLabel) showingLabel.textContent = 'Not loaded';
      const safeDbFileName = escapeHtml(currentDb.fileName);
      container.innerHTML = \`
        <div style="padding:36px 20px; text-align:center; color:var(--text-secondary);">
          <div style="font-weight:600; color:var(--text-primary); margin-bottom:6px; font-size:0.88rem;">\${safeDbFileName} is not loaded</div>
          <div style="font-size:0.78rem; margin-bottom:14px; line-height:1.5;">Drop <b>\${safeDbFileName}</b> from your game's <code>data/</code> folder or select it below.</div>
          <button class="btn btn-secondary btn-sm" id="btn-empty-load-cat" type="button">Select \${safeDbFileName}</button>
        </div>
      \`;
      if (detailContainer) {
        detailContainer.innerHTML = \`
          <div style="text-align:center; padding:64px 24px; color:var(--text-secondary); border:1px dashed var(--border-color); border-radius:var(--radius-md); margin:auto 0;">
            <div style="font-size:1.05rem; font-weight:600; color:var(--text-primary);">No \${safeDbFileName} File Loaded</div>
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
          <span class="db-row-id">#\${escapeHtml(item.id)}</span>
          <span class="db-row-name" title="\${escapeHtml(name)}">\${escapeHtml(name)}</span>
        </div>
        <span style="font-size:0.74rem; color:var(--text-secondary); font-family:var(--font-mono); white-space:nowrap;">\${escapeHtml(getQuickPreviewBadge(item))}</span>
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
      if (skipDetailRender !== true) renderDbDetail(selectedObj);
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
    if (currentDb.category === 'enemies') {
      return \`\${item.exp || 0} EXP · \${item.gold || 0} G\`;
    }
    if (currentDb.category === 'classes') {
      const skillsCount = Array.isArray(item.learnings) ? item.learnings.length : 0;
      return \`\${skillsCount} skills\`;
    }
    if (currentDb.category === 'actors') {
      return \`Lv \${item.initialLevel || 1}–\${item.maxLevel || 99}\`;
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
    if (code === 13) return eff.value1 ?? 0;
    return eff.value2 ?? 0;
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
            <input type="number" class="stat-input db-stat-input" data-idx="\${i}" value="\${escapeHtml(p[i]||0)}">
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
            <input type="number" class="stat-input" id="item-repeats" value="\${escapeHtml(item.repeats || 1)}" min="1" max="99">
          </div>

          <div class="db-field-box">
            <span class="db-field-label">TP Gain on Use</span>
            <input type="number" class="stat-input" id="item-tp-gain" value="\${escapeHtml(item.tpGain || 0)}">
          </div>
        </div>

        <div style="font-size:0.78rem; font-weight:600; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.04em; margin-top:4px;">Recovery &amp; Formula Effects</div>
        <div class="db-field-grid">
          <div class="db-field-box">
            <span class="db-field-label">HP Recovery (%) + Flat</span>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="number" class="stat-input" id="item-eff-hp-pct" value="\${escapeHtml(hpPct)}" placeholder="%" title="HP Recovery Percentage" style="width:50%;">
              <span style="color:var(--text-secondary); font-size:0.78rem;">% +</span>
              <input type="number" class="stat-input" id="item-eff-hp-flat" value="\${escapeHtml(hpFlat)}" placeholder="Flat" title="Flat HP Recovery" style="width:50%;">
            </div>
          </div>

          <div class="db-field-box">
            <span class="db-field-label">MP Recovery (%) + Flat</span>
            <div style="display:flex; gap:6px; align-items:center;">
              <input type="number" class="stat-input" id="item-eff-mp-pct" value="\${escapeHtml(mpPct)}" placeholder="%" title="MP Recovery Percentage" style="width:50%;">
              <span style="color:var(--text-secondary); font-size:0.78rem;">% +</span>
              <input type="number" class="stat-input" id="item-eff-mp-flat" value="\${escapeHtml(mpFlat)}" placeholder="Flat" title="Flat MP Recovery" style="width:50%;">
            </div>
          </div>

          <div class="db-field-box">
            <span class="db-field-label">Effect TP Gain</span>
            <input type="number" class="stat-input" id="item-eff-tp" value="\${escapeHtml(tpEff)}">
          </div>

          <div class="db-field-box">
            <span class="db-field-label">Damage / Recovery Formula</span>
            <input type="text" class="stat-input" id="item-formula" value="\${escapeHtml(dmg.formula || '0')}" placeholder="e.g. 200 + b.mhp * 0.2">
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
            <input type="number" class="stat-input" id="skill-mp-cost" value="\${escapeHtml(item.mpCost || 0)}">
          </div>
          <div class="db-field-box">
            <span class="db-field-label">TP Cost</span>
            <input type="number" class="stat-input" id="skill-tp-cost" value="\${escapeHtml(item.tpCost || 0)}">
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
            <input type="number" class="stat-input" id="skill-repeats" value="\${escapeHtml(item.repeats || 1)}" min="1" max="99">
          </div>
          <div class="db-field-box">
            <span class="db-field-label">TP Gain</span>
            <input type="number" class="stat-input" id="skill-tp-gain" value="\${escapeHtml(item.tpGain || 0)}">
          </div>
          <div class="db-field-box" style="grid-column: 1 / -1;">
            <span class="db-field-label">Damage Formula</span>
            <input type="text" class="stat-input" id="skill-formula" value="\${escapeHtml(dmg.formula || '')}" placeholder="e.g. a.atk * 4 - b.def * 2">
          </div>
        </div>
      \`;
    } else if (cat === 'enemies') {
      const paramLabels = [
        'MHP (Max HP)', 'MMP (Max MP)', 'ATK (Attack)', 'DEF (Defense)',
        'MAT (Magic Attack)', 'MDF (Magic Defense)', 'AGI (Agility)', 'LUK (Luck)'
      ];
      const p = (Array.isArray(item.params) && !Array.isArray(item.params[0])) ? item.params : [0,0,0,0,0,0,0,0];
      let paramInputs = '';
      paramLabels.forEach((label, i) => {
        paramInputs += \`
          <div class="db-field-box">
            <span class="db-field-label">\${label}</span>
            <input type="number" class="stat-input db-stat-input" data-idx="\${i}" value="\${escapeHtml(p[i]||0)}">
          </div>
        \`;
      });
      specificHtml = \`
        <div class="preset-bar">
          <span style="font-weight:600; color:var(--text-secondary); font-size:0.76rem; text-transform:uppercase;">Quick Presets:</span>
          <button class="btn btn-gold btn-sm" id="btn-enemy-100-drop" type="button">100% Drop Rate</button>
          <button class="btn btn-primary btn-sm" id="btn-enemy-1hp" type="button">Set HP to 1 (Easy Boss)</button>
        </div>
        <div class="db-field-grid">
          <div class="db-field-box">
            <span class="db-field-label">EXP Reward</span>
            <input type="number" class="stat-input" id="enemy-exp" value="\${escapeHtml(item.exp || 0)}">
          </div>
          <div class="db-field-box">
            <span class="db-field-label">Gold Reward</span>
            <input type="number" class="stat-input" id="enemy-gold" value="\${escapeHtml(item.gold || 0)}">
          </div>
        </div>
        <div class="db-field-grid">\${paramInputs}</div>
      \`;
    } else if (cat === 'classes') {
      const expP = Array.isArray(item.expParams) ? item.expParams : [30, 20, 30, 30];
      specificHtml = \`
        <div class="preset-bar">
          <span style="font-weight:600; color:var(--text-secondary); font-size:0.76rem; text-transform:uppercase;">Quick Presets:</span>
          <button class="btn btn-gold btn-sm" id="btn-class-fast-exp" type="button">Fast Leveling Curve</button>
          <button class="btn btn-primary btn-sm" id="btn-class-lv1-skills" type="button">Unlock All Class Skills at Lv 1</button>
          <button class="btn btn-secondary btn-sm" id="btn-class-2x-curve" type="button">Boost Lv1–99 Stat Growth (2x)</button>
        </div>
        <div class="db-field-grid">
          <div class="db-field-box">
            <span class="db-field-label">EXP Basis (Lower = Faster Leveling)</span>
            <input type="number" class="stat-input" id="class-exp-basis" value="\${escapeHtml(expP[0] || 30)}">
          </div>
        </div>
      \`;
    } else if (cat === 'actors') {
      specificHtml = \`
        <div class="preset-bar">
          <span style="font-weight:600; color:var(--text-secondary); font-size:0.76rem; text-transform:uppercase;">Quick Presets:</span>
          <button class="btn btn-gold btn-sm" id="btn-actor-cap-999" type="button">Max Level Cap 999</button>
          <button class="btn btn-primary btn-sm" id="btn-actor-init-99" type="button">Initial Level 99</button>
        </div>
        <div class="db-field-grid">
          <div class="db-field-box">
            <span class="db-field-label">Initial Level</span>
            <input type="number" class="stat-input" id="actor-init-lvl" value="\${escapeHtml(item.initialLevel || 1)}">
          </div>
          <div class="db-field-box">
            <span class="db-field-label">Max Level Cap</span>
            <input type="number" class="stat-input" id="actor-max-lvl" value="\${escapeHtml(item.maxLevel || 99)}">
          </div>
          <div class="db-field-box">
            <span class="db-field-label">Nickname</span>
            <input type="text" class="stat-input" id="actor-nickname" value="\${escapeHtml(item.nickname || '')}">
          </div>
        </div>
      \`;
    }

    container.innerHTML = \`
      <div class="db-item-header">
        <div class="db-item-title-group">
          <div class="db-icon-box">\${getCategoryIcon(cat)}</div>
          <input type="text" class="db-name-input" id="detail-name" value="\${escapeHtml(item.name || '')}" placeholder="Entry Name">
          <span class="meta-pill" style="color:var(--accent-sand);">ID #\${escapeHtml(item.id)}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          \${item.price !== undefined ? \`
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:0.78rem; color:var(--text-secondary); font-weight:600; text-transform:uppercase;">Price</span>
              <input type="number" class="stat-input" id="detail-price" value="\${escapeHtml(item.price)}" style="width:110px; padding:5px 8px;">
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
        <button class="btn btn-secondary btn-sm" id="btn-db-revert-item" type="button">Revert Entry (#\${escapeHtml(item.id)})</button>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary btn-sm" id="btn-detail-save-disk" type="button">Save to Disk</button>
          <button class="btn btn-primary btn-sm" id="btn-detail-download" type="button">Download \${escapeHtml(currentDb.fileName)}</button>
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
    if (cat === 'enemies') return 'ENM';
    if (cat === 'classes') return 'CLS';
    if (cat === 'actors') return 'ACT';
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
    if (nameEl) nameEl.onchange = () => {
      item.name = nameEl.value;
      if (gameData[currentDb.category] && isSafeKey(item.id)) {
        gameData[currentDb.category][item.id] = item.name;
      }
      markModified(item);
      renderDbMasterList(true);
    };
    const descEl = document.getElementById('detail-desc');
    if (descEl) descEl.onchange = () => { item.description = descEl.value; markModified(item); };
    const noteEl = document.getElementById('detail-note');
    if (noteEl) noteEl.onchange = () => { item.note = noteEl.value; markModified(item); };
    const priceEl = document.getElementById('detail-price');
    if (priceEl) priceEl.onchange = () => { item.price = parseInt(priceEl.value) || 0; markModified(item); renderDbMasterList(true); };

    document.querySelectorAll('.db-stat-input').forEach(inp => {
      inp.onchange = () => {
        const idx = parseInt(inp.getAttribute('data-idx'));
        if (!item.params) item.params = [0,0,0,0,0,0,0,0];
        item.params[idx] = parseInt(inp.value) || 0;
        markModified(item);
        renderDbMasterList(true);
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
        showToast('Parameters set to 9999.', 'success');
      };
    }

    const btnFree = document.getElementById('btn-db-free-price');
    if (btnFree) {
      btnFree.onclick = () => {
        item.price = 0;
        markModified(item);
        renderDbMasterList();
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
    if (chkCons) chkCons.onchange = () => { item.consumable = chkCons.checked; markModified(item); renderDbMasterList(); };
    const selScope = document.getElementById('item-scope');
    if (selScope) selScope.onchange = () => { item.scope = parseInt(selScope.value); markModified(item); };
    const inpRepeats = document.getElementById('item-repeats');
    if (inpRepeats) inpRepeats.onchange = () => { item.repeats = parseInt(inpRepeats.value) || 1; markModified(item); };
    const inpTpGain = document.getElementById('item-tp-gain');
    if (inpTpGain) inpTpGain.onchange = () => { item.tpGain = parseInt(inpTpGain.value) || 0; markModified(item); };
    const txtFormula = document.getElementById('item-formula');
    if (txtFormula) txtFormula.onchange = () => {
      if (isDangerousFormula(txtFormula.value)) {
        showToast('Blocked unsafe script keyword in damage formula.', 'danger');
        txtFormula.value = (item.damage && item.damage.formula) || '0';
        return;
      }
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
    if (mpCost) mpCost.onchange = () => { item.mpCost = parseInt(mpCost.value) || 0; markModified(item); renderDbMasterList(true); };
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
      if (isDangerousFormula(skillFormula.value)) {
        showToast('Blocked unsafe script keyword in damage formula.', 'danger');
        skillFormula.value = (item.damage && item.damage.formula) || '';
        return;
      }
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
          if (gameData[currentDb.category] && isSafeKey(item.id)) {
            gameData[currentDb.category][item.id] = origItem.name || '';
          }
          currentDb.modifiedIds.delete(item.id);
          updateDbSlotBadges();
          renderDbMasterList();
          showToast(\`Reverted entry #\${item.id} to original values.\`, 'info');
        }
      };
    }

    const btnDetDl = document.getElementById('btn-detail-download');
    if (btnDetDl) btnDetDl.onclick = downloadDatabaseFile;
    const btnDetSave = document.getElementById('btn-detail-save-disk');
    if (btnDetSave) btnDetSave.onclick = saveDatabaseToDisk;

    const enemyExp = document.getElementById('enemy-exp');
    if (enemyExp) enemyExp.onchange = () => { item.exp = parseInt(enemyExp.value, 10) || 0; markModified(item); renderDbMasterList(true); };
    const enemyGold = document.getElementById('enemy-gold');
    if (enemyGold) enemyGold.onchange = () => { item.gold = parseInt(enemyGold.value, 10) || 0; markModified(item); renderDbMasterList(true); };
    const btnEnemy100Drop = document.getElementById('btn-enemy-100-drop');
    if (btnEnemy100Drop) {
      btnEnemy100Drop.onclick = () => {
        if (Array.isArray(item.dropItems)) item.dropItems.forEach(d => { if (d && d.kind > 0) d.denominator = 1; });
        markModified(item);
        showToast('Enemy drop rate set to 100%.', 'success');
      };
    }
    const btnEnemy1Hp = document.getElementById('btn-enemy-1hp');
    if (btnEnemy1Hp) {
      btnEnemy1Hp.onclick = () => {
        if (Array.isArray(item.params) && !Array.isArray(item.params[0])) item.params[0] = 1;
        markModified(item);
        renderDbDetail(item);
        showToast('Enemy Max HP set to 1.', 'success');
      };
    }

    const classExpBasis = document.getElementById('class-exp-basis');
    if (classExpBasis) {
      classExpBasis.onchange = () => {
        if (!Array.isArray(item.expParams)) item.expParams = [30, 20, 30, 30];
        item.expParams[0] = Math.max(1, parseInt(classExpBasis.value, 10) || 10);
        markModified(item);
      };
    }
    const btnClassFast = document.getElementById('btn-class-fast-exp');
    if (btnClassFast) {
      btnClassFast.onclick = () => {
        item.expParams = [10, 0, 0, 0];
        markModified(item);
        renderDbDetail(item);
        showToast('Fast leveling EXP curve applied.', 'success');
      };
    }
    const btnClassSkills = document.getElementById('btn-class-lv1-skills');
    if (btnClassSkills) {
      btnClassSkills.onclick = () => {
        if (Array.isArray(item.learnings)) item.learnings.forEach(l => { if (l) l.level = 1; });
        markModified(item);
        showToast('All class skills set to unlock at Level 1.', 'success');
      };
    }
    const btnClass2x = document.getElementById('btn-class-2x-curve');
    if (btnClass2x) {
      btnClass2x.onclick = () => {
        if (Array.isArray(item.params) && Array.isArray(item.params[0])) {
          item.params = item.params.map(row => Array.isArray(row) ? row.map(v => Math.min(9999, (Number(v) || 0) * 2)) : row);
        }
        markModified(item);
        showToast('Doubled class stat curve across all levels.', 'success');
      };
    }

    const actorInitLvl = document.getElementById('actor-init-lvl');
    if (actorInitLvl) actorInitLvl.onchange = () => { item.initialLevel = parseInt(actorInitLvl.value, 10) || 1; markModified(item); renderDbMasterList(true); };
    const actorMaxLvl = document.getElementById('actor-max-lvl');
    if (actorMaxLvl) actorMaxLvl.onchange = () => { item.maxLevel = parseInt(actorMaxLvl.value, 10) || 99; markModified(item); renderDbMasterList(true); };
    const actorNick = document.getElementById('actor-nickname');
    if (actorNick) actorNick.onchange = () => { item.nickname = actorNick.value; markModified(item); };
    const btnActorCap999 = document.getElementById('btn-actor-cap-999');
    if (btnActorCap999) {
      btnActorCap999.onclick = () => {
        item.maxLevel = 999;
        markModified(item);
        renderDbMasterList();
        showToast('Max Level cap set to 999.', 'success');
      };
    }
    const btnActorInit99 = document.getElementById('btn-actor-init-99');
    if (btnActorInit99) {
      btnActorInit99.onclick = () => {
        item.initialLevel = 99;
        markModified(item);
        renderDbMasterList();
        showToast('Initial Level set to 99.', 'success');
      };
    }
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
    triggerBlobDownload(blob, currentDb.fileName, 'Database.json');
    showToast(\`Downloaded \${currentDb.fileName}.\`, 'success');
  }

  const btnDbDl = document.getElementById('btn-db-download');
  if (btnDbDl) btnDbDl.onclick = downloadDatabaseFile;

  const btnDbDlAll = document.getElementById('btn-db-download-all');
  if (btnDbDlAll) {
    btnDbDlAll.onclick = () => {
      const cats = Object.keys(dbStore).filter(c => dbStore[c] && dbStore[c].items && dbStore[c].items.length > 0 && dbStore[c].modifiedIds.size > 0);
      const targetCats = cats.length > 0 ? cats : Object.keys(dbStore).filter(c => dbStore[c] && dbStore[c].items && dbStore[c].items.length > 0);
      if (targetCats.length === 0) {
        showToast('No database files loaded to download.', 'warn');
        return;
      }
      targetCats.forEach(c => {
        const st = dbStore[c];
        const blob = new Blob([JSON.stringify(st.items, null, 2)], { type: 'application/json;charset=utf-8' });
        triggerBlobDownload(blob, st.fileName, c + '.json');
      });
      showToast(\`Downloaded \${targetCats.length} database file(s).\`, 'success');
    };
  }

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
        if (parsed.format === 'json' && parsed.root) {
          const r = parsed.root;
          const isRubyJson = Array.isArray(r) && r.some(x => x && (x.__ruby_class__ || x['@gold'] !== undefined || x['@data'] !== undefined));
          const isDbArray = Array.isArray(r) && !isRubyJson && r.some(x => x && typeof x === 'object' && typeof x.id === 'number');
          const isSystemJson = !Array.isArray(r) && typeof r === 'object' && (Array.isArray(r.variables) || Array.isArray(r.switches)) && !r.party && !r.actors;
          if (isDbArray || isSystemJson) {
            applyDatabaseJson(file.name, r, null, true);
            return;
          }
        }
        currentFile = {
          name: file.name, size: rawBytes.byteLength, rawBytes: rawBytes,
          format: parsed.format, formatLabel: parsed.formatLabel,
          parsedRoot: parsed.root, engine: parsed.engine
        };

        compareBaseline = null;
        varsRenderLimit = 250;
        switchesRenderLimit = 250;
        rawRenderLimit = 100;
        activeCharacterIndex = 1;
        const btnClearCompare = document.getElementById('btn-clear-compare-vars');
        if (btnClearCompare) btnClearCompare.style.display = 'none';
        const diffBanner = document.getElementById('vars-diff-banner');
        if (diffBanner) diffBanner.style.display = 'none';

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
    const rawText = textDecoder.decode(rawBytes);
    const text = rawText.trim();

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

    const MAX_DECOMPRESSED_LEN = 100 * 1024 * 1024;
    if (typeof pako !== 'undefined') {
      for (const candidate of [rawText, text]) {
        try {
          const unzipped = pako.inflate(candidate, { to: 'string' });
          if (unzipped && unzipped.length <= MAX_DECOMPRESSED_LEN && (unzipped.startsWith('{') || unzipped.startsWith('['))) {
            return { format: 'rmmzsave', formatLabel: 'RPG Maker MZ (.rmmzsave)', root: JSON.parse(unzipped), engine: 'mz' };
          }
        } catch (e) {}
      }
      try {
        const unzipped = pako.inflate(rawBytes, { to: 'string' });
        if (unzipped && unzipped.length <= MAX_DECOMPRESSED_LEN && (unzipped.startsWith('{') || unzipped.startsWith('['))) {
          return { format: 'rmmzsave_bin', formatLabel: 'RPG Maker MZ / Zlib', root: JSON.parse(unzipped), engine: 'mz' };
        }
      } catch (e) {}
    }

    if (fileName.endsWith('.rpgsave') || /^[A-Za-z0-9+/=]+$/.test(text)) {
      try {
        const decompressed = LZString.decompressFromBase64(text);
        if (decompressed && decompressed.length <= MAX_DECOMPRESSED_LEN && (decompressed.startsWith('{') || decompressed.startsWith('['))) {
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
    let partyObj = null, actorsObj = null, varsObj = null, swObj = null, sysObj = null, playerObj = null;
    if (Array.isArray(root)) {
      for (const item of root) {
        if (!item || typeof item !== 'object') continue;
        const cls = item.__ruby_class__ || '';
        if (!cls && !Array.isArray(item) && (item.party || item.actors || item.variables || item.switches || item.system || item.player)) {
          if (item.party) partyObj = item.party;
          if (item.actors) actorsObj = item.actors;
          if (item.variables) varsObj = item.variables;
          if (item.switches) swObj = item.switches;
          if (item.system) sysObj = item.system;
          if (item.player) playerObj = item.player;
          continue;
        }
        if (cls.includes('Party') || item['@gold'] !== undefined) partyObj = item;
        else if (cls.includes('Actors') || (item['@data'] && Array.isArray(item['@data']) && item['@data'][1] && item['@data'][1]['@name'])) actorsObj = item;
        else if (cls.includes('Variables') || (cls.includes('System') && item['@variables'])) varsObj = item;
        else if (cls.includes('Switches') || (cls.includes('System') && item['@switches'])) swObj = item;
        else if (cls.includes('System')) sysObj = item;
        else if (cls.includes('Player')) playerObj = item;
      }
      if (!partyObj && root[8] && root[8]['@gold'] !== undefined) partyObj = root[8];
      if (!partyObj && root[4] && root[4]['@gold'] !== undefined) partyObj = root[4];
      if (!actorsObj && root[7] && root[7]['@data']) actorsObj = root[7];
      if (!actorsObj && root[10] && root[10]['@data']) actorsObj = root[10];
      if (!varsObj && root[4] && root[4]['@data']) varsObj = root[4];
      if (!varsObj && root[8] && root[8]['@data']) varsObj = root[8];
      if (!swObj && root[3] && root[3]['@data']) swObj = root[3];
      if (!swObj && root[9] && root[9]['@data']) swObj = root[9];
    } else if (root && typeof root === 'object') {
      partyObj = root.party || root['@party'] || {};
      actorsObj = root.actors || root['@actors'] || {};
      varsObj = root.variables || root['@variables'] || {};
      swObj = root.switches || root['@switches'] || {};
      sysObj = root.system || root['@system'] || null;
      playerObj = root.player || root['@player'] || null;
    }
    return { party: partyObj, actors: actorsObj, variables: varsObj, switches: swObj, system: sysObj, player: playerObj };
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
      if (num === originalGold) {
        saveChanges.delete('Gold');
        const badge = document.getElementById('label-changes');
        if (badge) badge.textContent = saveChanges.size + ' CHANGES';
      } else {
        markSaveModified('Gold');
      }
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
        if (getActorExp(actor) < 999999) setActorExp(actor, 9999999);
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
        ['@maxhp_plus', '@maxsp_plus', '@str_plus', '@dex_plus', '@agi_plus', '@int_plus'].forEach(k => {
          if (actor[k] !== undefined) actor[k] = 9999;
        });
      });

      if (adapt.party) {
        const items = ensurePartyBag(adapt.party, 'items');
        const weapons = ensurePartyBag(adapt.party, 'weapons');
        const armors = ensurePartyBag(adapt.party, 'armors');
        Object.keys(items).forEach(k => {
          if (gameData.itemTypes && gameData.itemTypes[k] === 2) return;
          if (items[k] > 0) items[k] = 99;
        });
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
        if (currentAppMode !== 'save' || !currentFile || !currentFile.parsedRoot || currentFile.engine === 'wolf') return;
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

    const btnCompare = document.getElementById('btn-compare-save-vars');
    const compareInput = document.getElementById('compare-save-input');
    const btnClearCompare = document.getElementById('btn-clear-compare-vars');
    if (btnCompare && compareInput) {
      btnCompare.onclick = () => compareInput.click();
      compareInput.onchange = (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        if (f.size > 50 * 1024 * 1024) {
          showToast('Comparison file exceeds the 50MB safety limit.', 'danger');
          compareInput.value = '';
          return;
        }
        const r = new FileReader();
        r.onload = async () => {
          try {
            const p = await parseSaveData(new Uint8Array(r.result), f.name);
            const ad = getGameAdapters(p.root, p.engine);
            compareBaseline = {
              fileName: f.name,
              vars: getJsonExArray(ad.variables ? (ad.variables['@data'] || ad.variables._data || ad.variables) : []),
              switches: getJsonExArray(ad.switches ? (ad.switches['@data'] || ad.switches._data || ad.switches) : [])
            };
            if (btnClearCompare) btnClearCompare.style.display = 'inline-block';
            renderVariablesTab(adapt.variables);
            renderSwitchesTab(adapt.switches);
            showToast('Compared against ' + f.name, 'success');
          } catch (err) {
            showToast('Could not parse comparison save: ' + err.message, 'danger');
          }
        };
        r.readAsArrayBuffer(f);
        compareInput.value = '';
      };
    }
    if (btnClearCompare) {
      btnClearCompare.onclick = () => {
        compareBaseline = null;
        btnClearCompare.style.display = 'none';
        renderVariablesTab(adapt.variables);
        renderSwitchesTab(adapt.switches);
        showToast('Cleared save comparison filter.', 'info');
      };
    }

    renderSystemQolBar(adapt.system, adapt.player);
    renderCharactersTab(adapt.actors);
    renderInventoryTab(adapt.party);
    renderWeaponsTab(adapt.party);
    renderArmorsTab(adapt.party);
    renderVariablesTab(adapt.variables);
    renderSwitchesTab(adapt.switches);
  }

  function renderWolfRpgTab() {
    const charDropdown = document.getElementById('char-dropdown');
    const safeWolfName = escapeHtml(currentFile.name || 'SaveData.sav');
    charDropdown.innerHTML = '<option>WOLF RPG Editor: ' + safeWolfName + '</option>';
    document.getElementById('badge-char-count').textContent = 'WOLF';
    document.getElementById('badge-item-count').textContent = '0';
    document.getElementById('badge-weapon-count').textContent = '0';
    document.getElementById('badge-armor-count').textContent = '0';
    document.getElementById('badge-var-count').textContent = '0';
    document.getElementById('badge-switch-count').textContent = '0';
    const goldInput = document.getElementById('quick-gold-input');
    if (goldInput) goldInput.value = 0;
    ['qol-system-bar', 'char-skills-panel', 'inventory-cards-container', 'weapons-cards-container', 'armors-cards-container', 'variables-cards-container', 'switches-cards-container'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '';
    });

    const container = document.getElementById('char-stats-container');
    container.innerHTML = \`
      <div style="grid-column: 1 / -1; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h3 style="color:var(--accent-sand); margin:0 0 4px 0;">WOLF RPG Editor Save Detected</h3>
          <div style="color:var(--text-secondary); font-size:0.84rem;">File: <b>\${safeWolfName}</b> (\${formatBytes(currentFile.size)}) | Engine: WOLF RPG Editor Pro 3.50+</div>
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
    const skillsPanel = document.getElementById('char-skills-panel');
    if (skillsPanel) skillsPanel.innerHTML = '';
    if (!actorsObj) {
      document.getElementById('badge-char-count').textContent = '0';
      return;
    }

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

    const hasCurrentIdx = validActors.some(v => v.index === activeCharacterIndex);
    if (!hasCurrentIdx) activeCharacterIndex = validActors[0].index;
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

    const btnCureStates = document.getElementById('btn-char-cure-states');
    if (btnCureStates) {
      btnCureStates.onclick = () => {
        const actor = actorsData[activeCharacterIndex];
        if (!actor) return;
        let cleared = 0;
        if (Array.isArray(actor._states)) { cleared = actor._states.length; actor._states = []; }
        else if (actor._states && Array.isArray(actor._states['@a'])) { cleared = actor._states['@a'].length; actor._states['@a'] = []; }
        if (Array.isArray(actor['@states'])) { cleared = actor['@states'].length; actor['@states'] = []; }
        else if (actor['@states'] && Array.isArray(actor['@states']['@a'])) { cleared = actor['@states']['@a'].length; actor['@states']['@a'] = []; }
        renderCharacterStats(actor);
        markSaveModified('Cure States');
        showToast(\`Cleared \${cleared} active status effect(s).\`, 'success');
      };
    }

    document.getElementById('btn-char-max-stats').onclick = () => {
      const actor = actorsData[activeCharacterIndex];
      if (!actor) return;
      if (actor._level !== undefined) actor._level = 99;
      if (actor['@level'] !== undefined) actor['@level'] = 99;
      if (getActorExp(actor) < 999999) setActorExp(actor, 9999999);
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
      ['@maxhp_plus', '@maxsp_plus', '@str_plus', '@dex_plus', '@agi_plus', '@int_plus'].forEach(k => {
        if (actor[k] !== undefined) actor[k] = 9999;
      });
      renderCharacterStats(actor);
      markSaveModified('Max Stats');
      showToast('All character stats and bonuses set to 9999.', 'success');
    };
  }

  function getActorExp(actor) {
    if (!actor) return 0;
    const raw = actor['@exp'] !== undefined ? actor['@exp'] : actor._exp;
    if (typeof raw === 'number') return raw;
    if (raw && typeof raw === 'object') {
      const classId = actor._classId || actor['@class_id'] || 1;
      if (Array.isArray(raw['@a']) && raw['@a'][classId] !== undefined) return Number(raw['@a'][classId]) || 0;
      if (raw[classId] !== undefined) return Number(raw[classId]) || 0;
      const keys = Object.keys(raw).filter(k => !k.startsWith('@') && raw[k] !== null && raw[k] !== undefined);
      if (keys.length > 0) return Number(raw[keys[0]]) || 0;
    }
    return 0;
  }

  function setActorExp(actor, val) {
    if (!actor) return;
    const num = Math.max(0, parseInt(val, 10) || 0);
    const rawClassId = actor._classId || actor['@class_id'] || 1;
    const classId = isSafeKey(rawClassId) ? rawClassId : 1;
    if (actor['@exp'] !== undefined) {
      if (typeof actor['@exp'] === 'number') {
        actor['@exp'] = num;
      } else if (actor['@exp'] && typeof actor['@exp'] === 'object') {
        actor['@exp'][classId] = num;
        Object.keys(actor['@exp']).filter(k => !k.startsWith('@') && isSafeKey(k)).forEach(k => { actor['@exp'][k] = num; });
      }
      return;
    }
    if (typeof actor._exp === 'number') {
      actor._exp = num;
    } else {
      if (!actor._exp || typeof actor._exp !== 'object') actor._exp = {};
      if (Array.isArray(actor._exp['@a'])) {
        actor._exp['@a'][classId] = num;
      } else {
        actor._exp[classId] = num;
        Object.keys(actor._exp).filter(k => !k.startsWith('@') && isSafeKey(k)).forEach(k => { actor._exp[k] = num; });
      }
    }
  }

  function renderSystemQolBar(sysObj, playerObj) {
    const qolBar = document.getElementById('qol-system-bar');
    if (!qolBar) return;
    qolBar.innerHTML = '';
    if (!sysObj && !playerObj) return;

    if (playerObj) {
      const spdKey = playerObj['@move_speed'] !== undefined ? '@move_speed' : '_moveSpeed';
      const curSpd = playerObj[spdKey] !== undefined ? playerObj[spdKey] : 4;
      const spdCard = document.createElement('div');
      spdCard.className = 'stat-card';
      spdCard.innerHTML = \`
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="stat-title">MOVE SPEED</span>
          <span class="stat-desc">4=Normal, 5=Fast, 6=Max</span>
        </div>
        <input type="number" id="qol-move-speed" class="stat-input" min="1" max="6" value="\${escapeHtml(curSpd)}">
      \`;
      spdCard.querySelector('input').onchange = (e) => {
        const v = Math.min(6, Math.max(1, parseInt(e.target.value, 10) || 4));
        playerObj[spdKey] = v;
        e.target.value = v;
        markSaveModified('Move Speed');
      };
      qolBar.appendChild(spdCard);

      const thrKey = playerObj['@through'] !== undefined ? '@through' : '_through';
      const isThr = Boolean(playerObj[thrKey]);
      const thrCard = document.createElement('div');
      thrCard.className = 'stat-card';
      thrCard.innerHTML = \`
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="stat-title">NO-CLIP (WALK THRU)</span>
          <label class="toggle-switch"><input type="checkbox" id="qol-noclip" \${isThr?'checked':''}><span class="slider"></span></label>
        </div>
        <span class="stat-desc">Bypass walls / stuck tiles</span>
      \`;
      thrCard.querySelector('input').onchange = (e) => {
        playerObj[thrKey] = e.target.checked;
        markSaveModified('No-Clip');
      };
      qolBar.appendChild(thrCard);
    }

    if (sysObj) {
      const isRuby = sysObj['@save_disabled'] !== undefined || currentFile.engine === 'ruby';
      const saveAllowed = isRuby ? !sysObj['@save_disabled'] : (sysObj._saveEnabled !== false);
      const saveCard = document.createElement('div');
      saveCard.className = 'stat-card';
      saveCard.innerHTML = \`
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="stat-title">ALLOW SAVE</span>
          <label class="toggle-switch"><input type="checkbox" id="qol-allow-save" \${saveAllowed?'checked':''}><span class="slider"></span></label>
        </div>
        <span class="stat-desc">Unlock saving anywhere</span>
      \`;
      saveCard.querySelector('input').onchange = (e) => {
        if (isRuby) sysObj['@save_disabled'] = !e.target.checked;
        else sysObj._saveEnabled = e.target.checked;
        markSaveModified('Allow Save');
      };
      qolBar.appendChild(saveCard);

      const encAllowed = isRuby ? !sysObj['@encounter_disabled'] : (sysObj._encounterEnabled !== false);
      const encCard = document.createElement('div');
      encCard.className = 'stat-card';
      encCard.innerHTML = \`
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="stat-title">ENCOUNTERS</span>
          <label class="toggle-switch"><input type="checkbox" id="qol-encounters" \${encAllowed?'checked':''}><span class="slider"></span></label>
        </div>
        <span class="stat-desc">Random monster battles</span>
      \`;
      encCard.querySelector('input').onchange = (e) => {
        if (isRuby) sysObj['@encounter_disabled'] = !e.target.checked;
        else sysObj._encounterEnabled = e.target.checked;
        markSaveModified('Encounters');
      };
      qolBar.appendChild(encCard);
    }
  }

  function renderCharacterStats(actor) {
    const container = document.getElementById('char-stats-container');
    container.innerHTML = '';
    if (!actor) return;

    function makeCard(title, label, val, onCommit, isString = false) {
      const card = document.createElement('div');
      card.className = 'stat-card';
      card.innerHTML = \`
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="stat-title">\${escapeHtml(title)}</span>
          <span class="stat-desc">\${escapeHtml(label)}</span>
        </div>
        <input type="text" class="stat-input" value="\${escapeHtml(val)}">
      \`;
      const input = card.querySelector('input');
      input.onchange = () => {
        if (isString) {
          onCommit(String(input.value));
        } else {
          const num = Math.trunc(Number(input.value) || 0);
          input.value = num;
          onCommit(num);
        }
        markSaveModified('Stat ' + title);
      };
      container.appendChild(card);
      return input;
    }

    function updateDropdownOption() {
      const dd = document.getElementById('char-dropdown');
      if (!dd || !dd.children) return;
      const opt = Array.from(dd.children).find(o => Number(o.value) === activeCharacterIndex);
      if (opt) {
        const nm = actor._name || actor['@name'] || \`Actor #\${activeCharacterIndex}\`;
        const lv = actor._level || actor['@level'] || 1;
        opt.textContent = \`#\${activeCharacterIndex} — \${nm} (Lv. \${lv})\`;
      }
    }

    const lvlKey = actor['@level'] !== undefined ? '@level' : '_level';
    let expInput = null;
    makeCard('LEVEL', 'Character Level', actor[lvlKey] ?? 1, (v) => {
      const prevLvl = Number(actor[lvlKey]) || 1;
      const nextLvl = Math.max(1, parseInt(v, 10) || 1);
      actor[lvlKey] = nextLvl;
      if (nextLvl < prevLvl || nextLvl === 1) {
        setActorExp(actor, 0);
        if (expInput) expInput.value = 0;
      }
      updateDropdownOption();
    });

    expInput = makeCard('EXP', 'Total Experience', getActorExp(actor), (v) => setActorExp(actor, v));

    const hpKey = actor['@hp'] !== undefined ? '@hp' : '_hp';
    makeCard('HP', 'Current HP', actor[hpKey] ?? 100, (v) => actor[hpKey] = Math.max(0, v));

    const mpKey = actor['@mp'] !== undefined ? '@mp' : (actor['@sp'] !== undefined ? '@sp' : '_mp');
    makeCard('MP / SP', 'Current MP / SP', actor[mpKey] ?? 50, (v) => actor[mpKey] = Math.max(0, v));

    const nameKey = actor['@name'] !== undefined ? '@name' : '_name';
    if (actor[nameKey] !== undefined) {
      makeCard('NAME', 'Character Name', String(actor[nameKey] || ''), (v) => {
        actor[nameKey] = String(v);
        updateDropdownOption();
      }, true);
    }

    const paramPlus = actor._paramPlus || actor['@param_plus'];
    if (paramPlus) {
      const pPlus = getJsonExArray(paramPlus);
      const names = ['MHP', 'MMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI', 'LUK'];
      names.forEach((name, i) => makeCard(name, \`\${name} Bonus\`, pPlus[i] || 0, (v) => pPlus[i] = v));
    } else if (actor['@str_plus'] !== undefined || actor['@maxhp_plus'] !== undefined) {
      const xpStats = [
        ['MHP', '@maxhp_plus'], ['MSP', '@maxsp_plus'], ['STR', '@str_plus'],
        ['DEX', '@dex_plus'], ['AGI', '@agi_plus'], ['INT', '@int_plus']
      ];
      xpStats.forEach(([label, key]) => {
        if (actor[key] !== undefined) makeCard(label, \`\${label} Bonus\`, actor[key] || 0, (v) => actor[key] = v);
      });
    }

    renderCharacterSkills(actor);
  }

  function renderCharacterSkills(actor) {
    const panel = document.getElementById('char-skills-panel');
    if (!panel || !actor) return;
    const rawSkills = actor['@skills'] !== undefined ? actor['@skills'] : actor._skills;
    let skillsArr = [];
    if (Array.isArray(rawSkills)) {
      skillsArr = rawSkills;
    } else if (rawSkills && Array.isArray(rawSkills['@a'])) {
      skillsArr = rawSkills['@a'];
    } else {
      if (actor['@skills'] !== undefined) actor['@skills'] = [];
      else actor._skills = [];
      skillsArr = actor['@skills'] || actor._skills;
    }

    const badgesHtml = skillsArr.map((sid, idx) => {
      const sName = (gameData.skills && gameData.skills[sid]) ? \`#\${sid} \${gameData.skills[sid]}\` : \`Skill #\${sid}\`;
      return \`<span class="meta-pill" style="display:inline-flex; align-items:center; gap:6px; padding:4px 8px;">\${escapeHtml(sName)} <button type="button" class="btn-del-skill" data-idx="\${idx}" style="background:none; border:none; color:var(--text-secondary); cursor:pointer; font-weight:700;">&times;</button></span>\`;
    }).join('');

    panel.innerHTML = \`
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
        <span style="font-size:0.82rem; font-weight:600; color:var(--accent-sand); text-transform:uppercase;">Learned Skills (\${skillsArr.length})</span>
        <div style="display:flex; gap:6px; align-items:center;">
          <input type="number" id="char-add-skill-id" class="stat-input" placeholder="Skill ID" style="width:95px; padding:4px 8px;" min="1">
          <button type="button" class="btn btn-primary btn-sm" id="btn-char-add-skill">+ Learn Skill</button>
        </div>
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:6px;">\${badgesHtml || '<span style="font-size:0.8rem; color:var(--text-secondary);">No skills learned yet.</span>'}</div>
    \`;

    const btnAddSkill = document.getElementById('btn-char-add-skill');
    const inpAddSkill = document.getElementById('char-add-skill-id');
    if (btnAddSkill && inpAddSkill) {
      btnAddSkill.onclick = () => {
        const sid = parseInt(inpAddSkill.value, 10);
        if (!sid || sid <= 0) return;
        if (!skillsArr.includes(sid)) {
          skillsArr.push(sid);
          markSaveModified('Learn Skill #' + sid);
          renderCharacterSkills(actor);
          showToast('Learned Skill #' + sid, 'success');
        }
      };
    }
    panel.querySelectorAll('.btn-del-skill').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (!isNaN(idx)) {
          skillsArr.splice(idx, 1);
          markSaveModified('Remove Skill');
          renderCharacterSkills(actor);
        }
      };
    });
  }

  function isDummyDbName(name) {
    if (!name) return true;
    const t = String(name).trim();
    return t === '' || /^[-=_*#]+/.test(t);
  }

  function populateEntityPicker(selectEl, dictObj, typeMap = null) {
    if (!selectEl) return;
    const ids = Object.keys(dictObj || {}).filter(id => !isDummyDbName(dictObj[id]));
    if (ids.length === 0) {
      selectEl.style.display = 'none';
      return;
    }
    selectEl.style.display = 'inline-block';
    selectEl.innerHTML = '<option value="">-- Select from DB --</option>' + ids.map(id => {
      const tag = (typeMap && typeMap[id] === 2) ? ' [Key]' : '';
      return \`<option value="\${escapeHtml(id)}">#\${escapeHtml(id)} \${escapeHtml(dictObj[id])}\${tag}</option>\`;
    }).join('');
  }

  function renderInventoryTab(partyObj) {
    const container = document.getElementById('inventory-cards-container');
    container.innerHTML = '';
    if (!partyObj) {
      document.getElementById('badge-item-count').textContent = '0';
      return;
    }
    const itemsObj = ensurePartyBag(partyObj, 'items');
    const itemIds = Object.keys(itemsObj).filter(k => !k.startsWith('@'));
    document.getElementById('badge-item-count').textContent = itemIds.length;

    const picker = document.getElementById('inventory-picker-select');
    populateEntityPicker(picker, gameData.items, gameData.itemTypes);

    document.getElementById('btn-items-set-all-99').onclick = () => {
      let count = 0;
      itemIds.forEach(id => {
        if (gameData.itemTypes && gameData.itemTypes[id] === 2) return;
        if (itemsObj[id] > 0) {
          itemsObj[id] = 99;
          count++;
        }
      });
      renderInventoryTab(partyObj);
      markSaveModified('Items 99');
      showToast('Set ' + count + ' owned items to 99.', 'success');
    };

    const btnUnlockSafe = document.getElementById('btn-items-unlock-safe');
    if (btnUnlockSafe) {
      btnUnlockSafe.onclick = () => {
        const dbIds = Object.keys(gameData.items || {});
        if (dbIds.length === 0) {
          showToast('Drop Items.json in Data Files tab first so Key Items can be safely filtered out.', 'warn');
          return;
        }
        let added = 0;
        let skippedKey = 0;
        dbIds.forEach(id => {
          if (isDummyDbName(gameData.items[id])) return;
          if (gameData.itemTypes && gameData.itemTypes[id] === 2) {
            skippedKey++;
            return;
          }
          itemsObj[id] = 99;
          added++;
        });
        renderInventoryTab(partyObj);
        markSaveModified('Safe Unlock Items');
        showToast(\`Unlocked \${added} regular items (skipped \${skippedKey} Key Items for safety).\`, 'success');
      };
    }

    document.getElementById('btn-add-item-dialog').onclick = () => {
      const picked = picker && picker.value ? picker.value : null;
      const rawId = picked || prompt('Enter Item ID to add:');
      const id = parseInt(rawId, 10);
      if (!id || id <= 0) return;
      let val = 99;
      if (!picked) {
        const rawQty = prompt('Enter quantity (1-99):', '99');
        if (rawQty === null) return;
        val = Math.max(1, parseInt(rawQty, 10) || 99);
      }
      itemsObj[id] = val;
      if (picker) picker.value = '';
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
          <span style="font-size:0.74rem; color:var(--text-secondary); font-family:var(--font-mono);">#\${escapeHtml(id)}</span>
        </div>
        <div style="display:flex; align-items:center; gap:4px;">
          <button class="btn btn-secondary btn-sm btn-sub" type="button">-</button>
          <input type="number" class="stat-input" value="\${escapeHtml(count)}" style="text-align:center; padding:4px;">
          <button class="btn btn-secondary btn-sm btn-add" type="button">+</button>
          <button class="btn btn-secondary btn-sm btn-99" type="button">99</button>
        </div>
      \`;

      const input = card.querySelector('input');
      const commit = (v) => {
        const clamped = Math.max(0, v);
        itemsObj[id] = clamped;
        input.value = clamped;
        markSaveModified('Item #' + id);
      };
      input.onchange = () => commit(parseInt(input.value, 10) || 0);
      card.querySelector('.btn-sub').onclick = () => commit(Math.max(0, (parseInt(input.value, 10)||0)-1));
      card.querySelector('.btn-add').onclick = () => commit((parseInt(input.value, 10)||0)+1);
      card.querySelector('.btn-99').onclick = () => commit(99);

      container.appendChild(card);
    });
  }

  function renderWeaponsTab(partyObj) {
    const container = document.getElementById('weapons-cards-container');
    container.innerHTML = '';
    if (!partyObj) {
      document.getElementById('badge-weapon-count').textContent = '0';
      return;
    }
    const weaponsObj = ensurePartyBag(partyObj, 'weapons');
    const ids = Object.keys(weaponsObj).filter(k => !k.startsWith('@'));
    document.getElementById('badge-weapon-count').textContent = ids.length;

    const picker = document.getElementById('weapons-picker-select');
    populateEntityPicker(picker, gameData.weapons);

    const btnSet99 = document.getElementById('btn-weapons-set-all-99');
    if (btnSet99) {
      btnSet99.onclick = () => {
        let c = 0;
        ids.forEach(id => { if (weaponsObj[id] > 0) { weaponsObj[id] = 99; c++; } });
        renderWeaponsTab(partyObj);
        markSaveModified('Weapons 99');
        showToast('Set ' + c + ' owned weapons to 99.', 'success');
      };
    }

    const btnUnlockAll = document.getElementById('btn-weapons-unlock-all');
    if (btnUnlockAll) {
      btnUnlockAll.onclick = () => {
        const dbIds = Object.keys(gameData.weapons || {}).filter(id => !isDummyDbName(gameData.weapons[id]));
        if (dbIds.length === 0) {
          showToast('Drop Weapons.json first to unlock all database weapons.', 'warn');
          return;
        }
        dbIds.forEach(id => { weaponsObj[id] = 99; });
        renderWeaponsTab(partyObj);
        markSaveModified('Unlock All Weapons');
        showToast('Unlocked ' + dbIds.length + ' weapons (x99).', 'success');
      };
    }

    document.getElementById('btn-add-weapon-dialog').onclick = () => {
      const picked = picker && picker.value ? picker.value : null;
      const rawId = picked || prompt('Enter Weapon ID to add:');
      const id = parseInt(rawId, 10);
      if (!id || id <= 0) return;
      weaponsObj[id] = (weaponsObj[id] || 0) + 1;
      if (picker) picker.value = '';
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
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-primary); font-weight:600;" title="\${escapeHtml(name)}">\${escapeHtml(name)}</span><span style="font-size:0.74rem; color:var(--text-secondary); font-family:var(--font-mono);">#\${escapeHtml(id)}</span></div>
        <input type="number" class="stat-input" value="\${escapeHtml(count)}" style="padding:5px 8px;">
      \`;
      card.querySelector('input').onchange = (e) => {
        const v = Math.max(0, parseInt(e.target.value, 10) || 0);
        weaponsObj[id] = v;
        e.target.value = v;
        markSaveModified('Weapon #' + id);
      };
      container.appendChild(card);
    });
  }

  function renderArmorsTab(partyObj) {
    const container = document.getElementById('armors-cards-container');
    container.innerHTML = '';
    if (!partyObj) {
      document.getElementById('badge-armor-count').textContent = '0';
      return;
    }
    const armorsObj = ensurePartyBag(partyObj, 'armors');
    const ids = Object.keys(armorsObj).filter(k => !k.startsWith('@'));
    document.getElementById('badge-armor-count').textContent = ids.length;

    const picker = document.getElementById('armors-picker-select');
    populateEntityPicker(picker, gameData.armors);

    const btnSet99 = document.getElementById('btn-armors-set-all-99');
    if (btnSet99) {
      btnSet99.onclick = () => {
        let c = 0;
        ids.forEach(id => { if (armorsObj[id] > 0) { armorsObj[id] = 99; c++; } });
        renderArmorsTab(partyObj);
        markSaveModified('Armors 99');
        showToast('Set ' + c + ' owned armors to 99.', 'success');
      };
    }

    const btnUnlockAll = document.getElementById('btn-armors-unlock-all');
    if (btnUnlockAll) {
      btnUnlockAll.onclick = () => {
        const dbIds = Object.keys(gameData.armors || {}).filter(id => !isDummyDbName(gameData.armors[id]));
        if (dbIds.length === 0) {
          showToast('Drop Armors.json first to unlock all database armors.', 'warn');
          return;
        }
        dbIds.forEach(id => { armorsObj[id] = 99; });
        renderArmorsTab(partyObj);
        markSaveModified('Unlock All Armors');
        showToast('Unlocked ' + dbIds.length + ' armors (x99).', 'success');
      };
    }

    document.getElementById('btn-add-armor-dialog').onclick = () => {
      const picked = picker && picker.value ? picker.value : null;
      const rawId = picked || prompt('Enter Armor ID to add:');
      const id = parseInt(rawId, 10);
      if (!id || id <= 0) return;
      armorsObj[id] = (armorsObj[id] || 0) + 1;
      if (picker) picker.value = '';
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
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-primary); font-weight:600;" title="\${escapeHtml(name)}">\${escapeHtml(name)}</span><span style="font-size:0.74rem; color:var(--text-secondary); font-family:var(--font-mono);">#\${escapeHtml(id)}</span></div>
        <input type="number" class="stat-input" value="\${escapeHtml(count)}" style="padding:5px 8px;">
      \`;
      card.querySelector('input').onchange = (e) => {
        const v = Math.max(0, parseInt(e.target.value, 10) || 0);
        armorsObj[id] = v;
        e.target.value = v;
        markSaveModified('Armor #' + id);
      };
      container.appendChild(card);
    });
  }

  let varsRenderLimit = 250;
  let switchesRenderLimit = 250;

  function renderVariablesTab(varsObj) {
    const container = document.getElementById('variables-cards-container');
    container.innerHTML = '';
    if (!varsObj) {
      document.getElementById('badge-var-count').textContent = '0';
      return;
    }
    const varsArr = getJsonExArray(varsObj['@data'] || varsObj._data || varsObj);
    const nonZeroOnly = document.getElementById('vars-nonzero-only').checked;
    const q = document.getElementById('variables-search').value.trim().toLowerCase().replace(/^#/, '');
    const diffBanner = document.getElementById('vars-diff-banner');

    let count = 0;
    let rendered = 0;
    const maxNamedVar = Object.keys(gameData.variables || {}).reduce((m, k) => Math.max(m, Number(k) || 0), 0);
    const maxLen = Math.max(varsArr.length, compareBaseline ? compareBaseline.vars.length : 0, maxNamedVar ? maxNamedVar + 1 : 0);
    for (let id = 1; id < maxLen; id++) {
      const val = varsArr[id];
      const baseVal = compareBaseline ? compareBaseline.vars[id] : undefined;
      if (compareBaseline) {
        if ((val ?? 0) === (baseVal ?? 0)) continue;
      } else {
        if (nonZeroOnly && (val === undefined || val === null || val === 0 || val === '0')) continue;
        if (!nonZeroOnly && (val === undefined || val === null) && !(gameData.variables && gameData.variables[id])) continue;
      }
      const vName = (gameData && gameData.variables && gameData.variables[id]) || \`Variable #\${id}\`;
      if (q && !String(id).includes(q) && !String(val ?? '').toLowerCase().includes(q) && !vName.toLowerCase().includes(q)) continue;
      count++;
      if (rendered >= varsRenderLimit) continue;
      rendered++;

      const diffSub = compareBaseline ? \` <span style="color:var(--accent-sand); font-size:0.72rem;">(Was: \${escapeHtml(String(baseVal ?? 0))})</span>\` : '';
      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = \`
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-primary); font-weight:600;" title="\${escapeHtml(vName)}">\${escapeHtml(vName)}\${diffSub}</span><span style="font-size:0.74rem; color:var(--text-secondary); font-family:var(--font-mono);">#\${escapeHtml(id)}</span></div>
        <input type="text" class="stat-input" value="\${escapeHtml(val ?? 0)}" style="padding:5px 8px;">
      \`;
      card.querySelector('input').onchange = (e) => {
        let n = e.target.value;
        if (/^-?\\d+$/.test(n)) n = parseInt(n, 10);
        else if (/^-?\\d+\\.\\d+$/.test(n)) n = parseFloat(n);
        varsArr[id] = n;
        markSaveModified('Var #' + id);
      };
      container.appendChild(card);
    }
    if (count > rendered) {
      const moreBtn = document.createElement('button');
      moreBtn.type = 'button';
      moreBtn.className = 'btn btn-secondary btn-sm';
      moreBtn.style.gridColumn = '1 / -1';
      moreBtn.textContent = \`Show More Variables (\${rendered} / \${count})\`;
      moreBtn.onclick = () => {
        varsRenderLimit += 500;
        renderVariablesTab(varsObj);
      };
      container.appendChild(moreBtn);
    }
    if (diffBanner) {
      if (compareBaseline) {
        diffBanner.style.display = 'block';
        diffBanner.textContent = \`Comparing against \${compareBaseline.fileName}: Showing \${count} changed variable(s).\`;
      } else {
        diffBanner.style.display = 'none';
      }
    }
    document.getElementById('badge-var-count').textContent = count;
  }

  function renderSwitchesTab(swObj) {
    const container = document.getElementById('switches-cards-container');
    container.innerHTML = '';
    if (!swObj) {
      document.getElementById('badge-switch-count').textContent = '0';
      return;
    }
    const swArr = getJsonExArray(swObj['@data'] || swObj._data || swObj);
    const qEl = document.getElementById('switches-search');
    const q = qEl ? qEl.value.trim().toLowerCase().replace(/^#/, '') : '';
    const fEl = document.getElementById('switches-filter');
    const filter = fEl ? fEl.value : 'all';

    let trueCount = 0;
    let matchCount = 0;
    let rendered = 0;
    const maxNamedSw = Object.keys(gameData.switches || {}).reduce((m, k) => Math.max(m, Number(k) || 0), 0);
    const maxLen = Math.max(swArr.length, compareBaseline ? compareBaseline.switches.length : 0, maxNamedSw ? maxNamedSw + 1 : 0);
    for (let id = 1; id < maxLen; id++) {
      const val = Boolean(swArr[id]);
      if (val) trueCount++;
      if (filter === 'on' && !val) continue;
      if (filter === 'off' && val) continue;
      if (filter === 'diff' && (!compareBaseline || Boolean(compareBaseline.switches[id]) === val)) continue;
      const name = (gameData && gameData.switches && gameData.switches[id]) || \`Switch #\${id}\`;
      if (q && !String(id).includes(q) && !name.toLowerCase().includes(q)) continue;
      matchCount++;
      if (rendered >= switchesRenderLimit) continue;
      rendered++;

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
    if (matchCount > rendered) {
      const moreBtn = document.createElement('button');
      moreBtn.type = 'button';
      moreBtn.className = 'btn btn-secondary btn-sm';
      moreBtn.style.gridColumn = '1 / -1';
      moreBtn.textContent = \`Show More Switches (\${rendered} / \${matchCount})\`;
      moreBtn.onclick = () => {
        switchesRenderLimit += 500;
        renderSwitchesTab(swObj);
      };
      container.appendChild(moreBtn);
    }
    document.getElementById('badge-switch-count').textContent = trueCount;
  }

  function setByTokens(obj, tokens, val) {
    let cur = obj;
    for (let i = 0; i < tokens.length - 1; i++) {
      if (!cur) return;
      const k = tokens[i];
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') return;
      cur = cur[k];
    }
    if (cur && tokens.length > 0) {
      const lastKey = tokens[tokens.length - 1];
      if (lastKey === '__proto__' || lastKey === 'constructor' || lastKey === 'prototype') return;
      cur[lastKey] = val;
    }
  }

  function getByTokens(obj, tokens) {
    let cur = obj;
    for (let i = 0; i < tokens.length; i++) {
      if (cur === null || cur === undefined) return undefined;
      if (!isSafeKey(tokens[i])) return undefined;
      cur = cur[tokens[i]];
    }
    return cur;
  }

  let rawRenderLimit = 100;

  function renderRawTable() {
    const tbody = document.getElementById('raw-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const searchEl = document.getElementById('raw-search-input');
    const q = searchEl && searchEl.value ? searchEl.value.trim().toLowerCase() : '';

    let matched = 0;
    let shown = 0;
    flatEntries.forEach(entry => {
      if (currentFile.parsedRoot) {
        const liveVal = getByTokens(currentFile.parsedRoot, entry.pathTokens);
        if (liveVal !== undefined) entry.currentVal = liveVal;
      }
      if (q && !entry.path.toLowerCase().includes(q) && !String(entry.currentVal ?? '').toLowerCase().includes(q)) return;
      matched++;
      if (shown >= rawRenderLimit) return;
      shown++;

      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--border-subtle)';
      tr.innerHTML = \`
        <td style="padding:8px 14px; font-family:var(--font-mono); color:var(--accent-sand);">\${escapeHtml(entry.path)}</td>
        <td style="padding:8px 14px;"><span class="meta-pill">\${escapeHtml(entry.type)}</span></td>
        <td style="padding:8px 14px; color:var(--text-secondary); font-family:var(--font-mono);">\${escapeHtml(String(entry.origVal))}</td>
        <td style="padding:8px 14px;"><input type="text" class="stat-input raw-val-input" value="\${escapeHtml(entry.currentVal)}" style="padding:4px 8px;"></td>
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
        setupVisualEditor();
        if (v === entry.origVal) {
          saveChanges.delete('Raw: ' + entry.path);
          const badge = document.getElementById('label-changes');
          if (badge) badge.textContent = saveChanges.size + ' CHANGES';
        } else {
          markSaveModified('Raw: ' + entry.path);
        }
      };
      rev.onclick = () => {
        entry.currentVal = entry.origVal;
        inp.value = entry.origVal ?? '';
        setByTokens(currentFile.parsedRoot, entry.pathTokens, entry.origVal);
        saveChanges.delete('Raw: ' + entry.path);
        const badge = document.getElementById('label-changes');
        if (badge) badge.textContent = saveChanges.size + ' CHANGES';
        setupVisualEditor();
      };
      tbody.appendChild(tr);
    });

    const showingLbl = document.getElementById('raw-showing-label');
    if (showingLbl) showingLbl.textContent = \`\${shown} / \${matched} entries\`;

    if (matched > shown) {
      const trMore = document.createElement('tr');
      trMore.innerHTML = \`<td colspan="5" style="padding:10px; text-align:center;"><button type="button" class="btn btn-secondary btn-sm" id="btn-raw-more">Show More (\${shown} / \${matched})</button></td>\`;
      const btnMore = trMore.querySelector('#btn-raw-more');
      if (btnMore) {
        btnMore.onclick = () => {
          rawRenderLimit += 200;
          renderRawTable();
        };
      }
      tbody.appendChild(trMore);
    }
  }
  const rawSearchInput = document.getElementById('raw-search-input');
  if (rawSearchInput) rawSearchInput.oninput = () => { rawRenderLimit = 100; renderRawTable(); };

  const MAX_FLAT_ENTRIES = 50000;
  function flattenObject(obj, prefix = '', tokens = [], visited = new WeakSet(), depth = 0, counter = { count: 0 }) {
    let result = [];
    if (!obj || typeof obj !== 'object' || depth > 64 || counter.count >= MAX_FLAT_ENTRIES) return result;
    if (visited.has(obj)) return result;
    visited.add(obj);
    for (const [key, val] of Object.entries(obj)) {
      if (counter.count >= MAX_FLAT_ENTRIES) break;
      if (!isSafeKey(key) || String(key).startsWith('__ruby_')) continue;
      const curTokens = [...tokens, key];
      const curPath = prefix ? (Array.isArray(obj) ? \`\${prefix}[\${key}]\` : \`\${prefix}.\${key}\`) : key;
      if (val !== null && typeof val === 'object' && !(val instanceof Uint8Array)) {
        result = result.concat(flattenObject(val, curPath, curTokens, visited, depth + 1, counter));
      } else {
        counter.count++;
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
      if (file && file.size > 50 * 1024 * 1024) {
        showToast('File exceeds the 50MB safety limit.', 'danger');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result);
          if (Array.isArray(json)) {
            const cat = detectDbCategory(file.name, json);
            if (!cat || !gameData[cat]) {
              showToast(\`Skipped \${file.name}: Unsupported reference data file.\`, 'warn');
              return;
            }
            gameData[cat] = {};
            if (cat === 'items') gameData.itemTypes = {};
            const target = gameData[cat];
            json.forEach(x => {
              if (x && x.id && x.name && isSafeKey(x.id)) {
                target[x.id] = x.name;
                if (cat === 'items') gameData.itemTypes[x.id] = x.itypeId || 1;
              }
            });
          } else if (json && typeof json === 'object' && (Array.isArray(json.variables) || Array.isArray(json.switches))) {
            if (Array.isArray(json.variables)) {
              gameData.variables = {};
              json.variables.forEach((n, i) => { if (n) gameData.variables[i] = n; });
            }
            if (Array.isArray(json.switches)) {
              gameData.switches = {};
              json.switches.forEach((n, i) => { if (n) gameData.switches[i] = n; });
            }
          } else {
            showToast(\`Skipped \${file.name}: Unsupported reference data file.\`, 'warn');
            return;
          }
          setupVisualEditor();
          showToast(\`Loaded names from \${file.name}\`, 'success');
        } catch(e) {
          showToast(\`Invalid JSON in \${file.name}\`, 'danger');
        }
      };
      reader.readAsText(file);
    });
  }
  if (dataDropzone && dataFileInput) {
    dataDropzone.onclick = () => dataFileInput.click();
    dataDropzone.ondragover = (e) => e.preventDefault();
    dataDropzone.ondrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer && e.dataTransfer.files) handleDataFiles(e.dataTransfer.files);
    };
    dataFileInput.onchange = (e) => {
      if (e.target.files) {
        handleDataFiles(e.target.files);
        dataFileInput.value = '';
      }
    };
  }

  // Save Export
  async function downloadEditedSave() {
    if (!currentFile || !currentFile.parsedRoot) {
      showToast('No save file loaded.', 'warn');
      return;
    }
    if (currentFile.engine === 'wolf') {
      showToast('WOLF RPG Pro uses proprietary encryption — please use Cheat Engine as described.', 'warn');
      return;
    }
    let blob;
    if (currentFile.format === 'ruby_marshal') {
      const bytes = RubyMarshal.encode(currentFile.parsedRoot);
      blob = new Blob([bytes], { type: 'application/octet-stream' });
    } else if (currentFile.format === 'rmmzsave') {
      const zipped = pako.deflate(JSON.stringify(currentFile.parsedRoot), { to: 'string', level: 1 });
      blob = new Blob([zipped], { type: 'text/plain;charset=utf-8' });
    } else if (currentFile.format === 'rmmzsave_bin') {
      const zipped = pako.deflate(JSON.stringify(currentFile.parsedRoot), { level: 1 });
      blob = new Blob([zipped], { type: 'application/octet-stream' });
    } else if (currentFile.format === 'rpgmaker_lz') {
      const comp = LZString.compressToBase64(JSON.stringify(currentFile.parsedRoot));
      blob = new Blob([comp], { type: 'text/plain;charset=utf-8' });
    } else {
      blob = new Blob([JSON.stringify(currentFile.parsedRoot, null, 2)], { type: 'application/json' });
    }

    triggerBlobDownload(blob, currentFile.name, 'savegame.rpgsave');
    showToast('Download started.', 'success');
  }

  function downloadBackupRaw() {
    if (!currentFile || !currentFile.rawBytes) {
      showToast('No save file loaded.', 'warn');
      return;
    }
    const blob = new Blob([currentFile.rawBytes], { type: 'application/octet-stream' });
    triggerBlobDownload(blob, (currentFile.name || 'save') + '.bak', 'save.bak');
    showToast('Original backup (.bak) downloaded.', 'success');
  }

  const btnRevDl = document.getElementById('btn-review-download');
  if (btnRevDl) btnRevDl.onclick = downloadEditedSave;
  const btnBakRaw = document.getElementById('btn-backup-raw');
  if (btnBakRaw) btnBakRaw.onclick = downloadBackupRaw;

  const btnExpJson = document.getElementById('btn-export-json');
  if (btnExpJson) {
    btnExpJson.onclick = () => {
      if (!currentFile || !currentFile.parsedRoot) {
        showToast('No save file loaded.', 'warn');
        return;
      }
      try {
        const jsonOut = safeJsonStringify(currentFile.parsedRoot, 2);
        const blob = new Blob([jsonOut], { type: 'application/json' });
        const base = currentFile.name ? currentFile.name.replace(/\\.[^/.]+$/, '') : 'save';
        triggerBlobDownload(blob, base + '_decrypted.json', 'save_decrypted.json');
        showToast('Decrypted JSON exported.', 'success');
      } catch (err) {
        showToast('Export failed: ' + err.message, 'danger');
      }
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
    compareBaseline = null;
    varsRenderLimit = 250;
    switchesRenderLimit = 250;
    rawRenderLimit = 100;
    activeCharacterIndex = 1;
    const btnClearCompare = document.getElementById('btn-clear-compare-vars');
    if (btnClearCompare) btnClearCompare.style.display = 'none';
    const diffBanner = document.getElementById('vars-diff-banner');
    if (diffBanner) diffBanner.style.display = 'none';
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
    if (tabId === 'tab-raw') renderRawTable();
  };
  document.querySelectorAll('.tab-btn').forEach(b => b.onclick = () => switchTab(b.getAttribute('data-tab')));

})();
</script>

</body>
</html>
`;

const scriptHashes = [...htmlContent.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map(m => `'sha256-${crypto.createHash('sha256').update(m[1], 'utf8').digest('base64')}'`)
  .join(' ');
htmlContent = htmlContent.replace('__CSP_SCRIPT_HASHES__', scriptHashes);

fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent);
console.log('Save & DB Studio built successfully!');
