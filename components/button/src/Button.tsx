import React from "react";
import MaterialButton, {
  ButtonProps as MuiButtonProps
} from "@material-ui/core/Button";
import MaterialIconButton, {
  IconButtonProps as MuiIconButtonProps
} from "@material-ui/core/IconButton";
import classnames from "classnames";
import { withClickable } from "@bmi/clickable";
import { useButtonStyles, useIconButtonStyles } from "./styles";

type Variant = "text" | "outlined" | "contained";

export type IconButtonProps = Omit<MuiIconButtonProps, "action"> & {
  isIconButton: true;
  accessibilityLabel: string;
  hasDarkBackground?: boolean;
  variant?: Variant;
  // TODO: Use numbers for all the options.
  size?: "extra-small" | "small" | 42 | "medium" | "large" | "extra-large";
  component?: undefined;
  classes?: MuiButtonProps["classes"];
  isColoredOutlinedDarkBg?: true;
};

export type ButtonProps = Omit<MuiButtonProps, "action"> & {
  isIconButton?: false;
  accessibilityLabel?: string;
  hasDarkBackground?: boolean;
  isColoredOutlinedDarkBg?: true;
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
  isColoredOutlinedDarkBg,
  ...rest
}: ButtonProps | IconButtonProps) => {
  const {
    outlinedDarkBg,
    containedDarkBg,
    textDarkBg,
    coloredOutlinedDarkBg,
    ...buttonClasses
  } = useButtonStyles();
  const iconButtonClasses = useIconButtonStyles();

  return isIconButton ? (
    <MaterialIconButton
      classes={{
        root: classnames(
          iconButtonClasses.root,
          iconButtonClasses[size || "medium"],
          {
            [iconButtonClasses[`${variant}`]!]: variant !== "outlined",
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
    </MaterialIconButton>
  ) : (
    <MaterialButton
      variant={variant}
      color={color}
      size={size}
      component={component}
      disabled={disabled}
      {...rest}
      classes={{
        ...classes,
        root: classnames(buttonClasses.root, classes?.root),
        text: classnames(buttonClasses.text, classes?.text, {
          [textDarkBg]: hasDarkBackground
        }),
        contained: classnames(buttonClasses.contained, classes?.contained, {
          [containedDarkBg]: hasDarkBackground
        }),
        label: classnames(buttonClasses.label, classes?.label),
        startIcon: classnames(buttonClasses.startIcon, classes?.startIcon),
        outlined: classnames(classes?.outlined, {
          [outlinedDarkBg]: hasDarkBackground && !isColoredOutlinedDarkBg,
          [coloredOutlinedDarkBg]: isColoredOutlinedDarkBg
        })
      }}
    >
      {children}
    </MaterialButton>
  );
};

export default withClickable<ButtonProps | IconButtonProps>(Button);
