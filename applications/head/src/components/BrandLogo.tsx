import React from "react";
import Icon from "@bmi/icon";
import { iconMap } from "@bmi/logo";
import styles from "./styles/BrandLogo.module.scss";

type Props = {
  brandName: string;
};

const BrandLogo = ({ brandName }: Props) => {
  return brandName ? (
    <Icon source={iconMap[brandName]} className={styles["BrandLogo"]} />
  ) : (
    <></>
  );
};

export default BrandLogo;
