import DefaultButton, { ButtonProps } from "@bmi-digital/components/button";
import React, { useContext } from "react";
import { FormContext } from "./Form";
import styles from "./Form.module.scss";

type Props = ButtonProps & {
  component?: React.ComponentType<any>; // TODO
  children: React.ReactNode;
};

const SubmitButton = ({ component, children, disabled, ...props }: Props) => {
  const { submitButtonDisabled } = useContext(FormContext);

  const Button = component || DefaultButton;

  return (
    <Button
      className={styles["Button"]}
      type="submit"
      disabled={disabled || submitButtonDisabled}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
