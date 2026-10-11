---
name: จดไว — Glass Ledger
description: A purple-black Thai ledger with shared tinted glass, a mint cash timeline, and recording on demand.
colors:
  mint: "#74e3bf"
  mint-hover: "#9aefd2"
  mint-ink: "#102b23"
  capture-mint: "#a5f0d7"
  capture-hover: "#c0ffe9"
  capture-ink: "#132a23"
  income: "#8beac7"
  income-soft: "#243c36"
  expense: "#ffc0ba"
  expense-soft: "#412e3c"
  paper: "#100c1b"
  surface: "#211b30"
  surface-soft: "#2b243a"
  surface-hover: "#352d46"
  ink: "#f5f1fc"
  secondary: "#c6bdd5"
  line: "#ffffff20"
  line-strong: "#b9a5d25c"
  glass-bg: "#251e34"
  glass-sheet: "#282135"
  glass-nav: "#261f35"
  glass-border: "#f3e8ff29"
  field: "#211c2e"
  field-border: "#8d7c9d69"
  annotation: "#ffffff09"
  text-action: "#a6f3d9"
  timeline: "#a6efd9"
rounded:
  badge: "7px"
  timeline-selector: "10px"
  tooltip: "11px"
  inner-control: "12px"
  glass: "16px"
spacing:
  tight: "8px"
  control: "12px"
  mobile-panel: "18px"
  panel: "22px"
  desktop-gap: "24px"
  mobile-gap: "26px"
typography:
  display:
    fontFamily: '"Jotwai Thai", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "48px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-1.4px"
  headline:
    fontFamily: '"Jotwai Thai", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "25px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "-.025em"
  title:
    fontFamily: '"Jotwai Thai", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "21px"
    fontWeight: 500
    letterSpacing: "-.02em"
  body:
    fontFamily: '"Jotwai Thai", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "15px"
    lineHeight: 1.65
  label:
    fontFamily: '"Jotwai Thai", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "13px"
    fontWeight: 500
components:
  button-primary:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.mint-ink}"
    rounded: "{rounded.glass}"
    padding: "12px 17px"
  button-primary-hover:
    backgroundColor: "{colors.mint-hover}"
  button-capture:
    backgroundColor: "{colors.capture-mint}"
    textColor: "{colors.capture-ink}"
    rounded: "{rounded.glass}"
    padding: "12px 22px"
  button-secondary:
    backgroundColor: "{colors.annotation}"
    textColor: "{colors.ink}"
    rounded: "{rounded.glass}"
  button-text:
    textColor: "{colors.text-action}"
  input:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    rounded: "{rounded.glass}"
  navigation:
    backgroundColor: "{colors.glass-nav}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.glass}"
  badge:
    backgroundColor: "{colors.annotation}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.badge}"
  card:
    backgroundColor: "{colors.glass-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.glass}"
---

# Design System: จดไว — Glass Ledger

## Overview

**Creative North Star: "Glass Ledger"**

An everyday Thai finance ledger on a purple-black ground, with stationary purple and green light visible through tinted glass. The integrated current balance and mint cash timeline remain the visual anchor. The user approved extending this material across every page and sheet, with recording one intentional tap away.

The web app uses HTML, CSS, and JavaScript. UI5 extends the existing implementation through `dist/ui5.css` and `dist/ui5-home.css`; those final overrides govern the visual system. Self-hosted Noto Sans Thai, registered as Jotwai Thai, and the existing Lucide line icons carry the identity. The iPhone-like material is a visual direction, not a native iOS or device-verification claim.

**Key Characteristics:**

- Purple-black ground with restrained tinted glass across pages, navigation, and sheets.
- Mint actions and income, warm coral expenses, and a pale mint cash timeline.
- Readable Thai labels, unbroken tabular balance amounts, and visible keyboard focus.
- One labelled floating recording action, with the existing editor available on demand.

## Colors

The palette separates interaction, financial direction, and chart history against purple neutrals. Frontmatter records base tokens; conditional transparency and gradients are specified under Elevation & Depth and in the sidecar.

### Primary

Mint marks saving, carets, active controls, and focus. Mint-hover brightens actions; mint-ink supplies their dark text. The persistent recording button uses the lighter capture-mint and capture-ink pair. Income and income-soft identify incoming money.

### Secondary

Expense and expense-soft distinguish outgoing money; warm coral also marks validation and destructive actions. The timeline uses pale mint for historical cash and the selected point. Text-action provides lighter mint for supporting links and active navigation text.

### Neutral

Paper anchors the stationary light field. Surface, surface-soft, and surface-hover provide purple tonal grouping. Ink carries headings and money; secondary carries explanatory copy. Line divides rows, while line-strong outlines supporting controls. Glass-bg, glass-sheet, and glass-nav are opaque fallback surfaces; glass-border supplies the faint light rim. Fields remain mostly opaque for steady reading; annotation supports quiet counts and control fills.

**The Financial Meaning Rule.** Preserve mint for incoming money and coral for outgoing money; accompany financial direction with words or signs. The cash timeline uses pale mint without changing the meaning of income or cash balance.

## Typography

All roles use self-hosted Noto Sans Thai, registered as Jotwai Thai, with Leelawadee UI and Tahoma fallbacks. Thai body copy has open line spacing; amounts use tabular numerals.

The display balance starts at (48px) desktop and (38px) at or below (900px), with mobile letter spacing of (-1px). `money-overview.js` measures the text and available width, then reduces its size when necessary, down to (16px). Refit after fonts load and widths change. The current balance remains independent of the selected historical point.

Page headings are (25px) desktop and (24px) mobile. Panel headings are (21px); dialog headings generally use (22px), and the recording heading (24px). Labels use (13px); contextual copy generally uses (12–13px) with generous line height. Timeline tooltip amounts use (17px) desktop and (15px) mobile, with (12px) dates. Ordinary form values remain (16px); quick capture uses (22px) and a (64px) minimum height.

**The Whole Amount Rule.** Keep the current balance unbroken and adapt its size to the available width.

## Layout

The desktop shell retains its fixed sidebar and bounded main region. Home places the integrated balance/timeline beside frequent and pinned shortcuts in a (1.5fr / minmax(260px, 1fr)) grid, with (24px) gaps. The editor is absent from this layout. Recent records and spending follow across the full grid width.

At (900px) and below, home becomes one column: overview, frequent and pinned shortcuts, recent records, spending, and storage information. Main padding is (22px 18px), with bottom clearance of (178px + safe-area inset). General mobile panels use (18px) padding; compact history uses (14px), reducing to (10px) at (360px). Four navigation destinations move into the fixed bottom dock.

The single labelled floating recording button sits (32px) from desktop right and bottom edges. On mobile it sits (18px) from the right, above the dock at (94px + safe-area inset). Its minimum size is (150px × 54px) desktop and (145px × 52px) mobile. Hide it while any dialog is open. Match its element ID and compact-calendar state when styling it so older capture rules cannot shrink it to an icon.

The existing recording dialog is centered on desktop and settles near the mobile bottom edge. It is bounded by the visual viewport and scrolls above the keyboard. Preserve safe-area padding, overscroll containment, and clearance for the recording action and dock at narrow widths.

## Elevation & Depth

Stationary radial purple and green light fields sit behind tinted surfaces. Panels, sidebar, dialogs, and mobile navigation use one material layer: faint light borders, modest rounding, and `blur(22px) saturate(125%)` where supported. Opaque frontmatter glass colors are the default. Within the backdrop-filter support query, glass-bg becomes (#2b233cba), glass-sheet (#292235eb), and glass-nav (#261e35c9). Reduced transparency restores the opaque defaults and disables blur.

The summary uses `linear-gradient(145deg,#332b4ad9,#242237b8 45%,#1b473cc4)` and (16px) blur. Unsupported blur and reduced transparency use the same gradient with opaque stops (#332b4a, #242237, #1b473c). The chart remains transparent inside the summary.

Resting panels have no shadow. Structural lift belongs to dialogs (`0 24px 80px #0008`), mobile dock (`0 10px 32px #0006`), recording action (`0 8px 24px #0004`), chart tooltip (`0 8px 20px #0003`), and toast (`0 8px 28px #0005`). The modal backdrop is dark without another blur layer.

**The Single Material Rule.** Blur the outer surface once; inner rows, nested panels, and chart content borrow it without another backdrop filter.

## Shapes

Glass panels, dialogs, standard fields, supporting buttons, and the recording action share (16px) corners. Inner segmented controls and selected rows use (12px); timeline selectors retain (10px) outer and (7px) inner corners. Tooltips use (11px), small counts (7px). Ledger, settings, account, category, and frequent-record rows use separators and quiet hover fills rather than independent nested glass cards. Lucide icons retain their simple strokes.

## Components

### Buttons

Save actions use mint with dark text, semibold weight, and a (52px) minimum height; supporting primary actions are at least (48px). Secondary controls use a faint white fill and line-strong border, brightening on hover. Text actions use light mint. Disabled buttons use (0.5) opacity. Focus is a (2px) mint outline offset by (3px). Most buttons and disclosure summaries provide a (44px) minimum target.

The persistent button reads “จดรายการ” with the existing plus icon. It opens the existing sheet and focuses the quick field synchronously in the click handler. It preserves drafts and hides while any modal is open; closing restores the appropriate trigger or daily-history focus. Daily-history actions may open the same sheet on a selected date. Do not restore duplicate overview capture buttons or an inline editor.

### Chips

Type and analytics selectors use a shallow dark container, muted green selection, and pale mint text. Expense selection uses muted coral. The integrated chart retains its pale mint selected range with dark green text. Keep pressed-state semantics synchronized. Counts and period annotations stay quiet and do not imply interactivity.

### Cards / Containers

Panels share glass-bg, glass-border, and the glass radius, generally with (22px) desktop padding. Balance and timeline form one gradient surface, padded (24px 24px 14px) desktop and (20px 16px 8px) mobile. Avoid another glass card around chart content. Reserve and after-budget summaries remain hidden while stored budgets remain intact. Rows and empty-state copy preserve the established financial meanings.

### Inputs / Fields

Ordinary fields use the mostly opaque field color, field-border, ink text, and mint caret. Focus strengthens the border and supplies the shared outline. The sheet's quick field uses darker translucent fill (#141525b3) and (#b8d5d72e) border. Preserve parser validation, category disclosure, and account selection.

The recording date control is secondary text on a transparent background. Hover brightens it to light mint; chosen-date status uses a muted green fill and mint text at (12px). The actual date input remains (16px), with a visible focus-within outline.

Multiple accounts continue through the existing account picker and explicit confirmation. Keep note, amount, date, and category available before saving; show selected accounts and learned suggestions clearly. Account rows scroll independently and long notes retain their bounded scrolling region. Closing preserves the draft. A single account retains direct saving.

### Navigation

Four destinations retain icons, text, and active-state semantics. Inactive labels use secondary; active items use a faint mint field and light mint text. Desktop sidebar and mobile dock share tinted purple glass with opaque and reduced-transparency fallbacks. Mobile tabs are at least (54px) high and preserve safe-area spacing.

### Cash Timeline

The real current balance and real-data chart share one summary. A pale mint (2px) SVG line has straight segments, rounded joins and caps, a selected dot, faint gridlines, and a mint area fading to transparent. Month is the default range. Period navigation changes the chart and comparison while the large current balance stays independent. Keep the actual baseline date visible and use increase/decrease language rather than profit/loss.

Support pointer selection and the existing keyboard range control. The tooltip shows selected amount and date on dark green (#152b25f5), with pale text (#f1fff8). Clamp it using measured dimensions and reposition on plot resize so both edges remain readable. Preserve the accessible selected-point summary and daily-history action. Historical cash reconstructs recorded movements from the current balance; its completeness caveat belongs in the help disclosure.

Frequent and pinned entries stay compact rows. Learned entries retain their confirmation before saving and separate hide action. They do not become a second editor.

Shared button color transitions last (160ms); inherited field and segmented-control transitions remain brief. The current balance may acknowledge changes with a (320ms) animation. Reduced motion disables transitions, animations, smooth scrolling, and floating-button movement.

## Do's and Don'ts

### Do:

- Do preserve Thai labels, tabular amounts, and visible mint keyboard focus.
- Do share tinted glass across pages and sheets with opaque and reduced-transparency fallbacks.
- Do keep the current balance unbroken and the mint timeline paired with a readable selected value, date, and daily-history action.
- Do keep one labelled floating recording action that opens the existing sheet and focuses typing synchronously.

### Don't:

- Don't add decorative rasters, emoji, or new UI dependencies.
- Don't turn income, expense, cash balance, available money, and debt into interchangeable labels.
- Don't stack backdrop blur on nested rows or restore the permanent inline capture form.
- Don't describe this web material as native iPhone support or as verified Safari behavior.
