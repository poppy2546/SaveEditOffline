# Universal RPG Maker Save Editor & JSON Database Modder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-brightgreen.svg)](#privacy--security)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Cloudflare%20Pages-blue.svg)](https://universal-rpg-save-editor.pages.dev/)

A modern, high-contrast, offline-first web utility for inspecting and editing save files and database JSON tables across all generations of RPG Maker games and compatible engines.

🌐 **Live Web App**: [https://universal-rpg-save-editor.pages.dev/](https://universal-rpg-save-editor.pages.dev/)

---

## 🌟 Key Features

### 💾 1. Save Editor
- **Cross-Generation Format Support**:
  - **RPG Maker MZ** (`.rmmzsave` — Pako Deflate/Inflate)
  - **RPG Maker MV** (`.rpgsave` — LZ-String Base64)
  - **RPG Maker VX Ace / VX / XP** (`.rvdata2`, `.rvdata`, `.rxdata` — Ruby Marshal 4.8 binary stream)
  - **WOLF RPG Editor** (`.sav` — Engine header inspection)
- **Visual Editing Tabs**: Characters, Inventory items, Weapons, Armors, Variables, Switches, and Data files.
- **Quick Mod Presets**:
  - Direct Gold editing (`+10K`, `+100K`, `Max 9.9M`, Revert)
  - `Full Restore (HP/MP)`
  - `Max All Stats (9999)`
  - `Set All Owned to 99x`
  - Export Decrypted JSON & One-click `.bak` original save backup.

### 🛠️ 2. Database Modder
- **Multi-File Drag & Drop**: Drop `Weapons.json`, `Armors.json`, `Items.json`, `Skills.json`, and `System.json` simultaneously.
- **Independent Slot Memory**: Switch between categories without losing ongoing edits.
- **Batch Table Actions**:
  - `All ATK/MAT 9999` / `All DEF/MDF 9999`
  - `All Price 0`
  - `All Non-Consumable (Infinite Items)`
  - `All Zero Weight [0W]`
  - `All 0 MP/TP Cost`
  - `Max Table Preset` & `Revert File`
- **File Management**: Quick `Clear File` per category and `Clear All Files` when switching games.

---

## 🔒 Privacy & Security

- **100% Client-Side**: All parsing, decompression, and encoding happen strictly inside your browser.
- **Zero Cloud Uploads**: Your game saves and data files never leave your computer.
- **Content Security Policy (CSP)**: `connect-src 'none'` prevents any outgoing network requests from save payloads.

---

## 🚀 Getting Started

### Option A: Use the Web Version
Open [https://universal-rpg-save-editor.pages.dev/](https://universal-rpg-save-editor.pages.dev/) in any modern web browser.

### Option B: Run Locally (Offline)
1. Clone this repository:
   ```bash
   git clone https://github.com/poppy2546/SaveEditOffline.git
   cd SaveEditOffline
   ```
2. Double-click `open.bat` (or open `index.html` in your browser).

### Option C: Run Local HTTP Server
```bash
npm install
npm start
```
Open `http://localhost:3000` in your browser.

---

## 🧪 Testing Pyramid

The project includes unit, integration, and E2E smoke tests:

```bash
# Run full pyramid test suite
npm test

# Run isolated levels
npm run test:unit
npm run test:integration
npm run test:e2e
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/poppy2546/SaveEditOffline/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
