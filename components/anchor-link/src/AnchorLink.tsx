import React, { useContext } from "react";
import classnames from "classnames";
import styles from "./AnchorLink.module.scss";
import Icon from "@bmi/icon";
import { withClickable } from "@bmi/clickable";
import arrowForwardIcon from "./icons/arrow-right.svg";
import Link, { LinkProps } from "@material-ui/core/Link";
import { ColorPairContext } from "@bmi/color-pair";

type Props = Omit<LinkProps, "color"> & {
  children: React.ReactNode;
  isDisabled?: boolean;
  iconStart?: boolean;
  iconEnd?: boolean;
  color?: "default" | "black" | "white";
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
  ...rest
}: Props) => {
  const { type, theme } = useContext(ColorPairContext);
  const colorFromTheme: Props["color"] =
    color || typeToColorMap[type] || "default";

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
        [styles["Anchorlink--disabled"]]: isDisabled,
        [styles[`Anchorlink--${colorFromTheme}`]]:
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
