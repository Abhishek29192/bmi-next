import React, { useEffect, useContext, useState } from "react";
import MaterialTextField, { TextFieldProps } from "@material-ui/core/TextField";
import styles from "./TextField.module.scss";
import classnames from "classnames";
import { FormContext } from "@bmi/form";

import InputAdornment from "@material-ui/core/InputAdornment";
import ErrorRounded from "@material-ui/icons/ErrorRounded";

type AdornmentProps =
  | {
      rightAdornment?: undefined;
      leftAdornment?: React.ReactNode;
    }
  | {
      rightAdornment?: React.ReactNode;
      leftAdornment?: undefined;
    };

export type Props = Omit<TextFieldProps, "variant"> & {
  variant?: "outlined" | "hybrid";
  isTextArea?: boolean;
  isRequired?: boolean;
  getValidationError?: (val: string) => false | string;
  initialValue?: string;
  helperText?: string;
} & AdornmentProps;

const TextField = ({
  className,
  variant,
  isTextArea,
  leftAdornment,
  rightAdornment,
  isRequired,
  onChange,
  id,
  getValidationError,
  helperText,
  initialValue = "",
  ...props
}: Props) => {
  const { hasBeenSubmitted, updateFormState } = useContext(FormContext);

  const getError = (val) => {
    let err = null;
    if (getValidationError && getValidationError(val)) {
      err = getValidationError(val);
    }
    if (isRequired && !val) {
      err = `Field ${id} is required`;
    }
    return err;
  };

  useEffect(() => {
    updateFormState({ [id]: initialValue }, { [id]: getError(initialValue) });
  }, []);

  const [error, setError] = useState<string | null>(getError(initialValue));
  const [blurred, setBlurred] = useState<boolean>(false);

  const handleChange = (event) => {
    const val = event.target.value;
    const err = getError(val);
    setError(err);
    updateFormState({ [id]: val }, { [id]: err });
    if (onChange) {
      onChange(event);
    }
  };

  const showError = (hasBeenSubmitted || blurred) && !!error;

  const hasAdornment = error || leftAdornment || rightAdornment;
  const inputProps = hasAdornment
    ? {
        endAdornment: (
          <InputAdornment position="end">
            {error ? (
              <ErrorRounded
                style={{ color: "red" }}
                className={styles["Error"]}
              />
            ) : null}
            {leftAdornment}
            {!error ? rightAdornment : null}
          </InputAdornment>
        )
      }
    : null;

  return (
    <MaterialTextField
      {...props}
      className={classnames(
        styles["TextField"],
        { [styles["TextField--leftAdornment"]]: leftAdornment },
        {
          [styles["TextField--error"]]: error
        },
        className
      )}
      InputProps={inputProps}
      helperText={showError ? error : helperText}
      id={id}
      onBlur={() => setBlurred(true)}
      onChange={handleChange}
      error={showError}
      multiline={isTextArea}
      variant={variant === "hybrid" ? "filled" : "outlined"}
    />
  );
};

export default TextField;
