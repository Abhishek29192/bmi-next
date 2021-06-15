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
};

const DEFAULT_ENROLLMENT_STATUS = "General";

export const TrainingSidePanel = ({
  courseCatalog
}: TrainingSidePanelProps) => {
  const [filterCriteria, setFilterCriteria] = useState(DEFAULT_FILTER_CRITERIA);
  const { nodes = [] } = courseCatalog || {};

  const trainingFilterClickHandler = ({ attr }) => {
    setFilterCriteria(attr);
  };

  trainingFilters.forEach(
    (item) => (item.isActive = item.attr === filterCriteria)
  );
  const courses = nodes.filter(
    ({ course: { technology } }) =>
      filterCriteria === DEFAULT_FILTER_CRITERIA ||
      technology === filterCriteria
  );

  return (
    <SidePanel
      searchLabel="Search for training"
      filters={trainingFilters}
      filterClick={trainingFilterClickHandler}
      showSearchFilter={false}
    >
      {courses.map(
        ({ course: { name, technology, trainingType, courseEnrollments } }) => {
          return (
            <FilterResult label={name} key={name}>
              <Typography style={{ textTransform: "capitalize" }}>
                {trainingType}
              </Typography>
              <Typography style={{ display: "flex", padding: "2px" }}>
                <SvgIcon
                  component={TECHNOLOGIES_ICONS[technology as Technology]}
                />
                {courseEnrollments.nodes.map((node) => node.status)[0] ||
                  DEFAULT_ENROLLMENT_STATUS}
              </Typography>
            </FilterResult>
          );
        }
      )}
    </SidePanel>
  );
};
