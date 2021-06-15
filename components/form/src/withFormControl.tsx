import React, { useEffect, useContext, useState, ElementType } from "react";
import { FormContext } from "./";

export type InputValue = string | number | boolean | File[] | string[];

export type Props<I extends InputValue> = {
  isRequired?: boolean;
  fieldIsRequiredError?: string;
  // TODO: pass all values so that validation could depend on other fields
  getValidationError?: (val?: I) => false | string;
  defaultValue?: I;
  value?: I;
  onChange?: (value: I) => void;
  name: string;
};

const withFormControl = <P extends {}, I extends InputValue>(
  WrappedComponent: ElementType<any>
) => {
  const FormControl = ({
    isRequired,
    onChange,
    name,
    fieldIsRequiredError,
    getValidationError,
    value,
    defaultValue,
    ...props
  }: Omit<P, "onChange" | "defaultValue" | "value" | "onBlur"> & Props<I>) => {
    const { hasBeenSubmitted, updateFormState } = useContext(FormContext);

    const getError = (val?: I) => {
      if (isRequired && !val) {
        return fieldIsRequiredError || null;
      }
      if (getValidationError && getValidationError(val)) {
        return getValidationError(val) || null;
      }
      return null;
    };

    useEffect(() => {
      const errorMessage = getError(value || defaultValue);
      updateFormState(
        { [name]: value || defaultValue },
        errorMessage ? { [name]: errorMessage } : {}
      );
    }, []);

    const [error, setError] = useState<string | null>(
      getError(value || defaultValue)
    );
    const [blurred, setBlurred] = useState<boolean>(false);

    const handleChange = (val: I) => {
      const errorMessage = getError(val);
      setError(errorMessage);
      updateFormState(
        { [name]: val },
        errorMessage ? { [name]: errorMessage } : {}
      );
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
