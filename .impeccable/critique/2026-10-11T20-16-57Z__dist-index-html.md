---
target: จดไว UI5 Glass Ledger
total_score: 30
max_score: 40
na_heuristics:
p0_count: 0
p1_count: 0
target_identity: "file:C:\\Users\\tanap\\Documents\\Pocket Balance\\jot-money-demo\\dist\\index.html"
target_fingerprint: "sha256:d229c3ac5d40e1e9fa47a4c20a9cfcf2546f5240f8eda1d503266c2669d5b720"
target_path: "C:\\Users\\tanap\\Documents\\Pocket Balance\\jot-money-demo\\dist\\index.html"
timestamp: 2026-10-11T20-16-57Z
slug: dist-index-html
---
# UI5 Glass Ledger — assessment and correction confirmation

Method: dual-agent (A: /root/ui5_assessment_a · B: /root/ui5_assessment_b). A finished before parent opened B findings. B raw evidence was saved before late implementation context; no reruns or re-anchoring followed. Operate, dist/index.html, 2026-10-12.

## Design specificity and overall impression

Authored for Thai quick money capture: purple/mint balance timeline, explicit wallet scope, readable account review and one thumb-zone recording action. Shared glass surfaces cover history, calendar, accounts, settings and sheets without replacing finance rules. No inline capture form remains; existing form opens on demand and focuses typing synchronously.

## Design health

| Nielsen heuristic | Score | Evidence and remaining limit |
|---|---:|---|
| System status | 3/4 | Location, save, selection and review feedback; not every async state manually inspected. |
| Real-world match | 3/4 | Thai money language, explicit wallet scope and full amounts. |
| Control/freedom | 3/4 | Close, Escape, editing and retained drafts; universal undo not established. |
| Consistency | 3/4 | Shared controls and surfaces, inherited capture date fixed. |
| Error prevention | 3/4 | Account confirmation, date validation, duplicate guard, quota rollback. |
| Recognition over recall | 3/4 | Labelled capture action restored consistently; contextual account review. |
| Efficiency | 3/4 | Immediate focus, native Enter, frequent records, date-specific capture. |
| Minimalism | 3/4 | Quiet overview with on-demand editor and chart disclosure. |
| Error recovery | 3/4 | Storage failure retains draft and ledger; not every validation path manually exercised. |
| Help/documentation | 3/4 | Contextual scope, transfer, first-account and historical reconstruction help. |
| Total | 30/40 — Good | Initial full assessment 29/40; limited correction update +1 recognition, not a full reassessment. |

## Strengths

- Current balance stays independent of selected historical graph period; integrated chart/tooltip uses real recorded data.
- Capture opens with immediate focus and review repeats note, amount, date, category and account.
- Purple glass, mint controls and warm coral expenses remain consistent across primary pages and dialogs.

## Priority issues and correction verdict

1. P1 compact-calendar CSS hid capture action label. Fixed ID-scoped UI5 selector, dimensions and font; settled calendar and summary screenshots plus computed-font regression pass. Reviewer: resolved.
2. P1 capture date retained old olive text on purple. Fixed resting, hover, native date input, status and focus palette; computed color regression and updated capture screenshot pass. Reviewer: resolved.
3. P2 extreme balance broke mid-number. Added measured font fitting to container, preserved unrounded full text and nowrap. 320px screenshot displays 123,456,795,935.09 ฿ intact. Reviewer: resolved.
4. P2 content-bearing secondary text 11px. Raised named chart actions/notices, transfer hints, calendar totals and day metadata to 12px. Reviewer confirmed within correction scope.

No P0 found. A correction verdict: ship from its design perspective, all listed fixes resolved, no partial or unresolved items. No assertion of whole-app perfection.

## Deterministic/browser evidence

Detector exactly once: 50 findings, dist/index.html:0; low-contrast5, icon-tile-stack1, undersized-ui-text4, tiny-text5, cramped-padding15, design-system-color14, design-system-radius3, overused-font1, dark-glow1, repeating-stripes-gradient1. Valid JSON despite exit1. Many findings reference superseded legacy styles; visual/computed evidence governs current UI. No clean-detector claim.

Seven valid screenshot-composite contrast samples: overview title9.30, scope9.90, capture subtitle8.36, transfer hint8.23, transfer footnote8.16, day hero label9.21, day metadata9.21. Two transitional button samples invalid/excluded. Point samples are not gradient-wide certification.

Independent B initial no-shots run exposed tooltip timing instability. Harness corrected to settle rendering even without screenshots; full correction confirmation suite passes. Keyboard samples show 2px green focus outlines and native dialog focus containment, not a full assistive-technology audit.

Chrome synthetic 320/375/430/1280, short320x568, extreme values, empty/new user, single capture action, synchronous focus, native Enter, account review, cancel/draft, quota rollback, duplicate guard, save/edit refresh, calendar retro capture, transfer reset, state invariance and reduced motion/transparency pass. Existing root checks pass; Excel synthetic import and undo checks additionally pass. Financial storage remains jot-money-v1 with no destructive migration.

## Cognitive load, personas and emotional journey

Primary capture cognitive checklist: 0 clear failures; four nav destinations and three entry types remain manageable. Ordered 7-column dates are a spatial date-selection task rather than an arbitrary option wall.

Casey: thumb-zone action and retained drafts support interruption. Jordan: empty-account guidance and explicit review avoid hidden first steps. Sam: label and date contrast defects corrected; physical screen reader use not established. Calm money inspection leads to focused entry, explicit review and refreshed balance.

## Minor observations and limits

Calendar cells around40.7px wide at375 are below44px comfort guidance but above24px minimum; seven columns constrain width at320. Cells remain separated, dates keyboard-operable and content scrollable. No unsupported WCAG failure claim.

Not tested on actual Safari/iPhone, physical software keyboard, VoiceOver/NVDA, 200% zoom or slow networks. Chrome is not native iPhone validation. No user-visible overlay claim: detector injection ran headless across four states (raw console counts6/4/6/2, possible repeated/modal contamination), own live server stopped. Temporary Chrome profiles remained after cleanup policy rejected specifically targeted deletion; no deletion occurred. QA assets contain synthetic data only.

Questions skipped: all material fixes already authorized by the user; no additional product or scope decision required.
