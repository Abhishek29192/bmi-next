import React from "react";
import Search from "@material-ui/icons/Search";
import TextField from "@bmi-digital/components/text-field";

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
