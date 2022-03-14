import { Link, LinkProps } from "@material-ui/core";
import classnames from "classnames";
import React, { useContext } from "react";
import { withClickable } from "../clickable";
import { ColorPairContext } from "../color-pair";
import Icon from "../icon";
import { transformHyphens } from "../utils/hyphenUtils";
import arrowForwardIcon from "./icons/arrow-right.svg";
import launchIcon from "./icons/launch.svg";
import { useStyles } from "./styles";

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
  const classes = useStyles();
  const colorFromTheme: Props["color"] =
    // eslint-disable-next-line security/detect-object-injection
    color || (type && typeToColorMap[type]) || "default";
  const icon = (
    <Icon
      data-testid={isExternal ? "external" : "internal"}
      source={isExternal ? launchIcon : arrowForwardIcon}
      aria-hidden="true"
      focusable="false"
      className={classnames(
        classes.icon,
        iconInverted && classes["icon--inverted"]
      )}
    />
  );

  return (
    <Link
      className={classnames(
        className,
        classes.root,
        "Anchorlink",
        isDisabled && classes.disabled,
        theme !== "white" &&
          colorFromTheme !== "default" &&
          // eslint-disable-next-line security/detect-object-injection
          classes[colorFromTheme]
      )}
      aria-disabled={isDisabled}
      {...rest}
    >
      {iconStart ? icon : null}
      <span>{transformHyphens(children)}</span>
      {iconEnd ? icon : null}
    </Link>
  );
};

export default withClickable(AnchorLink);
