import React, { useCallback, useState } from "react";
import { useTranslation } from "next-i18next";
import { Button } from "@bmi/components";
import { gql } from "@apollo/client";
import { GetApp } from "@material-ui/icons";
import dayjs from "dayjs";
import { exportCsv } from "../../../lib/utils/report";
import { useGetEvidenceItemsReportLazyQuery } from "../../../graphql/generated/hooks";
import { GetEvidenceItemsReportQuery } from "../../../graphql/generated/operations";
import { useMarketContext } from "../../../context/MarketContext";
import { ReportProps } from "../types";
import { getFileExtension } from "../../../lib/utils";

export const getReportData = (
  evidenceItems: GetEvidenceItemsReportQuery["evidenceItemsByMarket"],
  t
) => {
  return [...evidenceItems.nodes].map(
    ({
      project,
      evidenceCategoryType,
      name,
      guarantee,
      uploaderAccount,
      createdAt
    }) => {
      const fileObject = getFileExtension(name);
      const userName =
        uploaderAccount && uploaderAccount.lastName && uploaderAccount.firstName
          ? `${uploaderAccount.firstName} ${uploaderAccount.lastName}`
          : "";
      return {
        "Project Name": project.name,
        "Company Name": project.company.name,
        "Company Tier": project.company.tier,
        "Upload Type": t(evidenceCategoryType),
        "File Type": fileObject.extension.toUpperCase(),
        "File Name": fileObject.name,
        "Project Roof area(m2)": project.roofArea,
        "Guarantee Type": guarantee?.coverage || "NOT REQUESTED",
        "User Name": userName,
        "User Email": uploaderAccount?.email || "",
        "Upload Date": dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")
      };
    }
  );
};

const ProjectReport = ({ disabled }: ReportProps) => {
  const { t } = useTranslation("project-page");
  const { market } = useMarketContext();
  // const { account } = useAccountContext();
  const [isReportGenerated, setIsReportGenerated] = useState(false);

  const [getSystemsReport] = useGetEvidenceItemsReportLazyQuery({
    variables: {
      market: market.id
    },
    onCompleted: ({ evidenceItemsByMarket }) => {
      if (!isReportGenerated) {
        const data = getReportData(evidenceItemsByMarket, t);

        exportCsv(data, {
          filename: `project-uploads-${Date.now()}`,
          title: "Project Uploads"
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
      data-testid="export-upload-report-button"
      disabled={disabled}
      endIcon={<GetApp />}
      onClick={downloadReport}
      variant={"outlined"}
      fullWidth
    >
      {t("report.projectUpload")}
    </Button>
  );
};

export default ProjectReport;

export const GET_EVIDENCE_ITEMS_REPORT = gql`
  query GetEvidenceItemsReport($market: Int!) {
    evidenceItemsByMarket(market: $market) {
      nodes {
        evidenceCategoryType
        name
        uploaderAccountId
        createdAt
        project {
          name
          company {
            name
            tier
          }
          roofArea
        }
        guarantee {
          coverage
        }
        uploaderAccount {
          lastName
          firstName
          email
        }
      }
    }
  }
`;
