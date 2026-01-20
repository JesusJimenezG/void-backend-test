# Arcane Stats - Design Aesthetics Document

## League of Legends Season 1: "For Demacia" (2026)

---

## Season Theme Overview

**Season 1: For Demacia** is the inaugural season of League of Legends 2026, placing the ancient kingdom of Demacia at the center of the narrative. The season features:

- **Champions**: Garen, Quinn, Shyvana (reworked), Lux (Luxanna Crownguard)
- **Cinematic**: "Salvation" featuring Demacian champions
- **Map Updates**: Summoner's Rift with Demacia-themed petricite architecture
- **Meta-game**: Demacia Rising featuring Luxanna Crownguard

---

## Color Palette

### Primary Colors (Demacian Royal)

| Name                | Hex       | Usage                           |
| ------------------- | --------- | ------------------------------- |
| **Royal Blue**      | `#1a3a6e` | Primary background, depth       |
| **Petricite White** | `#e8e4dc` | Light text, highlights          |
| **Demacian Gold**   | `#c9a227` | Accents, borders, icons         |
| **Silver Steel**    | `#a8b4c4` | Secondary text, subtle elements |

### Secondary Colors (Accent)

| Name               | Hex       | Usage                       |
| ------------------ | --------- | --------------------------- |
| **Deep Navy**      | `#0d1f3c` | Dark backgrounds, panels    |
| **Celestial Blue** | `#4a7ab8` | Links, interactive elements |
| **Warm Gold**      | `#e6c35c` | Hover states, emphasis      |
| **Armor Silver**   | `#6b7d94` | Muted text, dividers        |

### Status Colors

| Name              | Hex       | Usage       |
| ----------------- | --------- | ----------- |
| **Victory Green** | `#3db86e` | Win states  |
| **Defeat Red**    | `#c94545` | Loss states |

---

## Typography

### Font Stack

- **Headings**: `Cinzel`, `Garamond`, serif - Royal, classic feel
- **Body**: `Inter`, `Roboto`, sans-serif - Modern readability
- **Accent**: `Orbitron` for stats/numbers

### Text Hierarchy

- **H1**: 2.5rem, Gold gradient, uppercase, 0.15em letter-spacing
- **H2**: 1.5rem, Petricite White, uppercase
- **Body**: 1rem, Silver Steel
- **Muted**: 0.875rem, Armor Silver

---

## Visual Elements

### Petricite Architecture Inspiration

Demacia is built on **petricite**, an anti-magic stone with a distinctive appearance:

- Smooth, weathered white/gray stone textures
- Gold metalwork and trim
- Sharp, noble geometric patterns
- Banners and heraldic symbols

### Glass/Panel Effects

- **Background**: Semi-transparent deep navy with subtle blur
- **Borders**: Gold accent lines (1px), subtle gradient
- **Top accents**: Gold to white gradient line
- **Shadows**: Soft, warm-toned shadows

### Decorative Elements

- **Demacian Crest**: Gold winged sword motif
- **Banner patterns**: Diagonal stripes, royal blue and gold
- **Corner ornaments**: Gold leaf/scroll designs

---

## Background Design

### Hero Background

Use the Garen background image (`lol_background.jpg`) with:

- **Overlay**: Dark gradient from bottom (for text readability)
- **Vignette**: Strong edge darkening for focus
- **Color wash**: Subtle blue tint to unify with theme

### Ambient Effects

Replace particles with:

- **Petricite dust**: Subtle white/silver floating particles
- **Golden motes**: Occasional gold sparkles
- **Light rays**: Soft diagonal light beams (top-right to bottom-left)

---

## Component Styling

### Cards/Panels

```
- Background: rgba(13, 31, 60, 0.85)
- Border: 1px solid rgba(201, 162, 39, 0.3)
- Border-top: 2px solid with gold gradient
- Border-radius: 8px
- Backdrop-filter: blur(12px)
```

### Buttons

```
Primary:
- Background: linear-gradient(135deg, #c9a227, #e6c35c)
- Text: #0d1f3c (dark navy)
- Hover: glow effect, slight scale

Secondary:
- Background: transparent
- Border: 1px solid #c9a227
- Text: #c9a227
- Hover: fill with rgba(201, 162, 39, 0.1)
```

### Input Fields

```
- Background: rgba(13, 31, 60, 0.7)
- Border: 1px solid rgba(201, 162, 39, 0.2)
- Focus: border-color: #c9a227, glow effect
- Text: #e8e4dc
- Placeholder: #6b7d94
```

---

## Animation Guidelines

### Transitions

- **Fast**: 150ms ease - micro-interactions
- **Normal**: 250ms ease - state changes
- **Slow**: 400ms ease - major transitions

### Effects

- **Hover**: Subtle lift (translateY -2px) + glow
- **Focus**: Golden glow pulse
- **Loading**: Spinning golden ring

### Background Animations

- **Particles**: Slow drift upward (15-20s loop)
- **Light rays**: Very slow diagonal shift (30s loop)
- **Glow**: Subtle pulse on decorative elements (4s loop)

---

## Responsive Breakpoints

| Breakpoint | Width      | Adjustments                       |
| ---------- | ---------- | --------------------------------- |
| Desktop    | > 1024px   | Full layout, side-by-side panels  |
| Tablet     | 768-1024px | Stacked layout, preserved spacing |
| Mobile     | < 768px    | Single column, compact headers    |

---

## Accessibility

- **Contrast ratio**: Minimum 4.5:1 for all text
- **Focus states**: Visible gold outline
- **Reduced motion**: Respect prefers-reduced-motion
- **Alt text**: All images properly labeled

---

## Summary

The "For Demacia" aesthetic emphasizes:

1. **Nobility & Strength**: Bold gold accents, strong typography
2. **Petricite Architecture**: Clean whites/silvers against deep blues
3. **Royal Heritage**: Heraldic patterns, classic serif fonts
4. **Combat Ready**: Steel grays, sharp lines, military precision

This design captures the essence of Demacia - a kingdom that stands for justice, strength, and unity.
