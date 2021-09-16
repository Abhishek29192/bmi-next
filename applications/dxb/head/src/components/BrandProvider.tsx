import React, { useState, useRef, useLayoutEffect, createContext } from "react";
import classnames from "classnames";
import type { ThemeOptions } from "@material-ui/core";
import BmiThemeProvider from "@bmi/theme-provider";
import { DialogClassNameContext } from "@bmi/dialog";

import styles from "./styles/BrandProvider.module.scss";

export const BrandClassNameContext = createContext<string | null>(null);

const BRANDS_CLASSES: { [key: string]: string | undefined } = {
  AeroDek: styles["AeroDeck"],
  Awak: styles["AeroDeck"],
  Braas: styles["BrandRed"],
  Bramac: styles["BrandRed"],
  Coverland: styles["BrandRed"],
  Esha: styles["BrandGreen"],
  Everguard: styles["Purple"],
  Monarflex: styles["RoyalBlue"],
  Monarplan: styles["Purple"],
  Monier: styles["BrandRed"],
  Necoflex: styles["NavyBlue"],
  Ormax: styles["BrandRed"],
  Redland: styles["BrandRed"],
  Sealoflex: styles["NavyBlue"],
  Siplast: styles["SiplastBlack"],
  Sunscape: styles["BrandRed"],
  Vedag: styles["NavyBlue"],
  Villas: styles["RoyalBlue"],
  Wierer: styles["BrandRed"],
  Wolfin: styles["BrandGreen"],
  Zanda: styles["BrandRed"]
};

export const getBrandClassName = (brand?: string): string => {
  return BRANDS_CLASSES[`${brand}`] || "";
};

type BrandProviderProps = {
  children: React.ReactNode;
  brand?: string;
};

const BrandProvider = ({ brand, children }: BrandProviderProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [interColor, setInterColor] = useState<string | null>(null);
  const [focusColor, setFocusColor] = useState<string | undefined>();

  const className = getBrandClassName(brand);

  useLayoutEffect(() => {
    if (ref.current) {
      const style = getComputedStyle(ref.current);
      const interColor = style.getPropertyValue("--color-theme-inter").trim();
      const focusColor = style.getPropertyValue("--color-theme-focus").trim();
      if (interColor) {
        setInterColor(interColor);
      }
      if (focusColor) {
        setFocusColor(focusColor);
      }
    }
  }, []);

  const modifyThemePrimaryColor = (theme: ThemeOptions) => {
    if (interColor) {
      theme.palette = theme.palette || {};
      theme.palette.primary = { main: interColor, dark: focusColor };
    }
    return theme;
  };

  const featureToggle = process.env.GATSBY_ENABLE_BRAND_PROVIDER as
    | boolean // styleguidist's webpack returns boolean value
    | string
    | undefined;

  return featureToggle === "true" || featureToggle === true ? (
    <div
      ref={ref}
      className={classnames(className)}
      data-testid="brand-colors-provider"
    >
      <BrandClassNameContext.Provider value={className}>
        <BmiThemeProvider
          longText={Boolean(process.env.GATSBY_LONG_TEXT)}
          modifyTheme={modifyThemePrimaryColor}
        >
          <DialogClassNameContext.Provider value={className}>
            {children}
          </DialogClassNameContext.Provider>
        </BmiThemeProvider>
      </BrandClassNameContext.Provider>
    </div>
  ) : (
    <BmiThemeProvider longText={Boolean(process.env.GATSBY_LONG_TEXT)}>
      {children}
    </BmiThemeProvider>
  );
};

export default BrandProvider;
