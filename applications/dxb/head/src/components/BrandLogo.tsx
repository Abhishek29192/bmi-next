import { Icon, logoIconMap } from "@bmi-digital/components";
import classnames from "classnames";
import React from "react";
import styles from "./styles/BrandLogo.module.scss";

type Props = {
  brandName: string;
  className?: string;
  brandWhiteBox?: boolean;
};

const BrandLogo = ({ brandName, className, brandWhiteBox = false }: Props) => {
  // eslint-disable-next-line security/detect-object-injection
  const iconLogo =
    logoIconMap[brandWhiteBox ? `${brandName}Boxed` : `${brandName}Isolated`];

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
