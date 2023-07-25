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
import React, { useMemo, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { Filter } from "@bmi-digital/components/icon";
import { Filter as FilterType } from "@bmi-digital/components/dist/filters/Filters";
import { microCopy } from "../constants/microCopies";
import withGTM from "../utils/google-tag-manager";
import MobileFilters from "../templates/documentLibrary/components/MobileFilterSection";
import { useSiteContext } from "./Site";
import { StyledFilterIcon, classes, Root } from "./styles/FilterMobileStyles";

type Props = {
  // NOTE: Not doing FilterProps & { ... } because we're only interested in these specifics
  // Regardless of if FilterProps change
  filters: FilterProps["filters"];
  onFiltersChange: FilterProps["onChange"];
  onClearFilters: () => void;
  numberOfResults?: number;
};

const FiltersSidebar = ({
  filters,
  onFiltersChange,
  onClearFilters,
  numberOfResults
}: Props) => {
  const { getMicroCopy } = useSiteContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [isOpenMobileFilters, setIsOpenMobileFilters] = useState(false);
  const handleDrawerToggle = () => {
    setIsOpenMobileFilters(!isOpenMobileFilters);
  };
  const GTMCheckbox = withGTM<CheckboxProps>(Checkbox);
  const GTMAccordionSummary = withGTM<AccordionSummaryProps>(
    Accordion.Summary,
    {
      label: "aria-label"
    }
  );

  const memoizedFilters = useMemo(
    () =>
      filters.map((filter: FilterType) => ({
        ...filter,
        defaultExpanded: Boolean(isMobile)
      })),
    [filters, isMobile]
  );
  const filtersComponent = (
    <Filters
      filters={memoizedFilters}
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
                label &&
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
      data-testid="filter-sidebar-filters"
    />
  );

  const mobileView = (
    <>
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
          clearFilters={onClearFilters}
          handleDrawerToggle={handleDrawerToggle}
          filtersComponent={filtersComponent}
          showDocumentCount={!!numberOfResults}
          resultsNumber={numberOfResults}
        />
      </div>
    </>
  );

  const desktopView = (
    <>
      <div className={classes.filterBox} data-testid="filter-sidebar-header">
        <Typography variant="h5" data-testid="filter-sidebar-header-text">
          {getMicroCopy(microCopy.PLP_FILTERS_TITLE)}
        </Typography>
        <Button
          variant="text"
          onClick={onClearFilters}
          data-testid="filter-sidebar-clear-all-button"
        >
          {getMicroCopy(microCopy.PLP_FILTERS_CLEAR_ALL)}
        </Button>
      </div>
      {filtersComponent}
    </>
  );

  return (
    <Root data-testid="filter-sidebar-main">
      {isMobile ? mobileView : desktopView}
    </Root>
  );
};

export default FiltersSidebar;
