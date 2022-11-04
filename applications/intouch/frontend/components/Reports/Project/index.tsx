import React, { useCallback, useState } from "react";
import { useTranslation } from "next-i18next";
import { Button } from "@bmi/components";
import { gql } from "@apollo/client";
import { GetApp } from "@material-ui/icons";
import { Project } from "@bmi/intouch-api-types";
import { exportCsv } from "../../../lib/utils/report";
import { useGetProjectsReportLazyQuery } from "../../../graphql/generated/hooks";
import { GetProjectsReportQuery } from "../../../graphql/generated/operations";
import {
  getProjectStatus,
  getProjectGuaranteeStatus
} from "../../../lib/utils/project";
import { useMarketContext } from "../../../context/MarketContext";
import { ReportProps } from "../types";
import { isSuperOrMarketAdmin } from "../../../lib/account";
import { useAccountContext } from "../../../context/AccountContext";

const projectStatusMap = {
  "filters.labels.NOT_STARTED": "NOT_STARTED",
  "filters.labels.IN_PROGRESS": "IN_PROGRESS",
  "filters.labels.COMPLETED": "COMPLETED"
};

const getReportData = (
  projects: GetProjectsReportQuery["projectsByMarket"],
  t
) => {
  return [...projects.nodes]
    .map((project: Project) => {
      const { siteAddress, company, guarantees, projectMembers, hidden } =
        project;

      const siteAddressTown = [siteAddress?.town, siteAddress?.country]
        .filter(Boolean)
        .join(" ");

      const companyName = company?.name;
      const companyStatus = company?.status;

      const guaranteeTypeName =
        guarantees?.nodes[0]?.guaranteeType?.name || "N/A";
      const guaranteeStatus = t(
        `guarantee.status.${getProjectGuaranteeStatus(project)}`
      );

      const projectStatus = getProjectStatus(
        project.startDate,
        project.endDate
      );

      const projectMember = projectMembers.nodes
        .map((member) => member.account.email)
        .join();

      return {
        Id: project.id,
        Name: project.name,
        Technology: project.technology,
        "Roof Area": project.roofArea,
        "Building Owner First Name": project.buildingOwnerFirstname || "",
        "Building Owner Last Name": project.buildingOwnerLastname || "",
        "Project Start Date": project.startDate,
        "Project End Date": project.endDate,
        Archived: hidden,
        "Created Date": project.createdAt,
        "Last Updated Date": project.updatedAt,
        "Site Address": siteAddressTown,
        "Company Name": companyName,
        "Company Status": companyStatus,
        "Guarantee Type Name": guaranteeTypeName,
        "Guarantee Status": guaranteeStatus,
        "Project Status": projectStatusMap[`${projectStatus}`],
        "Project Member": projectMember
      };
    })
    .sort(
      (
        { "Last Updated Date": firstDate },
        { "Last Updated Date": secondDate }
      ) => new Date(secondDate).getTime() - new Date(firstDate).getTime()
    );
};

const getNonSuperUserReportData = (
  projects: GetProjectsReportQuery["projectsByMarket"],
  t
) => {
  return [...projects.nodes]
    .map((project: Project) => {
      const { siteAddress, company, guarantees, projectMembers } = project;

      const siteAddressTown = [siteAddress?.town, siteAddress?.country]
        .filter(Boolean)
        .join(" ");

      const companyName = company?.name;

      const guaranteeTypeName =
        guarantees.nodes[0]?.guaranteeType?.name || "N/A";
      const guaranteeStatus = t(
        `guarantee.status.${getProjectGuaranteeStatus(project)}`
      );

      const projectStatus = getProjectStatus(
        project.startDate,
        project.endDate
      );

      const projectMember = projectMembers.nodes
        .map((member) => member.account.email)
        .join();

      return {
        Name: project.name,
        Technology: project.technology,
        "Roof Area": project.roofArea,
        "Building Owner First Name": project.buildingOwnerFirstname || "",
        "Building Owner Last Name": project.buildingOwnerLastname || "",
        "Building Owner Company Name": project.buildingOwnerCompany || "",
        "Project Start Date": project.startDate,
        "Project End Date": project.endDate,
        "Created Date": project.createdAt,
        "Last Updated Date": project.updatedAt,
        "Site Address": siteAddressTown,
        "Company Name": companyName,
        "Guarantee Type Name": guaranteeTypeName,
        "Guarantee Status": guaranteeStatus,
        "Project Status": projectStatusMap[`${projectStatus}`],
        "Project Member": projectMember
      };
    })
    .sort(
      (
        { "Last Updated Date": firstDate },
        { "Last Updated Date": secondDate }
      ) => new Date(secondDate).getTime() - new Date(firstDate).getTime()
    );
};

const ProjectReport = ({ disabled }: ReportProps) => {
  const { t } = useTranslation("project-page");
  const { market } = useMarketContext();
  const { account } = useAccountContext();
  const [isReportGenerated, setIsReportGenerated] = useState(false);

  const [getSystemsReport] = useGetProjectsReportLazyQuery({
    variables: {
      market: market.id
    },
    onCompleted: ({ projectsByMarket }) => {
      if (!isReportGenerated) {
        const data = isSuperOrMarketAdmin(account)
          ? getReportData(projectsByMarket, t)
          : getNonSuperUserReportData(projectsByMarket, t);

        exportCsv(data, {
          filename: `projects-${Date.now()}`,
          title: "Projects"
        });
        setIsReportGenerated(true);
      }
    }
  });

  const downloadReport = useCallback(
    (event) => {
      event.preventDefault();
      getSystemsReport();
    },
    [getSystemsReport]
  );

  return (
    <Button
      color="primary"
      data-testid="export-project-report-button"
      disabled={disabled}
      endIcon={<GetApp />}
      onClick={downloadReport}
      fullWidth
    >
      {t("report.project")}
    </Button>
  );
};

export default ProjectReport;

export const GET_PROJECTS_REPORT = gql`
  query GetProjectsReport($market: Int!) {
    projectsByMarket(market: $market) {
      nodes {
        id
        name
        siteAddress {
          ...AddressLinesFragment
        }
        company {
          name
          status
        }
        technology
        roofArea
        guarantees(first: 1) {
          nodes {
            id
            coverage
            languageCode
            status
            guaranteeType {
              tiersAvailable
              name
            }
            guaranteeTypes {
              items {
                name
              }
            }
          }
        }
        buildingOwnerFirstname
        buildingOwnerLastname
        buildingOwnerCompany
        startDate
        endDate
        hidden
        projectMembers {
          nodes {
            id
            account {
              email
            }
          }
        }
        createdAt
        updatedAt
      }
    }
  }
`;
