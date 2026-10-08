# UI1 — saved before UI2 redesign

Saved on 2026-10-08 from the current local working tree, including the unreleased date capture, category learning, and new-user category presets. This snapshot is not the older published demo.18 UI.

- `dist/` is the complete original working app. Keep it unchanged.
- Root documents and checks were copied alongside it for context.
- Local comparison copy: `../../dist/ui1/`, open at http://127.0.0.1:8000/ui1/index.html.
- UI2 is the current `../../dist/`, open at http://127.0.0.1:8000/.
- The main UI2 page also has an in-page UI1/UI2 visual toggle. It changes only styles, keeping the same active form, drafts, and ledger; this is the preferred way to compare without opening separate editing tabs.
- Both URLs use the same origin and `jot-money-v1` browser storage. Entries saved in either view belong to the same ledger. This source snapshot is not a backup of browser financial data.
- Reverting only the UI means restoring the snapshot HTML/CSS and removing the UI2 stylesheet reference; do not reset Git or overwrite unrelated future app logic.
- No commit, push, or deployment was performed to create this snapshot.

## SHA-256 reference

| File | SHA-256 |
| --- | --- |
| index.html | 3a15123c14424cca90376e12f58cdb2c39ee1ce3353cefc8fb389d4932bf8c31 |
| style.css | 691f0165c374d4e4448a454dca0578309ee2ebc9378b018f9d54e300c28e0334 |
| app.js | 4503d034a340d8b874a1ae18183e4ffb151c9743673090820d7495cd4c56a85c |
| core.js | 607802ccc4d2d5a6cb13547ec28eadfcc107ed78c5fc2a66428c677c23d52d8a |
| history.js | 384f353de2fcaa7cd6055132d33b75d495b94a9df96aae54ab59d81e8c87bf2b |
| excel-import.js | 7373ea52d32b96a170d7ed2dffc22a0fb3727e3c0506cde45d5ec200123adb96 |
| import-ui.js | e8b5720d49b02390548157b2d4017fa60e3831abe1b32b4833d5a63c7c9f1b1f |
