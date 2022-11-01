import { useMediaQuery, useTheme } from "@material-ui/core";
import classnames from "classnames";
import React from "react";
import { ButtonProps, IconButtonProps } from "../button/Button";
import { Props as TextFieldProps } from "../text-field/TextField";
import { useStyles } from "./styles";

// TODO: This check doesn't really work.
type Props = {
  input: React.ReactElement<TextFieldProps>;
  button: React.ReactElement<ButtonProps | IconButtonProps>;
  lockBreakpoint?: "xs" | "sm" | "md" | "lg" | false;
};

const InputGroup = ({ input, button, lockBreakpoint = "sm" }: Props) => {
  const classes = useStyles();
  const theme = useTheme();
  const matches =
    lockBreakpoint && useMediaQuery(theme.breakpoints.up(lockBreakpoint));
  const InputComponent = React.cloneElement(input, {
    className: classes.input
  });
  const extraProp = button.props.isIconButton
    ? {}
    : {
        disableElevation: matches
      };

  const ButtonComponent = React.cloneElement(button, {
    className: classes.button,
    ...extraProp
  });

  return (
    <div
      className={classnames(
        classes.root,
        lockBreakpoint && classes[`locked${lockBreakpoint}`]
      )}
    >
      {InputComponent}
      {ButtonComponent}
    </div>
  );
};

export default InputGroup;
