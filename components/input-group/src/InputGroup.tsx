import React from "react";
import { ButtonProps, IconButtonProps } from "@bmi/button";
import { Props as TextFieldProps } from "@bmi/text-field";
import classnames from "classnames";
import styles from "./InputGroup.module.scss";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// TODO: This check doesn't really work.
type Props = {
  input: React.ReactElement<TextFieldProps>;
  button: React.ReactElement<ButtonProps | IconButtonProps>;
  lockBreakpoint?: "xs" | "sm" | "md" | "lg" | false;
};

const InputGroup = ({ input, button, lockBreakpoint = "sm" }: Props) => {
  const theme = useTheme();
  const matches =
    lockBreakpoint && useMediaQuery(theme.breakpoints.up(lockBreakpoint));
  const InputComponent = React.cloneElement(input, {
    className: styles["input"]
  });
  const extraProp = button.props.isIconButton
    ? {}
    : {
        disableElevation: matches
      };

  const ButtonComponent = React.cloneElement(button, {
    className: styles["button"],
    ...extraProp
  });

  return (
    <div
      className={classnames(styles["InputGroup"], {
        [styles[`InputGroup--locked-${lockBreakpoint}`]]: lockBreakpoint
      })}
    >
      {InputComponent}
      {ButtonComponent}
    </div>
  );
};

export default InputGroup;