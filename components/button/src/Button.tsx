import React from "react";
import MaterialButton, {
  ButtonProps as MuiButtonProps
} from "@material-ui/core/Button";
import MaterialIconButton, {
  IconButtonProps as MuiIconButtonProps
} from "@material-ui/core/IconButton";
import styles from "./Button.module.scss";
import classnames from "classnames";

export type IconButtonProps = MuiIconButtonProps & {
  isIconButton: true;
  accessibilityLabel: string;
  hasDarkBackground?: boolean;
  variant?: "text" | "outlined" | "contained";
  size?: "extra-small" | "small" | "medium" | "large" | "extra-large";
};

export type ButtonProps = MuiButtonProps & {
  isIconButton?: false;
  accessibilityLabel?: string;
  hasDarkBackground?: boolean;
  variant?: string;
};

const Button = ({
  children,
  className,
  color,
  variant,
  hasDarkBackground,
  isIconButton,
  accessibilityLabel,
  size,
  disabled,
  ...rest
}: ButtonProps | IconButtonProps) => {
  return isIconButton ? (
    <MaterialIconButton
      className={classnames(
        styles["IconButton"],
        styles[`IconButton--${size || "medium"}`],
        {
          [styles[`IconButton--${variant}`]]: variant,
          [styles["IconButton--disabled"]]: disabled,
          [styles["IconButton--dark-background"]]: hasDarkBackground
        },
        className
      )}
      aria-label={accessibilityLabel}
      {...rest}
    >
      {children}
    </MaterialIconButton>
  ) : (
    <MaterialButton
      className={classnames(styles["Button"], className, {
        [styles["Button--dark-background"]]: hasDarkBackground
      })}
      // @ts-ignore For some reason TS doens't understand that it can't be undefined
      variant={variant || "contained"}
      color={color || "primary"}
      size={size}
      {...rest}
    >
      {children}
    </MaterialButton>
  );
};

export default Button;
