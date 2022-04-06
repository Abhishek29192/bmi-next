import React from "react";
import { Icon } from "@bmi/components";
import { logoIconMap } from "@bmi/components";
import classnames from "classnames";
import styles from "./styles/BrandLogo.module.scss";

type Props = {
  brandName: string;
  className?: string;
  brandWhiteBox?: boolean;
};

const BrandLogo = ({ brandName, className, brandWhiteBox = false }: Props) => {
  // eslint-disable-next-line security/detect-object-injection
  const iconLogo = logoIconMap[brandName];

  return iconLogo ? (
    <Icon
      source={iconLogo}
      className={classnames(styles["BrandLogo"], className, {
        [styles["BrandLogo-whiteBox"]]: brandWhiteBox
      })}
    />
  ) : null;
};

export default BrandLogo;
