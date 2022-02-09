// This has been forked from @bmi/form
// <root>/components/form/src/withFormControl.tsx

// TODO: use @bmi/form withFormControl - if this MR is merged
// https://gitlab.com/bmi-digital/dxb/-/merge_requests/1672

import React, { useEffect, useContext, useState, ElementType } from "react";
import { FormContext, ValidationResult } from "@bmi/form";

export type InputValue = string | number | boolean | File[] | string[];

export type Props<I extends InputValue> = {
  isRequired?: boolean;
  fieldIsRequiredError?: string;
  // TODO: pass all values so that validation could depend on other fields
  getValidationError?: (val?: I) => ValidationResult;
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
    value: explicitValue,
    defaultValue,
    ...props
  }: Omit<P, "onChange" | "defaultValue" | "value" | "onBlur"> & Props<I>) => {
    const {
      hasBeenSubmitted,
      updateFormState,
      values: formContextValues
    } = useContext(FormContext);

    const value =
      typeof explicitValue !== "undefined"
        ? explicitValue
        : // eslint-disable-next-line security/detect-object-injection
          (formContextValues[name] as I);

    const valueProps =
      typeof value !== "undefined" ? { value } : { defaultValue };

    const getError = (val?: I): ValidationResult => {
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

    const [error, setError] = useState<ValidationResult>(
      getError(value || defaultValue)
    );
    const [blurred, setBlurred] = useState<boolean>(false);

    const handleChange = (val: I) => {
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
        {...valueProps}
      />
    );
  };
  return FormControl;
};

export default withFormControl;
