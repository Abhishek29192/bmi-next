import React from "react";
import classnames from "classnames";

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

type BrandProviderProps = {
  children: React.ReactNode;
  brand?: string;
};

const BrandProvider = ({ brand, children }: BrandProviderProps) => {
  const className = BRANDS_CLASSES[`${brand}`];

  return <div className={classnames(className)}>{children}</div>;
};

export default BrandProvider;
