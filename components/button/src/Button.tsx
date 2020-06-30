import React from "react";
import MaterialButton, { ButtonProps } from "@material-ui/core/Button";
import styles from "./Button.module.scss";
import classnames from "classnames";

type Props = ButtonProps & {
  hasDarkBackground?: boolean;
};

const Button = ({
  children,
  color,
  className,
  variant,
  hasDarkBackground,
  ...rest
}: Props) => (
  <MaterialButton
    className={classnames(styles["Button"], className, {
      [styles["Button--dark-background"]]: hasDarkBackground
    })}
    variant={variant || "contained"}
    color={color || "primary"}
    {...rest}
  >
    {children}
  </MaterialButton>
);

export default Button;
