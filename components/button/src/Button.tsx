import React from "react";
import MaterialButton, {
  ButtonProps as MuiButtonProps
} from "@material-ui/core/Button";
import MaterialIconButton, {
  IconButtonProps as MuiIconButtonProps
} from "@material-ui/core/IconButton";
import { Button as MuiButton } from "@material-ui/core";
import classnames from "classnames";
import { withClickable } from "@bmi/clickable";
import styles from "./Button.module.scss";

type Variant = "text" | "outlined" | "contained";

export type IconButtonProps = Omit<MuiIconButtonProps, "action"> & {
  isIconButton: true;
  accessibilityLabel: string;
  hasDarkBackground?: boolean;
  variant?: Variant;
  // TODO: Use numbers for all the options.
  size?: "extra-small" | "small" | 42 | "medium" | "large" | "extra-large";
  component?: undefined;
};

export type ButtonProps = Omit<MuiButtonProps, "action"> & {
  isIconButton?: false;
  accessibilityLabel?: string;
  hasDarkBackground?: boolean;
  variant?: Variant;
  component?: React.ElementType<any>;
};

const Button = ({
  children,
  className,
  color = "primary",
  variant = "contained",
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
        variant !== "outlined" && styles[`IconButton--${variant}`],
        {
          [styles["IconButton--disabled"]!]: disabled,
          [styles["IconButton--dark-background"]!]: hasDarkBackground
        },
        className
      )}
      aria-label={accessibilityLabel}
      disabled={disabled}
      {...rest}
    >
      {children}
    </MaterialIconButton>
  ) : (
    <MaterialButton
      className={classnames(styles["Button"], className, {
        [styles["Button--dark-background"]!]: hasDarkBackground
      })}
      variant={variant}
      color={color}
      size={size}
      component={component || "button"}
      disabled={disabled}
      {...rest}
    >
      {children}
    </MaterialButton>
  );
};

export default withClickable<ButtonProps | IconButtonProps>(Button);
