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
  Necoflex: styles["NavyBlue"],
  Ormax: styles["BrandRed"],
  Redland: styles["BrandRed"],
  Sealoflex: styles["SealoflexBlue"],
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
  const ref = useRef<HTMLDivElement>();
  const [interColor, setInterColor] = useState<string | null>(null);

  const className = getBrandClassName(brand);

  useLayoutEffect(() => {
    if (ref.current) {
      const style = getComputedStyle(ref.current);
      const interColor = style.getPropertyValue("--color-brand-inter").trim();
      if (interColor) {
        setInterColor(interColor);
      }
    }
  }, []);

  const modifyThemePrimaryColor = (theme: ThemeOptions) => {
    if (interColor) {
      theme.palette.primary = { main: interColor };
    }
    return theme;
  };

  return (
    <div
      ref={ref}
      className={classnames(className)}
      data-testid="brand-colors-provider"
    >
      <BmiThemeProvider
        longText={Boolean(process.env.GATSBY_LONG_TEXT)}
        modifyTheme={modifyThemePrimaryColor}
      >
        {children}
      </BmiThemeProvider>
    </div>
  );
};

export default BrandProvider;
