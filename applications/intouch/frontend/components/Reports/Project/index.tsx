import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { Button } from "@bmi/components";
import { gql } from "@apollo/client";
import { GetApp } from "@material-ui/icons";
import { exportCsv } from "../../../lib/utils/report";
import { useGetProjectsReportLazyQuery } from "../../../graphql/generated/hooks";
import { GetProjectsReportQuery } from "../../../graphql/generated/operations";
import { getProjectStatus } from "../../../lib/utils/project";
import { useMarketContext } from "../../../context/MarketContext";
import { ReportProps } from "../types";
import { isSuperOrMarketAdmin } from "../../../lib/account";
import { useAccountContext } from "../../../context/AccountContext";
import styles from "./styles.module.scss";

const getReportData = (
  projects: GetProjectsReportQuery["projectsByMarket"],
  t
) => {
  return [...projects.nodes]
    .map((project) => {
      const {
        __typename,
        siteAddress,
        company,
        guarantees,
        projectMembers,
        hidden,
        ...rest
      } = project;

      const siteAddressTown = [siteAddress?.town, siteAddress?.country]
        .filter(Boolean)
        .join(" ");

      const companyName = company?.name;
      const companyStatus = company?.status;

      const guaranteeTypeName = guarantees?.nodes[0]?.guaranteeType?.name || "";

      const projectStatus = t(
        getProjectStatus(project.startDate, project.endDate)
      );

      const projectMember = projectMembers.nodes
        .map((member) => member.account.email)
        .join();

      return {
        ...rest,
        archived: hidden,
        siteAddressTown,
        companyName,
        companyStatus,
        guaranteeTypeName,
        projectStatus,
        projectMember
      };
    })
    .sort(
      ({ updatedAt: firstDate }, { updatedAt: secondDate }) =>
        new Date(secondDate).getTime() - new Date(firstDate).getTime()
    );
};

const getNonSuperUserReportData = (
  projects: GetProjectsReportQuery["projectsByMarket"],
  t
) => {
  return [...projects.nodes]
    .map((project) => {
      const {
        __typename,
        id,
        siteAddress,
        company,
        guarantees,
        projectMembers,
        hidden,
        ...rest
      } = project;

      const siteAddressTown = [siteAddress?.town, siteAddress?.country]
        .filter(Boolean)
        .join(" ");

      const companyName = company?.name;

      const guaranteeTypeName = guarantees?.nodes[0]?.guaranteeType?.name || "";

      const projectStatus = t(
        getProjectStatus(project.startDate, project.endDate)
      );

      const projectMember = projectMembers.nodes
        .map((member) => member.account.email)
        .join();

      return {
        ...rest,
        siteAddressTown,
        companyName,
        guaranteeTypeName,
        projectStatus,
        projectMember
      };
    })
    .sort(
      ({ updatedAt: firstDate }, { updatedAt: secondDate }) =>
        new Date(secondDate).getTime() - new Date(firstDate).getTime()
    );
};

const ProjectReport = ({ disabled }: ReportProps) => {
  const { t } = useTranslation("project-page");
  const { market } = useMarketContext();
  const { account } = useAccountContext();

  const [getSystemsReport] = useGetProjectsReportLazyQuery({
    variables: {
      market: market.id
    },
    onCompleted: ({ projectsByMarket }) => {
      const data = isSuperOrMarketAdmin(account)
        ? getReportData(projectsByMarket, t)
        : getNonSuperUserReportData(projectsByMarket, t);

      exportCsv(data, {
        filename: `projects-${Date.now()}`,
        title: "Projects"
      });
    }
  });

  const downloadReport = useCallback(() => {
    getSystemsReport();
  }, [getSystemsReport]);

  return (
    <div>
      <Button
        color="primary"
        data-testid="export-button"
        disabled={disabled}
        endIcon={<GetApp />}
        onClick={downloadReport}
        className={styles.sidePanelFooterButton}
      >
        {t("report.project")}
      </Button>
    </div>
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
            guaranteeReferenceCode
            guaranteeType {
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
