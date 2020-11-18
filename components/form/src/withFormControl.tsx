import React, { useEffect, useContext, useState } from "react";
import { FormContext } from "./";

export type InputValue = string | boolean | File[] | string[];

export type Props = {
  isRequired?: boolean;
  // TODO: pass all values so that validation could depend on other fields
  getValidationError?: (val: InputValue) => false | string;
  defaultValue?: InputValue;
  value?: InputValue;
  onChange?: (value: InputValue) => void;
  name: string;
};

const withFormControl = <P extends {}>(WrappedComponent) => {
  const FormControl = ({
    isRequired,
    onChange,
    name,
    getValidationError,
    value,
    defaultValue = typeof value === "undefined" ? "" : undefined,
    ...props
  }: Omit<P, "onChange" | "defaultValue" | "value" | "onBlur"> & Props) => {
    const { hasBeenSubmitted, updateFormState } = useContext(FormContext);

    const getError = (val: InputValue) => {
      if (isRequired && !val) {
        return "This field is required";
      }
      if (getValidationError && getValidationError(val)) {
        return getValidationError(val) || null;
      }
      return null;
    };

    useEffect(() => {
      updateFormState(
        { [name]: value || defaultValue },
        { [name]: getError(value || defaultValue) }
      );
    }, []);

    const [error, setError] = useState<string | null>(
      getError(value || defaultValue)
    );
    const [blurred, setBlurred] = useState<boolean>(false);

    const handleChange = (val: InputValue) => {
      const errorMessage = getError(val);
      setError(errorMessage);
      updateFormState({ [name]: val }, { [name]: errorMessage });
      if (onChange) {
        onChange(val);
      }
    };

    const showError = (hasBeenSubmitted || blurred) && !!error;

    const valueProps =
      typeof value !== "undefined" ? { value } : { defaultValue };

    return (
      <WrappedComponent
        {...props}
        name={name}
        errorText={error}
        onBlur={() => setBlurred(true)}
        onChange={handleChange}
        error={showError}
        {...valueProps}
      />
    );
  };
  return FormControl;
};

export default withFormControl;
