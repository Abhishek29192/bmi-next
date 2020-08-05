import React from "react";
import MaterialTextField, { TextFieldProps } from "@material-ui/core/TextField";
import styles from "./TextField.module.scss";
import classnames from "classnames";
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
} & AdornmentProps;

const TextField = ({
  className,
  variant,
  isTextArea,
  error,
  leftAdornment,
  rightAdornment,
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

  return (
    <MaterialTextField
      {...props}
      error={error}
      multiline={isTextArea}
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

export default TextField;
