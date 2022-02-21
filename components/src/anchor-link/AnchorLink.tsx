import React, { useContext } from "react";
import { Link, LinkProps } from "@material-ui/core";
import classnames from "classnames";
import Icon from "../icon/Icon";
import { withClickable } from "../clickable/Clickable";
import { ColorPairContext } from "../color-pair/ColorPair";
import arrowForwardIcon from "./icons/arrow-right.svg";
import launchIcon from "./icons/launch.svg";
import styles from "./AnchorLink.module.scss";

export type Props = Omit<LinkProps, "color"> & {
  children: React.ReactNode;
  isDisabled?: boolean;
  iconStart?: boolean;
  iconEnd?: boolean;
  isExternal?: boolean;
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
  isExternal,
  color,
  iconInverted,
  ...rest
}: Props) => {
  const { type, theme } = useContext(ColorPairContext);
  const colorFromTheme: Props["color"] =
    // eslint-disable-next-line security/detect-object-injection
    color || (type && typeToColorMap[type]) || "default";
  const icon = (
    <Icon
      data-testid={isExternal ? "external" : "internal"}
      source={isExternal ? launchIcon : arrowForwardIcon}
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
      {iconStart ? icon : null}
      <span>{children}</span>
      {iconEnd ? icon : null}
    </Link>
  );
};

export default withClickable(AnchorLink);
