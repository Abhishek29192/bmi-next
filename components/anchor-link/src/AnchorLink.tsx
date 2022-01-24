import React, { useContext } from "react";
import classnames from "classnames";
import Icon from "@bmi/icon";
import { withClickable } from "@bmi/clickable";
import Link, { LinkProps } from "@material-ui/core/Link";
import { ColorPairContext } from "@bmi/color-pair";
import arrowForwardIcon from "./icons/arrow-right.svg";
import styles from "./AnchorLink.module.scss";

export type Props = Omit<LinkProps, "color"> & {
  children: React.ReactNode;
  isDisabled?: boolean;
  iconStart?: boolean;
  iconEnd?: boolean;
  iconInverted?: boolean;
  color?: "default" | "black" | "white";
  action?: { href?: string };
};

const typeToColorMap: Record<"dark" | "light", Props["color"]> = {
  dark: "white",
  light: "black"
};

const AnchorLink = ({
  children,
  isDisabled,
  iconStart,
  iconEnd,
  className,
  color,
  iconInverted,
  ...rest
}: Props) => {
  const { type, theme } = useContext(ColorPairContext);
  const colorFromTheme: Props["color"] =
    // eslint-disable-next-line security/detect-object-injection
    color || (type && typeToColorMap[type]) || "default";

  const arrowIcon = (
    <Icon
      source={arrowForwardIcon}
      aria-hidden="true"
      focusable="false"
      className={classnames(styles["icon"], {
        [styles["icon--inverted"]!]: iconInverted
      })}
    />
  );

  return (
    <Link
      className={classnames(className, styles["Anchorlink"], {
        [styles["Anchorlink--disabled"]!]: isDisabled,
        [styles[`Anchorlink--${colorFromTheme}`]!]:
          theme !== "white" && colorFromTheme !== "default"
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
