import React from "react";
import { Button, Typography, Icon } from "@bmi-digital/components";
import { Close } from "@mui/icons-material";
import { Filter } from "@bmi-digital/components/icon";
import { useSiteContext } from "../../../components/Site";
import { StyledDrawer } from "./FilterSectionStyles";

type MobileFiltersProps = {
  isOpenMobileFilters: boolean;
  handleDrawerToggle: () => void;
  clearFilters: () => void;
  filtersComponent: React.ReactNode;
  resultsNumber?: number;
  showDocumentCount: boolean;
};

const MobileFilters = ({
  isOpenMobileFilters,
  handleDrawerToggle,
  clearFilters,
  filtersComponent,
  resultsNumber,
  showDocumentCount
}: MobileFiltersProps): JSX.Element => {
  const { getMicroCopy } = useSiteContext();
  return (
    <StyledDrawer
      variant="temporary"
      open={isOpenMobileFilters}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true
      }}
    >
      <>
        <div className={"top"}>
          <div className={"top-box"}>
            <Icon source={Filter} />
            <Typography variant="h5">
              {getMicroCopy("documentLibrary.filters.title")}
            </Typography>
          </div>
          <Button
            variant="text"
            onClick={clearFilters}
            data-testid="filters-clear-all-mobile"
          >
            {getMicroCopy("documentLibrary.filters.clearAll")}
          </Button>
          <Button
            onClick={handleDrawerToggle}
            variant="text"
            className={"top-box-close"}
          >
            <Icon source={Close} />
          </Button>
        </div>
        <div className={"filterContainer"}>{filtersComponent}</div>
        <Button
          className={"showBtn"}
          variant="contained"
          onClick={handleDrawerToggle}
          data-testid="filters-show-all-results-btn"
        >
          {showDocumentCount
            ? `${getMicroCopy(
                "filterLabels.Show.World.Btn"
              )} ${resultsNumber} ${getMicroCopy(
                "filterLabels.Result.World.Btn"
              )}`
            : getMicroCopy("filterLabels.Show.All.Result.Btn")}
        </Button>
      </>
    </StyledDrawer>
  );
};
export default MobileFilters;
