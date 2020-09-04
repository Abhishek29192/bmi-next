import React from "react";
import classnames from "classnames";
import styles from "./AnchorLink.module.scss";
import Icon from "@bmi/icon";
import arrowForwardIcon from "./icons/arrow-right.svg";
import { Link } from "@material-ui/core";

type AnchorLinkProps = {
  children: React.ReactNode;
  href?: string;
  to?: string;
  isDisabled?: boolean;
  iconStart?: boolean;
  iconEnd?: boolean;
};

const AnchorLink = ({
  children,
  isDisabled,
  iconStart,
  iconEnd,
  ...linkProps
}: Partial<AnchorLinkProps>) => {
  const arrowIcon = (
    <Icon
      source={arrowForwardIcon}
      aria-hidden="true"
      focusable="false"
      className={styles["icon"]}
    />
  );

  return (
    <Link
      className={classnames(styles["Anchorlink"], {
        [styles["Anchorlink--disabled"]]: isDisabled
      })}
      {...linkProps}
    >
      {iconStart ? arrowIcon : null}
      <span>{children}</span>
      {iconEnd ? arrowIcon : null}
    </Link>
  );
};

export default AnchorLink;
