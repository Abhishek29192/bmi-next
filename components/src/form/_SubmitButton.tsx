import React, { useContext } from "react";
import DefaultButton, { ButtonProps } from "../button/Button";
import { FormContext } from "./Form";
import { useStyles } from "./styles";

type Props = ButtonProps & {
  component?: React.ComponentType<any>; // TODO
  children: React.ReactNode;
};

const SubmitButton = ({ component, children, disabled, ...props }: Props) => {
  const classes = useStyles();
  const { submitButtonDisabled } = useContext(FormContext);

  const Button = component || DefaultButton;

  return (
    <Button
      className={classes.button}
      type="submit"
      disabled={disabled || submitButtonDisabled}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
