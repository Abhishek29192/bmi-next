import React, { useState } from "react";
import Typography from "@bmi/typography";
import { SvgIcon } from "@material-ui/core";
import { FilterResult } from "../../FilterResult";
import { SidePanel } from "../";
import { TrainingQuery } from "../../../graphql/generated/operations";
import PitchIcon from "./images/roofPitch.svg";
import FlatIcon from "./images/roofFlat.svg";
import OtherIcon from "./images/roofOther.svg";

const DEFAULT_FILTER_CRITERIA = "all";

enum COURSE_TECHNOLOGIES {
  FLAT = "FLAT",
  PITCHED = "PITCHED",
  OTHER = "OTHER"
}

const TECHNOLOGIES_ICONS: {
  [K in COURSE_TECHNOLOGIES]: React.FC<React.SVGProps<SVGSVGElement>>;
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
  ...Object.keys(COURSE_TECHNOLOGIES).map((key) => ({
    label: `${COURSE_TECHNOLOGIES[`${key}`]}`.toLowerCase(),
    attr: COURSE_TECHNOLOGIES[`${key}`],
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
                  component={
                    TECHNOLOGIES_ICONS[technology as COURSE_TECHNOLOGIES]
                  }
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
