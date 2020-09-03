import React from "react";
import MaterialButton, {
  ButtonProps as MuiButtonProps
} from "@material-ui/core/Button";
import MaterialIconButton, {
  IconButtonProps as MuiIconButtonProps
} from "@material-ui/core/IconButton";
import styles from "./Button.module.scss";
import classnames from "classnames";
import { withClickable } from "@bmi/clickable";

export type IconButtonProps = Omit<MuiIconButtonProps, "action"> & {
  isIconButton: true;
  accessibilityLabel: string;
  hasDarkBackground?: boolean;
  variant?: "text" | "outlined" | "contained";
  size?: "extra-small" | "small" | "medium" | "large" | "extra-large";
  component?: undefined;
};

export type ButtonProps = Omit<MuiButtonProps, "action"> & {
  isIconButton?: false;
  accessibilityLabel?: string;
  hasDarkBackground?: boolean;
  variant?: string;
  component?: React.ElementType<any>;
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
  component,
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
      component={component}
      disabled={disabled}
      {...rest}
    >
      {children}
    </MaterialButton>
  );
};

export default withClickable<ButtonProps | IconButtonProps>(Button);
