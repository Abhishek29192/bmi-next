import React from "react";
import MuiCheckbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

type Props = CheckboxProps & {
  label?: React.ReactNode;
  error?: string;
};

const Checkbox = ({ label, error, disabled, ...props }: Props) => {
  return (
    <FormControl error={!!error} disabled={disabled}>
      <FormControlLabel
        control={<MuiCheckbox color="primary" {...props} />}
        label={label}
      />
      {error ? <FormHelperText>{error}</FormHelperText> : null}
    </FormControl>
  );
};

export default Checkbox;
