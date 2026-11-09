---
name: จดไว — Liquid Glass Night
description: A Thai cash ledger as dark iOS-style glass panes with specular edges floating over a near-black field of soft violet, teal and blue light.
colors:
  night-ground: "#04060c"
  ink: "#ffffff"
  secondary-ink: "#ebebf599"
  system-blue: "#0a84ff"
  blue-press: "#3b9cff"
  sky-light: "#64d2ff"
  income-green: "#30d158"
  expense-coral: "#ff6b60"
  orange: "#ff9f0a"
  purple: "#bf5af2"
  pink-red: "#ff375f"
  yellow: "#ffd60a"
  wallet-grey: "#8e8e93"
  glass: "#ffffff14"
  glass-strong: "#ffffff1f"
  glass-highlight: "#ffffff40"
  glass-edge: "#ffffff24"
  inset-well: "#00000040"
  glass-sheet: "#1c1c24b8"
  dock-glass: "#1e1e2a8c"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Display\", \"Jotwai Thai\", system-ui, sans-serif"
    fontSize: "58px"
    fontWeight: 700
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Display\", \"Jotwai Thai\", system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    letterSpacing: "-0.03em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Display\", \"Jotwai Thai\", system-ui, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.02em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Jotwai Thai\", system-ui, sans-serif"
    fontWeight: 500
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Jotwai Thai\", system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
rounded:
  chip: "999px"
  field: "14px"
  button: "18px"
  row: "22px"
  pane: "28px"
  sheet: "34px"
  dock: "36px"
spacing:
  segment-pad: "3px"
  chip-gap: "8px"
  pane-pad: "clamp(24px, 3.2vw, 36px)"
components:
  button-primary:
    backgroundColor: "{colors.system-blue}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
  button-glass:
    backgroundColor: "{colors.glass-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
  button-text:
    textColor: "{colors.sky-light}"
  field:
    backgroundColor: "{colors.inset-well}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
  pane:
    backgroundColor: "{colors.glass-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pane}"
  entry-row:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.row}"
  dock:
    backgroundColor: "{colors.dock-glass}"
    rounded: "{rounded.dock}"
  sheet:
    backgroundColor: "{colors.glass-sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
---

# Design System: จดไว — Liquid Glass Night

## Overview

**Creative North Star: "Liquid Glass Night"**

The ledger is a set of translucent panes floating over a near-black ground (#04060c) lit by four soft colour fields: violet at top right, teal at bottom left, magenta at top left, deep blue at bottom right. The fields are fixed to the viewport, so content slides over them and the glass blur picks them up. Every surface is white at low alpha with a bright specular line along its top edge and a hairline rim, so a pane reads as a thick lens rather than a card.

The voice is direct iOS: system colours, SF type that falls back to Jotwai Thai for Thai script, very large radii, pill controls, a floating tab dock on mobile and a glass rail on desktop. The balance is the one big luminous object on Home. Colour is saturated and used for meaning (blue for action, green for income, coral for expense, one colour per wallet); everything else is white at varying alpha. This is a web material treatment, not verified native iPhone behaviour. The UI6 Afterglow files remain only as a legacy base layer under `ui7.css`.

**Key Characteristics:**
- Black ground with fixed soft colour fields; glass is white-alpha gradient plus specular top line.
- Single cool accent: iOS system blue, with sky-light #64d2ff for icons, links and focus.
- Wallet identity carried by a glowing system-colour dot, not by card tints.
- Large radii (28 to 36px panes, pills for chips) and inset dark wells for inputs.
- Reduced-transparency and reduced-motion fallbacks are present.

## Colors

A black ground, white-alpha glass, and the iOS system colour set used only where it carries meaning.

### Primary
- **System Blue** (`system-blue`): primary action fill (Save, floating capture) as a top-lit gradient from #5cb4ff through the blue to #2f5bff; default bar-fill, tint for today in the calendar.
- **Sky Light** (`sky-light`): icons, text buttons, caret, chart line, focus ring (at 80% alpha, 3px), selection and active dock icon.
- **Blue Press** (`blue-press`): hover/pressed accent.

### Secondary
- **Income Green** (`income-green`): income amounts, positive change, income totals; also second wallet/bar colour.
- **Expense Coral** (`expense-coral`): negative change, errors, calendar and history expense figures. Entry-row expense amounts render white by default.
- **Orange / Purple / Pink-red / Yellow** (`orange`, `purple`, `pink-red`, `yellow`): wallet livery, spending bars (cycle blue, green, orange, purple) and donut categories (blue, green, orange, purple, pink-red, sky, yellow, tan #ac8e68).

### Neutral
- **Night Ground** (`night-ground`): page ground beneath the colour fields.
- **Ink** (`ink`): primary text, pure white.
- **Secondary Ink** (`secondary-ink`): captions, meta, helper text, weekday labels (white-blue at 60%).
- **Glass / Glass Strong / Glass Highlight / Glass Edge**: pane fill, hover or active fill, top specular line, hairline rim.
- **Inset Well** (`inset-well`): black at 25% inside inputs, segmented controls and the quick-add field.
- **Glass Sheet / Dock Glass**: darker tinted glass for dialogs and the dock so text stays legible over strong colour.
- **Wallet Grey** (`wallet-grey`): fallback wallet dot before a wallet colour is assigned.

### Named Rules
**The Meaning-Only Colour Rule.** Saturated colour marks action, money direction, or wallet identity. Surfaces stay white-alpha.
**The Wallet Dot Rule.** Each wallet owns one system colour, assigned in order (blue, green, orange, purple, pink-red, sky) and shown as a glowing dot, icon tile or fleet-bar segment.

## Typography

**Display / Headline / Body:** `-apple-system, BlinkMacSystemFont, "SF Pro Text/Display", "Jotwai Thai", system-ui, sans-serif`. Form controls inherit it.

**Character:** Native SF on Apple devices, Jotwai Thai (Noto Sans Thai) carrying Thai glyphs everywhere else. Bold with tight negative tracking for headings; medium and semibold for UI.

### Hierarchy
- **Display** (700, 58px desktop / 46px mobile, -0.04em): the current balance, white with a faint blue glow.
- **Headline** (700, 34px / 30px mobile, -0.03em): page titles.
- **Title** (700, -0.02em): h2 and h3 in panes and sheets.
- **Body** (500 to 600): entry titles 600, entry amounts 600.
- **Label** (500 to 600, about 13px): wallet key chips, group headings, weekday labels, buttons at 600.

### Named Rules
**The Whole Amount Rule.** The balance stays unbroken on one line and scales down with width rather than wrapping.

## Layout

Desktop: a 232px glass rail on the left, main content offset by 232px. At 860px and below the rail is replaced by a floating glass dock and main loses its offset. Home leads with the balance pane, then wallet fleet bar and key, quick capture, spending bars and recent entries. Spending and recent lists sit directly on the ground without a pane. Entries stack as separate glass rows with 6px vertical rhythm; pane padding is fluid (24 to 36px) on the balance pane.

## Elevation & Depth

Depth is optical, not drop-shadow-led: translucency plus backdrop blur, a bright inset top line, an inset rim, and a long dark soft shadow beneath. Blur strengths scale with distance: rows 20px, panes and rail 30px, dock 34px, sheets 44px with saturation boosted 160 to 200%.

### Shadow Vocabulary
- **Pane** (`inset 0 1px 0 #ffffff40, inset 0 0 0 1px #ffffff24, 0 10px 30px -12px #000000aa`): panes, rows, tooltip, toast.
- **Float** (`inset 0 1px 0 #ffffff40, inset 0 0 0 1px #ffffff24, 0 18px 50px -10px #000000cc`): balance pane, dock, dialogs.
- **Accent glow** (`0 12px 30px -6px #0a84ffcc` with inset top line `#ffffffa0`): primary buttons.
- **Well** (`inset 0 1px 3px #00000066, 0 1px 0 #ffffff1f`): inputs and segmented tracks.

### Named Rules
**The Specular Edge Rule.** Every glass surface carries the 1px white top highlight and the hairline rim; without them it is just a grey box.
**The Reduced Transparency Rule.** Under `prefers-reduced-transparency` the balance pane, panes, dialogs, dock and rail become opaque #1c1c26 with no blur.

## Shapes

Soft and round. Pills (999px) for chips, ranges, bars and capture; 14 to 18px for fields and buttons; 20 to 22px for rows; 28px panes; 30 to 34px for the balance pane and sheets; 36px dock. Brand mark is a 13px rounded square gradient tile. Borders are replaced by the inset rim, never a solid stroke.

## Components

### Buttons
- **Primary** (Save, add): blue gradient, white 600 text, 18px radius, accent glow, lighter gradient on hover.
- **Floating capture:** pill, same gradient, brightness 1.1 on hover.
- **Glass / outline:** glass-strong fill, 14px radius, specular edge; text buttons use sky-light 600.
- **Focus:** 3px sky-light outline, 2px offset, on every interactive element.

### Fields
- Inset well (black 25%), no border, 14px radius, white text, sky-light caret, placeholder white-blue at 36%. Focus adds a 3px sky-light ring at 40%.

### Segmented controls and range pickers
- Dark well track with 3px padding; selected segment is a raised glass chip (white 22%) with specular top line and bold white text. Transaction type selected text tints coral, green or sky.

### Entry rows
- Separate glass rows, 22px radius, 20px blur, lighter on hover. Wallet dot with glow precedes the meta line; income green, expense white, transfers secondary ink.

### Navigation
- **Desktop rail:** glass, icons sky-light, active item is a white 14% chip with specular edge and white icon.
- **Mobile dock:** 36px glass pill, labels at white-blue 65%, active label white with sky-light icon on a sliding glass selector.

### Charts
- Luminous line: sky-light stroke 2.6px with soft glow, white dot with sky halo, faint white grid. Tooltip is dark glass with 24px blur.

### Wallet fleet bar
- 10px pill bar of glowing segments sized by balance, with a key of glass chips each with a coloured dot.

## Do's and Don'ts

### Do:
- **Do** build surfaces from white-alpha gradients, a top specular line, a hairline rim, and backdrop blur.
- **Do** reserve system blue for actions and sky-light for icons, links and focus.
- **Do** show income in green, expense in coral, and pair colour with sign or word.
- **Do** keep wallet colours consistent across dot, icon tile, bar segment and key chip.
- **Do** keep Thai text in the SF-then-Jotwai stack and the balance unbroken.

### Don't:
- **Don't** add opaque cards, solid borders or flat grey fills on the dark ground.
- **Don't** use hard offset shadows; depth comes from the Pane and Float vocabulary.
- **Don't** introduce colours outside the system set for categories or wallets.
- **Don't** restore the Afterglow navy palette or mint accent from the UI6 layer.
- **Don't** add emoji or glyph icons; the existing Lucide line icons stay.
- **Don't** claim this is native iOS or verified on Safari/iPhone.
