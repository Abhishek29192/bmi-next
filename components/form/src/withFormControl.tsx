import React, { useEffect, useContext, useState } from "react";
import { FormContext } from "./";

export type InputValue = string | boolean | File[] | string[];

export type Props = {
  isRequired?: boolean;
  // TODO: pass all values so that validation could depend on other fields
  getValidationError?: (val: InputValue) => false | string;
  defaultValue?: InputValue;
  onChange?: (value: InputValue) => void;
  name: string;
};

const withFormControl = <P extends {}>(WrappedComponent) => {
  const FormControl = ({
    isRequired,
    onChange,
    name,
    getValidationError,
    defaultValue = "",
    ...props
  }: Omit<P, "onChange" | "defaultValue" | "onBlur"> & Props) => {
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
        { [name]: defaultValue },
        { [name]: getError(defaultValue) }
      );
    }, []);

    const [error, setError] = useState<string | null>(getError(defaultValue));
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

    return (
      <WrappedComponent
        {...props}
        name={name}
        errorText={error}
        onBlur={() => setBlurred(true)}
        onChange={handleChange}
        error={showError}
        defaultValue={defaultValue}
      />
    );
  };
  return FormControl;
};

export default withFormControl;
