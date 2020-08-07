import React from "react";
import MuiCheckbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
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
    onChange(event.target.checked);
  };
  return (
    <FormControl error={!!error} disabled={disabled}>
      <FormControlLabel
        control={<MuiCheckbox color="primary" {...props} />}
        label={label}
        onChange={handleChange}
      />
      {error ? <FormHelperText>{errorText}</FormHelperText> : null}
    </FormControl>
  );
};

export default withFormControl(Checkbox);
