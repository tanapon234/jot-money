# ส่งต่องานให้ Codex

## demo.28 — release authorized (2026-10-13)

- User requests completing the account-trash frame, updating the website, then shutting down this computer. This supersedes local-only notes below for the approved accumulated motion/home/history/card changes. Shutdown is permitted only after release verification; do not force-close unsaved apps. No email requested.
- Trash summary/frame/content/empty rows are now complete, scoped in ui6.css; app.js presents name and retained balance separately with account-specific restore labels. Native details keyboard and restore behavior unchanged. Synthetic `--trash-only` passed at320/375/430/1280: complete border/radius,44px controls, long positive/negative balances, restore/empty and unchanged budget/entries/balances. Mobile/desktop captures inspected; not actual Safari/iPhone.
- VERSION, footer and version.json are demo.28. Use feature/demo28-activity-morph for Git integration preview, verify static bytes and browser before fast-forward demo. Create release ZIP from committed content only. Exclude unrelated dirty .impeccable/design.json, local .agents/.codex, all screenshots/mocks/config, PRODUCT.md, local launch utilities and untracked UI backups. Preserve them on disk.
- Luna6/Medium passed14 existing synthetic/core checks; Sol6.1/Medium implemented trash CSS and independently reviews release scopes. Root integrates/browser QA. Earlier Astra6/Medium assistance was limited to geometry review and test-harness diagnosis; no new escalation for trash.
- Release gates passed locally: full UI6 Chrome regression plus trend-only, home-order-only, history-cards-only and trash-only; syntax/diff and impeccable layout scan clean. Sol read-only production diff review found no blockers or financial/storage changes. Public verification remains pending until preview/production assets and browser checks succeed.

## Local — overview alignment and chart continuity (2026-10-13)

- History/day card extension approved: compact .ledger-entry cards in UI6 grouped history and calendar-day dialog use the same home border/fill/radius, no duplicate dates or enclosing panels. Group headers, totals, filtering, account activity, storage and financial rules unchanged. Root extended existing presentation renderer; Sol6.1/Medium owned dist/ui6.css; Luna6/Medium independently passed history-check, synthetic history-ui-check and check.cjs. Focused `--history-cards-only` passed at320/375/430/1280 for borders/long content/amounts, income/expense/transfer/adjustment labels, no repeated date, native Enter, edit/cancel and unchanged ledger. Full UI6 regression passed including day edit/save/delete/focus return. Mobile/desktop list+day captures inspected, syntax/diff and impeccable layout scan clean. Astra6/Medium diagnosed test harness Enter activation after repeated failures: CDP keyDown needs text/unmodifiedText CR to generate native-button character activation; adding those fixed the test, no production keyboard shim. Local demo.27 only, no commit/push/deploy; not physical iOS/Safari.
- Home individual activity cards: user approved account-like per-item thin glass borders,14px corners, quiet fill and no outer container/card blur. Scoped .home-entry renderer applies only to UI6 recent records: name and signed amount/type lead, category and account/date separate; existing history/calendar renderer unchanged. Frequent main button remains separate from44px hide control, action/count are secondary. Existing click/edit/confirm/undo logic retained, no financial/storage/schema changes. `--home-order-only` passed at320/375/430/1024/1280 including long account/note and9,999,999.99 bounds, recent editor cancel, frequent hide/save/undo and empty collapse. Full UI6 Chrome regression passed after6px density adjustment to keep first action above mobile dock. Syntax/diff and impeccable layout scan passed (no findings); mobile/desktop captures inspected. Sol6.1/Medium implemented cards; Luna6/Medium independently ran quick-templates and frequent-entries checks (pass). Local demo.27 only, no push/deploy; not physical iPhone/Safari.
- Home priority update: user approved graph → frequent suggestions (up to4) → recent records (up to3). UI6 moves existing frequentSection and frequentReceipt into .home-activity before recent-card; its grid-area remains recent across all breakpoints. Recurring templates stay in capture-column, capture/dock/chart unchanged. Existing hidden behavior collapses absent suggestions; empty receipt has zero height. No schema/storage changes. `--home-order-only` Chrome passes at320/375/430/1024/1280: DOM/visual order, caps, empty collapse, dialog cancel/save/undo, unchanged ledger and recurring preservation. Mobile/desktop screenshots inspected; Luna6/Medium traced dependencies, Sol6.1/Medium independently checked structure and ran quick-templates/frequent-entries checks (pass). Local only; not real iPhone, no push/deploy.
- Home reorder full UI6 browser regression passed after compacting the mobile frequent header (hide redundant description on mobile; confirmation dialog still explains review before save). First priority action remains above the dock in the375x812 fixture. Final targeted reorder checks, syntax/diff and impeccable layout scan passed; layout scan returned no findings. VERSION remains demo.27.
- User clarified PowerPoint-style shape morph, explicitly replacing the date-only morph and directional pan described in earlier evidence below. Current implementation uses one 420ms continuous polyline/area morph for all week/month/year navigation, including disjoint dates. Union normalized knots preserve both silhouettes exactly; interrupted frames become the next source. Single-date endpoints remain dot-only; empty states snap without fabricated balances. Identical shapes stay still regardless of dates. Numeric/date strings remain actual target values. Old pan/snapshot/fallback fade code and unused CSS removed. Local only, VERSION demo.27 unchanged.
- Shape-morph final checks passed: `node ui6-browser-check.cjs --trend-only --motion-shots`, full `--no-shots`, balance-trend and chart-view checks, syntax and diff checks. Browser assertions cover exact source silhouette, intermediate movement, interrupted continuity across disjoint periods, unchanged tooltip amount, final target shape, sparse collapse/expansion, explicit empty state, stable geometry, pointer/reduced-motion cleanup and unchanged ledger. Root inspected 375/1280 mid-morph captures; Chrome widths320/375/430/1280, not physical iPhone/Safari. Sol6.1/Medium implemented; Luna6/Medium ran core checks; Astra6/Medium independently reviewed complex geometry/interruption, no actionable findings. Prior pan/date-edge evidence below is historical, not the current implementation.
- Mobile header: scope flex layout to the first header child and hide the empty decorative header-right only on home/mobile; #today now aligns with content-right. Existing unrelated changes preserved.
- Chart: shared 360x186 geometry, stable plot/44px selector footprint across ranges and sparse/empty states; month/year comparison moved below selector. Sparse data remains dot-only; no financial formulas/storage/schema changes.
- Latest motion refinement supersedes the reveal/fallback fade: actual date-pair segments morph from displayed source coordinates to final coordinates over320ms. Added/removed segments fade. Disjoint periods (including sparse/empty states) pan directionally over420ms: previous enters from left, next from right. Geometry stays still only when dates also match. Values/formulas never interpolate. Rapid interruption preserves displayed geometry, translation and edge opacity. rAF uses cached layout; reduced motion/resize/point selection clean up temporary SVG/wrappers. Snapshots are inert/aria-hidden with unique gradient IDs and rewritten fill references. Pointer selection cancels motion before measuring stable plot bounds.
- Final directional-pan verification: trend-only with motion screenshots and full UI6 regression passed in Chrome at320/375/430/1280. Week/month previous+next direction, rapid interruption, stable height, mid-pan pointer selection, reduced motion and unchanged ledger checked. Root inspected mobile/desktop mid-pan captures. Astra6/Medium found and verified fixes for date-identity equality and translated pointer bounds; Sol6.1/Medium implemented, Luna6/Medium independently checked repetitive tests. Not physical iOS/Safari; no deployment.
- Additional browser evidence: common-edge starting coordinates match the source; intermediate vertices move; interrupted motion resumes exactly from the displayed frame; added-edge opacity starts0; identical single-date geometry skips motion; fallback gradients resolve with unique IDs; reduced motion removes pending geometry. Full UI6 regression passed. Astra6/Medium independently checked complex topology/interruptions and verified its gradient-reference finding resolved; Luna6/Medium ran repetitive checks; Sol6.1/Medium implemented. No other escalation.
- Passed: node ui6-browser-check.cjs --header-only --review; --trend-only; full --no-shots; balance-trend-check.cjs; chart-view-check.cjs; syntax and diff checks. Synthetic Chrome at320/375/430/1280, not physical iPhone/Safari. Full historical browser fixtures freeze Date inside the isolated test page to2026-10-12; production/app clock is unchanged.
- Luna/Medium traced CSS; Sol6.1/Medium implemented scoped presentation; root integrated and inspected mobile/desktop captures. No Astra escalation. Local only, VERSION stays demo.27, no commit/push/deploy.

## demo.27 — release authorized (2026-10-12)

- User explicitly requested updating the website after approving all five history fixes. This supersedes older local-only notes below for this release. Use feature/demo27-afterglow preview, verify deployed bytes/browser, then fast-forward demo for existing Cloudflare Git integration. No shutdown/email requested in this turn.
- VERSION, dist/version.json and footer now demo.27 / UI6 Afterglow. Preserve localStorage and approved UI6/account-picker/sparse-chart/focus/input fixes. Exclude local .agents/.codex, screenshots/mocks/review artifacts, design-picker utility and new UI backup folders from staging.
- Release checks: 18 syntax/core/history/weekly/analytics/chart/category/new-user/frequent/templates/capture/synthetic-import checks plus UI6 Chrome passed. No physical Safari/iPhone verification. Sol / Medium read-only release review; Luna / Medium repetitive checks. Public deployment verification remains a required release step, not implied by a successful push.

## Local — approved five history critique fixes (2026-10-12)

- User approved both efficiency and clarity, all five issues from critique2026-10-12T09-54-20Z__dist-index-html.md. Preserve Afterglow, financial rules and jot-money-v1. No commit/push/deploy; VERSION stays demo.26 until authorized release.
- index.html/ui6.css: compact mobile summaries/day totals/search scope, visible calendar net/approximation explanation, clear-search >=44px/14px, empty-day variant with no decorative hero/zero-total scaffolding or misleading edit hint.
- app.js: transient calendar edit return context captured from actual invoking row; cancel/save restore original entry after render, move/delete choose remaining row by index, empty day Add fallback. Close without context is a no-op, and newly opened sheets are not focus-stolen. No schema/ledger writes added.
- Sol / Medium owns visual implementation and independently reviews root's focus logic; root owns behavior/integration and capture unit regression; Luna / Medium owns mechanical browser assertions/captures, not design judgment. No Astra escalation.
- Final node ui6-browser-check.cjs --review passes all five assertions plus existing responsive/account flows at320/375/430/1280. Core/history/history-UI/analytics/capture regressions pass. Sol and root inspected final screens; list first record ~420px vs525, searched first record ~500px vs650 at375px; empty day ~286px vs609. No new numeric critique score; not physical iPhone/Safari/VoiceOver verification. Review verdict ui6-history-five-fixes-verdict.md. All critique priorities resolved; snapshot closed after final verification. App8000 remains running; critique/test-only processes stopped.

## Local — history/calendar Afterglow refinement (2026-10-12)

- User requested more beautiful list/calendar views; local only, no commit/push/deploy. VERSION remains published demo.26. CSS-only product change in dist/ui6.css, no ledger/storage/schema changes or dependencies.
- Open history working plane, shared segmented switch/search, flatter month totals, integrated month controls, clearer day group hierarchy and quieter empty calendar dates. Keep native day dialog/edit/add, clickable day headings, shared search and signed net meaning unchanged.
- Helpers: GPT-6.1 Sol / Medium owns scoped CSS/design; GPT-6 Luna / Medium owns browser test captures and regression evidence. Root integrates and visually inspects. No Astra escalation needed for this scoped refinement.
- Initial Chrome batch passed responsive assertions; visual inspection caught legacy specificity overriding empty-date/day-group surfaces. Corrected in one batch and final `node ui6-browser-check.cjs --review` passed: no page/dialog overflow at320/375/430/1280, mobile dates >=44x44 and control text >=14px, final date scrolls above dock at all four widths. Root and Luna inspected final list/calendar captures. Synthetic core/history/history-UI/analytics/capture tests pass; physical iPhone/Safari not tested. No new critique score claimed.

## Local — Impeccable five-fix follow-up (2026-10-12)

- User approved all five priorities in critique `2026-10-12T08-36-01Z__dist-index-html.md` and compact single-date chart. Preserve Afterglow; no Undo/import-performance expansion, no commit/push/deploy/shutdown, VERSION remains demo.26 until release authorized.
- Explicit current-draft account overrides learning, including cancel/reopen and validation errors; successful save/new draft clears intent. Multiple-number input receives a specific correction while parser/schema stay unchanged.
- Skip link targets/focuses shared main with readable mint/action-ink; mobile home H1 stays accessible. Mobile history support text and net amounts enlarged; seven-column calendar reaches 44px cells at320px by using edge space.
- Single-date chart compact/explained with a month-view action; real dates/balances and multi-date inspection remain unchanged. Final single-point SVG is360×134 so its tooltip does not cover the point at320px. Calendar monthly figures keep whole decimals (16px mobile/14px at320) while date net/control labels use14px.
- All five priorities verified in `.impeccable/review/ui6-five-fix-verdict.md`: targeted revised Nielsen32/40 from29 and technical15/20 from14, not a fresh whole-app critique or WCAG certification. Final `node ui6-browser-check.cjs --review`, capture/core/history/analytics/balance-trend and synthetic import/rollback checks passed. Chrome emulation/synthesized touch only, no physical iPhone/Safari/screen reader verification.
- Final confirmation also reproduced a queued quickDialog close-event focus race. Close now preserves focus deliberately moved to main/another live control; normal close still returns to its trigger. Deterministic test `.impeccable/review/ui6-focus-close-check.cjs --assert` and full capture/browser regressions passed.
- Model preference updated by user during work: repetitive test work GPT-6 Luna / Medium; reasoning/design work GPT-6 Astra / Medium. Earlier account fix was completed by GPT-6.1 Sol / Medium before this preference arrived.

## Local — UI6 Afterglow selected and implemented (2026-10-12)

- User chose Afterglow — กระจกยามค่ำ from prepared chooser. Current app preview http://127.0.0.1:8000/ uses UI6 via dist/ui6.css, ui6-home.css, ui6.js and index.html. No commit/push/deploy/shutdown; VERSION remains published demo.26 pending release authorization. Do not mistake old pending-direction notes below for current state.
- Continuous unboxed balance/timeline and recent entries; mobile dock reuses actual four navigation nodes and the single capture button (desktop restores them to rail/body). No replacement ledger handlers/storage accesses. UI3 presentation script skips when UI6 is active to avoid duplicate legacy effects.
- Existing native capture/date/account/transfer/calendar/import flows retained. UI5 visualViewport and outer scrolling account-picker fixes preserved. Graph defaults week; current balance stays independent, month/year comparison still visible. Calculation disclosure moved below spending, remains available.
- Independent review initial fix: first recent row metadata must fit above375x812 dock; stale DESIGN.md must be refreshed. Both resolved and scored in .impeccable/review/ui6-verdict.md, disposition ship for those two fixes only. DESIGN.md and schema2 .impeccable/design.json now record Afterglow. All9 final captures valid, not a claim of exhaustive whole-app certification.
- Three fresh helpers used GPT-6.1 Sol / Medium: shared UI CSS, independent finish review/verdict, source-derived design documentation. No Astra escalation. Final app and assets respond200 locally; UI6 browser test includes complete-first-row/dock and month-comparison assertions. Overlapping260msCSS/340msJS sheet entrances noted in documentation as existing implementation, not treated as separate visible failure by review.
- Passed synthetic core/history/weekly/analytics/balance/category/new-user/frequent/templates/import suites and UI6 real-Chrome flow (320/375/430/1280, short viewport, 24 accounts, synthesized touch, selection/review/draft/save/edit/rollback/reduced modes). No physical iPhone/Safari verification.

## Local — prepared Safer/Bolder picker (2026-10-12)

- User explicitly approved prepared-set switching, not automatic AI generation. Replaced the temporary question-page workflow with separate local utility `.impeccable/local-picker/` at http://127.0.0.1:8016/. Start with `start-design-picker.cmd` or `node .impeccable/local-picker/server.cjs`; no idle expiry, Ctrl+C stops it.
- Safer = four existing round0 sketches; Bolder = seven existing round1 sketches. Sets preload and switch client-side, including offline after initial loading. Repeat clicks retain the same set; no AI requests and no new designs are implied. UI explains this.
- Full-screen links, choice buttons and separate chooser localStorage key `jot-ui6-design-picker-choice`; no app storage reads/writes. User must report the selected name in chat. No direction approved or UI6 app implementation yet.
- Old question URLs/keys below are historical, not current instructions. App dist, VERSION, financial data and production untouched by this picker task; no commit/push/deploy.
- Verification: isolated Chrome test `../.qa/design-picker-check.cjs` passed all11 routes,100 offline switches with0 requests,320/375/430/1280 widths,keyboard Enter,persistence,retry and no runtime exceptions. Mobile/desktop captures visually inspected. Not tested on physical iPhone/Safari.

## Local — weekly chart and UI6 direction selection pending

- balance-trend-ui.js now defaults to week, labels the active week “สัปดาห์นี้”, removes “วันนี้ · ถึงตอนนี้”; daily selected values remain truthful, calculation unchanged.
- UI6_DIRECTION.md and .impeccable/mocks/decision/ui6-options.json record the replacement-design round, seed ed5551ef, question key4a54a410. No direction approved and no full UI6 implementation yet. Local preview app is still UI5 plus account-picker fix.
- User selected Bolder reroll on old question4a54a410; page was stuck waiting for next hand. Old server expired during fix. New live page http://127.0.0.1:63347/, key02761437, payload ui6-bolder-options.json. Collect with impeccable serve-question --wait --key 02761437; update same server for further reroll. Never silently choose for the user. Ask user to notify chat after a choice, as no agent is automatically running after a final reply.

## Local fix — เลือกบัญชีบน iPhone (2026-10-12)

- ยังไม่ commit/push/deploy; เว็บยังเป็น demo.26 ที่เผยแพร่ก่อนหน้า
- app.js เพิ่ม openCaptureAccounts() blur ช่องพิมพ์ก่อนเปิด dialog และ focus ปุ่มปิดแบบ preventScroll แทนค้นหาอัตโนมัติ ทั้งเลือกบัญชีตรงและหลัง submit; ค้นหายังแตะเพื่อพิมพ์ได้
- ui5-home.css ใช้ dialog เป็น scroll surface เดียวบนจอกว้าง <=640 หรือสูง <=500; list ไม่ถูก flex footer บีบเป็นศูนย์ ใช้ visualViewport height/offsetTop ทั้งระหว่างคีย์บอร์ดปิด/เปิด
- เพิ่ม ui5-browser-check หลายบัญชี24บัญชี widths320/375/390/430/844/1280, simulated visualViewport320/380และoffset45, touchStart/move/end ผ่าน Chromium, เลือกบัญชีสุดท้ายและเข้าถึง confirm, ไม่เปลี่ยน ledger
- สองเฟรมระหว่างปิด manual picker กับ submit ใน test ให้ native close event จบก่อนเปิด review ไม่เรียกสอง user actions ใน task เดียว
- ยังไม่ได้ตรวจ Safari/iPhoneจริงหรือคีย์บอร์ดจริง ต้องให้ผู้ใช้ยืนยันในเครื่องเป้าหมาย ไม่อ้าง viewport override ว่าเป็น iOS test

## UI5 / demo.26 — ผู้ใช้อนุมัติเผยแพร่และปิดเครื่องเมื่อครบ (2026-10-12)

- UI5_DIRECTION.md กำหนดสไตล์กราฟเดิม + glass ทั้งแอป; ui5.css ระบบร่วมทุกหน้า ui5-home.css ภาพรวม/FAB/แผงจด ui5.js visualViewport และซ่อน FAB เมื่อมี dialog เปิด ไม่มี storage writes
- app.js ย้าย quickCard ไป quickSlot ตอนโหลด ไม่คืนไว้ที่ home เมื่อปิดแผง ใช้ openCapture เดิม focus quick synchronous เพื่อให้ Safari มีโอกาสเปิดคีย์บอร์ดจาก user gesture; ต้องตรวจเครื่องจริงก่อนยืนยันคีย์บอร์ด
- ปุ่มจดหนึ่งปุ่มแบบ labelled คงรูปแบบทุกหน้า override ID compact-calendar จาก legacy CSS; แก้ capture-date ทั้ง resting/hover/nativeinput/status/focus ไม่เหลือ olive เดิม
- money-overview.js เพิ่ม canvas วัดตัวเลขแล้ว fit display ตาม container รักษาจำนวนเต็ม/ทศนิยมไม่ขึ้นบรรทัดกลางตัวเลข; กฎบัญชี/กราฟ/โอน/ประวัติ/งบและ jot-money-v1 เดิมไม่เปลี่ยน
- impeccable A/B แยก: design29/40 ก่อนแก้; แก้ P1label/date P2longnumber พร้อมเพิ่ม named secondary text12px; A verdict ship เฉพาะ correction scope คะแนน30/40 recognition+1 ที่เหลือ3/4 ไม่ใช่ใหม่เต็มชุด B detector50คำเตือนหลายรายการlegacy คง raw evidence ไม่อ้างclean
- UI5 browser regression synthetic ผ่าน320/375/430/1280 และ320x568 empty/longmoney/focus/Enter/review/cancel/draft/rollback/duplicate/edit/retro/transfer/reducedmotion/transparency; import --synthetic ผ่าน ยังไม่ได้ Safari/iPhoneจริง/VoiceOver/200%zoom
- รุ่นนี้รวม local features ที่ผู้ใช้อนุมัติไว้ก่อนหน้า: ตั้งค่า รายการประจำ จดบ่อย กราฟย้อนหลัง และเลือกบัญชีหลังพิมพ์ คงข้อมูลเดิม ผู้ใช้อนุมัติอัปเดตเว็บในคำขอรอบนี้แล้ว
- ใช้ feature/demo26-glass-ui ตรวจ preview ก่อน fast-forward demo; dist/version.json ใช้ตรวจรุ่น public; deployment-ui5-check.cjs เทียบ assets ทั้งหมดกับ dist และ UI5 browser script รับ Pages URL เพื่อทดสอบ isolated profile ไม่ใช้ browser ข้อมูลจริง
- ไม่แตะ promo-video, ไม่เผยแพร่ .agents/.codex หรือภาพ QA; UI4 backup เก็บ local. ปิดเครื่องหลังตรวจ production สำเร็จเท่านั้น ไม่ใช้ forced shutdown

## Local ล่าสุด — กราฟตามภาพอ้างอิง 024014 / 024119 (2026-10-12)

- User ขอการ์ดกราฟอ้างอิงภาพแนบ: ยอดใหญ่ด้านบน เส้นและพื้นที่ใต้กราฟ ป้ายยอดเมื่อแตะจุด คงม่วงดำ–มินต์ ไม่ออกแบบหน้าอื่นใหม่
- money-overview.js ย้าย balanceTrend เดิมเข้า moneyOverview (ไม่สร้างกราฟหรือข้อมูลสำเนา) default month, desktop กราฟซ้าย/จดขวา mobile การ์ดก่อนจด มีจดเลย focus quick รักษาร่าง/วันที่
- balance-trend-ui.js ใช้ SVG line แบบ linear จริง ไม่ smoothing ให้ข้อมูลดูเกินจริง tooltip วัดขนาดและ clamp ใน plot, ResizeObserver จัดตำแหน่งหลัง resize/ย้าย DOM, native range keyboard และ daily history เดิมครบ
- ยอดใหญ่คงปัจจุบัน เปรียบเทียบใน trendChange ตามช่วงกราฟพร้อมวันฐานจริง ข้อจำกัดย้อนหลังและสูตรอยู่ใน disclosure กราฟ ไม่เปลี่ยน BalanceTrend/ledger/storage/schema หรือยอดบัญชี
- Chrome synthetic QA ผ่าน 320/375/430/1280 ไม่ล้น ป้ายยอดอยู่ในกราฟ ปุ่มลัดรักษาร่างและไม่เขียนข้อมูล; balance/capture/templates regressions ผ่าน detect findings [] ไม่ใช่ iPhone/Safari จริง
- คง demo.25 และ local เท่านั้น ไม่ commit/push/deploy; บันทึก layout ด้านล่างเป็นประวัติก่อนแก้รอบนี้

## Local ล่าสุด — เงินรวมด้านบนและทางลัดจด (2026-10-12)

- moneyOverview อยู่ก่อน quickCard ทุกขนาดจอ กราฟเต็มอยู่ใต้ช่องจดบนมือถือ/ขวาบน desktop ไม่แสดงยอดใหญ่ซ้ำในกราฟ แต่รักษา trendCurrent DOM สำหรับ compatibility
- dist/money-overview.js เป็น presentation-only ใช้ BalanceTrend.build สัปดาห์ปัจจุบันเสมอ ไม่อิงช่วงกราฟที่เลือก ไม่เขียน storage แสดง baseline จริงและไม่แต่งเส้นเมื่อมีจุดเดียว
- “จดเลย” focus quick โดยรักษาร่าง/วันที่ “ดูกราฟ” focus balanceTrend รองรับ keyboard และ prefers-reduced-motion; ขยับยอดเฉพาะเมื่อค่าเปลี่ยน ไม่ใช้ตัวเลขจำลอง
- Chrome isolated synthetic QA ตรวจ 320/375/430/1280, ยอดอิสระจากเดือนกราฟ, ทางลัดไม่แก้ ledger/ร่าง/วันที่ และ refresh ยอดหลัง render; ไม่ใช่ iPhone/Safari จริง
- คง VERSION demo.25 เพราะยังเป็นงาน local ไม่ commit/push/deploy; ส่วนรวมยอดกับกราฟกล่องเดียวด้านล่างเป็นบันทึกก่อนการแก้รอบนี้

## Local ล่าสุด — เลือกบัญชีหลังพิมพ์ (2026-10-12)

- User อนุมัติหลายwallet: entryForm submit/Enter -> captureAccountDialog review ไม่สร้างรายการ; กดrowเปลี่ยนaccountในviewอย่างเดียว -> confirmCaptureAccount ถึงpersist Single wallet=submitบันทึกทันที No wallet=เพิ่มบัญชีก่อน โอนใช้กลไกเดิม
- suggestedCaptureAccount ใน app.js เรียนรู้ normalizednote/type จากประวัติ activewallet >=2ครั้ง ไม่รวมfuture/debt/hidden/deleted เลือกcountสูงสุด tie day/time/index ไม่เก็บสำเนาการเรียนรู้ ไม่แตะschema/key
- fingerprint type/quick/date/category ป้องกันdraftเปลี่ยนระหว่างreview; saveCaptureEntry ตรวจข้อมูลซ้ำและใช้state clone คืนstateเมื่อpersistล้มเหลว ไม่ปิดdialog/ล้างdraftจนสำเร็จ duplicateconfirmไม่สร้างซ้ำ
- ใช้ captureReviewTemplate clone เข้า pickerเดิมแล้วลบtemplate (รองรับ QA DOM); เลื่อนเฉพาะlist ภายในdialog พร้อมfooterยืนยัน ข้อความรายการยาวเลื่อนอ่านได้ในพื้นที่จำกัด ปุ่มEnterข้ามIMEcomposition ใช้requestSubmit
- capture-ui-check stageแยกจากsubmit helperเดิมซึ่งยืนยันให้ regression; เพิ่ม tests cancel/nochooserwrites/prediction/onewallet/date/draftchanged/rollback/duplicate รันroot14ชุดผ่าน Chrome synthetic Enterจริง+ภาพ320/375/430/1280 และviewport320x568หลายบัญชี ยังไม่ใช่ Safari/iPhone จริง
- ผู้ช่วยSolMedium1ตัวตรวจdata/cancel/rollbackแยก ไม่พบปัญหาบล็อก ไม่ใช้Astra คงdemo.25 ไม่commit/push/deploy

## Local ล่าสุด — ยอดเงินและกราฟกล่องเดียว ซ่อนกันงบ (2026-10-12)

- User อนุมัติซ่อนส่วนกันงบเพราะยังไม่ใช้ และต้องการยอดเงิน/กราฟสวยอ่านง่ายขึ้น: balanceTrend เป็นกล่องหลักเดียว ปุ่มดูบัญชี ยอดหลัก ตัวเลขเพิ่ม/ลด ช่วงเวลา กราฟ รายละเอียดจุดเรียงในกล่องเดียว
- ซ่อน balance-card/reserve-card เดิมด้วย hidden และ class hidden; budget-item ซ่อน CSS เฉพาะ UI4 คง DOM/ID/input และ state.budget สำหรับ compatibility ไม่มี migration/ล้างค่า/แก้สูตรบัญชี กราฟยังอิงเงินรวมตามกฎเดิม ไม่หัก budget
- เอาคำกันงบออกจากคำอธิบายยอดกราฟ เปลี่ยนชื่อหน้าบัญชีเป็นบัญชีของคุณ ใช้สี/ฟอนต์ UI4 เดิม จดบ่อย/รายการประจำ/โอน/แก้รายการยังอยู่
- ตรวจ Chrome synthetic 320/375/430/1280 และ core/capture/balance-trend/quick-templates checks ผ่าน ไม่พบแนวนอน ยังไม่ใช่ Safari/iPhone จริง คง demo.25 ไม่ commit/push/deploy

## Local ล่าสุด — จดบ่อยและกราฟย้อนหลัง (2026-10-12)

- User อนุมัติเรียนรู้รายการซ้ำและ reconstruct graph จากข้อมูลเดิม แทนข้อจำกัด explicit tracking ในหัวข้อ UI4 เดิมด้านล่าง
- dist/frequent-entries.js pure suggestions: normalized note+type, threshold 3 entries/2 days, active own wallets only, ไม่รวมอนาคต/โอน/adjustment/หนี้/ยอดไม่ถูกต้อง เลือกบัญชีที่ใช้บ่อยก่อน แล้วหมวด/ยอดของบัญชีนั้น tie ใช้วัน+เวลาที่ระบุ timezone แล้วลำดับใน ledger แสดง4รายการ เรียงcount/lastDay
- dist/frequent-ui.js เปิด dialog ตรวจยอด/บัญชี/หมวดแล้วบันทึกวันนี้ ไม่แตะร่างจดหลัก ไม่สร้างรายการตอนโหลด ซ่อนด้วย optional frequentDismissed ใน jot-money-v1 เดิม คืนคำแนะนำทั้งหมดที่ตั้งค่า pinned quickTemplates ไม่เสนอซ้ำ ไม่เปลี่ยน schema
- Commit save/hide/restore/undo rollback เมื่อ persist ล้มเหลว แก้ไขผ่าน openEdit เดิม undo ใช้ snapshot guard ไม่ยกเลิกรายการที่แก้แล้ว ฝึกหมวดเฉพาะผู้ใช้เปลี่ยนเอง
- balance-trend.build ไม่อ่าน gate startDay/signature แล้ว แต่คง legacy metadata โดยไม่แก้ ใช้ currentBalance ย้อน deltas ใน cents earliestDate=วันแรกของรายการ own-wallet ที่เกี่ยวข้องถึงวันนี้ ไม่มีรายการใช้วันนี้หนึ่งจุด การแก้ opening คำนวณใหม่ทันที
- กราฟไม่รวม future/borrower balance, hidden/deleted wallets รวมตาม Money.total, self transfer net0; first visible point เป็นฐานเมื่อไม่มีวันก่อนหน้าภายในขอบเขตข้อมูล ไม่แสดง%เมื่อฐาน<=0 มี caveat ยอดเก่าขึ้นกับประวัติครบและสมมติopeningมีตลอดช่วง ไม่ใช่ยอดจาก statement ที่ยืนยันแล้ว
- เพิ่ม frequent-entries-check.cjs และ integration ใน quick-templates-check.cjs; ปรับ ../.qa/ui4-browser.cjs ให้ตรวจ reconstruct/คำแนะนำ/confirmation/rollback/undo/hide/restore และภาพ 320/375/430/1280 ด้วยข้อมูลสังเคราะห์
- ยังคง VERSION demo.25 (รุ่นเว็บเดิม) ไม่ commit/push/deploy ไม่แก้ promo-video
- ตรวจผ่าน root tests 14 ชุด + JS syntax/diff-check; Chrome isolated synthetic interaction/ภาพ 320/375/430/1280 ไม่มีล้นแนวนอน ตรวจ save failure rollback, editable confirmation, undo, hide/restore, edit refresh, legacy no-metadata graph และ navigation ไม่เปลี่ยน ledger Local HTTP8000=200 ยังไม่ใช่ Safari/iPhone จริง
- ผู้ช่วย GPT-6.1 Sol Medium 2 ตัว: ทำ logic กราฟและตรวจสูตร/ข้อมูลแยก ผู้ตรวจพบ tie วันเดียวใช้ index แทนเวลา แก้ comparator และ regression แล้วผู้ตรวจยืนยันผ่าน ไม่ใช้ Astra

## Local — UI4 และกราฟเงินรวม (2026-10-12, ยังไม่เผยแพร่)

- User อนุมัติธีมเรียบขึ้น ม่วงดำ–มินต์–ฟ้าและกราฟแบบหุ้น แต่ใช้คำเงินเพิ่ม/ลด ไม่ใช่กำไร/ขาดทุนลงทุน คง capture-first บนมือถือและฟีเจอร์เดิม
- dist/ui4.css overlay ธีมเดิม; index เพิ่มกราฟ; manifest ใช้สีพื้นเดียวกัน สำรองก่อนแก้ที่ ui-versions/ui3-before-ui4-2026-10-12/dist ไม่แก้ promo-video
- dist/balance-trend.js คำนวณเงินในบัญชี kind ไม่ใช่ borrower (รวม hidden/deleted ตาม Money.total) เป็น cents, โอนตัวเองเป็นศูนย์, เงินเข้า/ออกจากลูกหนี้มีผลกับเงินสด แต่ไม่นับยอดบัญชีหนี้ซ้ำ
- ไม่สร้างประวัติเดา: optional state.balanceTracking={startDay,signature} เริ่มจาก explicit click วันนี้; signature ผูก ID และ opening ของบัญชีเรา เปลี่ยนฐานต้องยืนยันเริ่มใหม่ ไม่มี write ตอนโหลด ไม่มีสำเนายอดรายวัน
- รายการอนาคตไม่รวมกราฟ/currentBalance และมีคำอธิบาย ต่างจากยอด Money.total เดิมซึ่งไม่ได้เปลี่ยนกฎ การเปลี่ยนแปลงเทียบสิ้นวันก่อนช่วงเมื่อมีฐาน หรือจุดแรกที่ติดตาม; ไม่แสดงเปอร์เซ็นต์เมื่อฐาน <=0 หรือมีจุดเดียวในวันเริ่มต้น
- dist/balance-trend-ui.js เลือกช่วง/วัน คีย์บอร์ด range เปิด calendarDayDialog ผ่าน changeCalendarMonth ก่อนเลือกวัน ป้องกัน renderHistory รีเซ็ตไปเดือนผิด การเปิดวันล้าง search เพื่อแสดงครบ
- ledger-rendered refresh ทุกแก้/ลบ/นำเข้า/undo; Excel clone คง metadata ถ้าเปลี่ยนบัญชีแล้ว signature ไม่ตรงต้องเริ่มใหม่ Reset ล้าง metadata ตั้งใจ
- ตรวจผ่าน root tests 13 ชุด, syntax และ diff-check; Chrome isolated synthetic browser ตรวจ start/rollback, ไม่เขียน storage ตอนดู, cross-month day, keyboard, edit refresh, transfer, state replacement และ basis-change; widths 320/375/430/1280 ไม่มี horizontal overflow ยังไม่ใช่ Safari/iPhone จริง
- QA script/screenshots อยู่ ../.qa/ui4-browser.cjs และ ui4-*.png ใช้บัญชีสังเคราะห์เท่านั้น; VERSION คง demo.25 จนอนุมัติเผยแพร่ ไม่ commit/push/deploy
- ผู้ตรวจภาพแยกพบสี summary 2/3 ใน day dialog ค้างจาก nth-child ของ UI2 แก้ specificity แล้วตรวจภาพซ้ำได้ resolved/ship เฉพาะขอบเขตภาพ; detector ui4.css ไม่พบรายการ ผู้ช่วยใช้ GPT-6.1 Sol Medium สำหรับ logic, review และเอกสาร ไม่ยกระดับ Astra
- Local preview HTTP 8000 ตอบ 200 แต่ระบบไม่อนุญาตคำสั่งเปิดเบราว์เซอร์อัตโนมัติ ให้ผู้ใช้เปิด URL เอง

## Local — รายการประจำแตะเดียว (2026-10-11, ยังไม่เผยแพร่)

- ผู้ใช้อนุมัติเริ่มจากรายการประจำในเว็บตามข้อเสนอ เป็นขั้นเตรียมก่อน Widget iOS ไม่ได้สร้าง native extension รอบนี้
- เพิ่ม/แก้ไข/ลบชุดรายการที่ตั้งค่า และแตะจากใต้ช่องจดในภาพรวม บันทึกวันนี้ตามกฎ History เดิม ไม่เปลี่ยนร่างที่กำลังพิมพ์ ไม่บันทึกตามเวลาอัตโนมัติ
- เก็บ optional quickTemplates ใน ledger key jot-money-v1 เดิม schemaVersion 2; ข้อมูลเก่าไม่ต้อง migration ไม่เขียน storage ตอนโหลด ชุดใหม่เริ่มว่าง
- ป้องกันกดซ้ำรายการเดียวภายใน 900ms; มีใบยืนยันพร้อมแก้ไขหรือยกเลิกรายการล่าสุด ยกเลิกไม่ได้หลังรายการนั้นถูกแก้ (ใช้แก้ไข/ลบเดิมแทน)
- บัญชีซ่อน/ลบทำให้ปุ่มใช้ไม่ได้ ให้แก้บัญชีในตั้งค่า; rename หมวดอัปเดต template ด้วย ลบ template ไม่ลบประวัติ
- Excel append/replace ใช้ clone state เดิมจึงคง templates; ถ้า replace บัญชีใหม่ต่าง ID ปุ่มใช้ไม่ได้จนเลือกบัญชีใหม่ คืนก่อนนำเข้าคืน snapshot ทั้งชุดตามเดิม Reset ตั้งใจล้าง templates ด้วย
- ไฟล์ใหม่ dist/quick-templates.js และ quick-templates-check.cjs; app render ส่ง ledger-rendered ให้ส่วนนี้ refresh หลังแก้/ลบ/นำเข้า/คืนข้อมูล
- storage failure rollback ทั้ง template CRUD, tap-save/undo และ edit/delete ของรายการ ไม่ปิด edit dialog เมื่อบันทึกไม่สำเร็จ
- ตรวจด้วยข้อมูลสังเคราะห์: tests 7 ชุดเกี่ยวข้อง, syntax/diff-check, Chrome interaction/ภาพ 320/375/430/1280; reviewer GPT-6.1 Sol Medium ตรวจความเสี่ยงข้อมูลแยกและยืนยันสองจุดแก้ ผ่าน ยังไม่ตรวจ Safari/iPhone จริง
- VERSION คง demo.25 จนอนุมัติออกรุ่น ไม่ commit/push/deploy ไม่แก้ promo-video

## Local — แท็บตั้งค่า (2026-10-11, ยังไม่เผยแพร่)

- เมนูหลัก 4 แท็บ: ภาพรวม / รายการ / บัญชี / ตั้งค่า; คง internal ID settings สำหรับบัญชี และใช้ preferences สำหรับตั้งค่า
- รวมจัดการหมวดรายรับ–รายจ่าย, นำเข้า Excel, ส่งออก CSV, คืนข้อมูลก่อนนำเข้า และเริ่มใหม่ไว้ที่ตั้งค่า ใช้ปุ่ม/handler เดิม ไม่ทำสำเนาข้อมูล
- ทางลัด CSV ใต้ภาพรวมเปิดตั้งค่าโดยตรง การจัดการหมวดแยกประเภทจากร่างจดรายการ ไม่เปลี่ยนประเภทหรือหมวดข้ามรายรับ–รายจ่าย
- คง VERSION demo.25 จนกว่าจะอนุมัติออกรุ่น ไม่ commit/push/deploy และไม่แก้ promo-video
- ตรวจ history/capture/import/category/core และ Chrome isolated profile ด้วยข้อมูลสังเคราะห์; ภาพและ interaction 320/375/430/1280 ไม่มีแนวนอน ยังไม่ได้ตรวจ Safari/iPhone จริง

## ออกรุ่น demo.25 (2026-10-11)

- ผู้ใช้อนุมัติอัปเดตเว็บเดโม รวมการแก้ UX 5 ข้อด้านล่าง ข้อความ local-only เป็นสถานะก่อนอนุมัติ
- รุ่น 0.1.0-demo.25 ใช้ branch fix/demo-25-mobile-ux สำหรับ preview ก่อน merge เข้า demo ตาม RELEASE_PROCESS.md
- ผ่าน logic/UI 11 ชุด, syntax และ Chrome interaction/ภาพ 320/375/430/1280; ยังไม่ได้ตรวจ Safari/iPhone จริง
- คง localStorage jot-money-v1 และ schema เดิม ไม่รวมไฟล์เครื่องมือส่วนตัวที่ untracked และไม่แก้ promo-video

## Local — แก้ UX มือถือจาก critique 5 ข้อ (2026-10-11)

- เพิ่มบัญชีแรกจากหน้าจดได้โดยตรง ตั้งชื่อ/ยอดเอง ใช้ dialog เดิม กลับมาโฟกัสข้อความและรักษาร่างที่พิมพ์ไว้ ยกเลิกไม่สร้างบัญชี
- ย้ายช่องจดขึ้นก่อนยอดสรุปทั้งลำดับ DOM และหน้าจอมือถือ เดสก์ท็อปเป็นสองคอลัมน์ช่องจดและยอดสรุป
- ปรับสีข้อความ/placeholder/รับ–จ่าย เพิ่มขนาดข้อความมือถือและพื้นที่แตะ พร้อม focus สำหรับคีย์บอร์ด
- อธิบายที่เก็บข้อมูลและข้อจำกัด CSV ให้ตรงจริง เพิ่มทางลัดเปิด รายการทั้งหมด → สรุป → จัดการข้อมูล
- ปุ่มค้นหามีข้อความที่มองเห็น รักษาตำแหน่งแท็บและไม่เลื่อนปฏิทินเมื่อเปิดค้นหา
- ชุดตรวจเดิม 11 ชุดและ syntax ผ่าน เพิ่ม regression สร้างบัญชีแรก/ยกเลิก/รักษาร่าง/ยอดตั้งต้นใน capture-ui-check.cjs
- Chrome QA ใช้ isolated profile และข้อมูลสังเคราะห์: 320/375/430/1280 ไม่มีแนวนอน ตรวจภาพ flow จด/ค้นหา/เปิดวัน/ทางลัด CSV/โหลดข้อมูลกลับ; history-browser regression ผ่าน ยังไม่ได้ตรวจ Safari หรือ iPhone จริง
- หลักฐานเพิ่มใน ../.qa/mobile-refinement.cjs และ ../.qa/refinement-*.png; ไม่มี dependency ใหม่ ไม่มี schema/key เปลี่ยน
- Local only: VERSION คง 0.1.0-demo.24 ไม่ commit, push หรือ deploy; งานที่ยัง untracked เดิมคงไว้

## เผยแพร่ demo.24 (2026-10-09)

- รุ่น 0.1.0-demo.24 รวม UI3 Midnight Journal, กราฟรายรับ/รายจ่ายและรายสัปดาห์, หน้าต่าง Day Journal และการจัดวันที่ inline
- ชุดตรวจ logic/UI แบบ synthetic 11 ชุดและ syntax checks ของ app/core/ui3/analytics/chart-view/weekly ผ่านก่อนเผยแพร่; ไม่ใช้ข้อมูลบัญชีจริง
- คง localStorage key `jot-money-v1` และ schema เดิม; ไม่แก้ promo-video และไม่แตะ main
- เว็บไซต์: https://jot-money-demo.pages.dev/ — ตรวจ deployment/commit ที่เผยแพร่ได้หลัง push

## Local ล่าสุด — Inline capture date (2026-10-09)

- ลดกรอบวันที่ในหัวจดรายการ UI3 เป็นไอคอนและข้อความแบบ inline ข้างชื่อฟอร์ม ไม่มีกรอบเด่น ไม่ตกแถวที่ 320px คงพื้นที่แตะ 44px และ native date picker พร้อม focus คีย์บอร์ด ใช้ทั้งภาพรวมและแผงจด
- เปลี่ยนเฉพาะท้าย dist/ui3.css ไม่แก้ข้อมูล/วันที่/handlers; capture UI check ผ่าน

## Local ล่าสุด — UI3 Midnight Journal (2026-10-09)

- Chrome synthetic QA ผ่าน 320/375/390/430/1280 ครบ 3 หน้าหลักและ 8 dialogs; 7-column/ยอดยาว/geometry calendar↔summary/field transfer เท่ากัน/แก้วันและยอด/ลบ/import undo/empty ผ่าน พร้อม ripple cleanup, reduced motion และ ledger invariance ตรวจภาพ home/settings/calendar/quick/edit/account/category/import มือถือและ desktop แล้ว ไม่ใช่ Safari/iPhone จริง

- UI3 Midnight Journal ใช้โทนกรมท่า–ไอวอรี–เขียวและทองหม่นจากหน้าต่างรายวันเป็นระบบเดียวทั้งแอป: ภาพรวม จดรายการ ประวัติ ปฏิทิน สรุป บัญชี งบ โอน และหน้าต่างจัดการทั้งหมด พร้อม fade เปลี่ยนหน้า/เปิดส่วนย่อย แสงตอบสนองการแตะ และข้อความบันทึกสำเร็จเคลื่อนไหว รองรับ reduced motion
- ใหม่ dist/ui3.css + ui3.js, index.html เพิ่ม stylesheet/script และ class ui3-theme ร่วม ui2-theme เพื่อคงฐาน layout ฟีเจอร์/hidden/วันที่เดิม ไม่แตะ core/schema/key
- สำรอง static app ก่อน UI3 ทั้งชุดที่ ui-versions/ui2-2026-10-09/dist พร้อม SHA256.json ไม่มี browser ledger และไม่ทำสำเนา UI1 ซ้ำ
- กลไก UI3 เป็น presentation-only: navigation fade, details toggle fade, ephemeral pointer glow (cleanup เมื่อ animation เสร็จ/ยกเลิก), toast fade; ไม่อ่าน/เขียน storage ไม่แทน handler เดิม เคารพ reduced motion
- ผู้ช่วย GPT-6.1 Sol/Medium ตรวจ 11 synthetic suites baseline ผ่านและตรวจ UI3 แยก พบ title summary มืดบนพื้นเข้ม แก้ cascade แล้ว; main Chrome พบ −123M ล้นช่องจอเล็ก แก้ padding/font แล้ว ไม่มีปัญหาค้างจากผู้ตรวจ
- งาน local ไม่ commit/push/deploy VERSION คง demo.23 ไม่แก้ promo-video หรือ UI1

## Local ล่าสุด — Calendar Day Journal (2026-10-09)

- ปรับหน้าต่างรายการของวันที่แตะจากปฏิทินเป็น Day Journal: หัววันที่กรมท่าพร้อมวันในสัปดาห์/จำนวนรายการ การ์ดยอดรับ–จ่าย–สุทธิ ปุ่มจดเพิ่มใกล้หัวรายการ และการ์ดรายการพร้อมลูกศรแก้ไข ลดวันที่ซ้ำในแต่ละรายการ ไม่เปลี่ยนยอด/วันที่/การกรองและกลไกแก้ไขเดิม
- เปลี่ยน index.html, ui2.css และ app.js row(e,context,dayDetail) แบบ opt-in เฉพาะ calendarModalEntries หน้าอื่นใช้ row เดิม
- history-ui/capture ผ่าน; Chrome synthetic QA ตรวจเปิดวัน→จดเพิ่ม→แก้ไข→กลับวัน พร้อมรูป 320/375/430/1280 และยอด/ชื่อยาว ตรวจภาพหลายประเภทรายการ 320/375/1280 แล้ว ยังไม่ทดสอบ Safari/iPhone จริง
- Local only VERSION คง demo.23 ไม่ commit/push/deploy

## Local ล่าสุด — Income Donut (2026-10-09)

- Chrome synthetic QA ผ่าน 320/375/430/1280 รวมรายรับ500=100%, สลับสามแท็บไม่มี overflow และตรวจภาพ income 320/1280 แล้ว ไม่มีการทดสอบบน iPhone จริง

เพิ่มแท็บ “รายรับตามหมวด” ในกราฟวิเคราะห์ ข้างรายจ่ายและรายสัปดาห์ ใช้ Interactive Donut โทนเขียวพร้อมยอด/เปอร์เซ็นต์เฉพาะรายรับของเดือนเดียวกัน ไม่รวมโอนและปรับยอด มีสถานะไม่มีรายรับ

- analytics.js expose incomeTotal/incomeCategories แยกจาก expense API เดิม ใช้ History cent/day/month; chart-view.categoryPanel reuse one visible SVG เพื่อไม่ซ้ำ id; app activeDonutCategories ยึดแท็บ income/categories ทุก handlers และ refresh
- ผู้ช่วย GPT-6.1 Sol/Medium ทำสูตรและ tests แยกไฟล์ ผู้จัดการตรวจสูตร/เชื่อม UI; analytics/chart-view/history-ui/capture ผ่าน รวมสลับหมวดและสถานะไม่มีรายรับ ไม่เปลี่ยน ledger/schema
- Local only VERSION คง demo.23 ไม่ commit/push/deploy

## Local ล่าสุด — Interactive Donut (2026-10-09)

- ปรับ Donut เป็นวง SVG ไล่แสงเงา มีช่องแบ่งและชิ้นหมวดที่เลือกขยับออก พร้อมชื่อ/เปอร์เซ็นต์/ยอดกลางวง มีแอนิเมชันเปิดและเปลี่ยนตัวเลข เลือกได้ด้วยแตะ hover เมาส์ ปุ่มก่อนหน้า/ถัดไป และคีย์บอร์ดซ้ายขวา รองรับ reduced motion ไม่เปลี่ยนสูตรหรือข้อมูล
- Renderer และ DOM checks ผ่าน รวมวนหมวด/hover/ลูกศร ขนาด 320/375/430/1280 ผ่าน Chrome และตรวจภาพหลายหมวดที่ 375/1280 แล้ว ยังไม่ตรวจบน Safari/iPhone จริง
- แก้ chart-view.js, app.js, ui2.css และ history-ui-check.cjs งาน local ไม่ commit/push/deploy

## Local ล่าสุด — ปรับกราฟให้อ่านง่าย (2026-10-09)

ปรับกราฟวิเคราะห์เป็นแท็บแยก “รายจ่ายตามหมวด / รับ–จ่ายรายสัปดาห์” โทนกรมท่า/เขียว/แดงสุภาพ Donut มีรอยแบ่งและแถบสัดส่วนหมวด กราฟแท่งมีช่วงวันที่ และการ์ดยอดรับ–จ่าย–สุทธิของสัปดาห์ที่เลือก เริ่มจากสัปดาห์ที่ยอดรับ+จ่ายมากที่สุด ตัวเลขยาวจัดแถวบนมือถือ คงสูตรเดือนและข้อมูลเดิม

- สูตรไม่เปลี่ยน; analytics/chart-view/history-ui/capture-ui ผ่าน Chrome synthetic QA 320/375/430/1280 รวมสลับแท็บและ long values/transfer-only ตรวจภาพหลายหมวด/สัปดาห์ทั้ง 375 และ1280 แล้ว ไม่ใช่ iPhone จริง
- แก้ chart-view.js, app.js, ui2.css และ renderer test; local only ไม่ commit/push/deploy VERSION คง demo.23

## Local ล่าสุด — กราฟวิเคราะห์ (2026-10-09)

- เพิ่ม “ดูกราฟวิเคราะห์” ใน รายการทั้งหมด → สรุป เปิด dialog แยกรายจ่ายตามหมวดด้วย Donut และเทียบรับ–จ่ายรายสัปดาห์ด้วย SVG ไม่เพิ่ม dependency ใช้เดือนที่เลือกและข้อมูลทั้งหมด ไม่ใช้คำค้น ไม่รวมโอน/ปรับยอด แตะหมวดหรือสัปดาห์เพื่อดูยอดเต็ม มีตารางตัวเลขและสถานะว่าง ข้อมูลเดิมไม่เปลี่ยน
- dist/analytics.js derive จาก Weekly/History, dist/chart-view.js สร้าง SVG และ escape ชื่อหมวด, app.js derive ใหม่ขณะเปิดและเมื่อ render หลัง ledger เปลี่ยน ไม่มี storage/schema เปลี่ยน
- analytics-check, chart-view-check, history-ui-check, capture-ui-check, weekly-check, import-ui-check และ core check ผ่าน ผู้ช่วย GPT-6.1 Sol/Medium ตรวจ integration แยกไม่พบปัญหามีหลักฐาน ไม่ใช้ Astra
- งาน local ไม่ commit/push/deploy VERSION คง demo.23 จนอนุมัติเผยแพร่
- Chrome synthetic browser QA ผ่าน 320/375/430/1280: เปิด/ปิดและคืน focus, Enter เลือกสัปดาห์, ยอดเต็ม, overflow, refresh ขณะเปิด และเดือนมีเฉพาะโอน ตรวจภาพ analytics 375/1280 หลัง animation แล้ว ไม่ใช่ Safari/iPhone จริง

## Local ล่าสุด — สลับปฏิทิน/สรุปให้โครงเข้ากัน (2026-10-09)

- history-search-slot จองพื้นที่ปุ่มค้นหาแม้ซ่อนใน summary ไม่ให้ segments ยืด แยก calendarPeriod/weeklyPeriod ไว้ตำแหน่งร่วมเหนือแถบยอด; labels ปี/เดือนยังมี sr-only
- weeklyMonthSummary ใช้ calendar-summary/history-totals ชุดเดียวกับ calendarMonthSummary มีป้าย “ข้อมูลทั้งหมด” ยังคงไม่กรองยอด weekly ด้วย search; หัวข้อสรุปซ้ำถูกเอาออก คำอธิบายยาวอยู่ใน weekly-help
- changeCalendarMonth sync weeklyYear/Month; weekly selectors/current เรียก changeCalendarMonth; เมื่อเข้า summary ยึดเดือน calendarMonth ที่ดูอยู่ เพื่อไม่กระโดดไปเดือนอื่น ไม่ mutate ledger/date/account/schema
- weekly-week เปลี่ยนเป็น compact rows แสดงวัน/จำนวนและยอดครบ รองรับตัวเลขยาวใน mobile ด้วยแถวเต็ม; ปุ่มจัดการข้อมูลและ handlers เดิมคงอยู่
- history DOM/capture/weekly/syntax ผ่าน รวม assertion เดือนร่วมกัน งาน local ไม่ commit/push/deploy VERSION คง demo.23
- Chrome synthetic regression ผ่าน 320/375/430/1280 พร้อมตรวจ geometry ว่าตำแหน่ง/ความกว้างแท็บ, แถวเดือน, ตำแหน่งและความสูงแถบยอดตรงกันเมื่อสลับ calendar→summary ปุ่มเดือนนี้ไม่ clip; ตรวจภาพ mobile/desktop แล้ว ไม่ใช่ Safari/iPhone จริง

## Local ล่าสุด — รายสัปดาห์ในเดือนแทนไตรมาส (2026-10-09)

- แท็บ summary ใช้ weeklyYear/weeklyMonth เลือกเดือนแทน Q1–Q4, ปุ่ม “เดือนนี้”, renderWeekly แสดงยอดเดือนและทุก 4/5/6 สัปดาห์พร้อมช่วงวันจริง
- dist/weekly.js ใช้ History.monthGrid แบ่งแถวจันทร์–อาทิตย์ กรอง null ต้น/ท้ายเพื่อจำกัดเฉพาะเดือน History.dayKey/summary กฎเวลาไทย/cent เดิม ไม่ mutate หรือเปลี่ยน schema/key; ส่ง state.entries ทั้งหมดไม่ใช้ search
- นำ quarter.js/quarter-check.cjs ที่สร้างในงาน local ก่อนหน้าออก ใช้ weekly.js/weekly-check.cjs แทน ไม่แตะ snapshot หรือข้อมูลผู้ใช้ บันทึกไตรมาสด้านล่างเป็นประวัติที่ถูกแทน
- ผู้ช่วย Sol/Medium สร้างและตรวจสูตร weekly แยก ผ่านช่วง Oct2026, 4/5/6 สัปดาห์, ข้ามเดือน/ปี/เที่ยงคืน, ทศนิยม, exclusion, รวมตรงเดือน/immutability; ตรวจ integration read-only ไม่พบปัญหามีหลักฐาน
- history-ui-check ปรับยอดรายเดือนพร้อม edit ย้ายออก/เข้าเดือน, delete, import replacement/undo, search isolation/current month; capture/weekly/syntax ผ่าน ยังไม่ commit/push/deploy VERSION คง demo.23
- Chrome synthetic QA ผ่าน 320/375/430/1280 รวมเลือกเดือน/ปี สรุปยอด 500−650=−150 การ์ด 5 สัปดาห์และนำเข้าจากแท็บสรุป ตรวจภาพ weekly 375/1280 แล้ว ไม่ใช่ iPhone/Safari จริง

## Local ล่าสุด — สรุปเป็นแท็บถัดจากปฏิทิน (2026-10-09)

- data-history-view เรียง list/calendar/summary; ย้าย section#summary เข้า history-panel เอา class.view ออกและลบ data-tab=summary เมนูหลักกลับ home/history/settings
- renderHistory สลับ summary เช่นเดียวกับอีกสองมุมมอง เมื่ออยู่สรุปซ่อนแถบยอด list/month และค้นหา/notice เพราะไตรมาสใช้ข้อมูลทั้งหมด การกรองเดิมยังอยู่เมื่อกลับ list/calendar ไม่เปลี่ยนยอดหรือ schema
- จัดปุ่มสามตัวให้พอดีมือถือ ไม่แสดงไอคอนซ้ำในตัวสลับจอแคบ คงไอคอนเมนูหลัก; quarter panel ลดกรอบ/ระยะซ้อน ยังคงจัดการข้อมูลในแท็บสรุป
- DOM/capture/quarter/syntax ผ่าน ยังไม่ commit/push/deploy VERSION คง demo.23 บันทึกหน้าสรุปแยกด้านล่างเป็นประวัติก่อนย้าย
- Chrome synthetic regression ผ่าน 320/375/430/1280 รวมส่วนหัวร่วม ค้นหาแบบทับ ยอดไตรมาส และนำเข้าจากแท็บสรุป ตรวจภาพปุ่มสามตัวที่ 320 และแท็บสรุปที่ 375 แล้ว ไม่ใช่ iPhone/Safari จริง

## Local ล่าสุด — ส่วนหัวประวัติร่วม / ค้นหาแบบทับ / สรุปไตรมาส (2026-10-09)

- แทน flow historyUtilities ที่ขยายแทรกปฏิทิน: toggleHistoryTools เปิด historySearchDialog มี search ID เดิม ภายหลังปิดเหลือ historyFilterNotice + clearHistoryFilter ค้นหาทั้งสองมุมมองร่วมกัน ไม่ดัน grid เมื่อเปิดหน้าต่าง
- history.calendar-compact ใช้ทั้ง list/calendar; calendarMonthSummary อยู่เหนือทั้งสอง view แสดงยอดทุกผลรายการใน list หรือยอดเดือนที่กำลังดูใน calendar พร้อมชื่อขอบเขต/จำนวนรายการ/ผลค้นหา
- เพิ่ม nav summary และ section#summary; quarterYear/quarterPeriod ค่าเริ่มไตรมาสปัจจุบัน เลือกปีที่มีข้อมูลหรือปีปัจจุบันได้ Quarter.summarize ใช้ History.dayKey/summary ไม่ mutate ไม่มี migration/ledger ใหม่
- renderHistory เรียก renderQuarter จาก state.entries ทั้งหมด ไม่กรองด้วย search ทุก render หลังเพิ่ม/แก้/ลบ/import/undo อัปเดตทั้งสองส่วน; quarterly transfer/adjustment นับจำนวนรายการ แต่ไม่รวมรับ/จ่าย/สุทธิ
- openImport/export/undoImport IDs เดิมย้ายเข้า details.data-management ใน summary; ปุ่มจัดการข้อมูลทำกับข้อมูลทั้งหมด ไม่กรองตามไตรมาส คง handlers เดิม
- ผู้ช่วย GPT-6.1 Sol / Medium เป็นเจ้าของ dist/quarter.js + quarter-check.cjs และตรวจ integration แบบ read-only แยก ผ่านสูตร/date/immutability/query isolation/quarter boundary edit/import refresh ไม่ใช้ Astra
- ชุดตรวจ 9 ชุดรวม quarter-check + history UI สำหรับแก้ยอด/ลบ/import replacement/undo/query isolation/เลือกไตรมาสผ่าน ยังไม่ commit/push/deploy VERSION คง demo.23 งาน local ก่อนหน้านี้ยังรักษาไว้
- Chrome isolated synthetic QA ผ่าน 320/375/430/1280: toolbar/summary ตำแหน่งตรงกันทั้งสองมุมมอง, เปิด search dialog grid ไม่เลื่อน, close/query/filter clear, ยอดไตรมาส 500−650=−150, 3 monthly rows และนำเข้าจากหน้าสรุป ภาพ list/calendar/search/quarter mobile+desktop ตรวจแล้ว ไม่ใช่ Safari/iPhone จริง

## Local — ทดลองปฏิทินกระชับ (2026-10-09)

- history.calendar-compact เฉพาะ calendar view ซ่อน inner heading/zone/explanation ซ้ำ; toggleHistoryTools แสดง historyUtilities ที่มี search/import/export/undo IDs เดิม เมื่อมีคำค้นจะเห็นช่องค้นหาและ notice เสมอ list view ยังแสดงเครื่องมือ
- สรุปเดือน 3 คอลัมน์ ยอดเต็ม wrap ได้ navigation แถวเดียว ไม่ย่อช่องวันที่เพิ่ม; legends ย้ายเข้า details.calendar-help พร้อมคำอธิบายสุทธิ ต้องเปิดอ่านเมื่อสงสัย ไม่มี emoji/dependency/schema ใหม่ ยังไม่ commit/push/deploy VERSION คง demo.23
- หากยอดเดือนใด >= 100,000 ใช้ has-long-totals บนมือถือเพื่อเรียง 3 แถวกระชับ แสดงยอดเต็ม ไม่ตัดกลางตัวเลข; ยอดทั่วไปยัง 3 คอลัมน์ ตรวจ Chrome 320/375/430/1280 และภาพมือถือ/desktop แล้ว ไม่ใช่ iPhone จริง

## Local — สรุปเดือนด้านบนปฏิทิน (2026-10-09)

- ย้าย section#calendarMonthSummary เป็นองค์ประกอบแรกของ calendarView เหนือ navigation/grid ใช้ ID/render/CSS/สูตรเดิม เพิ่ม DOM assertion ว่าอยู่บนสุดและไม่ซ้ำ ยังไม่ commit/push/deploy

## Local — วันที่หน้าภาพรวมเป็นวันนี้ (2026-10-09)

- tab('home') เรียก resetCaptureDate; quickDialog close จาก historyCaptureDate คืนวันที่ฟอร์มร่วมเป็น History.today() หลังคืน focus โดยคงข้อความ/หมวดร่าง เลือกวันที่เองระหว่างใช้งานยังอยู่จนบันทึกหรือกลับเข้าหน้าภาพรวม
- ปฏิทินยังเปิดจดตามวันที่เลือก ไม่เปลี่ยนข้อมูลเดิม; capture-ui-check เพิ่มเคส cancel ย้อนหลัง, กลับ home, render ไม่ล้างวันที่ที่แก้เอง และจดจากปฏิทิน ชุดตรวจ capture/history DOM + logic และ syntax ผ่าน ยังไม่ commit/push/deploy VERSION คง demo.23

## demo.23 — ผู้ใช้อนุมัติเผยแพร่ 2026-10-08

- รวมงานหัววันกดจดย้อนหลัง และแตะปฏิทินเปิดหน้าต่างสรุป/รายการเพื่อแก้ไข/ลบ/จดเพิ่ม ลบรายละเอียดซ้ำใต้ปฏิทิน คงสรุปเดือน ไม่เปลี่ยน schema หรือข้อมูลผู้ใช้
- เตรียมบน release/demo-23 ตรวจ Cloudflare preview ก่อน fast-forward demo; ไม่เปลี่ยน main, promo-video หรือ UI1 snapshots ข้อความ local-only ด้านล่างเป็นประวัติก่อนอนุมัติ
- ชุดตรวจ logic/DOM/category/synthetic import ทั้ง 8 ชุดและ syntax ผ่าน; Chrome isolated synthetic QA ผ่าน 320/375/430/1280 ในงานรอบก่อน ไม่ใช่ Safari/iPhone จริง

## Local — แตะช่องวันเพื่อดูรายการและแก้ไข (แทน flow เปิดจดทันที)

- ล่าสุดลบ section.calendar-detail ใต้ปฏิทินแล้ว renderHistory เติม calendarModalSummary/Entries โดยตรง ไม่พึ่ง DOM รายละเอียดซ้ำ; คง calendarMonthSummary ไว้ ตรวจ DOM เพิ่มว่า IDs รายละเอียดเก่าไม่อยู่ และ flow เพิ่ม/แก้/ลบผ่าน
- ช่องวันเปิด calendarDayDialog แสดงสรุปและ row รายการรูปแบบเดียวกับรายการทั้งหมด จากผลค้นหา/กลุ่มวันที่ชุดเดียวกัน ไม่เก็บสำเนา ledger หรือเปลี่ยน schema
- แตะรายการเปิด editDialog เดิมซ้อนด้านบน ปิด/บันทึก/ลบแล้วกลับหน้าต่างวันเดิม ข้อมูลอัปเดตผ่าน renderHistory; ย้ายรายการออกจากวันเดิมแล้ววันเดิมแสดงผลล่าสุด
- calendarModalAdd เปิด quickDialog โดยใช้วันที่เลือก บันทึกแล้วกลับหน้าต่างวัน; ปิดหน้าต่างวันคืน focus ช่องวัน ไม่ต้องเลื่อนไปประวัติด้านล่าง
- ตรวจ capture-ui-check (วันว่าง, เพิ่ม, แก้ยอด, ย้ายวัน, ลบ, focus), history-ui-check, history-check และ check.cjs ผ่าน งาน local เท่านั้น VERSION ยัง demo.22 ไม่ commit/push/deploy
- isolated Chrome browser regression ผ่าน รวมหน้าต่างวัน/ผลค้นหา, เพิ่ม/แก้ยอดแล้วกลับหน้าต่างวัน, keyboard และ overflow 320/375/430/1280; ตรวจภาพหน้าต่างวัน 375/1280 แล้ว ไม่ใช่การทดสอบ Safari หรือ iPhone จริง

## Local — flow เดิมที่ถูกแทน: แตะช่องวันเพื่อเปิดจดทันที

- data-calendar-day click เลือกวัน/renderHistory แล้วเรียก openCapture(key,true) ทันที ใช้ quickCard/dialog เดิม ไม่สร้างสำเนา ledger เพิ่ม historyCaptureDayCell เป็น transient flag เท่านั้น
- closeQuick คืน focus ไป data-calendar-day เมื่อเปิดจากช่องวัน (preventScroll) หลังแก้วันที่/save alignHistoryCaptureDate ตามวัน/เดือนจริง; เปิดจากหัววันใต้ปฏิทินยังคืน focus หัววันแบบเดิม เปิดจดลอยยังวันนี้ ไม่เปลี่ยน data schema หรือ UI1
- เปลี่ยน legend/accessible label ให้สื่อว่าแตะวันเพื่อจด รายละเอียดและประวัติใต้ปฏิทินคงอยู่ งานนี้ local ไม่ commit/push/deploy เว็บยัง demo.22
- ผ่าน capture-ui-check direct cell: วันว่าง/มีรายการ, expense/income/transfer, เปลี่ยนวันที่ข้ามปีแล้วคืน focus ช่องวันใหม่, cancel และเปิดจดทั่วไปกลับวันนี้; history-ui-check/syntax และ isolated Chrome ผ่าน รวมเปิดจากวันมีรายการ/วันว่าง บันทึกแล้วคืน focus cell และภาพจอมือถือ ไม่ใช่ iPhone จริง

## Local — แตะหัววันเพื่อจดรายการ

- เปลี่ยน daily h3 ให้มี native button.history-date-trigger ครอบ time/count/plus และย้าย calendarCaptureDate เข้า h3 พร้อม span#calendarDayTitle ยังคง data-capture-date/IDs/handlers เดิม ปุ่มรองรับ Enter/Space และ aria-haspopup/label
- เอาปุ่ม “จดวันที่นี้” แยกออก ยอดสรุปอยู่ด้านนอกปุ่ม จึงไม่เปิดฟอร์มเมื่อแตะยอด ไม่เปลี่ยนข้อมูลหรือกฎวันที่ ไม่แตะ UI1 snapshots งานนี้ local ยังไม่ commit/push/deploy เว็บยัง demo.22
- ผ่าน capture-ui-check (เพิ่ม assertions โครงปุ่มหัววัน/ไม่มีปุ่มแยก/แตะยอดไม่เปิดแผง), history-ui-check, app syntax และ isolated Chrome regression รวม Enter เปิดหัววัน คืน focus หลัง save วันว่าง/โอน/เปลี่ยนเดือน/search และ layout 320/375/390/430/1280 ดูภาพจริง mobile list และ desktop calendar แล้ว ไม่ใช่การตรวจ iPhone จริง

## demo.22 — กรอบฟ้าหลังปิดโอน

- ภาพ IMG_2845.PNG แสดง native focus ring ครอบ #home (section tabindex=-1) ไม่ใช่ปุ่มโอน เพิ่มเฉพาะ .ui2-theme #home[tabindex="-1"]:focus{outline:none} ใน ui2.css คง skip-link/focusability และกรอบ interactive controls ไม่ใช้ blur หรือเปลี่ยน JS/data
- ผู้ใช้อนุมัติให้อัปเดตเว็บแล้ว เตรียม demo.22 บน release/demo-22 ตรวจ preview ก่อน fast-forward demo ไม่เปลี่ยน main หรือ UI1 snapshots ต้องยืนยันผลบน Safari/iPhone จริง
- ผ่าน capture-ui-check และ isolated Chrome regression: จำลอง focus #home ก่อนเปิด/ปิด transfer แล้ว activeElement กลับ #home โดย outlineStyle none, tabindex ยังคง -1; ส่ง Tab แล้วตรวจปุ่ม nav มี focus-visible/outline >=2px ยืนยันว่าไม่ได้ปิดกรอบคีย์บอร์ดทั้งหมด

## demo.21 — ช่องวันที่โอนบน iPhone

- ผู้ใช้ส่ง IMG_2844.PNG แสดงช่องวันที่โอนกว้างเกิน input/select อื่นและข้อความอยู่กลาง แก้เฉพาะ dist/ui2.css: transfer fields width/min-width/max-width + fixed 52px height; transferDate appearance none และ WebKit value text-align left คง native date picker/validation ไม่แก้ JS หรือข้อมูล
- ผู้ใช้อนุมัติอัปเดตเว็บแล้ว เตรียม demo.21 บน release/demo-21 ตรวจ preview ก่อน fast-forward demo; ยังต้องให้ผู้ใช้ยืนยันบน iPhone 13 จริง เครื่องนี้มี Chrome แต่ไม่มี Safari/WebKit runner ไม่เปลี่ยน main หรือ UI1 snapshots
- ผ่าน capture-ui-check และ isolated Chrome regression; เพิ่มตรวจ bounding boxes ช่องโอนทั้ง 5 ให้ left/width/height ตรงกันและ date text-align left ที่ 320/375/390/430/1280 ดูภาพ transferDialog-390 แล้ว ไม่มีแนวนอนล้น ไม่ถือเป็นการยืนยันบน iPhone/Safari จริง
- การเผยแพร่ demo.21 ติดขัด: Git HTTPS ไป github.com:443 เชื่อมต่อไม่สำเร็จสองครั้งแม้ใช้สิทธิ์ network; GitHub connector อ่าน demo.20 ได้ แต่ create_tree ถูกปฏิเสธ HTTP 403 Resource not accessible by integration ไม่ได้แก้ remote branch หรือ deploy ใด ๆ เก็บงานบน release/demo-21 และ ZIP ไว้พร้อมทำต่อ เมื่อเชื่อมต่อ GitHub ได้ให้ push branch นี้ ตรวจ preview แล้ว fast-forward demo ห้าม force push

## demo.20 — ใช้ UI2 ถาวร

- ผู้ใช้ขอเอาตัวเปรียบเทียบออกและใช้ UI2 แทน ต่อเนื่องจากการอัปเดตเว็บ demo.19 อนุมัติอัปเดตเว็บเดโมรอบนี้
- ลบ controls/ป้าย UI 2 และการโหลด ui-preview.css/js รวมตัวไฟล์ ใช้ body.ui2-theme + ui2.css ตามเดิม เก็บ UI1 snapshots ไม่เปลี่ยน ไม่แก้ logic/storage/schema
- รุ่นปัจจุบัน demo.20 บน release/demo-20 ตรวจ preview ก่อน fast-forward demo; main ไม่เปลี่ยน บันทึก UI2 preview ด้านล่างเป็นประวัติก่อนเลือกใช้ถาวร

## ออกรุ่น demo.19 — อนุมัติ 2026-10-08

- ผู้ใช้สั่ง “update เว็ปเลยครับ” อนุมัติ commit/push และอัปเดตเว็บเดโมของงาน local ล่าสุดทั้งหมด รวม Quiet Atelier UI2 และฟีเจอร์หลัง demo.18 ข้อห้ามเผยแพร่ในบันทึกเก่าด้านล่างเป็นสถานะก่อนอนุมัติครั้งนี้
- เตรียมรุ่น 0.1.0-demo.19 บน release/demo-19 ตรวจ Cloudflare preview ก่อน fast-forward demo; ไม่เปลี่ยน main, ข้อมูลผู้ใช้ หรือ promo-video เก็บ UI1 ทั้งสองชุดไม่แก้ไข

## UI2 preview — เก็บ UI1 แล้ว (2026-10-08)

- User approved complete visual redesign for review, retain every feature, save old UI as ui1; do not push/deploy. UI1 exact pre-redesign snapshot is `ui-versions/ui1/dist/` (+ root docs/tests), served copy `dist/ui1/`; SNAPSHOT.md records hashes. These include all latest uncommitted capture/category changes, not just deployed demo.18.
- Main `dist/index.html` loads `ui2.css` over original style.css, body.ui2-theme, comparison controls and ui-preview.js/css. Main app/core/history/excel-import/import-ui and original style.css remain byte-identical to the saved UI1.
- `previewThemeToggle` toggles the UI2 stylesheet and body class only, preserving forms/drafts/calendar/state/storage. No persisted preference yet; reload opens UI2 until user decides. Exact archived UI1 at `/ui1/index.html` remains unchanged. Normal comparison should use the in-page toggle.
- UI2 revised direction is Quiet Atelier / private finance: warm ivory/porcelain surfaces, graphite text, solid midnight balance/primary actions, restrained brass detail; one token/component system across home/history/calendar/accounts/dialogs/import. Semantic green/red retain income/expense meaning. Sol/Medium defines direction and owns ui2.css; Luna/Low provides bounded read-only color/mobile-risk audit (no Light setting exposed); independent Sol/Medium reviews data regressions. No Astra escalation needed for this visual-only scope.
- NotoSansThai-variable.ttf + OFL copied from existing promo-video/public/fonts without modifying that folder; runtime serves font locally.
- Two assistants configured GPT-6.1 Sol/Medium: ui2_design owned ui2.css; review_history read-only reviewed all IDs/8 forms/business script order, snapshot byte parity and 6 logic/DOM suites. Main added font/contrast/search-padding polish and in-page toggle after design handoff; no Astra escalation.
- Chrome isolated synthetic QA passed 320/375/430/1280: existing history/capture/category/import checks, all 8 dialogs' viewport bounds, home/history/settings overflow, toggle preserving ledger/draft/day/storage, local font loaded. Actual screenshots inspected desktop/home/settings/history/calendar/import/transfer. This is not physical iPhone testing.
- Preserve `ui-versions/ui1` and `dist/ui1` unchanged. UI rollback should restore UI presentation only, keeping future business logic and user storage. Current VERSION stays demo.18 with local changes in Unreleased; no commit/push/deploy.
- Quiet Atelier QA: all 8 logic/DOM/synthetic import suites pass; Chrome isolated profile passes existing full flow + 320/375/430/1280 overflow/dialog/toggle checks. Root inspected newly rendered home/history/calendar/accounts/capture/transfer screens. Supporting text/income/expense palette contrast on porcelain is 5.42/5.53/5.34:1; selected-day income/expense is 8.38/7.73:1 on midnight. These are palette checks, not a full accessibility audit or physical iPhone test. Chrome screenshot runner waits for calendar-button transitions before capture.

## งาน local ล่าสุด — 2026-10-08

- Money.createInitialState สร้าง empty ledger + categoryPreset:'general-v1' พร้อม generalExpenseCategories 9 / generalIncomeCategories 6 และ categoryTypes แยก; app initial เรียก factory เฉพาะไม่มี valid storage หรือ explicit reset ผู้ใช้ยืนยัน Existing valid ledgerแม้ว่างยัง migrate แบบ legacy ไม่มี marker
- categories/generalSuggest เข้า branch เฉพาะ general-v1; defaultCategories/incomeCategories legacy ไม่เปลี่ยน, aliases general rename รองรับและ categorylearningยังใช้ explicit-only เหมือนเดิม ไม่เปลี่ยน schemaVersion2 หรือ jot-money-v1
- ผู้ช่วย new_category_tests ตั้งค่า GPT-6.1 Sol/Medium owner new-user-category-check.cjs; reviewer แยก Sol/Medium read-only ตรวจ old migrationเทียบHEAD, aliases, totals/debt/budget, import append/replace/undo invariance ผ่าน ไม่ใช้ Astra
- ผ่านชุดตรวจเดิม+category/new-user/capture และ Chrome truefresh isolated storage: preset zero-state, 10 expense / 7 income optionsรวมรอจัดหมวด, สร้างบัญชี/save/reload/learning, categorydialog320pxไม่ล้น; ดูภาพจริงแล้ว ไม่ใช่ iPhone จริง ไม่มี commit/push/deploy

- categorySuggestion ใน core เลือกหมวด frequency ของ exact normalized note แยก income/expense จาก entries.categoryChoice==='user' เท่านั้น tie latest categoryChoiceAt แล้ว insertion index; fallback rule/aliases เดิม ไม่ใช้ legacy/import/auto/transfer/adjustment หรือรอจัดหมวดเป็นหลักฐาน
- app เพิ่ม optional entry metadata categoryChoice/categoryChoiceAt เมื่อ manualCategory save หรือ explicit category edit (editCategoryTouched/different category); แก้เพียงยอด/วันไม่สร้างหลักฐานใหม่ ไม่เปลี่ยน schemaVersion 2, localStorage key, รายการเก่า, ยอดบัญชี/งบ ไม่เพิ่ม dependency/backend
- หลักฐานมาจากรายการปัจจุบัน ลบรายการแล้ว vote หาย แก้/เปลี่ยนชื่อหมวดตาม ledger ไม่มี cache แยก คง backup/import undo; เริ่มเรียนหลังอัปเดตนี้ ไม่เดาว่าผู้ใช้เลือกหมวดเก่าเอง
- ผ่าน category-check, capture-ui-check, history/core, synthetic import ทั้งสองชุด และ Chrome จริง manual/auto/reload/type split; reviewer ตั้งค่า GPT-6.1 Sol/Medium ตรวจ read-only + frozen-state probe ผ่าน ไม่มีการยกระดับ Astra

- เพิ่ม data-capture-date ที่หัวกลุ่มวัน + calendarCaptureDate ในรายละเอียดวัน (รวมวันว่าง) เรียก openCapture(key) ด้วย quickCard/input เดิม ไม่สร้างสำเนาฟอร์มหรือ ledger
- historyCaptureDate เป็น transient context; alignHistoryCaptureDate(date) ก่อน render หลัง save รับ/จ่าย/โอน ทำให้ปฏิทินตามวันที่/เดือนจริง คง search/notice; close ล้าง context และคืน focus ปุ่มประวัติ เปิดจดทั่วไปยังใช้วันนี้
- ผ่าน synthetic capture/history/core tests และ Chrome จริง: Enter เปิดปุ่มวัน, native submit รับ/จ่าย/โอน, วันที่ว่าง, ข้ามปี, คืน focus หลัง native close event, layout 320/375/430/1280; reviewer Sol/Medium ตรวจ read-only ผ่าน ไม่เปลี่ยนสูตร/schema ข้อมูลเดิมหรือ promo-video

- ผู้ใช้อนุมัติย้ายวันที่เข้าหัวข้อจดรายการ เฉพาะ local; ห้าม push/deploy จนมีคำสั่งใหม่ การอนุมัติเผยแพร่วันที่ 7 ต.ค. เป็นงานที่เสร็จแล้ว
- entryDate อยู่ใน capture-heading ใช้ form="entryForm" รักษา native required validation; ใช้ input เดียวทั้งหน้าแรกและ quickDialog
- วันที่ไทยแบบย่อแสดงเป็นข้อความพร้อมไอคอน ไม่มีกรอบเด่น จัดแนวเดียวกับ h2 ด้วย grid; ป้ายแสดงเฉพาะย้อนหลัง/ล่วงหน้า ไม่แสดงวันนี้ซ้ำ; <=370px จัดใต้หัวข้อ Native date input แสดงเมื่อ focus ใช้คีย์บอร์ดได้ ไม่เปลี่ยน date/storage/balance rules
- ผ่าน check, history-check, history-ui-check, capture-ui-check, synthetic import ทั้งสองชุด, app syntax และ Chrome 320/375/430/1280; ตรวจภาพจริงที่ 320/375 ไม่ใช่ iPhone จริง
- คง VERSION demo.18 และบันทึกใน CHANGELOG Unreleased ไม่แก้ released ZIP ไม่มี commit/push/deploy หรือปิดเครื่องในงานนี้

## งานล่าสุด: demo.18

- หน้าแรก capture-first: ไม่มีลิสต์บัญชี, สรุปเงินกระชับ, ทางลัดไปหน้าบัญชี; chooser dialog ค้นหาชื่อ/กลุ่ม ใช้ Money.wallets เพื่อรักษากฎบัญชีซ่อน/ถังขยะ/ผู้ยืม
- `jot-money-v1-last-account` เก็บเฉพาะ id บัญชีล่าสุด ไม่เปลี่ยน schema/ledger; validated fallback เมื่อ id ใช้ไม่ได้ และ preference failure ไม่กระทบการบันทึกรายการ
- `capture-ui-check.cjs` และ Chrome ผ่าน many-account layout 320/375/430/1280, picker, nested quickDialog, draft/category preservation, account save, reload preference และ ledger invariance; ผู้ตรวจแยก Sol/Medium ไม่พบปัญหาข้อมูล
- เพิ่มรายการแบ่งรายวันและปฏิทินรายเดือนในหน้า “รายการทั้งหมด”; search ใช้ชุดข้อมูลเดียวกันกับยอดวันและเดือน
- ช่องปฏิทินแสดงยอด “รับ” เฉพาะวันที่มีรายรับ (ใช้ข้อมูลหลังค้นหา); รายการโอนไม่ทำให้เกิดยอดรับ
- ปฏิทินมือถือ <=640px เป็น compact day picker: แสดงสุทธิหนึ่งตัวเลขต่อวัน (+ เขียว / − แดงสุภาพ / 0 กลาง), ย่อ K/M/B, โอน/adjustment เท่านั้นใช้ SVG, ไม่มีรายการเว้นว่าง ยอดเต็มอยู่ในรายละเอียด/สรุปเดือนและ aria-label; เดสก์ท็อปคงเดิม ไม่เปลี่ยนสูตรหรือข้อมูล และห้ามเรียกสุทธิว่าเงินเหลือใช้
- `dist/history.js` เป็น helper บริสุทธิ์: วันกรุงเทพฯสำหรับ timestamp, วันล้วน/naive รักษาวันเดิม, รวมเงินเป็นหน่วยสตางค์, income/expense เท่านั้น
- `dist/app.js` เก็บสถานะมุมมอง/เดือน/วันเฉพาะในหน่วยความจำ ไม่แตะ ledger schema และ localStorage key `jot-money-v1`
- หน้าต่างแก้ไขมีวันที่; `moveDate` คืน timestamp เดิมเมื่อวันไม่เปลี่ยน
- ไม่แก้กฎบัญชีซ่อน ถังขยะ หนี้ และงบ; ไม่แก้ promo-video
- ผู้ใช้ยืนยัน “อัพเดททั้งคู่ครับ” วันที่ 7 ตุลาคม 2026 อนุมัติอัปเดตในเครื่องและเว็บเดโมผ่าน GitHub/Cloudflare Pages; ไม่เปลี่ยน main
- ช่อง entryDate/transferDate แก้วันได้: ใช้ History.moveDate กับเวลา ณ บันทึก, เริ่มวันนี้เวลาไทย และ reset วันที่เมื่อเปิดแผงจด/หลังบันทึก ทดสอบ deterministic clock ใกล้เที่ยงคืนไทยแล้ว
- ตรวจ Excel ด้วย `node import-check.cjs --synthetic` และ `node import-ui-check.cjs --synthetic` เท่านั้น ไม่อ่านไฟล์การเงินจริง
- เครื่องมือควบคุม Windows ผ่าน native pipe ใช้งานไม่ได้ในรอบนี้; ตรวจ browser แบบ headless แยก profile ไม่ถือเป็นการตรวจบน iPhone จริง
- ผ่าน `check.cjs`, `history-check.cjs`, `history-ui-check.cjs`, synthetic import ทั้งสองชุด, syntax และ DOM smoke เดิม
- โมดูล/UI และผู้ตรวจแยกตั้งค่า GPT-6.1 Sol / Medium; fixture/Chrome ตั้งค่า GPT-6 Luna / Low ไม่มีการยกระดับ Astra
- Browser QA และ screenshot เป็นข้อมูลสังเคราะห์ใน `../.qa/` เท่านั้น ไม่แก้ข้อมูลใน profile ผู้ใช้
- Chrome ผ่าน 320/375/430/1280 พิกเซล รวม document/day-cell overflow, ยอดยาว, last-row clearance, Enter เปลี่ยนเดือน และ focus; ภาพปฏิทิน/รายการ 8 ภาพ ตรวจรูปลักษณ์หลักที่ 320/375/1280 แล้ว

## เป้าหมาย

รับช่วงเดโมบัญชี “จดไว” และพัฒนาต่อบนคอมของผู้ใช้ เริ่มจากอ่าน README.md และโค้ด เปิดเดโมให้ลอง พร้อมรายงานจุดที่ตรวจพบ อย่าเปลี่ยนฟีเจอร์หรือออกแบบใหม่โดยยังไม่มีคำขอเพิ่มเติม และอย่าเผยแพร่หรือเปลี่ยนเว็บไซต์เดิมจากชุดไฟล์นี้

## ปัญหาและพฤติกรรมผู้ใช้

ผู้ใช้ใช้ Money Manager แต่จดเงินสดไม่ทัน เพราะต้องกรอกหลายขั้นตอนและไม่แน่ใจว่าจะเลือกหมวดไหน เมื่อจดย้อนหลังจึงลืมรายละเอียด การดูยอดที่ไม่ครบทำให้คิดว่าเหลือเงินพอใช้และต้องดึงเงินเก็บมาเติมน้ำมัน ผู้ใช้กันค่าน้ำมันประมาณ 300 บาท/สัปดาห์

ผู้ใช้ชอบแตะเลือกบัญชีและหมวดที่ตั้งไว้ ไม่อยากพิมพ์ชื่อบัญชีทุกครั้ง ยอมพิมพ์สั้น ๆ เช่น “ข้าว 50” ตอนออกจากร้านหรือถึงรถ ต้องการยอดแยกบัญชี ประวัติ และเงินให้ยืม ยอมเปลี่ยนแอปถ้าสะดวกกว่า แต่ไม่ต้องการกรอกซ้ำในสองแอป

## ข้อกำหนดล่าสุดที่ยอมรับให้ทดลอง

1. เงินที่ใช้ได้หลังกันงบแสดงเป็นสิ่งแรกบนหน้าแรก
2. ช่องจดแบบย่ออยู่ถัดมา เข้าถึงง่ายบนมือถือ
3. เลือกรายจ่าย/รายรับ/โอน; โอนเปิดหน้าต่างเลือกบัญชีต้นทาง ปลายทาง จำนวนเงิน และหมายเหตุ
4. แตะเลือกบัญชี; หมวดใช้คำในรายการเสนอให้ และเก็บเป็น “รอจัดหมวด” ได้
5. เมื่อเลื่อนพ้นช่องจดหรืออยู่หน้าอื่น ปุ่ม “+ จดรายการ” เปิดแผงจดจากล่าง โดยใช้ฟอร์มเดิม ไม่ทำสำเนาข้อมูลหรือฟอร์ม
6. เพิ่มและแก้ชื่อบัญชีได้ บัญชีว่างยอดศูนย์ลบได้ บัญชีมีประวัติหรือยอดเงินให้ซ่อนและคืนกลับได้ ยอดบัญชีที่ซ่อนยังรวมในภาพรวม ต้องเหลือบัญชีใช้งานอย่างน้อยหนึ่งบัญชี
7. แก้ไข/ลบรายการ ค้นประวัติ ส่งออก CSV และปรับงบค่าน้ำมันได้

## สถานะทางเทคนิค

- demo.17 ใช้ UI กรมท่า–น้ำเงิน และ Lucide SVG inline symbols จาก 0.468.0 (ใบอนุญาตใน dist/vendor) ห้ามเพิ่ม emoji ในส่วน UI; ข้อมูลที่ผู้ใช้พิมพ์ยังเก็บตามเดิม
- ทดสอบ logic, Excel และ DOM smoke ผ่าน; browser visual QA ของ demo.17 ยังไม่ผ่านการตรวจภาพ เนื่องจาก browser connector โหลด request-header policy ไม่สำเร็จ ต้องตรวจ desktop/mobile ในรอบที่เชื่อมต่อได้

- HTML/CSS/JavaScript แบบไม่มี framework หรือขั้นตอน build
- ข้อมูลเก็บ localStorage key `jot-money-v1`; อย่าเปลี่ยน key จนข้อมูลหายโดยไม่มี migration
- รุ่น demo.16 เริ่ม accounts/entries ว่างและ budget 0; โหลด state ที่ไม่มีบัญชีได้ ไม่ล้างข้อมูลที่ผู้ใช้จดไว้เดิม
- state.accountGroups เก็บกลุ่มบัญชีแยกจาก kind; เพิ่ม/แก้ชื่อ/ลบกลุ่มได้ account.group อ้างด้วย ID คงที่ ลบแล้วบัญชีจะไป ungrouped (กลุ่มระบบ) ไม่ย้อนยอด ไม่ลบประวัติ กลุ่มลูกหนี้ก็แก้ชื่อ/ลบได้ กลุ่มแบบผสมแสดงเงินและหนี้แยกกัน
- borrower deleted=true เป็นถังขยะ แยกจาก archived; ไม่แสดงหน้าแรก/รายการบัญชี/ตัวเลือกจดใหม่ และไม่รวม Money.debt/owed แต่เก็บตัวบัญชีและประวัติการโอน จึงไม่ย้อนเงินสด Restore จะนำบัญชีและยอดหนี้กลับ
- `Money.parse` ต้องมีชื่อรายการและยอดบวกหนึ่งจำนวน ไม่รองรับข้อความที่มีตัวเลขหลายจำนวน
- หมวดเสนอด้วยกฎคำ ไม่ได้เรียก AI ภายนอก
- Money.categories(state,type) กรองรายรับ/รายจ่ายตาม categoryTypes และประวัติ; เพิ่มหมวดผูกประเภทปัจจุบัน เปลี่ยนชื่อรักษาประเภทและ aliases หมวดรอจัดหมวด/อื่น ๆ ใช้ร่วมกัน
- เพิ่ม/แก้ชื่อหมวดผ่าน “จัดการหมวด” ข้างช่องเลือกหมวด; state.categories เก็บชื่อและ categoryAliases รักษากฎเสนอหมวดหลังเปลี่ยนชื่อ อัปเดตหมวดในรายการเก่าตามด้วย หมวดรอจัดหมวดเป็นระบบและโอนสงวนไว้
- ค่าน้ำมันเป็นงบคงเหลือที่แก้ด้วยมือ ไม่ตัดงบหรือรีเซ็ตรายสัปดาห์อัตโนมัติ
- บัญชีมีชนิด wallet / borrower; borrower เป็นยอดสุทธิ: บวกเขาติดเรา ลบเราติดเขา จึงอนุญาตยอดติดลบ การโอนสองทิศทางใช้ให้ยืม/รับคืน/เรายืมเขา/เราคืนเขาได้ ยอด borrower ไม่รวมในเงินสดที่ใช้ได้ Money.debt รวมเฉพาะยอดบวก และ Money.owed รวมขนาดยอดลบ
- โอน wallet → wallet ไม่เปลี่ยนเงินรวม; ประวัติแสดงทั้งต้นทางและปลายทาง และ CSV ส่งออกทั้งสองบัญชี
- schemaVersion 2 ย้าย lend/repay เดิมเป็น transfer ผ่านบัญชี “ผู้ยืมเดิม (ยังไม่ระบุคน)” โดยคง ID ประวัติและยอดเดิม ไม่เดาว่าเป็นใคร
- นำเข้า Money Manager .xlsx ผ่าน dist/excel-import.js และ import-ui.js; จับคู่โอนสองแถว เก็บหมวดย่อย/extraNote/sourceRows/importKey เลือก mapping และ append/replace ก่อนยืนยัน โดย replace คง budget และเริ่มบัญชีที่ 0 ส่วน append คง opening ของบัญชีเดิม
- รายรับ/รายจ่ายเก่าบน borrower นำเข้าเป็น type adjustment + direction increase/decrease เพื่อคงยอดสุทธิโดยไม่ปนสถิติรายจ่ายเงินสด
- สำรอง state ก่อนนำเข้าล่าสุดใน localStorage jot-money-v1-before-import; ปุ่มคืนข้อมูลก่อนนำเข้าจะคืนทั้ง state รวมงบ ต้องเตือนผู้ใช้เรื่องรายการที่เพิ่มหลังนำเข้า
- ยังไม่มีการจับคู่คืนเงินกับรายการยืมรายครั้ง สำรอง/กู้คืน JSON แบบไฟล์, service worker หรือ backend
- แผงจดใช้ HTML dialog และย้าย DOM ของ quickCard เข้า quickSlot; คืนตำแหน่งที่ quickAnchor เมื่อปิด
- ไม่ใส่ credential หรือข้อมูลการเผยแพร่ในชุดนี้ เว็บเดิมยังอยู่แยกต่างหาก

## ตรวจแล้ว / ยังไม่ตรวจ

ผ่านการตรวจ syntax และ logic: อ่านยอดเงิน เสนอหมวด ยอดบัญชี เงินให้ยืม ลบรายการ ลบ/ซ่อนบัญชี เก็บประวัติและยอด กันลบบัญชีสุดท้าย และนำกลับมาใช้
ตรวจ HTML แล้วว่า ID ไม่ซ้ำ ไม่มี form ซ้อน และยอดเงินอยู่ก่อนฟอร์ม
ยังไม่ได้ทดสอบ browser interaction หรือหน้าจอบน iPhone จริง ต้องตรวจการเปิด/ปิดแผงจด การพิมพ์ด้วยคีย์บอร์ด การแตะปุ่มลอย และพื้นที่ safe area โดยใช้เครื่องมือที่มีในคอม

## ลำดับเริ่มงาน

1. อ่านไฟล์และยืนยันว่าเปิดจากโฟลเดอร์ที่แตก ZIP แล้ว
2. รันทดสอบที่มีอยู่และเปิด local server
3. ให้ผู้ใช้ลองเวอร์ชันนี้ก่อน ปรับจากข้อเสนอแนะของเขา
4. รักษาข้อมูลและหน้าที่หลัก อย่าเพิ่ม AI, subscription หรือเชื่อมธนาคารเอง
