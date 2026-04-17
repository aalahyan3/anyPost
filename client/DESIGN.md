# UI System Design Specification

This document is specifically tailored for AI UI generators (e.g., Stitch). It contains the exact visual design constraints, explicit color values, layout structuring, and typography variables required to generate consistent React/Next.js UI components within this application.

## 1. Typography System

The application utilizes three custom fonts injected natively via Next.js `next/font/google`. You must bind these directly relying on Tailwind's arbitrary utilities or mapped variable classes.

- **Sans/Body (`--font-sans`)**: Inter
  - *Usage*: Default application text, used implicitly by Tailwind's `font-sans`.
- **Heading (`--font-heading`)**: Roboto
  - *Usage*: Apply specifically to `h1`, `h2`, `h3` wrappers.
- **Monospace (`--font-mono`)**: Geist Mono
  - *Usage*: Code blocks, tech data, snippets.

*Important Note:* Ensure you use the anti-aliased utility class `antialiased` globally or rely on it already being present on the `<html>` node.

## 2. Layout Structure Constraints

- **Container Wrapper**: The root `<body>` wrapper uses `max-w-7xl mx-auto`. UI generators should expect components to visually float centered on exceedingly large screens and stretch smoothly across nested views without forcing outer container margins.
- **Card Based Logic**: Components should regularly rely on border logic heavily. Sub-sections within layouts usually contain `border border-border rounded-xl bg-card text-card-foreground shadow-sm`.
- **Global Base Radius**: Fixed tightly to `0.875rem` (`14px`). Derived values include:
  - `sm`: ~8.4px
  - `md`: ~11.2px
  - `lg`: 14px
  - `xl`: ~19.6px

## 3. Exact Color Palette Specification

The project strictly follows OKLCH values defined natively in Tailwind v4 via `globals.css`. **Do not invent arbitrary hex colors. You must use the exact OKLCH variables specified below** or directly target them with Tailwind utility mapped variables (e.g., `bg-primary`, `text-muted-foreground`).

### Light Mode (`:root`)

*   **Backgrounds / Surfaces**
    *   `--background`: `oklch(1 0 0)` *(Pure White)*
    *   `--foreground`: `oklch(0.147 0.004 49.3)` *(Extremely Dark Gray)*
    *   `--card`, `--popover`: `oklch(1 0 0)` *(Pure White)*
    *   `--card-foreground`, `--popover-foreground`: `oklch(0.147 0.004 49.3)`
*   **Brand / Action Colors**
    *   `--primary`: `oklch(0.488 0.243 264.376)` *(Vibrant Indigo/Blue)*
    *   `--primary-foreground`: `oklch(0.97 0.014 254.604)` *(Crisp Off-White/Blueish)*
    *   `--secondary`: `oklch(0.967 0.001 286.375)` *(Very Light Gray/Indigo tinted)*
    *   `--secondary-foreground`: `oklch(0.21 0.006 285.885)` *(Dark Slate text)*
    *   `--destructive`: `oklch(0.577 0.245 27.325)` *(Vibrant Orange/Red)*
*   **Subtle & Boundary Elements**
    *   `--muted`, `--accent`: `oklch(0.96 0.002 17.2)` *(Soft Neutral Gray)*
    *   `--muted-foreground`, `--accent-foreground`: `oklch(0.547 0.021 43.1)` *(Mid-Tone Muted Gray)*
    *   `--border`, `--input`: `oklch(0.922 0.005 34.3)` *(Light divider line color)*
    *   `--ring`: `oklch(0.714 0.014 41.2)` *(Focus state wrapping ring)*

### Dark Mode (`.dark`)

*   **Backgrounds / Surfaces**
    *   `--background`: `oklch(0.147 0.004 49.3)` *(Extremely Dark Gray/Black)*
    *   `--foreground`: `oklch(0.986 0.002 67.8)` *(Off-White for body text)*
    *   `--card`, `--popover`: `oklch(0.214 0.009 43.1)` *(Dark Elevated Slate)*
    *   `--card-foreground`, `--popover-foreground`: `oklch(0.986 0.002 67.8)`
*   **Brand / Action Colors**
    *   `--primary`: `oklch(0.424 0.199 265.638)` *(Deep/Darker Indigo)*
    *   `--primary-foreground`: `oklch(0.97 0.014 254.604)`
    *   `--secondary`: `oklch(0.274 0.006 286.033)` *(Dark Muted Blue-Gray)*
    *   `--secondary-foreground`: `oklch(0.985 0 0)` *(Almost White)*
    *   `--destructive`: `oklch(0.704 0.191 22.216)` *(Darkened Red)*
*   **Subtle & Boundary Elements**
    *   `--muted`, `--accent`: `oklch(0.268 0.011 36.5)` *(Dark subtle background fill)*
    *   `--muted-foreground`: `oklch(0.714 0.014 41.2)`
    *   `--border`: `oklch(1 0 0 / 10%)` *(10% white strict opacity)*
    *   `--input`: `oklch(1 0 0 / 15%)` *(15% white strict opacity)*
    *   `--ring`: `oklch(0.547 0.021 43.1)`

## 4. Component Generation Guidelines

When generating UI, adhere strictly to these component-level principles:

1. **Class Name Architecture**: Use `className={cn("base classes", props.className)}` consistently, supported by `clsx` and `tailwind-merge` out-of-the-box.
2. **Icons**: Exclusively use `lucide-react` for any icon implementations. Keep them scaled contextually (e.g., `h-4 w-4` for button leading icons).
3. **Paddings and Spacing**: Ensure generously padded designs. Avoid cramped layouts.
    * Use generic spacing scales (`p-4`, `p-6`). `px-6 py-10` is typical for main container sections.
4. **Interactive States**: Always include focus, hover, and disabled states visually.
    * Buttons dynamically shrink/grow or skew slightly using standard `transition-all`.
    * Forms must rely on `--ring` properties. Example: `focus:border-ring focus:ring-2 focus:ring-ring/30`.
    * A disabled element must include `disabled:opacity-50 disabled:cursor-not-allowed`.
5. **No Placeholders**: When building new feature displays (avatars, galleries), use vibrant SVGs or high-quality dynamic renders instead of grey empty boxes. Create an immediate sense of polish.
