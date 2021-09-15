import React, { useState, useMemo } from "react";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import { useTranslation } from "next-i18next";
import { SvgIcon } from "@material-ui/core";
import { Technology } from "@bmi/intouch-api-types";
import { FilterResult } from "../FilterResult";
import { SidePanel } from "../SidePanel";
import { NewProjectDialog } from "../Pages/Project/CreateProject/Dialog";
import { useAccountContext } from "../../context/AccountContext";
import { findAccountCompany, isSuperOrMarketAdmin } from "../../lib/account";
import { GetProjectsQuery } from "../../graphql/generated/operations";
import { getProjectStatus, ProjectStatus } from "../../lib/utils/project";
import { PitchIcon, FlatIcon, OtherIcon } from "../icons";
import styles from "./styles.module.scss";

// filter `attr` value
const INITIAL_FILTER_SELECTION = "ALL";
const getProjectFilters = (t, isPowerfulUser: boolean) => {
  const technologyFilters = [
    { label: t("filters.labels.FLAT"), attr: "FLAT" },
    { label: t("filters.labels.PITCHED"), attr: "PITCHED" }
  ];
  const adminFilter = [
    { label: t("filters.labels.ALL"), attr: "ALL" },
    {
      label: t("filters.labels.UNASSIGNED"),
      attr: "UNASSIGNED"
    },
    {
      label: t("filters.labels.ASSIGNED"),
      attr: "ASSIGNED"
    },
    { label: t("filters.labels.MY_QUEUE"), attr: "MY_QUEUE" }
  ];
  const userFilter = [
    { label: t("filters.labels.ALL"), attr: "ALL" },
    {
      label: t("filters.labels.NOT_STARTED"),
      attr: ProjectStatus.NOT_STARTED
    },
    {
      label: t("filters.labels.IN_PROGRESS"),
      attr: ProjectStatus.IN_PROGRESS
    },
    {
      label: t("filters.labels.COMPLETED"),
      attr: ProjectStatus.COMPLETED
    }
  ];

  return isPowerfulUser
    ? [...adminFilter, ...technologyFilters]
    : [...userFilter, ...technologyFilters];
};

const technologyIcon: {
  [K in Technology]: React.FC<React.SVGProps<SVGSVGElement>>;
} = {
  FLAT: FlatIcon,
  PITCHED: PitchIcon,
  OTHER: OtherIcon
};

const ProjectSidePanelFooter = () => {
  const { t } = useTranslation("project-page");
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const { account } = useAccountContext();
  const currentCompany = useMemo(() => findAccountCompany(account), [account]);

  const handleOnNewProject = () => {
    setIsNewProjectDialogOpen(true);
  };

  const handleOnDialogClose = () => {
    setIsNewProjectDialogOpen(false);
  };

  if (!currentCompany) {
    return null;
  }

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOnNewProject}
        className={styles.footerActionButton}
      >
        {t("addProject.cta")}
      </Button>
      <NewProjectDialog
        companyId={currentCompany.id}
        isOpen={isNewProjectDialogOpen}
        onCloseClick={handleOnDialogClose}
        onCompleted={handleOnDialogClose}
      />
    </>
  );
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
  const { account } = useAccountContext();

  const isPowerfulUser = isSuperOrMarketAdmin(account);

  const [filterSelection, setFilterSelection] = useState<string>(
    isPowerfulUser ? "UNASSIGNED" : INITIAL_FILTER_SELECTION
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterChange = ({ attr }) => {
    setFilterSelection(attr);
  };

  const projectFilters = useMemo(
    () => getProjectFilters(t, isPowerfulUser),
    [t]
  );
  const filterOptions = useMemo(() => {
    return projectFilters.map((filter) => ({
      ...filter,
      isActive: filter.attr === filterSelection
    }));
  }, [projectFilters, filterSelection]);

  const guaranteeFilter = (
    guarantees: GetProjectsQuery["projects"]["nodes"][0]["guarantees"]["nodes"],
    filter: string
  ) => {
    const solutionGuarantee =
      guarantees.find(
        (node) => node.coverage === "SOLUTION" && node.status === "REVIEW"
      ) || null;

    if (solutionGuarantee !== null) {
      if (filter === "UNASSIGNED") {
        return solutionGuarantee.reviewerAccountId === null;
      }
      if (filter === "ASSIGNED") {
        return solutionGuarantee.reviewerAccountId !== null;
      }
      if (filter === "MY_QUEUE") {
        return solutionGuarantee.reviewerAccountId === account.id;
      }
    }
    return false;
  };
  const techologyMap: Record<Technology, boolean> = {
    FLAT: true,
    PITCHED: true,
    OTHER: true
  };
  const technologyStatus = Object.keys(techologyMap);

  const filteredProjects = useMemo(() => {
    return projects.filter(
      ({
        name,
        technology,
        siteAddress,
        startDate,
        endDate,
        company,
        guarantees
      }) => {
        const knownStatuses = Object.values(ProjectStatus).map((value) =>
          value.toString()
        );

        const matchesFilter =
          filterSelection === "ALL" ||
          (knownStatuses.includes(filterSelection)
            ? getProjectStatus(startDate, endDate) === filterSelection
            : technologyStatus.includes(filterSelection)
            ? technology === filterSelection
            : guaranteeFilter(guarantees.nodes, filterSelection));

        const data = isPowerfulUser
          ? [name, company.name]
          : [
              name,
              siteAddress.town,
              // NOTE: Postcode can match with or without space
              siteAddress.postcode,
              siteAddress.postcode.replace(/\s*/g, "")
            ];

        const query = searchQuery.toLowerCase().trim();
        const matchesQuery = data
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);

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
      renderFooter={() => <ProjectSidePanelFooter />}
    >
      {filteredProjects.map(
        ({
          id,
          name,
          siteAddress,
          technology,
          startDate,
          endDate,
          company
        }) => {
          const filterResultBody = isPowerfulUser
            ? company.name
            : [siteAddress?.town, siteAddress?.postcode]
                .filter(Boolean)
                .join(", ");

          return (
            <FilterResult
              label={name}
              key={id}
              isSelected={selectedProjectId === id}
              onClick={() => {
                onProjectSelected && onProjectSelected(id);
              }}
            >
              <Typography>{filterResultBody}</Typography>
              <Typography style={{ display: "flex" }}>
                <SvgIcon component={technologyIcon[technology as Technology]} />
                {t(getProjectStatus(startDate, endDate))}
              </Typography>
            </FilterResult>
          );
        }
      )}
    </SidePanel>
  );
};
