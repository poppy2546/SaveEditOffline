# Universal RPG Maker Save Editor & JSON Database Modder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-brightgreen.svg)](#privacy--security)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Cloudflare%20Pages-blue.svg)](https://universal-rpg-save-editor.pages.dev/)
[![Offline Ready](https://img.shields.io/badge/Mode-Offline%20Ready-informational.svg)](#getting-started)

An offline-first, 100% client-side web studio for inspecting and editing save files and JSON database tables across RPG Maker generations. No server uploads, no telemetry, and built-in safeguards so you can test edits without risking your saves.

**Live Web App:** https://universal-rpg-save-editor.pages.dev/

---

## Supported Formats

| Engine | File Extensions | Encoding / Format | Support Level |
| :--- | :--- | :--- | :--- |
| **RPG Maker MZ** | `.rmmzsave` | Pako Deflate (text & binary) | Full Read / Write |
| **RPG Maker MV** | `.rpgsave` | LZ-String Base64 | Full Read / Write |
| **RPG Maker VX Ace / VX / XP** | `.rvdata2`, `.rvdata`, `.rxdata` | Ruby Marshal 4.8 binary | Full Read / Write |
| **Database Tables** | `Weapons`, `Armors`, `Items`, `Skills`, `Enemies`, `Classes`, `Actors`, `System.json` | JSON | Multi-file Read / Write |
| **WOLF RPG Editor** | `.sav` | Engine header | Header Inspection |

---

## Key Features

### 1. Save Editor
- **Visual Editing Tabs:** Characters (stats, EXP, skills with DB picker, status cure, Player Location `Map ID / X / Y`), Inventory, Weapons, Armors, Variables, Switches, Reference Data (`.json`) status manager, and Raw Property Tree.
- **Zero-Token Japanese & Universal RPG Decoder:** Automatically decodes RPG `params`, `traits` (EVA, CRIT, Gold/EXP multipliers, state immunities, dual wield, extra turns), `scope`, `effects`, `<br>` effect lines, note tags (`<Max Item: N>`, `<STS Get Sp: N>`, `<skill_id:N>`, `<Passive State: N>`, `<Cooldown: N>`), and 260+ universal JP RPG terms; supports importing MTool `translation.json` files and cross-language English search.
- **Save Diff Finder:** Load a second save as a baseline to highlight changed Variables and Switches.
- **Quick Mod Presets:**
  - Direct Gold controls (`+10K`, `+100K`, `Max 9.9M`, `Revert`)
  - `Full Restore (HP/MP)`, `Cure States`, `Max All Stats (9999)`
  - `Set All Owned to 99` & `Safe Unlock All (No Key Items)` (skips `イベント用ダミー`, `イベントアイテム`, `貴重品`, `★` quest items, and `itypeId 3/4` hidden glossary items; respects `<Max Item: N>`)
  - `Max All Party & Inventory` (`Ctrl+Shift+G`)
- **Non-Destructive Safety:**
  - One-click **`Revert All`** to restore the loaded save from its original in-memory bytes and clickable **`CHANGES` drawer** to inspect edits.
  - One-click **`.bak` raw backup** and **Decrypted JSON export**.
  - **Unsaved changes protection** before closing the tab or clearing files.

### 2. Database Modder
- **Multi-File Drag & Drop:** Drop `Weapons.json`, `Armors.json`, `Items.json`, `Skills.json`, `Enemies.json`, `Classes.json`, `Actors.json`, and `System.json` together.
- **Smart Content Detection:** Automatically detects database categories even for renamed `.json` files and safely skips unsupported tables.
- **Independent Slot Memory:** Switch between categories without losing edits, with per-category modified counters.
- **Batch Table Actions:**
  - `All ATK/MAT 9999`, `All DEF/MDF 9999`, `All Price 0`, `All Zero Weight [0W]`
  - `All Non-Consumable (Infinite Items)`, `All 0 MP/TP Cost`
  - Enemy drops/rewards presets, Class fast EXP & Lv.1 skills, Actor max level presets
  - Revert individual entries or entire files, plus `Download All Modified`.

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl+S` / `Cmd+S` | Download current edited Save or active Database `.json` |
| `/` | Focus the search filter in the active tab or Database Modder |
| `Esc` | Clear the active search filter input |
| `Ctrl+Shift+G` | Apply `Max All Party & Inventory` preset (Save Editor) |

---

## What's New (Patch Notes)

### Japanese RPG Decoder & Safe Unlock Protection (0-Token Update)
- **Zero-Token Japanese & Universal RPG Decoder:** Automatically extracts and decodes RPG `params`, `traits` (HIT/EVA/CRIT, MP Cost, Phys/Mag DMG, Gold/EXP x2, state resistance/immunity, extra turns, dual wield), `scope` (1/All Enemies, Ally, Revive, Self), `effects`, `damage.formula`, `<br>` effect lines, plugin note tags (`<Max Item: N>`, `<STS Get Sp: N>`, `<STS Reset Tree>`, `<skill_id:N>`, `<Passive State: N>`, `<Cooldown: N>`, `<Cannot Sell>`), and 260+ universal Japanese RPG terms across Save Editor and Database Modder (plus MTool `translation.json` import and optional local `window.Translator` support via `Translate JP`).
- **English Cross-Search:** Filter Japanese items, armors, weapons, skills, variables, and switches using English keywords (e.g., `motivation`, `corruption`, `camera`, `magic`, `district`).
- **Smart Safe Unlock Protection:** Automatically skips event dummies (`イベント用ダミー`), event/quest items (`イベントアイテム`, `貴重品`, `★`), and hidden encyclopedia/glossary entries (`itypeId` 3/4, `<SGカテゴリ>`), and caps quantities at `<Max Item: N>`.

### UI / QoL Improvements
- **Player Location / Teleport Editor:** Added `LOCATION (MAP / X / Y)` controls in the QoL bar (syncs `_realX`/`_realY` on MV/MZ saves).
- **Character Skill Picker & Inline Add Controls:** Added `#char-skill-picker` dropdown when `Skills.json` is loaded and replaced `window.prompt()` dialogs with inline ID/quantity inputs on Inventory, Weapons, and Armors.
- **Change Log Drawer & Data Files Manager:** Clickable `CHANGES` badge opens a modified-fields drawer; `Data Files (.json)` tab displays loaded reference counts with individual `Clear` buttons.
- **UI & Routing Polish:** Context-aware Save header buttons (hidden until a save is loaded), deduplicated Database Modder actions, staggered multi-file downloads, auto-routing decrypted save `.json` dropped in DB Modder mode, and responsive layout fixes.
- **Revert All & Safety:** Restores loaded saves from original bytes with `beforeunload` unsaved guard, `Ctrl+S` / `/` / `Esc` / `Ctrl+Shift+G` shortcuts, non-blocking error toasts, custom `PORT` support in `server.js`, and `npm run verify`.

---

## Privacy & Security

- **100% Client-Side:** All parsing, decompression, Ruby Marshal decoding/encoding, and JSON formatting run locally in your browser.
- **Zero Cloud Uploads:** Save files and game data never leave your machine.
- **Strict CSP:** Enforces `connect-src 'none'` and SHA-256 script hashes synced across `index.html`, `server.js`, and Cloudflare Pages middleware.

---

## Getting Started

### Option A: Use the Web Version
Open https://universal-rpg-save-editor.pages.dev/ in any modern browser.

### Option B: Run Offline (No Setup)
1. Clone this repository:
   ```bash
   git clone https://github.com/poppy2546/SaveEditOffline.git
   cd SaveEditOffline
   ```
2. Double-click `open.exe` (or open `index.html` directly in your browser).

### Option C: Run Local HTTP Server
```bash
npm install
npm start
```
- Default URL: `http://localhost:3000/`
- Custom port: `PORT=3001 npm start` (or on Windows PowerShell: `$env:PORT=3001; npm start`)
- Windows one-click launcher: double-click `run-server.bat` (starts the server and opens the browser once ready).

---

## Development & Testing Pyramid

```bash
# Build single-file index.html and sync CSP hashes
npm run build

# Build and run the full test pyramid (recommended before commits)
npm run verify

# Run test levels individually
npm test
npm run test:unit
npm run test:integration
npm run test:e2e
```

---

## Contributing

Contributions, issues, and feature requests are welcome via the [issues page](https://github.com/poppy2546/SaveEditOffline/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Run `npm run verify` to make sure build, CSP hashes, and all tests pass
4. Commit your changes and open a Pull Request

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
