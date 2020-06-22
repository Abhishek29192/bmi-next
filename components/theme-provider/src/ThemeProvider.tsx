import React from "react";
import {
  ThemeProvider as MaterialThemeProvider,
  createMuiTheme
} from "@material-ui/core";

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
    fontFamily: "Effra Heavy",
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
  }
});

type Props = {
  children: React.ReactNode;
};

const ThemeProvider = ({ children }: Props) => (
  <MaterialThemeProvider theme={theme}>{children}</MaterialThemeProvider>
);

export default ThemeProvider;
