import React from "react";
import { Checkbox as MuiCheckbox, CheckboxProps } from "@material-ui/core";
import { FormControlLabel } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { FormHelperText } from "@material-ui/core";
import withFormControl from "../form/withFormControl";
import styles from "./Checkbox.module.scss";

export type Props = CheckboxProps & {
  label?: React.ReactNode;
  error?: boolean;
  errorText?: string;
  onChange: (value: boolean) => void;
  isRequired?: boolean;
};

const decorateWithAsterisk = (
  component: JSX.Element,
  isRequired: boolean | undefined
) => {
  if (isRequired) {
    return (
      <div className={styles["Checkbox--asterisks_decorator"]}>{component}</div>
    );
  }
  return component;
};

export const Checkbox = ({
  label,
  error,
  disabled,
  errorText,
  onChange,
  isRequired,
  ...props
}: Props) => {
  const handleChange = (event: React.ChangeEvent<Record<string, unknown>>) => {
    const target = event.target;
    !disabled && "checked" in target && onChange(target.checked as boolean);
  };

  const checkbox = (
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
  return decorateWithAsterisk(checkbox, isRequired);
};

export default withFormControl<Props, boolean>(Checkbox);
