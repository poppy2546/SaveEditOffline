# SaveEdit Offline PRO MAX (Universal RPG Maker Edition)

100% Local, offline, and private save editor supporting all RPG Maker generations and popular engines.

## 🎮 Supported Game Engines & Formats

| Engine | File Extension | Internal Container / Format |
| :--- | :--- | :--- |
| **RPG Maker MZ** | `.rmmzsave` | Pako Deflate (Zlib binary string) |
| **RPG Maker MV** | `.rpgsave` | LZ-String Base64 JSON |
| **RPG Maker VX Ace** | `.rvdata2` | Ruby Marshal 4.8 binary stream |
| **RPG Maker VX** | `.rvdata` | Ruby Marshal 4.8 binary stream |
| **RPG Maker XP** | `.rxdata` | Ruby Marshal 4.8 binary stream |
| **RPG Maker 2000 / 2003** | `.lsd` | LcfSaveData binary chunks |
| **Wolf RPG Editor** | `.dat` / `Save.dat` | WpDat binary data |
| **Generic PC Games** | `.sav`, `.dat`, `.json`, `.xml`, `.gz` | JSON, Gzip, Zlib, XML, Base64 |

## 🌟 PRO MAX Features
- **Unified Visual Dashboard**:
  - Automatically maps Gold, Characters (HP/MP/Stats), Inventory Items, Weapons, Armors, Variables, and Switches regardless of game generation.
  - **Custom Mod & Script Support**: Dynamically detects and renders custom instance variables (e.g. `@lust`, `@corruption`, `@stamina`, `@reputation`) as dedicated editable cards highlighted in purple.
- **Game Data Resolver**:
  - Upload `Items.json`, `Weapons.json`, `Armors.json`, or `System.json` to instantly replace numeric IDs with real localized in-game names.
- **Pre-Download Diff View & Auto-Backup**:
  - Side-by-side comparison before exporting.
  - One-click `.bak` backup download of pristine original save.
- **100% Offline & Private**: Zero cloud uploads, no tracking, no file size limits.

## 🚀 How to Run
Double-click `open.bat` or open `index.html` in Chrome / Edge / Firefox.
