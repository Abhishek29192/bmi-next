import React from "react";
import BrandLogo from "../components/BrandLogo";
import type { Logo as LogoValue } from "../components/BrandLogo";

export type Props = {
  pageContext: {
    logo: LogoValue;
  };
};

const Logo = ({ pageContext: { logo } }: Props) => {
  return <BrandLogo brandName={logo} />;
};

export default Logo;
