import React, { useContext } from "react";
import { FormContext } from "./Form";
import Button, { ButtonProps } from "@bmi/button";

type Props = ButtonProps & {
  children: React.ReactNode;
};

const SubmitButton = ({ children, ...props }: Props) => {
  const { submitButtonDisabled } = useContext(FormContext);

  return (
    <Button type="submit" disabled={submitButtonDisabled} {...props}>
      {children}
    </Button>
  );
};

export default SubmitButton;
