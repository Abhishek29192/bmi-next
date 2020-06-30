import React from "react";
import {
  ThemeProvider as MaterialThemeProvider,
  createMuiTheme,
  CssBaseline
} from "@material-ui/core";
import { FontFace } from "csstype";
import EffraRegular from "./fonts/Effra_W_Regular.woff2";
import EffraHeavy from "./fonts/Effra_W_Heavy.woff2";

const effraRegular = {
  fontFamily: "Effra Regular",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
    local('Effra Regular'),
    local('Effra-Regular'),
    url(${EffraRegular}) format('woff2')
  `,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF"
} as FontFace;

const effraHeavy = {
  fontFamily: "Effra Heavy",
  fontStyle: "bolder",
  fontDisplay: "swap",
  fontWeight: 800,
  src: `
    local('Effra Heavy'),
    local('Effra-Heavy'),
    url(${EffraHeavy}) format('woff2')
  `,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF"
} as FontFace;

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#007bbd"
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
      primary: "#3b3b3b"
    }
  },
  typography: {
    fontFamily: "Effra Regular",
    fontSize: 16,
    h1: {
      fontFamily: "Effra Heavy",
      fontSize: "3rem",
      lineHeight: 1.2
    },
    h2: {
      fontFamily: "Effra Heavy",
      fontSize: "2.5rem",
      lineHeight: 1.2
    },
    h3: {
      fontSize: "2rem",
      fontWeight: "bold",
      lineHeight: 1.2
    },
    h4: {
      fontSize: "1.75rem",
      fontWeight: "bold",
      lineHeight: 1.2
    },
    h5: {
      fontSize: "1.5rem",
      textTransform: "uppercase",
      lineHeight: 1.2
    },
    h6: {
      fontSize: "1.25rem",
      lineHeight: 1.2
    },
    body1: {
      lineHeight: 1.4
    },
    body2: {
      fontSize: "1.25rem",
      lineHeight: 1.4
    }
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "@font-face": [effraRegular, effraHeavy]
      }
    }
  }
});

type Props = {
  children: React.ReactNode;
};

const ThemeProvider = ({ children }: Props) => (
  <MaterialThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </MaterialThemeProvider>
);

export default ThemeProvider;
