import {
  createMuiTheme,
  CssBaseline,
  ThemeProvider as MaterialThemeProvider,
  ThemeOptions
} from "@material-ui/core";
import React from "react";
import variables from "./ThemeProvider.module.scss";
import { effraBold, effraHeavy, effraMedium, effraRegular } from "./fonts";

export const getTheme = (
  longText: boolean,
  modifyTheme: (theme: ThemeOptions) => ThemeOptions = (t) => t
) => {
  const defaultTheme: ThemeOptions = {
    breakpoints: {
      values: {
        xs: parseFloat(variables["breakpoint-xs"]!),
        sm: parseFloat(variables["breakpoint-sm"]!),
        md: parseFloat(variables["breakpoint-md"]!),
        lg: parseFloat(variables["breakpoint-lg"]!),
        xl: parseFloat(variables["breakpoint-xl"]!)
      }
    },
    palette: {
      primary: {
        // light: will be calculated from palette.primary.main,
        main: variables["color-primary-main"]!
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      secondary: {
        light: "#0066ff",
        main: "#0044ff",
        // dark: will be calculated from palette.secondary.main,
        contrastText: "#ffcc00"
      },
      // Used by `getContrastText()` to maximize the contrast between
      // the background and the text.
      contrastThreshold: 3,
      // Used by the functions below to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset: 0.2,
      text: {
        primary: variables["color-text-primary"]
      }
    },
    typography: {
      fontFamily: "Effra Regular",
      h1: {
        fontFamily: "Effra Heavy",
        fontSize: longText ? "clamp(2rem, 1.62rem + 1vw, 3rem)" : "3rem",
        lineHeight: 1.2
      },
      h2: {
        fontFamily: "Effra Heavy",
        fontSize: longText ? "clamp(1.17rem, 1.2rem + 1vw, 2.5rem)" : "2.5rem",
        lineHeight: 1.2
      },
      h3: {
        fontFamily: "Effra Bold",
        fontSize: longText ? "clamp(1.5rem, 0.7rem + 1vw, 2rem)" : "2rem",
        lineHeight: 1.2
      },
      h4: {
        fontFamily: "Effra Bold",
        fontSize: longText
          ? "clamp(1.05rem, 0.68rem + 0.5vw, 1.75rem)"
          : "1.75rem",
        lineHeight: 1.2
      },
      h5: {
        fontFamily: "Effra Medium",
        fontSize: "1.25rem",
        lineHeight: 1.2
      },
      h6: {
        fontFamily: "Effra Medium",
        fontSize: "1.125rem",
        lineHeight: 1.2
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.4
      },
      body2: {
        fontSize: "1.25rem",
        lineHeight: 1.4
      },
      button: {
        textTransform: "none"
      }
    },
    overrides: {
      MuiCssBaseline: {
        "@global": {
          "@font-face": [effraRegular, effraMedium, effraBold, effraHeavy]
        }
      }
    }
  };
  return createMuiTheme(modifyTheme(defaultTheme));
};

type Props = {
  longText?: boolean;
  children: React.ReactNode;
  modifyTheme?: (theme: ThemeOptions) => ThemeOptions;
};

const ThemeProvider = ({ longText = false, modifyTheme, children }: Props) => {
  const theme = React.useMemo(
    () => getTheme(longText, modifyTheme),
    [longText, modifyTheme]
  );

  return (
    <MaterialThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MaterialThemeProvider>
  );
};

export default ThemeProvider;
