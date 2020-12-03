import Button from "@bmi/button";
import { InputValue } from "@bmi/form";
import Icon from "@bmi/icon";
import InputGroup from "@bmi/input-group";
import TextField from "@bmi/text-field";
import { Search as SearchIcon } from "@material-ui/icons";
import React from "react";

type Props = {
  defaultValue?: InputValue;
  label?: string;
  onChange?: (value: InputValue) => void;
  placeholder?: string;
  value?: InputValue;
};

const Search = ({
  defaultValue,
  label = "Search",
  onChange,
  placeholder = "Search BMI...",
  value
}: Props) => {
  return (
    <InputGroup
      button={
        <Button accessibilityLabel={label} isIconButton>
          <Icon source={SearchIcon} />
        </Button>
      }
      input={
        <TextField
          defaultValue={defaultValue}
          label={placeholder}
          name="search"
          onChange={onChange}
          value={value}
          variant="hybrid"
        />
      }
      lockBreakpoint="xs"
    />
  );
};

export default Search;
