import React from "react";
import TextField from "@bmi/text-field";
import { types, Type } from "../helpers/fieldTypes";
import styles from "./_InputTextField.module.scss";

type InputTextFieldProps = {
  name?: string;
  label?: string;
  defaultValue?: string;
  type: Type;
};

const InputTextField = ({
  name,
  label = name,
  type,
  defaultValue
}: InputTextFieldProps) => (
  <TextField
    name={name}
    type="number"
    variant="outlined"
    label={label}
    helperText={types[type].helperText}
    defaultValue={defaultValue}
    getValidationError={types[type].validator}
    rightAdornment={types[type].unit}
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

export default InputTextField;
