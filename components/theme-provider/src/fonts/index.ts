import { AtRule } from "csstype";
import EffraBold from "./Effra_W_Bold.woff2";
import EffraHeavy from "./Effra_W_Heavy.woff2";
import EffraMedium from "./Effra_W_Medium.woff2";
import EffraRegular from "./Effra_W_Regular.woff2";

export const effraRegular = {
  fontFamily: "Effra Regular",
  fontDisplay: "swap",
  src: `url(${EffraRegular}) format('woff2')`
} as AtRule.FontFace;

export const effraMedium = {
  fontFamily: "Effra Medium",
  fontDisplay: "swap",
  src: `url(${EffraMedium}) format('woff2')`
} as AtRule.FontFace;

export const effraBold = {
  fontFamily: "Effra Bold",
  fontDisplay: "swap",
  src: `url(${EffraBold}) format('woff2')`
} as AtRule.FontFace;

export const effraHeavy = {
  fontFamily: "Effra Heavy",
  fontDisplay: "swap",
  src: `url(${EffraHeavy}) format('woff2')`
} as AtRule.FontFace;
