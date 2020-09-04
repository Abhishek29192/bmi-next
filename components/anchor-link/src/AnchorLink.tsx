import React from "react";
import classnames from "classnames";
import styles from "./AnchorLink.module.scss";
import Icon from "@bmi/icon";
import { withClickable } from "@bmi/clickable";
import arrowForwardIcon from "./icons/arrow-right.svg";
import Link, { LinkProps } from "@material-ui/core/Link";

type AnchorLinkProps = LinkProps & {
  children: React.ReactNode;
  isDisabled?: boolean;
  iconStart?: boolean;
  iconEnd?: boolean;
};

const AnchorLink = ({
  children,
  isDisabled,
  iconStart,
  iconEnd,
  className,
  ...rest
}: AnchorLinkProps) => {
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
      className={classnames(className, styles["Anchorlink"], {
        [styles["Anchorlink--disabled"]]: isDisabled
      })}
      {...rest}
    >
      {iconStart ? arrowIcon : null}
      <span>{children}</span>
      {iconEnd ? arrowIcon : null}
    </Link>
  );
};

export default withClickable(AnchorLink);
