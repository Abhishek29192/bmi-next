import MaterialTypography, {
  TypographyProps
} from "@material-ui/core/Typography";
import classnames from "classnames";
import React from "react";
import styles from "./Typography.module.scss";

export type Props = TypographyProps & {
  hasUnderline?: boolean;
  // NOTE: This is necessary until we upgrade to @material-ui/core@^5.0.0
  // see: https://github.com/mui-org/material-ui/issues/22452#issuecomment-685756045
  component?: React.ElementType;
};

const Typography = ({
  children,
  className,
  hasUnderline,
  variant,
  ...props
}: Props) => (
  <MaterialTypography
    variant={variant}
    className={classnames(className, styles["Typography"], {
      [styles["Typography--underline"]]:
        hasUnderline && ["h1", "h2", "h3", "h4"].includes(variant)
    })}
    {...props}
  >
    {children}
  </MaterialTypography>
);

export default Typography;
