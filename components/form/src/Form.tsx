import React, { useState, FormEvent } from "react";
import styles from "./Form.module.scss";
import SubmitButton from "./SubmitButton";
import { InputValue } from "./withFormControl";

type Values = Record<string, InputValue>;
type Errors = Record<string, string>;

type Props = React.HTMLProps<HTMLFormElement> & {
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
};

export const FormContext = React.createContext<ContextType>({
  updateFormState: (fieldValues, fieldErrors) => {},
  hasBeenSubmitted: false,
  submitButtonDisabled: false
});

const Form = ({
  children,
  onSubmit,
  rightAlignButton,
  buttonClassName,
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

  const handleSubmit = (event) => {
    setHasBeenSubmitted(true);
    if (onSubmit) {
      onSubmit(event, values);
    }
  };

  return (
    <FormContext.Provider
      value={{ updateFormState, hasBeenSubmitted, submitButtonDisabled }}
    >
      <form onSubmit={handleSubmit} className={styles["Form"]} {...formProps}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

const FormRow = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles["Row"]}>{children}</div>;
};

Form.Row = FormRow;
Form.SubmitButton = SubmitButton;

export default Form;
