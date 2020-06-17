import React from "react";
import MaterialTypography, {
  TypographyProps
} from "@material-ui/core/Typography";

const Typography = ({ children, variant, ...props }: TypographyProps) => (
  <MaterialTypography variant={variant} {...props}>
    {children}
  </MaterialTypography>
);

export default Typography;
