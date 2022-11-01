import {
  createTheme,
  CssBaseline,
  makeStyles,
  SimplePaletteColorOptions,
  ThemeOptions as MuiThemeOptions
} from "@material-ui/core";
import { ThemeProvider as MaterialThemeProvider } from "@material-ui/styles";
import React from "react";
import { effraBold, effraHeavy, effraMedium, effraRegular } from "./fonts";

export const colours = {
  bodyBgBase: "#fff",
  alabasterA: "#fafafa",
  alabaster: "#f0f0f0",
  alert: "#ffc72c",
  aqua100: "#d9f0ed",
  aqua200: "#8dd3c9",
  aqua400: "#41b6a5",
  aqua500: "#359486",
  black: "#000000",
  blue100: "#d6d7dc",
  blue300: "#858895",
  blue800: "#34384f",
  blue900: "#292d41",
  charcoal: "#3b3b3b",
  cyan100: "#ccecf9",
  cyan200: "#66c5ee",
  cyan300: "#33b2e9",
  cyan400: "#009fe3",
  cyan500: "#0072b0",
  cyan600: "#005b8c",
  cyan700: "#004b73",
  error: "#d6001c",
  magenta100: "#f2cfdb",
  magenta200: "#d97094",
  magenta400: "#bf104d",
  magenta500: "#940c3b",
  orange100: "#fad8cf",
  orange200: "#f08970",
  orange400: "#e63b11",
  orange500: "#ad2c0c",
  pearl: "#f7f7f7",
  purple100: "#e5cfe0",
  purple200: "#b26ea1",
  purple400: "#7f0e62",
  purple500: "#660b4f",
  slate: "#70706f",
  storm: "#cccccc",
  success: "#009a44",
  teal100: "#d2e4e8",
  teal200: "#79adbb",
  teal400: "#20778e",
  teal500: "#1a6073",
  white: "#ffffff",
  brandRed300: "#fd543e",
  brandRed: "#e30613",
  brandRedInter: "#d10513",
  brandRedFocus: "#b30510",
  royalBlue: "#004f9f",
  royalBlueFocus: "#003d7a",
  purple300: "#8985d6",
  purple: "#201e5b",
  purpleFocus: "#161542",
  navyBlue: "#133579",
  navyBlueFocus: "#0e2a5d",
  sealoflexBlue: "#00539c",
  sealoflexBlueFocus: "#003c70",
  brandGreen: "#2aa94e",
  brandGreenInter: "#1f7a39",
  brandGreenFocus: "#1a6531"
};

type PaletteOptions = Omit<
  NonNullable<MuiThemeOptions["palette"]>,
  "primary"
> & {
  primary: Omit<SimplePaletteColorOptions, "dark"> & {
    dark: NonNullable<SimplePaletteColorOptions["dark"]>;
  };
};

export type ThemeOptions = Omit<MuiThemeOptions, "palette"> & {
  palette: PaletteOptions;
  colours: typeof colours & {
    // Separated out as they by default use common colours
    accent300: string;
    accent: string;
    inter: string;
    interDark: string;
    focus: string;
    focusDark: string;
    // Secondary(action cards colors)
    secondary1: string;
    secondary2: string;
    secondary3: string;
    secondary4: string;
  } & { [key: string]: string };
};

export const getTheme = (
  modifyTheme: (theme: ThemeOptions) => ThemeOptions = (t) => t,
  includeCssBaseline = true
) => {
  const getCssOverrides = () => {
    return includeCssBaseline
      ? {
          overrides: {
            MuiCssBaseline: {
              "@global": {
                "@font-face": [effraRegular, effraMedium, effraBold, effraHeavy]
              }
            }
          }
        }
      : undefined;
  };
  const defaultTheme: ThemeOptions = {
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 720,
        lg: 840,
        xl: 1440
      }
    },
    colours: {
      ...colours,
      accent300: colours.cyan400,
      accent: colours.cyan400,
      inter: colours.cyan500,
      interDark: colours.cyan500,
      focus: colours.cyan600,
      focusDark: colours.cyan600,

      // Secondary(action cards colors)
      secondary1: colours.cyan700,
      secondary2: colours.slate,
      secondary3: colours.blue800,
      secondary4: colours.charcoal
    },
    palette: {
      primary: {
        // light: will be calculated from palette.primary.main,
        main: colours.cyan500,
        dark: colours.cyan600
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
        primary: colours.charcoal
      }
    },
    typography: {
      fontFamily: "Effra Regular",
      h1: {
        fontFamily: "Effra Heavy",
        fontSize: "2.125rem",
        lineHeight: 1.2
      },
      h2: {
        fontFamily: "Effra Heavy",
        fontSize: "1.75rem",
        lineHeight: 1.2
      },
      h3: {
        fontFamily: "Effra Bold",
        fontSize: "1.5rem",
        lineHeight: 1.2
      },
      h4: {
        fontFamily: "Effra Bold",
        fontSize: "1.35rem",
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
        fontSize: "1.125rem",
        lineHeight: 1.4
      },
      button: {
        textTransform: "none"
      }
    },
    ...getCssOverrides()
  };
  return createTheme(modifyTheme(defaultTheme));
};

const useGlobalStyles = makeStyles(
  {
    "@global": {
      "@media(hover: hover)": {
        "*": {
          scrollbarColor: "#c2c2c2 transparent",
          scrollbarWidth: "thin"
        },
        /* width */
        "::-webkit-scrollbar": {
          width: "6px"
        },
        /* Track */
        "::-webkit-scrollbar-track": {
          boxShadow: "inset 0 0 0 transparent"
        },
        /* Handle */
        "::-webkit-scrollbar-thumb": {
          background: "#c2c2c2",
          borderRadius: "10px"
        }
      }
    }
  },
  { name: "Global" }
);

type Props = {
  children: React.ReactNode;
  modifyTheme?: (theme: ThemeOptions) => ThemeOptions;
  includeCssBaseline?: boolean;
};

const ThemeProvider = ({
  modifyTheme,
  includeCssBaseline = true,
  children
}: Props) => {
  const theme = React.useMemo(
    () => getTheme(modifyTheme, includeCssBaseline),
    [modifyTheme]
  );
  useGlobalStyles();
  return (
    // <StylesProvider injectFirst={true}>
    <MaterialThemeProvider theme={theme}>
      {includeCssBaseline && <CssBaseline />}
      {children}
    </MaterialThemeProvider>
    // </StylesProvider>
  );
};

export default ThemeProvider;
