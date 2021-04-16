import React, { useContext } from "react";
import Accordion, { AccordionSummaryProps } from "@bmi/accordion";
import Button from "@bmi/button";
import Checkbox, { Props as CheckboxProps } from "@bmi/checkbox";
import Typography from "@bmi/typography";
import Filters, { Props as FilterProps } from "@bmi/filters";
import PerfectScrollbar from "@bmi/perfect-scrollbar";
import withGTM from "../utils/google-tag-manager";
import { SiteContext } from "./Site";

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
  const { getMicroCopy } = useContext(SiteContext);

  const GTMCheckbox = withGTM<CheckboxProps>(Checkbox);
  const GTMAccordionSummary = withGTM<AccordionSummaryProps>(Accordion.Summary);

  return (
    <PerfectScrollbar
      style={{
        position: "sticky",
        top: "180px",
        maxHeight: "calc(100vh - 200px)",
        overflow: "hidden"
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
          {getMicroCopy("plp.filters.title")}
        </Typography>
        <Button variant="text" onClick={onClearFilters}>
          {getMicroCopy("plp.filters.clearAll")}
        </Button>
      </div>
      <Filters
        filters={filters}
        onChange={onFiltersChange}
        checkboxComponent={(props: CheckboxProps) => {
          const label: string | React.ReactNode = props.label;

          return (
            <GTMCheckbox
              gtm={{
                id: "filter2",
                // @ts-ignore
                label: label.props ? label.props?.children[1] : label,
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
              // @ts-ignore
              label: props.children?.props?.children,
              action: "Selector – Filter"
            }}
            {...props}
          />
        )}
      />
    </PerfectScrollbar>
  );
};

export default FiltersSidebar;
