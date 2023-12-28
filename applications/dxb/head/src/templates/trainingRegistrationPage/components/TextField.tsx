import React, { useMemo, useState } from "react";
import DefaultTextField from "@bmi-digital/components/text-field";
import { StyledButton, StyledCancelIcon } from "./TextFieldStyles";
import type { TextFieldProps } from "@bmi-digital/components/text-field";
import type { WithFormControlProps } from "@bmi-digital/components/form";

export type Props = TextFieldProps & WithFormControlProps<string>;

const TextField = ({ defaultValue = "", isTextArea, ...props }: Props) => {
  const [isActive, setIsActive] = useState(false);
  const [value, setValue] = useState<string>(defaultValue);

  const rightAdornment = useMemo(() => {
    if (!isActive && value && !isTextArea) {
      return (
        <StyledButton
          isIconButton
          variant="text"
          data-testid="reset-input-value-icon-button"
          onClick={() => setValue(defaultValue)}
        >
          <StyledCancelIcon />
        </StyledButton>
      );
    }
  }, [value, isActive, defaultValue, isTextArea]);

  return (
    <DefaultTextField
      {...props}
      isTextArea={isTextArea}
      onClick={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
      onChange={setValue}
      rightAdornment={rightAdornment}
      defaultValue={defaultValue}
      value={value}
    />
  );
};

export default TextField;
