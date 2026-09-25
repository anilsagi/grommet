# Theme & Styling Demo Guide

The theme lab is opened from the **Themes** button in `src/App.jsx`. It is a fullscreen Grommet `Layer`, so the existing demos remain available underneath it.

## How the theme is wired

```text
App.jsx
  -> owns isDark and themeOpen
  -> passes lightTheme or darkTheme to <Grommet>
  -> opens ThemeDemo

ThemeDemo.jsx
  -> reads the active theme with ThemeContext
  -> reads the current breakpoint with ResponsiveContext
  -> renders each focused demonstration section

src/theme/tokens.js
  -> source values for colors, spacing, radius, type, and breakpoints

lightTheme.js / darkTheme.js
  -> merge the tokens into Grommet's base theme
  -> define global styles and component overrides
```

## Demo flow

1. Click **Themes** in the main application.
2. The initial theme is Light. The root `Grommet` provider receives `lightTheme`.
3. Click **Switch to dark mode**. `App.jsx` flips `isDark` and React supplies `darkTheme` to the same provider.
4. Every Grommet component updates without a page reload because its colors and styles resolve from the provider.
5. Resize the browser. `BreakpointsDemo` reads `ResponsiveContext` and changes from one column to two or three columns.
6. Use Tab to move through the controls. The global focus border is defined in the theme and remains visible in both modes.

## What each section demonstrates

### Theme overview
Shows the hierarchy from Grommet to individual components. The arrows are visual only; the real relationship is the provider and theme object.

### Colors
The swatches use named Grommet colors such as `brand`, `accent`, `success`, `warning`, `error`, `background`, and `text-strong`. The names resolve to different values in Light and Dark themes.

### Spacing
`pad` and `gap` receive Grommet edge-size names. The values displayed beside the samples come from `tokens.spacing` so the documentation and implementation share one source.

### Typography
Heading levels and body text are regular Grommet components. Their family, size, weight, and line-height are configured in the theme rather than repeated in every component.

### Responsive breakpoints
`useContext(ResponsiveContext)` returns values such as `small`, `medium`, or `large`. The demo uses that value to choose a one-, two-, or three-column `Grid`.

### Component themes
Buttons, `TextInput`, `Select`, and `FormField` are not given custom inline styling. Their radius, padding, labels, and focus behavior come from the component theme keys in `lightTheme.js`.

### ThemeContext
`ThemeContextDemo` calls `useContext(ThemeContext)` and displays values from the active provider. It deliberately does not import `lightTheme` or `darkTheme`, which proves that a child can inspect the current theme at runtime.

### Global styles
The controls in this section use the global color, font, spacing, and focus configuration. This is useful when explaining why shared styles belong in `global` instead of being copied into each component.

### Design tokens
The values are printed from `tokens.js`. Change a token there, then rebuild or refresh, to see the same source value used by the themes and the demo labels.

## Important implementation notes

- `darkTheme.js` uses `deepMerge(lightTheme, ...)`, so common component configuration is defined once.
- `lightTheme.js` uses `deepMerge(grommet, ...)`, preserving Grommet defaults while adding application decisions.
- Use Grommet color names in JSX (`color="brand"`, `background="background"`) instead of repeating hex values.
- The small amount of CSS in `ThemeDemo.css` only handles layout protection, card borders, hero presentation, and compatibility with the starter stylesheet. Theme values remain in the Grommet theme files.
- The theme panel is scrollable and its content column is intrinsic-height. This prevents a fullscreen flex container from shrinking sections and causing content overlap.

## Files to explain in a demo

- [App.jsx](../src/App.jsx): provider state and Themes entry point.
- [ThemeDemo.jsx](../src/components/theme/ThemeDemo.jsx): composed interactive lab.
- [tokens.js](../src/theme/tokens.js): reusable design values.
- [lightTheme.js](../src/theme/lightTheme.js): base and light configuration.
- [darkTheme.js](../src/theme/darkTheme.js): dark overrides.
- [ThemeDemo.css](../src/components/theme/ThemeDemo.css): layout and overflow safeguards.
