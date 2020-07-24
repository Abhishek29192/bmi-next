import { FontFace } from "csstype";
import EffraHeavy from "./Effra_W_Heavy.woff2";
import EffraMedium from "./Effra_W_Medium.woff2";
import EffraRegular from "./Effra_W_Regular.woff2";

export const effraRegular = {
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

export const effraMedium = {
  fontFamily: "Effra Medium",
  fontStyle: "medium",
  fontDisplay: "swap",
  fontWeight: 500,
  src: `
    local('Effra Medium'),
    local('Effra-Medium'),
    url(${EffraMedium}) format('woff2')
  `,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF"
} as FontFace;

export const effraHeavy = {
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
