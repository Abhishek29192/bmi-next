import React, { useState, useMemo } from "react";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { SvgIcon } from "@material-ui/core";
import { Technology } from "@bmi/intouch-api-types";
import { FilterResult } from "../FilterResult";
import { SidePanel } from "../SidePanel";
import { GetProjectsQuery } from "../../graphql/generated/operations";
import { getProjectStatus, ProjectStatus } from "../../lib/utils/project";
import { PitchIcon, FlatIcon, OtherIcon } from "../icons";

// filter `attr` value
const INITIAL_FILTER_SELECTION = "ALL";
const getProjectFilters = (t) => [
  { label: t("filters.labels.ALL"), attr: "ALL" },
  { label: t("filters.labels.NOT_STARTED"), attr: ProjectStatus.NOT_STARTED },
  { label: t("filters.labels.IN_PROGRESS"), attr: ProjectStatus.IN_PROGRESS },
  { label: t("filters.labels.COMPLETED"), attr: ProjectStatus.COMPLETED },
  { label: t("filters.labels.FLAT"), attr: "FLAT" },
  { label: t("filters.labels.PITCHED"), attr: "PITCHED" }
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
  selectedProjectId?: number;
};
export const ProjectSidePanel = ({
  projects,
  onProjectSelected,
  selectedProjectId
}: ProjectSidePanelProps) => {
  const { t } = useTranslation("project-page");
  const [filterSelection, setFilterSelection] = useState<string>(
    INITIAL_FILTER_SELECTION
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterChange = ({ attr }) => {
    setFilterSelection(attr);
  };

  const projectFilters = useMemo(() => getProjectFilters(t), [t]);
  const filterOptions = useMemo(() => {
    return projectFilters.map((filter) => ({
      ...filter,
      isActive: filter.attr === filterSelection
    }));
  }, [projectFilters, filterSelection]);

  const filteredProjects = useMemo(() => {
    return projects.filter(
      ({ name, technology, siteAddress, startDate, endDate }) => {
        const knownStatuses = Object.values(ProjectStatus).map((value) =>
          value.toString()
        );
        const matchesFilter =
          filterSelection === "ALL" ||
          (knownStatuses.includes(filterSelection)
            ? getProjectStatus(startDate, endDate) === filterSelection
            : technology === filterSelection);

        const data = [
          name,
          siteAddress.town,
          // NOTE: Postcode can match with or without space
          siteAddress.postcode,
          siteAddress.postcode.replace(/\s*/g, "")
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery = data.includes(query);

        return matchesFilter && matchesQuery;
      }
    );
  }, [projects, searchQuery, filterSelection]);

  return (
    <SidePanel
      searchLabel={t("search.inputLabel")}
      filters={filterOptions}
      filterClick={handleFilterChange}
      onSearchFilterChange={(query: string) => {
        setSearchQuery(query);
      }}
    >
      {filteredProjects.map(
        ({ id, name, siteAddress, technology, startDate, endDate }) => (
          <FilterResult
            label={name}
            key={id}
            isSelected={selectedProjectId === id}
            onClick={() => {
              onProjectSelected && onProjectSelected(id);
            }}
          >
            <Typography>
              {[siteAddress?.town, siteAddress?.postcode]
                .filter(Boolean)
                .join(", ")}
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
