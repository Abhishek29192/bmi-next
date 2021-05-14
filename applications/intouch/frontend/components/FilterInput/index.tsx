import React from "react";
import Search from "@material-ui/icons/Search";
import TextField from "@bmi/text-field";

export type FilterInputProps = {
  label?: string;
};

export const FilterInput = ({ label }: FilterInputProps) => {
  return (
    <nav>
      <TextField
        id="filter"
        name="filter"
        label={label}
        variant="outlined"
        fullWidth
        startAdornment={<Search />}
      />
    </nav>
  );
};
