---
version: 'alpha'
name: 'Link Sharing Design System'
description: 'Token-driven design system for the Link Sharing application, built with CSS custom properties and BEM-style utility classes.'

colors:
  white: '#FFFFFF'
  black: '#000000'
  grey:
    950: '#1A1A1A'
    900: '#333333'
    500: '#737373'
    200: '#D9D9D9'
    100: '#EEEEEE'
    50: '#FAFAFA'
  blue:
    800: '#0330D1'
    500: '#2D68FF'
  purple:
    950: '#302267'
    600: '#633CFF'
    300: '#BEADFF'
  red:
    550: '#EE3939'
    500: '#FF3939'
  pink:
    900: '#8A1A50'
    400: '#F4A28C'
  orange:
    600: '#EC7100'
    500: '#EB4925'

typography:
  fontFamily: 'Instrument Sans, sans-serif'
  fontSource: 'Google Fonts WOFF2'
  lineHeight: 1.5
  letterSpacing: 0
  preset-1:
    fontSize: 32px
    fontWeight: 700
  preset-2:
    fontSize: 24px
    fontWeight: 700
  preset-3-bold:
    fontSize: 16px
    fontWeight: 700
  preset-3-semibold:
    fontSize: 16px
    fontWeight: 600
  preset-3-regular:
    fontSize: 16px
    fontWeight: 400
  preset-4:
    fontSize: 12px
    fontWeight: 400

spacing:
  0: 0px
  100: 8px
  200: 16px
  300: 24px
  400: 32px
  500: 40px
  600: 48px
  700: 56px
  800: 64px

utilities:
  color: '.color__{family}--{shade}'
  typography: '.typography__preset-{number}'
  margin: '.margin__{direction}--{spacing}'
  padding: '.padding__{direction}--{spacing}'
  gap: '.gap__{direction}--{spacing}'
  flexDirection: '.flex__direction--{value}'
  flexWrap: '.flex__wrap--{value}'
  justify: '.justify--{value}'
  alignItems: '.align-items--{value}'
  alignContent: '.align-content--{value}'
  alignSelf: '.align-self--{value}'
---

## Overview

The Link Sharing Design System is a compact token layer for building consistent interfaces across the application. Its visual language is based on a neutral grey foundation, high-contrast foregrounds, vivid accent palettes, a single sans-serif type family, and an 8px spacing rhythm.

All public design values are exposed as CSS custom properties. Reusable presentation rules are available through BEM-style utility classes. Components should consume these tokens instead of introducing one-off color, typography, or spacing values.

- **Token source:** SCSS partials under `apps/link-sharing/src/assets/_token`
- **Utility source:** `apps/link-sharing/src/assets/scss/_utilities.scss`
- **Global entry point:** `apps/link-sharing/src/styles.scss`
- **Font:** Instrument Sans, weights 400–700
- **Base spacing unit:** 8px
- **Current themes:** Single theme

## Colors

### Neutral colors

| Token    | CSS custom property | Value     | Intended role                               |
| -------- | ------------------- | --------- | ------------------------------------------- |
| White    | `--color-white`     | `#FFFFFF` | Light surfaces and text on dark backgrounds |
| Black    | `--color-black`     | `#000000` | Maximum-contrast foreground or dark surface |
| Grey 950 | `--color-grey-950`  | `#1A1A1A` | Primary dark foreground                     |
| Grey 900 | `--color-grey-900`  | `#333333` | Strong secondary foreground                 |
| Grey 500 | `--color-grey-500`  | `#737373` | Muted text and controls                     |
| Grey 200 | `--color-grey-200`  | `#D9D9D9` | Borders and disabled surfaces               |
| Grey 100 | `--color-grey-100`  | `#EEEEEE` | Subtle surface separation                   |
| Grey 50  | `--color-grey-50`   | `#FAFAFA` | Soft page and component surfaces            |

### Accent colors

| Family | Token                | Value     |
| ------ | -------------------- | --------- |
| Blue   | `--color-blue-800`   | `#0330D1` |
| Blue   | `--color-blue-500`   | `#2D68FF` |
| Purple | `--color-purple-950` | `#302267` |
| Purple | `--color-purple-600` | `#633CFF` |
| Purple | `--color-purple-300` | `#BEADFF` |
| Red    | `--color-red-550`    | `#EE3939` |
| Red    | `--color-red-500`    | `#FF3939` |
| Pink   | `--color-pink-900`   | `#8A1A50` |
| Pink   | `--color-pink-400`   | `#F4A28C` |
| Orange | `--color-orange-600` | `#EC7100` |
| Orange | `--color-orange-500` | `#EB4925` |

Text-color utilities use the following patterns:

- Base colors: `.color__white`, `.color__black`
- Palette colors: `.color__grey--950`, `.color__blue--500`, `.color__purple--300`

```html
<p class="color__grey--950">Primary text</p>
<p class="color__blue--500">Accent text</p>
```

Color utilities set `color` only. Background, border, and semantic-state utilities are not currently part of the public API.

## Typography

Instrument Sans is loaded from Google Fonts as WOFF2 with Latin and Latin Extended coverage. All presets use a `1.5` line-height and `0` letter-spacing.

| Preset            | Utility class                     | Size | Weight | Typical use                 |
| ----------------- | --------------------------------- | ---- | ------ | --------------------------- |
| Preset 1          | `.typography__preset-1`           | 32px | 700    | Primary headings            |
| Preset 2          | `.typography__preset-2`           | 24px | 700    | Section headings            |
| Preset 3 Bold     | `.typography__preset-3--bold`     | 16px | 700    | Strong body text and labels |
| Preset 3 SemiBold | `.typography__preset-3--semibold` | 16px | 600    | Emphasized UI text          |
| Preset 3 Regular  | `.typography__preset-3--regular`  | 16px | 400    | Default body text           |
| Preset 4          | `.typography__preset-4`           | 12px | 400    | Captions and metadata       |

Primitive typography properties are exposed independently:

- Font size: `--font-size-32`, `--font-size-24`, `--font-size-16`, `--font-size-12`
- Font weight: `--font-weight-regular`, `--font-weight-semibold`, `--font-weight-bold`
- Line height: `--line-height-150`

```html
<h1 class="typography__preset-1 color__grey--950">Shared links</h1>
<p class="typography__preset-3--regular color__grey--500">
  Keep useful links organized and easy to share.
</p>
```

## Spacing

The spacing scale follows an 8px rhythm from 0px through 64px.

| Token       | CSS custom property | Value |
| ----------- | ------------------- | ----- |
| Spacing 0   | `--spacing-0`       | 0px   |
| Spacing 100 | `--spacing-100`     | 8px   |
| Spacing 200 | `--spacing-200`     | 16px  |
| Spacing 300 | `--spacing-300`     | 24px  |
| Spacing 400 | `--spacing-400`     | 32px  |
| Spacing 500 | `--spacing-500`     | 40px  |
| Spacing 600 | `--spacing-600`     | 48px  |
| Spacing 700 | `--spacing-700`     | 56px  |
| Spacing 800 | `--spacing-800`     | 64px  |

Spacing 1600 appears in the Figma catalogue layout but is not part of the public application token scale.

## Layout Utilities

Use the relevant flex, gap, margin, and padding utility classes defined in
`apps/link-sharing/src/assets/scss/_utilities.scss`.

## Usage Principles

- Use public CSS custom properties when authoring component-specific SCSS.
- Use utilities for predictable, single-purpose layout and text styling.
- Prefer the closest spacing token instead of introducing arbitrary pixel values.
- Compose typography and color utilities rather than duplicating preset declarations.
- Use `justify-*` and `align-*` only on flex containers or flex items where the property applies.

## Do's and Don'ts

- Do use the 8px spacing rhythm for component layout.
- Do use the six named typography presets for hierarchy.
- Do use grey tokens for neutral hierarchy and accent families for intentional emphasis.
- Do verify text/background combinations meet the required accessibility contrast.
- Do compose flex, gap, spacing, typography, and color utilities as needed.
- Do not introduce arbitrary colors, font sizes, weights, or spacing values without extending the token system first.
- Do not assume background, border, radius, shadow, motion, or component tokens exist; they have not been defined yet.
