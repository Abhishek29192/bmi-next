import MuiSelect, { SelectProps } from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import styles from "./Select.module.scss";
import InputLabel from "@material-ui/core/InputLabel";
import { FormControl } from "@material-ui/core";
import classnames from "classnames";

type Props = Omit<SelectProps, "variant"> & {
  variant?: "outlined" | "hybrid";
};

const Select = ({
  variant,
  label,
  labelId,
  error,
  disabled,
  className,
  ...props
}: Props) => {
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
        {...props}
      />
    </FormControl>
  );
};

Select.Item = MenuItem;

export default Select;
