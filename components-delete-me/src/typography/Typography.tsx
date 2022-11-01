import {
  Typography as MaterialTypography,
  TypographyProps
} from "@material-ui/core";
import classnames from "classnames";
import React, { useMemo } from "react";
import { transformHyphens } from "../utils/hyphenUtils";
import { useStyles } from "./styles";

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
  const classes = useStyles();

  return (
    <MaterialTypography
      variant={getTypographyVariant(variant)}
      className={classnames(
        className,
        classes.root,
        canAddUnderLine && classes.underline,
        (variant === "body3" || variant === "card") && classes.body3,
        noClamp && variant === "h1" && classes.h1NoClamp,
        noClamp && variant === "h2" && classes.h2NoClamp,
        noClamp && variant === "h3" && classes.h3NoClamp,
        noClamp && variant === "h4" && classes.h4NoClamp,
        hasDarkBackground && canAddUnderLine && classes.darkBg
      )}
      data-testid={"typography"}
      {...props}
    >
      {transformHyphens(children)}
    </MaterialTypography>
  );
};

export default Typography;
