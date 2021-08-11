import React from "react";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { SvgIcon } from "@material-ui/core";
import { Technology } from "@bmi/intouch-api-types";
import { FilterResult } from "../FilterResult";
import { SidePanel } from "../SidePanel";
import { GetProjectsQuery } from "../../graphql/generated/operations";
import { getProjectStatus } from "../../lib/utils/project";
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

type ProjectSidePanelProps = {
  projects: GetProjectsQuery["projects"]["nodes"];
  onProjectSelected?: (projectId: number) => void;
};
export const ProjectSidePanel = ({
  projects,
  onProjectSelected
}: ProjectSidePanelProps) => {
  const { t } = useTranslation("project-page");

  return (
    <SidePanel searchLabel="Search for a project" filters={projectFilters}>
      {projects.map(
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
