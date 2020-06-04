import React from "react";
import MaterialButton, { ButtonProps } from "@material-ui/core/Button";

const Button = ({ children, variant, color }: ButtonProps) => (
  <MaterialButton variant={variant} color={color}>
    {children}
  </MaterialButton>
);

export default Button;
