import Button from "@bmi/button";
import Form, { FormProps, InputValue } from "@bmi/form";
import Icon from "@bmi/icon";
import InputGroup from "@bmi/input-group";
import TextField from "@bmi/text-field";
import { Cancel, Search as SearchIcon } from "@material-ui/icons";
import React, { useState } from "react";
import styles from "./Search.module.scss";

type Props = Omit<FormProps, "children" | "onChange"> & {
  buttonText?: string;
  clearLabel?: string;
  defaultValue?: InputValue;
  helperText?: string;
  label?: string;
  fieldName?: string;
  onChange?: (value: InputValue) => void;
  placeholder?: string;
};

const Search = ({
  buttonText,
  clearLabel = "Clear",
  defaultValue,
  helperText,
  label = "Search",
  fieldName = "q",
  onChange,
  placeholder = "Search BMI...",
  ...formProps
}: Props) => {
  const [value, setValue] = useState<InputValue>(undefined);

  const handleOnChange = (newValue: InputValue) => {
    setValue(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  const clearSearch = () => setValue("");

  return (
    <Form className={styles["Search"]} {...formProps}>
      <InputGroup
        button={
          <Button
            accessibilityLabel={label}
            {...(buttonText && { endIcon: <Icon source={SearchIcon} /> })}
            isIconButton={!buttonText}
            type="submit"
          >
            {buttonText || <Icon source={SearchIcon} />}
          </Button>
        }
        input={
          <TextField
            defaultValue={defaultValue}
            label={placeholder}
            name={fieldName}
            onChange={handleOnChange}
            value={value}
            variant="hybrid"
            rightAdornment={
              value && (
                <Button
                  accessibilityLabel={clearLabel}
                  isIconButton
                  onClick={clearSearch}
                  variant="text"
                >
                  <Icon className={styles["clear-icon"]} source={Cancel} />
                </Button>
              )
            }
          />
        }
        lockBreakpoint="xs"
      />
      {helperText && <p className={styles["helper-text"]}>{helperText}</p>}
    </Form>
  );
};

export default Search;
