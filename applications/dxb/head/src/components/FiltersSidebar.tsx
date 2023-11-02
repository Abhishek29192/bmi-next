import {
  Accordion,
  AccordionSummaryProps,
  Button,
  Checkbox,
  CheckboxProps,
  Filter as FilterType,
  FilterProps,
  Filters,
  Icon,
  Typography
} from "@bmi-digital/components";
import React, { useMemo, useState } from "react";
import { Box, GlobalStyles, useMediaQuery, useTheme } from "@mui/material";
import { Filter } from "@bmi-digital/components/icon";
import { microCopy } from "@bmi/microcopies";
import { Close } from "@mui/icons-material";
import withGTM from "../utils/google-tag-manager";
import { useSiteContext } from "./Site";
import {
  ClearAllButton,
  MobileFiltersContainer,
  StyledFilterIcon,
  classes,
  Root,
  ShowResultsContainer,
  StyledDrawer,
  ShowResultsButton,
  MobileFiltersHeaderContainer
} from "./styles/FilterSidebarStyles";

export type Props = {
  // NOTE: Not doing FilterProps & { ... } because we're only interested in these specifics
  // Regardless of if FilterProps change
  filters: FilterProps["filters"];
  onFiltersChange: FilterProps["onChange"];
  onClearFilters: () => void;
  numberOfResults?: number;
  disableClearAllBtn?: boolean;
  filtersTitle?: string;
  clearAllBtnLabel?: string;
};

const FiltersSidebar = ({
  filters,
  onFiltersChange,
  onClearFilters,
  numberOfResults,
  disableClearAllBtn,
  ...rest
}: Props) => {
  const { getMicroCopy } = useSiteContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [isOpenMobileFilters, setIsOpenMobileFilters] = useState(false);

  const {
    filtersTitle = getMicroCopy(microCopy.PLP_FILTERS_TITLE),
    clearAllBtnLabel = getMicroCopy(microCopy.PLP_FILTERS_CLEAR_ALL)
  } = rest;

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
        data-testid="open-mobile-filters-btn"
      >
        <StyledFilterIcon source={Filter} />
        {filtersTitle}
      </Button>
      <div data-testid="mobile-filters">
        <MobileFilters
          isOpen={isOpenMobileFilters}
          clearFilters={onClearFilters}
          handleDrawerToggle={handleDrawerToggle}
          filtersComponent={filtersComponent}
          showDocumentCount={Boolean(numberOfResults)}
          resultsNumber={numberOfResults}
          filtersTitle={filtersTitle}
          clearAllBtnLabel={clearAllBtnLabel}
          disableClearAllBtn={Boolean(disableClearAllBtn)}
        />
      </div>
    </>
  );

  const desktopView = (
    <>
      <div className={classes.filterBox} data-testid="filter-sidebar-header">
        <Typography variant="h5" data-testid="filter-sidebar-header-text">
          {filtersTitle}
        </Typography>
        <ClearAllButton
          variant="text"
          onClick={onClearFilters}
          data-testid="filter-sidebar-clear-all-button"
          disabled={disableClearAllBtn}
        >
          {clearAllBtnLabel}
        </ClearAllButton>
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

type MobileFiltersProps = {
  isOpen: boolean;
  handleDrawerToggle: () => void;
  clearFilters: () => void;
  filtersComponent: React.ReactNode;
  resultsNumber?: number;
  showDocumentCount: boolean;
  filtersTitle: string;
  clearAllBtnLabel: string;
  disableClearAllBtn: boolean;
};

const MobileFilters = ({
  isOpen,
  handleDrawerToggle,
  clearFilters,
  filtersComponent,
  resultsNumber,
  showDocumentCount,
  filtersTitle,
  clearAllBtnLabel,
  disableClearAllBtn
}: MobileFiltersProps) => {
  const { getMicroCopy } = useSiteContext();
  return (
    <StyledDrawer
      variant="temporary"
      open={isOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true
      }}
    >
      <>
        {isOpen && (
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
        )}
        <MobileFiltersHeaderContainer>
          <Box display="flex">
            <StyledFilterIcon
              source={Filter}
              className={classes.filterIconTitle}
            />
            <Typography variant="h5">{filtersTitle}</Typography>
          </Box>
          <div>
            <ClearAllButton
              variant="text"
              onClick={clearFilters}
              disabled={disableClearAllBtn}
              data-testid="filters-clear-all-mobile"
            >
              {clearAllBtnLabel}
            </ClearAllButton>
            <Button
              isIconButton
              variant="outlined"
              onClick={handleDrawerToggle}
              data-testid="filters-close-btn"
            >
              <Icon source={Close} />
            </Button>
          </div>
        </MobileFiltersHeaderContainer>
        <MobileFiltersContainer>{filtersComponent}</MobileFiltersContainer>
        <ShowResultsContainer>
          <ShowResultsButton
            variant="contained"
            onClick={handleDrawerToggle}
            data-testid="filters-show-all-results-btn"
          >
            {showDocumentCount
              ? `${getMicroCopy(
                  microCopy.FILTER_SHOW_WORLD_BTN
                )} ${resultsNumber} ${getMicroCopy(
                  microCopy.FILTER_RESULT_WORLD_BTN
                )}`
              : getMicroCopy(microCopy.FILTER_SHOW_ALL_RESULT_BTN)}
          </ShowResultsButton>
        </ShowResultsContainer>
      </>
    </StyledDrawer>
  );
};

export default FiltersSidebar;
