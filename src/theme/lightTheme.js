import { grommet } from "grommet";
import { deepMerge } from "grommet/utils";
import { tokens } from "./tokens";

export const lightTheme = deepMerge(grommet, {
  name: "Light",
  global: {
    colors: {
      brand: tokens.colors.brand,
      accent: tokens.colors.accent,
      background: tokens.colors.lightBackground,
      "background-back": tokens.colors.lightSurface,
      "background-front": tokens.colors.lightSurface,
      text: tokens.colors.lightText,
      "text-strong": tokens.colors.lightText,
      "text-weak": "#52616b",
      success: tokens.colors.success,
      warning: tokens.colors.warning,
      error: tokens.colors.error,
      focus: tokens.colors.focus,
    },
    font: {
      family: tokens.typography.bodyFamily,
      size: tokens.typography.bodySize,
      height: tokens.typography.bodyLineHeight,
    },
    edgeSize: tokens.spacing,
    breakpoints: {
      small: { value: tokens.breakpoints.small, border: "2px" },
      medium: { value: tokens.breakpoints.medium, border: "2px" },
      large: { value: tokens.breakpoints.large, border: "2px" },
    },
    focus: { border: { color: "focus", size: "2px" } },
  },
  heading: {
    font: { family: tokens.typography.family, weight: tokens.typography.headingWeight },
  },
  button: {
    border: { radius: tokens.radius.medium },
    padding: { horizontal: tokens.spacing.medium, vertical: tokens.spacing.small },
    primary: { background: { color: "brand" }, color: "white" },
  },
  textInput: { extend: { borderRadius: tokens.radius.medium } },
  formField: { label: { size: "small", weight: 700, color: "text-strong" }, margin: { vertical: "small" } },
});
