import { deepMerge } from "grommet/utils";
import { lightTheme } from "./lightTheme";
import { tokens } from "./tokens";

export const darkTheme = deepMerge(lightTheme, {
  name: "Dark",
  dark: true,
  global: {
    colors: {
      background: tokens.colors.darkBackground,
      "background-back": tokens.colors.darkBackground,
      "background-front": tokens.colors.darkSurface,
      text: tokens.colors.darkText,
      "text-strong": tokens.colors.darkText,
      "text-weak": tokens.colors.darkMuted,
      brand: "#63c4e8",
      accent: "#ffae5a",
      focus: "#ffd166",
    },
  },
  button: { primary: { background: { color: "brand" }, color: tokens.colors.darkBackground } },
});
