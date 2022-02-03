import classnames from "classnames";
import React, { FormEvent, useState } from "react";
import Button from "./_Button";
import styles from "./Form.module.scss";
import SubmitButton from "./_SubmitButton";
import { InputValue } from "./withFormControl";

export type Values = Record<string, InputValue | undefined>;
type ValidationPasses = false | "" | null | undefined;
export type ValidationResult = string | ValidationPasses;
type Errors = Record<string, ValidationResult>;

export type Props = Omit<React.HTMLProps<HTMLFormElement>, "onSubmit"> & {
  children: React.ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>, values: Values) => void;
  submitButtonLabel?: string;
  rightAlignButton?: boolean;
  buttonClassName?: string;
};

type ContextType = {
  updateFormState: (fieldValues: Values, fieldErrors: Errors) => void;
  hasBeenSubmitted: boolean;
  submitButtonDisabled: boolean;
  values: Values;
};

export const FormContext = React.createContext<ContextType>({
  updateFormState: () => {},
  hasBeenSubmitted: false,
  submitButtonDisabled: false,
  values: {}
});

const Form = ({
  children,
  onSubmit,
  rightAlignButton,
  buttonClassName,
  className,
  ...formProps
}: Props) => {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});
  const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);
  const submitButtonDisabled = Object.values(errors).some(Boolean);

  const updateFormState = (fieldValues: Values, fieldErrors: Errors) => {
    setValues((prev) => ({ ...prev, ...fieldValues }));
    setErrors((prev) => ({ ...prev, ...fieldErrors }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setHasBeenSubmitted(true);
    if (onSubmit) {
      onSubmit(event, values);
    }
  };

  return (
    <FormContext.Provider
      value={{
        updateFormState,
        hasBeenSubmitted,
        submitButtonDisabled,
        values
      }}
    >
      <form
        onSubmit={handleSubmit}
        className={classnames(styles["Form"], className, {
          [styles["Form--rightAlignButton"]!]: rightAlignButton
        })}
        {...formProps}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};

const FormRow = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles["Row"]}>{children}</div>;
};

const ButtonWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles["ButtonWrapper"]}>{children}</div>;
};

Form.Row = FormRow;
Form.ButtonWrapper = ButtonWrapper;
Form.Button = Button;
Form.SubmitButton = SubmitButton;

export default Form;
