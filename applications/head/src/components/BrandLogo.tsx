import React from "react";
import Icon from "@bmi/icon";
import { iconMap } from "@bmi/logo";
import styles from "./styles/BrandLogo.module.scss";

type Props = {
  brandName: string;
};

const BrandLogo = ({ brandName }: Props) => {
  const iconLogo = iconMap[brandName];

  return iconLogo ? (
    <Icon source={iconLogo} className={styles["BrandLogo"]} />
  ) : null;
};

export default BrandLogo;
