import React from "react";
import Icon from "@bmi/icon";
import { iconMap } from "@bmi/logo";
import classnames from "classnames";
import styles from "./styles/BrandLogo.module.scss";

type Props = {
  brandName: string;
  className?: string;
};

const BrandLogo = ({ brandName, className }: Props) => {
  const iconLogo = iconMap[brandName];

  return iconLogo ? (
    <Icon
      source={iconLogo}
      className={classnames(styles["BrandLogo"], className)}
    />
  ) : null;
};

export default BrandLogo;
