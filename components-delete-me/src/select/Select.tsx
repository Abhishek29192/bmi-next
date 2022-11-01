import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectProps
} from "@material-ui/core";
import classnames from "classnames";
import React from "react";
import withFormControl from "../form/withFormControl";
import { useStyles } from "./styles";

export type Props = Omit<SelectProps, "variant"> & {
  variant?: "outlined" | "hybrid";
  onChange: (value: string) => void;
  errorText?: string;
  helperText?: string;
  isRequired?: boolean;
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
  isRequired,
  ...props
}: Props) => {
  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }>
  ) => {
    onChange(event.target.value as string);
  };
  const classes = useStyles();
  return (
    <FormControl
      error={error}
      disabled={disabled}
      fullWidth
      variant={variant === "hybrid" ? "filled" : "outlined"}
      required={isRequired}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect
        labelId={labelId}
        label={label}
        className={classnames(classes.root, className)}
        onChange={handleChange}
        {...props}
      />
      <FormHelperText>{error ? errorText : helperText}</FormHelperText>
    </FormControl>
  );
};

export { MenuItem };

export default withFormControl<Props, string>(Select);
