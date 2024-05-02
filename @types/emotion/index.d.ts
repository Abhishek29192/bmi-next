import type { ThemeOptions } from "@bmi-digital/components/theme-provider";

declare module "@mui/material/styles" {
  interface Theme extends ThemeOptions {}
}
