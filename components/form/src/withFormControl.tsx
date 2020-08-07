import React, { useEffect, useContext, useState } from "react";
import { FormContext } from "./";
import { Props as TextFieldProps } from "@bmi/text-field";
import { Props as CheckboxProps } from "@bmi/checkbox";
import { Props as SelectProps } from "@bmi/select";

export type Props = (
  | Omit<TextFieldProps, "onChange" | "defaultValue">
  | Omit<CheckboxProps, "onChange" | "defaultValue">
  | Omit<SelectProps, "onChange" | "defaultValue">
) & {
  isRequired?: boolean;
  // TODO: pass all values so that validation could depend on other fields
  getValidationError?: (val: string | boolean) => false | string;
  defaultValue?: string | boolean;
  onChange?: (value: string | boolean) => void;
  name: string;
};

const withFormControl = (WrappedComponent) => {
  const FormControl = ({
    isRequired,
    onChange,
    name,
    getValidationError,
    defaultValue = "",
    ...props
  }: Props) => {
    const { hasBeenSubmitted, updateFormState } = useContext(FormContext);

    const getError = (val: string | boolean) => {
      if (isRequired && !val) {
        return `${name} field is required`;
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

    const handleChange = (val: string | boolean) => {
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
