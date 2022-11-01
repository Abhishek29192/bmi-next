import { gql } from "@apollo/client";
import { Button } from "@bmi-digital/components";
import { GetApp } from "@material-ui/icons";
import { useTranslation } from "next-i18next";
import React, { useCallback, useState } from "react";
import { useMarketContext } from "../../../context/MarketContext";
import { useGetGuaranteesReportLazyQuery } from "../../../graphql/generated/hooks";
import { GetGuaranteesReportQuery } from "../../../graphql/generated/operations";
import { exportCsv } from "../../../lib/utils/report";
import { ReportProps } from "../types";

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

    const { name: guaranteeTypeName } = guaranteeType || {};
    const productName = productByProductBmiRef?.name;
    const systemName = systemBySystemBmiRef?.name;
    const maximumValidityYears =
      productByProductBmiRef?.maximumValidityYears ||
      systemBySystemBmiRef?.maximumValidityYears;
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
      Archived: project.hidden,
      "Annual Inspection": project.inspection
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
    <Button
      variant="outlined"
      data-testid="export-guarantee-report-button"
      disabled={disabled}
      endIcon={<GetApp />}
      onClick={downloadReport}
      fullWidth
    >
      {t("report.guarantee")}
    </Button>
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
          inspection
        }
        requestorAccountId
        requestorAccount {
          firstName
          lastName
        }
        coverage
        status
        languageCode
        guaranteeType {
          name
        }
        startDate
        expiryDate
        fileStorageId
        systemBySystemBmiRef {
          name
          maximumValidityYears
        }
        productByProductBmiRef {
          name
          maximumValidityYears
        }
      }
    }
  }
`;
