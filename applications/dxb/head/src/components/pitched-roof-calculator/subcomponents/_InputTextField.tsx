import React from "react";
import { useSiteContext } from "../../Site";
import { getFieldTypes, Type } from "../helpers/fieldTypes";
import { classes, Root } from "./_InputTextField.styles";

type InputTextFieldProps = {
  name: string;
  label?: string;
  defaultValue?: string;
  type: Type;
};

const InputTextField = ({
  name,
  label = name,
  type,
  defaultValue = ""
}: InputTextFieldProps) => {
  const { getMicroCopy } = useSiteContext();
  // eslint-disable-next-line security/detect-object-injection
  const { helperText, unit, validator } = getFieldTypes((path, placeholders) =>
    getMicroCopy(`validation.errors.${path}`, placeholders)
  )[type];

  return (
    <Root
      name={name}
      type="number"
      variant="outlined"
      label={label}
      helperText={helperText}
      defaultValue={defaultValue}
      getValidationError={validator}
      rightAdornment={unit}
      fullWidth
      InputProps={{
        className: classes.textField
      }}
      inputProps={{
        className: classes.numberInput,
        step: "any"
      }}
    />
  );
};

export default InputTextField;
