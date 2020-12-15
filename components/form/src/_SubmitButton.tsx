import Button, { ButtonProps } from "@bmi/button";
import React, { useContext } from "react";
import { FormContext } from "./Form";
import styles from "./Form.module.scss";

type Props = ButtonProps & {
  children: React.ReactNode;
};

const SubmitButton = ({ children, disabled, ...props }: Props) => {
  const { submitButtonDisabled } = useContext(FormContext);

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
