import {
  Accordion,
  AccordionSummaryProps,
  Button,
  Checkbox,
  CheckboxProps,
  FilterProps,
  Filters,
  Typography
} from "@bmi-digital/components";
import React from "react";
import { microCopy } from "../constants/microCopies";
import withGTM from "../utils/google-tag-manager";
import { useSiteContext } from "./Site";

type Props = {
  // NOTE: Not doing FilterProps & { ... } because we're only interested in these specifics
  // Regardless of if FilterProps change
  filters: FilterProps["filters"];
  onFiltersChange: FilterProps["onChange"];
  onClearFilters: () => void;
};

const FiltersSidebar = ({
  filters,
  onFiltersChange,
  onClearFilters
}: Props) => {
  const { getMicroCopy } = useSiteContext();

  const GTMCheckbox = withGTM<CheckboxProps>(Checkbox);
  const GTMAccordionSummary = withGTM<AccordionSummaryProps>(
    Accordion.Summary,
    {
      label: "aria-label"
    }
  );

  return (
    <div
      style={{
        position: "sticky",
        top: "180px",
        maxHeight: "calc(100vh - 200px)",
        overflow: "hidden auto",
        touchAction: "auto"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 4
        }}
      >
        <Typography variant="h5">
          {getMicroCopy(microCopy.PLP_FILTERS_TITLE)}
        </Typography>
        <Button variant="text" onClick={onClearFilters}>
          {getMicroCopy(microCopy.PLP_FILTERS_CLEAR_ALL)}
        </Button>
      </div>
      <Filters
        filters={filters}
        onChange={onFiltersChange}
        checkboxComponent={(props: CheckboxProps) => {
          const label: React.ReactNode = props.label;

          return (
            <GTMCheckbox
              gtm={{
                id: "filter2",
                label:
                  typeof label !== "string" &&
                  typeof label !== "number" &&
                  typeof label !== "boolean" &&
                  "props" in label &&
                  label.props
                    ? label.props?.children[1]
                    : label,
                action: "Selector – Filter"
              }}
              {...props}
            />
          );
        }}
        accordionSummaryComponent={(props: AccordionSummaryProps) => (
          <GTMAccordionSummary
            gtm={{
              id: "filter1",
              action: "Selector – Filter"
            }}
            {...props}
          />
        )}
      />
    </div>
  );
};

export default FiltersSidebar;
