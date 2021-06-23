import React from "react";
import Typography from "@bmi/typography";
import { FilterResult } from "../../FilterResult";
import { SidePanel } from "../";

const projectFilters = [
  { label: "Not started", attr: "notStarted" },
  { label: "In progress", attr: "inProgress" },
  { label: "Completed", attr: "completed" },
  { label: "Flat", attr: "flat" },
  { label: "Pitched", attr: "pitched" }
];

type ProjectSidePanelProps = {
  projectDetails: { id: number; name: string; company: string }[];
  onProjectSelected?: (projectId: number) => void;
};
export const ProjectSidePanel = ({
  projectDetails,
  onProjectSelected
}: ProjectSidePanelProps) => {
  return (
    <SidePanel searchLabel="Search for a project" filters={projectFilters}>
      {projectDetails.map((project) => (
        <FilterResult
          label={project.name}
          key={project.name}
          onClick={() => {
            onProjectSelected && onProjectSelected(project.id);
          }}
        >
          <Typography>{project.company}</Typography>
        </FilterResult>
      ))}
    </SidePanel>
  );
};
