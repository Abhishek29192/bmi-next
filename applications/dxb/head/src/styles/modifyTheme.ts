import { ThemeOptions } from "@bmi-digital/components";

export const modifyTheme = (theme: ThemeOptions): ThemeOptions => {
  return {
    ...theme,
    components: {
      MuiCssBaseline: {
        styleOverrides: `
              ${theme.components?.MuiCssBaseline?.styleOverrides}
              body { background-color: ${theme.colours.alabasterA} !important}  `
      }
    }
  };
};
