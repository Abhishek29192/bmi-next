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
  const { outlinedDarkBg, containedDarkBg, textDarkBg, ...buttonClasses } =
    useButtonStyles({
      classes: !isIconButton ? classes : undefined
    });
  const iconButtonClasses = useIconButtonStyles({
    classes: isIconButton ? classes : undefined
  });

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
        root: classnames(buttonClasses.root),
        text: classnames(buttonClasses.text, {
          [textDarkBg]: hasDarkBackground
        }),
        contained: classnames(buttonClasses.contained, {
          [containedDarkBg]: hasDarkBackground
        }),
        label: classnames(buttonClasses.label),
        startIcon: classnames(buttonClasses.startIcon),
        outlined: classnames({
          [outlinedDarkBg]: hasDarkBackground
        })
      }}
    >
      {children}
    </MaterialButton>
  );
};

export default withClickable<ButtonProps | IconButtonProps>(Button);
