# ingesto 2.8.1

First release of this fork: ingesto 2.8.0 with a complete Chinese (简体中文) localization. The copy engine, the verification and the checksums are unchanged in substance — the same files land in the same folders.

## Requirements
- **macOS 13 Ventura or later** (Apple Silicon): same as 2.8.0.
- Windows 10 or 11 (64-bit): same as 2.8.0.
- **Linux: no package in this release.** The Linux build exists but was not prepared for v2.8.1; build it from source if needed.

## Chinese localization
- The whole interface is translated: main window, dialogs, kiosk mode, the copy progress area and the popups. The copy/verify wording follows the glossary of the trade (拷贝、校验、双重读取、目标位置…).
- **English / 简体中文** switch in Settings, remembered across launches like every other preference. A fresh install starts in the system language.
- The HTML report is written in the language of the interface at export time (CSV and JSON reports stay in English, they are read by programs).
- Dates read year-first in Chinese where a full date is shown (2026.10.19 23:26).

## Adjustments that come with the localization
- The operator and camera fields accept Chinese characters now: only filesystem-invalid characters are stripped (`\ / : * ? " < > |`). Folder names built from them stay safe on all three systems.
- Volumes named "Recovery" no longer appear in the mounted-volume list.
- The notes editor shows its placeholder again after all text is deleted.
- The operator placeholder reads "Name" everywhere, matching kiosk mode.

## Signing note (macOS)
This build is **not signed and not notarized** (no Apple Developer ID certificate yet). On first launch: right-click the app and choose **打开 / Open**, once is enough. The Windows setup may show a SmartScreen warning the first time too — choose "More info" then "Run anyway".

## Downloads
- `ingesto-2.8.1-arm64.dmg` — macOS, Apple Silicon.
- `ingesto Setup 2.8.1.exe` — Windows 10/11, 64-bit.
