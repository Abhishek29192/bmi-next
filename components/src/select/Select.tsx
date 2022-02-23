import { Select as MuiSelect, SelectProps } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import React from "react";
import { InputLabel } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { FormHelperText } from "@material-ui/core";
import classnames from "classnames";
import withFormControl from "../form/withFormControl";
import styles from "./Select.module.scss";

export type Props = Omit<SelectProps, "variant"> & {
  variant?: "outlined" | "hybrid";
  onChange: (value: string) => void;
  errorText?: string;
  helperText?: string;
};

const Select = ({
  variant,
  label,
  labelId,
  error,
  errorText,
  disabled,
  className,
  onChange,
  helperText,
  ...props
}: Props) => {
  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }>
  ) => {
    onChange(event.target.value as string);
  };
  return (
    <FormControl
      error={error}
      disabled={disabled}
      fullWidth
      variant={variant === "hybrid" ? "filled" : "outlined"}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect
        labelId={labelId}
        label={label}
        className={classnames(styles["Select"], className)}
        onChange={handleChange}
        {...props}
      />
      <FormHelperText>{error ? errorText : helperText}</FormHelperText>
    </FormControl>
  );
};

export { MenuItem };

export default withFormControl<Props, string>(Select);
