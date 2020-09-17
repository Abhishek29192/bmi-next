import React from "react";
import MuiCheckbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import styles from "./Checkbox.module.scss";
import { withFormControl } from "@bmi/form";

export type Props = CheckboxProps & {
  label?: React.ReactNode;
  error?: boolean;
  errorText?: string;
  onChange: (value: boolean) => void;
};

const Checkbox = ({
  label,
  error,
  disabled,
  errorText,
  onChange,
  ...props
}: Props) => {
  const handleChange = (event) => {
    !disabled && onChange(event.target.checked);
  };
  return (
    <FormControl
      error={!!error}
      disabled={disabled}
      className={styles["Checkbox"]}
    >
      <FormControlLabel
        control={<MuiCheckbox color="primary" {...props} />}
        label={label}
        onChange={handleChange}
      />
      {error ? <FormHelperText>{errorText}</FormHelperText> : null}
    </FormControl>
  );
};

export default withFormControl<Props>(Checkbox);
