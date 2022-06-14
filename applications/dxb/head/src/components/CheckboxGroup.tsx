import React, { useState } from "react";
import { Typography } from "@bmi/components";
import { withFormControl, checkboxStyles } from "@bmi/components";
import {
  Checkbox as MuiCheckbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormHelperText
} from "@material-ui/core";
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
          className={checkboxStyles["Checkbox"]}
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
