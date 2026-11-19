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
- **Visual Editing Tabs:** Characters (stats, EXP, skills, status cure), Inventory, Weapons, Armors, Variables, Switches, Reference Data (`.json`), and Raw Property Tree.
- **Save Diff Finder:** Load a second save as a baseline to highlight changed Variables and Switches.
- **Quick Mod Presets:**
  - Direct Gold controls (`+10K`, `+100K`, `Max 9.9M`, `Revert`)
  - `Full Restore (HP/MP)`, `Cure States`, `Max All Stats (9999)`
  - `Set All Owned to 99` & `Safe Unlock All (No Key Items)`
  - `Max All Party & Inventory` (`Ctrl+Shift+G`)
- **Non-Destructive Safety:**
  - One-click **`Revert All`** to restore the loaded save from its original in-memory bytes.
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

## What's New (QoL Update)

- **Revert All Save Changes:** Added a `Revert All` button in the Save Editor header to instantly roll back all edits to the original loaded file.
- **Unsaved Changes Guard:** Added `beforeunload` warning and confirmation prompts before clearing a modified save or database workspace.
- **Keyboard Shortcuts:** Added `Ctrl+S` quick export, `/` instant search focus, and `Esc` search clear across tabs.
- **Cleaner Error & Toast Feedback:** Replaced blocking `alert()` parse dialogs with non-blocking `danger` toasts including the failing filename, and fixed overlapping toast timers.
- **Improved Local Server & Launcher:** `server.js` now supports custom `PORT`, reports `EADDRINUSE` clearly, and supports `--open` so `run-server.bat` opens the browser only after the server is ready.
- **Single-Command Verification:** Added `npm run verify` (`build` + full test pyramid).

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
