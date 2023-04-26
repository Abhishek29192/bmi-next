import { Typography, withFormControl } from "@bmi-digital/components";
import {
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox as MuiCheckbox
} from "@mui/material";
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
  const [selected, setSelected] = useState<string[]>([]);
  const handleOnChange = (v: React.SyntheticEvent) => {
    let val = [];
    if ((v.target as HTMLInputElement).checked) {
      val = [...selected, (v.target as HTMLInputElement).name];
    } else {
      val = selected.filter((el) => el !== (v.target as HTMLInputElement).name);
    }
    setSelected(val);
    onChange && onChange(val);
  };
  return (
    <FormControl error={!!error}>
      <Typography className={styles["CheckboxGroup-heading"]}>
        {isRequired && <span>*</span>}
        {groupName}
      </Typography>
      {options?.split(/, |,/).map((option: string, $i: number) => (
        <FormControl key={$i} disabled={disabled} fullWidth>
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
