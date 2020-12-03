import Button, { ButtonProps } from "@bmi/button";
import React, { useContext } from "react";
import { FormContext } from "./Form";
import styles from "./Form.module.scss";

type Props = ButtonProps & {
  children: React.ReactNode;
};

const SubmitButton = ({ children, ...props }: Props) => {
  const { submitButtonDisabled } = useContext(FormContext);

  return (
    <Button
      className={styles["Button"]}
      type="submit"
      disabled={submitButtonDisabled}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
