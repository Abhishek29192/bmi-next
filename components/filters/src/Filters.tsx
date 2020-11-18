import React from "react";
import Checkbox from "@bmi/checkbox";
import Typography from "@bmi/typography";
import Accordion from "@bmi/accordion";
import styles from "./Filters.module.scss";

type FilterOption = {
  label: React.ReactNode;
  value: string;
  isDisabled?: boolean;
};

type Filter = {
  label: React.ReactNode;
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
    <div className={styles["Filters"]}>
      <Accordion noInnerPadding>
        {filters.map((filter) => {
          // NOTE: expand accordion item if any filters are checked
          let anyChecked = false;
          const filterOptions = filter.options.map(
            ({ value, label, isDisabled }) => {
              const isChecked = (filter.value || []).includes(value);
              if (isChecked) {
                anyChecked = true;
              }
              return {
                value,
                label,
                checked: isChecked,
                isDisabled
              };
            }
          );
          return (
            <Accordion.Item key={filter.name} defaultExpanded={anyChecked}>
              <Accordion.Summary>
                <Typography variant="h6">{filter.label}</Typography>
              </Accordion.Summary>
              <Accordion.Details>
                <div className={styles["list"]}>
                  {filterOptions.map((option) => (
                    <div key={option.value}>
                      <Checkbox
                        key={option.value}
                        name={option.value}
                        label={option.label}
                        checked={option.checked}
                        disabled={option.isDisabled}
                        // TODO: withFormControl overrides onChange type, this should be boolean
                        onChange={(value: boolean) => {
                          handleCheckboxChange(
                            filter.name,
                            option.value,
                            value
                          );
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Accordion.Details>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
};

export default Filters;
