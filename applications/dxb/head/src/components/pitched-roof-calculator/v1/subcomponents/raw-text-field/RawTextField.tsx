import ErrorRounded from "@mui/icons-material/ErrorRounded";
import InputAdornment from "@mui/material/InputAdornment";
import { TextFieldProps } from "@mui/material/TextField";
import classnames from "classnames";
import React, { ChangeEvent } from "react";
import { StyledMaterialTextField, classes } from "./styles";

type AdornmentProps =
  | {
      rightAdornment?: undefined;
      leftAdornment?: React.ReactNode;
    }
  | {
      rightAdornment?: React.ReactNode;
      leftAdornment?: undefined;
    };

export type Props = Omit<TextFieldProps, "variant" | "onChange"> & {
  variant?: "outlined" | "hybrid";
  isTextArea?: boolean;
  isRequired?: boolean;
  helperText?: string;
  errorText?: string;
  error?: boolean;
  name: string;
  onChange: (value: string) => void;
} & AdornmentProps;

const RawTextField = ({
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
                className={classes.Error}
              />
            ) : null}
            {leftAdornment}
            {!error ? rightAdornment : null}
          </InputAdornment>
        )
      }
    : {};

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => onChange(event.target.value);
  return (
    <StyledMaterialTextField
      {...props}
      helperText={error ? errorText : helperText}
      id={id}
      error={error}
      multiline={isTextArea}
      onChange={handleChange}
      variant={variant === "hybrid" ? "filled" : "outlined"}
      className={classnames(leftAdornment && classes.leftAdornment, className)}
      InputProps={inputProps}
    />
  );
};

export default RawTextField;
