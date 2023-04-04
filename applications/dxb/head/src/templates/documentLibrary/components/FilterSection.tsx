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
  Typography,
  Icon
} from "@bmi-digital/components";
import { Filter } from "@bmi-digital/components/icon";
import React, { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSiteContext } from "../../../components/Site";
import withGTM from "../../../utils/google-tag-manager";
import { Root, classes } from "./FilterSectionStyles";
import MobileFilters from "./MobileFilterSection";

export type Props = {
  filters: FilterType[];
  handleFiltersChange: FilterProps["onChange"];
  clearFilters: () => void;
  documentsCount?: number;
};

const GTMCheckbox = withGTM<CheckboxProps>(Checkbox, {
  label: "label"
});
const GTMAccordionSummary = withGTM<AccordionSummaryProps>(Accordion.Summary);

const StyledFilterIcon = styled(Icon)(({ theme }) => ({
  width: "24px",
  marginRight: "12px",
  path: {
    fill: theme.colours.inter
  },
  ellipse: {
    fill: theme.colours.inter
  },
  circle: {
    fill: theme.colours.inter
  }
}));

const DocumentLibraryFilter = ({
  filters,
  handleFiltersChange,
  clearFilters,
  documentsCount
}: Props) => {
  const { getMicroCopy } = useSiteContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [isOpenMobileFilters, setIsOpenMobileFilters] = useState(false);
  const handleDrawerToggle = () => {
    setIsOpenMobileFilters(!isOpenMobileFilters);
  };
  filters = filters.map((filter: FilterType) => ({
    ...filter,
    defaultExpanded: Boolean(isMobile)
  }));
  const filtersComponent = (
    <DownloadListContext.Consumer>
      {() => (
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

  return (
    <Root data-testid="document-library-filters">
      <div className={classes.filterBox}>
        {isMobile ? (
          <Button
            variant="opaqueOutlined"
            onClick={handleDrawerToggle}
            className={classes.filterBtn}
            data-testid="filters-mobile-btn"
          >
            <StyledFilterIcon source={Filter} />
            {getMicroCopy("documentLibrary.filters.title")}
          </Button>
        ) : (
          <>
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
          </>
        )}
      </div>
      <>
        {isMobile ? (
          <div data-testid="mobile-filters">
            <MobileFilters
              isOpenMobileFilters={isOpenMobileFilters}
              clearFilters={clearFilters}
              handleDrawerToggle={handleDrawerToggle}
              filtersComponent={filtersComponent}
              documentsCount={documentsCount}
            />
          </div>
        ) : (
          filtersComponent
        )}
      </>
    </Root>
  );
};

export default DocumentLibraryFilter;
