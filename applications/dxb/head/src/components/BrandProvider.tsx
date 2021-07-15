import React, { useState, useRef, useLayoutEffect } from "react";
import classnames from "classnames";
import type { ThemeOptions } from "@material-ui/core";
import BmiThemeProvider from "@bmi/theme-provider";

import styles from "./styles/BrandProvider.module.scss";

const BRANDS_CLASSES = {
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
  Necoflex: styles["NaviBlue"],
  Ormax: styles["BrandRed"],
  Redland: styles["BrandRed"],
  Sealoflex: styles["SealoflexBlue"],
  Siplast: styles["SiplastBlack"],
  Sunscape: styles["BrandRed"],
  Vedag: styles["NaviBlue"],
  Villas: styles["RoyalBlue"],
  Wierer: styles["BrandRed"],
  Wolfin: styles["BrandGreen"],
  Zanda: styles["BrandRed"]
};

export const getBrandClassName = (brand?: string) => BRANDS_CLASSES[`${brand}`];

type BrandProviderProps = {
  children: React.ReactNode;
  brand?: string;
};

export const changePrimaryColor =
  (primaryColor: string = "#ccc") =>
  (theme: ThemeOptions) => {
    return {
      ...theme,
      palette: {
        ...theme.palette,
        primary: {
          ...theme.palette.primary,
          main: primaryColor
        }
      }
    };
  };

const BrandProvider = ({ brand, children }: BrandProviderProps) => {
  const ref = useRef(null);
  const [expandTheme, setExpandTheme] = useState(undefined);

  const className = getBrandClassName(brand);

  useLayoutEffect(() => {
    const primaryColor =
      ref.current &&
      getComputedStyle(ref.current)!
        .getPropertyValue("--color-brand-inter")
        ?.trim();
    primaryColor && setExpandTheme(() => changePrimaryColor(primaryColor));
  }, []);

  return (
    <div
      ref={ref}
      className={classnames(className)}
      data-testid="brand-colors-provider"
    >
      <BmiThemeProvider
        longText={!!process.env.GATSBY_LONG_TEXT}
        expandTheme={expandTheme}
      >
        {children}
      </BmiThemeProvider>
    </div>
  );
};

export default BrandProvider;
