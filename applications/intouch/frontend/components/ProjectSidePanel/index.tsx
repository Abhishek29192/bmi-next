import React from "react";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { SvgIcon } from "@material-ui/core";
import { Technology } from "@bmi/intouch-api-types";
import { FilterResult } from "../FilterResult";
import { SidePanel } from "../SidePanel";
import { GetProjectsQuery } from "../../graphql/generated/operations";
import { PitchIcon, FlatIcon, OtherIcon } from "../icons";

const projectFilters = [
  { label: "Not started", attr: "notStarted" },
  { label: "In progress", attr: "inProgress" },
  { label: "Completed", attr: "completed" },
  { label: "Flat", attr: "flat" },
  { label: "Pitched", attr: "pitched" }
];

const technologyIcon: {
  [K in Technology]: React.FC<React.SVGProps<SVGSVGElement>>;
} = {
  FLAT: FlatIcon,
  PITCHED: PitchIcon,
  OTHER: OtherIcon
};

export enum ProjectStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  COMPLETED = "Completed"
}

type ProjectSidePanelProps = {
  projects: GetProjectsQuery["projects"];
  onProjectSelected?: (projectId: number) => void;
};
export const ProjectSidePanel = ({
  projects,
  onProjectSelected
}: ProjectSidePanelProps) => {
  const { t } = useTranslation("project-page");

  const { nodes = [] } = projects || {};

  const getProjectStatus = (startDate, endDate) => {
    if (!startDate && !endDate) return ProjectStatus.NOT_STARTED;
    else if (startDate && !endDate) return ProjectStatus.IN_PROGRESS;
    else return ProjectStatus.COMPLETED;
  };

  return (
    <SidePanel searchLabel="Search for a project" filters={projectFilters}>
      {nodes.map(
        ({ id, name, siteAddress, technology, startDate, endDate }) => (
          <FilterResult
            label={name}
            key={id}
            onClick={() => {
              onProjectSelected && onProjectSelected(id);
            }}
          >
            <Typography>
              {siteAddress?.town},{siteAddress?.postcode}
            </Typography>
            <Typography style={{ display: "flex" }}>
              <SvgIcon component={technologyIcon[technology as Technology]} />
              {t(getProjectStatus(startDate, endDate))}
            </Typography>
          </FilterResult>
        )
      )}
    </SidePanel>
  );
};
