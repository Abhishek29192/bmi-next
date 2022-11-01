import { TextField } from "@bmi-digital/components";
import Search from "@material-ui/icons/Search";
import React from "react";

export type FilterInputProps = {
  label?: string;
  onChange?: (value: string) => void;
};

export const FilterInput = ({ label, onChange }: FilterInputProps) => {
  const handleOnChange = (newValue: string) => {
    onChange && onChange(newValue);
  };
  return (
    <nav>
      <TextField
        id="filter"
        name="filter"
        label={label}
        variant="outlined"
        fullWidth
        leftAdornment={<Search />}
        onChange={handleOnChange}
      />
    </nav>
  );
};
