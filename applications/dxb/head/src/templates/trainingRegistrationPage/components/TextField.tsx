import DefaultTextField from "@bmi-digital/components/text-field";
import { microCopy } from "@bmi/microcopies";
import React, { useMemo, useState } from "react";
import { useSiteContext } from "../../../components/Site";
import { StyledCancelIcon, StyledIconButton } from "./TextFieldStyles";
import type { TextFieldProps } from "@bmi-digital/components/text-field";
import type { WithFormControlProps } from "@bmi-digital/components/form";

export type Props = TextFieldProps & WithFormControlProps<string>;

const TextField = ({ defaultValue = "", isTextArea, ...props }: Props) => {
  const { getMicroCopy } = useSiteContext();
  const [isActive, setIsActive] = useState(false);
  const [value, setValue] = useState<string>(defaultValue);

  const rightAdornment = useMemo(() => {
    if (!isActive && value && !isTextArea) {
      return (
        <StyledIconButton
          variant="text"
          data-testid="reset-input-value-icon-button"
          onClick={() => setValue(defaultValue)}
          accessibilityLabel={getMicroCopy(microCopy.CLEAR_LABEL)}
        >
          <StyledCancelIcon />
        </StyledIconButton>
      );
    }
  }, [value, isActive, defaultValue, isTextArea, getMicroCopy]);

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
