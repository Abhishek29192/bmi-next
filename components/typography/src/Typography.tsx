import MaterialTypography, {
  TypographyProps
} from "@material-ui/core/Typography";
import classnames from "classnames";
import React from "react";
import styles from "./Typography.module.scss";

type Props = TypographyProps & {
  hasUnderline?: boolean;
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
