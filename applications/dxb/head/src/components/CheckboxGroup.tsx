import { withFormControl } from "@bmi-digital/components/form";
import MuiCheckbox, { CheckboxProps } from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import React, { useState } from "react";
import { convertMarkdownLinksToAnchorLinks } from "./FormSection";
import { CheckboxGroupComponent } from "./styles/CheckboxGroupStyles";

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
      <CheckboxGroupComponent>
        {isRequired && <span>*</span>}
        {groupName}
      </CheckboxGroupComponent>
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
