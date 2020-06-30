import React from "react";
import {
  ThemeProvider as MaterialThemeProvider,
  createMuiTheme,
  CssBaseline
} from "@material-ui/core";
import { FontFace } from "csstype";
import EffraRegular from "./fonts/Effra_W_Regular.woff2";

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
    tonalOffset: 0.2
  },
  typography: {
    fontFamily: "Effra Regular",
    fontSize: 16, // change for desktop
    // lineHeight: 1.4,
    h1: {
      fontSize: 48, //54
      lineHeight: 1.2
    },
    h2: {
      fontSize: 40, //45
      lineHeight: 1.2
    },
    h3: {
      fontSize: 32, //36
      lineHeight: 1.2
    },
    h4: {
      fontSize: 28, //31.5
      lineHeight: 1.2
    },
    h5: {
      fontSize: 24, //27
      lineHeight: 1.2
    },
    h6: {
      fontSize: 20, //22.5
      lineHeight: 1.2
    }
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "@font-face": [effraRegular]
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
