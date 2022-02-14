import DefaultButton from "@bmi-digital/components/button";
import Form, { FormProps, InputValue } from "@bmi-digital/components/form";
import Icon from "@bmi-digital/components/icon";
import InputGroup from "@bmi-digital/components/input-group";
import TextField from "@bmi-digital/components/text-field";
import { Cancel, Search as SearchIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import styles from "./Search.module.scss";

export const QUERY_KEY = "q";

type Props = Omit<FormProps, "children" | "onChange"> & {
  buttonText?: string;
  clearLabel?: string;
  defaultValue?: string;
  value?: string;
  buttonComponent?: React.ComponentType<any>; // TODO
  helperText?: string;
  label?: string;
  fieldName?: string;
  onChange?: (value: InputValue) => void;
  placeholder?: string;
  isSubmitDisabled?: boolean;
};

const Search = ({
  buttonText,
  clearLabel = "Clear",
  defaultValue,
  value: valueProp,
  buttonComponent,
  helperText,
  label = "Search",
  fieldName = QUERY_KEY,
  onChange,
  placeholder = "Search BMI...",
  isSubmitDisabled,
  ...formProps
}: Props) => {
  const [value, setValue] = useState<string | undefined>(
    valueProp || defaultValue || undefined
  );
  const Button = buttonComponent || DefaultButton;

  const handleOnChange = (newValue: string) => {
    setValue(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  const clearSearch = () => handleOnChange("");

  useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);

  return (
    <Form className={styles["Search"]} {...formProps}>
      <InputGroup
        button={
          <Button
            disabled={isSubmitDisabled}
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
