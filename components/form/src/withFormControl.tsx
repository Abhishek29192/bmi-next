import React, { useEffect, useContext, useState } from "react";
import { FormContext } from "./";
import { Props as TextFieldProps } from "@bmi/text-field";
import { Props as CheckboxProps } from "@bmi/checkbox";
import { Props as SelectProps } from "@bmi/select";
import { Props as UploadProps } from "@bmi/upload";

type InputValue = string | boolean | File[];

export type Props = (
  | Omit<TextFieldProps, "onChange" | "defaultValue" | "label">
  | Omit<CheckboxProps, "onChange" | "defaultValue" | "label">
  | Omit<SelectProps, "onChange" | "defaultValue" | "label">
  | Omit<UploadProps, "onChange" | "defaultValue" | "label" | "onBlur">
) & {
  isRequired?: boolean;
  // TODO: pass all values so that validation could depend on other fields
  getValidationError?: (val: InputValue) => false | string;
  defaultValue?: InputValue;
  onChange?: (value: InputValue) => void;
  name: string;
  label?: string;
};

const withFormControl = (WrappedComponent) => {
  const FormControl = ({
    isRequired,
    onChange,
    name,
    getValidationError,
    defaultValue = "",
    label,
    ...props
  }: Props) => {
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
        label={label}
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
