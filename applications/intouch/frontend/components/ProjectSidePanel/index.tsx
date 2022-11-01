import {
  FlatRoof,
  Icon,
  PitchedRoof,
  Typography
} from "@bmi-digital/components";
import { Technology } from "@bmi/intouch-api-types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useAccountContext } from "../../context/AccountContext";
import { GetProjectsQuery } from "../../graphql/generated/operations";
import { isSuperOrMarketAdmin } from "../../lib/account";
import { getProjectStatus, ProjectStatus } from "../../lib/utils/project";
import { FilterResult } from "../FilterResult";
import { SidePanel } from "../SidePanel";
import SidePanelFooter from "./SidePanelFooter";
import styles from "./styles.module.scss";

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
    { label: t("filters.labels.MY_QUEUE"), attr: "MY_QUEUE" },
    { label: t("filters.labels.ARCHIVED"), attr: "ARCHIVED" }
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
  [K in Exclude<Technology, "OTHER">]: React.FC<React.SVGProps<SVGSVGElement>>;
} = {
  FLAT: FlatRoof,
  PITCHED: PitchedRoof
};

type ProjectSidePanelProps = {
  projects: GetProjectsQuery["projectsByMarket"]["nodes"];
  onProjectSelected?: (projectId: number) => void;
  selectedProjectId?: number;
};

export const ProjectSidePanel = ({
  projects,
  onProjectSelected,
  selectedProjectId
}: ProjectSidePanelProps) => {
  const router = useRouter();
  const { t } = useTranslation("project-page");
  const { account } = useAccountContext();

  const isPowerfulUser = isSuperOrMarketAdmin(account);
  const defaultFilterSelection = isPowerfulUser ? "UNASSIGNED" : "ALL";
  const [filterSelection, setFilterSelection] = useState<string>(
    defaultFilterSelection
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
    guarantees: GetProjectsQuery["projectsByMarket"]["nodes"][0]["guarantees"]["nodes"],
    filter: string
  ) => {
    const solutionGuarantee =
      guarantees.find((node) => node.coverage === "SOLUTION") || null;

    if (solutionGuarantee !== null) {
      if (filter === "UNASSIGNED") {
        return (
          solutionGuarantee.status === "SUBMITTED" &&
          solutionGuarantee.reviewerAccountId === null
        );
      }
      if (filter === "ASSIGNED") {
        return (
          solutionGuarantee.status === "REVIEW" &&
          solutionGuarantee.reviewerAccountId !== null
        );
      }
      if (filter === "MY_QUEUE") {
        return (
          solutionGuarantee.status === "REVIEW" &&
          solutionGuarantee.reviewerAccountId === account.id
        );
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
        guarantees,
        buildingOwnerFirstname,
        buildingOwnerLastname,
        buildingOwnerCompany,
        buildingOwnerMail,
        hidden
      }) => {
        const knownStatuses = Object.values(ProjectStatus).map((value) =>
          value.toString()
        );

        // Check for status and guarantee selections.
        const notAll =
          !hidden &&
          (knownStatuses.includes(filterSelection)
            ? getProjectStatus(startDate, endDate) === filterSelection
            : technologyStatus.includes(filterSelection)
            ? technology === filterSelection
            : guaranteeFilter(guarantees.nodes, filterSelection));

        // Check for archived status selection.
        const archivedSelection = filterSelection === "ARCHIVED" && hidden;

        const matchesFilter =
          filterSelection === "ALL" || notAll || archivedSelection;

        const data = isPowerfulUser
          ? [name, company?.name]
          : [
              name,
              siteAddress?.town,
              // NOTE: Postcode can match with or without space
              siteAddress?.postcode,
              siteAddress?.postcode.replace(/\s*/g, ""),
              buildingOwnerFirstname,
              buildingOwnerLastname,
              buildingOwnerCompany,
              buildingOwnerMail
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

  const guaranteeLength = useMemo(() => {
    return projects.reduce(
      (sum, { guarantees }) => sum + guarantees.nodes.length || 0,
      0
    );
  }, [projects]);

  useEffect(() => {
    if (!router.query.project) {
      if (filterSelection !== defaultFilterSelection) {
        setFilterSelection(defaultFilterSelection);
      }
    }
  }, [router.query]);

  useEffect(() => {
    if (
      !router.query.project &&
      filteredProjects.length &&
      filterSelection === defaultFilterSelection
    ) {
      onProjectSelected(filteredProjects[0].id);
    }
  }, [router.query, filterSelection]);

  return (
    <SidePanel
      searchLabel={t("search.inputLabel")}
      filters={filterOptions}
      filterClick={handleFilterChange}
      onSearchFilterChange={(query: string) => {
        setSearchQuery(query);
      }}
      renderFooter={() => (
        <SidePanelFooter
          projectLength={projects.length}
          guaranteeLength={guaranteeLength}
        />
      )}
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
            ? company?.name
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
              testId={"projectCard"}
            >
              <Typography>{filterResultBody}</Typography>
              <Typography style={{ display: "flex" }}>
                <Icon
                  source={technologyIcon[technology as Technology]}
                  className={styles.technologyIcon}
                />
                {t(getProjectStatus(startDate, endDate))}
              </Typography>
            </FilterResult>
          );
        }
      )}
    </SidePanel>
  );
};
