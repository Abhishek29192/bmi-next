import React from "react";
import classnames from "classnames";
import styles from "./AnchorLink.module.scss";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
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
  return (
    <Link
      className={classnames(styles["Anchorlink"], {
        [styles["Anchorlink--disabled"]]: isDisabled
      })}
      {...linkProps}
    >
      {iconStart ? <ArrowForwardIcon className={styles["icon"]} /> : null}
      <span>{children}</span>
      {iconEnd ? <ArrowForwardIcon className={styles["icon"]} /> : null}
    </Link>
  );
};

export default AnchorLink;
