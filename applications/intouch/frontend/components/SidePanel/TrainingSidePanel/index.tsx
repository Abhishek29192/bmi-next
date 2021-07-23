import React, { useState } from "react";
import Typography from "@bmi/typography";
import { SvgIcon } from "@material-ui/core";
import { Technology } from "@bmi/intouch-api-types";
import { FilterResult } from "../../FilterResult";
import { SidePanel } from "../";
import { TrainingQuery } from "../../../graphql/generated/operations";
import { PitchIcon, FlatIcon, OtherIcon } from "../../icons";

const DEFAULT_FILTER_CRITERIA = "all";

const courseTech: { [K in Technology]: string } = {
  FLAT: "FLAT",
  PITCHED: "PITCHED",
  OTHER: "OTHER"
};

const TECHNOLOGIES_ICONS: {
  [K in Technology]: React.FC<React.SVGProps<SVGSVGElement>>;
} = {
  FLAT: FlatIcon,
  PITCHED: PitchIcon,
  OTHER: OtherIcon
};

const trainingFilters = [
  {
    label: DEFAULT_FILTER_CRITERIA.toLowerCase(),
    attr: DEFAULT_FILTER_CRITERIA,
    isActive: false
  },
  ...Object.keys(courseTech).map((key) => ({
    label: `${courseTech[`${key}`]}`.toLowerCase(),
    attr: courseTech[`${key}`],
    isActive: false
  }))
];

type TrainingSidePanelProps = {
  courseCatalog?: TrainingQuery["courseCatalogues"];
  onCourseSelected?: (courseId: number) => void;
  onFilterChange?: () => void;
};

export const TrainingSidePanel = ({
  courseCatalog,
  onCourseSelected,
  onFilterChange
}: TrainingSidePanelProps) => {
  const [filterCriteria, setFilterCriteria] = useState<string>(
    DEFAULT_FILTER_CRITERIA
  );
  const [searchCriteria, setSearchCriteria] = useState<string>(undefined);
  const { nodes = [] } = courseCatalog || {};

  const trainingFilterClickHandler = ({ attr }) => {
    setFilterCriteria(attr);
    onFilterChange && onFilterChange();
  };

  trainingFilters.forEach(
    (item) => (item.isActive = item.attr === filterCriteria)
  );
  const courses = nodes.filter(
    ({ course: { name, technology } }) =>
      (filterCriteria === DEFAULT_FILTER_CRITERIA ||
        technology === filterCriteria) &&
      (!searchCriteria ||
        name.toLowerCase().includes(searchCriteria.toLowerCase()))
  );

  return (
    <SidePanel
      searchLabel="Search for training"
      filters={trainingFilters}
      filterClick={trainingFilterClickHandler}
      onSearchFilterChange={(filter: string) => {
        setSearchCriteria(filter);
      }}
    >
      {courses.map(
        ({
          course: {
            courseId,
            name,
            technology,
            trainingType,
            courseEnrollments
          }
        }) => {
          return (
            <FilterResult
              label={name}
              key={name}
              onClick={() => {
                onCourseSelected && onCourseSelected(courseId);
              }}
            >
              <Typography style={{ textTransform: "capitalize" }}>
                {trainingType}
              </Typography>
              <Typography style={{ display: "flex", padding: "2px" }}>
                <SvgIcon
                  component={TECHNOLOGIES_ICONS[technology as Technology]}
                />
                {courseEnrollments.nodes[0]?.status}
              </Typography>
            </FilterResult>
          );
        }
      )}
    </SidePanel>
  );
};
