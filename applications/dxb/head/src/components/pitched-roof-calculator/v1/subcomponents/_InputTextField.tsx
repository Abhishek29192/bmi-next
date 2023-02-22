import { TextField } from "@bmi-digital/components";
import React, { useContext } from "react";
import { getFieldTypes, Type } from "../../helpers/fieldTypes";
import { getMicroCopy, MicroCopyContext } from "../../helpers/microCopy";
import styles from "./_InputTextField.module.scss";

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
  const copy = useContext(MicroCopyContext);
  // eslint-disable-next-line security/detect-object-injection
  const { helperText, unit, validator } = getFieldTypes((path, placeholders) =>
    getMicroCopy(copy, "validation.errors." + path, placeholders)
  )[type];

  return (
    <TextField
      name={name}
      type="number"
      variant="outlined"
      label={label}
      helperText={helperText}
      defaultValue={defaultValue}
      getValidationError={validator}
      rightAdornment={unit}
      fullWidth
      className={styles["InputTextField"]}
      InputProps={{
        className: styles["textField"]
      }}
      inputProps={{
        className: styles["numberInput"],
        step: "any"
      }}
    />
  );
};

export default InputTextField;
