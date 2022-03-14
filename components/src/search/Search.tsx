import { Cancel, Search as SearchIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import DefaultButton from "../button/Button";
import Form, { Props as FormProps } from "../form/Form";
import { InputValue } from "../form/withFormControl";
import Icon from "../icon";
import InputGroup from "../input-group/InputGroup";
import TextField from "../text-field/TextField";
import { useStyles } from "./styles";

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
  const classes = useStyles();
  const [value, setValue] = useState<string>(valueProp || defaultValue || "");
  const Button = buttonComponent || DefaultButton;

  const handleOnChange = (newValue: string) => {
    setValue(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  const clearSearch = () => handleOnChange("");

  useEffect(() => {
    setValue(valueProp || "");
  }, [valueProp]);

  return (
    <Form className={classes.root} {...formProps}>
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
                  <Icon className={classes.clearIcon} source={Cancel} />
                </Button>
              )
            }
          />
        }
        lockBreakpoint="xs"
      />
      {helperText && <p className={classes.helperText}>{helperText}</p>}
    </Form>
  );
};

export default Search;
