# ส่งต่องานให้ Codex

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
