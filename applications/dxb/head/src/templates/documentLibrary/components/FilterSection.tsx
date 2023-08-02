import {
  Accordion,
  AccordionSummaryProps,
  Button,
  Checkbox,
  CheckboxProps,
  DownloadListContext,
  Filter as FilterType,
  FilterProps,
  Filters,
  Typography
} from "@bmi-digital/components";
import { GlobalStyles } from "@mui/material";
import { Filter } from "@bmi-digital/components/icon";
import React, { useState, useMemo } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { useSiteContext } from "../../../components/Site";
import withGTM from "../../../utils/google-tag-manager";
import { StyledFilterIcon } from "../../../components/styles/FilterMobileStyles";
import { Root, classes } from "./FilterSectionStyles";
import MobileFilters from "./MobileFilterSection";

export type Props = {
  filters: FilterType[];
  handleFiltersChange: FilterProps["onChange"];
  clearFilters: () => void;
  resultsNumber?: number;
  isTechnicalTable: boolean;
};

const GTMCheckbox = withGTM<CheckboxProps>(Checkbox, {
  label: "label"
});
const GTMAccordionSummary = withGTM<AccordionSummaryProps>(Accordion.Summary);

const DocumentLibraryFilter = ({
  filters,
  handleFiltersChange,
  clearFilters,
  resultsNumber,
  isTechnicalTable
}: Props) => {
  const { getMicroCopy } = useSiteContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [isOpenMobileFilters, setIsOpenMobileFilters] = useState(false);
  const handleDrawerToggle = () => {
    setIsOpenMobileFilters(!isOpenMobileFilters);
  };
  const memoizedFilters = useMemo(
    () =>
      filters.map((filter: FilterType) => ({
        ...filter,
        defaultExpanded: Boolean(isMobile)
      })),
    [filters, isMobile]
  );

  const filtersComponent = (
    <DownloadListContext.Consumer>
      {() => (
        <Filters
          filters={memoizedFilters}
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
                label:
                  (props.children as JSX.Element | undefined)?.props.children ||
                  "",
                action: "Selector – Filter"
              }}
              {...props}
            />
          )}
        />
      )}
    </DownloadListContext.Consumer>
  );

  const mobileView = (
    <>
      <GlobalStyles
        styles={{
          html: {
            height: "100vh",
            overflow: "hidden"
          },
          body: {
            paddingRight: "0 !important",
            height: "100vh"
          }
        }}
      />
      <Button
        variant="opaqueOutlined"
        onClick={handleDrawerToggle}
        className={classes.filterBtn}
        data-testid="filters-mobile-btn"
      >
        <StyledFilterIcon source={Filter} />
        {getMicroCopy("documentLibrary.filters.title")}
      </Button>
      <div data-testid="mobile-filters">
        <MobileFilters
          isOpenMobileFilters={isOpenMobileFilters}
          clearFilters={clearFilters}
          handleDrawerToggle={handleDrawerToggle}
          filtersComponent={filtersComponent}
          resultsNumber={resultsNumber}
          showDocumentCount={!isTechnicalTable}
        />
      </div>
    </>
  );

  const desktopView = (
    <>
      <div className={classes.filterBox} data-testid="filter-sidebar-header">
        <Typography variant="h5">
          {getMicroCopy("documentLibrary.filters.title")}
        </Typography>
        <Button
          variant="text"
          onClick={clearFilters}
          data-testid="filters-clear-all"
        >
          {getMicroCopy("documentLibrary.filters.clearAll")}
        </Button>
      </div>
      {filtersComponent}
    </>
  );
  return (
    <Root data-testid="document-library-filters">
      {isMobile ? mobileView : desktopView}
    </Root>
  );
};

export default DocumentLibraryFilter;
