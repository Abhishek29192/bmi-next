import {
  Checkbox as MuiCheckbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormHelperText
} from "@material-ui/core";
import classnames from "classnames";
import React from "react";
import withFormControl from "../form/withFormControl";
import { useStyles } from "./styles";

export type Props = CheckboxProps & {
  label?: React.ReactNode;
  error?: boolean;
  errorText?: string;
  onChange: (value: boolean) => void;
  isRequired?: boolean;
};

const decorateWithAsterisk = (
  component: JSX.Element,
  classes: ReturnType<typeof useStyles>,
  isRequired?: boolean
) => {
  if (isRequired) {
    return <div className={classes.asterisksDecorator}>{component}</div>;
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
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<Record<string, unknown>>) => {
    const target = event.target;
    !disabled && "checked" in target && onChange(target.checked as boolean);
  };

  const checkbox = (
    <FormControl
      error={!!error}
      disabled={disabled}
      className={classnames(classes.root)}
    >
      <FormControlLabel
        control={<MuiCheckbox color="primary" {...props} />}
        label={label}
        onChange={handleChange}
      />
      {error ? <FormHelperText>{errorText}</FormHelperText> : null}
    </FormControl>
  );
  return decorateWithAsterisk(checkbox, classes, isRequired);
};

export default withFormControl<Props, boolean>(Checkbox);
