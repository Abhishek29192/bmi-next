import {
  checkboxStyles,
  Typography,
  withFormControl
} from "@bmi-digital/components";
import {
  Checkbox as MuiCheckbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormHelperText
} from "@material-ui/core";
import React, { useState } from "react";
import { convertMarkdownLinksToAnchorLinks } from "./FormSection";
import styles from "./styles/CheckboxGroup.module.scss";

type Props = CheckboxProps & {
  options?: string;
  onChange?: (value: string[]) => void;
  groupName: React.ReactNode;
  isRequired: boolean;
  error?: boolean;
  errorText?: string;
};

const CheckboxGroup = ({
  options,
  groupName,
  isRequired,
  onChange,
  error,
  errorText,
  disabled,
  ...props
}: Props) => {
  const [selected, setSelected] = useState([]);
  const handleOnChange = (v: React.ChangeEvent<Record<string, unknown>>) => {
    let val = [];
    if (v.target.checked) {
      val = [...selected, v.target.name];
    } else {
      val = selected.filter((el) => el !== v.target.name);
    }
    setSelected(val);
    onChange && onChange(val as string[]);
  };
  const classes = checkboxStyles();
  return (
    <FormControl error={!!error}>
      <Typography className={styles["CheckboxGroup-heading"]}>
        {isRequired && <span>*</span>}
        {groupName}
      </Typography>
      {options.split(/, |,/).map((option: string, $i: number) => (
        <FormControl
          key={$i}
          disabled={disabled}
          className={classes.root}
          fullWidth
        >
          <FormControlLabel
            control={<MuiCheckbox color="primary" {...props} name={option} />}
            label={convertMarkdownLinksToAnchorLinks(option)}
            onChange={handleOnChange}
          />
        </FormControl>
      ))}
      {error ? <FormHelperText>{errorText}</FormHelperText> : null}
    </FormControl>
  );
};

const FormCheckboxGroup = withFormControl<Props, string>(CheckboxGroup);
const ControlledCheckboxGroup = Object.defineProperty(
  FormCheckboxGroup,
  "Item",
  {
    value: CheckboxGroup,
    writable: false
  }
) as typeof FormCheckboxGroup & { Item: typeof CheckboxGroup };

export default ControlledCheckboxGroup;
