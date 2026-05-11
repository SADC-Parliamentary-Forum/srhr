---
name: Stockfel Design System
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#414844'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#727974'
  outline-variant: '#c1c8c2'
  surface-tint: '#446555'
  primary: '#00170d'
  on-primary: '#ffffff'
  primary-container: '#0b2d20'
  on-primary-container: '#749684'
  inverse-primary: '#abcfbb'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#131310'
  on-tertiary: '#ffffff'
  tertiary-container: '#282824'
  on-tertiary-container: '#908f89'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c6ebd7'
  primary-fixed-dim: '#abcfbb'
  on-primary-fixed: '#002115'
  on-primary-fixed-variant: '#2d4d3e'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e5e2db'
  tertiary-fixed-dim: '#c9c6c0'
  on-tertiary-fixed: '#1c1c18'
  on-tertiary-fixed-variant: '#474742'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.2'
  h1:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  h3:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  ussd-mono:
    fontFamily: Courier
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style

The visual identity of this design system is built upon the pillars of collective growth and unwavering stability. It is designed to bridge the gap between traditional community savings groups and modern digital banking. The aesthetic direction is **Modern Corporate** with a warm, human-centric touch, ensuring that users feel their capital is secure while participating in a shared financial journey.

The brand personality is professional, reliable, and optimistic. The interface avoids cold, clinical tech aesthetics in favor of a palette and depth model that feels grounded in reality. By combining the structured discipline of finance with soft, approachable UI patterns, the system communicates "high-trust" at every touchpoint, whether accessed via a high-end smartphone or a simplified USSD-inspired menu.

## Colors

The palette is anchored by **Forest Green**, a deep, saturated tone that evokes the feeling of longevity and rootedness. This is paired with **Warm Gold** accents used sparingly for primary actions and highlights, symbolizing prosperity and value.

The background uses a soft, off-white "Paper" tone rather than pure white to reduce eye strain and feel more organic. Status indicators are calibrated for maximum legibility against both light and dark backgrounds:
- **Success (Paid):** A vibrant but natural green.
- **Warning (Due):** A warm, golden yellow that prompts action without causing panic.
- **Error (Overdue):** A clear, authoritative red to signal immediate attention required.

## Typography

This design system utilizes **Manrope** for its balance of geometric modernism and functional legibility. It feels clean and tech-forward but maintains a friendly character through its open counters and soft terminals.

Hierarchy is strictly enforced to ensure financial data is digestible. Headlines are bold and grounded, while body text uses generous line heights to improve readability on smaller devices. For USSD-inspired fallback views, a monospaced variant is suggested to maintain the "functional" feel of feature-phone interfaces while staying within the design system's structural constraints.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model based on an 8px square rhythm. This ensures that every element, from a smartphone card to a USSD text block, feels intentional and aligned.

Content should be housed in a 4-column grid for mobile devices, with a focus on vertical stackability. Margins are kept at a comfortable 20px to prevent the UI from feeling cramped. For feature-phone simulations, the spacing rhythm remains identical, substituting visual gutters with line-breaks and character-spacing to maintain a cohesive mental model for the user across platforms.

## Elevation & Depth

This design system uses **Tonal Layering** and **Ambient Shadows** to create a sense of physical security. Surfaces are not merely flat; they are "stacked" to show hierarchy.

- **Level 0 (Background):** The base layer, using the soft neutral tertiary color.
- **Level 1 (Cards/Inputs):** Raised with a very subtle, large-radius shadow (Color: Primary, Opacity: 4%) to indicate interactability.
- **Level 2 (Modals/Floating Actions):** Higher elevation with a more defined shadow to draw focus.

Borders are used sparingly and are always low-contrast (10% opacity of the primary green) to define boundaries without cluttering the visual field.

## Shapes

The shape language is defined by **Rounded** corners, which soften the "hard" nature of financial transactions and make the community-focused features feel more welcoming. 

Standard components (buttons, text fields) utilize a 0.5rem (8px) radius. Larger containers, such as dashboard cards and bottom sheets, use 1rem (16px) or 1.5rem (24px) radii to create a "contained" and safe feeling. This consistent rounding communicates that the app is modern and user-friendly.

## Components

### Buttons
- **Primary:** Solid Forest Green with Gold text or white text. High-contrast and clearly the most important action.
- **Secondary:** Transparent background with a Forest Green border.
- **Ghost:** Minimalist, used for secondary USSD-style navigation.

### Chips & Status Indicators
Status indicators are pill-shaped (fully rounded) with a light background tint of the status color and dark text of the same hue (e.g., light red background with dark red text for 'Overdue'). This ensures accessibility and immediate recognition.

### Input Fields
Inputs use a subtle light-grey background and a 1px border that thickens and turns Forest Green on focus. Labels are always visible to ensure the user never loses context during financial data entry.

### Cards
The core of the community experience. Cards group related financial data (e.g., "Current Savings" or "Group Contribution"). They feature subtle shadows and generous internal padding (24px) to ensure numbers are easy to read at a glance.

### List Items
For transaction histories and member lists, items are separated by thin dividers. Icons used here should be simple and geometric to translate well to lower-resolution screens.