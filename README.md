# Universal RPG Maker Save Editor & JSON Database Modder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-brightgreen.svg)](#privacy--security)
[![Live App](https://img.shields.io/badge/Live%20App-Cloudflare%20Pages-c9a45a.svg)](https://universal-rpg-save-editor.pages.dev/)
[![Offline PWA](https://img.shields.io/badge/Offline-PWA%20Ready-informational.svg)](#quick-start-use-online-or-offline)

A **100% client-side, offline-capable** web workbench for inspecting and editing RPG Maker save files and JSON database tables directly in browser memory. Zero server uploads, zero tracking, and built-in revert/backup safeguards.

**Live Web App:** https://universal-rpg-save-editor.pages.dev/

---

## Quick Start (Use Online or Offline)

### Option 1: Install as an Offline App (Recommended — No Setup)
1. Open **https://universal-rpg-save-editor.pages.dev/** in Chrome, Edge, or any modern browser.
2. Click **`Install Offline App`** below the dropzone (or use your browser's **Install App** icon in the address bar).
3. Once installed, the Service Worker (`sw.js`) caches the editor locally so it works **100% offline** with no internet connection.

### Option 2: Download & Run Locally on Windows
1. Download this repository (**Code -> Download ZIP**) and extract it.
2. Make sure [Node.js](https://nodejs.org/) is installed.
3. Double-click **`run-server.bat`** — it starts the local HTTP server and opens the editor in your browser automatically.

> **Note:** Because the app uses native ES modules (`<script type="module">`), opening `index.html` directly via `file://` is blocked by browser CORS rules. Always use **Option 1 (PWA)** or **Option 2/3 (local HTTP server)**.

### Option 3: Developer CLI
```bash
git clone https://github.com/poppy2546/SaveEditOffline.git
cd SaveEditOffline
npm install
npm start
```
- Default URL: `http://localhost:3000/`
- Custom port: `PORT=3001 npm start` (PowerShell: `$env:PORT=3001; npm start`)

---

## Supported Formats

| Engine / Type | File Extensions | Format | Support |
| :--- | :--- | :--- | :--- |
| **RPG Maker MZ** | `.rmmzsave` | Pako Deflate (text & binary) | Full Read / Write |
| **RPG Maker MV** | `.rpgsave` | LZ-String Base64 | Full Read / Write |
| **RPG Maker VX Ace / VX / XP** | `.rvdata2`, `.rvdata`, `.rxdata` | Ruby Marshal 4.8 binary | Full Read / Write |
| **Database Tables** | `Weapons`, `Armors`, `Items`, `Skills`, `Enemies`, `Classes`, `Actors`, `System.json` | JSON | Multi-file Read / Write |
| **WOLF RPG Editor** | `.sav` | Binary header | Header Inspection |

---

## Key Features

### 1. Save Editor
- **Visual Tabs:** Characters (stats, EXP, skills with DB picker, status cure, Player Location `Map ID / X / Y`), Inventory, Weapons, Armors, Variables, Switches, Data Files (`.json`), and Raw Property Tree.
- **Japanese & Universal RPG Decoder:** Automatically decodes RPG `params`, `traits` (HIT/EVA/CRIT, Gold/EXP multipliers, state immunities, dual wield, extra turns), `scope`, `effects`, note tags (`<Max Item: N>`, `<STS Get Sp: N>`, `<skill_id:N>`, `<Passive State: N>`, `<Cooldown: N>`), and 260+ Japanese RPG terms. Supports importing MTool `translation.json` and searching Japanese entries with English keywords.
- **Save Diff Finder:** Load a second save as a baseline to highlight changed Variables and Switches.
- **Quick Presets & Safe Unlock:**
  - Gold presets (`+10K`, `+100K`, `Max 9.9M`, `Revert`)
  - `Full Restore (HP/MP)`, `Cure States`, `Max All Stats (9999)`
  - `Safe Unlock All (No Key Items)` — skips event/quest items (`イベント用ダミー`, `イベントアイテム`, `貴重品`, `★`, `itypeId` 3/4) and respects `<Max Item: N>`
  - `Max All Party & Inventory` (`Ctrl+Shift+G`)
- **Safety Controls:** Clickable `CHANGES` drawer, one-click `Revert All`, raw `.bak` backup download, decrypted JSON export, and confirmation modals for destructive actions.

### 2. Database Modder
- **Multi-File Drag & Drop:** Drop multiple `.json` tables (`Weapons.json`, `Armors.json`, `Items.json`, `Skills.json`, `Enemies.json`, `Classes.json`, `Actors.json`, `System.json`) at once.
- **Smart Content Detection:** Identifies table types by schema even when files are renamed, and safely skips unsupported tables.
- **Batch Actions & Exports:** Per-category presets (max stats, zero price/weight, infinite items, 0 MP/TP, 100% enemy drops, fast EXP curves), per-entry or full-file revert, and `Download All Modified`.

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl+S` / `Cmd+S` | Download current edited Save or active Database `.json` |
| `/` | Focus the search filter in the active tab or Database Modder |
| `Esc` | Clear the active search filter or close modals |
| `Ctrl+Shift+G` | Apply `Max All Party & Inventory` preset (Save Editor) |

---

## Privacy & Security

- **100% Client-Side:** All parsing, decompression, Ruby Marshal decoding/encoding, and JSON formatting run locally in browser memory.
- **Zero File Uploads:** Save files and game data never leave your device.
- **Strict CSP:** Enforces `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, and SHA-256 inline script hashes synced across `index.html`, `server.js`, and `functions/_middleware.js`.

---

## Project Structure & Development

- `builder_promax.js` — True source generator that builds `index.html` and syncs SHA-256 CSP hashes into `server.js` and `functions/_middleware.js`
- `ruby_marshal.js`, `pako.min.js` — Client-side Ruby Marshal 4.8 and zlib/deflate codecs
- `manifest.webmanifest`, `sw.js` — Offline PWA manifest and Service Worker cache
- `server.js`, `run-server.bat` — Hardened local static HTTP server (`127.0.0.1`)
- `privacy.html`, `terms.html` — Local privacy & backup documentation pages
- `tests/` — Unit, integration, and E2E HTTP test pyramid

```bash
# Build index.html and sync CSP hashes
npm run build

# Build and run all 18 tests (unit + integration + E2E)
npm run verify

# Run test levels individually
npm test
npm run test:unit
npm run test:integration
npm run test:e2e
```

---

## Contributing

Issues and pull requests are welcome on the [issues page](https://github.com/poppy2546/SaveEditOffline/issues).

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-change`)
3. Edit true sources (`builder_promax.js`, `privacy.html`, `terms.html`, etc.) and run `npm run verify`
4. Commit your changes and open a Pull Request

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
