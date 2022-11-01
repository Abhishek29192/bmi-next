import React, { useEffect, useContext, useState, ElementType } from "react";
import { ValidationResult } from "./Form";
import { FormContext } from "./Form";

export type InputValue = string | number | boolean | File[] | string[];

export type Props<I extends InputValue> = {
  isRequired?: boolean;
  groupName?: React.ReactNode;
  fieldIsRequiredError?: string;
  // TODO: pass all values so that validation could depend on other fields
  getValidationError?: (val?: I) => ValidationResult;
  defaultValue?: I;
  value?: I;
  onChange?: (value: I) => void;
  name: string;
};

const withFormControl = <P, I extends InputValue>(
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
    groupName,
    ...props
  }: Omit<P, "onChange" | "defaultValue" | "value" | "onBlur" | "groupName"> &
    Props<I>) => {
    const { hasBeenSubmitted, updateFormState } = useContext(FormContext);
    const getError = (val?: I): ValidationResult => {
      if (isRequired && (!val || (Array.isArray(val) && !val.length))) {
        return fieldIsRequiredError || null;
      }
      if (getValidationError && getValidationError(val)) {
        return getValidationError(val);
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

    const valueProps =
      typeof value !== "undefined" ? { value } : { defaultValue };

    return (
      <WrappedComponent
        {...props}
        isRequired={isRequired}
        name={name}
        errorText={error}
        onBlur={() => setBlurred(true)}
        onChange={handleChange}
        error={showError}
        groupName={groupName}
        {...valueProps}
      />
    );
  };
  return FormControl;
};

export default withFormControl;
