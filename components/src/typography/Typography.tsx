import {
  Typography as MaterialTypography,
  TypographyProps
} from "@material-ui/core";
import classnames from "classnames";
import React, { useMemo } from "react";
import styles from "./Typography.module.scss";

export type Props = Omit<TypographyProps, "variant"> & {
  hasUnderline?: boolean;
  hasDarkBackground?: boolean;
  noClamp?: boolean;
  // NOTE: This is necessary until we upgrade to @material-ui/core@^5.0.0
  // see: https://github.com/mui-org/material-ui/issues/22452#issuecomment-685756045
  component?: React.ElementType;
  variant?:
    | TypographyProps["variant"]
    | "default"
    | "lead"
    | "hero"
    | "body3"
    | "card";
};

const getTypographyVariant = (
  variant?: Props["variant"]
): TypographyProps["variant"] => {
  if (!variant) {
    return undefined;
  }

  switch (variant) {
    case "default":
      return "body1";
    case "lead":
    case "hero":
    case "body3":
    case "card":
      return "body2";
    default:
      return variant;
  }
};

const Typography = ({
  children,
  className,
  hasUnderline,
  hasDarkBackground,
  noClamp,
  variant,
  ...props
}: Props) => {
  const canAddUnderLine = useMemo(
    () => hasUnderline && variant && ["h1", "h2", "h3", "h4"].includes(variant),
    [variant, hasUnderline]
  );

  return (
    <MaterialTypography
      variant={getTypographyVariant(variant)}
      className={classnames(className, styles["Typography"], {
        [styles["Typography--underline"]!]: canAddUnderLine,
        [styles["body3"]!]: variant === "body3" || variant === "card",
        "no-clamp": noClamp,
        [styles["Typography--underline--dark-bg"]!]:
          hasDarkBackground && canAddUnderLine
      })}
      {...props}
    >
      {children}
    </MaterialTypography>
  );
};

export default Typography;
