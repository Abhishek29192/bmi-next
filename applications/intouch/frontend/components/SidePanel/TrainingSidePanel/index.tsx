import React from "react";
import Typography from "@bmi/typography";
import { SvgIcon } from "@material-ui/core";
import { FilterResult } from "../../FilterResult";
import { SidePanel } from "../";
import { TrainingQuery } from "../../../graphql/generated/operations";
import RoofPitchIcon from "./images/roofPitch.svg";
import RoofFlatIcon from "./images/roofFlat.svg";

const trainingFilters = [
  { label: "All", attr: "all", isActive: false },
  { label: "Flat", attr: "FLAT", isActive: false },
  { label: "Pitched", attr: "PITCHED", isActive: false }
];

type TrainingSidePanelProps = {
  courseCatalog?: TrainingQuery["courseCatalogues"];
};

export const TrainingSidePanel = ({
  courseCatalog
}: TrainingSidePanelProps) => {
  const { nodes = [] } = courseCatalog || {};

  return (
    <SidePanel searchLabel="Search for training" filters={trainingFilters}>
      {nodes.map(({ course }) => {
        const roofIcon =
          course.technology === "PITCHED" ? RoofPitchIcon : RoofFlatIcon;

        return (
          <FilterResult label={course.name} key={course.name}>
            <Typography>{course.trainingType}</Typography>
            <Typography style={{ display: "flex", padding: "2px" }}>
              <SvgIcon component={roofIcon} />

              {course.courseEnrollments.nodes.map((node) => node.status)[0] ||
                "Catalog"}
            </Typography>
          </FilterResult>
        );
      })}
    </SidePanel>
  );
};
