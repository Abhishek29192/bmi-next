import {
  Accordion,
  AccordionSummaryProps,
  Button,
  Checkbox,
  CheckboxProps,
  DownloadListContext,
  Filter,
  FilterProps,
  Filters,
  Typography
} from "@bmi/components";
import React from "react";
import { useSiteContext } from "../../../components/Site";
import filterStyles from "../../../components/styles/Filters.module.scss";
import withGTM from "../../../utils/google-tag-manager";

export type Props = {
  filters: Filter[];
  handleFiltersChange: FilterProps["onChange"];
  clearFilters: () => void;
};

const GTMCheckbox = withGTM<CheckboxProps>(Checkbox, {
  label: "label"
});
const GTMAccordionSummary = withGTM<AccordionSummaryProps>(Accordion.Summary);

const DocumentLibraryFilter = ({
  filters,
  handleFiltersChange,
  clearFilters
}: Props) => {
  const { getMicroCopy } = useSiteContext();

  return (
    <div className={filterStyles["scroll-bar"]}>
      <div className={filterStyles["box"]}>
        <Typography variant="h5">
          {getMicroCopy("documentLibrary.filters.title")}
        </Typography>
        <Button variant="text" onClick={clearFilters}>
          {getMicroCopy("documentLibrary.filters.clearAll")}
        </Button>
      </div>
      <DownloadListContext.Consumer>
        {({ resetList }) => (
          <Filters
            filters={filters}
            onChange={handleFiltersChange}
            checkboxComponent={(props: CheckboxProps) => (
              <GTMCheckbox
                gtm={{
                  id: "filter2",
                  action: "Selector – Filter"
                }}
                {...props}
              />
            )}
            accordionSummaryComponent={(props: AccordionSummaryProps) => (
              <GTMAccordionSummary
                gtm={{
                  id: "filter1",
                  label: (props.children as JSX.Element)?.props!.children || "",
                  action: "Selector – Filter"
                }}
                {...props}
              />
            )}
          />
        )}
      </DownloadListContext.Consumer>
    </div>
  );
};

export default DocumentLibraryFilter;
