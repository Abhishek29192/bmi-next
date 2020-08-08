import React, { useState, FormEvent } from "react";
import styles from "./Form.module.scss";
import Button from "@bmi/button";
import classnames from "classnames";

type Values = { [key: string]: any };
type Errors = { [key: string]: any };

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
};

export const FormContext = React.createContext<ContextType>({
  updateFormState: (fieldValues, fieldErrors) => {},
  hasBeenSubmitted: false
});

const Form = ({
  children,
  onSubmit,
  submitButtonLabel = "Submit",
  rightAlignButton,
  buttonClassName,
  ...formProps
}: Props) => {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});
  const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);

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
    <FormContext.Provider value={{ updateFormState, hasBeenSubmitted }}>
      <form onSubmit={handleSubmit} className={styles["Form"]} {...formProps}>
        {children}
        <div
          className={classnames(styles["SubmitButtonWrapper"], {
            [styles["SubmitButtonWrapper--right"]]: rightAlignButton
          })}
        >
          <Button
            className={buttonClassName}
            type="submit"
            disabled={Object.values(errors).some(Boolean)}
          >
            {submitButtonLabel}
          </Button>
        </div>
      </form>
    </FormContext.Provider>
  );
};

const FormRow = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles["Row"]}>{children}</div>;
};

Form.Row = FormRow;

export default Form;
