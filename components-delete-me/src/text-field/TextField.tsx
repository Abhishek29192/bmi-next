import {
  InputAdornment,
  TextField as MaterialTextField,
  TextFieldProps
} from "@material-ui/core";
import { ErrorRounded } from "@material-ui/icons";
import classnames from "classnames";
import React, { ChangeEvent } from "react";
import withFormControl from "../form/withFormControl";
import { useStyles } from "./styles";

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
  onChange?: (value: string) => void;
} & AdornmentProps;

export const TextField = ({
  className,
  variant,
  isTextArea,
  leftAdornment,
  rightAdornment,
  id,
  error,
  helperText,
  errorText,
  onChange,
  InputProps,
  isRequired,
  ...props
}: Props) => {
  const classes = useStyles();
  const hasAdornment = error || leftAdornment || rightAdornment;
  const inputProps = hasAdornment
    ? {
        endAdornment: (
          <InputAdornment position="end">
            {error ? (
              <ErrorRounded
                style={{ color: "red" }}
                className={classes.error}
              />
            ) : null}
            {leftAdornment}
            {!error ? rightAdornment : null}
          </InputAdornment>
        ),
        ...InputProps
      }
    : InputProps;

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => onChange && onChange(event.target.value);

  return (
    <MaterialTextField
      {...props}
      required={isRequired}
      helperText={error ? errorText : helperText}
      id={id}
      error={error}
      multiline={isTextArea}
      onChange={handleChange}
      variant={variant === "hybrid" ? "filled" : "outlined"}
      className={classnames(
        classes.root,
        { [classes.leftAdornment]: leftAdornment },
        {
          [classes.textFieldError]: error
        },
        className
      )}
      InputProps={inputProps}
    />
  );
};

export default withFormControl<Props, string>(TextField);
