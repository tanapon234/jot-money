---
name: จดไว — Afterglow
description: A continuous Thai cash ledger on midnight navy with smoke-glass sheets and a shared recording dock.
colors:
  mint: "#a6e7da"
  mint-hover: "#c6f3ea"
  action-ink: "#152e31"
  lavender: "#c2c0ff"
  expense: "#f3b0b8"
  income-soft: "#203f43"
  expense-soft: "#423241"
  paper: "#101b2c"
  ink: "#e9f1ff"
  secondary: "#aebed4"
  surface: "#1b2a40"
  surface-soft: "#24344b"
  surface-hover: "#2d4057"
  field: "#17263b"
  line: "#e9f1ff1c"
  line-strong: "#b1c5e154"
  glass-bg: "#1d2c43"
  glass-sheet: "#203049"
  dock: "#1b2b40"
  annotation: "#d5e6ff0b"
rounded:
  badge: "7px"
  segment: "9px"
  dock-control: "10px"
  control: "12px"
  glass: "16px"
spacing:
  tight: "8px"
  row-gap: "12px"
  mobile-gap: "18px"
  mobile-panel: "20px"
  mobile-inset: "22px"
  panel: "28px"
  home-gap: "32px"
  home-column-gap: "44px"
typography:
  display:
    fontFamily: '"Jotwai Thai", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "54px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-.035em"
  headline:
    fontFamily: '"Jotwai Thai", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "-.025em"
  title:
    fontFamily: '"Jotwai Thai", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "20px"
    fontWeight: 500
    letterSpacing: "-.02em"
  body:
    fontFamily: '"Jotwai Thai", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "15px"
    lineHeight: 1.65
  label:
    fontFamily: '"Jotwai Thai", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "13px"
  metadata:
    fontFamily: '"Jotwai Thai", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "12px"
    lineHeight: 1.8
components:
  button-primary:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.action-ink}"
    rounded: "{rounded.control}"
    padding: "12px 17px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.mint-hover}"
  button-capture:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.action-ink}"
    rounded: "{rounded.control}"
  button-secondary:
    backgroundColor: "#d5e6ff08"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 14px"
  button-text:
    textColor: "{colors.mint}"
  button-delete:
    backgroundColor: "#493342"
    textColor: "{colors.expense}"
    rounded: "{rounded.control}"
  input:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  navigation:
    backgroundColor: "{colors.dock}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.glass}"
    padding: "8px"
  badge:
    backgroundColor: "{colors.annotation}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.badge}"
  card:
    backgroundColor: "{colors.glass-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.glass}"
    padding: "{spacing.panel}"
---

# Design System: จดไว — Afterglow

## Overview

**Creative North Star: "Afterglow — กระจกยามค่ำ"**

An everyday Thai ledger on a midnight navy canvas, lit by stationary lavender and teal light. Open amounts, a continuous cash graph, flat activity rows, and thin dividers provide the working surface. Smoke glass gives navigation and modal sheets a quiet material presence.

The user approved replacing the previous visual world with Afterglow. The final implementation is the cascade ending in `dist/ui6.css` and `dist/ui6-home.css`, with presentation behavior in `dist/ui6.js`. Self-hosted Noto Sans Thai, registered as Jotwai Thai, and the existing Lucide line icons preserve the product identity. This is a web material treatment.

**Key Characteristics:**

- Midnight navy ground with ice text, mint actions, lavender support, and coral expenses.
- Continuous unboxed cash overview and recent activity.
- One outer smoke-glass layer, with strong opaque fallbacks.
- Readable Thai labels, adaptive tabular amounts, and visible keyboard focus.
- Four mobile destinations and one labelled recording action in a shared dock.

## Colors

The palette separates financial direction and interaction from the quiet blue working plane. Frontmatter records the base colors; conditional transparency belongs to Elevation & Depth.

### Primary

Mint carries primary actions, income, the cash line, carets, and keyboard focus. Mint-hover brightens save actions. Action-ink keeps primary labels dark and readable. The capture button has its own observed hover fill (`#c3f4e9`).

### Secondary

Lavender supports selected neutral controls, account and transfer icon treatments. Coral expense identifies outgoing amounts, validation, and destructive actions. Income-soft and expense-soft support financial states without replacing their labels or signs.

### Neutral

Paper grounds the canvas. Ice ink carries headings, amounts, and primary content; secondary blue carries dates, explanations, and metadata. Surface tones group supporting content. Fields remain opaque. Line divides rows; line-strong outlines fields and secondary controls. Glass-bg and glass-sheet are opaque material fallbacks. Dock is the opaque mobile navigation fallback.

**The Financial Meaning Rule.** Pair mint income and coral expense with readable words or signs; keep cash balance, net income, available money, and debt distinct.

## Typography

**Display Font:** self-hosted Jotwai Thai (Noto Sans Thai), with Leelawadee UI, Tahoma, and sans-serif fallbacks.
**Body Font:** the same Thai family. Existing amount columns can inherit the established Arial-first numeric stack.

The balance is the strongest type on the page. Thai content keeps generous line spacing, and the body sets tabular numerals. Display starts at (54px), weight (500), line height (1.25), letter spacing (-.035em); it becomes (43px) at (900px) and below, and (38px) at (360px) and below. The existing fitting behavior can reduce it further for long values.

Page headings use (24px), or (23px) on mobile. Panel and home list headings use (20px). General sheet headings use (23px); capture and analytics headings use (25px). Body is (15px/1.65). Labels and support text use (13px); dates and row metadata use (12px), commonly with (1.8) line height. Standard fields remain (16px); quick capture uses (22px), with a (21px) placeholder and (64px) minimum height.

**The Whole Amount Rule.** Keep the current balance unbroken and adapt its size to the available width.

## Layout

Desktop uses a (224px) quiet left rail and main padding of (34px clamp(24px,4vw,64px) 120px), bounded by (1600px). Home uses (minmax(0,1.6fr) minmax(250px,1fr)), with gaps of (32px 44px). Overview and recent activity form the left flow; recurring and learned shortcuts sit beside them, separated by a thin rule and (28px) inset. Spending, calculation disclosure, and storage information follow.

Between (901px) and (1100px), the rail narrows to (190px) and home becomes one column. At (900px) and below, the rail disappears; main is bounded by (720px), with (22px) insets and bottom clearance of (190px + safe-area inset). Home order is overview, recent, shortcuts, spending, calculation disclosure, storage. Home gap is (18px); the header bottom margin is (16px), balance metadata bottom margin is (6px), and period bottom margin is (0). At (360px) and below, horizontal insets become (16px).

The mobile dock is fixed with (16px) minimum side clearance, (12px + safe-area inset) bottom clearance, (500px) maximum width, and (8px) padding/gap. Four equal navigation targets sit above the full-width capture action. Navigation targets are at least (50px) tall; capture is at least (46px). Desktop capture is at least (150px × 52px), (32px) from the right and (30px) from the bottom. The existing navigation and capture nodes move between layouts, preserving handlers and focus.

Sheets scroll within the visible viewport. Quick capture is bounded by (510px) and settles near the mobile bottom; keyboard state moves it to the visible viewport top and hides the dock. The compact account picker is a single scroll surface at (640px) width or below, or (500px) height or below. Native date editing remains available.

## Elevation & Depth

Two stationary radial light fields cross the navy ground: lavender (`#4e529f70`) at (92% 12%), fading by (62%), and teal (`#236c7a60`) at (4% 78%), fading by (66%). The overview, graph, recent rows, and shortcut rows remain unboxed.

General panels and sheets have no border and use one outer material layer. Without blur support, panels use glass-bg and sheets use glass-sheet. With support, panels use (`#c9dfff08`), sheets (`#1b2c4399`), and blur (26px) with saturation (130%). The dock uses (`#1b2b40bb`) with blur (24px) and saturation (130%), falling back to dock. Reduced transparency restores opaque materials and removes blur, including the chart tooltip.

Shadow vocabulary: sheets use (`0 24px 80px #050d1c80`), dock (`0 12px 36px #0006`), desktop capture (`0 8px 28px #0004`), and chart tooltip (`0 10px 26px #0004`). Modal backdrop uses (`#071120a6`) and blur (5px); reduced transparency uses (`#071120e0`) without blur.

**The Single Material Rule.** Blur the outer surface once; nested panels, rows, and form content stay transparent or opaque without another backdrop filter.

Controls transition color, background, and border over (160ms ease-out). The mobile active surface moves over (340ms cubic-bezier(.16,1,.3,1)). JavaScript reveals views over (300ms) from (5px) below, and newly opened sheets over (340ms) from (12px) below; CSS also defines a (260ms) sheet entrance. Both use the same easing. Reduced motion removes CSS transitions/animations and skips JavaScript reveals. Graph movement never fabricates financial data.

## Shapes

Outer glass panels, sheets, and dock use gently rounded (16px) corners. Fields and most actions use (12px); dock navigation and mobile capture use (10px); segments use (9px); quiet badges use (7px). Activity and shortcut rows use square edges, transparent fills, and a bottom divider. Thin strokes define fields and supporting actions. Existing line icons remain SVG, with no decorative glyph substitution.

## Components

### Buttons

Primary save uses mint and action-ink, (12px) radius, (52px) minimum height, (15px) type, and weight (600). Supporting primary actions use (48px) minimum height and (14px) type. Hover uses mint-hover; disabled actions use opacity (.5). Secondary actions use a faint ice fill, line-strong border, and (44px) minimum height; hover brightens fill and shifts the border toward lavender. Text actions use mint and (44px) minimum height. Delete uses a muted coral surface and coral text, brightening on hover.

All interactive controls expose a mint (2px) focus outline with (3px) offset. Native form behavior and focus timing remain part of the implementation.

The keyboard skip link uses mint with action-ink and focuses the shared main landmark, regardless of active destination. The mobile home heading remains available to assistive technology while visually clipped beside the brand treatment.

### Chips

Quiet counts use annotation fill, secondary text, no border, (7px) radius, and (12px) type. General segmented controls sit on translucent navy with (4px) padding and (12px) corners; selected options use translucent lavender. Income/expense selection uses matching tinted fills and financial colors. Home graph ranges instead use open tabs with a mint (2px) selected underline and no container fill.

### Cards / Containers

General panels use the single material layer, (16px) corners, and (28px) padding, reducing to (20px) below (900px). Nested panels are transparent. Home overview and recent activity have no fill, border, radius, blur, or shadow. Flat entry rows use thin dividers, a clear amount column, (14px) title and (12px) metadata; home rows have (16px) vertical padding and (12px) gap.

History is an open working plane, aligned with the page heading rather than inset in another glass card. Its shared view switch retains one quiet segment rail; search remains a separate named action. Month totals use a flat divider strip, while daily list groups use a clear date header and continuous entry rows. Empty calendar dates have no tile fill or stroke; selected dates use a mint outline/fill and today retains a lavender date ring. Mobile calendar rows are compact, with at least44px date targets at320/375/430px. Daily summary amounts wrap as whole fields when space is limited rather than breaking a decimal.

### Inputs / Fields

Mobile history summaries and daily totals use compact spacing and inline label/amount pairs that wrap as whole fields. Calendar meaning is visible above the grid: daily net is an approximate abbreviated value, not account balance; exact values remain in day details. Empty days use a shorter sheet without decorative hero, zero-value totals or an edit hint. Search clear retains at least44×44px with14px type. Calendar editing restores the originating entry's keyboard focus; moved/deleted entries fall back to remaining entries or Add when empty.

Fields use field fill, line-strong stroke, ice text, (12px) corners, and (50px) minimum height. Focus shifts the border to mint; the keyboard outline remains visible. Placeholders use secondary blue at full opacity. The quick field uses its darker observed fill (`#142237`), larger type, and (64px) minimum height. Account choice uses a (68px) minimum trigger and selectable rows at least (70px) tall.

Capture shows a (14px) one-amount format hint. An explicit payment account belongs to the current draft and takes precedence over learned suggestions; cancellation preserves it, while saving or starting a new draft releases it. Ambiguous multi-number text stays in the field with a specific correction example.

### Navigation

Desktop navigation uses a transparent rail with a faint mint active fill and ice active label. Mobile uses one smoke-glass dock, four equal destinations, SVG icons (20px), and labels (12px). A translucent mint surface moves behind the selected item. The full-width capture action belongs to the same dock, with no additional shadow.

### Continuous Cash Timeline

The default range is week; month and year remain available. Current owned money remains separate from a selected historical point. The mint cash line uses (2.2px) stroke, subtle blue gridlines at opacity (.08), and secondary date labels (12px). Period arrows have (44px) targets. The tooltip uses a smoked navy fill, (12px) corners, (17px) amount, and (12px) date. Pointer inspection, the keyboard range control, and the daily-history action use actual dated records. The calculation disclosure is moved below the working overview and recent flow, near the bottom of home. It explains historical reconstruction and limits; there is no forecast.

A single actual date remains a dot without an invented trend, inside the same (360×186) plot footprint as week/month/year. Its explanation occupies the plot's upper whitespace; the redundant disabled slider is invisible but preserves layout. The date and month actions share one (44px) row. Month/year comparison copy follows this row so it cannot shift the plot. Period changes crossfade actual snapshots over (180ms), while selected dots/tooltips move over (120ms); reduced motion snaps, and vertical touch scrolling stays native. Selected date/amount remain available to assistive technology. On mobile, history tabs, search/current-month actions, explanatory text and compact net figures use (14px); the calendar extends to the panel edges, reaching (44px) date targets even at (320px) without horizontal scrolling. Month summary figures use (16px), or (14px) at (360px) and below, with no word break inside a decimal amount.

## Do's and Don'ts

Latest user-approved motion refinement (2026-10-13) replaces crossfade/reveal, date-pair-only morph and directional pan with PowerPoint-style shape morph for every week/month/year navigation. A single visible polyline and its area continuously reshape over (420ms), using union normalized vertex positions to preserve the exact source and target silhouettes even with unequal point counts or unrelated dates. This interpolates presentation geometry, never ledger values or dates: numeric strings immediately show actual target values. Rapid interruption resumes the displayed silhouette. A sparse endpoint collapses to a genuine dot with zero area; empty states snap without fabricated balances. Identical silhouettes stay still. Reduced motion, resizing and point selection cancel cleanly. Pointer selection uses stable plot bounds after cancellation. Layout measurements are cached outside animation frames; temporary geometry is removed at completion. No pan/snapshot/fallback fade remains.

Home task priority (2026-10-13): keep current money/chart first, then up to four frequent suggestions with their confirmation/edit/undo receipt, then three recent records and the existing history link. The shared activity wrapper preserves DOM and visual order on desktop and mobile. Missing suggestions collapse completely, so recent records move up without a placeholder. Recurring templates remain a separate section; the main recording button stays unchanged.

Home activity readability (2026-10-13): user requested account-like individual borders. Frequent suggestions and recent records use thin glass-border,14px corners and a quiet tinted fill without a surrounding card, shadow or per-row blur. Name and signed amount lead; account/category/date are separated into readable supporting lines. Suggestion hiding stays a separate44px control outside the main button; recent records open the existing editor. Narrow layouts may stack the amount to preserve long names and full values rather than clipping financial information. This refinement is scoped to home, not the shared history/calendar rows.

History extension (2026-10-13): user subsequently approved the same individual-card language for grouped history and the calendar day dialog. Compact ledger-entry cards use the same14px corners/thin border/fill,10px vertical padding and8px separation, with date/group totals outside cards. Date text is not repeated inside rows. Signed income/expense and neutral unsigned transfers keep existing semantics; category/account/optional note stay visible, and the whole native button opens the existing editor. Narrow screens safely wrap full amounts. Account-detail activity remains unchanged; no surrounding card or per-row blur added.

Account trash (demo.28): a complete16px bordered disclosure with a56px native summary, aligned trash/chevron icons and clear focus state. Open content has its own padding/divider; retained account name/balance and44px restore control stay inside each row, stacking on mobile. Empty copy shares the content inset. This is presentation-only; deletion eligibility, balance rules and retained history are unchanged.

### Do:

- **Do** preserve Thai labels, tabular amounts, and visible mint keyboard focus.
- **Do** keep the cash overview and recent activity continuous and unboxed.
- **Do** use one outer smoke-glass layer with opaque and reduced-transparency fallbacks.
- **Do** keep four mobile destinations and one labelled capture action in the shared dock.
- **Do** show actual dated history with week selected by default.

### Don't:

- **Don't** interchange cash balance, net income, available money, and debt.
- **Don't** stack backdrop blur on nested rows or restore the permanent inline capture form.
- **Don't** animate invented financial data or imply a forecast.
- **Don't** replace the existing SVG icon vocabulary with emoji or decorative glyphs.
- **Don't** describe this web material as verified native iPhone or Safari behavior.
