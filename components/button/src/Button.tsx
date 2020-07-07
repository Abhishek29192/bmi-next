import React, { useState } from "react";
import MaterialButton, {
  ButtonProps as MuiButtonProps
} from "@material-ui/core/Button";
import MaterialIconButton, {
  IconButtonProps as MuiIconButtonProps
} from "@material-ui/core/IconButton";
import styles from "./Button.module.scss";
import classnames from "classnames";

type IconButtonProps = MuiIconButtonProps & {
  isIconButton: true;
  accessibilityLabel: string;
  hasDarkBackground?: boolean;
  variant?: undefined;
  size?: "extra-small" | "small" | "medium" | "large" | "extra-large";
};

type ButtonProps = MuiButtonProps & {
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
  onClick,
  disabled,
  ...rest
}: ButtonProps | IconButtonProps) => {
  const [iconRef, setIconRef] = useState<any>();

  return isIconButton ? (
    <div
      className={classnames(styles["IconButtonWrapper"], {
        [styles[`IconButtonWrapper--${size || "medium"}`]]: isIconButton
      })}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (
          typeof target.className === "string" &&
          target.className.includes("IconButtonWrapper")
        ) {
          iconRef.click();
        }
      }}
      aria-label={accessibilityLabel}
      data-testid="icon-button-wrapper"
    >
      <MaterialIconButton
        className={classnames(
          styles["IconButton"],
          styles[`IconButton--${size || "medium"}`],
          styles[`IconButton--${disabled ? "disabled" : "enabled"}`],
          className
        )}
        ref={(ref) => {
          setIconRef(ref);
        }}
        onClick={(event) => {
          if (onClick) {
            onClick(event);
          }
        }}
        aria-label={accessibilityLabel}
        {...rest}
      >
        {children}
      </MaterialIconButton>
    </div>
  ) : (
    <MaterialButton
      className={classnames(styles["Button"], className, {
        [styles["Button--dark-background"]]: hasDarkBackground
      })}
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
