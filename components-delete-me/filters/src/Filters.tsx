import React, { useContext } from "react";
import DefaultCheckbox from "@bmi-digital/components/checkbox";
import Typography from "@bmi-digital/components/typography";
import {
  getMicroCopy,
  MicroCopyContext
} from "@bmi-digital/components/micro-copy";
import Accordion from "@bmi-digital/components/accordion";
import styles from "./Filters.module.scss";

type FilterOption = {
  label: React.ReactNode;
  value: string;
  isDisabled?: boolean;
};

export type Filter = {
  label: string;
  name: string;
  value?: ReadonlyArray<string>;
  options: ReadonlyArray<FilterOption>;
};

export type Props = {
  filters: ReadonlyArray<Filter>;
  onChange?: (filterName: string, filterValue: string, value: boolean) => void;
  checkboxComponent?: React.ComponentType<any>; // TODO
  accordionSummaryComponent?: React.ComponentType<any>; // TODO
};

const Filters = ({
  filters,
  onChange,
  checkboxComponent: Checkbox = DefaultCheckbox,
  accordionSummaryComponent: AccordionSummary = Accordion.Summary
}: Props) => {
  const copy = useContext(MicroCopyContext);

  const handleCheckboxChange: Props["onChange"] = (...args) => {
    onChange && onChange(...args);
  };

  return (
    <div className={styles["Filters"]}>
      <Accordion noInnerPadding>
        {filters.map((filter) => {
          const filterOptions = filter.options.map(
            ({ value, label, isDisabled }) => {
              const isChecked = (filter.value || []).includes(value);
              return {
                value,
                label,
                checked: isChecked,
                isDisabled
              };
            }
          );

          const summaryLabel = getMicroCopy(
            copy,
            filter.label || filter.name,
            {},
            !filter.label
          );

          return (
            <Accordion.Item key={filter.name}>
              <AccordionSummary aria-label={summaryLabel}>
                <Typography variant="h6">{summaryLabel}</Typography>
              </AccordionSummary>
              <Accordion.Details noInnerPadding={true}>
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
