import React from "react";
import MaterialTextField, { TextFieldProps } from "@material-ui/core/TextField";
import styles from "./TextField.module.scss";
import classnames from "classnames";
import { withFormControl } from "@bmi/form";

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
  helperText?: string;
  errorText?: string;
  error?: boolean;
  name: string;
  onChange: (value: string) => void;
} & AdornmentProps;

const TextField = ({
  className,
  variant,
  isTextArea,
  leftAdornment,
  rightAdornment,
  isRequired,
  id,
  error,
  name,
  helperText,
  errorText,
  onChange,
  ...props
}: Props) => {
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

  const handleChange = (event) => onChange(event.target.value);
  return (
    <MaterialTextField
      {...props}
      helperText={error ? errorText : helperText}
      id={id}
      error={error}
      multiline={isTextArea}
      onChange={handleChange}
      variant={variant === "hybrid" ? "filled" : "outlined"}
      className={classnames(
        styles["TextField"],
        { [styles["TextField--leftAdornment"]]: leftAdornment },
        {
          [styles["TextField--error"]]: error
        },
        className
      )}
      InputProps={inputProps}
    />
  );
};

export default withFormControl<Props>(TextField);
