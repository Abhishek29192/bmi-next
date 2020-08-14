import MuiSelect, { SelectProps } from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import styles from "./Select.module.scss";
import InputLabel from "@material-ui/core/InputLabel";
import { FormControl } from "@material-ui/core";
import classnames from "classnames";
import { withFormControl } from "@bmi/form";
import FormHelperText from "@material-ui/core/FormHelperText";

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
  const handleChange = (event) => {
    onChange(event.target.value);
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

export default withFormControl<Props>(Select);
