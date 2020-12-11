import MaterialTypography, {
  TypographyProps
} from "@material-ui/core/Typography";
import classnames from "classnames";
import React from "react";
import styles from "./Typography.module.scss";

export type Props = Omit<TypographyProps, "variant"> & {
  hasUnderline?: boolean;
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

const variantMap = {
  default: "body1",
  lead: "body2",
  hero: "body2",
  body3: "body2",
  card: "body2"
};

const Typography = ({
  children,
  className,
  hasUnderline,
  variant,
  ...props
}: Props) => (
  <MaterialTypography
    variant={variantMap[variant] || variant}
    className={classnames(className, styles["Typography"], {
      [styles["Typography--underline"]]:
        hasUnderline && ["h1", "h2", "h3", "h4"].includes(variant),
      [styles["body3"]]: variant === "body3" || variant === "card"
    })}
    {...props}
  >
    {children}
  </MaterialTypography>
);

export default Typography;
