import React, { useCallback, useState } from "react";
import { useTranslation } from "next-i18next";
import { Button } from "@bmi/components";
import { gql } from "@apollo/client";
import { GetApp } from "@material-ui/icons";
import { exportCsv } from "../../../lib/utils/report";
import { useGetGuaranteesReportLazyQuery } from "../../../graphql/generated/hooks";
import { GetGuaranteesReportQuery } from "../../../graphql/generated/operations";
import { useMarketContext } from "../../../context/MarketContext";
import { ReportProps } from "../types";
import styles from "./styles.module.scss";

const getReportData = (
  guarantees: GetGuaranteesReportQuery["guaranteesByMarket"]
) => {
  return [...guarantees.nodes].map((company) => {
    const {
      project,
      guaranteeType,
      systemBySystemBmiRef,
      productByProductBmiRef,
      requestorAccount
    } = company;

    const {
      name: projectName,
      technology: projectTechnology,
      roofArea,
      company: { name: companyName }
    } = project;

    const { name: guaranteeTypeName, maximumValidityYears } =
      guaranteeType || {};
    const productName = productByProductBmiRef?.name;
    const systemName = systemBySystemBmiRef?.name;
    const requestorName = [
      requestorAccount?.firstName,
      requestorAccount?.lastName
    ]
      .filter(Boolean)
      .join(" ");
    return {
      Id: company.id,
      "BMI Reference Id": company.bmiReferenceId || "",
      "Requestor Account Id": requestorName,
      Coverage: company.coverage || "",
      "Guarantee Status": company.status || "",
      "Guarantee Start Date": company.startDate || "",
      "Guarantee Expiry Date": company.expiryDate || "",
      "Signed File Storage URL": company.fileStorageId || "",
      "Project Name": projectName || "",
      "Project Technology": projectTechnology || "",
      "Project Roof Area": roofArea || "",
      "Company Name": companyName || "",
      "Guarantee Type Name": guaranteeTypeName || "",
      "Maximum Validity Years": maximumValidityYears || "",
      "Product Name": productName || "",
      "System Name": systemName || "",
      Archived: project.hidden
    };
  });
};

const GuaranteeReport = ({ disabled }: ReportProps) => {
  const { t } = useTranslation("project-page");
  const { market } = useMarketContext();
  const [isReportGenerated, setIsReportGenerated] = useState(false);

  const [getSystemsReport] = useGetGuaranteesReportLazyQuery({
    variables: {
      market: market.id
    },
    onCompleted: ({ guaranteesByMarket }) => {
      if (!isReportGenerated) {
        const data = getReportData(guaranteesByMarket);

        exportCsv(data, {
          filename: `guarantees-${Date.now()}`,
          title: "Guarantee"
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
    <div>
      <Button
        variant="outlined"
        data-testid="export-button"
        disabled={disabled}
        endIcon={<GetApp />}
        onClick={downloadReport}
        className={styles.sidePanelFooterButton}
      >
        {t("report.guarantee")}
      </Button>
    </div>
  );
};

export default GuaranteeReport;

export const GET_GUARANTEES_REPORT = gql`
  query GetGuaranteesReport($market: Int!) {
    guaranteesByMarket(market: $market) {
      nodes {
        id
        bmiReferenceId
        project {
          name
          technology
          roofArea
          company {
            name
          }
          hidden
        }
        requestorAccountId
        requestorAccount {
          firstName
          lastName
        }
        coverage
        status
        languageCode
        guaranteeReferenceCode
        guaranteeType {
          name
          maximumValidityYears
        }
        startDate
        expiryDate
        signedFileStorageUrl
        fileStorageId
        systemBySystemBmiRef {
          name
        }
        productByProductBmiRef {
          name
        }
      }
    }
  }
`;
