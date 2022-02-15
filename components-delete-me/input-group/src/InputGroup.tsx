import React from "react";
import { ButtonProps, IconButtonProps } from "@bmi-digital/components";
import { TextFieldProps } from "@bmi-digital/components";
import classnames from "classnames";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import styles from "./InputGroup.module.scss";

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
      className={classnames(
        styles["InputGroup"],
        lockBreakpoint && styles[`InputGroup--locked-${lockBreakpoint}`]
      )}
    >
      {InputComponent}
      {ButtonComponent}
    </div>
  );
};

export default InputGroup;
