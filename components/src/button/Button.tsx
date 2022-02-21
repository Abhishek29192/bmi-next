import React from "react";
import {
  Button as MaterialButton,
  ButtonProps as MuiButtonProps
} from "@material-ui/core";
import {
  IconButton,
  IconButtonProps as MuiIconButtonProps
} from "@material-ui/core";
import classnames from "classnames";
import { withClickable } from "../clickable/Clickable";
import { useButtonStyles, useIconButtonStyles } from "./styles";

type Variant = "text" | "outlined" | "contained" | "opaqueOutlined";

export type IconButtonProps = Omit<MuiIconButtonProps, "action"> & {
  isIconButton: true;
  accessibilityLabel: string;
  hasDarkBackground?: boolean;
  variant?: Variant;
  // TODO: Use numbers for all the options.
  size?: "extra-small" | "small" | 42 | "medium" | "large" | "extra-large";
  component?: undefined;
  classes?: MuiButtonProps["classes"];
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
  classes,
  color = "primary",
  variant = "contained",
  hasDarkBackground,
  isIconButton,
  accessibilityLabel,
  size,
  disabled,
  component = "button",
  ...rest
}: ButtonProps | IconButtonProps) => {
  const buttonClasses = useButtonStyles();
  const iconButtonClasses = useIconButtonStyles();
  const buttonVariant = variant === "opaqueOutlined" ? "outlined" : variant;

  return isIconButton ? (
    <IconButton
      classes={{
        root: classnames(
          iconButtonClasses.root,
          iconButtonClasses[size || "medium"],
          {
            [iconButtonClasses[`${buttonVariant}`]!]: variant !== "outlined",
            [iconButtonClasses.textDark]:
              variant === "text" && hasDarkBackground
          }
        )
      }}
      aria-label={accessibilityLabel}
      component={component}
      disabled={disabled}
      {...rest}
    >
      {children}
    </IconButton>
  ) : (
    <MaterialButton
      variant={buttonVariant}
      color={color}
      size={size}
      component={component}
      disabled={disabled}
      {...rest}
      classes={{
        ...classes,
        root: classnames(buttonClasses.root, classes?.root),
        text: classnames(buttonClasses.text, classes?.text, {
          [buttonClasses.textDarkBg]: hasDarkBackground
        }),
        contained: classnames(buttonClasses.contained, classes?.contained, {
          [buttonClasses.containedDarkBg]: hasDarkBackground
        }),
        label: classnames(buttonClasses.label, classes?.label),
        startIcon: classnames(buttonClasses.startIcon, classes?.startIcon),
        outlined: classnames(classes?.outlined, {
          [buttonClasses.opaqueOutlined]: variant === "opaqueOutlined",
          [buttonClasses.outlinedDarkBg]:
            hasDarkBackground && variant !== "opaqueOutlined",
          [buttonClasses.opaqueOutlinedDarkBg]:
            variant === "opaqueOutlined" && hasDarkBackground
        })
      }}
    >
      {children}
    </MaterialButton>
  );
};

export default withClickable<ButtonProps | IconButtonProps>(Button);
