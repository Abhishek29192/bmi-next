import React from "react";
import Icon from "@bmi-digital/components/icon";
import { iconMap } from "@bmi-digital/components/logo";
import classnames from "classnames";
import styles from "./styles/BrandLogo.module.scss";

type Props = {
  brandName: string;
  className?: string;
};

const BrandLogo = ({ brandName, className }: Props) => {
  // eslint-disable-next-line security/detect-object-injection
  const iconLogo = iconMap[brandName];

  return iconLogo ? (
    <Icon
      source={iconLogo}
      className={classnames(styles["BrandLogo"], className)}
    />
  ) : null;
};

export default BrandLogo;
