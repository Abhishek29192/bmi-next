import { ThemeOptions, getTheme } from "@bmi-digital/components/theme-provider";

const modifyTheme = (theme: ThemeOptions): ThemeOptions => {
  return {
    ...theme,
    components: {
      ...theme.components,
      MuiCssBaseline: {
        styleOverrides: `
              ${theme.components?.MuiCssBaseline?.styleOverrides}
              body { background-color: ${theme.colours.white} !important}  `
      }
    }
  };
};

export const theme = getTheme(modifyTheme);
