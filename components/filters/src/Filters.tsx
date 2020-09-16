import React from "react";
import Checkbox from "@bmi/checkbox";
import Typography from "@bmi/typography";

type FilterOption = {
  label: string;
  value: string;
  isDisabled?: boolean;
};

type Filter = {
  label: string;
  name: string;
  value?: ReadonlyArray<string>;
  options: ReadonlyArray<FilterOption>;
};

type Props = {
  filters: ReadonlyArray<Filter>;
  onChange?: (filterName: string, filterValue: string, value: boolean) => void;
};

const Filters = ({ filters, onChange }: Props) => {
  const handleCheckboxChange: Props["onChange"] = (...args) => {
    onChange && onChange(...args);
  };

  return (
    <>
      {filters.map((filter) => (
        <div key={filter.name}>
          <Typography variant="h6">{filter.label}</Typography>
          <div>
            {filter.options.map((option) => (
              <div key={option.value}>
                <Checkbox
                  key={option.value}
                  name={option.value}
                  label={option.label}
                  checked={(filter.value || []).includes(option.value)}
                  disabled={option.isDisabled}
                  // TODO: withFormControl overrides onChange type, this should be boolean
                  onChange={(value: boolean) => {
                    handleCheckboxChange(filter.name, option.value, value);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default Filters;
